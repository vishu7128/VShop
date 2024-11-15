import axios from 'axios';

const api = axios.create({
    baseURL: 'https://vshop-git-master-vishu7128s-projects.vercel.app/',
    // baseURL: 'http://localhost:7000', // Adjust this to your server's base URL
});

// Request interceptor to attach token to every request
api.interceptors.request.use(
    (config) => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (userInfo && userInfo.token) {
            config.headers.Authorization = `Bearer ${userInfo.token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle 401 errors and redirect to login
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Clear the stored user information
            localStorage.removeItem("userInfo");

            // Redirect to the login page
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;