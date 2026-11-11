
// package com.gstcompliance.gstinvoicesystem.service;

// import java.io.BufferedReader;
// import java.io.IOException;
// import java.io.InputStreamReader;
// import java.io.UncheckedIOException;
// import java.math.BigDecimal;
// import java.nio.charset.StandardCharsets;
// import java.time.LocalDate;
// import java.util.ArrayList;
// import java.util.List;

// import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;
// import org.springframework.web.multipart.MultipartFile;

// import com.gstcompliance.gstinvoicesystem.entity.Invoice;
// import com.gstcompliance.gstinvoicesystem.entity.InvoiceIssue;
// import com.gstcompliance.gstinvoicesystem.repository.InvoiceIssueRepository;
// import com.gstcompliance.gstinvoicesystem.repository.InvoiceRepository;
// import com.gstcompliance.gstinvoicesystem.validation.GstinValidator;

// import lombok.RequiredArgsConstructor;

// @Service
// @RequiredArgsConstructor
// public class InvoiceService {

//     private final InvoiceRepository invoiceRepository;
//     private final InvoiceIssueRepository issueRepository;

//     @Transactional(readOnly = true)
//     public List<Invoice> findAll() {
//         return invoiceRepository.findAll();
//     }

//     @Transactional(readOnly = true)
//     public List<InvoiceIssue> findAllIssues() {
//         return issueRepository.findAll();
//     }

//     // Upload CSV and save every invoice, including duplicates.
//     @Transactional
//     public int saveInvoicesFromCsv(MultipartFile file) {

//         List<Invoice> invoices = new ArrayList<>();

//         try (BufferedReader reader = new BufferedReader(
//                 new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {

//             int rowNumber = 0;
//             String line;

//             while ((line = reader.readLine()) != null) {
//                 rowNumber++;

//                 if (line.isBlank()) {
//                     continue;
//                 }

//                 if (rowNumber == 1
//                         && line.trim().toLowerCase().startsWith("invoice number,")) {
//                     continue;
//                 }

//                 invoices.add(parseRow(line, rowNumber));
//             }

//         } catch (IOException e) {
//             throw new UncheckedIOException(
//                     "Could not read uploaded file", e
//             );
//         }

//         List<Invoice> saved = invoiceRepository.saveAll(invoices);

//         List<InvoiceIssue> issues = new ArrayList<>();

//         for (Invoice inv : saved) {
//             analyseInvoice(inv, issues);
//         }

//         invoiceRepository.saveAll(saved);
//         issueRepository.saveAll(issues);

//         return saved.size();
//     }

//     // Recheck all existing invoices and rebuild their issue records.
//     @Transactional
//     public int revalidateAll() {

//         List<Invoice> invoices = invoiceRepository.findAll();

//         issueRepository.deleteAllInBatch();

//         List<InvoiceIssue> issues = new ArrayList<>();

//         for (Invoice inv : invoices) {
//             analyseInvoice(inv, issues);
//         }

//         invoiceRepository.saveAll(invoices);
//         issueRepository.saveAll(issues);

//         return invoices.size();
//     }

//     // Apply all validation rules to one invoice.
//     private void analyseInvoice(Invoice inv, List<InvoiceIssue> issues) {

//         flagMissingInvoiceNumber(issues, inv);

//         flagGstin(issues, inv, "Seller", inv.getSellerGstin());
//         flagGstin(issues, inv, "Buyer", inv.getBuyerGstin());

//         flagGstinStateMismatch(
//                 issues, inv, "Seller",
//                 inv.getSellerGstin(), inv.getSellerStateCode()
//         );

//         flagGstinStateMismatch(
//                 issues, inv, "Buyer",
//                 inv.getBuyerGstin(), inv.getBuyerStateCode()
//         );

//         flagTaxIssues(issues, inv);

//         flagNegativeAmounts(issues, inv);

