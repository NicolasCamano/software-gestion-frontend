// frontend/src/pages/SalaDetailPage.js

import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Box, Typography, CircularProgress, Button, Grid } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axiosInstance from '../utils/axiosInstance';

import MachineList from '../components/MachineList';
import MachineForm from '../components/MachineForm';

function SalaDetailPage() {
    const { id } = useParams();
    const [sala, setSala] = useState(null);
    const [maquinasEnSala, setMaquinasEnSala] = useState([]);
    const [cargando, setCargando] = useState(true);

    // Esta función carga o recarga todos los datos necesarios para esta página
    const fetchData = () => {
        setCargando(true);
        const fetchSala = axiosInstance.get(`/salas/${id}/`);
        const fetchMaquinas = axiosInstance.get(`/maquinas/?sala=${id}`);

        Promise.all([fetchSala, fetchMaquinas])
            .then(([salaRes, maquinasRes]) => {
                setSala(salaRes.data);

                // --- ¡LA CORRECCIÓN ESTÁ AQUÍ! ---
                // Esta lógica robusta comprueba si la respuesta (maquinasRes.data) es una lista directa
                // o si es un objeto paginado que contiene la lista dentro de 'results'.
                const maquinas = Array.isArray(maquinasRes.data) ? maquinasRes.data : maquinasRes.data.results || [];
                setMaquinasEnSala(maquinas);

            })
            .catch(error => {
                console.error("Error al cargar los datos de la sala:", error);
                // En caso de error, nos aseguramos de que el estado quede limpio
                setSala(null);
                setMaquinasEnSala([]);
            })
            .finally(() => {
                // Esto se ejecuta siempre, con éxito o con error
                setCargando(false);

            });
    };

    // useEffect llama a fetchData cuando el componente carga o cuando el ID de la sala cambia
    useEffect(() => {
        fetchData();
    }, [id]);

    // Usamos el operador ternario para el renderizado condicional
    return (
        cargando ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>
        ) : !sala ? (
            <Typography variant="h5" sx={{ mt: 5, textAlign: 'center' }}>No se encontró la sala o hubo un error al cargar.</Typography>
        ) : (
            <Box>
                <Button component={RouterLink} to="/" variant="outlined" startIcon={<ArrowBackIcon />} sx={{ mb: 3 }}>
                    Volver a la Lista de Salas
                </Button>
                <Typography variant="h4" component="h1" gutterBottom>
                    {sala.nombre_sala}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
                    {sala.direccion}
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={5}>
                        <MachineForm 
                            onMachineCreated={fetchData} // Al crear una máquina, llamamos a fetchData para recargar todo
                            salas={[sala]} // Pasamos solo la sala actual para el formulario
                            salaInicialId={sala.id}
                        />
                    </Grid>
                    <Grid item xs={12} md={7}>
                        {/* Pasamos la lista de máquinas filtrada a nuestro componente MachineList */}
                        <MachineList maquinas={maquinasEnSala} />
                    </Grid>
                </Grid>
            </Box>
        )
    );
}

export default SalaDetailPage;