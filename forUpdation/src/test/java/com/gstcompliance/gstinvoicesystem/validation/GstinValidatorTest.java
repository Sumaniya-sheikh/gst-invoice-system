package com.gstcompliance.gstinvoicesystem.validation;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

public class GstinValidatorTest {


    @Test
    void validGstinsPass() {
        for (String g : new String[] {
                "09AABCU9603R1ZL", "27AAPFU0939F1ZV", "09AAACR5055K1Z5", "07AAACR5055K1Z9" }) {
            assertTrue(GstinValidator.validate(g).isEmpty(), g);
        }
    }

    @Test
    void truncatedGstinFailsOnLength() {
        assertEquals("GSTIN_LENGTH", GstinValidator.validate("09AABCU9603").orElseThrow().ruleCode());
    }

    @Test
    void wrongCheckCharacterFailsOnChecksum() {
        assertEquals("GSTIN_CHECKSUM", GstinValidator.validate("09AABCU9603R1ZM").orElseThrow().ruleCode());
    }

    @Test
    void invalidStateCodeFails() {
        String base = "40AABCU9603R1Z";
        String g = base + GstinValidator.checkChar(base);
        assertEquals("GSTIN_STATE", GstinValidator.validate(g).orElseThrow().ruleCode());
    }

    @Test
    void whitespaceAndLowercaseAreNormalized() {
        assertTrue(GstinValidator.validate(" 27aapfu0939f1zv ").isEmpty());
    }

    @Test
    void nullIsMissing() {
        assertEquals("GSTIN_MISSING", GstinValidator.validate(null).orElseThrow().ruleCode());
    }
}
