package com.gstcompliance.gstinvoicesystem.validation;

import java.util.regex.Pattern;

public final class GstinValidator {

    public record Result(boolean valid, String reason) {}

    private static final Pattern FORMAT =
        Pattern.compile("^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$");

    private GstinValidator() {}

    public static Result validate(String gstin) {
        if (gstin == null || gstin.isBlank()) {
            return new Result(false, "GSTIN is missing.");
        }
        String g = gstin.trim().toUpperCase();
        if (g.length() != 15) {
            return new Result(false, "GSTIN must be 15 characters; found " + g.length() + ".");
        }
        if (!FORMAT.matcher(g).matches()) {
            return new Result(false, "GSTIN does not match the required format (state code + PAN + entity number + 'Z' + check character).");
        }
        int state = Integer.parseInt(g.substring(0, 2));
        if (!((state >= 1 && state <= 38) || state == 97 || state == 99)) {
            return new Result(false, "Invalid state code " + g.substring(0, 2) + ".");
        }
        return new Result(true, "Valid GSTIN format and state code.");
    }
}