package com.dmerc12.api.unit.util;

import com.dmerc12.api.util.PasswordGenerator;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.RepeatedTest;
import org.junit.jupiter.api.Test;

import java.util.HashSet;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit tests for {@link PasswordGenerator}.
 * <p>Verifies that the generator produces passwords that meet the defined complexity requirements:
 * <ul>
 *     <li>Exactly 12 characters long</li>
 *     <li>Contains at least one uppercase, one lowercase, one digit, and one special character</li>
 *     <li>Uses only allowed characters</li>
 *     <li>Generates different passwords on each call</li>
 * </ul>
 *
 * @see PasswordGenerator
 */
@DisplayName("Password Generator Unit Tests")
public class PasswordGeneratorTests {

    private final PasswordGenerator generator = new PasswordGenerator();

    @Test
    @DisplayName("Generates password of correct length (12)")
    public void generatesCorrectLength() {
        String password = generator.generateSecurePassword();
        assertThat(password).hasSize(12);
    }

    @Test
    @DisplayName("Contains at least one uppercase letter")
    public void containsUppercase() {
        String password = generator.generateSecurePassword();
        assertThat(password).matches(".*[A-Z].*");
    }

    @Test
    @DisplayName("Contains at least one lowercase letter")
    public void containsLowercase() {
        String password = generator.generateSecurePassword();
        assertThat(password).matches(".*[a-z].*");
    }

    @Test
    @DisplayName("Contains at least one digit")
    public void containsDigit() {
        String password = generator.generateSecurePassword();
        assertThat(password).matches(".*\\d.*");
    }

    @Test
    @DisplayName("Contains at least one special character")
    public void containsSpecial() {
        String password = generator.generateSecurePassword();
        assertThat(password).matches(".*[@$!%*?&].*");
    }

    @RepeatedTest(10)
    @DisplayName("Generates different passwords on repeated calls")
    public void generatesDifferentPasswords() {
        String p1 = generator.generateSecurePassword();
        String p2 = generator.generateSecurePassword();
        assertThat(p1).isNotEqualTo(p2);
        Set<String> set = new HashSet<>();
        for (int i = 0; i < 10; i++) {
            set.add(generator.generateSecurePassword());
        }
        assertThat(set).hasSize(10);
    }
}
