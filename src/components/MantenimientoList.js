// frontend/src/components/MantenimientoList.js

import React from 'react';
import { Typography, List, ListItem, ListItemText, Divider, Paper, Box } from '@mui/material';

function MantenimientoList({ mantenimientos }) {
  // Verificación de seguridad: si 'mantenimientos' no es una lista, no intentes renderizar.
  if (!Array.isArray(mantenimientos) || mantenimientos.length === 0) {
    return <Typography sx={{ mt: 3, textAlign: 'center', fontStyle: 'italic' }}>No hay registros de mantenimiento para esta máquina.</Typography>;
  }

  // Ordenamos y nos quedamos solo con los últimos 5 registros
  const ultimosMantenimientos = [...mantenimientos]
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .slice(0, 5);

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>Últimos Mantenimientos</Typography>
      <Paper variant="outlined">
        <List sx={{ p: 0 }}>
          {ultimosMantenimientos.map((mant, index) => (
            <React.Fragment key={mant.id}>
              <ListItem>
                <ListItemText
                  primary={mant.descripcion}
                  secondary={`Realizado el: ${new Date(mant.fecha).toLocaleString()}`}
                />
              </ListItem>
              {index < ultimosMantenimientos.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
}

export default MantenimientoList;