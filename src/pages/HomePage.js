// frontend/src/pages/HomePage.js

import React, { useState, useEffect } from 'react';
import { Grid } from '@mui/material';
import axiosInstance from '../utils/axiosInstance';

import SalaList from '../components/SalaList';
import SalaForm from '../components/SalaForm';

function HomePage() {
    const [salas, setSalas] = useState([]);

    const fetchData = () => {
        axiosInstance.get('/salas/')
            .then(res => {
                const items = Array.isArray(res.data) ? res.data : res.data.results || [];
                setSalas(items);
            })
            .catch(error => {
                console.error("Error al cargar las salas:", error);
                setSalas([]); // En caso de error, asegura una lista vacía
            });
    };
    
useEffect(() => {
    // La llamada es a '/salas/', NO a '/api/v1/salas/'.
    axiosInstance.get('/salas/') 
        .then(res => {
            setSalas(res.data.results || res.data);
        })
        .catch(error => {
            console.error("Error al cargar las salas:", error);
            setSalas([]);
        });
}, []);

    // Cuando se crea una sala, la añadimos a la lista para que se vea al instante
    const handleSalaCreated = (nuevaSala) => {
        setSalas(prevSalas => [...prevSalas, nuevaSala]);
    };

    return (
        <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} md={8} lg={6}>
                <SalaForm onSalaCreated={handleSalaCreated} />
                <SalaList salas={salas} />
            </Grid>
        </Grid>
    );
}

export default HomePage;