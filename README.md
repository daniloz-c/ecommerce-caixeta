# E-commerce Backend - Design Patterns

Um backend completo de e-commerce desenvolvido em **Node.js** com **Express** e **Sequelize**, implementando três padrões criacionais fundamentais: **Singleton**, **Factory Method** e **Builder**.

---

## 📋 Informações do Projeto

### Tecnologias Utilizadas

- **Node.js**: Runtime JavaScript
- **Express.js**: Framework web
- **Sequelize**: ORM para MySQL
- **MySQL** (XAMPP): Banco de dados
- **dotenv**: Gerenciamento de variáveis de ambiente

### Dependências Principais

```json
{
  "express": "^4.18.x",
  "mysql2": "^3.x.x",
  "sequelize": "^6.x.x",
  "dotenv": "^16.x.x"
}
```

### Estrutura do Projeto

```
ecommerce-backend/
├── src/
│   ├── config/
│   │   └── database.js          // Singleton: Conexão BD
│   ├── patterns/
│   │   ├── PagamentoFactory.js  // Factory: Criação de pagamentos
│   │   └── PedidoBuilder.js     // Builder: Construção de pedidos
│   ├── models/
│   │   ├── Produto.js           // Modelo ORM
│   │   ├── Pedido.js            // Modelo ORM com relações
│   │   ├── Pagamento.js         // Modelo ORM
│   │   └── ItemPedido.js        // Modelo ORM (itens do pedido)
│   ├── controllers/
│   │   ├── produtoController.js
│   │   ├── pedidoController.js
│   │   └── pagamentoController.js
│   ├── routes/
│   │   ├── index.js
│   │   ├── produtoRoutes.js
│   │   ├── pedidoRoutes.js
│   │   └── pagamentoRoutes.js
│   └── server.js                // Servidor principal
├── .env                         // Variáveis de ambiente
├── .gitignore
└── package.json
```

---

## 🏗️ Padrões de Design Implementados

### 1. **SINGLETON** - Conexão com Banco de Dados

#### O que é Singleton?

O padrão **Singleton** garante que uma classe tenha apenas **uma única instância** durante toda a execução da aplicação. Isso é útil para recursos que devem ser compartilhados, como conexões com banco de dados.

#### Por que usar?

- ✅ Evita múltiplas conexões desnecessárias com o BD
- ✅ Economiza memória e recursos do servidor
- ✅ Garante consistência nos dados
- ✅ Facilita gerenciamento centralizado

#### Implementação

**Arquivo: `src/config/database.js`**

```javascript
class Database {
  static instance = null; // Armazena a única instância

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database(); // Cria apenas uma vez
    }
    return Database.instance; // Retorna sempre a mesma instância
  }

  constructor() {
    this.sequelize = new Sequelize(...); // Conexão
  }
}

module.exports = Database;
```

#### Como usar:

```javascript
// Em qualquer lugar do código
const db = Database.getInstance(); // Sempre retorna a mesma instância
const resultados = await db.query('SELECT * FROM produtos');
```

#### Benefício:

```javascript
// Primeira chamada: cria a instância
const db1 = Database.getInstance();

// Segunda chamada: retorna a mesma instância (não cria nova)
const db2 = Database.getInstance();

console.log(db1 === db2); // true ✓
```

---

### 2. **FACTORY METHOD** - Criação de Pagamentos

#### O que é Factory Method?

O padrão **Factory Method** define uma interface para criar objetos, mas deixa que as subclasses decidam qual classe instanciar. É usado para criar diferentes tipos de pagamentos a partir de um único ponto.

#### Por que usar?

- ✅ Centraliza a criação de diferentes tipos de pagamento
- ✅ Facilita adicionar novos tipos (novo pagamento = nova classe)
- ✅ Código mais limpo e organizado
- ✅ Menos acoplamento entre classes

#### Implementação

**Arquivo: `src/patterns/PagamentoFactory.js`**

```javascript
// Classe base abstrata
class Pagamento {
  constructor(valor) {
    this.valor = valor;
    this.status = 'pendente';
  }

  processar() {
    throw new Error('Deve ser implementado');
  }
}

// Subclasses concretas
class CartaoCredito extends Pagamento {
  constructor(valor, numeroCartao, cvv, validade) {
    super(valor);
    this.numeroCartao = numeroCartao;
  }

  processar() {
    this.status = 'aprovado';
    return { sucesso: true, tipo: 'cartão' };
  }
}

class PIX extends Pagamento {
  constructor(valor, chavePix) {
    super(valor);
    this.chavePix = chavePix;
  }

  processar() {
    this.status = 'pendente_confirmacao';
    return { sucesso: true, qr_code: 'dados' };
  }
}

class Boleto extends Pagamento {
  constructor(valor, cnpj) {
    super(valor);
    this.cnpj = cnpj;
  }

  processar() {
    this.status = 'emitido';
    return { sucesso: true, numero_boleto: '12345...' };
  }
}

// FACTORY - Cria a instância correta baseado no tipo
class PagamentoFactory {
  static criarPagamento(tipo, valor, dados) {
    switch (tipo.toLowerCase()) {
      case 'cartao_credito':
        return new CartaoCredito(valor, dados.numeroCartao, dados.cvv, dados.validade);
      case 'pix':
        return new PIX(valor, dados.chavePixRecebedor);
      case 'boleto':
        return new Boleto(valor, dados.cnpjBeneficiario);
      default:
        throw new Error(`Tipo inválido: ${tipo}`);
    }
  }
}

module.exports = { PagamentoFactory };
```

