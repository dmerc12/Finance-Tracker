export interface ResponseDTO<T = unknown> {
    message: string;
    data?: T;
    timestamp: string;
    status?: number;
    error?: string;
    fieldErrors?: Record<string, string>;
}
