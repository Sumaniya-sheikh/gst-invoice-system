
package com.gstcompliance.gstinvoicesystem.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.gstcompliance.gstinvoicesystem.entity.Payment;
import com.gstcompliance.gstinvoicesystem.service.PaymentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    @GetMapping("/invoice/{invoiceId}")
    public ResponseEntity<List<Payment>> getInvoicePayments(
            @PathVariable Long invoiceId) {

        return ResponseEntity.ok(
                paymentService.getInvoicePayments(invoiceId));
    }

    @GetMapping("/invoice/{invoiceId}/paid")
    public ResponseEntity<BigDecimal> getTotalPaid(
            @PathVariable Long invoiceId) {

        return ResponseEntity.ok(
                paymentService.getTotalPaid(invoiceId));
    }

    @GetMapping("/invoice/{invoiceId}/balance")
    public ResponseEntity<BigDecimal> getOutstandingBalance(
            @PathVariable Long invoiceId) {

        return ResponseEntity.ok(
                paymentService.getOutstandingBalance(invoiceId));
    }

    @PostMapping("/invoice/{invoiceId}")
    public ResponseEntity<Payment> addPayment(
            @PathVariable Long invoiceId,
            @RequestBody Payment payment) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(paymentService.addPayment(invoiceId, payment));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgument(
            IllegalArgumentException exception) {

        return ResponseEntity.badRequest()
                .body(exception.getMessage());
    }
}
