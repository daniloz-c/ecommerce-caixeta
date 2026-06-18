// Permite notificar automaticamente outras partes do sistema quando o status do pedido muda. 
// Por exemplo, quando o pedido é confirmado, enviado ou entregue, o sistema pode disparar e-mail, 
// notificação ou registrar logs sem acoplar isso diretamente ao pedido.

class Observer {
  atualizar() {
    throw new Error('Metodo atualizar(pedido) deve ser implementado');
  }
}

class Pedido {
  constructor(id, status = 'rascunho') {
    this.id = id;
    this.status = status;
    this.observers = [];
  }

  adicionarObserver(observer) {
    if (!observer || typeof observer.atualizar !== 'function') {
      throw new Error('Observer invalido');
    }

    this.observers.push(observer);
    return this;
  }

  removerObserver(observer) {
    this.observers = this.observers.filter(item => item !== observer);
    return this;
  }

  notificar() {
    this.observers.forEach(observer => observer.atualizar(this));
  }

  alterarStatus(status) {
    this.status = status;
    this.notificar();
    return this;
  }
}

class EmailObserver extends Observer {
  atualizar(pedido) {
    console.log(`[Email] Cliente notificado sobre o pedido ${pedido.id} com status ${pedido.status}`);
  }
}

class EstoqueObserver extends Observer {
  atualizar(pedido) {
    console.log(`[Estoque] Baixa de estoque solicitada para o pedido ${pedido.id}`);
  }
}

class LogObserver extends Observer {
  atualizar(pedido) {
    console.log(`[Auditoria] Pedido ${pedido.id} alterado para ${pedido.status}`);
  }
}

function demonstrarObservers() {
  const eventos = [];
  const registrar = mensagem => eventos.push(mensagem);

  class EmailTesteObserver extends Observer {
    atualizar(pedido) {
      registrar(`email:${pedido.id}:${pedido.status}`);
    }
  }

  class EstoqueTesteObserver extends Observer {
    atualizar(pedido) {
      registrar(`estoque:${pedido.id}:${pedido.status}`);
    }
  }

  class LogTesteObserver extends Observer {
    atualizar(pedido) {
      registrar(`log:${pedido.id}:${pedido.status}`);
    }
  }

  const pedido = new Pedido(1);
  pedido
    .adicionarObserver(new EmailTesteObserver())
    .adicionarObserver(new EstoqueTesteObserver())
    .adicionarObserver(new LogTesteObserver())
    .alterarStatus('confirmado');

  return eventos;
}

module.exports = {
  Observer,
  Pedido,
  EmailObserver,
  EstoqueObserver,
  LogObserver,
  demonstrarObservers
};
