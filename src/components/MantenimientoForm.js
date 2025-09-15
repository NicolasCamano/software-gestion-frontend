// frontend/src/components/MantenimientoForm.js

import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import axiosInstance from '../utils/axiosInstance';

function MantenimientoForm({ maquinaId, onMantenimientoSuccess }) {
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (descripcion.length > 150) {
      setError('El informe no puede exceder los 150 caracteres.');
      return;
    }

    const nuevoMantenimiento = {
      maquina: maquinaId,
      descripcion: descripcion,
    };

    try {
      await axiosInstance.post('/mantenimientos/', nuevoMantenimiento);
      alert('Informe de mantenimiento guardado con éxito.');
      setDescripcion('');
      if (onMantenimientoSuccess) {
        onMantenimientoSuccess();
      }
    } catch (err) {
      console.error("Error al guardar el mantenimiento:", err.response?.data || err.message);
      alert('Hubo un error al guardar el informe.');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6">Registrar Nuevo Mantenimiento</Typography>
      <TextField
        label="Descripción del trabajo realizado"
        multiline
        rows={3}
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        required
        fullWidth
        inputProps={{ maxLength: 150 }}
        error={!!error}
        helperText={error || `${descripcion.length}/150 caracteres`}
      />
      <Button type="submit" variant="contained">Guardar Informe</Button>
    </Box>
  );
}

export default MantenimientoForm;