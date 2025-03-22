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
  Box
} from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';

const getHeaderStyle = {
  fontWeight: 'bold'
};

function ProdutoEstoque() {
  const [produtos, setProdutos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  // Fetch products from the API
  const fetchProdutos = () => {
    axios.get('http://localhost:8000/api/cadastro/produtos/')
      .then(response => setProdutos(response.data))
      .catch(error => console.error("Erro ao buscar produtos:", error));
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  // Filter products by search term (ID, Nome, or Marca)
  const filterProdutos = (data) => {
    if (!searchTerm.trim()) return data;
    return data.filter(produto => {
      const idMatch = produto.id.toString().includes(searchTerm);
      const nomeMatch = produto.nome.toLowerCase().includes(searchTerm.toLowerCase());
      const marcaMatch = produto.marca.toLowerCase().includes(searchTerm.toLowerCase());
      return idMatch || nomeMatch || marcaMatch;
    });
  };

  // Sorting handler
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Sort products based on selected column
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
        case 'quantidade':
          aValue = a.quantidade;
          bValue = b.quantidade;
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

  // Filter and sort products
  const filteredProdutos = sortData(filterProdutos(produtos));

  // Separate active and finished products
  const activeProdutos = filteredProdutos.filter(produto => produto.quantidade > 0);
  const finishedProdutos = filteredProdutos.filter(produto => produto.quantidade === 0);

  // Action: Somar (add) to product quantity
  const handleSomar = (produto) => {
    const valor = prompt("Informe a quantidade a somar:");
    if (valor === null) return;
    const quantidade = parseInt(valor, 10);
    if (isNaN(quantidade) || quantidade <= 0) {
      alert("Informe um número válido.");
      return;
    }
    const novaQuantidade = produto.quantidade + quantidade;
    axios.patch(`http://localhost:8000/api/cadastro/produtos/${produto.id}/`, { quantidade: novaQuantidade })
      .then(() => fetchProdutos())
      .catch(error => console.error("Erro ao somar quantidade:", error));
  };

  // Action: Subtrair (subtract) from product quantity
  const handleSubtrair = (produto) => {
    const valor = prompt("Informe a quantidade a subtrair:");
    if (valor === null) return;
    const quantidade = parseInt(valor, 10);
    if (isNaN(quantidade) || quantidade <= 0) {
      alert("Informe um número válido.");
      return;
    }
    if (quantidade > produto.quantidade) {
      alert("Quantidade a subtrair maior que o estoque.");
      return;
    }
    const novaQuantidade = produto.quantidade - quantidade;
    axios.patch(`http://localhost:8000/api/cadastro/produtos/${produto.id}/`, { quantidade: novaQuantidade })
      .then(() => fetchProdutos())
      .catch(error => console.error("Erro ao subtrair quantidade:", error));
  };

  // Action: Excluir (delete) a product
  const handleExcluir = (produtoId) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      axios.delete(`http://localhost:8000/api/cadastro/produtos/${produtoId}/`)
        .then(() => fetchProdutos())
        .catch(error => console.error("Erro ao excluir produto:", error));
    }
  };

  const renderActions = (produto) => (
    <>
      <Button 
        variant="outlined" 
        color="primary" 
        size="small" 
        onClick={() => handleSomar(produto)} 
        sx={{ mr: 1 }}
      >
        Somar
      </Button>
      <Button 
        variant="outlined" 
        color="secondary" 
        size="small" 
        onClick={() => handleSubtrair(produto)} 
        sx={{ mr: 1 }}
      >
        Subtrair
      </Button>
      <Button 
        variant="outlined" 
        color="error" 
        size="small" 
        onClick={() => handleExcluir(produto.id)}
      >
        Excluir
      </Button>
    </>
  );

  // Render table for given data and title; paperProps allow custom styling (e.g., backgroundColor)
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
                active={sortBy === 'quantidade'}
                direction={sortBy === 'quantidade' ? sortOrder : 'asc'}
                onClick={() => handleSort('quantidade')}
                sx={getHeaderStyle}
              >
                Quantidade
              </TableSortLabel>
            </TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length > 0 ? (
            data.map(produto => (
              <TableRow key={produto.id}>
                <TableCell>{produto.id}</TableCell>
                <TableCell>{produto.nome}</TableCell>
                <TableCell>{produto.marca}</TableCell>
                <TableCell>{produto.quantidade}</TableCell>
                <TableCell>{renderActions(produto)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center">
                <Typography>Nenhum produto cadastrado.</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
  );

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Estoque de Produtos</Typography>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/produtos/cadastro"
        sx={{ mb: 2 }}
      >
        Cadastrar Produto
      </Button>
      
      {/* Search Box */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          label="Buscar por ID, Nome ou Marca"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Paper>

      {/* Active Products */}
      {renderTable(activeProdutos, "Produtos em Estoque")}

      {/* Finished Products (Quantity = 0) with a blue background */}
      {finishedProdutos.length > 0 && renderTable(finishedProdutos, "Produtos Esgotados", { backgroundColor: "#e3f2fd" })}
    </Container>
  );
}

export default ProdutoEstoque;
