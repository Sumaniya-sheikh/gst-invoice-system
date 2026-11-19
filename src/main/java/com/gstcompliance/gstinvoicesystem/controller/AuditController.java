
package com.gstcompliance.gstinvoicesystem.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.gstcompliance.gstinvoicesystem.entity.InvoiceCorrection;
import com.gstcompliance.gstinvoicesystem.repository.InvoiceCorrectionRepository;
import com.gstcompliance.gstinvoicesystem.service.InvoiceService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/audit")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class AuditController {

    private final InvoiceService invoiceService;
    private final InvoiceCorrectionRepository correctionRepository;

    // Get all correction records, newest first
    @GetMapping
    public ResponseEntity<List<InvoiceCorrection>> getAllAuditHistory() {
        return ResponseEntity.ok(
                correctionRepository.findAllByOrderByCorrectedAtDesc()
        );
    }

    // Get correction history for one invoice
    @GetMapping("/invoice/{invoiceId}")
    public ResponseEntity<List<InvoiceCorrection>> getInvoiceAuditHistory(
            @PathVariable Long invoiceId) {

        return ResponseEntity.ok(
                invoiceService.getCorrectionHistory(invoiceId)
        );
    }
}
