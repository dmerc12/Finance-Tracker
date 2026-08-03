package com.dmerc12.api.util;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Utility for generating cryptographically secure random passwords.
 * <p>The generated passwords meet the complexity requirements:
 * <ul>
 *     <li>At least one uppercase letter</li>
 *     <li>At least one lowercase letter</li>
 *     <li>At least one digit</li>
 *     <li>At least one special character from the set {@code @$!%*>&}</li>
 *     <li>Total length of exactly 12 characters</li>
 * </ul>
 */
@Component
public class PasswordGenerator {

    private static final String UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final String LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
    private static final String DIGITS = "0123456789";
    private static final String SPECIAL = "@$!%*?&";
    private static final String ALL_CHARS = UPPERCASE + LOWERCASE + DIGITS + SPECIAL;
    private static final int PASSWORD_LENGTH = 12;

    private final SecureRandom random = new SecureRandom();

    /**
     * Generates a secure random password.
     *
     * @return a random password meeting complexity requirements
     */
    public String generateSecurePassword() {
        // Ensure at least one character from each category
        List<Character> passwordChars = new ArrayList<>();
        passwordChars.add(randomChar(UPPERCASE));
        passwordChars.add(randomChar(LOWERCASE));
        passwordChars.add(randomChar(DIGITS));
        passwordChars.add(randomChar(SPECIAL));
        // Fill the rest with random characters from all categories
        for (int i = 4; i < PASSWORD_LENGTH; i++) {
            passwordChars.add(randomChar(ALL_CHARS));
        }
        // Shuffle to avoid predictable ordering
        Collections.shuffle(passwordChars, random);
        // Build the password string
        StringBuilder sb = new StringBuilder();
        for (char c : passwordChars) {
            sb.append(c);
        }
        return sb.toString();
    }

    private char randomChar(String charSet) {
        int index = random.nextInt(charSet.length());
        return charSet.charAt(index);
    }
}
