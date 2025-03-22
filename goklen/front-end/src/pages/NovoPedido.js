import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  TextField, 
  Button 
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function NovoPedido() {
  const [formData, setFormData] = useState({
    corte: '',
    quantidade_inicial: '',
    produto: '',
    quantidade_utilizada: ''
  });
  const [cortes, setCortes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch available cortes with positive quantity
    axios.get('http://localhost:8000/api/pedidos/cortes/')
      .then(response => {
        // Only keep cortes where quantidade_cortada is greater than 0
        const cortesDisponiveis = response.data.filter(corte => corte.quantidade_cortada > 0);
        setCortes(cortesDisponiveis);
      })
      .catch(error => console.error("Erro ao buscar cortes:", error));

    // Fetch available products from stock
    axios.get('http://localhost:8000/api/cadastro/produtos/')
      .then(response => setProdutos(response.data))
      .catch(error => console.error("Erro ao buscar produtos:", error));
  }, []);

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Frontend sends product id and quantity_utilizada along with the corte and quantidade_inicial.
    axios.post('http://localhost:8000/api/pedidos/pedidos/', formData)
      .then(() => navigate('/pedidos'))
      .catch(error => console.error("Erro ao criar pedido:", error));
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom>Novo Pedido</Typography>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="corte-label">Corte</InputLabel>
            <Select
              labelId="corte-label"
              name="corte"
              value={formData.corte}
              label="Corte"
              onChange={handleChange}
            >
              {cortes.map(corte => (
                <MenuItem key={corte.id} value={corte.id}>
                  {corte.codigo_mesa 
                    ? `Mesa: ${corte.codigo_mesa} - ${corte.modelo?.nome || 'Sem Modelo'}${corte.modelo?.tamanho ? ` - Tamanho: ${corte.modelo.tamanho}` : ''}`
                    : '-'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Quantidade Inicial"
            name="quantidade_inicial"
            type="number"
            fullWidth
            margin="normal"
            value={formData.quantidade_inicial}
            onChange={handleChange}
            required
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="produto-label">Produto</InputLabel>
            <Select
              labelId="produto-label"
              name="produto"
              value={formData.produto}
              label="Produto"
              onChange={handleChange}
            >
              {produtos.map(prod => (
                <MenuItem key={prod.id} value={prod.id}>
                  {prod.nome} - {prod.marca} (Disponível: {prod.quantidade})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Quantidade Utilizada"
            name="quantidade_utilizada"
            type="number"
            fullWidth
            margin="normal"
            value={formData.quantidade_utilizada}
            onChange={handleChange}
            required
          />
          <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
            Criar Pedido
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default NovoPedido;
