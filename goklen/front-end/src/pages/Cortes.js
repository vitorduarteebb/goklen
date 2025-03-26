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
  TableSortLabel 
} from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';

const getStatusColor = (quantidade) => {
  // Se a quantidade for maior que zero, considera ativo (verde), senão inativo (azul)
  return quantidade > 0 ? "#4caf50" : "#2196f3";
};

function Cortes() {
  const [cortes, setCortes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  // Busca os cortes disponíveis na API
  useEffect(() => {
    axios.get('http://localhost:8000/api/pedidos/cortes/')
      .then(response => {
        console.log("Cortes recebidos:", response.data);
        setCortes(response.data);
      })
      .catch(error => console.error("Erro ao buscar cortes:", error));
  }, []);

  // Filtra cortes com base no código da mesa
  const filterCortes = (data) => {
    if (!searchTerm.trim()) return data;
    return data.filter(corte => {
      const codigoMesa = corte.codigo_mesa ? corte.codigo_mesa.toString() : '';
      return codigoMesa.toLowerCase().includes(searchTerm.toLowerCase());
    });
  };

  // Controla a ordenação dos dados
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Ordena os cortes conforme a coluna selecionada
  const sortData = (data) => {
    if (!sortBy) return data;
    return [...data].sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'id':
          aValue = a.id;
          bValue = b.id;
          break;
        case 'codigo_mesa':
          aValue = a.codigo_mesa || '';
          bValue = b.codigo_mesa || '';
          break;
        case 'modelo':
          aValue = a.modelo && a.modelo.nome 
            ? `${a.modelo.nome} | ${a.modelo.tamanho || '-'} | ${a.modelo.cor || '-'}`.toLowerCase()
            : 'N/A';
          bValue = b.modelo && b.modelo.nome 
            ? `${b.modelo.nome} | ${b.modelo.tamanho || '-'} | ${b.modelo.cor || '-'}`.toLowerCase()
            : 'N/A';
          break;
        case 'data_corte':
          aValue = new Date(a.data_corte);
          bValue = new Date(b.data_corte);
          break;
        case 'quantidade_cortada':
          aValue = a.quantidade_cortada;
          bValue = b.quantidade_cortada;
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

  // Separa os cortes ativos (quantidade > 0) dos finalizados (quantidade === 0)
  const activeCortes = sortData(filterCortes(cortes.filter(corte => corte.quantidade_cortada > 0)));
  const finishedCortes = sortData(filterCortes(cortes.filter(corte => corte.quantidade_cortada === 0)));

  // Renderiza a tabela de cortes
  const renderTable = (data, tableTitle, paperProps = {}) => (
    <Paper sx={{ p: 2, mt: 4, ...paperProps }}>
      <Typography variant="h5" gutterBottom>{tableTitle}</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>
              <TableSortLabel
                active={sortBy === 'id'}
                direction={sortBy === 'id' ? sortOrder : 'asc'}
                onClick={() => handleSort('id')}
              >
                ID
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>
              <TableSortLabel
                active={sortBy === 'codigo_mesa'}
                direction={sortBy === 'codigo_mesa' ? sortOrder : 'asc'}
                onClick={() => handleSort('codigo_mesa')}
              >
                Código da Mesa
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>
              <TableSortLabel
                active={sortBy === 'modelo'}
                direction={sortBy === 'modelo' ? sortOrder : 'asc'}
                onClick={() => handleSort('modelo')}
              >
                Modelo | Tamanho | Cor
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>
              <TableSortLabel
                active={sortBy === 'data_corte'}
                direction={sortBy === 'data_corte' ? sortOrder : 'asc'}
                onClick={() => handleSort('data_corte')}
              >
                Data do Corte
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>
              <TableSortLabel
                active={sortBy === 'quantidade_cortada'}
                direction={sortBy === 'quantidade_cortada' ? sortOrder : 'asc'}
                onClick={() => handleSort('quantidade_cortada')}
              >
                Qtd. Disponível
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length > 0 ? (
            data.map(corte => (
              <TableRow key={corte.id}>
                <TableCell>{corte.id}</TableCell>
                <TableCell>
                  {corte.codigo_mesa ? `Mesa: ${corte.codigo_mesa}` : '-'}
                </TableCell>
                <TableCell>
                  {corte.modelo && corte.modelo.nome 
                    ? `${corte.modelo.nome} | ${corte.modelo.tamanho || '-'} | ${corte.modelo.cor || '-'}` 
                    : 'N/A'}
                </TableCell>
                <TableCell>
                  {new Date(corte.data_corte).toLocaleString()}
                </TableCell>
                <TableCell>{corte.quantidade_cortada}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center">
                <Typography>Nenhum corte cadastrado.</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
  );

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Cortes</Typography>
      <Button 
        variant="contained" 
        component={Link} 
        to="/cortes/cadastro" 
        sx={{ my: 2 }}
      >
        Cadastrar Corte
      </Button>
      
      {/* Search Box */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          label="Buscar por ID ou Código da Mesa"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Paper>

      {/* Active Cortes */}
      {renderTable(activeCortes, "Cortes Disponíveis")}

      {/* Finished Cortes com fundo azul */}
      {finishedCortes.length > 0 && renderTable(finishedCortes, "Cortes Finalizados", { backgroundColor: "#e3f2fd" })}
    </Container>
  );
}

export default Cortes;
