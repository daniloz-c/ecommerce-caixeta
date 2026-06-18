class PagamentoService {
  async processar(pedido) {
    return {
      sucesso: true,
      mensagem: `Pagamento preparado para o pedido ${pedido.id}`,
      pagamento: pedido.pagamento || null
    };
  }
}

module.exports = PagamentoService;
