
package com.gstcompliance.gstinvoicesystem.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.gstcompliance.gstinvoicesystem.entity.Invoice;
import com.gstcompliance.gstinvoicesystem.entity.Vendor;
import com.gstcompliance.gstinvoicesystem.service.VendorService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/vendors")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "https://gst-invoice-system-jet.vercel.app"
})
@RequiredArgsConstructor
public class VendorController {

    private final VendorService vendorService;

    @GetMapping
    public ResponseEntity<List<Vendor>> getAllVendors() {
        return ResponseEntity.ok(vendorService.getAllVendors());
    }

    @GetMapping("/active")
    public ResponseEntity<List<Vendor>> getActiveVendors() {
        return ResponseEntity.ok(vendorService.getActiveVendors());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Vendor>> searchVendors(
            @RequestParam String name) {
        return ResponseEntity.ok(vendorService.searchVendors(name));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vendor> getVendorById(
            @PathVariable Long id) {
        return ResponseEntity.ok(vendorService.getVendorById(id));
    }

    @GetMapping("/{id}/invoices")
    public ResponseEntity<List<Invoice>> getVendorInvoices(
            @PathVariable Long id) {
        return ResponseEntity.ok(vendorService.getVendorInvoices(id));
    }

    @PostMapping
    public ResponseEntity<Vendor> addVendor(
            @RequestBody Vendor vendor) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(vendorService.addVendor(vendor));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vendor> updateVendor(
            @PathVariable Long id,
            @RequestBody Vendor vendor) {
        return ResponseEntity.ok(vendorService.updateVendor(id, vendor));
    }

    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<Vendor> deactivateVendor(
            @PathVariable Long id) {
        return ResponseEntity.ok(vendorService.deactivateVendor(id));
    }

    @org.springframework.web.bind.annotation.ExceptionHandler(
            IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgument(
            IllegalArgumentException exception) {
        return ResponseEntity.badRequest().body(exception.getMessage());
    }
}
