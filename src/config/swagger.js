const swaggerJsDoc = require('swagger-jsdoc');

const produtoExample = {
  id: 1,
  nome: 'Notebook Dell Inspiron',
  descricao: 'Notebook para trabalho e estudos',
  preco: 3500.00,
  estoque: 10,
  criado_em: '2026-06-17T12:00:00.000Z'
};

const pedidoExample = {
  id: 1,
  cliente_id: 10,
  status: 'confirmado',
  valor_total: 3700.00,
  rua: 'Rua das Flores',
  numero: '123',
  complemento: 'Apto 456',
  cidade: 'Sao Paulo',
  estado: 'SP',
  cep: '01234-567',
  criado_em: '2026-06-17T12:00:00.000Z'
};

const pagamentoExample = {
  id: 1,
  pedido_id: 1,
  tipo: 'pix',
  status: 'pendente_confirmacao',
  valor: 3700.00,
  chave_pix: '12345678901234567890',
  transacao_id: 'abc123xyz',
  processado_em: '2026-06-17T12:00:00.000Z'
};

const responseSchemas = {
  Mensagem: {
    type: 'object',
    properties: {
      mensagem: {
        type: 'string',
        example: 'Operacao realizada com sucesso'
      }
    }
  },
  Erro: {
    type: 'object',
    properties: {
      erro: {
        type: 'string',
        example: 'Recurso nao encontrado'
      }
    }
  },
  Health: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        example: 'API funcionando'
      }
    }
  },
  Produto: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      nome: { type: 'string', example: 'Notebook Dell Inspiron' },
      descricao: { type: 'string', example: 'Notebook para trabalho e estudos' },
      preco: { type: 'number', format: 'float', example: 3500.00 },
      estoque: { type: 'integer', example: 10 },
      criado_em: { type: 'string', format: 'date-time', example: '2026-06-17T12:00:00.000Z' }
    }
  },
  ProdutoRequest: {
    type: 'object',
    required: ['nome', 'preco'],
    properties: {
      nome: {
        type: 'string',
        minLength: 2,
        example: 'Notebook Dell Inspiron'
      },
      descricao: {
        type: 'string',
        example: 'Notebook para trabalho e estudos'
      },
      preco: {
        type: 'number',
        format: 'float',
        minimum: 0,
        example: 3500.00
      },
      estoque: {
        type: 'integer',
        minimum: 0,
        example: 10
      }
    }
  },
  ItemPedidoRequest: {
    type: 'object',
    required: ['produto_id', 'nome', 'preco', 'quantidade'],
    properties: {
      produto_id: { type: 'integer', example: 1 },
      nome: { type: 'string', example: 'Notebook Dell Inspiron' },
      preco: { type: 'number', format: 'float', minimum: 0, example: 3500.00 },
      quantidade: { type: 'integer', minimum: 1, example: 1 }
    }
  },
  Endereco: {
    type: 'object',
    required: ['rua', 'numero', 'cidade', 'estado', 'cep'],
    properties: {
      rua: { type: 'string', example: 'Rua das Flores' },
      numero: { type: 'string', example: '123' },
      complemento: { type: 'string', nullable: true, example: 'Apto 456' },
      cidade: { type: 'string', example: 'Sao Paulo' },
      estado: { type: 'string', minLength: 2, maxLength: 2, example: 'SP' },
      cep: { type: 'string', example: '01234-567' }
    }
  },
  PagamentoPedidoRequest: {
    type: 'object',
    required: ['tipo', 'dados'],
    properties: {
      tipo: {
        type: 'string',
        enum: ['cartao_credito', 'pix', 'boleto', 'gateway_legado'],
        example: 'pix'
      },
      dados: {
        type: 'object',
        example: {
          chavePixRecebedor: '12345678901234567890'
        }
      }
    }
  },
  PedidoRequest: {
    type: 'object',
    required: ['itens', 'endereco', 'pagamento'],
    properties: {
      cliente_id: { type: 'integer', nullable: true, example: 10 },
      itens: {
        type: 'array',
        minItems: 1,
        items: { $ref: '#/components/schemas/ItemPedidoRequest' }
      },
      endereco: { $ref: '#/components/schemas/Endereco' },
      pagamento: { $ref: '#/components/schemas/PagamentoPedidoRequest' }
    }
  },
  Pedido: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      cliente_id: { type: 'integer', nullable: true, example: 10 },
      status: {
        type: 'string',
        enum: ['rascunho', 'confirmado', 'processando', 'enviado', 'entregue', 'cancelado'],
        example: 'confirmado'
      },
      valor_total: { type: 'number', format: 'float', example: 3700.00 },
      rua: { type: 'string', example: 'Rua das Flores' },
      numero: { type: 'string', example: '123' },
      complemento: { type: 'string', nullable: true, example: 'Apto 456' },
      cidade: { type: 'string', example: 'Sao Paulo' },
      estado: { type: 'string', example: 'SP' },
      cep: { type: 'string', example: '01234-567' },
      criado_em: { type: 'string', format: 'date-time', example: '2026-06-17T12:00:00.000Z' }
    }
  },
  PedidoStatusRequest: {
    type: 'object',
    required: ['status'],
    properties: {
      status: {
        type: 'string',
        enum: ['rascunho', 'confirmado', 'processando', 'enviado', 'entregue', 'cancelado'],
        example: 'processando'
      }
    }
  },
  Pagamento: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      pedido_id: { type: 'integer', example: 1 },
      tipo: {
        type: 'string',
        enum: ['cartao_credito', 'pix', 'boleto', 'gateway_legado'],
        example: 'pix'
      },
      status: {
        type: 'string',
        enum: ['pendente', 'aprovado', 'recusado', 'cancelado', 'pendente_confirmacao', 'emitido'],
        example: 'pendente_confirmacao'
      },
      valor: { type: 'number', format: 'float', example: 3700.00 },
      numero_cartao: { type: 'string', nullable: true, example: '************1234' },
      chave_pix: { type: 'string', nullable: true, example: '12345678901234567890' },
      numero_boleto: { type: 'string', nullable: true, example: '34191790010104351004791020150008291070026000' },
      data_vencimento: { type: 'string', format: 'date-time', nullable: true },
      transacao_id: { type: 'string', nullable: true, example: 'abc123xyz' },
      processado_em: { type: 'string', format: 'date-time', example: '2026-06-17T12:00:00.000Z' }
    }
  },
  ProcessarPagamentoRequest: {
    type: 'object',
    required: ['tipo'],
    properties: {
      tipo: {
        type: 'string',
        enum: ['cartao_credito', 'pix', 'boleto', 'gateway_legado'],
        example: 'pix'
      },
      dados: {
        type: 'object',
        example: {
          chavePixRecebedor: '12345678901234567890'
        }
      },
      decoradores: {
        type: 'object',
        properties: {
          log: { type: 'boolean', example: true },
          descontoPercentual: { type: 'number', format: 'float', minimum: 0, maximum: 100, example: 10 }
        }
      }
    }
  }
};

