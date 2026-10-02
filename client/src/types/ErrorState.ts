/**
 * Normalized shape of an API error payload produced by {@link getErrorData}.
 * <p>{@code message} is the human-readable summary.
 * {@code fieldErrors} maps request field names to per-field messages for form binding.
 * Both fields are nullable so the shape can serve as the initial state of a slice
 * before any request has run.
 */
export interface ErrorState {
    message: string | null;
    fieldErrors: Map<string, string[]> | null;
}
