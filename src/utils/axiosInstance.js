// frontend/src/utils/axiosInstance.js

import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';

// La baseURL es la raíz de TODA nuestra API.
const baseURL = 'https://arcade-api-i5r3.onrender.com/api/v1';

const axiosInstance = axios.create({
    baseURL
});

// El interceptor se encarga de renovar los tokens automáticamente
axiosInstance.interceptors.request.use(async req => {
    const authTokens = localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null;
    if (!authTokens) return req;

    const user = jwtDecode(authTokens.access);
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
    if (!isExpired) {
        req.headers.Authorization = `Bearer ${authTokens.access}`;
        return req;
    }

    // Usamos una URL completa para el refresh para evitar problemas con el interceptor
    const response = await axios.post('https://arcade-api-i5r3.onrender.com/api/v1/token/refresh/', {
        refresh: authTokens.refresh
    });
    localStorage.setItem('authTokens', JSON.stringify(response.data));
    req.headers.Authorization = `Bearer ${response.data.access}`;
    return req;
});

export default axiosInstance;