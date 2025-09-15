// frontend/src/components/RegistroInventarioForm.js

import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, CircularProgress, Grid } from '@mui/material';
import axiosInstance from '../utils/axiosInstance';

function RegistroInventarioForm({ maquina, onRegistroSuccess }) {
    const [stockEncontrado, setStockEncontrado] = useState('');
    const [cantidadRepuesta, setCantidadRepuesta] = useState('');
    const [ultimoStockFinal, setUltimoStockFinal] = useState(0);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        setCargando(true);
        // Usamos la nueva URL '/inventario/'
        axiosInstance.get(`/inventario/?maquina=${maquina.id}`)
            .then(res => {
                const registros = res.data.results || res.data;
                if (registros.length > 0) {
                    const ultimoRegistro = registros.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))[0];
                    // El stock final de la última vez es el inicial de esta vez.
                    const stockFinalPrevio = (ultimoRegistro.stock_encontrado + ultimoRegistro.cantidad_repuesta);
                    setUltimoStockFinal(stockFinalPrevio);
                } else {
                    setUltimoStockFinal(0); // Si no hay registros, el stock anterior era 0.
                }
                setCargando(false);
            });
    }, [maquina.id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const nuevoRegistro = {
            maquina: maquina.id,
            stock_encontrado: stockEncontrado,
            cantidad_repuesta: cantidadRepuesta || 0, // Si no repone nada, es 0
        };
        try {
            await axiosInstance.post('/inventario/', nuevoRegistro);
            alert('Registro de inventario guardado.');
            if (onRegistroSuccess) onRegistroSuccess(); // Refresca la página de detalles
        } catch (error) {
            alert('Error al guardar el registro.');
        }
    };
    
    // --- Cálculos en tiempo real ---
    const vendidos = ultimoStockFinal - parseInt(stockEncontrado || 0);
    const aReponer = maquina.capacidad_producto - parseInt(stockEncontrado || 0);

    if (cargando) return <CircularProgress size={24} />;

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6">Registrar Inventario: {maquina.producto_en_maquina}</Typography>
            <Grid container spacing={2}>
                <Grid item xs={6}><Typography>Capacidad Fija:</Typography></Grid>
                <Grid item xs={6}><Typography align="right"><strong>{maquina.capacidad_producto}</strong> unidades</Typography></Grid>
                
                <Grid item xs={6}><Typography>Stock Visita Anterior:</Typography></Grid>
                <Grid item xs={6}><Typography align="right"><strong>{ultimoStockFinal}</strong> unidades</Typography></Grid>
            </Grid>
            <hr/>
            <TextField label="Stock Actual (Cantidad que queda)" type="number" value={stockEncontrado} onChange={e => setStockEncontrado(e.target.value)} required />
            
            {stockEncontrado && (
                <Box sx={{ p: 2, backgroundColor: '#f0f0f0', borderRadius: 1 }}>
                    <Typography>Unidades Vendidas: <strong>{vendidos > 0 ? vendidos : 0}</strong></Typography>
                    <Typography>Unidades a Reponer (sugerido): <strong>{aReponer > 0 ? aReponer : 0}</strong></Typography>
                </Box>
            )}

            <TextField label="Cantidad Real Repuesta" type="number" value={cantidadRepuesta} onChange={e => setCantidadRepuesta(e.target.value)} />
            <Button type="submit" variant="contained">Guardar Registro</Button>
        </Box>
    );
}

export default RegistroInventarioForm;