#### Como usar:

```javascript
// Antes (sem Factory) - código repetido:
if (tipo === 'cartao_credito') {
  pagamento = new CartaoCredito(valor, ...);
} else if (tipo === 'pix') {
  pagamento = new PIX(valor, ...);
} else if (tipo === 'boleto') {
  pagamento = new Boleto(valor, ...);
}

// Depois (com Factory) - centralizado:
const pagamento = PagamentoFactory.criarPagamento('pix', 100, {
  chavePixRecebedor: '123456789'
});

pagamento.processar(); // Funciona para qualquer tipo
```

#### Benefício:

- Adicionar um novo pagamento é fácil:

```javascript
class ApplePay extends Pagamento {
  processar() {
    this.status = 'aprovado';
    return { sucesso: true };
  }
}

// Apenas adicione um novo case na factory:
// case 'apple_pay':
//   return new ApplePay(...);
```

---

### 3. **BUILDER** - Construção de Pedidos

#### O que é Builder?

O padrão **Builder** separa a construção de um objeto complexo de sua representação, permitindo criar objetos passo a passo através de um interface fluida (encadeamento de métodos).

#### Por que usar?

- ✅ Cria objetos complexos de forma legível
- ✅ Permite construir pedidos passo a passo
- ✅ Valida os dados em cada etapa
- ✅ Código mais limpo e compreensível (fluent interface)

#### Implementação

**Arquivo: `src/patterns/PedidoBuilder.js`**

```javascript
class PedidoBuilderHelper {
  constructor() {
    this.itens = [];
    this.endereco = null;
    this.pagamento = null;
  }

  // Método 1: Adicionar items
  adicionarItem(produto_id, nome, preco, quantidade) {
    this.itens.push({
      produto_id,
      nome,
      preco,
      quantidade,
      subtotal: preco * quantidade
    });
    return this; // Retorna 'this' para encadeamento
  }

  // Método 2: Definir endereço
  definirEndereco(rua, numero, complemento, cidade, estado, cep) {
    this.endereco = {
      rua,
      numero,
      complemento,
      cidade,
      estado,
      cep
    };
    return this; // Encadeamento
  }

  // Método 3: Definir pagamento
  definirPagamento(tipo, valor, dados) {
    this.pagamento = {
      tipo,
      valor,
      dados
    };
    return this; // Encadeamento
  }

  // Método final: Construir e validar
  async finalizarPedido() {
    // Validações
    if (this.itens.length === 0) {
      throw new Error('Pedido vazio');
    }
    if (!this.endereco) {
      throw new Error('Endereço não definido');
    }
    if (!this.pagamento) {
      throw new Error('Pagamento não definido');
    }

    // Salvar no banco
    const pedido = await Pedido.create({...});
    return pedido;
  }
}

module.exports = { PedidoBuilderHelper };
```

#### Como usar (Fluent Interface):

```javascript
// Sem Builder - muitos parâmetros aninhados:
const pedido = new Pedido(
  [item1, item2],
  { rua: 'A', numero: '123', ... },
  { tipo: 'pix', ... }
);

// Com Builder - legível e ordenado:
const builder = new PedidoBuilderHelper();

const pedidoFinal = await builder
  .adicionarItem(1, 'Notebook', 3500, 1)
  .adicionarItem(2, 'Mouse', 100, 2)
  .definirEndereco('Rua A', '123', 'Apto 1', 'São Paulo', 'SP', '01234-567')
  .definirPagamento('pix', 3700, { chavePixRecebedor: '123456' })
  .finalizarPedido();
```

#### Benefício - Comparação:

```javascript
// ❌ SEM BUILDER - Difícil de ler e manter
const pedido = criarPedido(
  [
    { id: 1, nome: 'Notebook', preco: 3500, qtd: 1 },
    { id: 2, nome: 'Mouse', preco: 100, qtd: 2 }
  ],
  { rua: 'Rua A', numero: '123', complemento: 'Apto 1', cidade: 'São Paulo', estado: 'SP', cep: '01234-567' },
  { tipo: 'pix', chave: '123456', valor: 3700 },
  null,
  'cliente_123',
  true
);

// ✅ COM BUILDER - Claro e compreensível
const builder = new PedidoBuilderHelper();
const pedido = await builder
  .adicionarItem(1, 'Notebook', 3500, 1)
  .adicionarItem(2, 'Mouse', 100, 2)
  .definirEndereco('Rua A', '123', 'Apto 1', 'São Paulo', 'SP', '01234-567')
  .definirPagamento('pix', 3700, { chavePixRecebedor: '123456' })
  .finalizarPedido();
```

