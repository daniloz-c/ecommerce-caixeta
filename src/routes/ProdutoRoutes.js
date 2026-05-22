const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');

// GET - Listar todos os produtos
router.get('/', produtoController.listarTodos);

// GET - Buscar produto por ID
router.get('/:id', produtoController.buscarPorId);

// POST - Criar produto
router.post('/', produtoController.criar);

// PUT - Atualizar produto
router.put('/:id', produtoController.atualizar);

// DELETE - Deletar produto
router.delete('/:id', produtoController.deletar);

module.exports = router;