// EtiquetaPedido.js
import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import Barcode from 'react-barcode';

function EtiquetaPedido({ pedido }) {
  // Se houver confecções, usamos o profissional da primeira; caso contrário, mostra "Não informado"
  const faccao =
    pedido.confecoes && pedido.confecoes.length > 0
      ? pedido.confecoes[0].profissional?.nome || 'Não informado'
      : '____________';

  // Se houver embalagens (pedido em status de embalagem), usamos o profissional da primeira; caso contrário, exibe linha em branco
  const emba =
    pedido.embalagens && pedido.embalagens.length > 0
      ? pedido.embalagens[0].profissional?.nome || 'Não informado'
      : '____________';

  return (
    <Paper
      sx={{
        p: 2,
        width: '10cm',
        height: '15cm',
        border: '1px solid #000',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      <Box>
        <Typography variant="h5" align="center" gutterBottom sx={{ fontSize: '2rem' }}>
          Etiqueta do Pedido
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.6rem', mt: 1 }}>
          <strong>Mesa:</strong> {pedido.corte?.codigo_mesa || '-'}
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.6rem', mt: 1 }}>
          <strong>Data (C):</strong> ____________
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.6rem', mt: 1 }}>
          <strong>Facção:</strong> {faccao}
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.6rem', mt: 1 }}>
          <strong>Emba:</strong> {emba}
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.6rem', mt: 1 }}>
          <strong>Data (E):</strong> ____________
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.6rem', mt: 1 }}>
          <strong>Cor:</strong> {pedido.corte?.modelo?.cor || '-'}
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.6rem', mt: 1 }}>
          <strong>Modelo:</strong> {pedido.corte?.modelo?.nome || '-'}
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.6rem', mt: 1 }}>
          <strong>Tam:</strong> {pedido.corte?.modelo?.tamanho || '-'}
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.6rem', mt: 1 }}>
          <strong>Volume:</strong> ____________
        </Typography>
      </Box>
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Barcode value={pedido.id.toString()} fontSize={18} height={70} />
      </Box>
    </Paper>
  );
}

export default EtiquetaPedido;
