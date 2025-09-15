// frontend/src/components/SalaList.js

import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, List, ListItem, ListItemButton, ListItemText, Divider } from '@mui/material';

// Esta versión solo necesita la lista de salas para mostrarla.
// No necesita 'onSalaSelect' ni 'salaSeleccionadaId'.
function SalaList({ salas }) {
  // Verificación de seguridad: si 'salas' no es un array, no intentes renderizar.
  if (!Array.isArray(salas)) {
    return <p>Cargando salas...</p>; // O un spinner
  }

  return (
    <Box sx={{ mt: 2, p: 2, border: '1px solid #ddd', borderRadius: '8px' }}>
      <Typography variant="h6" component="h2">
        Salas Existentes
      </Typography>
      <List>
        {salas.length === 0 ? (
          <ListItem>
            <ListItemText primary="No hay salas creadas." />
          </ListItem>
        ) : (
          salas.map((sala, index) => (
            <React.Fragment key={sala.id}>
              <ListItem disablePadding>
                {/* CADA ELEMENTO DE LA LISTA ES AHORA UN ENLACE DIRECTO */}
                <ListItemButton component={RouterLink} to={`/salas/${sala.id}`}>
                  <ListItemText 
                    primary={sala.nombre_sala} 
                    secondary={sala.direccion || 'Sin dirección'} 
                  />
                </ListItemButton>
              </ListItem>
              {index < salas.length - 1 && <Divider />}
            </React.Fragment>
          ))
        )}
      </List>
    </Box>
  );
}

export default SalaList;