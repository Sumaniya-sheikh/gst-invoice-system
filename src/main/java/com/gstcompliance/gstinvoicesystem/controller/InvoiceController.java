package com.gstcompliance.gstinvoicesystem.controller;
import java.util.List;
import java.util.Map;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.gstcompliance.gstinvoicesystem.entity.Invoice;
import com.gstcompliance.gstinvoicesystem.service.InvoiceService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

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
}