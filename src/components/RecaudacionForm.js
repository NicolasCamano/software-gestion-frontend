// frontend/src/components/RecaudacionForm.js

import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Checkbox, FormControlLabel, CircularProgress } from '@mui/material';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from '../context/AuthContext';

function RecaudacionForm({ maquinaId, precioJuego, onRecaudacionSuccess }) {
    const { esAdmin } = useAuth();
    const [contadorAnterior, setContadorAnterior] = useState('');
    const [contadorActual, setContadorActual] = useState('');
    const [cargando, setCargando] = useState(true);
    const [cambiarPrecio, setCambiarPrecio] = useState(false);
    const [nuevoPrecio, setNuevoPrecio] = useState('');
    const [esPrimeraRecaudacion, setEsPrimeraRecaudacion] = useState(false);

    useEffect(() => {
        setCargando(true);
        axiosInstance.get(`/recaudaciones/?maquina=${maquinaId}`)
            .then(res => {
                // --- ¡LA CORRECCIÓN DEFINITIVA ESTÁ AQUÍ! ---
                // Esta lógica comprueba si la respuesta (res.data) es una lista directa
                // o si es un objeto paginado que contiene 'results'. Funciona para ambos casos.
                const data = Array.isArray(res.data) ? res.data : res.data.results || [];
                
                if (data.length > 0) {
                    setEsPrimeraRecaudacion(false);
                    const ultima = data.sort((a, b) => new Date(b.fecha_recaudacion) - new Date(a.fecha_recaudacion))[0];
                    setContadorAnterior(ultima.contador_actual);
                } else {
                    setEsPrimeraRecaudacion(true);
                    setContadorAnterior('');
                }
            })
            .catch(error => {
                console.error("Error al obtener recaudaciones:", error);
                setEsPrimeraRecaudacion(true);
                setContadorAnterior('');
            })
            .finally(() => {
                setCargando(false);
            });
    }, [maquinaId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const nuevaRecaudacion = { maquina: maquinaId, contador_anterior: contadorAnterior, contador_actual: contadorActual };
        try {
            const recaudacionResponse = await axiosInstance.post('/recaudaciones/', nuevaRecaudacion);
            if (esAdmin && cambiarPrecio && nuevoPrecio) {
                await axiosInstance.patch(`/maquinas/${maquinaId}/`, { precio_juego: nuevoPrecio });
            }
            alert('¡Operación completada con éxito!');
            setContadorAnterior(recaudacionResponse.data.contador_actual);
            setContadorActual('');
            setCambiarPrecio(false);
            setNuevoPrecio('');
            if (esPrimeraRecaudacion) {
                setEsPrimeraRecaudacion(false);
            }
            if (onRecaudacionSuccess) {
                onRecaudacionSuccess();
            }
        } catch (error) {
            alert('Hubo un error al guardar la operación.');
        }
    };
    
    let recaudacionEstimada = 0;
    const diferencia = parseInt(contadorActual) - parseInt(contadorAnterior);
    if (!isNaN(diferencia) && diferencia >= 0) {
        const precioParaCalcular = esAdmin && cambiarPrecio && nuevoPrecio ? nuevoPrecio : precioJuego;
        recaudacionEstimada = diferencia * parseFloat(precioParaCalcular);
    }

    if (cargando) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}><CircularProgress size={24} /></Box>;
    }

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div>
                <TextField label="Contador Anterior" type="number" value={contadorAnterior} onChange={e => setContadorAnterior(e.target.value)} required fullWidth
                    InputProps={{ readOnly: !esPrimeraRecaudacion && !esAdmin }}
                    helperText={!esPrimeraRecaudacion && !esAdmin ? "Valor automático. Solo un Admin puede editarlo." : "Introduce el contador inicial de la máquina."}
                    variant="filled" sx={{ backgroundColor: !esPrimeraRecaudacion && !esAdmin ? '#f0f0f0' : '#fff' }}
                />
            </div>
            <div>
                <TextField label="Contador Actual" type="number" value={contadorActual} onChange={e => setContadorActual(e.target.value)} required fullWidth autoFocus />
            </div>
            <Box sx={{ my: 1, p: 2, backgroundColor: '#eef7ff', border: '1px solid #b3d4ff', borderRadius: 1 }}>
                <Typography variant="h6">Recaudación Estimada: ${recaudacionEstimada.toFixed(2)}</Typography>
            </Box>
            {esAdmin && (
                <>
                    <FormControlLabel control={<Checkbox checked={cambiarPrecio} onChange={e => setCambiarPrecio(e.target.checked)}/>} label="¿Actualizar precio de la máquina?"/>
                    {cambiarPrecio && (<TextField label="Nuevo Precio" type="number" inputProps={{ step: "0.01" }} value={nuevoPrecio} onChange={e => setNuevoPrecio(e.target.value)} required fullWidth />)}
                </>
            )}
            <Button type="submit" variant="contained" size="large">Guardar Operación</Button>
        </Box>
    );
}

export default RecaudacionForm;