
package com.gstcompliance.gstinvoicesystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class VendorRiskProfile {
    private Long vendorId;
    private String vendorName;
    private String gstin;
    private long totalInvoices;
    private long highRiskInvoices;
    private long mediumRiskInvoices;
    private long totalIssues;
    private long duplicateIssues;
    private int riskScore;
    private String riskLevel;
    private String explanation;
}
