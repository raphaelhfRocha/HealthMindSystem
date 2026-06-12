import axios from 'axios'
import { STORAGE_KEYS } from '../constants/storageKeys'


const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "",
})

api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem(STORAGE_KEYS.TOKEN);

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
)

api.interceptors.response.use(
    (response) => response,

    (error) => {
        if (error.response?.status === 401) {
            sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
            sessionStorage.removeItem(STORAGE_KEYS.USER);

            if (window.location.pathname !== '/') {
                window.location.href = '/';
            }
        }

        return Promise.reject(error);
    }
);

export { api };
