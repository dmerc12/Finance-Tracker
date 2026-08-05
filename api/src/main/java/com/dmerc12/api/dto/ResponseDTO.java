package com.dmerc12.api.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Generic wrapper for all API responses.
 * <p>Provides a consistent structure for responses, including:
 * <ul>
 *     <li>A human-readable message</li>
 *     <li>Optional data payload (for success responses)</li>
 *     <li>A timestamp of when the response was generated</li>
 *     <li>Optional status code and error type (for errors)</li>
 *     <li>Optional field-specific errors (for validation failures)</li>
 * </ul>
 * <p><b>Usage:</b>
 * <ul>
 *     <li><b>Success:</b> Use {@link #success(Object)} or {@link #success(String, Object)}</li>
 *     <li><b>Error:</b> Use {@link #error(String, int, String)} or {@link #error(String, int, String, Map)}</li>
 * </ul>
 *
 * @param <T> the type of the data payload (if any)
 * @see #success(Object)
 * @see #error(String, int, String)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ResponseDTO<T> {

    /**
     * A user-friendly message describing the result of the operation.
     */
    private String message;

    /**
     * The actual data payload (present only for successful responses).
     */
    private T data;

    /**
     * The timestamp when the response was created (ISO-8601 format).
     */
    private LocalDateTime timestamp;

    /**
     * The HTTP status code (present only for error responses).
     */
    private Integer status;

    /**
     * A short error type description (present only for error responses).
     */
    private String error;

    /**
     * A map of field-specific error messages (present only for validation errors).
     */
    private Map<String, String> fieldErrors;

    // ================== Factory Methods =================

    /**
     * Creates a success response with a default message and the provided data.
     *
     * @param data the data payload
     * @param <T> the type of the data
     * @return a success response with message "Operation successful"
     */
    public static <T> ResponseDTO<T> success(T data) {
        return success("Operation successful", data);
    }

    /**
     * Creates a success response with a custom message and the provided data.
     *
     * @param message a custom success message
     * @param data the data payload
     * @param <T> the type of the data
     * @return a success response with the given message and data
     */
    public static <T> ResponseDTO<T> success(String message, T data) {
        return ResponseDTO.<T>builder()
                .message(message)
                .data(data)
                .timestamp(LocalDateTime.now())
                .build();
    }

    /**
     * Creates an error response with the given message, HTTP status, and error type.
     *
     * @param message a user-friendly error message
     * @param status the HTTP status code (e.g., 404)
     * @param error a short error type (e.g., "Resource Not Found")
     * @param <T> the type of the data (typically {@code Object}
     * @return an error response with status and error details
     */
    public static <T> ResponseDTO<T> error(String message, int status, String error) {
        return ResponseDTO.<T>builder()
                .message(message)
                .timestamp(LocalDateTime.now())
                .status(status)
                .error(error)
                .build();
    }

    /**
     * Creates an error response with field-specific validation errors.
     *
     * @param message a user-friendly error message
     * @param status the HTTP status code (typically 400)
     * @param error a short error type (e.g., "Validation Failed")
     * @param fieldErrors a map of field names to error messages
     * @param <T> the type of the data (typically {@code Object})
     * @return an error response with field errors included
     */
    public static <T> ResponseDTO<T> error(String message, int status, String error, Map<String, String> fieldErrors) {
        return ResponseDTO.<T>builder()
                .message(message)
                .timestamp(LocalDateTime.now())
                .status(status)
                .error(error)
                .fieldErrors(fieldErrors)
                .build();
    }
}
