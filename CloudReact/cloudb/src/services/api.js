import axios from 'axios';
import { store } from '../redux/store';

const api = axios.create({
    baseURL: 'http://localhost:8080/auth'
});

api.interceptors.request.use(config => {
    const state = store.getState();
    const token = state.auth?.token;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, error => {
    return Promise.reject(error);
});

api.interceptors.response.use(
    response => {
        if (response.data && response.data.data) {
            return response.data;
        }
        return response;
    },
    error => {
        if (error.response?.status === 401) {
            console.error('Unauthorized access');
        }
        return Promise.reject(error);
    }
);

export const getUsers = () => api.get('/admin/users');
export const getCloudAccounts = () => api.get('/admin/cloudAccounts');

