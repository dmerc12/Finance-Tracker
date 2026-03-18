import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - will add auth token later
api.interceptors.request.use(
    (config) => {
        // TODO: add Authorization header (e.g., Bearer token from Redux store)
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - global error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // TODO: handle common errors (e.g., 401 → redirect to login)
        return Promise.reject(error);
    }
);

export default api;
