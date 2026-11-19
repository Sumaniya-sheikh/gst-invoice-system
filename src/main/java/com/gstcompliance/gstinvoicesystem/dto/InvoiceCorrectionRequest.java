package com.gstcompliance.gstinvoicesystem.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record InvoiceCorrectionRequest(
    String invoiceNumber,
    LocalDate invoiceDate,
    String sellerGstin,
    String buyerGstin,
    String sellerStateCode,
    String buyerStateCode,
    BigDecimal taxableValue,
    BigDecimal cgstAmount,
    BigDecimal sgstAmount,
    BigDecimal igstAmount,
    BigDecimal totalInvoiceValue,
    String reason
) {}
