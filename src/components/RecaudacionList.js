// frontend/src/components/RecaudacionList.js

import React from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';

function RecaudacionList({ recaudaciones }) {
  if (!recaudaciones || recaudaciones.length === 0) {
    return <Typography sx={{ mt: 3, textAlign: 'center' }}>No hay registros de recaudación para esta máquina.</Typography>;
  }

  return (
    <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>Historial de Recaudaciones</Typography>
        <TableContainer component={Paper}>
            <Table size="small" aria-label="historial de recaudaciones">
                <TableHead>
                    <TableRow>
                        <TableCell>Fecha</TableCell>
                        <TableCell align="right">Cont. Anterior</TableCell>
                        <TableCell align="right">Cont. Actual</TableCell>
                        <TableCell align="right">Diferencia</TableCell>
                        <TableCell align="right">Recaudado ($)</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {/* Ordenamos las recaudaciones de la más reciente a la más antigua antes de mostrarlas */}
                {[...recaudaciones].sort((a, b) => new Date(b.fecha_recaudacion) - new Date(a.fecha_recaudacion)).map((rec) => (
                    <TableRow key={rec.id}>
                        <TableCell>{new Date(rec.fecha_recaudacion).toLocaleDateString()}</TableCell>
                        <TableCell align="right">{rec.contador_anterior}</TableCell>
                        <TableCell align="right">{rec.contador_actual}</TableCell>
                        <TableCell align="right">{rec.diferencia}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>{rec.recaudacion_calculada}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>
    </Box>
  );
}

export default RecaudacionList;