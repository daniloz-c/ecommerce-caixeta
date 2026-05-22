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

class PagamentoFactory {
  static criarPagamento(tipo, valor, dados) {
    switch (tipo.toLowerCase()) {
      case 'cartao_credito':
        return new CartaoCredito(valor, dados.numeroCartao, dados.cvv, dados.validade);
      case 'pix':
        return new PIX(valor, dados.chavePixRecebedor);
      case 'boleto':
        return new Boleto(valor, dados.cnpjBeneficiario);
      default:
        throw new Error(`Tipo de pagamento inválido: ${tipo}`);
    }
  }
}

module.exports = { PagamentoFactory, CartaoCredito, PIX, Boleto };