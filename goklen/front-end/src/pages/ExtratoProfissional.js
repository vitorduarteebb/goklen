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
  Box,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function ExtratoConta() {
  const { id } = useParams(); // ID do profissional (rota: /conta/:id)
  const [extrato, setExtrato] = useState([]);
  const [total, setTotal] = useState(0);
  const [profissional, setProfissional] = useState(null);
  const [lastRecebimento, setLastRecebimento] = useState(null);
  const navigate = useNavigate();

  // Busca os dados do profissional
  const fetchProfissional = () => {
    axios
      .get(`http://localhost:8000/api/cadastro/profissionais/${id}/`)
      .then((response) => setProfissional(response.data))
      .catch((error) =>
        console.error("Erro ao buscar profissional:", error)
      );
  };

  // Busca os lançamentos do extrato para o profissional
  const fetchExtrato = () => {
    axios
      .get(`http://localhost:8000/api/pagamentos/pagamentos/?profissional=${id}`)
      .then((response) => {
        setExtrato(response.data);
        const saldoTotal = response.data.reduce(
          (acc, curr) => acc + parseFloat(curr.valor),
          0
        );
        setTotal(saldoTotal);
        if (response.data.length > 0) {
          const sorted = [...response.data].sort(
            (a, b) =>
              new Date(b.data_pagamento) - new Date(a.data_pagamento)
          );
          setLastRecebimento(sorted[0]);
        } else {
          setLastRecebimento(null);
        }
      })
      .catch((error) =>
        console.error("Erro ao buscar extrato:", error)
      );
  };

  useEffect(() => {
    fetchProfissional();
    fetchExtrato();
  }, [id]);

  const handleFecharConta = () => {
    axios
      .post(`http://localhost:8000/api/pagamentos/fechar_conta/`, {
        profissional: id
      })
      .then((response) => {
        alert("Conta fechada! Fatura gerada em PDF.");
        fetchExtrato();
      })
      .catch((error) => {
        console.error("Erro ao fechar conta:", error);
        alert("Erro ao fechar conta.");
      });
  };

  // Renderiza os dados bancários em MAIÚSCULO
  const renderDadosBancarios = (dados) => {
    if (!dados)
      return <Typography variant="body2">NÃO INFORMADO</Typography>;
    return (
      <Box>
        <Typography variant="body2">
          <strong>MÉTODO:</strong> {dados.metodo.toUpperCase()}
        </Typography>
        {dados.metodo === "PIX" ? (
          <>
            <Typography variant="body2">
              <strong>CHAVE PIX:</strong> {dados.chavePix}
            </Typography>
            <Typography variant="body2">
              <strong>TIPO:</strong> {dados.tipoChavePix.toUpperCase()}
            </Typography>
          </>
        ) : dados.metodo === "Transferencia" ? (
          <>
            <Typography variant="body2">
              <strong>BANCO:</strong> {dados.banco.toUpperCase()}
            </Typography>
            <Typography variant="body2">
              <strong>AGÊNCIA:</strong> {dados.agencia}
            </Typography>
            <Typography variant="body2">
              <strong>CONTA:</strong> {dados.conta}
            </Typography>
          </>
        ) : null}
      </Box>
    );
  };

  return (
    <>
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          CONTA DA PROFISSIONAL
        </Typography>

        {profissional && (
          <Card sx={{ mb: 2, backgroundColor: "#eeeeee" }}>
            <CardContent>
              <Typography variant="h5" sx={{ textTransform: "uppercase" }}>
                {profissional.nome}
              </Typography>
              <Typography variant="body1">
                <strong>CATEGORIA:</strong> {profissional.categoria.toUpperCase()}
              </Typography>
              <Typography variant="body1">
                <strong>CPF:</strong> {profissional.cpf}
              </Typography>
              <Typography variant="body1">
                <strong>ENDEREÇO:</strong> {profissional.endereco.toUpperCase()}
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Typography variant="subtitle1">
                  DADOS BANCÁRIOS:
                </Typography>
                {renderDadosBancarios(profissional.dados_bancarios)}
              </Box>
            </CardContent>
          </Card>
        )}

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ backgroundColor: "#1976d2", color: "white" }}>
              <CardContent>
                <Typography variant="h6">SALDO ATUAL</Typography>
                <Typography variant="h4">R$ {total.toFixed(2)}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ backgroundColor: "#388e3c", color: "white" }}>
              <CardContent>
                <Typography variant="h6">ÚLTIMO LANÇAMENTO</Typography>
                {lastRecebimento ? (
                  <>
                    <Typography variant="body1">
                      <strong>PEDIDO:</strong> {lastRecebimento.pedido}
                    </Typography>
                    <Typography variant="body1">
                      <strong>MESA:</strong>{" "}
                      {lastRecebimento.pedido_detail?.corte?.codigo_mesa || "-"}
                    </Typography>
                    <Typography variant="body1">
                      <strong>VALOR:</strong> R${" "}
                      {parseFloat(lastRecebimento.valor).toFixed(2)}
                    </Typography>
                    <Typography variant="body2">
                      {new Date(lastRecebimento.data_pagamento).toLocaleString()}
                    </Typography>
                  </>
                ) : (
                  <Typography variant="body1">Nenhum registro</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card
              sx={{
                backgroundColor: total === 0 ? "#4caf50" : "#f44336",
                color: "white"
              }}
            >
              <CardContent>
                <Typography variant="h6">
                  {total === 0 ? "CONTA FECHADA" : "CONTA ABERTA"}
                </Typography>
                {total !== 0 && (
                  <Typography variant="body2">
                    Clique em "Fechar Conta" para zerar o saldo.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper sx={{ p: 2, mb: 2 }}>
          <Box sx={{ overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>PEDIDO</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>MESA</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>VALOR</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    DATA DO LANÇAMENTO
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {extrato.length > 0 ? (
                  extrato.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.id}</TableCell>
                      <TableCell>{record.pedido}</TableCell>
                      <TableCell>
                        {record.pedido_detail?.corte?.codigo_mesa || "-"}
                      </TableCell>
                      <TableCell>
                        R$ {parseFloat(record.valor).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {new Date(record.data_pagamento).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography>Nenhum registro encontrado.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        </Paper>

        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleFecharConta}
        >
          FECHAR CONTA
        </Button>
      </Container>
    </>
  );
}

export default ExtratoConta;
