import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

function CorteCadastro() {
  const [formData, setFormData] = useState({
    codigo_mesa: '',
    data_corte: dayjs().format('YYYY-MM-DDTHH:mm'),
    modelo: ''
  });
  const [modelos, setModelos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8000/api/cadastro/modelos/')
      .then(response => setModelos(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/pedidos/cortes/', formData)
      .then(() => navigate('/cortes'))
      .catch(error => console.error(error));
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Paper sx={{ p:2 }}>
        <Typography variant="h5" gutterBottom>Cadastro de Corte</Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Código da Mesa" name="codigo_mesa" fullWidth margin="normal" value={formData.codigo_mesa} onChange={handleChange} required />
          <TextField
            label="Quantidade Cortada"
            name="quantidade_cortada"
            type="number"
            fullWidth
            margin="normal"
            value={formData.quantidade_cortada || ''}
            onChange={handleChange}
            required
            />

          <FormControl fullWidth margin="normal">
            <InputLabel id="modelo-label">Modelo</InputLabel>
            <Select labelId="modelo-label" name="modelo" value={formData.modelo} label="Modelo" onChange={handleChange} required>
              {modelos.map(modelo => (
                <MenuItem key={modelo.id} value={modelo.id}>{modelo.nome}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" type="submit" sx={{ mt:2 }}>Cadastrar Corte</Button>
        </form>
      </Paper>
    </Container>
  );
}

export default CorteCadastro;
