// frontend/src/utils/axiosInstance.js

import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';

const baseURL = 'https://arcade-api-i5r3.onrender.com/api/v1';

const axiosInstance = axios.create({
    baseURL
});

axiosInstance.interceptors.request.use(async req => {
    // --- ¡LA CORRECCIÓN ESTÁ AQUÍ! ---
    // Si la petición es para obtener o refrescar un token, no hagas nada y déjala pasar.
    // Esto evita que el interceptor intente refrescar un token que todavía no existe.
    if (req.url === '/token/' || req.url === '/token/refresh/') {
        return req;
    }

    const authTokens = localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null;

    if (!authTokens) {
        // Si no hay tokens para otras rutas, la petición saldrá sin autorización
        // y será rechazada por el backend (lo cual es correcto).
        return req;
    }

    const user = jwtDecode(authTokens.access);
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 5; // Refresca 5 segundos antes de expirar

    if (!isExpired) {
        req.headers.Authorization = `Bearer ${authTokens.access}`;
        return req;
    }

    try {
        const response = await axios.post(`${baseURL}/token/refresh/`, {
            refresh: authTokens.refresh
        });
        
        localStorage.setItem('authTokens', JSON.stringify(response.data));
        
        req.headers.Authorization = `Bearer ${response.data.access}`;
        return req;
    } catch (error) {
        console.error("Refresh token failed, user will be logged out:", error);
        // Aquí podrías agregar una lógica de logout global si el refresh token falla.
    }
    
    return req;
});

export default axiosInstance;