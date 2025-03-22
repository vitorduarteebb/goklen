import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const tamanhoOptions = [
  { value: 'P', label: 'P' },
  { value: 'M', label: 'M' },
  { value: 'G', label: 'G' },
  { value: 'GG', label: 'GG' },
  { value: '48', label: '48' },
  { value: '50', label: '50' },
  { value: '52', label: '52' },
  { value: '54', label: '54' },
];

function ModeloCadastro() {
  const [formData, setFormData] = useState({
    nome: '',
    observacao: '',
    cor: '',
    tamanho: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/cadastro/modelos/', formData)
      .then(() => navigate('/modelos'))
      .catch(error => console.error(error));
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Paper sx={{ p:2 }}>
        <Typography variant="h5" gutterBottom>Cadastro de Modelo</Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Nome" name="nome" fullWidth margin="normal" value={formData.nome} onChange={handleChange} required />
          <TextField label="Observação" name="observacao" fullWidth margin="normal" value={formData.observacao} onChange={handleChange} multiline rows={3} />
          <TextField label="Cor" name="cor" fullWidth margin="normal" value={formData.cor} onChange={handleChange} />
          <FormControl fullWidth margin="normal">
            <InputLabel id="tamanho-label">Tamanho</InputLabel>
            <Select labelId="tamanho-label" name="tamanho" value={formData.tamanho} label="Tamanho" onChange={handleChange}>
              {tamanhoOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" type="submit" sx={{ mt:2 }}>Cadastrar Modelo</Button>
        </form>
      </Paper>
    </Container>
  );
}

export default ModeloCadastro;
