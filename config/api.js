import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// REQUEST INTERCEPTOR
api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }

    return config;
});

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (typeof window !== "undefined") {
            if (err.response?.status === 401) {
                localStorage.clear();
                window.location.href = "/services";
            }
        }
        return Promise.reject(err);
    }
);

export default api;