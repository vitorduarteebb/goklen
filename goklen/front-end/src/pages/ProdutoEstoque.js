import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TextField,
  TableSortLabel,
  Box,
} from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';

const getHeaderStyle = {
  fontWeight: 'bold'
};

function AviamentoEstoque() {
  const [aviamentos, setAviamentos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  // Atualize o endpoint para o caminho correto
  const fetchAviamentos = () => {
    axios.get('http://localhost:8000/api/cadastro/aviamentos/')
      .then(response => setAviamentos(response.data))
      .catch(error => console.error("Erro ao buscar aviamentos:", error));
  };

  useEffect(() => {
    fetchAviamentos();
  }, []);

  // Filtra aviamentos pelo termo de busca (ID, Nome, Marca, Cor ou Descrição)
  const filterAviamentos = (data) => {
    if (!searchTerm.trim()) return data;
    return data.filter(aviamento => {
      const term = searchTerm.toLowerCase();
      const idMatch = aviamento.id.toString().includes(term);
      const nomeMatch = aviamento.nome?.toLowerCase().includes(term);
      const marcaMatch = aviamento.marca?.toLowerCase().includes(term);
      const corMatch = aviamento.cor?.toLowerCase().includes(term);
      const descricaoMatch = aviamento.descricao?.toLowerCase().includes(term);
      return idMatch || nomeMatch || marcaMatch || corMatch || descricaoMatch;
    });
  };

  // Ordenação
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const sortData = (data) => {
    if (!sortBy) return data;
    return [...data].sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'id':
          aValue = a.id;
          bValue = b.id;
          break;
        case 'nome':
          aValue = a.nome || '';
          bValue = b.nome || '';
          break;
        case 'marca':
          aValue = a.marca || '';
          bValue = b.marca || '';
          break;
        case 'cor':
          aValue = a.cor || '';
          bValue = b.cor || '';
          break;
        case 'quantidade_em_estoque':
          aValue = a.quantidade_em_estoque;
          bValue = b.quantidade_em_estoque;
          break;
        case 'descricao':
          aValue = a.descricao || '';
          bValue = b.descricao || '';
          break;
        default:
          aValue = '';
          bValue = '';
      }
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const filteredAviamentos = sortData(filterAviamentos(aviamentos));

  // Separa aviamentos ativos (com estoque > 0) e esgotados (estoque = 0)
  const activeAviamentos = filteredAviamentos.filter(item => item.quantidade_em_estoque > 0);
  const finishedAviamentos = filteredAviamentos.filter(item => item.quantidade_em_estoque === 0);

  // Ações para atualizar estoque
  const handleSomar = (aviamento) => {
    const valor = prompt("Informe a quantidade a somar:");
    if (valor === null) return;
    const quantidade = parseInt(valor, 10);
    if (isNaN(quantidade) || quantidade <= 0) {
      alert("Informe um número válido.");
      return;
    }
    const novaQuantidade = aviamento.quantidade_em_estoque + quantidade;
    axios.patch(`http://localhost:8000/api/cadastro/aviamentos/${aviamento.id}/`, { quantidade_em_estoque: novaQuantidade })
      .then(() => fetchAviamentos())
      .catch(error => console.error("Erro ao somar quantidade:", error));
  };

  const handleSubtrair = (aviamento) => {
    const valor = prompt("Informe a quantidade a subtrair:");
    if (valor === null) return;
    const quantidade = parseInt(valor, 10);
    if (isNaN(quantidade) || quantidade <= 0) {
      alert("Informe um número válido.");
      return;
    }
    if (quantidade > aviamento.quantidade_em_estoque) {
      alert("Quantidade a subtrair maior que o estoque.");
      return;
    }
    const novaQuantidade = aviamento.quantidade_em_estoque - quantidade;
    axios.patch(`http://localhost:8000/api/cadastro/aviamentos/${aviamento.id}/`, { quantidade_em_estoque: novaQuantidade })
      .then(() => fetchAviamentos())
      .catch(error => console.error("Erro ao subtrair quantidade:", error));
  };

  const handleExcluir = (aviamentoId) => {
    if (window.confirm("Tem certeza que deseja excluir este aviamento?")) {
      axios.delete(`http://localhost:8000/api/cadastro/aviamentos/${aviamentoId}/`)
        .then(() => fetchAviamentos())
        .catch(error => console.error("Erro ao excluir aviamento:", error));
    }
  };

  const renderActions = (aviamento) => (
    <>
      <Button 
        variant="outlined" 
        color="primary" 
        size="small" 
        onClick={() => handleSomar(aviamento)} 
        sx={{ mr: 1 }}
      >
        Somar
      </Button>
      <Button 
        variant="outlined" 
        color="secondary" 
        size="small" 
        onClick={() => handleSubtrair(aviamento)} 
        sx={{ mr: 1 }}
      >
        Subtrair
      </Button>
      <Button 
        variant="outlined" 
        color="error" 
        size="small" 
        onClick={() => handleExcluir(aviamento.id)}
      >
        Excluir
      </Button>
    </>
  );

  const renderTable = (data, tableTitle, paperProps = {}) => (
    <Paper sx={{ p: 2, mt: 4, ...paperProps }}>
      <Typography variant="h5" gutterBottom>{tableTitle}</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'id'}
                direction={sortBy === 'id' ? sortOrder : 'asc'}
                onClick={() => handleSort('id')}
                sx={getHeaderStyle}
              >
                ID
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'nome'}
                direction={sortBy === 'nome' ? sortOrder : 'asc'}
                onClick={() => handleSort('nome')}
                sx={getHeaderStyle}
              >
                Nome
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'marca'}
                direction={sortBy === 'marca' ? sortOrder : 'asc'}
                onClick={() => handleSort('marca')}
                sx={getHeaderStyle}
              >
                Marca
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'cor'}
                direction={sortBy === 'cor' ? sortOrder : 'asc'}
                onClick={() => handleSort('cor')}
                sx={getHeaderStyle}
              >
                Cor
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'quantidade_em_estoque'}
                direction={sortBy === 'quantidade_em_estoque' ? sortOrder : 'asc'}
                onClick={() => handleSort('quantidade_em_estoque')}
                sx={getHeaderStyle}
              >
                Estoque
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'descricao'}
                direction={sortBy === 'descricao' ? sortOrder : 'asc'}
                onClick={() => handleSort('descricao')}
                sx={getHeaderStyle}
              >
                Descrição
              </TableSortLabel>
            </TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length > 0 ? (
            data.map(aviamento => (
              <TableRow key={aviamento.id}>
                <TableCell>{aviamento.id}</TableCell>
                <TableCell>{aviamento.nome}</TableCell>
                <TableCell>{aviamento.marca}</TableCell>
                <TableCell>{aviamento.cor}</TableCell>
                <TableCell>{aviamento.quantidade_em_estoque}</TableCell>
                <TableCell>{aviamento.descricao}</TableCell>
                <TableCell>{renderActions(aviamento)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <Typography>Nenhum aviamento cadastrado.</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
  );

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Estoque de Aviamentos</Typography>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/aviamentos/cadastro"
        sx={{ mb: 2 }}
      >
        Cadastrar Aviamento
      </Button>
      
      {/* Caixa de busca */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          label="Buscar por ID, Nome, Marca, Cor ou Descrição"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Paper>

      {/* Tabelas de aviamentos ativos e esgotados */}
      {renderTable(activeAviamentos, "Aviamentos em Estoque")}
      {finishedAviamentos.length > 0 &&
        renderTable(finishedAviamentos, "Aviamentos Esgotados", { backgroundColor: "#e3f2fd" })
      }
    </Container>
  );
}

export default AviamentoEstoque;
