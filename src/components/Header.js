// frontend/src/components/Header.js
import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const Header = () => {
    const { user, logoutUser } = useContext(AuthContext); // Sintonizamos el canal

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Software de Gestión
                </Typography>
                {user ? (
                    <>
                        <Typography sx={{ mr: 2 }}>Hola, {user.username}</Typography>
                        <Button color="inherit" onClick={logoutUser}>
                            Logout
                        </Button>
                    </>
                ) : (
                    <Button color="inherit" component={RouterLink} to="/login">
                        Login
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Header;