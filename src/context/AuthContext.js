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

    const loginUser = async (e) => {
        e.preventDefault();
        try {
            // --- ¡LA CORRECCIÓN ESTÁ AQUÍ! ---
            // Llamamos a la ruta RELATIVA. Axios añadirá la baseURL '.../api/v1' automáticamente.
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
                alert('Usuario o contraseña incorrectos.');
            }
        } catch (error) {
            alert('Hubo un problema al intentar iniciar sesión.');
        }
    };

    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
        navigate('/login');
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