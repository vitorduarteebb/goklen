import React, { useState } from 'react';
import { Modal, Box, IconButton } from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CloseIcon from '@mui/icons-material/Close';
import PrintIcon from '@mui/icons-material/Print';
import EtiquetaPedido from './EtiquetaPedido';

function ImprimirEtiqueta({ pedido }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handlePrint = () => {
    const printContent = document.getElementById('etiqueta-print');
    const WindowPrt = window.open('', '', 'width=400,height=600');
    WindowPrt.document.write(printContent.innerHTML);
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
  };

  return (
    <>
      <IconButton onClick={handleOpen} title="Imprimir Etiqueta" size="small" color="primary">
        <LocalOfferIcon />
      </IconButton>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            p: 2, 
            bgcolor: 'background.paper',
            boxShadow: 24
          }}>
          <div id="etiqueta-print">
            <EtiquetaPedido pedido={pedido} />
          </div>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton onClick={handlePrint} title="Imprimir" color="primary" size="small">
              <PrintIcon />
            </IconButton>
            <IconButton onClick={handleClose} title="Fechar" color="secondary" size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

export default ImprimirEtiqueta;
