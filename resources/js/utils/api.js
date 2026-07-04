import axios from 'axios';

// Create a custom axios instance for the API
const api = axios.create({
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
});

// Add a request interceptor to evaluate baseURL dynamically
api.interceptors.request.use((config) => {
    const basePath = typeof window !== 'undefined' ? window.location.pathname.split('/')[1] : 'admin';
    const rolePrefix = ['admin', 'teacher', 'student'].includes(basePath) ? basePath : 'admin';
    config.baseURL = `/api/${rolePrefix}`;
    return config;
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
