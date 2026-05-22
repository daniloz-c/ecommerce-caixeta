const express = require('express');
const router = express.Router();
const pagamentoController = require('../controllers/pagamentoController');

// GET - Listar todos os pagamentos
router.get('/', pagamentoController.listarTodos);

// GET - Buscar pagamento por ID
router.get('/:id', pagamentoController.buscarPorId);

// POST - Processar pagamento (usando Factory)
router.post('/:pedidoId/processar', pagamentoController.processar);

// GET - Buscar pagamento de um pedido
router.get('/pedido/:pedidoId', pagamentoController.buscarPorPedido);

module.exports = router;