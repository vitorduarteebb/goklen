import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper as InnerPaper,
} from '@mui/material';
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
    tamanho: '',
  });
  const [aviamentosOptions, setAviamentosOptions] = useState([]);
  const [selectedAviamentoId, setSelectedAviamentoId] = useState('');
  const [aviamentoQuantidade, setAviamentoQuantidade] = useState('');
  const [modeloAviamentos, setModeloAviamentos] = useState([]); // Each item: { aviamento, quantidade_por_peca }
  const navigate = useNavigate();

  // Fetch available aviamentos
  useEffect(() => {
    axios
      .get('http://localhost:8000/api/cadastro/aviamentos/')
      .then((response) => setAviamentosOptions(response.data))
      .catch((error) => console.error('Erro ao buscar aviamentos:', error));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add an aviamento link to the model
  const handleAddAviamento = () => {
    if (!selectedAviamentoId || !aviamentoQuantidade) {
      alert('Selecione um aviamento e informe a quantidade/metragem.');
      return;
    }
    const quantidade = parseFloat(aviamentoQuantidade);
    if (isNaN(quantidade) || quantidade <= 0) {
      alert('Informe um número válido.');
      return;
    }
    const exists = modeloAviamentos.find(
      (item) => item.aviamento === selectedAviamentoId
    );
    if (exists) {
      // Update the quantity if already exists
      setModeloAviamentos(
        modeloAviamentos.map((item) =>
          item.aviamento === selectedAviamentoId
            ? { ...item, quantidade_por_peca: item.quantidade_por_peca + quantidade }
            : item
        )
      );
    } else {
      setModeloAviamentos([
        ...modeloAviamentos,
        { aviamento: selectedAviamentoId, quantidade_por_peca: quantidade },
      ]);
    }
    // Clear fields
    setSelectedAviamentoId('');
    setAviamentoQuantidade('');
  };

  const handleRemoveAviamento = (id) => {
    setModeloAviamentos(modeloAviamentos.filter((item) => item.aviamento !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Create the model
    axios
      .post('http://localhost:8000/api/cadastro/modelos/', formData)
      .then((response) => {
        const modeloId = response.data.id;
        // Create the links (ModeloAviamento) for each aviamento added
        const promises = modeloAviamentos.map((item) =>
          axios.post('http://localhost:8000/api/cadastro/modeloaviamentos/', {
            modelo: modeloId,
            aviamento_id: parseInt(item.aviamento, 10),  // Use aviamento_id here!
            quantidade_por_peca: item.quantidade_por_peca,
          })
        );
        Promise.all(promises)
          .then(() => navigate('/modelos'))
          .catch((error) =>
            console.error('Erro ao vincular aviamentos ao modelo:', error)
          );
      })
      .catch((error) => console.error('Erro ao cadastrar modelo:', error));
  };

  // Conditional label: if the selected aviamento name contains "elastico", use "Metragem utilizada (metros)"
  const selectedAviamento = aviamentosOptions.find(
    (av) => av.id === selectedAviamentoId
  );
  const quantidadeLabel =
    selectedAviamento && selectedAviamento.nome.toLowerCase().includes('elastico')
      ? 'Metragem utilizada (metros)'
      : 'Quantidade por peça';

  return (
    <Container sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Cadastro de Modelo</Typography>
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
            label="Observação"
            name="observacao"
            fullWidth
            margin="normal"
            value={formData.observacao}
            onChange={handleChange}
            multiline
            rows={3}
          />
          <TextField
            label="Cor"
            name="cor"
            fullWidth
            margin="normal"
            value={formData.cor}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="tamanho-label">Tamanho</InputLabel>
            <Select
              labelId="tamanho-label"
              name="tamanho"
              value={formData.tamanho}
              label="Tamanho"
              onChange={handleChange}
            >
              {tamanhoOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Section to link aviamentos */}
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Aviamentos Necessários
          </Typography>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id="aviamento-label">Aviamento</InputLabel>
                  <Select
                    labelId="aviamento-label"
                    name="aviamento"
                    value={selectedAviamentoId}
                    label="Aviamento"
                    onChange={(e) => setSelectedAviamentoId(e.target.value)}
                  >
                    {aviamentosOptions.map((av) => (
                      <MenuItem key={av.id} value={av.id}>
                        {av.nome} {av.marca ? `- ${av.marca}` : ''}{' '}
                        {av.cor ? `- ${av.cor}` : ''}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label={quantidadeLabel}
                  name="aviamentoQuantidade"
                  type="number"
                  fullWidth
                  value={aviamentoQuantidade}
                  onChange={(e) => setAviamentoQuantidade(e.target.value)}
                />
              </Grid>
              <Grid item xs={2}>
                <Button variant="contained" onClick={handleAddAviamento}>
                  Adicionar
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {modeloAviamentos.length > 0 && (
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1">
                Aviamentos vinculados:
              </Typography>
              {modeloAviamentos.map((item, index) => {
                const avi = aviamentosOptions.find(
                  (av) => av.id === item.aviamento
                );
                return (
                  <InnerPaper
                    key={index}
                    variant="outlined"
                    sx={{ p: 1, mt: 1 }}
                  >
                    <Grid container justifyContent="space-between" alignItems="center">
                      <Grid item xs={10}>
                        <Typography variant="body2">
                          {avi
                            ? `${avi.nome}${avi.marca ? ' - ' + avi.marca : ''}${
                                avi.cor ? ' - ' + avi.cor : ''
                              }`
                            : 'Aviamento não encontrado'}{' '}
                          - {item.quantidade_por_peca}{' '}
                          {avi && avi.nome.toLowerCase().includes('elastico')
                            ? 'metros'
                            : 'unidade(s)'}
                        </Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Button
                          variant="text"
                          color="error"
                          onClick={() => handleRemoveAviamento(item.aviamento)}
                        >
                          Remover
                        </Button>
                      </Grid>
                    </Grid>
                  </InnerPaper>
                );
              })}
            </Paper>
          )}

          <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
            Cadastrar Modelo
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default ModeloCadastro;
