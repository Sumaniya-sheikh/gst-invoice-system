
package com.gstcompliance.gstinvoicesystem.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gstcompliance.gstinvoicesystem.dto.MonthlyGstSummary;
import com.gstcompliance.gstinvoicesystem.service.MonthlyGstSummaryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/gst-summary")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class MonthlyGstSummaryController {

    private final MonthlyGstSummaryService summaryService;

    @GetMapping("/monthly")
    public ResponseEntity<List<MonthlyGstSummary>> getMonthlySummary() {
        return ResponseEntity.ok(summaryService.getMonthlySummary());
    }
}
