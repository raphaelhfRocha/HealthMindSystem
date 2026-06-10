import axios from 'axios'
import { STORAGE_KEYS } from '../constants/storageKeys'


const API_URL = "https://localhost:7260/api/"

const api = axios.create({
    baseURL: API_URL,
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

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
            localStorage.removeItem(STORAGE_KEYS.TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);

            if (window.location.pathname !== '/') {
                window.location.href = '/';
            }
        }

        return Promise.reject(error);
    }
);

export { api };
