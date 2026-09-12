package com.gstcompliance.gstinvoicesystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gstcompliance.gstinvoicesystem.entity.Invoice;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    
}