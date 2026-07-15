package com.dmerc12.api.logging;

import ch.qos.logback.classic.pattern.ClassicConverter;
import ch.qos.logback.classic.spi.ILoggingEvent;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Custom Logback converter to mask sensitive data in log messages.
 * <p>This converter is designed to be used with LogBack's {@code %mask()} conversion word.
 * It scans log messages for known sensitive keys (e.g., password, token, SSN) and replaces their values
 * with asterisks to prevent accidental exposure of confidential information in logs.
 * <p>The converter is configured in {@code logback-spring.xml} using the {@code conversionRule} element.
 * Once registered, it can be applied to any log message by using the pattern {@code %mask(%msg)}.
 * <p><b>Example:</b>
 * <pre>
 *     Original: "User login with password=secret123"
 *     Masked: "User login with password=****"
 * </pre>
 * <p>The regular expression matches the following patterns (case-insensitive):
 * <ul>
 *     <li>Keys: {@code password, token, ssn, creditcard, cardnumber, cvv, pin}</li>
 *     <li>Followed by optional whitespace and {@code :=}</li>
 *     <li>Optional quotes around the value</li>
 *     <li>Value is captured until a comma, quote, or whitespace</li>
 * </ul>
 * The entire matched value is replaced with {@code key=****}, preserving the key but masking the value.
 *
 * @see ClassicConverter
 * @see <a href="https://logback.qos.ch/manual/layouts.html#conversionWord">Logback Conversion Words</a>
 */
public class SensitiveDataMaskConverter extends ClassicConverter {

    /**
     * Regular expression pattern for matching sensitive key-value pairs.
     * <p>Pattern breakdown:
     * <ul>
     *     <li>{@code (?i)} - case-insensitive matching</li>
     *     <li>{@code (password|token|...)} - captures the sensitive keys</li>
     *     <li>{@code ("']?} - optional opening quote</li>
     *     <li>{@code \s*[:=]\s*} - optional whitespace, colon or equals, optional whitespace</li>
     *     <li>{@code ["']?} - optional opening quotes (second occurrence)</li>
     *     <li>{@code [^"',\s]+} - matches the value until a quote, comma, or whitespace</li>
     * </ul>
     */
    private static final Pattern SENSITIVE_PATTERN = Pattern.compile(
            "(?i)(password|token|ssn|creditcard|cardnumber|cvv|pin)[\"']?\\s*[:=]\\s*[\"']?[^\"',\\s]+"
    );

    /**
     * Converts the log message by masking sensitive values.
     * <p>This method scans the input message for sensitive key-value pairs using {@link #SENSITIVE_PATTERN}.
     * For each match, it replaces the entire matched substring with the format {@code key=****},
     * where the key is the captured sensitive key and the value is masked.
     * <p>If the message is {@code null}, the method returns {@code null}
     * to preserve the original behavior of Logback converters.
     *
     * @param event the Logback logging event containing the formatted message
     * @return the masked message, or {@code null} if the original message was null
     */
    @Override
    public String convert(ILoggingEvent event) {
        String message = event.getFormattedMessage();
        if (message == null) {
            return null;
        }
        Matcher m = SENSITIVE_PATTERN.matcher(message);
        StringBuilder sb = new StringBuilder();
        while(m.find()) {
            String key = m.group(1);
            // Replace whole match with "key=****" (preserves key, masks value)
            m.appendReplacement(sb, key + "=****");
        }
        m.appendTail(sb);
        return sb.toString();
    }
}
