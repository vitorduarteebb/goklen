import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  MenuItem,
  Grid,
  Box,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AviamentoCadastro() {
  const [formData, setFormData] = useState({
    nome: '',
    marca: '',         // Novo campo
    descricao: '',
    cor: '',
    quantidade_em_estoque: '', // inicia como string para evitar conversões prematuras
    tipo_envio: 'unitario',    // "unitario", "rolo" ou "pacote"
    metragem_por_rolo: '',
    quantidade_por_pacote: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === 'quantidade_em_estoque') {
      newValue = value === '' ? '' : parseInt(value, 10);
    } else if (name === 'metragem_por_rolo' || name === 'quantidade_por_pacote') {
      newValue = value === '' ? '' : parseFloat(value);
    }
    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Converter valores numéricos ou definir null se estiverem vazios
    const submitData = {
      ...formData,
      quantidade_em_estoque: formData.quantidade_em_estoque === '' ? 0 : formData.quantidade_em_estoque,
      metragem_por_rolo: formData.metragem_por_rolo === '' ? null : formData.metragem_por_rolo,
      quantidade_por_pacote: formData.quantidade_por_pacote === '' ? null : formData.quantidade_por_pacote,
    };

    axios
      .post('http://localhost:8000/api/cadastro/aviamentos/', submitData)
      .then((response) => {
        console.log('Aviamento cadastrado:', response.data);
        // Redireciona para a página de estoque (produtos)
        navigate('/produtos');
      })
      .catch((error) => console.error('Erro ao cadastrar aviamento:', error));
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" align="center" gutterBottom>
          Cadastro de Aviamentos
        </Typography>
        <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                size="small"
                fullWidth
                label="Nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
              />
            </Grid>
            {/* Novo campo Marca */}
            <Grid item xs={12}>
              <TextField
                size="small"
                fullWidth
                label="Marca"
                name="marca"
                value={formData.marca}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                size="small"
                fullWidth
                label="Descrição"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                size="small"
                fullWidth
                label="Cor"
                name="cor"
                value={formData.cor}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                size="small"
                type="number"
                fullWidth
                label="Quantidade em Estoque"
                name="quantidade_em_estoque"
                value={formData.quantidade_em_estoque}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                size="small"
                select
                fullWidth
                label="Tipo de Envio"
                name="tipo_envio"
                value={formData.tipo_envio}
                onChange={handleChange}
                required
              >
                <MenuItem value="unitario">Unitário</MenuItem>
                <MenuItem value="rolo">Rolo</MenuItem>
                <MenuItem value="pacote">Pacote</MenuItem>
              </TextField>
            </Grid>
            {formData.tipo_envio === 'rolo' && (
              <Grid item xs={12}>
                <TextField
                  size="small"
                  type="number"
                  fullWidth
                  label="Metragem por Rolo (metros)"
                  name="metragem_por_rolo"
                  value={formData.metragem_por_rolo}
                  onChange={handleChange}
                  required
                />
              </Grid>
            )}
            {formData.tipo_envio === 'pacote' && (
              <Grid item xs={12}>
                <TextField
                  size="small"
                  type="number"
                  fullWidth
                  label="Quantidade por Pacote"
                  name="quantidade_por_pacote"
                  value={formData.quantidade_por_pacote}
                  onChange={handleChange}
                  required
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <Button fullWidth variant="contained" type="submit" sx={{ mt: 1 }}>
                Cadastrar Aviamento
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}

export default AviamentoCadastro;
