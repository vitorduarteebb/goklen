import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Paper } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ViesCadastro() {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    quantidade_em_estoque: 0,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/cadastro/vies/', formData)
      .then(response => {
        console.log(response.data);
        navigate('/modelos'); // ou para outra página de sua escolha
      })
      .catch(error => console.error('Erro ao cadastrar viés:', error));
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom>
          Cadastro de Viés
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Nome" name="nome" fullWidth margin="normal" value={formData.nome} onChange={handleChange} required />
          <TextField label="Descrição" name="descricao" fullWidth margin="normal" value={formData.descricao} onChange={handleChange} multiline rows={3} />
          <TextField label="Quantidade em Estoque" name="quantidade_em_estoque" type="number" fullWidth margin="normal" value={formData.quantidade_em_estoque} onChange={handleChange} required />
          <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
            Cadastrar
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default ViesCadastro;
