package com.gstcompliance.gstinvoicesystem.repository;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gstcompliance.gstinvoicesystem.entity.Invoice;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    // Existing method — keep four parameters
    long countByInvoiceNumberAndSellerGstinAndInvoiceDateAndTaxableValue(
            String invoiceNumber,
            String sellerGstin,
            LocalDate invoiceDate,
            BigDecimal taxableValue
    );

    // New method — checks for an earlier duplicate
    boolean existsByInvoiceNumberAndSellerGstinAndInvoiceDateAndTaxableValueAndIdLessThan(
            String invoiceNumber,
            String sellerGstin,
            LocalDate invoiceDate,
            BigDecimal taxableValue,
            Long id
    );
}