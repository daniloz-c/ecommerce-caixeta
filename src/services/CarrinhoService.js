class CarrinhoService {
  async limpar(pedido) {
    return {
      sucesso: true,
      mensagem: `Carrinho limpo para o cliente ${pedido.cliente_id || 'sem cadastro'}`
    };
  }
}

module.exports = CarrinhoService;