---

## 🗂️ Tabelas do Banco de Dados

### Produtos
```sql
CREATE TABLE produtos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  preco DECIMAL(10, 2) NOT NULL,
  estoque INT DEFAULT 0,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Pedidos
```sql
CREATE TABLE pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT,
  status ENUM('rascunho', 'confirmado', 'processando', 'enviado', 'entregue', 'cancelado'),
  valor_total DECIMAL(10, 2) NOT NULL,
  rua VARCHAR(255),
  numero VARCHAR(10),
  complemento VARCHAR(255),
  cidade VARCHAR(100),
  estado VARCHAR(2),
  cep VARCHAR(9),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Pagamentos
```sql
CREATE TABLE pagamentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL,
  tipo ENUM('cartao_credito', 'pix', 'boleto'),
  status ENUM('pendente', 'aprovado', 'recusado', 'cancelado'),
  valor DECIMAL(10, 2) NOT NULL,
  numero_cartao VARCHAR(4),
  chave_pix VARCHAR(255),
  numero_boleto VARCHAR(50),
  transacao_id VARCHAR(100),
  processado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
);
```

### Itens do Pedido
```sql
CREATE TABLE itens_pedido (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL,
  produto_id INT NOT NULL,
  quantidade INT DEFAULT 1,
  preco_unitario DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
  FOREIGN KEY (produto_id) REFERENCES produtos(id)
);
```

---

## 🚀 Como Usar

### 1. Instalação

```bash
npm install
```

### 2. Configurar `.env`

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=ecommerce
DB_PORT=3306
PORT=3000
```

### 3. Criar Banco no XAMPP

Execute no phpMyAdmin:

```sql
CREATE DATABASE ecommerce;
```

### 4. Iniciar Servidor

```bash
# Desenvolvimento (com auto-reload)
npm run dev

# Produção
npm start
```

---

## 📡 Endpoints da API

### Produtos
- `GET /api/produtos` - Listar todos
- `GET /api/produtos/:id` - Buscar um
- `POST /api/produtos` - Criar
- `PUT /api/produtos/:id` - Atualizar
- `DELETE /api/produtos/:id` - Deletar

### Pedidos
- `GET /api/pedidos` - Listar todos
- `GET /api/pedidos/:id` - Buscar um
- `POST /api/pedidos` - Criar com Builder
- `PUT /api/pedidos/:id/status` - Atualizar status
- `DELETE /api/pedidos/:id` - Cancelar

### Pagamentos
- `GET /api/pagamentos` - Listar todos
- `GET /api/pagamentos/:id` - Buscar um
- `POST /api/pagamentos/:pedidoId/processar` - Processar com Factory
- `GET /api/pagamentos/pedido/:pedidoId` - Buscar por pedido

---

## 📊 Exemplo Completo de Uso

### Criar um Pedido Completo

```bash
POST /api/pedidos
Content-Type: application/json

{
  "cliente_id": 1,
  "itens": [
    {
      "produto_id": 1,
      "nome": "Notebook",
      "preco": 3500,
      "quantidade": 1
    },
    {
      "produto_id": 2,
      "nome": "Mouse",
      "preco": 100,
      "quantidade": 2
    }
  ],
  "endereco": {
    "rua": "Rua das Flores",
    "numero": "123",
    "complemento": "Apto 456",
    "cidade": "São Paulo",
    "estado": "SP",
    "cep": "01234-567"
  },
  "pagamento": {
    "tipo": "pix",
    "dados": {
      "chavePixRecebedor": "12345678901234567890"
    }
  }
}
```

**Resposta (201 Created):**

```json
{
  "mensagem": "Pedido criado com sucesso",
  "dados": {
    "id": 1,
    "cliente_id": 1,
    "valor_total": 3700,
    "status": "confirmado",
    "itens": [...],
    "pagamento": {...}
  }
}
```

---

## 🎯 Resumo dos Padrões

| Padrão | Propósito | Classe | Arquivo |
|--------|-----------|--------|---------|
| **Singleton** | Uma única instância de BD | `Database` | `src/config/database.js` |
| **Factory Method** | Criar tipos de pagamento | `PagamentoFactory` | `src/patterns/PagamentoFactory.js` |
| **Builder** | Construir pedidos complexos | `PedidoBuilderHelper` | `src/patterns/PedidoBuilder.js` |

---

## 📚 Referências

- [Padrões de Design - Gang of Four](https://en.wikipedia.org/wiki/Design_Patterns)
- [Sequelize Documentation](https://sequelize.org/)
- [Express.js Guide](https://expressjs.com/)

---

**Desenvolvido para aula de Design Patterns - Arquiteto de Software**
