
package com.gstcompliance.gstinvoicesystem.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UncheckedIOException;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.gstcompliance.gstinvoicesystem.entity.Invoice;
import com.gstcompliance.gstinvoicesystem.entity.InvoiceIssue;
import com.gstcompliance.gstinvoicesystem.repository.InvoiceIssueRepository;
import com.gstcompliance.gstinvoicesystem.repository.InvoiceRepository;
import com.gstcompliance.gstinvoicesystem.validation.GstinValidator;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final InvoiceIssueRepository issueRepository;

    @Transactional(readOnly = true)
    public List<Invoice> findAll() {
        return invoiceRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<InvoiceIssue> findAllIssues() {
        return issueRepository.findAll();
    }

    @Transactional
    public int saveInvoicesFromCsv(MultipartFile file) {

        List<Invoice> invoices = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {

            reader.readLine(); // Skip header

            int rowNumber = 1;
            String line;

            while ((line = reader.readLine()) != null) {
                rowNumber++;

                if (line.isBlank()) {
                    continue;
                }

                invoices.add(parseRow(line, rowNumber));
            }

        } catch (IOException e) {
            throw new UncheckedIOException("Could not read uploaded file", e);
        }

        // Save invoices first to generate IDs
        List<Invoice> saved = invoiceRepository.saveAll(invoices);

        List<InvoiceIssue> issues = new ArrayList<>();

        for (Invoice inv : saved) {

            // GSTIN validation
            flagGstin(issues, inv, "Seller", inv.getSellerGstin());
            flagGstin(issues, inv, "Buyer", inv.getBuyerGstin());

            // GST tax validation
            flagTaxIssues(issues, inv);

            // Duplicate invoice detection
            long count = invoiceRepository
                    .countByInvoiceNumberAndSellerGstinAndInvoiceDateAndTaxableValue(
                            inv.getInvoiceNumber(),
                            inv.getSellerGstin(),
                            inv.getInvoiceDate(),
                            inv.getTaxableValue()
                    );

            if (count > 1) {
                createIssue(
                        issues,
                        inv,
                        "DUPLICATE_INVOICE",
                        "HIGH",
                        "Duplicate invoice detected."
                );
            }

            // Calculate risk level
            inv.setRiskLevel(calculateRiskLevel(inv, issues));
        }

        // Save updated risk levels and detected issues
        invoiceRepository.saveAll(saved);
        issueRepository.saveAll(issues);

        return saved.size();
    }

    // GSTIN validation
    private void flagGstin(
            List<InvoiceIssue> issues,
            Invoice inv,
            String party,
            String gstin) {

        GstinValidator.validate(gstin).ifPresent(f -> {

            createIssue(
                    issues,
                    inv,
                    f.ruleCode(),
                    "ERROR",
                    party + " GSTIN: " + f.message()
            );

        });
    }

    // GST tax validation
    private void flagTaxIssues(List<InvoiceIssue> issues, Invoice inv) {

        BigDecimal cgst = inv.getCgstAmount();
        BigDecimal sgst = inv.getSgstAmount();
        BigDecimal igst = inv.getIgstAmount();

        // Intra-state transaction
        if (inv.getSellerStateCode().equals(inv.getBuyerStateCode())) {

            if (igst.compareTo(BigDecimal.ZERO) != 0) {

                createIssue(
                        issues,
                        inv,
                        "INVALID_TAX_TYPE",
                        "ERROR",
                        "Intra-state transaction should not have IGST."
                );
            }

        } else {

            // Inter-state transaction
            if (cgst.compareTo(BigDecimal.ZERO) != 0 ||
                    sgst.compareTo(BigDecimal.ZERO) != 0) {

                createIssue(
                        issues,
                        inv,
                        "INVALID_TAX_TYPE",
                        "ERROR",
                        "Inter-state transaction should not have CGST or SGST."
                );
            }
        }

        // Total invoice value validation
        BigDecimal expectedTotal = inv.getTaxableValue()
                .add(cgst)
                .add(sgst)
                .add(igst);

        if (expectedTotal.compareTo(inv.getTotalInvoiceValue()) != 0) {

            createIssue(
                    issues,
                    inv,
                    "TOTAL_MISMATCH",
                    "ERROR",
                    "Total invoice value does not match the calculated amount."
            );
        }
    }

    // Risk classification
    private String calculateRiskLevel(
            Invoice inv,
            List<InvoiceIssue> issues) {

        boolean hasIssue = false;

        for (InvoiceIssue issue : issues) {

            if (issue.getInvoiceId().equals(inv.getId())) {

                hasIssue = true;

                if (issue.getRuleCode().equals("DUPLICATE_INVOICE")
                        || issue.getRuleCode().equals("INVALID_TAX_TYPE")
                        || issue.getRuleCode().equals("TOTAL_MISMATCH")) {

                    return "HIGH";
                }
            }
        }

        return hasIssue ? "MEDIUM" : "LOW";
    }

    // Common method to create invoice issues
    private void createIssue(
            List<InvoiceIssue> issues,
            Invoice inv,
            String ruleCode,
            String severity,
            String message) {

        InvoiceIssue issue = new InvoiceIssue();

        issue.setInvoiceId(inv.getId());
        issue.setRuleCode(ruleCode);
        issue.setSeverity(severity);
        issue.setMessage(message);

        issues.add(issue);
    }

    // CSV row parsing
    private Invoice parseRow(String line, int rowNumber) {

        String[] fields = line.split(",", -1);

        if (fields.length != 11) {
            throw new IllegalArgumentException(
                    "Row " + rowNumber + ": expected 11 columns but found " + fields.length
            );
        }

        try {

            Invoice inv = new Invoice();

            inv.setInvoiceNumber(fields[0].trim());
            inv.setInvoiceDate(LocalDate.parse(fields[1].trim()));

            inv.setSellerGstin(fields[2].trim());
            inv.setBuyerGstin(fields[3].trim());

            inv.setSellerStateCode(fields[4].trim());
            inv.setBuyerStateCode(fields[5].trim());

            inv.setTaxableValue(new BigDecimal(fields[6].trim()));

            inv.setCgstAmount(new BigDecimal(fields[7].trim()));
            inv.setSgstAmount(new BigDecimal(fields[8].trim()));
            inv.setIgstAmount(new BigDecimal(fields[9].trim()));

            inv.setTotalInvoiceValue(new BigDecimal(fields[10].trim()));

            return inv;

        } catch (RuntimeException e) {

            throw new IllegalArgumentException(
                    "Row " + rowNumber + ": invalid value (" + e.getMessage() + ")"
            );
        }
    }
public String exportInvoicesToCsv() {

    List<Invoice> invoices = invoiceRepository.findAll();

    StringBuilder csv = new StringBuilder();

    csv.append("Invoice Number,Invoice Date,Seller GSTIN,Buyer GSTIN,")
       .append("Seller State,Buyer State,Taxable Value,CGST,SGST,")
       .append("IGST,Total Invoice Value,Risk Level\n");

    for (Invoice inv : invoices) {

        csv.append(inv.getInvoiceNumber()).append(",")
           .append(inv.getInvoiceDate()).append(",")
           .append(inv.getSellerGstin()).append(",")
           .append(inv.getBuyerGstin()).append(",")
           .append(inv.getSellerStateCode()).append(",")
           .append(inv.getBuyerStateCode()).append(",")
           .append(inv.getTaxableValue()).append(",")
           .append(inv.getCgstAmount()).append(",")
           .append(inv.getSgstAmount()).append(",")
           .append(inv.getIgstAmount()).append(",")
           .append(inv.getTotalInvoiceValue()).append(",")
           .append(inv.getRiskLevel()).append("\n");
    }

    return csv.toString();
}
}