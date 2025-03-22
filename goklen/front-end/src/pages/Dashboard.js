import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent 
} from '@mui/material';
import axios from 'axios';

function Dashboard() {
  const [cortes, setCortes] = useState([]);
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/pedidos/cortes/')
      .then(response => setCortes(response.data))
      .catch(error => console.error("Erro ao buscar cortes:", error));

    axios.get('http://localhost:8000/api/pedidos/pedidos/')
      .then(response => setPedidos(response.data))
      .catch(error => console.error("Erro ao buscar pedidos:", error));
  }, []);

  // Compute metrics based on orders' statuses
  const totalCortes = cortes.length;
  const cortesDisponiveis = pedidos.filter(p => p.status === "Criado").length;
  const produzindo = pedidos.filter(p => p.status === "Em Confecção").length;
  const embalando = pedidos.filter(p => 
    p.status === "Em Embalagem" || p.status === "Aguardando Embaladeira"
  ).length;
  const conferencia = pedidos.filter(p => p.status === "Conferido").length;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h6">Cortes</Typography>
              <Typography variant="h4">{totalCortes}</Typography>
              <Typography variant="body2">Total de cortes registrados até hoje</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h6">Cortes Disponíveis</Typography>
              <Typography variant="h4">{cortesDisponiveis}</Typography>
              <Typography variant="body2">Cortes disponíveis para produzir</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h6">Produzindo</Typography>
              <Typography variant="h4">{produzindo}</Typography>
              <Typography variant="body2">Em andamento com a faccionista</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h6">Embalando</Typography>
              <Typography variant="h4">{embalando}</Typography>
              <Typography variant="body2">Passou para a embalagem</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h6">Conferência</Typography>
              <Typography variant="h4">{conferencia}</Typography>
              <Typography variant="body2">Processo finalizado</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;
