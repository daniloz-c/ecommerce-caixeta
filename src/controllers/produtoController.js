const Produto = require('../models/Produto');

class ProdutoController {
  static async listarTodos(req, res) {
    try {
      const produtos = await Produto.findAll();
      res.json({
        mensagem: 'Produtos listados com sucesso',
        quantidade: produtos.length,
        dados: produtos
      });
    } catch (erro) {
      res.status(500).json({ erro: erro.message });
    }
  }

  static async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const produto = await Produto.findByPk(id);

      if (!produto) {
        return res.status(404).json({ erro: 'Produto não encontrado' });
      }

      res.json({
        mensagem: 'Produto encontrado',
        dados: produto
      });
    } catch (erro) {
      res.status(500).json({ erro: erro.message });
    }
  }

  static async criar(req, res) {
    try {
      const { nome, descricao, preco, estoque } = req.body;

      if (!nome || !preco) {
        return res.status(400).json({ erro: 'Nome e preço são obrigatórios' });
      }

      const produto = await Produto.create({
        nome,
        descricao,
        preco,
        estoque: estoque || 0
      });

      res.status(201).json({
        mensagem: 'Produto criado com sucesso',
        dados: produto
      });
    } catch (erro) {
      res.status(400).json({ erro: erro.message });
    }
  }

  static async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nome, descricao, preco, estoque } = req.body;

      const produto = await Produto.findByPk(id);

      if (!produto) {
        return res.status(404).json({ erro: 'Produto não encontrado' });
      }

      await produto.update({
        nome: nome || produto.nome,
        descricao: descricao || produto.descricao,
        preco: preco || produto.preco,
        estoque: estoque !== undefined ? estoque : produto.estoque
      });

      res.json({
        mensagem: 'Produto atualizado com sucesso',
        dados: produto
      });
    } catch (erro) {
      res.status(400).json({ erro: erro.message });
    }
  }

  static async deletar(req, res) {
    try {
      const { id } = req.params;

      const produto = await Produto.findByPk(id);

      if (!produto) {
        return res.status(404).json({ erro: 'Produto não encontrado' });
      }

      await produto.destroy();

      res.json({ mensagem: 'Produto deletado com sucesso' });
    } catch (erro) {
      res.status(400).json({ erro: erro.message });
    }
  }
}

module.exports = ProdutoController;