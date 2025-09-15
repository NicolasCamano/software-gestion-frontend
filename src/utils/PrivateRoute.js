// frontend/src/utils/PrivateRoute.js

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

// Este es un 'Componente Envoltorio' (Wrapper Component).
const PrivateRoute = ({ children }) => {
    // Sintoniza la megafonía para saber si hay un usuario logueado.
    const { user } = useContext(AuthContext);

    // Si NO hay usuario, lo redirigimos a la página de login.
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Si SÍ hay un usuario, mostramos la página que se nos pidió (los 'children').
    return children;
};

export default PrivateRoute;