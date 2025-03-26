// OrderLookup.js
import React, { useState } from 'react';
import { Container, Paper, Typography, Button } from '@mui/material';
import BarcodeReader from 'react-barcode-reader';
import axios from 'axios';
import EtiquetaPedido from './EtiquetaPedido';

function OrderLookup() {
  const [barcode, setBarcode] = useState('');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  const handleScan = (data) => {
    if (data) {
      setBarcode(data);
      // Exemplo: ajusta a URL para sua API que suporte busca por barcode
      axios.get(`http://localhost:8000/api/pedidos/pedidos/?barcode=${data}`)
        .then(response => {
          if (response.data && response.data.length > 0) {
            setOrder(response.data[0]); // Usa o primeiro resultado
            setError('');
          } else {
            setOrder(null);
            setError('Pedido não encontrado.');
          }
        })
        .catch(err => {
          console.error(err);
          setError('Erro ao buscar pedido.');
        });
    }
  };

  const handleError = (err) => {
    console.error(err);
    setError('Erro de leitura.');
  };

  const handleClear = () => {
    setBarcode('');
    setOrder(null);
    setError('');
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Scanner de Código de Barras
        </Typography>
        <BarcodeReader onError={handleError} onScan={handleScan} />
        {barcode && (
          <Typography variant="body1" sx={{ mt: 1 }}>
            Código lido: {barcode}
          </Typography>
        )}
        {error && (
          <Typography variant="body1" color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
        {order && (
          <>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Resumo do Pedido:
            </Typography>
            <EtiquetaPedido pedido={order} />
          </>
        )}
        <Button variant="contained" sx={{ mt: 2 }} onClick={handleClear}>
          Limpar
        </Button>
      </Paper>
    </Container>
  );
}

export default OrderLookup;
