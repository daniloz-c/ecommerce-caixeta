const express = require('express');
const router = express.Router();

const produtoRoutes = require('./produtoRoutes');
const pedidoRoutes = require('./PedidoRoutes.js');
const pagamentoRoutes = require('./pagamentoRoutes');

// Registrar rotas
router.use('/produtos', produtoRoutes);
router.use('/pedidos', pedidoRoutes);
router.use('/pagamentos', pagamentoRoutes);

// Rota de teste
router.get('/health', (req, res) => {
  res.json({ status: '✅ API funcionando' });
});

module.exports = router;