const idParameter = name => ({
  name,
  in: 'path',
  required: true,
  schema: {
    type: 'integer',
    minimum: 1
  },
  example: 1
});

const successResponse = (description, schemaRef, example) => ({
  description,
  content: {
    'application/json': {
      schema: schemaRef,
      example
    }
  }
});

const errorResponse = (description, example) => ({
  description,
  content: {
    'application/json': {
      schema: { $ref: '#/components/schemas/Erro' },
      example
    }
  }
});

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API E-commerce',
      version: '1.0.0',
      description: 'Documentacao testavel da API de e-commerce com endpoints organizados por tags. Esta API nao utiliza autenticacao no estado atual do projeto.',
      contact: {
        name: 'Danilo',
        email: 'danilo@email.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${Number(process.env.PORT) || 3000}/api`,
        description: 'Servidor de desenvolvimento'
      }
    ],
    tags: [
      { name: 'Health', description: 'Verificacao de disponibilidade da API' },
      { name: 'Produtos', description: 'Cadastro e consulta de produtos' },
      { name: 'Pedidos', description: 'Criacao, consulta, status e cancelamento de pedidos' },
      { name: 'Pagamentos', description: 'Consulta e processamento de pagamentos' }
    ],
    components: {
      schemas: responseSchemas
    },
    paths: {
      '/health': {
        get: {
          tags: ['Health'],
          summary: 'Verifica se a API esta funcionando',
          description: 'Retorna o status basico da API.',
          responses: {
            200: successResponse('API disponivel', { $ref: '#/components/schemas/Health' }, { status: 'API funcionando' })
          }
        }
      },
      '/produtos': {
        get: {
          tags: ['Produtos'],
          summary: 'Lista todos os produtos',
          description: 'Retorna todos os produtos cadastrados no e-commerce.',
          responses: {
            200: successResponse('Produtos listados com sucesso', { type: 'object' }, {
              mensagem: 'Produtos listados com sucesso',
              quantidade: 1,
              dados: [produtoExample]
            }),
            500: errorResponse('Erro interno ao listar produtos', { erro: 'Erro ao acessar o banco de dados' })
          }
        },
        post: {
          tags: ['Produtos'],
          summary: 'Cria um produto',
          description: 'Cadastra um novo produto. Os campos nome e preco sao obrigatorios.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ProdutoRequest' },
                example: {
                  nome: 'Notebook Dell Inspiron',
                  descricao: 'Notebook para trabalho e estudos',
                  preco: 3500.00,
                  estoque: 10
                }
              }
            }
          },
          responses: {
            201: successResponse('Produto criado com sucesso', { type: 'object' }, {
              mensagem: 'Produto criado com sucesso',
              dados: produtoExample
            }),
            400: errorResponse('Dados invalidos', { erro: 'Nome e preco sao obrigatorios' }),
            500: errorResponse('Erro interno', { erro: 'Erro inesperado' })
          }
        }
      },
      '/produtos/{id}': {
        get: {
          tags: ['Produtos'],
          summary: 'Busca produto por ID',
          description: 'Consulta um produto especifico pelo identificador numerico.',
          parameters: [idParameter('id')],
          responses: {
            200: successResponse('Produto encontrado', { type: 'object' }, {
              mensagem: 'Produto encontrado',
              dados: produtoExample
            }),
            404: errorResponse('Produto nao encontrado', { erro: 'Produto nao encontrado' }),
            500: errorResponse('Erro interno', { erro: 'Erro inesperado' })
          }
        },
        put: {
          tags: ['Produtos'],
          summary: 'Atualiza um produto',
          description: 'Atualiza dados de um produto existente pelo ID.',
          parameters: [idParameter('id')],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ProdutoRequest' },
                example: {
                  nome: 'Notebook Dell Inspiron 15',
                  descricao: 'Notebook atualizado',
                  preco: 3650.00,
                  estoque: 8
                }
              }
            }
          },
          responses: {
            200: successResponse('Produto atualizado com sucesso', { type: 'object' }, {
              mensagem: 'Produto atualizado com sucesso',
              dados: { ...produtoExample, nome: 'Notebook Dell Inspiron 15', preco: 3650.00, estoque: 8 }
            }),
            400: errorResponse('Dados invalidos', { erro: 'Preco deve ser um numero valido' }),
            404: errorResponse('Produto nao encontrado', { erro: 'Produto nao encontrado' })
          }
        },
        delete: {
          tags: ['Produtos'],
          summary: 'Remove um produto',
          description: 'Remove um produto cadastrado pelo ID.',
          parameters: [idParameter('id')],
          responses: {
            200: successResponse('Produto deletado com sucesso', { $ref: '#/components/schemas/Mensagem' }, {
              mensagem: 'Produto deletado com sucesso'
            }),
            400: errorResponse('Erro ao deletar produto', { erro: 'Produto possui dependencias' }),
            404: errorResponse('Produto nao encontrado', { erro: 'Produto nao encontrado' })
          }
        }
      },
      '/pedidos': {
        get: {
          tags: ['Pedidos'],
          summary: 'Lista todos os pedidos',
          description: 'Retorna todos os pedidos com itens e pagamento associados.',
          responses: {
            200: successResponse('Pedidos listados com sucesso', { type: 'object' }, {
              mensagem: 'Pedidos listados com sucesso',
              quantidade: 1,
              dados: [{ ...pedidoExample, pagamento: pagamentoExample, itens: [] }]
            }),
            500: errorResponse('Erro interno', { erro: 'Erro ao acessar o banco de dados' })
          }
        },
        post: {
          tags: ['Pedidos'],
          summary: 'Cria um pedido',
          description: 'Cria um pedido completo usando itens, endereco e dados de pagamento.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PedidoRequest' },
                example: {
                  cliente_id: 10,
                  itens: [
                    { produto_id: 1, nome: 'Notebook Dell Inspiron', preco: 3500.00, quantidade: 1 },
                    { produto_id: 2, nome: 'Mouse sem fio', preco: 100.00, quantidade: 2 }
                  ],
                  endereco: {
                    rua: 'Rua das Flores',
                    numero: '123',
                    complemento: 'Apto 456',
                    cidade: 'Sao Paulo',
                    estado: 'SP',
                    cep: '01234-567'
                  },
                  pagamento: {
                    tipo: 'pix',
                    dados: {
                      chavePixRecebedor: '12345678901234567890'
                    }
                  }
                }
              }
            }
          },
          responses: {
            201: successResponse('Pedido criado com sucesso', { type: 'object' }, {
              mensagem: 'Pedido criado com sucesso',
              dados: { ...pedidoExample, pagamento: pagamentoExample, itens: [] },
              checkout: {
                sucesso: true,
                mensagem: 'Checkout finalizado para o pedido 1'
              }
            }),
            400: errorResponse('Dados invalidos', { erro: 'Pedido deve conter pelo menos um item' }),
            500: errorResponse('Erro interno', { erro: 'Erro inesperado' })
          }
        }
      },
      '/pedidos/{id}': {
        get: {
          tags: ['Pedidos'],
          summary: 'Busca pedido por ID',
          description: 'Consulta um pedido pelo identificador numerico.',
          parameters: [idParameter('id')],
          responses: {
            200: successResponse('Pedido encontrado', { type: 'object' }, {
              mensagem: 'Pedido encontrado',
              dados: { ...pedidoExample, pagamento: pagamentoExample, itens: [] }
            }),
            404: errorResponse('Pedido nao encontrado', { erro: 'Pedido nao encontrado' }),
            500: errorResponse('Erro interno', { erro: 'Erro inesperado' })
          }
        },
        delete: {
          tags: ['Pedidos'],
          summary: 'Cancela um pedido',
          description: 'Cancela um pedido, exceto quando ele ja esta entregue.',
          parameters: [idParameter('id')],
          responses: {
            200: successResponse('Pedido cancelado com sucesso', { type: 'object' }, {
              mensagem: 'Pedido cancelado com sucesso',
              dados: { ...pedidoExample, status: 'cancelado' }
            }),
            400: errorResponse('Pedido nao pode ser cancelado', { erro: 'Nao e possivel cancelar um pedido ja entregue' }),
            404: errorResponse('Pedido nao encontrado', { erro: 'Pedido nao encontrado' })
          }
        }
      },
      '/pedidos/{id}/status': {
        put: {
          tags: ['Pedidos'],
          summary: 'Atualiza status do pedido',
          description: 'Atualiza o status de um pedido existente.',
          parameters: [idParameter('id')],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PedidoStatusRequest' },
                example: {
                  status: 'processando'
                }
              }
            }
          },
          responses: {
            200: successResponse('Status atualizado com sucesso', { type: 'object' }, {
              mensagem: 'Status do pedido atualizado com sucesso',
              dados: { ...pedidoExample, status: 'processando' }
            }),
            400: errorResponse('Status invalido', { erro: 'Status invalido. Valores aceitos: rascunho, confirmado, processando, enviado, entregue, cancelado' }),
            404: errorResponse('Pedido nao encontrado', { erro: 'Pedido nao encontrado' })
          }
        }
      },
      '/pagamentos': {
        get: {
          tags: ['Pagamentos'],
          summary: 'Lista todos os pagamentos',
          description: 'Retorna todos os pagamentos cadastrados.',
          responses: {
            200: successResponse('Pagamentos listados com sucesso', { type: 'object' }, {
              mensagem: 'Pagamentos listados com sucesso',
              quantidade: 1,
              dados: [pagamentoExample]
            }),
            500: errorResponse('Erro interno', { erro: 'Erro ao acessar o banco de dados' })
          }
        }
      },
      '/pagamentos/{id}': {
        get: {
          tags: ['Pagamentos'],
          summary: 'Busca pagamento por ID',
          description: 'Consulta um pagamento pelo identificador numerico.',
          parameters: [idParameter('id')],
          responses: {
            200: successResponse('Pagamento encontrado', { type: 'object' }, {
              mensagem: 'Pagamento encontrado',
              dados: pagamentoExample
            }),
            404: errorResponse('Pagamento nao encontrado', { erro: 'Pagamento nao encontrado' }),
            500: errorResponse('Erro interno', { erro: 'Erro inesperado' })
          }
        }
      },
      '/pagamentos/{pedidoId}/processar': {
        post: {
          tags: ['Pagamentos'],
          summary: 'Processa pagamento de um pedido',
          description: 'Processa o pagamento de um pedido usando Factory, Adapter e Decorators opcionais.',
          parameters: [idParameter('pedidoId')],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ProcessarPagamentoRequest' },
                example: {
                  tipo: 'pix',
                  dados: {
                    chavePixRecebedor: '12345678901234567890'
                  },
                  decoradores: {
                    log: true,
                    descontoPercentual: 10
                  }
                }
              }
            }
          },
          responses: {
            200: successResponse('Pagamento processado com sucesso', { type: 'object' }, {
              mensagem: 'Pagamento processado com sucesso',
              resultado: {
                sucesso: true,
                mensagem: 'QR Code gerado. Aguardando confirmacao',
                qr_code: 'dados_qr_code_simulado',
                desconto_percentual: 10,
                valor_cobrado: 3330.00
              },
              dados: { ...pagamentoExample, valor: 3330.00 }
            }),
            400: errorResponse('Tipo de pagamento invalido ou dados invalidos', { erro: 'Tipo de pagamento invalido. Valores aceitos: cartao_credito, pix, boleto, gateway_legado' }),
            404: errorResponse('Pedido ou pagamento nao encontrado', { erro: 'Pagamento nao encontrado para este pedido' }),
            500: errorResponse('Erro interno', { erro: 'Erro inesperado' })
          }
        }
      },
      '/pagamentos/pedido/{pedidoId}': {
        get: {
          tags: ['Pagamentos'],
          summary: 'Busca pagamento por pedido',
          description: 'Consulta o pagamento associado a um pedido.',
          parameters: [idParameter('pedidoId')],
          responses: {
            200: successResponse('Pagamento encontrado', { type: 'object' }, {
              mensagem: 'Pagamento encontrado',
              dados: pagamentoExample
            }),
            404: errorResponse('Pagamento nao encontrado para este pedido', { erro: 'Pagamento nao encontrado para este pedido' }),
            500: errorResponse('Erro interno', { erro: 'Erro inesperado' })
          }
        }
      }
    }
  },
  apis: []
};

const specs = swaggerJsDoc(options);

module.exports = { specs };