//         boolean earlierDuplicate = invoiceRepository
//                 .existsByInvoiceNumberAndSellerGstinAndInvoiceDateAndTaxableValueAndIdLessThan(
//                         inv.getInvoiceNumber(),
//                         inv.getSellerGstin(),
//                         inv.getInvoiceDate(),
//                         inv.getTaxableValue(),
//                         inv.getId()
//                 );

//         if (earlierDuplicate) {
//             createIssue(
//                     issues,
//                     inv,
//                     "DUPLICATE_INVOICE",
//                     "HIGH",
//                     "Duplicate of an earlier invoice with the same number, seller, date and taxable value."
//             );
//         }

//         inv.setRiskLevel(calculateRiskLevel(inv, issues));
//     }

//     // Flag missing invoice number.
//     private void flagMissingInvoiceNumber(
//             List<InvoiceIssue> issues,
//             Invoice inv) {

//         if (inv.getInvoiceNumber() == null
//                 || inv.getInvoiceNumber().isBlank()) {

//             createIssue(
//                     issues,
//                     inv,
//                     "MISSING_INVOICE_NUMBER",
//                     "HIGH",
//                     "Invoice number is missing. Every invoice must have an invoice number."
//             );
//         }
//     }

//     // Every GSTIN validation failure produces HIGH risk.
//     private void flagGstin(
//             List<InvoiceIssue> issues,
//             Invoice inv,
//             String party,
//             String gstin) {

//         GstinValidator.validate(gstin).ifPresent(f ->
//                 createIssue(
//                         issues,
//                         inv,
//                         f.ruleCode(),
//                         "HIGH",
//                         party + " GSTIN: " + f.message()
//                 )
//         );
//     }

//     // Compare GSTIN digits with invoice state.
//     private void flagGstinStateMismatch(
//             List<InvoiceIssue> issues,
//             Invoice inv,
//             String party,
//             String gstin,
//             String stateCode) {

//         if (gstin == null || stateCode == null) {
//             return;
//         }

//         String cleanGstin = gstin.trim().toUpperCase();
//         String cleanState = stateCode.trim();

//         if (cleanGstin.length() == 15
//                 && cleanGstin.substring(0, 2).matches("[0-9]{2}")
//                 && !cleanGstin.substring(0, 2).equals(cleanState)) {

//             createIssue(
//                     issues,
//                     inv,
//                     "GSTIN_STATE_MISMATCH",
//                     "MEDIUM",
//                     party + " GSTIN state code does not match the invoice state code."
//             );
//         }
//     }

//     // GST tax validation.
//     private void flagTaxIssues(List<InvoiceIssue> issues, Invoice inv) {

//         BigDecimal cgst = valueOrZero(inv.getCgstAmount());
//         BigDecimal sgst = valueOrZero(inv.getSgstAmount());
//         BigDecimal igst = valueOrZero(inv.getIgstAmount());
//         BigDecimal taxableValue = valueOrZero(inv.getTaxableValue());

//         String sellerState = inv.getSellerStateCode();
//         String buyerState = inv.getBuyerStateCode();

//         if (sellerState != null && buyerState != null
//                 && !sellerState.isBlank() && !buyerState.isBlank()) {

//             if (sellerState.trim().equals(buyerState.trim())) {

//                 if (igst.compareTo(BigDecimal.ZERO) != 0) {
//                     createIssue(
//                             issues,
//                             inv,
//                             "INVALID_TAX_TYPE",
//                             "HIGH",
//                             "Intra-state transaction should not have IGST."
//                     );
//                 }

//                 if (cgst.compareTo(sgst) != 0) {
//                     createIssue(
//                             issues,
//                             inv,
//                             "CGST_SGST_UNEQUAL",
//                             "HIGH",
//                             "For an intra-state transaction, CGST and SGST amounts should be equal."
//                     );
//                 }

//             } else {

//                 if (cgst.compareTo(BigDecimal.ZERO) != 0
//                         || sgst.compareTo(BigDecimal.ZERO) != 0) {

