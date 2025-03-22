import React, { useState } from 'react';
import { Container, Typography, Paper, TextField, Button } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ProdutoCadastro() {
  const [formData, setFormData] = useState({
    nome: '',
    marca: '',
    quantidade: 0
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'quantidade' ? parseInt(value, 10) : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:8000/api/cadastro/produtos/', formData)
      .then((response) => {
        console.log("Produto cadastrado:", response.data);
        navigate('/produtos');
      })
      .catch((error) => console.error("Erro ao cadastrar produto:", error));
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom>
          Cadastro de Produto
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nome"
            name="nome"
            fullWidth
            margin="normal"
            value={formData.nome}
            onChange={handleChange}
            required
          />
          <TextField
            label="Marca"
            name="marca"
            fullWidth
            margin="normal"
            value={formData.marca}
            onChange={handleChange}
            required
          />
          <TextField
            label="Quantidade"
            name="quantidade"
            type="number"
            fullWidth
            margin="normal"
            value={formData.quantidade}
            onChange={handleChange}
            required
          />
          <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
            Cadastrar Produto
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default ProdutoCadastro;
