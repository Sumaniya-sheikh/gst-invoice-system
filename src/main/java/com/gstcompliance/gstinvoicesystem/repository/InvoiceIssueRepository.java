package com.gstcompliance.gstinvoicesystem.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gstcompliance.gstinvoicesystem.entity.InvoiceIssue;

public interface InvoiceIssueRepository extends JpaRepository<InvoiceIssue, Long> {
    List<InvoiceIssue> findByInvoiceId(Long invoiceId);
    List<InvoiceIssue> findByRuleCode(String ruleCode);
}