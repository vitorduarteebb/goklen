import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  Button, 
  ListItemSecondaryAction 
} from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Modelos() {
  const [modelos, setModelos] = useState([]);

  const fetchModelos = () => {
    axios.get('http://localhost:8000/api/cadastro/modelos/')
      .then(response => setModelos(response.data))
      .catch(error => console.error('Erro ao buscar modelos:', error));
  };

  useEffect(() => {
    fetchModelos();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Deseja realmente excluir este modelo?")) {
      axios.delete(`http://localhost:8000/api/cadastro/modelos/${id}/`)
        .then(() => fetchModelos())
        .catch(error => console.error('Erro ao excluir modelo:', error));
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Modelos
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        component={Link} 
        to="/modelos/cadastro" 
        sx={{ mb: 2 }}
      >
        Cadastrar Modelo
      </Button>
      <Paper>
        <List>
          {modelos.length > 0 ? (
            modelos.map(modelo => (
              <ListItem key={modelo.id}>
                <ListItemText
                  primary={modelo.nome}
                  secondary={`Observação: ${modelo.observacao || '-'} | Cor: ${modelo.cor || '-'} | Tamanho: ${modelo.tamanho || '-'}`}
                />
                <ListItemSecondaryAction>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    component={Link} 
                    to={`/modelos/editar/${modelo.id}`} 
                    sx={{ mr: 1 }}
                  >
                    Editar
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="error" 
                    onClick={() => handleDelete(modelo.id)}
                  >
                    Excluir
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="Nenhum modelo cadastrado." />
            </ListItem>
          )}
        </List>
      </Paper>
    </Container>
  );
}

export default Modelos;
