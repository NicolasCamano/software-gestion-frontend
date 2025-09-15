// frontend/src/components/MachineDetail.js

// frontend/src/components/MachineDetail.js

import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Card, CardContent, CircularProgress, Button, Grid, List, ListItem, ListItemText, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from '../context/AuthContext';

import RecaudacionForm from './RecaudacionForm';
import RecaudacionList from './RecaudacionList';
import RegistroInventarioForm from './RegistroInventarioForm'; // <-- Nuevo import
import RegistroInventarioList from './RegistroInventarioList'; // <-- Nuevo import
import MantenimientoForm from './MantenimientoForm';
import MantenimientoList from './MantenimientoList';

function MachineDetail() {
    const { id } = useParams();
    const [maquina, setMaquina] = useState(null);
    const [inventario, setInventario] = useState([]); // Renombrado de 'cargas' a 'inventario'
    const [recaudaciones, setRecaudaciones] = useState([]);
    const [mantenimientos, setMantenimientos] = useState([]);
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [cargando, setCargando] = useState(true);
    const { esAdmin, esTecnico } = useAuth();

    const fetchData = async () => {
        try {
            // --- URL CORREGIDA AQUÍ ---
            const inventarioUrl = `/inventario/?maquina=${id}`; // Usamos la nueva ruta

            const urls = [
                axiosInstance.get(`/maquinas/${id}/`),
                axiosInstance.get(inventarioUrl),
                axiosInstance.get(`/maquinas/${id}/qr_code/`, { responseType: 'blob' }),
                axiosInstance.get(`/recaudaciones/?maquina=${id}`),
                axiosInstance.get(`/mantenimientos/?maquina=${id}`)
            ];
            const [maquinaRes, inventarioRes, qrRes, recaudacionesRes, mantenimientosRes] = await Promise.all(urls);

            setMaquina(maquinaRes.data);
            setInventario(inventarioRes.data || []); // Guardamos el inventario
            setQrCodeUrl(URL.createObjectURL(qrRes.data));
            setRecaudaciones(recaudacionesRes.data.results || []);
            setMantenimientos(mantenimientosRes.data || []);
        } catch (error) {
            console.error("Error al cargar los datos:", error);
            setMaquina(null);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    // La sección de inventario ahora solo depende de si la máquina tiene una capacidad definida
    const showInventorySection = maquina && maquina.capacidad_producto > 0;
    const showMaintenanceSection = true;

    return (
        cargando ? (<CircularProgress />)
            : !maquina ? (<Typography>No se encontró</Typography>)
                : (
                    <Box>
                        <Button component={RouterLink} to={maquina.sala ? `/salas/${maquina.sala.id}` : '/'} variant="outlined" startIcon={<ArrowBackIcon />} sx={{ mb: 3 }}>
                            {maquina.sala ? `Volver a ${maquina.sala.nombre_sala}` : 'Volver al listado'}
                        </Button>
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={5}>
                                <Card>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                            <Typography variant="h5" component="h2">{maquina.nombre_maquina}</Typography>
                                            {esAdmin && (<Button component={RouterLink} to={`/maquinas/${id}/editar`} variant="contained" size="small">Editar</Button>)}
                                        </Box>
                                        <List dense>
                                            <ListItem><ListItemText primary="Código" secondary={maquina.codigo_maquina} /></ListItem><Divider />
                                            <ListItem><ListItemText primary="Categoría" secondary={maquina.categoria} /></ListItem><Divider />
                                            {maquina.subtipo && (<><ListItem><ListItemText primary="Subtipo" secondary={maquina.subtipo} /></ListItem><Divider /></>)}
                                            {maquina.producto_en_maquina && (<><ListItem><ListItemText primary="Producto Principal" secondary={maquina.producto_en_maquina} /></ListItem><Divider /></>)}
                                            {maquina.capacidad_producto > 0 && (<><ListItem><ListItemText primary="Capacidad Fija" secondary={maquina.capacidad_producto} /></ListItem><Divider /></>)}
                                        </List>
                                    </CardContent>
                                </Card>
                                <Card sx={{ mt: 3, p: 2, textAlign: 'center' }}>
                                    <Typography variant="h6" gutterBottom>Código QR</Typography>
                                    {qrCodeUrl ? <img src={qrCodeUrl} alt={`Código QR para ${maquina.nombre_maquina}`} style={{ width: '150px', height: '150px' }} /> : <CircularProgress size={24} />}
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={7}>
                                <Card sx={{ mb: 3 }}>
                                    <CardContent>
                                        <Typography variant="h6" component="h3" gutterBottom>Registrar Nueva Recaudación</Typography>
                                        <RecaudacionForm maquinaId={maquina.id} precioJuego={maquina.precio_juego} onRecaudacionSuccess={fetchData} />
                                        <RecaudacionList recaudaciones={recaudaciones} />
                                    </CardContent>
                                </Card>
                                {/* --- NUEVA SECCIÓN DE INVENTARIO SIMPLIFICADA --- */}
                                {showInventorySection && (
                                    <Card sx={{ mb: 3 }}>
                                        <CardContent>
                                            <RegistroInventarioForm maquina={maquina} onRegistroSuccess={fetchData} />
                                            <RegistroInventarioList registros={inventario} />
                                        </CardContent>
                                    </Card>
                                )}

                                {showMaintenanceSection && (
                                    <Card>
                                        <CardContent>
                                            <MantenimientoForm maquinaId={maquina.id} onMantenimientoSuccess={fetchData} />
                                            <MantenimientoList mantenimientos={mantenimientos} />
                                        </CardContent>
                                    </Card>
                                )}
                                
                            </Grid>
                        </Grid>
                    </Box>
                )
    );
}

export default MachineDetail;