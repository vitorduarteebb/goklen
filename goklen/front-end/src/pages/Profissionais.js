// Profissionais.js
import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  Button, 
  IconButton, 
  Box 
} from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Ícones do Material-UI
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function Profissionais() {
  const [profissionais, setProfissionais] = useState([]);

  const fetchProfissionais = () => {
    axios.get('http://localhost:8000/api/cadastro/profissionais/')
      .then(response => setProfissionais(response.data))
      .catch(error => console.error("Erro ao buscar profissionais:", error));
  };

  useEffect(() => {
    fetchProfissionais();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este profissional?")) {
      axios.delete(`http://localhost:8000/api/cadastro/profissionais/${id}/`)
        .then(() => fetchProfissionais())
        .catch(error => console.error("Erro ao excluir profissional:", error));
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Profissionais
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        component={Link} 
        to="/profissionais/cadastro"
        sx={{ mb: 2 }}
      >
        Cadastrar Profissional
      </Button>
      <Paper>
        <List>
          {profissionais.map(profissional => (
            <ListItem 
              key={profissional.id}
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <ListItemText
                primary={`${profissional.nome} (${profissional.categoria})`}
                secondary={`CPF: ${profissional.cpf} | Endereço: ${profissional.endereco}`}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button 
                  variant="outlined" 
                  component={Link} 
                  to={`/extrato/${profissional.id}`}
                  size="small"
                >
                  Ver Conta
                </Button>
                <IconButton 
                  color="primary" 
                  component={Link} 
                  to={`/profissionais/editar/${profissional.id}`}
                  title="Editar"
                  size="small"
                >
                  <EditIcon />
                </IconButton>
                <IconButton 
                  color="error" 
                  onClick={() => handleDelete(profissional.id)}
                  title="Excluir"
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
}

export default Profissionais;
