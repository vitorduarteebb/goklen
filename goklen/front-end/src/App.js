import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Dashboard from './pages/Dashboard';
import Modelos from './pages/Modelos';
import ModeloCadastro from './pages/ModeloCadastro';
import ViesCadastro from './pages/ViesCadastro';
import CorteCadastro from './pages/CorteCadastro';
import Cortes from './pages/Cortes';
import NovoPedido from './pages/NovoPedido';
import ConfecaoCadastro from './pages/ConfecaoCadastro';
import EmbalagemCadastro from './pages/EmbalagemCadastro';
import Recontagem from './pages/Recontagem';
import Profissionais from './pages/Profissionais';
import ProfissionalCadastro from './pages/ProfissionalCadastro';
import Pedidos from './pages/Pedidos';
import FaturaConfecao from './pages/FaturaConfecao';
import FaturaEmbalagem from './pages/FaturaEmbalagem';
import ExtratoProfissional from './pages/ExtratoProfissional';
import AviamentoCadastro from './pages/AviamentoCadastro'; 
import ProdutoEstoque from './pages/ProdutoEstoque';
// Atualize aqui: importe o componente OrderLookup, que será usado como scanner
import OrderLookup from './pages/OrderLookup';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/modelos" element={<Modelos />} />
        <Route path="/modelos/cadastro" element={<ModeloCadastro />} />
        <Route path="/vies/cadastro" element={<ViesCadastro />} />
        <Route path="/cortes/cadastro" element={<CorteCadastro />} />
        <Route path="/cortes" element={<Cortes />} />
        <Route path="/pedido/novo" element={<NovoPedido />} />
        <Route path="/confecao" element={<ConfecaoCadastro />} />
        <Route path="/embalagem" element={<EmbalagemCadastro />} />
        <Route path="/recontagem/:id" element={<Recontagem />} />
        <Route path="/profissionais" element={<Profissionais />} />
        <Route path="/profissionais/cadastro" element={<ProfissionalCadastro />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/confecoes/fatura/:id" element={<FaturaConfecao />} />
        <Route path="/embalagens/fatura/:id" element={<FaturaEmbalagem />} />
        <Route path="/extrato/:id" element={<ExtratoProfissional />} />
        <Route path="/produtos" element={<ProdutoEstoque />} />
        <Route path="/aviamentos/cadastro" element={<AviamentoCadastro />} />
        {/* Rota para o scanner: usamos OrderLookup */}
        <Route path="/barcode-scanner" element={<OrderLookup />} />
      </Routes>
    </Router>
  );
}

export default App;
