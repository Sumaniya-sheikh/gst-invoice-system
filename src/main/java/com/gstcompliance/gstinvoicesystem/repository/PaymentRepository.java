
package com.gstcompliance.gstinvoicesystem.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gstcompliance.gstinvoicesystem.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByInvoiceIdOrderByPaymentDateDesc(Long invoiceId);

    List<Payment> findAllByOrderByPaymentDateDesc();

    void deleteByInvoiceId(Long invoiceId);
}
