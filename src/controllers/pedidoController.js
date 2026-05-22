const Pedido = require('../models/Pedido');
const ItemPedido = require('../models/ItemPedido');
const Pagamento = require('../models/Pagamento');
const { PedidoBuilderHelper } = require('../patterns/PedidoBuilder');

class PedidoController {
  static async listarTodos(req, res) {
    try {
      const pedidos = await Pedido.findAll({
        include: [
          { association: 'itens', include: ['produto'] },
          'pagamento'
        ]
      });

      res.json({
        mensagem: 'Pedidos listados com sucesso',
        quantidade: pedidos.length,
        dados: pedidos
      });
    } catch (erro) {
      res.status(500).json({ erro: erro.message });
    }
  }

  static async buscarPorId(req, res) {
    try {
      const { id } = req.params;

      const pedido = await Pedido.findByPk(id, {
        include: [
          { association: 'itens', include: ['produto'] },
          'pagamento'
        ]
      });

      if (!pedido) {
        return res.status(404).json({ erro: 'Pedido não encontrado' });
      }

      res.json({
        mensagem: 'Pedido encontrado',
        dados: pedido
      });
    } catch (erro) {
      res.status(500).json({ erro: erro.message });
    }
  }

  static async criar(req, res) {
    try {
      const { itens, endereco, pagamento, cliente_id } = req.body;

      // Validações
      if (!itens || itens.length === 0) {
        return res.status(400).json({ erro: 'Pedido deve conter pelo menos um item' });
      }

      if (!endereco) {
        return res.status(400).json({ erro: 'Endereço é obrigatório' });
      }

      if (!pagamento) {
        return res.status(400).json({ erro: 'Forma de pagamento é obrigatória' });
      }

      const builder = new PedidoBuilderHelper();

      // Adicionar itens
      for (const item of itens) {
        builder.adicionarItem(
          item.produto_id,
          item.nome,
          item.preco,
          item.quantidade
        );
      }

      // Definir endereço
      builder.definirEndereco(
        endereco.rua,
        endereco.numero,
        endereco.complemento,
        endereco.cidade,
        endereco.estado,
        endereco.cep
      );

      // Definir cliente
      if (cliente_id) {
        builder.definirClienteId(cliente_id);
      }

      // Definir pagamento
      const valorTotal = itens.reduce((sum, item) => sum + item.preco * item.quantidade, 0);
      builder.definirPagamento(pagamento.tipo, valorTotal, pagamento.dados);

      // Finalizar pedido
      const pedidoFinal = await builder.finalizarPedido();

      res.status(201).json({
        mensagem: 'Pedido criado com sucesso',
        dados: pedidoFinal
      });
    } catch (erro) {
      res.status(400).json({ erro: erro.message });
    }
  }

  static async atualizarStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const statusValidos = ['rascunho', 'confirmado', 'processando', 'enviado', 'entregue', 'cancelado'];

      if (!statusValidos.includes(status)) {
        return res.status(400).json({
          erro: `Status inválido. Valores aceitos: ${statusValidos.join(', ')}`
        });
      }

      const pedido = await Pedido.findByPk(id);

      if (!pedido) {
        return res.status(404).json({ erro: 'Pedido não encontrado' });
      }

      await pedido.update({ status });

      res.json({
        mensagem: 'Status do pedido atualizado com sucesso',
        dados: pedido
      });
    } catch (erro) {
      res.status(400).json({ erro: erro.message });
    }
  }

  static async cancelar(req, res) {
    try {
      const { id } = req.params;

      const pedido = await Pedido.findByPk(id);

      if (!pedido) {
        return res.status(404).json({ erro: 'Pedido não encontrado' });
      }

      if (pedido.status === 'entregue') {
        return res.status(400).json({ erro: 'Não é possível cancelar um pedido já entregue' });
      }

      await pedido.update({ status: 'cancelado' });

      res.json({
        mensagem: 'Pedido cancelado com sucesso',
        dados: pedido
      });
    } catch (erro) {
      res.status(400).json({ erro: erro.message });
    }
  }
}

module.exports = PedidoController;