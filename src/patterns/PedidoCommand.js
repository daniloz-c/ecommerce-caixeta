class Comando {
  executar() {
    throw new Error('Metodo executar() deve ser implementado');
  }

  desfazer() {
    throw new Error('Metodo desfazer() deve ser implementado');
  }
}

class PedidoAdministrativo {
  constructor(id, status = 'confirmado', endereco = {}) {
    this.id = id;
    this.status = status;
    this.endereco = endereco;
  }
}

class CancelarPedidoComando extends Comando {
  constructor(pedido) {
    super();
    this.pedido = pedido;
    this.statusAnterior = null;
  }

  executar() {
    this.statusAnterior = this.pedido.status;
    this.pedido.status = 'cancelado';

    return {
      acao: 'cancelar_pedido',
      pedidoId: this.pedido.id,
      statusAnterior: this.statusAnterior,
      statusAtual: this.pedido.status
    };
  }

  desfazer() {
    this.pedido.status = this.statusAnterior;

    return {
      acao: 'desfazer_cancelamento',
      pedidoId: this.pedido.id,
      statusAtual: this.pedido.status
    };
  }
}

class AtualizarEnderecoComando extends Comando {
  constructor(pedido, novoEndereco) {
    super();
    this.pedido = pedido;
    this.novoEndereco = novoEndereco;
    this.enderecoAnterior = null;
  }

  executar() {
    this.enderecoAnterior = { ...this.pedido.endereco };
    this.pedido.endereco = { ...this.novoEndereco };

    return {
      acao: 'atualizar_endereco',
      pedidoId: this.pedido.id,
      enderecoAnterior: this.enderecoAnterior,
      enderecoAtual: this.pedido.endereco
    };
  }

  desfazer() {
    this.pedido.endereco = { ...this.enderecoAnterior };

    return {
      acao: 'desfazer_atualizacao_endereco',
      pedidoId: this.pedido.id,
      enderecoAtual: this.pedido.endereco
    };
  }
}

class GerenciadorComandos {
  constructor() {
    this.historico = [];
    this.auditoria = [];
  }

  executar(comando) {
    if (!comando || typeof comando.executar !== 'function' || typeof comando.desfazer !== 'function') {
      throw new Error('Comando invalido');
    }

    const resultado = comando.executar();
    this.historico.push(comando);
    this.auditoria.push({ tipo: 'executar', resultado });
    return resultado;
  }

  desfazerUltimo() {
    const comando = this.historico.pop();

    if (!comando) {
      return null;
    }

    const resultado = comando.desfazer();
    this.auditoria.push({ tipo: 'desfazer', resultado });
    return resultado;
  }

  obterAuditoria() {
    return [...this.auditoria];
  }
}

function demonstrarComandos() {
  const pedido = new PedidoAdministrativo(1, 'confirmado', {
    rua: 'Rua A',
    numero: '123'
  });
  const gerenciador = new GerenciadorComandos();

  gerenciador.executar(new CancelarPedidoComando(pedido));
  const statusCancelado = pedido.status;
  gerenciador.desfazerUltimo();
  const statusRestaurado = pedido.status;

  gerenciador.executar(new AtualizarEnderecoComando(pedido, {
    rua: 'Rua B',
    numero: '456'
  }));
  const enderecoAtualizado = pedido.endereco;
  gerenciador.desfazerUltimo();
  const enderecoRestaurado = pedido.endereco;

  return {
    statusCancelado,
    statusRestaurado,
    enderecoAtualizado,
    enderecoRestaurado,
    auditoria: gerenciador.obterAuditoria()
  };
}

module.exports = {
  Comando,
  PedidoAdministrativo,
  CancelarPedidoComando,
  AtualizarEnderecoComando,
  GerenciadorComandos,
  demonstrarComandos
};
