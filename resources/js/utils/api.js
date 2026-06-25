import axios from 'axios';

// Create a custom axios instance for the API
const api = axios.create({
    baseURL: '/api/admin', // Base URL for all admin API endpoints
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
});

// Add a response interceptor
api.interceptors.response.use(
    (response) => {
        // Our backend uses a standard ApiResponse format: { success: true, message: '...', data: ... }
        // We unwrap the data here to make it easier for components to consume
        if (response.data && response.data.success !== undefined) {
            return response.data.data;
        }
        return response.data;
    },
    (error) => {
        // Handle errors globally if needed
        return Promise.reject(error);
    }
);

export default api;
