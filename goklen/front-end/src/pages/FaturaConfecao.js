import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Button, Grid } from '@mui/material';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function FaturaConfecao() {
  const { id } = useParams();
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
        console.error("Erro ao buscar confecção:", error);
        setLoading(false);
      });
  }, [id]);

  const handlePagar = () => {
    axios.post(`http://localhost:8000/api/pedidos/confecoes/${id}/pagar/`)
      .then(response => {
        alert(`Pagamento efetuado com sucesso. Valor pago: R$ ${response.data.valor_pago}`);
        navigate('/pedidos');
      })
      .catch(error => {
        console.error("Erro ao efetuar pagamento:", error.response.data);
        alert("Erro: " + (error.response.data.error || "Erro ao efetuar pagamento"));
      });
  };

  const handleCancelar = () => {
    navigate('/pedidos');
  };

  if (loading) return <Typography>Carregando...</Typography>;
  if (!confecao) return <Typography>Confecção não encontrada.</Typography>;

  const pedido = confecao.pedido;
  const corte = pedido ? pedido.corte : null;
  const modelo = corte && corte.modelo ? corte.modelo.nome : 'N/A';
  const profissional = confecao.profissional ? confecao.profissional.nome : 'N/A';
  const dadosBancarios = confecao.profissional && confecao.profissional.dados_bancarios
    ? JSON.stringify(confecao.profissional.dados_bancarios)
    : 'N/A';
  const valorAPagar = confecao.valor_por_peca_confecao * (pedido ? pedido.quantidade_inicial : 0);

  return (
    <Container sx={{ mt: 4 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom>Fatura de Confecção</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography><strong>Modelo:</strong> {modelo}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography><strong>Corte (Mesa):</strong> {corte ? corte.codigo_mesa : 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography><strong>Quantidade Inicial:</strong> {pedido ? pedido.quantidade_inicial : 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography><strong>Profissional:</strong> {profissional}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography><strong>Dados Bancários:</strong> {dadosBancarios}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography><strong>Valor a Pagar:</strong> R$ {valorAPagar}</Typography>
          </Grid>
        </Grid>
        <Button variant="contained" color="primary" onClick={handlePagar} sx={{ mt: 2, mr: 2 }}>
          PAGAR
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleCancelar} sx={{ mt: 2 }}>
          CANCELAR
        </Button>
      </Paper>
    </Container>
  );
}

export default FaturaConfecao;