//                     createIssue(
//                             issues,
//                             inv,
//                             "INVALID_TAX_TYPE",
//                             "HIGH",
//                             "Inter-state transaction should not have CGST or SGST."
//                     );
//                 }
//             }
//         }

//         BigDecimal expectedTotal = taxableValue
//                 .add(cgst)
//                 .add(sgst)
//                 .add(igst);

//         if (inv.getTotalInvoiceValue() == null
//                 || expectedTotal.compareTo(inv.getTotalInvoiceValue()) != 0) {

//             createIssue(
//                     issues,
//                     inv,
//                     "TOTAL_MISMATCH",
//                     "HIGH",
//                     "Total invoice value does not match the calculated amount."
//             );
//         }
//     }

//     // Flag negative invoice amounts.
//     private void flagNegativeAmounts(List<InvoiceIssue> issues, Invoice inv) {

//         boolean hasNegativeAmount =
//                 (inv.getTaxableValue() != null && inv.getTaxableValue().signum() < 0)
//                 || (inv.getCgstAmount() != null && inv.getCgstAmount().signum() < 0)
//                 || (inv.getSgstAmount() != null && inv.getSgstAmount().signum() < 0)
//                 || (inv.getIgstAmount() != null && inv.getIgstAmount().signum() < 0)
//                 || (inv.getTotalInvoiceValue() != null
//                         && inv.getTotalInvoiceValue().signum() < 0);

//         if (hasNegativeAmount) {
//             createIssue(
//                     issues,
//                     inv,
//                     "NEGATIVE_AMOUNT",
//                     "HIGH",
//                     "Invoice contains a negative amount. All invoice values must be zero or positive."
//             );
//         }
//     }

//     private BigDecimal valueOrZero(BigDecimal value) {
//         return value == null ? BigDecimal.ZERO : value;
//     }

//     // Calculate risk using only the issues belonging to this invoice.
//     private String calculateRiskLevel(
//             Invoice inv,
//             List<InvoiceIssue> issues) {

//         boolean hasMediumIssue = false;

//         for (InvoiceIssue issue : issues) {

//             if (issue.getInvoiceId().equals(inv.getId())) {

//                 if ("HIGH".equals(issue.getSeverity())) {
//                     return "HIGH";
//                 }

//                 if ("MEDIUM".equals(issue.getSeverity())) {
//                     hasMediumIssue = true;
//                 }
//             }
//         }

//         return hasMediumIssue ? "MEDIUM" : "LOW";
//     }

//     // Common method to create an invoice issue.
//     private void createIssue(
//             List<InvoiceIssue> issues,
//             Invoice inv,
//             String ruleCode,
//             String severity,
//             String message) {

//         InvoiceIssue issue = new InvoiceIssue();

//         issue.setInvoiceId(inv.getId());
//         issue.setRuleCode(ruleCode);
//         issue.setSeverity(severity);
//         issue.setMessage(message);

//         issues.add(issue);
//     }

//     // CSV row parsing.
//     private Invoice parseRow(String line, int rowNumber) {

//         String[] fields = line.split(",", -1);

//         if (fields.length != 11) {
//             throw new IllegalArgumentException(
//                     "Row " + rowNumber + ": expected 11 columns but found " + fields.length
//             );
//         }

//         try {

//             Invoice inv = new Invoice();

//             inv.setInvoiceNumber(fields[0].trim());
//             inv.setInvoiceDate(LocalDate.parse(fields[1].trim()));

//             inv.setSellerGstin(fields[2].trim());
//             inv.setBuyerGstin(fields[3].trim());

//             inv.setSellerStateCode(fields[4].trim());
//             inv.setBuyerStateCode(fields[5].trim());

//             inv.setTaxableValue(new BigDecimal(fields[6].trim()));
//             inv.setCgstAmount(new BigDecimal(fields[7].trim()));
//             inv.setSgstAmount(new BigDecimal(fields[8].trim()));
//             inv.setIgstAmount(new BigDecimal(fields[9].trim()));
//             inv.setTotalInvoiceValue(new BigDecimal(fields[10].trim()));

