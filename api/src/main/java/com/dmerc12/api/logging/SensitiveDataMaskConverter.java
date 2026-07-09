package com.dmerc12.api.logging;

import ch.qos.logback.classic.pattern.ClassicConverter;
import ch.qos.logback.classic.spi.ILoggingEvent;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Custom Logback converter to mask sensitive fields.
 * Usage: %mask(%msg)
 * It will replace values of known sensitive keys with "****"
 */
public class SensitiveDataMaskConverter extends ClassicConverter {

    private static final Pattern SENSITIVE_PATTERN = Pattern.compile(
            "(?i)(password|token|ssn|creditcard|cardnumber|cvv|pin)[\"']?\\s*[:=]\\s*[\"']?[^\"',\\s]+"
    );

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
