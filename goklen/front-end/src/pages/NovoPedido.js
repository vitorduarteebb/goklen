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
  Button, 
  Box 
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Function to remove accents (if needed for string comparison)
const removeAccents = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

function NovoPedido() {
  const [formData, setFormData] = useState({ corte: '', quantidade_inicial: '' });
  const [cortes, setCortes] = useState([]);
  const [consumoInfo, setConsumoInfo] = useState(null);
  const navigate = useNavigate();

  // Fetch available cortes (only those with quantity > 0)
  useEffect(() => {
    axios.get('http://localhost:8000/api/pedidos/cortes/')
      .then(response => {
        const cortesDisponiveis = response.data.filter(corte => corte.quantidade_cortada > 0);
        setCortes(cortesDisponiveis);
      })
      .catch(error => console.error("Erro ao buscar cortes:", error));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Calculate consumption info for each vinculo linked to the model
  useEffect(() => {
    const { corte, quantidade_inicial } = formData;
    if (!corte || !quantidade_inicial) {
      setConsumoInfo(null);
      return;
    }
    const selectedCorte = cortes.find(c => c.id === parseInt(corte, 10));
    if (selectedCorte && selectedCorte.modelo && selectedCorte.modelo.id) {
      const modeloId = selectedCorte.modelo.id;
      axios.get(`http://localhost:8000/api/cadastro/modeloaviamentos/?modelo=${modeloId}`)
        .then(response => {
          // Use paginated data if available; otherwise use response.data
          const vinculos = response.data.results ? response.data.results : response.data;
          console.log("Vínculos retornados:", vinculos.map(item => item?.aviamento?.nome));
          if (vinculos && vinculos.length > 0) {
            const infos = vinculos.map(vinculo => {
              const consumoPorPeca = parseFloat(vinculo.quantidade_por_peca);
              const totalConsumo = consumoPorPeca * parseInt(quantidade_inicial, 10);
              const aviamento = vinculo.aviamento;
              let calculo = {};
              if (aviamento.tipo_envio === "rolo" && aviamento.metragem_por_rolo) {
                calculo = {
                  tipo: "rolo",
                  metragem_por_rolo: aviamento.metragem_por_rolo,
                  total_consumo: totalConsumo,
                  rolos_utilizados: Math.ceil(totalConsumo / aviamento.metragem_por_rolo)
                };
              } else if (aviamento.tipo_envio === "pacote" && aviamento.quantidade_por_pacote) {
                calculo = {
                  tipo: "pacote",
                  quantidade_por_pacote: aviamento.quantidade_por_pacote,
                  total_consumo: totalConsumo,
                  pacotes_utilizados: Math.ceil(totalConsumo / aviamento.quantidade_por_pacote)
                };
              }
              return {
                aviamento: aviamento.nome,
                ...calculo
              };
            });
            setConsumoInfo(infos);
          } else {
            console.log("Nenhum vínculo de aviamento vinculado encontrado.");
            setConsumoInfo(null);
          }
        })
        .catch(error => {
          console.error("Erro ao buscar vínculos do modelo:", error);
          setConsumoInfo(null);
        });
    } else {
      setConsumoInfo(null);
    }
  }, [formData.corte, formData.quantidade_inicial, cortes]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      corte: parseInt(formData.corte, 10),
      quantidade_inicial: parseInt(formData.quantidade_inicial, 10)
    };
    axios.post('http://localhost:8000/api/pedidos/pedidos/', payload)
      .then(response => {
        console.log("Pedido criado:", response.data);
        navigate('/pedidos');
      })
      .catch(error => console.error("Erro ao criar pedido:", error.response ? error.response.data : error));
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
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
                    ? `Mesa: ${corte.codigo_mesa} | ${corte.modelo?.nome?.toUpperCase() || 'SEM MODELO'} | TAM: ${corte.modelo?.tamanho || '-'} | COR: ${corte.modelo?.cor || '-'}` 
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
          {consumoInfo && Array.isArray(consumoInfo) && consumoInfo.length > 0 && (
            <Paper sx={{ p: 2, my: 2, backgroundColor: "#e3f2fd" }}>
              <Typography variant="subtitle1" gutterBottom>
                Consumo de Aviamento Calculado:
              </Typography>
              {consumoInfo.map((info, index) => (
                <Box key={index} sx={{ mb: 1 }}>
                  <Typography variant="body1">
                    <strong>Aviamento:</strong> {info.aviamento.toUpperCase()}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Total Consumo:</strong> {info.total_consumo}
                  </Typography>
                  {info.tipo === "rolo" ? (
                    <Typography variant="body1">
                      <strong>Rolos Utilizados:</strong> {info.rolos_utilizados} (Cada rolo: {info.metragem_por_rolo} metros)
                    </Typography>
                  ) : info.tipo === "pacote" ? (
                    <Typography variant="body1">
                      <strong>Pacotes Utilizados:</strong> {info.pacotes_utilizados} (Cada pacote: {info.quantidade_por_pacote} unidades)
                    </Typography>
                  ) : null}
                </Box>
              ))}
            </Paper>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="contained" color="primary" type="submit">
              Criar Pedido
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}

export default NovoPedido;
