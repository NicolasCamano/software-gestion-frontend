// frontend/src/App.js

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';

// Importaciones de nuestros componentes y utilidades
import Header from './components/Header';
import LoginPage from './components/LoginPage';
import PrivateRoute from './utils/PrivateRoute';

// Importaciones de nuestras páginas
import HomePage from './pages/HomePage';
import SalaDetailPage from './pages/SalaDetailPage'; // Página de detalles de la sala
import MachineDetail from './components/MachineDetail';
import MachineEditForm from './components/MachineEditForm';

function App() {
  return (
    <div>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          {/* Ruta Pública */}
          <Route path="/login" element={<LoginPage />} />

          {/* --- RUTAS PROTEGIDAS --- */}
          {/* Envolvemos cada página que requiere login con nuestro componente PrivateRoute. */}
          
          <Route 
            path="/" 
            element={<PrivateRoute><HomePage /></PrivateRoute>} 
          />
          
          {/* --- ¡LA RUTA QUE FALTABA ESTÁ AQUÍ! --- */}
          <Route 
            path="/salas/:id" 
            element={<PrivateRoute><SalaDetailPage /></PrivateRoute>} 
          />
          
          <Route 
            path="/maquinas/:id" 
            element={<PrivateRoute><MachineDetail /></PrivateRoute>} 
          />

          <Route 
            path="/maquinas/:id/editar" 
            element={<PrivateRoute><MachineEditForm /></PrivateRoute>} 
          />

        </Routes>
      </Container>
    </div>
  );
}

export default App;