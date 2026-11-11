package com.gstcompliance.gstinvoicesystem.controller;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.gstcompliance.gstinvoicesystem.entity.Invoice;
import com.gstcompliance.gstinvoicesystem.entity.InvoiceIssue;
import com.gstcompliance.gstinvoicesystem.service.InvoiceService;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

      @GetMapping("/issues")
public List<InvoiceIssue> getIssues() {
    return invoiceService.findAllIssues();
}
  @GetMapping
public List<Invoice> getAll() {
    return invoiceService.findAll();
}
    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> upload(@RequestParam("file") MultipartFile file) {
       int saved = invoiceService.saveInvoicesFromCsv(file);
        return ResponseEntity.ok(Map.of("message", "Upload successful", "invoicesSaved", saved));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleBadCsv(IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    }
    @GetMapping("/export")
public ResponseEntity<String> exportCsv() {

    String csv = invoiceService.exportInvoicesToCsv();

    return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION,
                    "attachment; filename=invoices-report.csv")
            .contentType(MediaType.parseMediaType("text/csv"))
            .body(csv);
}

@GetMapping("/export/json")
public ResponseEntity<List<Invoice>> exportJson() {

    List<Invoice> invoices = invoiceService.findAll();

    return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION,
                    "attachment; filename=invoices-report.json")
            .contentType(MediaType.APPLICATION_JSON)
            .body(invoices);
}

@PostMapping("/revalidate")
public ResponseEntity<Map<String, Object>> revalidate() {
    int count = invoiceService.revalidateAll();

    return ResponseEntity.ok(
        Map.of(
            "message", "Revalidation complete",
            "invoicesRevalidated", count
        )
    );
}
}