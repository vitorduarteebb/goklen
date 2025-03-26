import React, { useState } from 'react';
import {
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CloseIcon from '@mui/icons-material/Close';
import PrintIcon from '@mui/icons-material/Print';

/**
 * Componente que renderiza uma via do romaneio.
 * Recebe o objeto 'pedido' e a indicação da via (Confecção ou Embalagem).
 */
function Romaneio({ pedido, via }) {
  // Extraindo os dados dinâmicos do pedido
  const modeloNome = pedido?.corte?.modelo?.nome || 'Modelo não informado';
  const mesaCodigo = pedido?.corte?.codigo_mesa || 'Mesa não informada';
  const dataEntrega = pedido?.data_entrega || 'Data não definida';
  const obs = pedido?.obs || 'Sem observações';
  const quantidadePecas = pedido?.quantidade_inicial || 0;
  // Considera o primeiro registro como fonte do nome do profissional
  const profissionalConf = pedido?.confecoes?.[0]?.profissional?.nome || 'Não informado';
  const profissionalEmb = pedido?.embalagens?.[0]?.profissional?.nome || 'Não informado';

  // Exemplo de medidas – você pode ajustar conforme a sua lógica ou vir do backend
  const medidas = {
    P: '28 cm',
    M: '30 cm',
    G: '32 cm',
    GG: '34 cm'
  };

  return (
    <div className="romaneio-via" style={{ width: '18cm', padding: '1cm', marginBottom: '1cm', border: '1px solid #000' }}>
      <div style={{ textAlign: 'center', marginBottom: '0.5cm' }}>
        <h2>GOKLEN COMÉRCIO</h2>
        <h3>ROMANEIO DE ENVIO DE FACÇÃO</h3>
        <p><strong>Via: {via}</strong></p>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span><strong>Romaneio Nº</strong> ______</span>
          <span><strong>Mesa:</strong> {mesaCodigo}</span>
          <span>
            <strong>Nome:</strong>{' '}
            {via === 'Confecção' ? profissionalConf : profissionalEmb}
          </span>
        </div>
      </div>

      <p><strong>Modelo:</strong> {modeloNome}</p>
      <p><strong>Quantidade de Peças:</strong> {quantidadePecas}</p>
      <p>
        <strong>Profissional de Confecção:</strong> {profissionalConf}
      </p>
      <p>
        <strong>Profissional de Embalagem:</strong> {profissionalEmb}
      </p>
      <p><strong>OBS¹:</strong> {obs}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span><strong>Cintura P:</strong> {medidas.P}</span>
        <span><strong>Cintura M:</strong> {medidas.M}</span>
        <span><strong>Cintura G:</strong> {medidas.G}</span>
        <span><strong>Cintura GG:</strong> {medidas.GG}</span>
      </div>
      <p>
        Qualquer dúvida, entrar em contato com Patrick pelo Whatsapp: (22) 99963-8623
      </p>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5cm' }} border="1">
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th style={{ padding: '0.2cm' }}>DATA</th>
            <th>COR</th>
            <th>P</th>
            <th>M</th>
            <th>G</th>
            <th>GG</th>
            <th>TOTAL</th>
            <th>ETIQ. COMP.</th>
            <th>ENTREGA</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ textAlign: 'center' }}>____</td>
            <td style={{ textAlign: 'center' }}>____</td>
            <td style={{ textAlign: 'center' }}>0</td>
            <td style={{ textAlign: 'center' }}>0</td>
            <td style={{ textAlign: 'center' }}>0</td>
            <td style={{ textAlign: 'center' }}>0</td>
            <td style={{ textAlign: 'center' }}>0</td>
            <td style={{ textAlign: 'center' }}>Usar restante dos outros lotes.</td>
            <td style={{ textAlign: 'center' }}>Previsão para {dataEntrega}</td>
          </tr>
        </tbody>
      </table>
      <p style={{ marginTop: '0.5cm' }}>
        <strong>Ass. de recebimento: _______________________________________________</strong>
      </p>
    </div>
  );
}

/**
 * Componente que agrupa as quatro vias do romaneio.
 * Aqui estamos renderizando duas vias para confecção e duas para embalagem.
 */
function RomaneioVias({ pedido }) {
  const vias = ['Confecção', 'Confecção', 'Embalagem', 'Embalagem'];
  return (
    <div id="romaneio-print">
      {vias.map((via, index) => (
        <Romaneio key={index} pedido={pedido} via={via} />
      ))}
    </div>
  );
}

/**
 * Componente que exibe o botão (ou ícone) para abrir a janela de impressão
 * e encapsula a lógica de impressão em uma Dialog do Material UI.
 */
export default function ImprimirRomaneio({ pedido }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handlePrint = () => {
    const printContent = document.getElementById('romaneio-print');
    if (!printContent) return;
    const WinPrint = window.open('', '', 'width=800,height=600');
    WinPrint.document.write(`
      <html>
        <head>
          <title>Romaneio</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 1cm;
            }
            table, th, td {
              border: 1px solid #000;
              border-collapse: collapse;
            }
            th, td {
              padding: 4px;
              text-align: center;
            }
            .romaneio-via {
              page-break-after: always;
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    WinPrint.document.close();
    WinPrint.focus();
    WinPrint.print();
    WinPrint.close();
  };

  return (
    <>
      <IconButton onClick={handleOpen} title="Romaneio" size="small" color="primary">
        <PictureAsPdfIcon />
      </IconButton>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Romaneio</DialogTitle>
        <DialogContent>
          <RomaneioVias pedido={pedido} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePrint} color="primary" startIcon={<PrintIcon />}>
            Imprimir
          </Button>
          <Button onClick={handleClose} color="secondary" startIcon={<CloseIcon />}>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
