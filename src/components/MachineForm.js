// frontend/src/components/MachineForm.js

// ¡LA CORRECCIÓN ESTÁ EN ESTA LÍNEA!
import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

// Añadimos 'salaInicialId' para que se pueda pre-seleccionar una sala.
function MachineForm({ onMachineCreated, salas, salaInicialId = null }) {
    const [nombre, setNombre] = useState('');
    const [codigo, setCodigo] = useState('');
    const [salaId, setSalaId] = useState(salaInicialId || '');
    const [categoria, setCategoria] = useState('ENTRETENIMIENTO');
    const [subtipo, setSubtipo] = useState('');

    // Este useEffect asegura que si la sala seleccionada en la página cambia,
    // el formulario se actualice.
    useEffect(() => {
        setSalaId(salaInicialId || '');
    }, [salaInicialId]);

    const subtiposPorCategoria = {
        ENTRETENIMIENTO: ['Redemption', 'Video', 'Grua', 'VR', 'Simulador', 'Kiddie', 'Otra'],
        VENDING: ['Expendedora de Bebidas', 'Maquina de Cafe', 'Agua Caliente', 'Expendedora de Snacks', 'Otra'],
        OTRA: [],
    };

    const handleCategoriaChange = (e) => {
        setCategoria(e.target.value);
        setSubtipo(''); // Resetea el subtipo cuando cambia la categoría
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const nuevaMaquina = {
            nombre_maquina: nombre,
            codigo_maquina: codigo,
            precio_juego: 1.00,
            categoria: categoria,
            subtipo: subtipo,
            sala_id: salaId ? parseInt(salaId) : null
        };
        try {
            const response = await fetch('http://127.0.0.1:8000/api/v1/maquinas/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevaMaquina),
            });
     if (!response.ok) {
            // Si la respuesta no es exitosa (ej: error 400), leemos el error que envía Django.
            const errorData = await response.json();
            
            // Construimos un mensaje de error legible para el usuario.
            let errorMessage = 'Error al guardar la máquina.';
            if (errorData.codigo_maquina) {
                // Si el error es específico del código_maquina, lo mostramos.
                errorMessage = `Error en el Código: ${errorData.codigo_maquina[0]}`;
            }
            // Lanzamos el error con nuestro nuevo mensaje específico.
            throw new Error(errorMessage);
        }
        
        // Si todo fue bien, continuamos como antes
        onMachineCreated(); 
        alert('¡Máquina guardada con éxito!');
        setNombre(''); 
        setCodigo(''); 
        setSalaId(salaInicialId || ''); 
        setCategoria('ENTRETENIMIENTO'); 
        setSubtipo('');
        
    } catch (error) { 
        console.error(error);
        // La alerta ahora mostrará el mensaje de error específico.
        alert(error.message);
    }
  };


    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2, border: '1px solid #ddd', borderRadius: '8px' }}>
            <Typography variant="h6" component="h2">Añadir Nueva Máquina</Typography>
            <TextField label="Nombre de la Máquina" value={nombre} onChange={e => setNombre(e.target.value)} required size="small" />
            <TextField label="Código" value={codigo} onChange={e => setCodigo(e.target.value)} required size="small" />
            
            <FormControl fullWidth size="small" disabled={!!salaInicialId}>
                <InputLabel>Categoría</InputLabel>
                <Select value={categoria} label="Categoría" onChange={handleCategoriaChange}>
                    <MenuItem value="ENTRETENIMIENTO">Entretenimiento</MenuItem>
                    <MenuItem value="VENDING">Vending</MenuItem>
                    <MenuItem value="OTRA">Otra</MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth size="small" disabled={!categoria || subtiposPorCategoria[categoria].length === 0}>
                <InputLabel>Subtipo</InputLabel>
                <Select value={subtipo} label="Subtipo" onChange={e => setSubtipo(e.target.value)}>
                    <MenuItem value=""><em>-- Ninguno --</em></MenuItem>
                    {categoria && subtiposPorCategoria[categoria].map(s => (
                        <MenuItem key={s} value={s}>{s}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl fullWidth size="small">
                <InputLabel>Asignar a Sala</InputLabel>
                <Select value={salaId} label="Asignar a Sala" onChange={e => setSalaId(e.target.value)}>
                    <MenuItem value=""><em>-- Sin asignar --</em></MenuItem>
                    {salas.map(sala => (<MenuItem key={sala.id} value={sala.id}>{sala.nombre_sala}</MenuItem>))}
                </Select>
            </FormControl>

            <Button type="submit" variant="contained">Guardar Máquina</Button>
        </Box>
    );
}

export default MachineForm;