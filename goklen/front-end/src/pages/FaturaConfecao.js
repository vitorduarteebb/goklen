import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Button, 
  Grid, 
  Box,
  Divider
} from '@mui/material';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function FaturaConfecao() {
  const { id } = useParams(); // ID da confecção (rota: /confecoes/fatura/:id)
  const [confecao, setConfecao] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8000/api/pedidos/confecoes/${id}/`)
      .then(response => {
        setConfecao(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("ERRO AO BUSCAR CONFECÇÃO:", error);
        setLoading(false);
      });
  }, [id]);

  const handleLancarSaldo = () => {
    // Registra o saldo no extrato, adicionando-o à conta da profissional que realizou o serviço
    axios.post(`http://localhost:8000/api/pedidos/confecoes/${id}/lancar_saldo/`)
      .then(response => {
        alert(`SALDO ADICIONADO À CONTA DA PROFISSIONAL COM SUCESSO. VALOR: R$ ${response.data.valor}`);
        navigate('/pedidos');
      })
      .catch(error => {
        console.error("ERRO AO ADICIONAR SALDO:", error.response.data);
        alert("ERRO: " + (error.response.data.error || "ERRO AO ADICIONAR SALDO"));
      });
  };

  const handleCancelar = () => {
    navigate('/pedidos');
  };

  if (loading) return <Typography>CARREGANDO...</Typography>;
  if (!confecao) return <Typography>CONFECÇÃO NÃO ENCONTRADA.</Typography>;

  const pedido = confecao.pedido;
  const corte = pedido ? pedido.corte : null;
  const modelo = corte && corte.modelo ? corte.modelo.nome : 'N/A';
  const profissional = confecao.profissional ? confecao.profissional.nome : 'N/A';
  const saldoLancar = confecao.valor_por_peca_confecao * (pedido ? pedido.quantidade_inicial : 0);

  return (
    <Container sx={{ mt: 4 }}>
      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" gutterBottom>
          ADICIONAR SALDO À CONTA DA PROFISSIONAL
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
              <strong>PROFISSIONAL:</strong> {profissional}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">
              <strong>SALDO A LANÇAR:</strong> R$ {saldoLancar.toFixed(2)}
            </Typography>
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleLancarSaldo} 
            sx={{ mr: 2 }}
          >
            ADICIONAR SALDO
          </Button>
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={handleCancelar}
          >
            CANCELAR
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default FaturaConfecao;
