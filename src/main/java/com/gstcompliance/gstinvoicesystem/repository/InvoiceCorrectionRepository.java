
package com.gstcompliance.gstinvoicesystem.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gstcompliance.gstinvoicesystem.entity.InvoiceCorrection;

public interface InvoiceCorrectionRepository
        extends JpaRepository<InvoiceCorrection, Long> {

    List<InvoiceCorrection> findByInvoiceIdOrderByCorrectedAtDesc(Long invoiceId);

    List<InvoiceCorrection> findAllByOrderByCorrectedAtDesc();
}
