// frontend/src/components/MachineForm.js

import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import axiosInstance from '../utils/axiosInstance'; // ¡Importamos axiosInstance!
import { useAuth } from '../context/AuthContext';

const subtiposPorCategoria = {
    ENTRETENIMIENTO: ['Redemption', 'Video', 'Grua', 'VR', 'Simulador', 'Kiddie', 'Otra'],
    VENDING: ['Expendedora de Bebidas', 'Maquina de Cafe', 'Agua Caliente', 'Expendedora de Snacks', 'Otra'],
    OTRA: [],
};

function MachineForm({ onMachineCreated, salas, salaInicialId = null }) {
    const { esAdmin } = useAuth();
    const [nombre, setNombre] = useState('');
    const [codigo, setCodigo] = useState('');
    const [salaId, setSalaId] = useState(salaInicialId || '');
    const [categoria, setCategoria] = useState('ENTRETENIMIENTO');
    const [subtipo, setSubtipo] = useState('');

    useEffect(() => {
        setSalaId(salaInicialId || '');
    }, [salaInicialId]);

    const handleCategoriaChange = (e) => {
        setCategoria(e.target.value);
        setSubtipo('');
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
            // --- ¡LA CORRECCIÓN ESTÁ AQUÍ! ---
            // Usamos axiosInstance para que la petición sea autenticada y a la URL correcta.
            await axiosInstance.post('/maquinas/', nuevaMaquina);
            alert('¡Máquina creada con éxito!');
            onMachineCreated();
            setNombre(''); setCodigo(''); setSalaId(salaInicialId || ''); setCategoria('ENTRETENIMIENTO'); setSubtipo('');
        } catch (error) {
            console.error("Error al guardar la máquina:", error.response?.data);
            alert(`Error al guardar: ${JSON.stringify(error.response?.data)}`);
        }
    };

    // El formulario para crear máquinas solo debe ser visible para administradores.
    if (!esAdmin) {
        return null;
    }

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2, border: '1px solid #ddd', borderRadius: '8px' }}>
            <Typography variant="h6" component="h2">Añadir Nueva Máquina</Typography>
            <TextField label="Nombre de la Máquina" value={nombre} onChange={e => setNombre(e.target.value)} required size="small" />
            <TextField label="Código" value={codigo} onChange={e => setCodigo(e.target.value)} required size="small" />
            
            <FormControl fullWidth required size="small">
                <InputLabel>Categoría</InputLabel>
                <Select value={categoria} label="Categoría" onChange={handleCategoriaChange}>
                    <MenuItem value="ENTRETENIMIENTO">Entretenimiento</MenuItem>
                    <MenuItem value="VENDING">Vending</MenuItem>
                    <MenuItem value="OTRA">Otra</MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth size="small" disabled={!categoria || subtiposPorCategoria[categoria]?.length === 0}>
                <InputLabel>Subtipo</InputLabel>
                <Select value={subtipo} label="Subtipo" onChange={e => setSubtipo(e.target.value)}>
                    <MenuItem value=""><em>-- Ninguno --</em></MenuItem>
                    {categoria && subtiposPorCategoria[categoria]?.map(s => (
                        <MenuItem key={s} value={s}>{s}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl fullWidth size="small" disabled={!!salaInicialId}>
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