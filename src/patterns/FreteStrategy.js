class EstrategiaFrete {
  calcular() {
    throw new Error('Metodo calcular(peso) deve ser implementado');
  }
}

class FreteCorreios extends EstrategiaFrete {
  calcular(peso) {
    return Number((12 + peso * 4.5).toFixed(2));
  }
}

class FreteJadlog extends EstrategiaFrete {
  calcular(peso) {
    return Number((18 + peso * 3.2).toFixed(2));
  }
}

class FreteRetirada extends EstrategiaFrete {
  calcular() {
    return 0;
  }
}

class Carrinho {
  constructor(estrategiaFrete) {
    this.itens = [];
    this.setFrete(estrategiaFrete);
  }

  adicionarItem(nome, peso) {
    this.itens.push({ nome, peso: Number(peso) });
    return this;
  }

  setFrete(estrategiaFrete) {
    if (!estrategiaFrete || typeof estrategiaFrete.calcular !== 'function') {
      throw new Error('Estrategia de frete invalida');
    }

    this.estrategiaFrete = estrategiaFrete;
    return this;
  }

  obterPesoTotal() {
    return this.itens.reduce((total, item) => total + item.peso, 0);
  }

  calcularFrete() {
    return this.estrategiaFrete.calcular(this.obterPesoTotal());
  }
}

function demonstrarTrocaEstrategia() {
  const carrinho = new Carrinho(new FreteCorreios())
    .adicionarItem('Notebook', 2.4)
    .adicionarItem('Mouse', 0.3);

  const correios = carrinho.calcularFrete();
  const jadlog = carrinho.setFrete(new FreteJadlog()).calcularFrete();
  const retirada = carrinho.setFrete(new FreteRetirada()).calcularFrete();

  return { correios, jadlog, retirada };
}

module.exports = {
  EstrategiaFrete,
  FreteCorreios,
  FreteJadlog,
  FreteRetirada,
  Carrinho,
  demonstrarTrocaEstrategia
};
