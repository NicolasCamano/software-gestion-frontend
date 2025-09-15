// frontend/src/components/MachineList.js

import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, List, ListItem, ListItemButton, ListItemText, Divider, CircularProgress } from '@mui/material';

// Recibimos el estado 'cargando'
function MachineList({ maquinas, cargando }) {
  
  // Si está cargando, mostramos un spinner
  if (cargando) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ mt: 2, p: 2, border: '1px solid #ddd', borderRadius: '8px' }}>
      <Typography variant="h6" component="h2">
        Máquinas en la Sala
      </Typography>
      <List>
        {maquinas.length === 0 ? (
          <ListItem>
            <ListItemText primary="No hay máquinas en esta sala." />
          </ListItem>
        ) : (
          maquinas.map((maquina, index) => (
            <React.Fragment key={maquina.id}>
              <ListItem disablePadding>
                <ListItemButton component={RouterLink} to={`/maquinas/${maquina.id}`}>
                  <ListItemText 
                    primary={maquina.nombre_maquina} 
                    secondary={`Código: ${maquina.codigo_maquina}`} 
                  />
                </ListItemButton>
              </ListItem>
              {index < maquinas.length - 1 && <Divider />}
            </React.Fragment>
          ))
        )}
      </List>
    </Box>
  );
}

export default MachineList;