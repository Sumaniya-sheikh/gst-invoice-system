
package com.gstcompliance.gstinvoicesystem.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gstcompliance.gstinvoicesystem.dto.VendorRiskProfile;
import com.gstcompliance.gstinvoicesystem.service.VendorRiskService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/vendor-risk")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class VendorRiskController {

    private final VendorRiskService vendorRiskService;

    @GetMapping
    public ResponseEntity<List<VendorRiskProfile>> getVendorRiskProfiles() {
        return ResponseEntity.ok(
                vendorRiskService.getAllVendorRiskProfiles()
        );
    }
}
