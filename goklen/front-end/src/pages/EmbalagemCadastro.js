import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function EmbalagemCadastro() {
  const [formData, setFormData] = useState({
    pedido: '',
    profissional: '',
    valor_por_peca_embalagem: ''
  });
  const [pedidos, setPedidos] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8000/api/pedidos/pedidos/')
      .then(response => {
        // Filter only orders with status "Aguardando Embaladeira"
        const pedidosDisponiveis = response.data.filter(p => p.status === "Aguardando Embaladeira");
        setPedidos(pedidosDisponiveis);
      })
      .catch(error => console.error("Erro ao buscar pedidos:", error));

    axios.get('http://localhost:8000/api/cadastro/profissionais/')
      .then(response => setProfissionais(response.data))
      .catch(error => console.error("Erro ao buscar profissionais:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'pedido' ? parseInt(value, 10) : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados enviados:", formData);
    axios.post('http://localhost:8000/api/pedidos/embalagens/', formData)
      .then(() => navigate('/pedidos'))
      .catch(error => console.error("Erro no cadastro de embalagem:", error));
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom>Atribuição para Embalagem</Typography>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="pedido-label">Pedido</InputLabel>
            <Select
              labelId="pedido-label"
              name="pedido"
              value={formData.pedido}
              label="Pedido"
              onChange={handleChange}
            >
              {pedidos.map(pedido => (
                <MenuItem key={pedido.id} value={pedido.id}>
                  Pedido #{pedido.id} - Qtd: {pedido.quantidade_inicial}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="profissional-label">Profissional</InputLabel>
            <Select
              labelId="profissional-label"
              name="profissional"
              value={formData.profissional}
              label="Profissional"
              onChange={handleChange}
            >
              {profissionais.map(prof => (
                <MenuItem key={prof.id} value={prof.id}>
                  {prof.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Valor por Peça (Embalagem)"
            name="valor_por_peca_embalagem"
            type="number"
            fullWidth
            margin="normal"
            value={formData.valor_por_peca_embalagem}
            onChange={handleChange}
            required
          />
          <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
            Enviar Embalagem
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default EmbalagemCadastro;
