import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function ExtratoProfissional() {
  const { id } = useParams(); // Professional ID passed in the URL
  const [extrato, setExtrato] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8000/api/pagamentos/pagamentos/?profissional=${id}`)
      .then(response => setExtrato(response.data))
      .catch(error => console.error("Erro ao buscar extrato:", error));
  }, [id]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Extrato da Profissional</Typography>
      <Paper sx={{ p: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Pedido</TableCell>
              <TableCell>Valor Pago</TableCell>
              <TableCell>Data do Pagamento</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {extrato.length > 0 ? (
              extrato.map(record => (
                <TableRow key={record.id}>
                  <TableCell>{record.id}</TableCell>
                  <TableCell>{record.pedido}</TableCell>
                  <TableCell>{record.valor}</TableCell>
                  <TableCell>{new Date(record.data_pagamento).toLocaleString()}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Nenhum registro encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate(-1)} 
          sx={{ mt: 2 }}
        >
          Voltar
        </Button>
      </Paper>
    </Container>
  );
}

export default ExtratoProfissional;
