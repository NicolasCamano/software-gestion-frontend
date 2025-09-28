// frontend/src/components/SalaForm.js

import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from '../context/AuthContext';

function SalaForm({ onSalaCreated }) {
  const [nombreSala, setNombreSala] = useState('');
  const [direccion, setDireccion] = useState('');
  const { esAdmin } = useAuth(); // Obtenemos el rol para saber si mostrar el formulario

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevaSala = { nombre_sala: nombreSala, direccion };
    try {
      // Usamos nuestro cliente de API seguro
      const response = await axiosInstance.post('/salas/', nuevaSala);
      alert('¡Sala creada con éxito!');
      onSalaCreated(response.data); // Notificamos al padre que se creó una sala
      // Limpiamos el formulario
      setNombreSala('');
      setDireccion('');
    } catch (error) {
      console.error("Error al guardar la sala:", error.response?.data || error.message);
      alert("Hubo un error al guardar la sala.");
    }
  };

  // El formulario para crear salas solo será visible para los administradores
  //if (!esAdmin) {
   // return null; // Si no es admin, no muestra nada.
 // }

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit} 
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2, mb: 3, border: '1px solid #ddd', borderRadius: '8px' }}
    >
      <Typography variant="h6" component="h2">
        Crear Nueva Sala
      </Typography>
      
      <TextField
        label="Nombre de la Sala"
        variant="outlined"
        value={nombreSala}
        onChange={e => setNombreSala(e.target.value)}
        required
        size="small"
      />
      
      <TextField
        label="Dirección (Opcional)"
        variant="outlined"
        value={direccion}
        onChange={e => setDireccion(e.target.value)}
        size="small"
      />
      
      <Button type="submit" variant="contained">
        Guardar Sala
      </Button>
    </Box>
  );
}

export default SalaForm;