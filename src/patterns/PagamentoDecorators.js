const { Pagamento } = require('./PagamentoFactory');

class PagamentoDecorator extends Pagamento {
  constructor(pagamento) {
    super(pagamento.valor);
    this.pagamento = pagamento;
    this.tipo = pagamento.tipo;
  }

  processar() {
    return this.pagamento.processar();
  }

  getDetalhes() {
    return this.pagamento.getDetalhes();
  }
}

class LogDecorator extends PagamentoDecorator {
  processar() {
    console.log(`[Pagamento] Valor cobrado: R$ ${Number(this.valor).toFixed(2)}`);
    return this.pagamento.processar();
  }
}

class DescontoDecorator extends PagamentoDecorator {
  constructor(pagamento, percentual) {
    super(pagamento);
    this.percentual = Number(percentual);
    this.valorOriginal = Number(pagamento.valor);
    this.valor = this.calcularValorComDesconto();
  }

  calcularValorComDesconto() {
    const desconto = this.valorOriginal * (this.percentual / 100);
    return Number((this.valorOriginal - desconto).toFixed(2));
  }

  processar() {
    this.pagamento.valor = this.valor;
    const resultado = this.pagamento.processar();

    return {
      ...resultado,
      desconto_percentual: this.percentual,
      valor_original: this.valorOriginal,
      valor_cobrado: this.valor
    };
  }

  getDetalhes() {
    return {
      ...this.pagamento.getDetalhes(),
      descontoPercentual: this.percentual,
      valorOriginal: this.valorOriginal,
      valorComDesconto: this.valor
    };
  }
}

function aplicarDecoradores(pagamento, opcoes = {}) {
  let pagamentoDecorado = pagamento;

  if (opcoes.descontoPercentual > 0) {
    pagamentoDecorado = new DescontoDecorator(pagamentoDecorado, opcoes.descontoPercentual);
  }

  if (opcoes.log) {
    pagamentoDecorado = new LogDecorator(pagamentoDecorado);
  }

  return pagamentoDecorado;
}

module.exports = { PagamentoDecorator, LogDecorator, DescontoDecorator, aplicarDecoradores };
