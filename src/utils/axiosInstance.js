// frontend/src/utils/axiosInstance.js

import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';

const baseURL = 'https://arcade-api-i5r3.onrender.com/api/v1';

const axiosInstance = axios.create({
    baseURL
});

axiosInstance.interceptors.request.use(async req => {
    // Obtenemos los tokens del localStorage en cada petición
    const authTokens = localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null;

    if (!authTokens) {
        return req; // Si no hay tokens, la petición sale normal (y fallará en rutas protegidas)
    }

    const user = jwtDecode(authTokens.access);
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1; // Comprobamos si el token ha expirado

    if (!isExpired) {
        // Si no ha expirado, añadimos la cabecera de autorización y listo
        req.headers.Authorization = `Bearer ${authTokens.access}`;
        return req;
    }

    // Si ha expirado, pedimos uno nuevo usando el refresh token
    const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
        refresh: authTokens.refresh
    });

    // Guardamos los nuevos tokens
    localStorage.setItem('authTokens', JSON.stringify(response.data));
    // Actualizamos la cabecera de la petición original con el nuevo token
    req.headers.Authorization = `Bearer ${response.data.access}`;
    
    return req;
});

// Necesitaremos una librería para manejar las fechas. Instálala.
// En la terminal de React: npm install dayjs

export default axiosInstance;