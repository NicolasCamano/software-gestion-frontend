// frontend/src/utils/axiosInstance.js

import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';

// --- ¡LA BASEURL DEFINITIVA! ---
// Ahora apunta a la raíz de nuestra API, '/api/v1'.
const baseURL = 'https://arcade-api-i5r3.onrender.com/api/v1';

// Creamos una instancia separada para el refresh token, para evitar bucles.
const axiosRefresh = axios.create({ baseURL });

const axiosInstance = axios.create({
    baseURL
});

axiosInstance.interceptors.request.use(async req => {
    const authTokens = localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null;
    if (!authTokens) return req;

    const user = jwtDecode(authTokens.access);
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 5; // Refresca 5 segundos antes de expirar

    if (!isExpired) {
        req.headers.Authorization = `Bearer ${authTokens.access}`;
        return req;
    }

    try {
        const response = await axiosRefresh.post('/token/refresh/', {
            refresh: authTokens.refresh
        });
        localStorage.setItem('authTokens', JSON.stringify(response.data));
        req.headers.Authorization = `Bearer ${response.data.access}`;
        return req;
    } catch (error) {
        // Si el refresh token falla, deslogueamos al usuario (esto se manejaría en AuthContext)
        console.error("Refresh token failed", error);
        // Aquí podrías llamar a una función de logout global.
    }
    
    return req;
});

export default axiosInstance;