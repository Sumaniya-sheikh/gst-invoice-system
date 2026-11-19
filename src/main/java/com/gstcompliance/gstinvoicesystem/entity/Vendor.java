
package com.gstcompliance.gstinvoicesystem.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

import lombok.Data;

@Entity
@Table(name = "vendors")
@Data
public class Vendor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String vendorName;

    @Column(nullable = false, unique = true, length = 15)
    private String gstin;

    @Column(length = 100)
    private String contactPerson;

    @Column(length = 150)
    private String email;

    @Column(length = 15)
    private String phone;

    @Column(length = 500)
    private String address;

    @Column(length = 2)
    private String stateCode;

    private boolean active = true;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
