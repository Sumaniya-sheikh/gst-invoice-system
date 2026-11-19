
package com.gstcompliance.gstinvoicesystem.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gstcompliance.gstinvoicesystem.entity.Invoice;
import com.gstcompliance.gstinvoicesystem.entity.Payment;
import com.gstcompliance.gstinvoicesystem.repository.InvoiceRepository;
import com.gstcompliance.gstinvoicesystem.repository.PaymentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final InvoiceRepository invoiceRepository;

    public List<Payment> getInvoicePayments(Long invoiceId) {
        if (!invoiceRepository.existsById(invoiceId)) {
            throw new IllegalArgumentException("Invoice not found.");
        }

        return paymentRepository.findByInvoiceIdOrderByPaymentDateDesc(invoiceId);
    }

    public BigDecimal getTotalPaid(Long invoiceId) {
        return paymentRepository
                .findByInvoiceIdOrderByPaymentDateDesc(invoiceId)
                .stream()
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public BigDecimal getOutstandingBalance(Long invoiceId) {
        Invoice invoice = getInvoice(invoiceId);

        BigDecimal totalPaid = getTotalPaid(invoiceId);

        return invoice.getTotalInvoiceValue().subtract(totalPaid);
    }

    @Transactional
    public Payment addPayment(Long invoiceId, Payment payment) {

        Invoice invoice = getInvoice(invoiceId);

        if (payment.getAmount() == null ||
                payment.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException(
                    "Payment amount must be greater than zero.");
        }

        if (payment.getPaymentDate() == null) {
            throw new IllegalArgumentException(
                    "Payment date is required.");
        }

        if (invoice.getTotalInvoiceValue() == null ||
                invoice.getTotalInvoiceValue().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException(
                    "Invoice total value is invalid.");
        }

        BigDecimal totalPaid = getTotalPaid(invoiceId);

        BigDecimal remaining = invoice.getTotalInvoiceValue()
                .subtract(totalPaid);

        if (payment.getAmount().compareTo(remaining) > 0) {
            throw new IllegalArgumentException(
                    "Payment exceeds the outstanding balance of " + remaining);
        }

        payment.setInvoice(invoice);

        return paymentRepository.save(payment);
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAllByOrderByPaymentDateDesc();
    }

    private Invoice getInvoice(Long invoiceId) {
        return invoiceRepository.findById(invoiceId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Invoice not found with ID: " + invoiceId));
    }
}
