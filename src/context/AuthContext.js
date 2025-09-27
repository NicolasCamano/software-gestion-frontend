// frontend/src/context/AuthContext.js

import React, { createContext, useState, useContext } from 'react';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const AuthContext = createContext();
export default AuthContext;

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null);
    const [user, setUser] = useState(() => localStorage.getItem('authTokens') ? jwtDecode(JSON.parse(localStorage.getItem('authTokens')).access) : null);
    const navigate = useNavigate();

   // Dentro de AuthProvider en AuthContext.js

    const loginUser = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/token/', { 
                username: e.target.username.value, 
                password: e.target.password.value 
            });
            
            const data = response.data;
            if (response.status === 200) {
                setAuthTokens(data);
                setUser(jwtDecode(data.access));
                localStorage.setItem('authTokens', JSON.stringify(data));
                navigate('/');
            } else {
                // Esto es poco probable que se ejecute con Axios, pero es una buena práctica
                alert(`Error inesperado: ${response.status}`);
            }
        } catch (error) {
            console.error("Error detallado de login:", error);
            let errorMessage = "Ocurrió un error inesperado al intentar iniciar sesión.";
            
            // Analizamos el tipo de error que nos da Axios
            if (error.response) {
                // El servidor respondió con un código de error (4xx o 5xx)
                errorMessage = `Error del servidor: ${error.response.status}. `;
                if (error.response.data?.detail) {
                    errorMessage += `Detalle: ${error.response.data.detail}`;
                } else {
                    errorMessage += `Respuesta: ${JSON.stringify(error.response.data)}`;
                }
            } else if (error.request) {
                // La petición se hizo pero no se recibió respuesta (CORS, red, etc.)
                errorMessage = "No se pudo conectar con el servidor. Verifica que el back-end esté funcionando y la configuración de CORS sea correcta.";
            } else {
                // Ocurrió un error al configurar la petición
                errorMessage = `Error de configuración en el front-end: ${error.message}`;
            }
            alert(errorMessage); // Mostramos el mensaje de error detallado
        }
    };

    const esAdmin = user?.groups?.includes('Administrador') ?? false;
    const esTecnico = user?.groups?.includes('Tecnico') ?? false;
    const esRepositor = user?.groups?.includes('Repositor') ?? false;

    const contextData = {
        user, authTokens, loginUser, logoutUser,
        esAdmin, esTecnico, esRepositor
    };

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
};