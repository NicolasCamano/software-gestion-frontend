// frontend/src/context/AuthContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();
export default AuthContext;

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null);
    const [user, setUser] = useState(() => localStorage.getItem('authTokens') ? jwtDecode(JSON.parse(localStorage.getItem('authTokens')).access) : null);
    
    const navigate = useNavigate();

    const loginUser = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:8000/api/token/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 'username': e.target.username.value, 'password': e.target.password.value })
            });
            const data = await response.json();

            if (response.status === 200) {
                setAuthTokens(data);
                const decodedUser = jwtDecode(data.access);
                setUser(decodedUser);
                localStorage.setItem('authTokens', JSON.stringify(data));
                
                // --- MENSAJE ESPÍA 1 ---
                console.log("LOGIN EXITOSO. Usuario decodificado:", decodedUser);

                navigate('/');
            } else {
                alert('Usuario o contraseña incorrectos.');
            }
        } catch (error) {
            console.error("Error de login:", error);
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
        user: user,
        authTokens: authTokens,
        loginUser: loginUser,
        logoutUser: logoutUser,
        esAdmin,
        esTecnico,
        esRepositor
    };
    
    // --- MENSAJE ESPÍA 2 ---
    // Se imprimirá cada vez que el contexto se actualice.
    console.log("AuthProvider RENDERIZANDO. ¿esAdmin?:", esAdmin, "Usuario:", user);

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
};