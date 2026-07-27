package com.dmerc12.api.unit.dto;

import com.dmerc12.api.dto.ResponseDTO;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit tests for {@link ResponseDTO}.
 * <p>These tests verify that the factory methods produce correctly structured responses
 * for both success and error scenarios, including:
 * <ul>
 *     <li>Success responses with default and custom messages</li>
 *     <li>Error responses with status, error type, and optional field errors</li>
 *     <li>Timestamp generation and correctness</li>
 * </ul>
 *
 * @see ResponseDTO
 */
@DisplayName("Response DTO Unit Tests")
public class ResponseDTOTests {

    @Nested
    @DisplayName("Success Tests")
    class SuccessTests {
        @Test
        @DisplayName("Creates response with default message")
        public void createsDefaultMessage() {
            String data = "test data";
            ResponseDTO<String> response = ResponseDTO.success(data);
            assertThat(response).isNotNull();
            assertThat(response.getMessage()).isEqualTo("Operation successful");
            assertThat(response.getData()).isEqualTo(data);
            assertThat(response.getTimestamp()).isNotNull();
            assertThat(response.getStatus()).isNull();
            assertThat(response.getError()).isNull();
            assertThat(response.getFieldErrors()).isNull();
        }

        @Test
        @DisplayName("Creates response with custom message")
        public void createsCustomMessage() {
            String data = "test data";
            ResponseDTO<String> response = ResponseDTO.success("Custom success", data);
            assertThat(response).isNotNull();
            assertThat(response.getMessage()).isEqualTo("Custom success");
            assertThat(response.getData()).isEqualTo(data);
            assertThat(response.getTimestamp()).isNotNull();
            assertThat(response.getStatus()).isNull();
            assertThat(response.getError()).isNull();
            assertThat(response.getFieldErrors()).isNull();
        }

        @Test
        @DisplayName("Timestamp is set to current time on creation")
        public void timestampIsSet() {
            LocalDateTime before = LocalDateTime.now();
            ResponseDTO<String> response = ResponseDTO.success("test");
            LocalDateTime after = LocalDateTime.now();
            assertThat(response).isNotNull();
            assertThat(response.getTimestamp()).isAfterOrEqualTo(before);
            assertThat(response.getTimestamp()).isBeforeOrEqualTo(after);
        }
    }

    @Nested
    @DisplayName("Error Tests")
    class ErrorTests {
        @Test
        @DisplayName("Creates error response")
        public void createsErrorResponse() {
            int statusCode = 404;
            String message = "Not found";
            String error = "Resource Not Found";
            ResponseDTO<Object> response = ResponseDTO.error(message, statusCode, error);
            assertThat(response).isNotNull();
            assertThat(response.getMessage()).isEqualTo(message);
            assertThat(response.getStatus()).isEqualTo(statusCode);
            assertThat(response.getError()).isEqualTo(error);
            assertThat(response.getTimestamp()).isNotNull();
            assertThat(response.getData()).isNull();
            assertThat(response.getFieldErrors()).isNull();
        }

        @Test
        @DisplayName("Error with field errors creates error response with fieldErrors")
        public void errorWithFieldErrors() {
            int statusCode = 400;
            String message = "Validation failed";
            String error = "Bad Request";
            Map<String, String> fieldErrors = Map.of("email", "Email is required");
            ResponseDTO<Object> response = ResponseDTO.error(message, statusCode, error, fieldErrors);
            assertThat(response).isNotNull();
            assertThat(response.getMessage()).isEqualTo(message);
            assertThat(response.getStatus()).isEqualTo(statusCode);
            assertThat(response.getError()).isEqualTo(error);
            assertThat(response.getFieldErrors()).containsExactlyEntriesOf(fieldErrors);
        }
    }
}
