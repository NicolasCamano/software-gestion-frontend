// frontend/src/utils/axiosInstance.js
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';

// --- ¡LA CORRECCIÓN ESTÁ AQUÍ! ---
// La baseURL debe ser la dirección principal de tu API en Render.
const baseURL = 'https://arcade-api-i5r3.onrender.com';

const axiosInstance = axios.create({
    baseURL
});

// La lógica de interceptors para renovar el token se queda igual
axiosInstance.interceptors.request.use(async req => {
    const authTokens = localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null;
    if (!authTokens) return req;

    const user = jwtDecode(authTokens.access);
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
    if (!isExpired) {
        req.headers.Authorization = `Bearer ${authTokens.access}`;
        return req;
    }

    const response = await axios.post(`${baseURL}/api/token/refresh/`, {
        refresh: authTokens.refresh
    });
    localStorage.setItem('authTokens', JSON.stringify(response.data));
    req.headers.Authorization = `Bearer ${response.data.access}`;
    return req;
});

export default axiosInstance;