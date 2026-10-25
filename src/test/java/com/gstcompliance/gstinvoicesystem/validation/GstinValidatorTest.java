package com.gstcompliance.gstinvoicesystem.validation;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

class GstinValidatorTest {

    @Test
    void validGstinsPass() {
        for (String g : new String[] {
                "09AABCU9603R1ZL", "27AAPFU0939F1ZV", "09AAACR5055K1Z5", "07AAACR5055K1Z9" }) {
            assertTrue(GstinValidator.validate(g).isEmpty(), g);
        }
    }

    @Test
    void truncatedGstinFailsOnLength() {
        var f = GstinValidator.validate("09AABCU9603").orElseThrow();
        assertEquals("GSTIN_LENGTH", f.ruleCode());
    }

    @Test
    void wrongCheckCharacterFailsOnChecksum() {
        var f = GstinValidator.validate("09AABCU9603R1ZM").orElseThrow();
        assertEquals("GSTIN_CHECKSUM", f.ruleCode());
    }
}