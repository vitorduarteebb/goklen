// src/pages/Pedidos.js
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
  IconButton, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Material-UI Icons
import UndoIcon from '@mui/icons-material/Undo';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LabelIcon from '@mui/icons-material/Label';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import PrintIcon from '@mui/icons-material/Print';

// Import your Etiqueta component
import EtiquetaPedido from './EtiquetaPedido';
// NEW: Import the Romaneio component
import ImprimirRomaneio from './ImprimirRomaneio';

// Helper function to set color by status
const getStatusColor = (status) => {
  switch (status) {
    case "Criado":
      return "#1976d2"; // blue
    case "Em Confecção":
      return "#ff9800"; // orange
    case "Aguardando Embaladeira":
      return "#9c27b0"; // purple
    case "Em Embalagem":
      return "#4caf50"; // green
    case "Aguardando Conferencia":
      return "#fdd835"; // yellow
    case "Conferido":
      return "#757575"; // gray
    default:
      return "#000";
  }
};

function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  // States for the Etiqueta modal
  const [openEtiqueta, setOpenEtiqueta] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null);

  // Fetch orders
  const fetchPedidos = () => {
    axios.get('http://localhost:8000/api/pedidos/pedidos/')
      .then(response => setPedidos(response.data))
      .catch(error => console.error("Erro ao buscar pedidos:", error));
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  // Filter function
  const filterPedidos = (data) => {
    if (!searchTerm.trim()) return data;
    return data.filter(pedido => {
      const idMatch = pedido.id.toString().includes(searchTerm);
      const codigoMesa = pedido.corte?.codigo_mesa || '';
      return idMatch || codigoMesa.toLowerCase().includes(searchTerm.toLowerCase());
    });
  };

  // Sorting logic
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
        case 'codigo_mesa':
          aValue = a.corte?.codigo_mesa?.toLowerCase() || '';
          bValue = b.corte?.codigo_mesa?.toLowerCase() || '';
          break;
        case 'modelo':
          aValue = a.corte && a.corte.modelo
            ? `${a.corte.modelo.nome} | ${a.corte.modelo.tamanho || '-'} | ${a.corte.modelo.cor || '-'}`.toLowerCase()
            : '';
          bValue = b.corte && b.corte.modelo
            ? `${b.corte.modelo.nome} | ${b.corte.modelo.tamanho || '-'} | ${b.corte.modelo.cor || '-'}`.toLowerCase()
            : '';
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
          aValue = a.status.toLowerCase();
          bValue = b.status.toLowerCase();
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

  // Apply filtering + sorting
  const filteredPedidos = sortData(filterPedidos(pedidos));

  // Separate active vs. finished
  const activePedidos = filteredPedidos.filter(p => p.status !== "Conferido");
  const finishedPedidos = filteredPedidos.filter(p => p.status === "Conferido");

  // Actions
  const handleDelete = (pedidoId) => {
    if (window.confirm("Tem certeza que deseja excluir este pedido?")) {
      axios.delete(`http://localhost:8000/api/pedidos/pedidos/${pedidoId}/`)
        .then(() => fetchPedidos())
        .catch(error => console.error("Erro ao excluir pedido:", error));
    }
  };

  const handleVoltarStatus = (pedidoId) => {
    axios.patch(`http://localhost:8000/api/pedidos/pedidos/${pedidoId}/`, { status: "Criado" })
      .then(() => fetchPedidos())
      .catch(error => console.error("Erro ao voltar status:", error));
  };

  // Etiqueta modal
  const openEtiquetaModal = (pedido) => {
    setSelectedPedido(pedido);
    setOpenEtiqueta(true);
  };

  const closeEtiquetaModal = () => {
    setOpenEtiqueta(false);
    setSelectedPedido(null);
  };

  const handlePrintEtiqueta = () => {
    window.print();
  };

  // Render the action buttons for each row
  const renderActions = (pedido) => {
    let specializedActions = null;

    // Confecção / Embalagem / Conferir
    if (pedido.status === "Em Confecção" && pedido.confecoes?.length > 0) {
      specializedActions = (
        <Button 
          variant="text" 
          color="primary" 
          component={Link} 
          to={`/confecoes/fatura/${pedido.confecoes[0].id}`}
          title="Lançar Confecção"
          sx={{ mr: 1 }}
        >
          LANÇAR CONFECÇÃO
        </Button>
      );
    } else if (pedido.status === "Em Embalagem" && pedido.embalagens?.length > 0) {
      specializedActions = (
        <Button 
          variant="text" 
          color="primary" 
          component={Link} 
          to={`/embalagens/fatura/${pedido.embalagens[0].id}`}
          title="Lançar Embalagem"
          sx={{ mr: 1 }}
        >
          LANÇAR EMBALAGEM
        </Button>
      );
    } else if (pedido.status === "Aguardando Conferencia") {
      specializedActions = (
        <Button 
          variant="text" 
          color="primary" 
          component={Link} 
          to={`/recontagem/${pedido.id}`}
          title="Conferir"
          sx={{ mr: 1 }}
        >
          CONFERIR
        </Button>
      );
    }

    // Undo, edit, delete (if not conferido)
    let iconActions = null;
    if (pedido.status !== "Conferido") {
      iconActions = (
        <>
          <IconButton 
            color="warning" 
            onClick={() => handleVoltarStatus(pedido.id)}
            title="Voltar Status"
            size="small"
          >
            <UndoIcon />
          </IconButton>
          <IconButton 
            color="primary" 
            component={Link} 
            to={`/pedido/editar/${pedido.id}`}
            title="Editar"
            size="small"
          >
            <EditIcon />
          </IconButton>
          <IconButton 
            color="error" 
            onClick={() => handleDelete(pedido.id)}
            title="Apagar"
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        </>
      );
    }

    // Etiqueta button
    const etiquetaButton = (
      <IconButton 
        color="primary" 
        onClick={() => openEtiquetaModal(pedido)}
        title="Visualizar Etiqueta"
        size="small"
      >
        <LabelIcon />
      </IconButton>
    );

    // Romaneio button
    // This is the new line to open a Romaneio modal (or dialog) – 
    // you must have your ImprimirRomaneio component:
    const romaneioButton = (
      <ImprimirRomaneio pedido={pedido} />
    );

    return (
      <>
        {specializedActions}
        {iconActions}
        {etiquetaButton}
        {romaneioButton}
      </>
    );
  };

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
                CÓDIGO DA MESA
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>
              <TableSortLabel
                active={sortBy === 'modelo'}
                direction={sortBy === 'modelo' ? sortOrder : 'asc'}
                onClick={() => handleSort('modelo')}
              >
                MODELO
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>
              <TableSortLabel
                active={sortBy === 'quantidade_inicial'}
                direction={sortBy === 'quantidade_inicial' ? sortOrder : 'asc'}
                onClick={() => handleSort('quantidade_inicial')}
              >
                QTD. INICIAL
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>
              <TableSortLabel
                active={sortBy === 'quantidade_conferida'}
                direction={sortBy === 'quantidade_conferida' ? sortOrder : 'asc'}
                onClick={() => handleSort('quantidade_conferida')}
              >
                QTD. CONFERIDA
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>
              <TableSortLabel
                active={sortBy === 'diferenca'}
                direction={sortBy === 'diferenca' ? sortOrder : 'asc'}
                onClick={() => handleSort('diferenca')}
              >
                DIFERENÇA
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>
              <TableSortLabel
                active={sortBy === 'status'}
                direction={sortBy === 'status' ? sortOrder : 'asc'}
                onClick={() => handleSort('status')}
              >
                STATUS
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>
              <TableSortLabel
                active={sortBy === 'data_criacao'}
                direction={sortBy === 'data_criacao' ? sortOrder : 'asc'}
                onClick={() => handleSort('data_criacao')}
              >
                DATA DE CRIAÇÃO
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>AÇÕES</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length > 0 ? (
            data.map((pedido) => (
              <TableRow key={pedido.id}>
                <TableCell>{pedido.id}</TableCell>
                <TableCell>
                  {pedido.corte && pedido.corte.codigo_mesa
                    ? `Mesa: ${pedido.corte.codigo_mesa}`
                    : '-'}
                </TableCell>
                <TableCell>
                  {pedido.corte && pedido.corte.modelo 
                    ? `${pedido.corte.modelo.nome} | ${pedido.corte.modelo.tamanho || '-'} | ${pedido.corte.modelo.cor || '-'}`
                    : 'N/A'}
                </TableCell>
                <TableCell>{pedido.quantidade_inicial}</TableCell>
                <TableCell>{pedido.quantidade_conferida !== null ? pedido.quantidade_conferida : '-'}</TableCell>
                <TableCell>{pedido.diferenca !== null ? pedido.diferenca : '-'}</TableCell>
                <TableCell>
                  <Box
                    component="span"
                    sx={{
                      display: 'inline-block',
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: getStatusColor(pedido.status),
                      mr: 1
                    }}
                  ></Box>
                  {pedido.status}
                </TableCell>
                <TableCell>{new Date(pedido.data_criacao).toLocaleString()}</TableCell>
                <TableCell>{renderActions(pedido)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} align="center">
                <Typography>NENHUM PEDIDO CADASTRADO.</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
  );

  return (
    <>
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>PEDIDOS</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          component={Link} 
          to="/pedido/novo" 
          sx={{ mb: 2 }}
        >
          CRIAR NOVO PEDIDO
        </Button>
        <Box sx={{ mt: 4, display: 'flex', alignItems: 'center' }}>
          <TextField
            label="BUSCAR POR ID OU CÓDIGO DA MESA"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <IconButton
            color="secondary"
            component={Link}
            to="/barcode-scanner"
            title="Scanner de Código de Barras"
            sx={{ ml: 1 }}
          >
            <PhotoCameraIcon />
          </IconButton>
        </Box>

        {renderTable(activePedidos, "PEDIDOS ATIVOS")}

        <Container sx={{ mt: 2, mb: 4 }}>
          <Typography variant="h5" gutterBottom>PEDIDOS FINALIZADOS</Typography>
          {finishedPedidos.length > 0 ? (
            renderTable(finishedPedidos, "PEDIDOS FINALIZADOS", { backgroundColor: "#f5f5f5" })
          ) : (
            <Paper sx={{ p: 2 }}>
              <Typography align="center">NENHUM PEDIDO FINALIZADO.</Typography>
            </Paper>
          )}
        </Container>
      </Container>

      {/* Modal for viewing the order label */}
      <Dialog open={openEtiqueta} onClose={closeEtiquetaModal} fullWidth maxWidth="sm">
        <DialogTitle>Etiqueta do Pedido</DialogTitle>
        <DialogContent>
          {selectedPedido && <EtiquetaPedido pedido={selectedPedido} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePrintEtiqueta} color="primary" startIcon={<PrintIcon />}>
            Imprimir
          </Button>
          <Button onClick={closeEtiquetaModal} color="primary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Pedidos;
