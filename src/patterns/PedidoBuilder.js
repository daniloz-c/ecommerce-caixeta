const Pedido = require('../models/Pedido');
const ItemPedido = require('../models/ItemPedido');
const Pagamento = require('../models/Pagamento');

class PedidoBuilderHelper {
  constructor() {
    this.itens = [];
    this.endereco = null;
    this.pagamento = null;
    this.cliente_id = null;
  }

  adicionarItem(produto_id, nome, preco, quantidade) {
    this.itens.push({
      produto_id,
      nome,
      preco,
      quantidade,
      subtotal: preco * quantidade
    });
    return this;
  }

  removerItem(produto_id) {
    this.itens = this.itens.filter(item => item.produto_id !== produto_id);
    return this;
  }

  definirEndereco(rua, numero, complemento, cidade, estado, cep) {
    this.endereco = {
      rua,
      numero,
      complemento,
      cidade,
      estado,
      cep
    };
    return this;
  }

  definirPagamento(tipo, valor, dados) {
    this.pagamento = {
      tipo,
      valor,
      dados
    };
    return this;
  }

  definirClienteId(cliente_id) {
    this.cliente_id = cliente_id;
    return this;
  }

  async finalizarPedido() {
    // Validações
    if (this.itens.length === 0) {
      throw new Error('Pedido deve conter pelo menos um item');
    }
    if (!this.endereco) {
      throw new Error('Endereço de entrega não foi definido');
    }
    if (!this.pagamento) {
      throw new Error('Forma de pagamento não foi definida');
    }

    const valorTotal = this.itens.reduce((sum, item) => sum + item.subtotal, 0);

    try {
      // Criar pedido
      const pedido = await Pedido.create({
        cliente_id: this.cliente_id,
        status: 'confirmado',
        valor_total: valorTotal,
        rua: this.endereco.rua,
        numero: this.endereco.numero,
        complemento: this.endereco.complemento,
        cidade: this.endereco.cidade,
        estado: this.endereco.estado,
        cep: this.endereco.cep
      });

      // Criar itens do pedido
      for (const item of this.itens) {
        await ItemPedido.create({
          pedido_id: pedido.id,
          produto_id: item.produto_id,
          quantidade: item.quantidade,
          preco_unitario: item.preco,
          subtotal: item.subtotal
        });
      }

      // Criar pagamento
      const pagamentoDados = {
        pedido_id: pedido.id,
        tipo: this.pagamento.tipo,
        valor: this.pagamento.valor,
        status: 'pendente',
        transacao_id: Math.random().toString(36).substr(2, 9)
      };

      // Adicionar dados específicos do tipo de pagamento
      if (this.pagamento.tipo === 'cartao_credito') {
        pagamentoDados.numero_cartao = this.pagamento.dados.numeroCartao.slice(-4);
      } else if (this.pagamento.tipo === 'pix') {
        pagamentoDados.chave_pix = this.pagamento.dados.chavePixRecebedor;
      } else if (this.pagamento.tipo === 'boleto') {
        pagamentoDados.numero_boleto = Math.random().toString().slice(2, 50);
        pagamentoDados.data_vencimento = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      }

      await Pagamento.create(pagamentoDados);

      // Retornar pedido com relações
      return await Pedido.findByPk(pedido.id, {
        include: [
          { association: 'itens', include: ['produto'] },
          'pagamento'
        ]
      });
    } catch (erro) {
      throw new Error(`Erro ao finalizar pedido: ${erro.message}`);
    }
  }

  limpar() {
    this.itens = [];
    this.endereco = null;
    this.pagamento = null;
    this.cliente_id = null;
    return this;
  }
}

module.exports = { PedidoBuilderHelper };