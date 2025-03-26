// FaturaEmbalagem.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Button, Grid, Box, Divider } from '@mui/material';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function FaturaEmbalagem() {
  const { id } = useParams(); // ID da embalagem
  const [embalagem, setEmbalagem] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8000/api/pedidos/embalagens/${id}/`)
      .then(response => {
        setEmbalagem(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar embalagem:", error);
        setLoading(false);
      });
  }, [id]);

  const handleLancarSaldo = () => {
    // Endpoint para lançar saldo na embalagem
    axios.post(`http://localhost:8000/api/pedidos/embalagens/${id}/lancar_saldo/`)
      .then(response => {
        alert(`SALDO LANÇADO COM SUCESSO. VALOR: R$ ${response.data.valor}`);
        navigate('/pedidos');
      })
      .catch(error => {
        console.error("Erro ao lançar saldo:", error.response.data);
        alert("Erro: " + (error.response.data.error || "Erro ao lançar saldo"));
      });
  };

  const handleCancelar = () => {
    navigate('/pedidos');
  };

  if (loading) return <Typography>CARREGANDO...</Typography>;
  if (!embalagem) return <Typography>EMBALAGEM NÃO ENCONTRADA.</Typography>;

  const pedido = embalagem.pedido;
  const corte = pedido ? pedido.corte : null;
  const modelo = corte && corte.modelo ? corte.modelo.nome : 'N/A';
  const embaladeira = embalagem.profissional ? embalagem.profissional.nome : 'N/A';
  // Cálculo do valor a pagar (valor_por_peca_embalagem * quantidade_inicial)
  const valorAPagar = embalagem.valor_por_peca_embalagem * (pedido ? pedido.quantidade_inicial : 0);

  return (
    <Container sx={{ mt: 4 }}>
      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" gutterBottom>
          ADICIONAR SALDO À CONTA DA EMBALADEIRA
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>MODELO:</strong> {modelo}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>CORTE (MESA):</strong> {corte ? corte.codigo_mesa : 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>QUANTIDADE INICIAL:</strong> {pedido ? pedido.quantidade_inicial : 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>EMBALADEIRA:</strong> {embaladeira}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>DATA (E):</strong> ____________
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">
              <strong>VALOR A LANÇAR:</strong> R$ {valorAPagar.toFixed(2)}
            </Typography>
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" color="primary" onClick={handleLancarSaldo} sx={{ mr: 2 }}>
            ADICIONAR SALDO
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleCancelar}>
            CANCELAR
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default FaturaEmbalagem;
