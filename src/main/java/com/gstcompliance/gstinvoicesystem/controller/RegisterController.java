
package com.gstcompliance.gstinvoicesystem.controller;

import java.util.List;
import java.util.Locale;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gstcompliance.gstinvoicesystem.entity.Invoice;
import com.gstcompliance.gstinvoicesystem.service.InvoiceService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/registers")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "https://gst-invoice-system-jet.vercel.app"
})
@RequiredArgsConstructor
public class RegisterController {

    private final InvoiceService invoiceService;

    @Value("${app.business.gstin}")
    private String businessGstin;

    @GetMapping("/sales")
    public List<Invoice> getSalesRegister() {
        String gstin = businessGstin.trim().toUpperCase(Locale.ROOT);

        return invoiceService.findAll().stream()
                .filter(invoice -> invoice.getSellerGstin() != null)
                .filter(invoice -> invoice.getSellerGstin()
                        .trim().equalsIgnoreCase(gstin))
                .toList();
    }

    @GetMapping("/purchases")
    public List<Invoice> getPurchaseRegister() {
        String gstin = businessGstin.trim().toUpperCase(Locale.ROOT);

        return invoiceService.findAll().stream()
                .filter(invoice -> invoice.getBuyerGstin() != null)
                .filter(invoice -> invoice.getBuyerGstin()
                        .trim().equalsIgnoreCase(gstin))
                .toList();
    }
}
