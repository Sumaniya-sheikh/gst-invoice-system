package com.gstcompliance.gstinvoicesystem.entity;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "invoice_corrections")
@Data
public class InvoiceCorrection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long invoiceId;

    @Column(nullable = false)
    private String correctedBy;

    @Column(nullable = false)
    private LocalDateTime correctedAt;

    @Lob
    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String beforeValues;

    @Lob
    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String afterValues;

    @Column(length = 1000)
    private String reason;
}
