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

// Helper function for status color
const getStatusColor = (status) => {
  switch(status) {
    case "Criado":
      return "#1976d2";  // blue
    case "Em Confecção":
      return "#ff9800";  // orange
    case "Aguardando Embaladeira":
      return "#9c27b0";  // purple
    case "Em Embalagem":
      return "#4caf50";  // green
    case "Aguardando Conferencia":
      return "#fdd835";  // yellow
    case "Conferido":
      return "#757575";  // gray
    default:
      return "#000";     // black
  }
};

function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    axios.get('http://localhost:8000/api/pedidos/pedidos/')
      .then(response => {
        console.log("Pedidos recebidos:", response.data);
        setPedidos(response.data);
      })
      .catch(error => console.error("Erro ao buscar pedidos:", error));
  }, []);

  // Filter orders by search term (order ID or Código da Mesa)
  const filterPedidos = (data) => {
    if (!searchTerm.trim()) return data;
    return data.filter(pedido => {
      const idMatch = pedido.id.toString().includes(searchTerm);
      const codigoMesa = (pedido.corte && pedido.corte.codigo_mesa) ? pedido.corte.codigo_mesa : '';
      const mesaMatch = codigoMesa.toLowerCase().includes(searchTerm.toLowerCase());
      return idMatch || mesaMatch;
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

  // Sort the data
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
          aValue = (a.corte && a.corte.codigo_mesa) ? a.corte.codigo_mesa : '';
          bValue = (b.corte && b.corte.codigo_mesa) ? b.corte.codigo_mesa : '';
          break;
        case 'modelo':
          aValue = (a.corte && a.corte.modelo && a.corte.modelo.nome) ? a.corte.modelo.nome : '';
          bValue = (b.corte && b.corte.modelo && b.corte.modelo.nome) ? b.corte.modelo.nome : '';
          break;
        case 'quantidade_inicial':
          aValue = a.quantidade_inicial;
          bValue = b.quantidade_inicial;
          break;
        case 'quantidade_conferida':
          aValue = a.quantidade_conferida || 0;
          bValue = b.quantidade_conferida || 0;
          break;
        case 'diferenca':
          aValue = a.diferenca || 0;
          bValue = b.diferenca || 0;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'data_criacao':
          aValue = new Date(a.data_criacao);
          bValue = new Date(b.data_criacao);
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

  // Separate active and finished orders
  const activePedidos = sortData(filterPedidos(pedidos.filter(p => p.status !== "Conferido")));
  const finishedPedidos = sortData(filterPedidos(pedidos.filter(p => p.status === "Conferido")));

  // Render actions based on order status
  const renderActions = (pedido) => {
    if (pedido.status === "Em Confecção" && pedido.confecoes && pedido.confecoes.length > 0) {
      return (
        <Button 
          variant="contained" 
          color="primary" 
          component={Link} 
          to={`/confecoes/fatura/${pedido.confecoes[0].id}`}
        >
          Faturar Confecção
        </Button>
      );
    } else if (pedido.status === "Em Embalagem" && pedido.embalagens && pedido.embalagens.length > 0) {
      return (
        <Button 
          variant="contained" 
          color="primary" 
          component={Link} 
          to={`/embalagens/fatura/${pedido.embalagens[0].id}`}
        >
          Faturar Embalagem
        </Button>
      );
    } else if (pedido.status === "Aguardando Conferencia") {
      return (
        <Button 
          variant="contained" 
          color="primary" 
          component={Link} 
          to={`/recontagem/${pedido.id}`}
        >
          Conferir
        </Button>
      );
    }
    return "-";
  };

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
              >
                ID
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'codigo_mesa'}
                direction={sortBy === 'codigo_mesa' ? sortOrder : 'asc'}
                onClick={() => handleSort('codigo_mesa')}
              >
                Código da Mesa
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'modelo'}
                direction={sortBy === 'modelo' ? sortOrder : 'asc'}
                onClick={() => handleSort('modelo')}
              >
                Modelo
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'quantidade_inicial'}
                direction={sortBy === 'quantidade_inicial' ? sortOrder : 'asc'}
                onClick={() => handleSort('quantidade_inicial')}
              >
                Qtd. Inicial
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'quantidade_conferida'}
                direction={sortBy === 'quantidade_conferida' ? sortOrder : 'asc'}
                onClick={() => handleSort('quantidade_conferida')}
              >
                Qtd. Conferida
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'diferenca'}
                direction={sortBy === 'diferenca' ? sortOrder : 'asc'}
                onClick={() => handleSort('diferenca')}
              >
                Diferença
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'status'}
                direction={sortBy === 'status' ? sortOrder : 'asc'}
                onClick={() => handleSort('status')}
              >
                Status
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'data_criacao'}
                direction={sortBy === 'data_criacao' ? sortOrder : 'asc'}
                onClick={() => handleSort('data_criacao')}
              >
                Data de Criação
              </TableSortLabel>
            </TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length > 0 ? (
            data.map(pedido => (
              <TableRow key={pedido.id}>
                <TableCell>{pedido.id}</TableCell>
                <TableCell>
                  {pedido.corte && pedido.corte.codigo_mesa ? `Mesa: ${pedido.corte.codigo_mesa}` : '-'}
                </TableCell>
                <TableCell>
                  {pedido.corte && pedido.corte.modelo && pedido.corte.modelo.nome ? pedido.corte.modelo.nome : 'N/A'}
                </TableCell>
                <TableCell>{pedido.quantidade_inicial}</TableCell>
                <TableCell>{pedido.quantidade_conferida !== null ? pedido.quantidade_conferida : '-'}</TableCell>
                <TableCell>{pedido.diferenca !== null ? pedido.diferenca : '-'}</TableCell>
                <TableCell>
                  <span 
                    style={{
                      display: 'inline-block',
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: getStatusColor(pedido.status),
                      marginRight: 5,
                    }}
                  ></span>
                  {pedido.status}
                </TableCell>
                <TableCell>{new Date(pedido.data_criacao).toLocaleString()}</TableCell>
                <TableCell>{renderActions(pedido)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} align="center">
                <Typography>Nenhum pedido cadastrado.</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
  );

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Pedidos</Typography>
      <Button 
        variant="contained" 
        color="primary" 
        component={Link} 
        to="/pedido/novo" 
        sx={{ mb: 2 }}
      >
        Criar Novo Pedido
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

      {/* Active Orders */}
      {renderTable(activePedidos, "Pedidos Ativos")}

      {/* Finished Orders in a separate table */}
      {finishedPedidos.length > 0 && renderTable(finishedPedidos, "Pedidos Finalizados", { backgroundColor: "#f5f5f5" })}
    </Container>
  );
}

export default Pedidos;
