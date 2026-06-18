// Simplifica o fluxo de checkout. Em vez de o controller chamar várias classes separadas, 
// como pedido, pagamento, frete, estoque e notificação, 
// ele chama uma única fachada, por exemplo CheckoutFacade, que organiza todo o processo.

const EstoqueService = require('../services/EstoqueService');
const PagamentoService = require('../services/PagamentoService');
const CarrinhoService = require('../services/CarrinhoService');
const EmailService = require('../services/EmailService');

class CheckoutFacade {
  constructor({
    estoqueService = new EstoqueService(),
    pagamentoService = new PagamentoService(),
    carrinhoService = new CarrinhoService(),
    emailService = new EmailService()
  } = {}) {
    this.estoqueService = estoqueService;
    this.pagamentoService = pagamentoService;
    this.carrinhoService = carrinhoService;
    this.emailService = emailService;
  }

  async finalizar(pedido) {
    const estoque = await this.estoqueService.verificar(pedido);
    const pagamento = await this.pagamentoService.processar(pedido);
    const carrinho = await this.carrinhoService.limpar(pedido);
    const email = await this.emailService.enviarConfirmacao(pedido);

    return {
      sucesso: true,
      mensagem: `Checkout finalizado para o pedido ${pedido.id}`,
      etapas: {
        estoque,
        pagamento,
        carrinho,
        email
      }
    };
  }
}

module.exports = CheckoutFacade;
