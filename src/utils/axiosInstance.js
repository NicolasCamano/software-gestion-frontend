// frontend/src/utils/axiosInstance.js

import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';

const baseURL = 'https://arcade-api-i5r3.onrender.com/api/v1';

let authTokens = localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null;

const axiosInstance = axios.create({
    baseURL,
    headers: { Authorization: `Bearer ${authTokens?.access}` }
});

axiosInstance.interceptors.request.use(async req => {
    // Refrescamos la variable authTokens desde localStorage en cada petición
    authTokens = localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null;
    
    if (!authTokens) {
        // Si no hay token, no añadas la cabecera de Authorization
        delete req.headers.Authorization;
        return req;
    }

    const user = jwtDecode(authTokens.access);
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 5; // Refresca 5 segundos antes de expirar

    if (!isExpired) {
        req.headers.Authorization = `Bearer ${authTokens.access}`;
        return req;
    }

    // Si el token ha expirado, pedimos uno nuevo
    try {
        const response = await axios.post('https://arcade-api-i5r3.onrender.com/api/token/refresh/', {
            refresh: authTokens.refresh
        });
        
        // Guardamos los nuevos tokens y actualizamos el estado
        localStorage.setItem('authTokens', JSON.stringify(response.data));
        authTokens = response.data;
        
        // Actualizamos la cabecera de la petición original
        req.headers.Authorization = `Bearer ${response.data.access}`;
        return req;
    } catch (error) {
        console.error("Refresh token failed:", error);
        // Si el refresh token falla (ej: también ha expirado),
        // aquí es donde desloguearíamos al usuario.
        // Por ahora, la petición original fallará con un 401.
        return Promise.reject(error);
    }
});

export default axiosInstance;