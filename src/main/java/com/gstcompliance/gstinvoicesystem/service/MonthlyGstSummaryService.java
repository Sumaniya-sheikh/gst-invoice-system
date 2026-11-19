
package com.gstcompliance.gstinvoicesystem.service;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import org.springframework.stereotype.Service;

import com.gstcompliance.gstinvoicesystem.dto.MonthlyGstSummary;
import com.gstcompliance.gstinvoicesystem.entity.Invoice;
import com.gstcompliance.gstinvoicesystem.repository.InvoiceRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MonthlyGstSummaryService {

    private final InvoiceRepository invoiceRepository;

    public List<MonthlyGstSummary> getMonthlySummary() {

        List<Invoice> invoices = invoiceRepository.findAll();

        Map<YearMonth, List<Invoice>> monthlyInvoices = new TreeMap<>(
                java.util.Comparator.reverseOrder());

        for (Invoice invoice : invoices) {
            if (invoice.getInvoiceDate() == null) {
                continue;
            }

            YearMonth month = YearMonth.from(invoice.getInvoiceDate());

            monthlyInvoices
                    .computeIfAbsent(month, key -> new java.util.ArrayList<>())
                    .add(invoice);
        }

        return monthlyInvoices.entrySet().stream()
                .map(entry -> {
                    List<Invoice> monthInvoices = entry.getValue();

                    BigDecimal taxableValue = BigDecimal.ZERO;
                    BigDecimal cgstAmount = BigDecimal.ZERO;
                    BigDecimal sgstAmount = BigDecimal.ZERO;
                    BigDecimal igstAmount = BigDecimal.ZERO;

                    for (Invoice invoice : monthInvoices) {
                        taxableValue = taxableValue.add(
                                valueOrZero(invoice.getTaxableValue()));

                        cgstAmount = cgstAmount.add(
                                valueOrZero(invoice.getCgstAmount()));

                        sgstAmount = sgstAmount.add(
                                valueOrZero(invoice.getSgstAmount()));

                        igstAmount = igstAmount.add(
                                valueOrZero(invoice.getIgstAmount()));
                    }

                    return new MonthlyGstSummary(
                            entry.getKey().format(
                                    DateTimeFormatter.ofPattern("MMMM yyyy")),
                            monthInvoices.size(),
                            taxableValue,
                            cgstAmount,
                            sgstAmount,
                            igstAmount);
                })
                .toList();
    }

    private BigDecimal valueOrZero(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }
}
