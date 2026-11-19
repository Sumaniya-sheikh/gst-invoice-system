
package com.gstcompliance.gstinvoicesystem.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gstcompliance.gstinvoicesystem.entity.Invoice;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    // Existing duplicate detection method
    long countByInvoiceNumberAndSellerGstinAndInvoiceDateAndTaxableValue(
            String invoiceNumber,
            String sellerGstin,
            LocalDate invoiceDate,
            BigDecimal taxableValue
    );

    // Existing earlier duplicate detection method
    boolean existsByInvoiceNumberAndSellerGstinAndInvoiceDateAndTaxableValueAndIdLessThan(
            String invoiceNumber,
            String sellerGstin,
            LocalDate invoiceDate,
            BigDecimal taxableValue,
            Long id
    );

    // Find all invoices belonging to a vendor
    List<Invoice> findBySellerGstin(String sellerGstin);
}
