import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Button, 
  Menu, 
  MenuItem, 
  Box 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';

function NavBar() {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar 
      position="static" 
      sx={{ 
        mb: 2, 
        background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)'
      }}
    >
      <Toolbar>
        <IconButton 
          edge="start" 
          color="inherit" 
          onClick={handleMenuOpen} 
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          SISTEMA GOKLEN
        </Typography>
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <Button color="inherit" component={Link} to="/">Dashboard</Button>
          <Button color="inherit" component={Link} to="/profissionais">Profissionais</Button>
          <Button color="inherit" component={Link} to="/pedidos">Pedidos</Button>
          <Button color="inherit" component={Link} to="/modelos">Modelos</Button>
          <Button color="inherit" component={Link} to="/cortes">Cortes</Button>
          <Button color="inherit" component={Link} to="/confecao">Confecção</Button>
          <Button color="inherit" component={Link} to="/embalagem">Embalagem</Button>
          <Button color="inherit" component={Link} to="/produtos">Estoque</Button>
        </Box>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          sx={{ display: { xs: 'block', sm: 'none' } }}
        >
          <MenuItem component={Link} to="/" onClick={handleMenuClose}>
            Dashboard
          </MenuItem>
          <MenuItem component={Link} to="/profissionais" onClick={handleMenuClose}>
            Profissionais
          </MenuItem>
          <MenuItem component={Link} to="/pedidos" onClick={handleMenuClose}>
            Pedidos
          </MenuItem>
          <MenuItem component={Link} to="/modelos" onClick={handleMenuClose}>
            Modelos
          </MenuItem>
          <MenuItem component={Link} to="/cortes" onClick={handleMenuClose}>
            Cortes
          </MenuItem>
          <MenuItem component={Link} to="/confecao" onClick={handleMenuClose}>
            Confecção
          </MenuItem>
          <MenuItem component={Link} to="/embalagem" onClick={handleMenuClose}>
            Embalagem
          </MenuItem>
          <MenuItem component={Link} to="/produtos" onClick={handleMenuClose}>
            Estoque
          </MenuItem>
          <MenuItem component={Link} to="/profissionais/cadastro" onClick={handleMenuClose}>
            Cadastrar Profissional
          </MenuItem>
          <MenuItem component={Link} to="/modelos/cadastro" onClick={handleMenuClose}>
            Cadastrar Modelo
          </MenuItem>
          <MenuItem component={Link} to="/cortes/cadastro" onClick={handleMenuClose}>
            Cadastrar Corte
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
