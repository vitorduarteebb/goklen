import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ProfissionalCadastro() {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    endereco: '',
    categoria: '',
    tipoPagamento: '',
    // Campos para PIX:
    chavePix: '',
    tipoChavePix: '',
    // Campos para Transferência:
    banco: '',
    agencia: '',
    conta: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Cria o objeto de dados bancários de acordo com o método selecionado
    const dadosBancarios = { metodo: formData.tipoPagamento };

    if (formData.tipoPagamento === 'PIX') {
      dadosBancarios.chavePix = formData.chavePix;
      dadosBancarios.tipoChavePix = formData.tipoChavePix;
    } else if (formData.tipoPagamento === 'Transferencia') {
      dadosBancarios.banco = formData.banco;
      dadosBancarios.agencia = formData.agencia;
      dadosBancarios.conta = formData.conta;
    }

    // Constrói o payload para o cadastro
    const payload = {
      nome: formData.nome,
      cpf: formData.cpf,
      endereco: formData.endereco, 
      categoria: formData.categoria,
      dados_bancarios: dadosBancarios
    };
    

    axios.post('http://localhost:8000/api/cadastro/profissionais/', payload)
      .then(response => {
        console.log(response.data);
        navigate('/profissionais');
      })
      .catch(error => console.error('Erro no cadastro:', error));
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom>Cadastro de Profissional</Typography>
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
            label="CPF"
            name="cpf"
            fullWidth
            margin="normal"
            value={formData.cpf}
            onChange={handleChange}
            required
          />
          <TextField
            label="Endereço"
            name="endereco"
            fullWidth
            margin="normal"
            value={formData.endereco}
            onChange={handleChange}
            required
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="categoria-label">Categoria</InputLabel>
            <Select
              labelId="categoria-label"
              name="categoria"
              value={formData.categoria}
              label="Categoria"
              onChange={handleChange}
            >
              <MenuItem value="FACCIONISTA">FACCIONISTA</MenuItem>
              <MenuItem value="EMBALADEIRA">EMBALADEIRA</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="tipoPagamento-label">Método de Pagamento</InputLabel>
            <Select
              labelId="tipoPagamento-label"
              name="tipoPagamento"
              value={formData.tipoPagamento}
              label="Método de Pagamento"
              onChange={handleChange}
            >
              <MenuItem value="PIX">PIX</MenuItem>
              <MenuItem value="Transferencia">Transferência</MenuItem>
              <MenuItem value="Dinheiro">Dinheiro</MenuItem>
            </Select>
          </FormControl>
          {formData.tipoPagamento === 'PIX' && (
            <>
              <TextField
                label="Chave PIX"
                name="chavePix"
                fullWidth
                margin="normal"
                value={formData.chavePix}
                onChange={handleChange}
                required
              />
              <FormControl fullWidth margin="normal" required>
                <InputLabel id="tipoChavePix-label">Tipo de Chave</InputLabel>
                <Select
                  labelId="tipoChavePix-label"
                  name="tipoChavePix"
                  value={formData.tipoChavePix}
                  label="Tipo de Chave"
                  onChange={handleChange}
                >
                  <MenuItem value="Aleatória">Chave Aleatória</MenuItem>
                  <MenuItem value="CPF">CPF</MenuItem>
                  <MenuItem value="Telefone">Telefone</MenuItem>
                  <MenuItem value="Email">Email</MenuItem>
                </Select>
              </FormControl>
            </>
          )}
          {formData.tipoPagamento === 'Transferencia' && (
            <>
              <TextField
                label="Banco"
                name="banco"
                fullWidth
                margin="normal"
                value={formData.banco}
                onChange={handleChange}
                required
              />
              <TextField
                label="Agência"
                name="agencia"
                fullWidth
                margin="normal"
                value={formData.agencia}
                onChange={handleChange}
                required
              />
              <TextField
                label="Conta"
                name="conta"
                fullWidth
                margin="normal"
                value={formData.conta}
                onChange={handleChange}
                required
              />
            </>
          )}
          <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
            Cadastrar Profissional
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default ProfissionalCadastro;
