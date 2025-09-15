// frontend/src/components/LoginPage.js

import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Container, Box, TextField, Button, Typography, Paper } from '@mui/material';
import GamesIcon from '@mui/icons-material/Games'; // Un ícono temático

const LoginPage = () => {
    const { loginUser } = useContext(AuthContext);

    return (
        <Box 
            sx={{
                height: '100vh', 
                width: '100vw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'fixed',
                top: 0,
                left: 0,
                // Un fondo degradado temático
                background: 'linear-gradient(45deg, #1a237e 30%, #b71c1c 90%)'
            }}
        >
            <Container component="main" maxWidth="xs">
                <Paper elevation={6} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <GamesIcon sx={{ fontSize: 40, mb: 1 }} />
                    <Typography component="h1" variant="h5">
                        Machine Control Center
                    </Typography>
                    <Box component="form" onSubmit={loginUser} noValidate sx={{ mt: 1 }}>
                        <TextField margin="normal" required fullWidth id="username" label="Nombre de Usuario" name="username" autoFocus />
                        <TextField margin="normal" required fullWidth name="password" label="Contraseña" type="password" id="password" />
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                            Entrar
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default LoginPage;