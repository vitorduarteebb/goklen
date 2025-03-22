import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, List, ListItem, ListItemText, Button } from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Profissionais() {
  const [profissionais, setProfissionais] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/cadastro/profissionais/')
      .then(response => setProfissionais(response.data))
      .catch(error => console.error("Erro ao buscar profissionais:", error));
  }, []);

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
            <ListItem key={profissional.id} 
                      sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <ListItemText
                primary={`${profissional.nome} (${profissional.categoria})`}
                secondary={`CPF: ${profissional.cpf} | Endereço: ${profissional.endereco}`}
              />
              <Button 
                variant="outlined" 
                component={Link} 
                to={`/extrato/${profissional.id}`}
              >
                Ver Extrato
              </Button>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
}

export default Profissionais;
