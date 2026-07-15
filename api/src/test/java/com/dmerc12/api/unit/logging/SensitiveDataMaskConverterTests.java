package com.dmerc12.api.unit.logging;

import ch.qos.logback.classic.spi.ILoggingEvent;
import com.dmerc12.api.logging.SensitiveDataMaskConverter;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.when;

@ActiveProfiles("test")
@ExtendWith(MockitoExtension.class)
@DisplayName("Sensitive Data Mask Converter Unit Tests")
public class SensitiveDataMaskConverterTests {

    @Mock
    private ILoggingEvent event;

    private final SensitiveDataMaskConverter converter = new SensitiveDataMaskConverter();

    @Test
    @DisplayName("Mask password")
    public void maskPassword() {
        when(event.getFormattedMessage()).thenReturn("password=secret123");
        String result = converter.convert(event);
        assertEquals("password=****", result);
    }

    @Test
    @DisplayName("Mask token")
    public void maskToken() {
        when(event.getFormattedMessage()).thenReturn("token=secret123");
        String result = converter.convert(event);
        assertEquals("token=****", result);
    }

    @Test
    @DisplayName("Mask SSN")
    public void maskSSN() {
        when(event.getFormattedMessage()).thenReturn("ssn=111-22-3333");
        String result = converter.convert(event);
        assertEquals("ssn=****", result);
    }

    @Test
    @DisplayName("Mask routing number")
    public void maskRoutingNumber() {
        when(event.getFormattedMessage()).thenReturn("routingNumber=1234567890");
        String result = converter.convert(event);
        assertEquals("routingNumber=****", result);
    }

    @Test
    @DisplayName("Mask account number")
    public void maskAccountNumber() {
        when(event.getFormattedMessage()).thenReturn("accountNumber=1234567890");
        String result = converter.convert(event);
        assertEquals("accountNumber=****", result);
    }

    @Test
    @DisplayName("Mask card number")
    public void maskCardNumber() {
        when(event.getFormattedMessage()).thenReturn("cardNumber=1111-2222-3333-4444");
        String result = converter.convert(event);
        assertEquals("cardNumber=****", result);
    }

    @Test
    @DisplayName("Mask CVV")
    public void maskCVV() {
        when(event.getFormattedMessage()).thenReturn("cvv=123");
        String result = converter.convert(event);
        assertEquals("cvv=****", result);
    }

    @Test
    @DisplayName("Mask PIN")
    public void maskPIN() {
        when(event.getFormattedMessage()).thenReturn("pin=1234");
        String result = converter.convert(event);
        assertEquals("pin=****", result);
    }

    @Test
    @DisplayName("Multiple sensitive keys in one message")
    public void multipleSensitiveKeysInOneMessage() {
        when(event.getFormattedMessage()).thenReturn("password=foo token=bar cardNumber=1111-2222-3333-4444");
        String result = converter.convert(event);
        assertEquals("password=**** token=**** cardNumber=****", result);
    }

    @Test
    @DisplayName("Different separators")
    public void differentSeparators() {
        when(event.getFormattedMessage()).thenReturn("password=secret123");
        String equals = converter.convert(event);
        assertEquals("password=****", equals);
        when(event.getFormattedMessage()).thenReturn("password:secret123");
        String colon = converter.convert(event);
        assertEquals("password=****", colon);
        when(event.getFormattedMessage()).thenReturn("password = secret123");
        String spaceEqualSpace = converter.convert(event);
        assertEquals("password=****", spaceEqualSpace);
        when(event.getFormattedMessage()).thenReturn("password: secret123");
        String colonSpace = converter.convert(event);
        assertEquals("password=****", colonSpace);
    }

    @Test
    @DisplayName("Quoted values")
    public void quotedValues() {
        when(event.getFormattedMessage()).thenReturn("password=\"secret123\"");
        String doubleQuote = converter.convert(event);
        assertEquals("password=****", doubleQuote);
        when(event.getFormattedMessage()).thenReturn("password='secret123'");
        String singleQuote = converter.convert(event);
        assertEquals("password=****", singleQuote);
    }

    @Test
    @DisplayName("No sensitive data")
    public void noSensitiveData() {
        String message = "Hello, this is a log message";
        when(event.getFormattedMessage()).thenReturn(message);
        String result = converter.convert(event);
        assertEquals(message, result);
    }

    @Test
    @DisplayName("Partial match")
    public void partialMatch() {
        String message = "password is not set";
        when(event.getFormattedMessage()).thenReturn(message);
        String result = converter.convert(event);
        assertEquals(message, result);
    }

    @Test
    @DisplayName("Case insensitivity")
    public void caseInsensitivity() {
        when(event.getFormattedMessage()).thenReturn("PASSWORD=secret123");
        String caps = converter.convert(event);
        assertEquals("PASSWORD=****", caps);
        when(event.getFormattedMessage()).thenReturn("ToKen=abc");
        String mixed = converter.convert(event);
        assertEquals("ToKen=****", mixed);
    }

    @Test
    @DisplayName("Message is null")
    public void messageIsNull() {
        when(event.getFormattedMessage()).thenReturn(null);
        assertNull(converter.convert(event));
    }
}
