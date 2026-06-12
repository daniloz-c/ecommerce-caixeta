const swaggerJsDoc = require('swagger-jsdoc');
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API E-commerce',
      version: '1.0.0',
      description: 'Backend de e-commerce com padrões criacionais (Singleton, Factory, Builder)',
      contact: {
        name: 'Seu Nome',
        email: 'seu.email@example.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${Number(process.env.PORT) || 3000}/api`,
        description: 'Servidor de Desenvolvimento'
      },
      {
        url: 'https://api-prod.com/api',
        description: 'Servidor de Produção'
      }
    ],
    components: {
      schemas: {
        Produto: {
          type: 'object',
          required: ['nome', 'preco'],
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            nome: {
              type: 'string',
              example: 'Notebook'
            },
            descricao: {
              type: 'string',
              example: 'Notebook de alta performance'
            },
            preco: {
              type: 'number',
              format: 'float',
              example: 3500.00
            },
            estoque: {
              type: 'integer',
              example: 10
            },
            criado_em: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Endereco: {
          type: 'object',
          required: ['rua', 'numero', 'cidade', 'estado', 'cep'],
          properties: {
            rua: {
              type: 'string',
              example: 'Rua das Flores'
            },
            numero: {
              type: 'string',
              example: '123'
            },
            complemento: {
              type: 'string',
              example: 'Apto 456'
            },
            cidade: {
              type: 'string',
              example: 'São Paulo'
            },
            estado: {
              type: 'string',
              example: 'SP'
            },
            cep: {
              type: 'string',
              example: '01234-567'
            }
          }
        },
        Pagamento: {
          type: 'object',
          required: ['tipo'],
          properties: {
            tipo: {
              type: 'string',
              enum: ['cartao_credito', 'pix', 'boleto'],
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
        Pedido: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            cliente_id: {
              type: 'integer',
              example: 1
            },
            status: {
              type: 'string',
              enum: ['rascunho', 'confirmado', 'processando', 'enviado', 'entregue', 'cancelado'],
              example: 'confirmado'
            },
            valor_total: {
              type: 'number',
              format: 'float',
              example: 3700.00
            },
            itens: {
              type: 'array',
              items: {
                type: 'object'
              }
            },
            criado_em: {
              type: 'string',
              format: 'date-time'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js'] // Procura por comentários JSDoc nas rotas
};

const specs = swaggerJsDoc(options);

module.exports = { specs };