//             return inv;

//         } catch (RuntimeException e) {

//             throw new IllegalArgumentException(
//                     "Row " + rowNumber + ": invalid value (" + e.getMessage() + ")"
//             );
//         }
//     }

//     // Export invoices to CSV.
//     public String exportInvoicesToCsv() {

//         List<Invoice> invoices = invoiceRepository.findAll();

//         StringBuilder csv = new StringBuilder();

//         csv.append("Invoice Number,Invoice Date,Seller GSTIN,Buyer GSTIN,")
//            .append("Seller State,Buyer State,Taxable Value,CGST,SGST,")
//            .append("IGST,Total Invoice Value,Risk Level\n");

//         for (Invoice inv : invoices) {

//             csv.append(inv.getInvoiceNumber()).append(",")
//                .append(inv.getInvoiceDate()).append(",")
//                .append(inv.getSellerGstin()).append(",")
//                .append(inv.getBuyerGstin()).append(",")
//                .append(inv.getSellerStateCode()).append(",")
//                .append(inv.getBuyerStateCode()).append(",")
//                .append(inv.getTaxableValue()).append(",")
//                .append(inv.getCgstAmount()).append(",")
//                .append(inv.getSgstAmount()).append(",")
//                .append(inv.getIgstAmount()).append(",")
//                .append(inv.getTotalInvoiceValue()).append(",")
//                .append(inv.getRiskLevel()).append("\n");
//         }

