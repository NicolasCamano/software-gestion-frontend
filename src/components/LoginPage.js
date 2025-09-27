// frontend/src/components/LoginPage.js

import React, { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';

// Importamos los componentes de MUI que usaremos
import { Container, Box, TextField, Button, Typography, Paper, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import GamesIcon from '@mui/icons-material/Games';

const LoginPage = () => {
    const { loginUser } = useContext(AuthContext);
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

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
                background: 'linear-gradient(45deg, #1a237e 30%, #b71c1c 90%)'
            }}
        >
            <Container component="main" maxWidth="xs">
                <Paper elevation={6} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <GamesIcon sx={{ fontSize: 40, mb: 1 }} />
                    <Typography component="h1" variant="h5">
                        Arcade Control Center
                    </Typography>
                    <Box component="form" onSubmit={loginUser} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Nombre de Usuario"
                            name="username"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Contraseña"
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            // --- ¡LA CORRECCIÓN ESTÁ AQUÍ! ---
                            // Usamos 'InputProps' (con 'I' mayúscula) para modificar el contenedor del input.
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
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