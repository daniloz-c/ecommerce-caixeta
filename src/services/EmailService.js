class EmailService {
  async enviarConfirmacao(pedido) {
    return {
      sucesso: true,
      mensagem: `E-mail de confirmacao enviado para o pedido ${pedido.id}`
    };
  }
}

module.exports = EmailService;
