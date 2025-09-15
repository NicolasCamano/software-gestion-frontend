// frontend/src/components/RegistroInventarioList.js

import React from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';

function RegistroInventarioList({ registros }) {
  if (!Array.isArray(registros) || registros.length === 0) {
    return <Typography sx={{ mt: 3, textAlign: 'center', fontStyle: 'italic' }}>No hay registros de inventario.</Typography>;
  }

  const ultimosRegistros = [...registros].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>Historial de Inventario</Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Fecha</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Encontrado</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Repuesto</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Stock Final</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ultimosRegistros.map((reg) => (
              <TableRow key={reg.id}>
                <TableCell>{new Date(reg.fecha).toLocaleDateString()}</TableCell>
                <TableCell align="right">{reg.stock_encontrado}</TableCell>
                <TableCell align="right">{reg.cantidad_repuesta}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>{reg.stock_encontrado + reg.cantidad_repuesta}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default RegistroInventarioList;