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
import com.gstcompliance.gstinvoicesystem.repository.InvoiceRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;

    @Transactional(readOnly = true)
    public List<Invoice> findAll() {
        return invoiceRepository.findAll();
    }

    @Transactional
    public int saveInvoicesFromCsv(MultipartFile file) {
        List<Invoice> invoices = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            reader.readLine(); // skip header
            int rowNumber = 1;
            String line;
            while ((line = reader.readLine()) != null) {
                rowNumber++;
                if (line.isBlank()) continue;
                invoices.add(parseRow(line, rowNumber));
            }
        } catch (IOException e) {
            throw new UncheckedIOException("Could not read uploaded file", e);
        }

        invoiceRepository.saveAll(invoices);
        return invoices.size();
    }

    private Invoice parseRow(String line, int rowNumber) {
        String[] fields = line.split(",", -1);
        if (fields.length != 11) {
            throw new IllegalArgumentException(
                "Row " + rowNumber + ": expected 11 columns but found " + fields.length);
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
                "Row " + rowNumber + ": invalid value (" + e.getMessage() + ")");
        }
    }
}