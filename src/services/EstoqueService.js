class EstoqueService {
  async verificar(pedido) {
    return {
      sucesso: true,
      mensagem: `Estoque verificado para o pedido ${pedido.id}`
    };
  }
}

module.exports = EstoqueService;
