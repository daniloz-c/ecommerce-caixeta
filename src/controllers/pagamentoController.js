const Pagamento = require('../models/Pagamento');
const Pedido = require('../models/Pedido');
const { PagamentoFactory } = require('../patterns/PagamentoFactory');

class PagamentoController {
  static async listarTodos(req, res) {
    try {
      const pagamentos = await Pagamento.findAll({
        include: [{ association: 'Pedido', attributes: ['id', 'valor_total', 'status'] }]
      });

      res.json({
        mensagem: 'Pagamentos listados com sucesso',
        quantidade: pagamentos.length,
        dados: pagamentos
      });
    } catch (erro) {
      res.status(500).json({ erro: erro.message });
    }
  }

  static async buscarPorId(req, res) {
    try {
      const { id } = req.params;

      const pagamento = await Pagamento.findByPk(id);

      if (!pagamento) {
        return res.status(404).json({ erro: 'Pagamento não encontrado' });
      }

      res.json({
        mensagem: 'Pagamento encontrado',
        dados: pagamento
      });
    } catch (erro) {
      res.status(500).json({ erro: erro.message });
    }
  }

  static async buscarPorPedido(req, res) {
    try {
      const { pedidoId } = req.params;

      const pagamento = await Pagamento.findOne({
        where: { pedido_id: pedidoId }
      });

      if (!pagamento) {
        return res.status(404).json({ erro: 'Pagamento não encontrado para este pedido' });
      }

      res.json({
        mensagem: 'Pagamento encontrado',
        dados: pagamento
      });
    } catch (erro) {
      res.status(500).json({ erro: erro.message });
    }
  }

  static async processar(req, res) {
    try {
      const { pedidoId } = req.params;
      const { tipo, dados } = req.body;

      // Buscar pedido
      const pedido = await Pedido.findByPk(pedidoId);

      if (!pedido) {
        return res.status(404).json({ erro: 'Pedido não encontrado' });
      }

      // Buscar pagamento
      let pagamento = await Pagamento.findOne({
        where: { pedido_id: pedidoId }
      });

      if (!pagamento) {
        return res.status(404).json({ erro: 'Pagamento não encontrado para este pedido' });
      }

      // Validar tipo
      const tiposValidos = ['cartao_credito', 'pix', 'boleto'];
      if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
          erro: `Tipo de pagamento inválido. Valores aceitos: ${tiposValidos.join(', ')}`
        });
      }

      // Usar Factory para criar o pagamento
      try {
        const pagamentoObj = PagamentoFactory.criarPagamento(tipo, pagamento.valor, dados);
        const resultado = pagamentoObj.processar();

        // Atualizar status
        let statusNovo = 'pendente';
        if (tipo === 'cartao_credito' && resultado.sucesso) {
          statusNovo = 'aprovado';
        } else if (tipo === 'pix') {
          statusNovo = 'pendente_confirmacao';
        } else if (tipo === 'boleto') {
          statusNovo = 'emitido';
        }

        await pagamento.update({
          status: statusNovo,
          transacao_id: resultado.transacao_id || Math.random().toString(36).substr(2, 9)
        });

        // Adicionar informações específicas
        if (tipo === 'cartao_credito') {
          await pagamento.update({
            numero_cartao: dados.numeroCartao.slice(-4).padStart(16, '*')
          });
        } else if (tipo === 'pix') {
          await pagamento.update({
            chave_pix: dados.chavePixRecebedor
          });
        } else if (tipo === 'boleto') {
          await pagamento.update({
            numero_boleto: resultado.numero_boleto,
            data_vencimento: resultado.data_vencimento
          });
        }

        res.json({
          mensagem: 'Pagamento processado com sucesso',
          resultado,
          dados: pagamento
        });
      } catch (erroFactory) {
        res.status(400).json({ erro: erroFactory.message });
      }
    } catch (erro) {
      res.status(500).json({ erro: erro.message });
    }
  }
}

module.exports = PagamentoController;