//         return csv.toString();
//     }
// }


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

    // Upload CSV and save every invoice, including duplicates.
    @Transactional
    public int saveInvoicesFromCsv(MultipartFile file) {

        List<Invoice> invoices = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {

            int rowNumber = 0;
            String line;

            while ((line = reader.readLine()) != null) {
                rowNumber++;

                if (line.isBlank()) {
                    continue;
                }

                if (rowNumber == 1
                        && line.trim().toLowerCase().startsWith("invoice number,")) {
                    continue;
                }

                invoices.add(parseRow(line, rowNumber));
            }

        } catch (IOException e) {
            throw new UncheckedIOException(
                    "Could not read uploaded file", e
            );
        }

        List<Invoice> saved = invoiceRepository.saveAll(invoices);

        List<InvoiceIssue> issues = new ArrayList<>();

        for (Invoice inv : saved) {
            analyseInvoice(inv, issues);
        }

        invoiceRepository.saveAll(saved);
        issueRepository.saveAll(issues);

        return saved.size();
    }

    // Recheck all existing invoices and rebuild their issue records.
    @Transactional
    public int revalidateAll() {

        List<Invoice> invoices = invoiceRepository.findAll();

        issueRepository.deleteAllInBatch();

        List<InvoiceIssue> issues = new ArrayList<>();

        for (Invoice inv : invoices) {
            analyseInvoice(inv, issues);
        }

        invoiceRepository.saveAll(invoices);
        issueRepository.saveAll(issues);

        return invoices.size();
    }

    // Apply all validation rules to one invoice.
    private void analyseInvoice(Invoice inv, List<InvoiceIssue> issues) {

        flagMissingInvoiceNumber(issues, inv);
        flagMissingInvoiceDate(issues, inv);
        flagMissingTaxableValue(issues, inv);

        flagGstin(issues, inv, "Seller", inv.getSellerGstin());
        flagGstin(issues, inv, "Buyer", inv.getBuyerGstin());

        flagGstinStateMismatch(
                issues, inv, "Seller",
                inv.getSellerGstin(), inv.getSellerStateCode()
        );

        flagGstinStateMismatch(
                issues, inv, "Buyer",
                inv.getBuyerGstin(), inv.getBuyerStateCode()
        );

        flagTaxIssues(issues, inv);

        flagNegativeAmounts(issues, inv);

        // Check duplicates only when the required matching fields exist.
        boolean earlierDuplicate = false;

        if (inv.getInvoiceNumber() != null
                && !inv.getInvoiceNumber().isBlank()
                && inv.getSellerGstin() != null
                && !inv.getSellerGstin().isBlank()
                && inv.getInvoiceDate() != null
                && inv.getTaxableValue() != null) {

            earlierDuplicate = invoiceRepository
                    .existsByInvoiceNumberAndSellerGstinAndInvoiceDateAndTaxableValueAndIdLessThan(
                            inv.getInvoiceNumber(),
                            inv.getSellerGstin(),
                            inv.getInvoiceDate(),
                            inv.getTaxableValue(),
                            inv.getId()
                    );
        }

        if (earlierDuplicate) {
            createIssue(
                    issues,
                    inv,
                    "DUPLICATE_INVOICE",
                    "HIGH",
                    "Duplicate of an earlier invoice with the same number, seller, date and taxable value."
            );
        }

        inv.setRiskLevel(calculateRiskLevel(inv, issues));
    }

    // Missing invoice number.
    private void flagMissingInvoiceNumber(
            List<InvoiceIssue> issues,
            Invoice inv) {

        if (inv.getInvoiceNumber() == null
                || inv.getInvoiceNumber().isBlank()) {

            createIssue(
                    issues,
                    inv,
                    "MISSING_INVOICE_NUMBER",
                    "HIGH",
                    "Invoice number is missing. Every invoice must have an invoice number."
            );
        }
    }

    // Missing invoice date.
    private void flagMissingInvoiceDate(
            List<InvoiceIssue> issues,
            Invoice inv) {

        if (inv.getInvoiceDate() == null) {

            createIssue(
                    issues,
                    inv,
                    "MISSING_INVOICE_DATE",
                    "HIGH",
                    "Invoice date is missing. Every invoice must have an invoice date."
            );
        }
    }

    // Missing taxable value.
    private void flagMissingTaxableValue(
            List<InvoiceIssue> issues,
            Invoice inv) {

        if (inv.getTaxableValue() == null) {

            createIssue(
                    issues,
                    inv,
                    "MISSING_TAXABLE_VALUE",
                    "HIGH",
                    "Taxable value is missing from the invoice."
            );
        }
    }

    // GSTIN validation, including separate missing GSTIN rules.
    private void flagGstin(
            List<InvoiceIssue> issues,
            Invoice inv,
            String party,
            String gstin) {

        if (gstin == null || gstin.isBlank()) {

            String ruleCode = "Seller".equals(party)
                    ? "MISSING_SELLER_GSTIN"
                    : "MISSING_BUYER_GSTIN";

            createIssue(
                    issues,
                    inv,
                    ruleCode,
                    "HIGH",
                    party + " GSTIN is missing."
            );

            return;
        }

        GstinValidator.validate(gstin).ifPresent(f ->
                createIssue(
                        issues,
                        inv,
                        f.ruleCode(),
                        "HIGH",
                        party + " GSTIN: " + f.message()
                )
        );
    }

    // Compare GSTIN digits with invoice state.
    private void flagGstinStateMismatch(
            List<InvoiceIssue> issues,
            Invoice inv,
            String party,
            String gstin,
            String stateCode) {

        if (gstin == null || stateCode == null) {
            return;
        }

        String cleanGstin = gstin.trim().toUpperCase();
        String cleanState = stateCode.trim();

        if (cleanGstin.length() == 15
                && cleanGstin.substring(0, 2).matches("[0-9]{2}")
                && !cleanGstin.substring(0, 2).equals(cleanState)) {

            createIssue(
                    issues,
                    inv,
                    "GSTIN_STATE_MISMATCH",
                    "MEDIUM",
                    party + " GSTIN state code does not match the invoice state code."
            );
        }
    }

    // GST tax validation.
    private void flagTaxIssues(List<InvoiceIssue> issues, Invoice inv) {

        BigDecimal cgst = valueOrZero(inv.getCgstAmount());
        BigDecimal sgst = valueOrZero(inv.getSgstAmount());
        BigDecimal igst = valueOrZero(inv.getIgstAmount());
        BigDecimal taxableValue = valueOrZero(inv.getTaxableValue());

        String sellerState = inv.getSellerStateCode();
        String buyerState = inv.getBuyerStateCode();

        if (sellerState != null && buyerState != null
                && !sellerState.isBlank() && !buyerState.isBlank()) {

            if (sellerState.trim().equals(buyerState.trim())) {

                if (igst.compareTo(BigDecimal.ZERO) != 0) {
                    createIssue(
                            issues,
                            inv,
                            "INVALID_TAX_TYPE",
                            "HIGH",
                            "Intra-state transaction should not have IGST."
                    );
                }

                if (cgst.compareTo(sgst) != 0) {
                    createIssue(
                            issues,
                            inv,
                            "CGST_SGST_UNEQUAL",
                            "HIGH",
                            "For an intra-state transaction, CGST and SGST amounts should be equal."
                    );
                }

            } else {

                if (cgst.compareTo(BigDecimal.ZERO) != 0
                        || sgst.compareTo(BigDecimal.ZERO) != 0) {

                    createIssue(
                            issues,
                            inv,
                            "INVALID_TAX_TYPE",
                            "HIGH",
                            "Inter-state transaction should not have CGST or SGST."
                    );
                }
            }
        }

        BigDecimal expectedTotal = taxableValue
                .add(cgst)
                .add(sgst)
                .add(igst);

        if (inv.getTotalInvoiceValue() == null
                || expectedTotal.compareTo(inv.getTotalInvoiceValue()) != 0) {

            createIssue(
                    issues,
                    inv,
                    "TOTAL_MISMATCH",
                    "HIGH",
                    "Total invoice value does not match the calculated amount."
            );
        }
    }

    // Flag negative invoice amounts.
    private void flagNegativeAmounts(List<InvoiceIssue> issues, Invoice inv) {

        boolean hasNegativeAmount =
                (inv.getTaxableValue() != null && inv.getTaxableValue().signum() < 0)
                || (inv.getCgstAmount() != null && inv.getCgstAmount().signum() < 0)
                || (inv.getSgstAmount() != null && inv.getSgstAmount().signum() < 0)
                || (inv.getIgstAmount() != null && inv.getIgstAmount().signum() < 0)
                || (inv.getTotalInvoiceValue() != null
                        && inv.getTotalInvoiceValue().signum() < 0);

        if (hasNegativeAmount) {
            createIssue(
                    issues,
                    inv,
                    "NEGATIVE_AMOUNT",
                    "HIGH",
                    "Invoice contains a negative amount. All invoice values must be zero or positive."
            );
        }
    }

    private BigDecimal valueOrZero(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }

    // Calculate risk using only the issues belonging to this invoice.
    private String calculateRiskLevel(
            Invoice inv,
            List<InvoiceIssue> issues) {

        boolean hasMediumIssue = false;

        for (InvoiceIssue issue : issues) {

            if (issue.getInvoiceId().equals(inv.getId())) {

                if ("HIGH".equals(issue.getSeverity())) {
                    return "HIGH";
                }

                if ("MEDIUM".equals(issue.getSeverity())) {
                    hasMediumIssue = true;
                }
            }
        }

        return hasMediumIssue ? "MEDIUM" : "LOW";
    }

    // Common method to create an invoice issue.
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

    // CSV row parsing.
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

            // Allow missing date.
            inv.setInvoiceDate(
                    fields[1].isBlank()
                            ? null
                            : LocalDate.parse(fields[1].trim())
            );

            inv.setSellerGstin(fields[2].trim());
            inv.setBuyerGstin(fields[3].trim());

            inv.setSellerStateCode(fields[4].trim());
            inv.setBuyerStateCode(fields[5].trim());

            // Allow missing taxable value.
            inv.setTaxableValue(
                    fields[6].isBlank()
                            ? null
                            : new BigDecimal(fields[6].trim())
            );

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

    // Export invoices to CSV.
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