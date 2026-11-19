
package com.gstcompliance.gstinvoicesystem.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gstcompliance.gstinvoicesystem.entity.Vendor;

public interface VendorRepository extends JpaRepository<Vendor, Long> {

    Optional<Vendor> findByGstin(String gstin);

    boolean existsByGstin(String gstin);

    List<Vendor> findByVendorNameContainingIgnoreCase(String vendorName);

    List<Vendor> findByActiveTrue();
}
