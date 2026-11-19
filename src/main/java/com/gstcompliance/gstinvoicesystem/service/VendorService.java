
package com.gstcompliance.gstinvoicesystem.service;

import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gstcompliance.gstinvoicesystem.entity.Invoice;
import com.gstcompliance.gstinvoicesystem.entity.Vendor;
import com.gstcompliance.gstinvoicesystem.repository.InvoiceRepository;
import com.gstcompliance.gstinvoicesystem.repository.VendorRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VendorService {

    private final VendorRepository vendorRepository;
    private final InvoiceRepository invoiceRepository;

    // Register a new vendor
    public Vendor addVendor(Vendor vendor) {

        validateVendor(vendor);

        String gstin = vendor.getGstin().trim().toUpperCase(Locale.ROOT);

        if (vendorRepository.existsByGstin(gstin)) {
            throw new IllegalArgumentException(
                    "A vendor with this GSTIN already exists."
            );
        }

        vendor.setGstin(gstin);
        vendor.setActive(true);

        return vendorRepository.save(vendor);
    }

    // Retrieve all vendors
    public List<Vendor> getAllVendors() {
        return vendorRepository.findAll();
    }

    // Retrieve active vendors
    public List<Vendor> getActiveVendors() {
        return vendorRepository.findByActiveTrue();
    }

    // Find vendor by ID
    public Vendor getVendorById(Long id) {
        return vendorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Vendor not found with ID: " + id
                ));
    }

    // Search vendors by name
    public List<Vendor> searchVendors(String name) {
        return vendorRepository.findByVendorNameContainingIgnoreCase(name);
    }

    // Update vendor details
    public Vendor updateVendor(Long id, Vendor updatedVendor) {

        Vendor existingVendor = getVendorById(id);

        validateVendor(updatedVendor);

        String gstin = updatedVendor.getGstin()
                .trim()
                .toUpperCase(Locale.ROOT);

        vendorRepository.findByGstin(gstin).ifPresent(vendor -> {
            if (!vendor.getId().equals(id)) {
                throw new IllegalArgumentException(
                        "Another vendor already uses this GSTIN."
                );
            }
        });

        existingVendor.setVendorName(updatedVendor.getVendorName());
        existingVendor.setGstin(gstin);
        existingVendor.setContactPerson(updatedVendor.getContactPerson());
        existingVendor.setEmail(updatedVendor.getEmail());
        existingVendor.setPhone(updatedVendor.getPhone());
        existingVendor.setAddress(updatedVendor.getAddress());
        existingVendor.setStateCode(updatedVendor.getStateCode());

        return vendorRepository.save(existingVendor);
    }

    // View invoices associated with a vendor
    public List<Invoice> getVendorInvoices(Long vendorId) {

        Vendor vendor = getVendorById(vendorId);

        return invoiceRepository.findBySellerGstin(vendor.getGstin());
    }

    // Deactivate vendor instead of permanently deleting it
    @Transactional
    public Vendor deactivateVendor(Long id) {

        Vendor vendor = getVendorById(id);

        vendor.setActive(false);

        return vendorRepository.save(vendor);
    }

    // Basic input validation
    private void validateVendor(Vendor vendor) {

        if (vendor.getVendorName() == null
                || vendor.getVendorName().isBlank()) {
            throw new IllegalArgumentException(
                    "Vendor name is required."
            );
        }

        if (vendor.getGstin() == null
                || vendor.getGstin().isBlank()) {
            throw new IllegalArgumentException(
                    "Vendor GSTIN is required."
            );
        }

        if (!vendor.getGstin().trim().matches(
                "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$")) {
            throw new IllegalArgumentException(
                    "Please enter a valid GSTIN format."
            );
        }
    }
}
