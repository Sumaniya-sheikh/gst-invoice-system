package com.gstcompliance.gstinvoicesystem.validation;

import java.util.Optional;
import java.util.regex.Pattern;

public final class GstinValidator {

    public record Finding(String ruleCode, String message) {}

    private static final String CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final Pattern FORMAT =
            Pattern.compile("^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$");

    private GstinValidator() {}

    /** Empty result means the GSTIN is valid. */
    public static Optional<Finding> validate(String raw) {
        if (raw == null || raw.isBlank()) {
            return Optional.of(new Finding("GSTIN_MISSING", "GSTIN is missing"));
        }
        String gstin = raw.trim().toUpperCase();

        if (gstin.length() != 15) {
            return Optional.of(new Finding("GSTIN_LENGTH",
                    "GSTIN has " + gstin.length() + " characters, expected 15"));
        }
        if (!FORMAT.matcher(gstin).matches()) {
            return Optional.of(new Finding("GSTIN_FORMAT",
                    "GSTIN does not follow the required pattern (state code, PAN, entity number, Z, check character)"));
        }
        int state = Integer.parseInt(gstin.substring(0, 2));
        if (!((state >= 1 && state <= 38) || state == 97 || state == 99)) {
            return Optional.of(new Finding("GSTIN_STATE",
                    "State code " + gstin.substring(0, 2) + " is not a valid GST state code"));
        }
        char expected = checkChar(gstin.substring(0, 14));
        if (gstin.charAt(14) != expected) {
            return Optional.of(new Finding("GSTIN_CHECKSUM",
                    "Check character is '" + gstin.charAt(14) + "' but expected '" + expected + "'"));
        }
        return Optional.empty();
    }

    static char checkChar(String first14) {
        int sum = 0;
        for (int i = 0; i < 14; i++) {
            int product = CHARS.indexOf(first14.charAt(i)) * (i % 2 == 0 ? 1 : 2);
            sum += product / 36 + product % 36;
        }
        return CHARS.charAt((36 - sum % 36) % 36);
    }
}