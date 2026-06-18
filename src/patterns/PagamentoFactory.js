class Pagamento {
  constructor(valor) {
    this.valor = valor;
    this.status = 'pendente';
  }

  processar() {
    throw new Error('Método processar() deve ser implementado');
  }

  getDetalhes() {
    throw new Error('Método getDetalhes() deve ser implementado');
  }
}

class CartaoCredito extends Pagamento {
  constructor(valor, numeroCartao, cvv, validade) {
    super(valor);
    this.tipo = 'cartao_credito';
    this.numeroCartao = numeroCartao;
    this.cvv = cvv;
    this.validade = validade;
  }

  processar() {
    // Lógica de processamento de cartão
    this.status = 'aprovado';
    return {
      sucesso: true,
      mensagem: 'Pagamento com cartão aprovado',
      transacao_id: Math.random().toString(36).substr(2, 9)
    };
  }

  getDetalhes() {
    return {
      tipo: this.tipo,
      numeroCartao: this.numeroCartao.slice(-4).padStart(16, '*'),
      valor: this.valor,
      status: this.status
    };
  }
}

class PIX extends Pagamento {
  constructor(valor, chavePixRecebedor) {
    super(valor);
    this.tipo = 'pix';
    this.chavePixRecebedor = chavePixRecebedor;
  }

  processar() {
    // Lógica de processamento PIX
    this.status = 'pendente_confirmacao';
    return {
      sucesso: true,
      mensagem: 'QR Code gerado. Aguardando confirmação',
      qr_code: 'dados_qr_code_simulado'
    };
  }

  getDetalhes() {
    return {
      tipo: this.tipo,
      chavePixRecebedor: this.chavePixRecebedor,
      valor: this.valor,
      status: this.status
    };
  }
}

class Boleto extends Pagamento {
  constructor(valor, cnpjBeneficiario) {
    super(valor);
    this.tipo = 'boleto';
    this.cnpjBeneficiario = cnpjBeneficiario;
  }

  processar() {
    // Lógica de geração de boleto
    this.status = 'emitido';
    return {
      sucesso: true,
      mensagem: 'Boleto gerado com sucesso',
      numero_boleto: Math.random().toString().slice(2, 50),
      data_vencimento: '2026-06-20'
    };
  }

  getDetalhes() {
    return {
      tipo: this.tipo,
      cnpjBeneficiario: this.cnpjBeneficiario,
      valor: this.valor,
      status: this.status
    };
  }
}

class GatewayLegado {
  cobrar(valorEmCentavos, referenciaExterna) {
    return {
      aprovado: true,
      codigoTransacao: `LEG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      descricao: `Pagamento legado aprovado para a referencia ${referenciaExterna}`,
      valorProcessado: valorEmCentavos
    };
  }
}

class GatewayAdapter extends Pagamento {
  constructor(valor, gatewayLegado, referenciaExterna) {
    super(valor);
    this.tipo = 'gateway_legado';
    this.gatewayLegado = gatewayLegado;
    this.referenciaExterna = referenciaExterna;
  }

  processar() {
    const valorEmCentavos = Math.round(Number(this.valor) * 100);
    const respostaLegada = this.gatewayLegado.cobrar(valorEmCentavos, this.referenciaExterna);

    this.status = respostaLegada.aprovado ? 'aprovado' : 'recusado';

    return {
      sucesso: respostaLegada.aprovado,
      mensagem: respostaLegada.descricao,
      transacao_id: respostaLegada.codigoTransacao,
      resposta_legada: respostaLegada
    };
  }

  getDetalhes() {
    return {
      tipo: this.tipo,
      valor: this.valor,
      status: this.status,
      referenciaExterna: this.referenciaExterna
    };
  }
}

class PagamentoFactory {
  static criarPagamento(tipo, valor, dados = {}) {
    switch (tipo.toLowerCase()) {
      case 'cartao_credito':
        return new CartaoCredito(valor, dados.numeroCartao, dados.cvv, dados.validade);
      case 'pix':
        return new PIX(valor, dados.chavePixRecebedor);
      case 'boleto':
        return new Boleto(valor, dados.cnpjBeneficiario);
      case 'gateway_legado':
        return new GatewayAdapter(
          valor,
          new GatewayLegado(),
          dados.referenciaExterna || dados.clienteId || 'pedido-sem-referencia'
        );
      default:
        throw new Error(`Tipo de pagamento inválido: ${tipo}`);
    }
  }
}

module.exports = { Pagamento, PagamentoFactory, CartaoCredito, PIX, Boleto, GatewayLegado, GatewayAdapter };
