import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, TextField, Button } from '@mui/material';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function Recontagem() {
  const { id } = useParams(); // Order ID
  const [quantidadeConferida, setQuantidadeConferida] = useState('');
  const [pedido, setPedido] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the order details to show the current quantities and info
    axios.get(`http://localhost:8000/api/pedidos/pedidos/${id}/`)
      .then(response => setPedido(response.data))
      .catch(error => console.error("Erro ao buscar pedido:", error));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { quantidade_conferida: quantidadeConferida };
    axios.post(`http://localhost:8000/api/pedidos/pedidos/${id}/conferir/`, data)
      .then(response => {
        alert("Conferência realizada com sucesso.");
        navigate('/pedidos');
      })
      .catch(error => {
        console.error("Erro na conferência:", error.response?.data || error);
        alert("Erro na conferência: " + (error.response?.data?.error || "Erro desconhecido"));
      });
  };

  if (!pedido) return <Typography>Carregando pedido...</Typography>;

  return (
    <Container sx={{ mt: 4 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom>Conferência/Recontagem</Typography>
        <Typography variant="body1">
          Pedido #{pedido.id} - Qtd. Inicial: {pedido.quantidade_inicial}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Quantidade Conferida"
            type="number"
            fullWidth
            margin="normal"
            value={quantidadeConferida}
            onChange={(e) => setQuantidadeConferida(e.target.value)}
            required
          />
          <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
            Confirmar Conferência
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default Recontagem;
