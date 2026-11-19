
package com.gstcompliance.gstinvoicesystem.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.gstcompliance.gstinvoicesystem.dto.VendorRiskProfile;
import com.gstcompliance.gstinvoicesystem.entity.Invoice;
import com.gstcompliance.gstinvoicesystem.entity.InvoiceIssue;
import com.gstcompliance.gstinvoicesystem.entity.Vendor;
import com.gstcompliance.gstinvoicesystem.repository.InvoiceIssueRepository;
import com.gstcompliance.gstinvoicesystem.repository.InvoiceRepository;
import com.gstcompliance.gstinvoicesystem.repository.VendorRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VendorRiskService {

    private final VendorRepository vendorRepository;
    private final InvoiceRepository invoiceRepository;
    private final InvoiceIssueRepository issueRepository;

    public List<VendorRiskProfile> getAllVendorRiskProfiles() {
        List<VendorRiskProfile> profiles = new ArrayList<>();

        for (Vendor vendor : vendorRepository.findAll()) {
            List<Invoice> invoices =
                    invoiceRepository.findBySellerGstin(vendor.getGstin());

            long high = 0;
            long medium = 0;
            long totalIssues = 0;
            long duplicates = 0;

            for (Invoice invoice : invoices) {
                if ("HIGH".equalsIgnoreCase(invoice.getRiskLevel())) high++;
                if ("MEDIUM".equalsIgnoreCase(invoice.getRiskLevel())) medium++;

                List<InvoiceIssue> issues =
                        issueRepository.findByInvoiceId(invoice.getId());

                totalIssues += issues.size();

                duplicates += issues.stream()
                        .filter(issue -> "DUPLICATE_INVOICE"
                                .equalsIgnoreCase(issue.getRuleCode()))
                        .count();
            }

            int score = (int) Math.min(100,
                    high * 20 + medium * 10 + duplicates * 15);

            String level = score >= 50 ? "HIGH"
                    : score >= 20 ? "MEDIUM" : "LOW";

            String explanation = high + " high-risk invoices, "
                    + medium + " medium-risk invoices and "
                    + duplicates + " duplicate issue(s).";

            profiles.add(new VendorRiskProfile(
                    vendor.getId(),
                    vendor.getVendorName(),
                    vendor.getGstin(),
                    invoices.size(),
                    high,
                    medium,
                    totalIssues,
                    duplicates,
                    score,
                    level,
                    explanation
            ));
        }

        return profiles;
    }
}
