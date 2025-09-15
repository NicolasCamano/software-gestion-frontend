// frontend/src/components/MachineEditForm.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Card, CardContent, CircularProgress, Button, Grid, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axiosInstance from '../utils/axiosInstance';

const subtiposPorCategoria = {
    ENTRETENIMIENTO: ['Redemption', 'Video', 'Grua', 'VR', 'Simulador', 'Kiddie', 'Otra'],
    VENDING: ['Expendedora de Bebidas', 'Maquina de Cafe', 'Agua Caliente', 'Expendedora de Snacks', 'Otra'],
    OTRA: [],
};

function MachineEditForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [machineData, setMachineData] = useState(null);
    const [salas, setSalas] = useState([]);

    useEffect(() => {
        const fetchMachineData = axiosInstance.get(`/maquinas/${id}/`);
        const fetchSalasData = axiosInstance.get('/salas/');

        Promise.all([fetchMachineData, fetchSalasData])
            .then(([maquinaRes, salasRes]) => {
                const maquina = maquinaRes.data;
                const todasLasSalas = salasRes.data.results || salasRes.data;

                // Aseguramos que todos los campos tengan un valor inicial
                setMachineData({
                    nombre_maquina: maquina.nombre_maquina || '',
                    codigo_maquina: maquina.codigo_maquina || '',
                    precio_juego: maquina.precio_juego || '0.00',
                    categoria: maquina.categoria || 'OTRA',
                    subtipo: maquina.subtipo || '',
                    sala_id: maquina.sala ? maquina.sala.id : '',
                    // --- CAMPOS NUEVOS ---
                    producto_en_maquina: maquina.producto_en_maquina || '',
                    capacidad_producto: maquina.capacidad_producto || 0
                });
                setSalas(todasLasSalas);
            });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'categoria') {
            setMachineData({ ...machineData, categoria: value, subtipo: '' });
        } else {
            setMachineData({ ...machineData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dataToSend = {
            ...machineData,
            sala_id: machineData.sala_id ? parseInt(machineData.sala_id) : null
        };
        try {
            await axiosInstance.patch(`/maquinas/${id}/`, dataToSend);
            alert('¡Máquina actualizada con éxito!');
            navigate(`/maquinas/${id}`);
        } catch (error) {
            alert(`Hubo un error al actualizar: ${JSON.stringify(error.response?.data)}`);
        }
    };

    if (!machineData) { return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>; }

    return (
        <Box>
            <Button component={RouterLink} to={`/maquinas/${id}`} variant="outlined" startIcon={<ArrowBackIcon />} sx={{ mb: 3 }}>
                Cancelar y Volver a Detalles
            </Button>
            <Card>
                <CardContent>
                    <Typography variant="h5" component="h2" gutterBottom>Editando Máquina: {machineData.nombre_maquina}</Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            {/* ... (campos existentes no cambian) ... */}
                            <Grid item xs={12} sm={6}><TextField name="nombre_maquina" required fullWidth label="Nombre" value={machineData.nombre_maquina} onChange={handleChange} /></Grid>
                            <Grid item xs={12} sm={6}><TextField name="codigo_maquina" required fullWidth label="Código" value={machineData.codigo_maquina} onChange={handleChange} /></Grid>
                            
                            {/* --- ¡NUEVOS CAMPOS AÑADIDOS AQUÍ! --- */}
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, fontWeight: 'bold' }}>Configuración de Inventario</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField name="producto_en_maquina" fullWidth label="Producto Principal" helperText="Ej: Peluche Capibara" value={machineData.producto_en_maquina} onChange={handleChange} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField name="capacidad_producto" type="number" fullWidth label="Capacidad Fija del Producto" helperText="Cantidad ideal en la máquina" value={machineData.capacidad_producto} onChange={handleChange} />
                            </Grid>

                             <Grid item xs={12}>
                                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, fontWeight: 'bold' }}>Configuración General</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}><TextField name="precio_juego" required fullWidth label="Precio" type="number" inputProps={{ step: "0.01" }} value={machineData.precio_juego} onChange={handleChange} /></Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth required>
                                    <InputLabel>Categoría</InputLabel>
                                    <Select name="categoria" value={machineData.categoria} label="Categoría" onChange={handleChange}>
                                        <MenuItem value="ENTRETENIMIENTO">Entretenimiento</MenuItem>
                                        <MenuItem value="VENDING">Vending</MenuItem>
                                        <MenuItem value="OTRA">Otra</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth disabled={!machineData.categoria || subtiposPorCategoria[machineData.categoria]?.length === 0}>
                                    <InputLabel>Subtipo</InputLabel>
                                    <Select name="subtipo" value={machineData.subtipo} label="Subtipo" onChange={handleChange}>
                                        {machineData.categoria && subtiposPorCategoria[machineData.categoria]?.map(s => (<MenuItem key={s} value={s}>{s}</MenuItem>))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Sala</InputLabel>
                                    <Select name="sala_id" value={machineData.sala_id} label="Sala" onChange={handleChange}>
                                        <MenuItem value=""><em>-- Sin asignar --</em></MenuItem>
                                        {salas.map(sala => (<MenuItem key={sala.id} value={sala.id}>{sala.nombre_sala}</MenuItem>))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Guardar Cambios</Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}

export default MachineEditForm;