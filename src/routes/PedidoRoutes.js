const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

// GET - Listar todos os pedidos
router.get('/', pedidoController.listarTodos);

// GET - Buscar pedido por ID
router.get('/:id', pedidoController.buscarPorId);

// POST - Criar pedido (usando Builder)
router.post('/', pedidoController.criar);

// PUT - Atualizar status do pedido
router.put('/:id/status', pedidoController.atualizarStatus);

// DELETE - Cancelar pedido
router.delete('/:id', pedidoController.cancelar);

module.exports = router;