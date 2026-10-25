package com.gstcompliance.gstinvoicesystem.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "invoice_issues")
@Data
public class InvoiceIssue {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    private Long invoiceId;
    private String ruleCode;
    private String severity;
    private String message;
    
}
