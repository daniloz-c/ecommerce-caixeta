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


#### Pergunta para justificar - Adapter:

Sem o **Adapter**, seria necessário alterar o código que processa pagamentos para conhecer diretamente a API do gateway legado. Ou seja, o controller, a factory ou até o fluxo de pedido teriam que tratar uma chamada diferente, como `cobrar(valorEmCentavos, referenciaExterna)`, além de converter manualmente o retorno legado para o formato esperado pelo sistema. Isso aumentaria o acoplamento e espalharia regras específicas do fornecedor externo pelo código.

Com o **Adapter**, o gateway legado fica isolado atrás de uma classe que implementa o contrato original `Pagamento`. O restante do sistema continua chamando apenas `processar()`, sem saber se o pagamento é cartão, PIX, boleto ou gateway legado. Assim, o princípio **Open/Closed** é preservado porque o sistema é estendido com uma nova classe (`GatewayAdapter`) sem precisar modificar a lógica principal dos pedidos para suportar a API incompatível do terceiro.


#### Pergunta para justificar - Facade

Sem a **Facade**, o controller precisaria conhecer e chamar diretamente todos os subsistemas do checkout, como estoque, pagamento, carrinho e e-mail. Se um desses subsistemas mudasse sua API, por exemplo `emailService.enviarConfirmacao()` passasse a exigir novos parâmetros ou `estoqueService.verificar()` mudasse o formato de retorno, o controller teria que ser alterado para acompanhar essa mudança. Isso deixaria o código cliente mais acoplado, mais difícil de testar e mais sensível a mudanças internas.

Com a **Facade**, o controller chama apenas `checkoutFacade.finalizar(pedido)`. As mudanças internas ficam concentradas dentro da fachada, que adapta a comunicação com os subsistemas sem expor esses detalhes para quem usa o fluxo de checkout. Assim, o código cliente fica protegido: mesmo que um serviço interno mude sua implementação ou assinatura, o controller pode continuar usando a mesma interface simples da fachada.

#### Pergunta para justificar - Strategy

Para adicionar uma nova transportadora, como DHL, basta criar uma nova classe `FreteDHL` que implemente o mesmo contrato `EstrategiaFrete`, com o método `calcular(peso)`. Depois, em tempo de execução, o carrinho recebe essa nova estratégia pelo construtor ou por `setFrete(new FreteDHL())`, sem nenhuma alteração na classe `Carrinho`.

O Strategy ajuda a respeitar principalmente o princípio **Open/Closed** do SOLID: o sistema fica aberto para extensão, porque novas formas de calcular frete podem ser adicionadas, mas fechado para modificação, porque o carrinho não precisa ser alterado a cada nova transportadora.

#### Pergunta para justificar - Observer

Para adicionar um novo observer, como SMS, basta criar uma classe `SmsObserver` com o método `atualizar(pedido)` e registrá-la no pedido junto com os demais observadores. A classe `Pedido` não precisa saber que existe SMS, e-mail, estoque ou auditoria; ela apenas percorre a lista de observers e chama `atualizar()` em cada um.

Sem o padrão **Observer**, a própria classe `Pedido` teria que chamar diretamente cada serviço, como `emailService.enviar()`, `estoqueService.baixar()`, `logService.registrar()` e depois `smsService.enviar()`. Cada nova notificação exigiria alteração no código de `Pedido`, aumentando acoplamento e risco de quebrar o fluxo principal. Com Observer, novas reações ao evento de confirmação entram por extensão, não por modificação da classe observada.

#### Pergunta para justificar - Command

Além do undo, o **Command** ajuda a padronizar ações do sistema como objetos independentes, permitindo histórico, auditoria, reexecução, logs, permissões, agendamento e composição de operações. Como cada ação tem `executar()` e `desfazer()`, o sistema consegue tratar comandos diferentes de forma uniforme, sem conhecer os detalhes internos de cada operação.

Para implementar uma fila de tarefas assíncronas, cada tarefa poderia ser representada por um comando, como `EnviarEmailComando`, `BaixarEstoqueComando` ou `CancelarPedidoComando`. O sistema colocaria esses comandos em uma fila, e um worker consumiria cada item chamando `executar()`. Em caso de falha, o comando poderia ser reenfileirado, auditado ou compensado com `desfazer()`, mantendo a lógica da tarefa encapsulada no próprio objeto de comando.


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

### 4. **ADAPTER** - Integração com Gateway Legado

#### O que é Adapter?

O padrão **Adapter** permite que uma classe com interface incompatível seja usada por um sistema que já espera outro contrato. Neste projeto, o sistema já trabalha com o contrato `Pagamento`, que possui o método `processar()`, mas o gateway legado expõe uma chamada diferente.

#### Implementação

**Arquivo: `src/patterns/PagamentoFactory.js`**

```javascript
class GatewayLegado {
  cobrar(valorEmCentavos, referenciaExterna) {
    return {
      aprovado: true,
      codigoTransacao: 'LEG-123',
      descricao: 'Pagamento legado aprovado'
    };
  }
}

class GatewayAdapter extends Pagamento {
  processar() {
    const respostaLegada = this.gatewayLegado.cobrar(...);

    return {
      sucesso: respostaLegada.aprovado,
      mensagem: respostaLegada.descricao,
      transacao_id: respostaLegada.codigoTransacao
    };
  }
}
```


---

### 5. **STRATEGY** - Estratégias de Cálculo de Frete

#### O que é Strategy?

O padrão **Strategy** permite trocar um algoritmo em tempo de execução sem alterar a classe que usa esse algoritmo. Neste projeto, o `Carrinho` não sabe os detalhes de cálculo dos Correios, Jadlog ou retirada; ele apenas chama o contrato `EstrategiaFrete.calcular(peso)`.

#### Implementação

**Arquivo: `src/patterns/FreteStrategy.js`**

```javascript
class EstrategiaFrete {
  calcular(peso) {
    throw new Error('Metodo calcular(peso) deve ser implementado');
  }
}

class FreteCorreios extends EstrategiaFrete {
  calcular(peso) {
    return 12 + peso * 4.5;
  }
}

class FreteJadlog extends EstrategiaFrete {
  calcular(peso) {
    return 18 + peso * 3.2;
  }
}

class FreteRetirada extends EstrategiaFrete {
  calcular() {
    return 0;
  }
}
```

#### Demonstração da troca em tempo de execução

```javascript
const carrinho = new Carrinho(new FreteCorreios())
  .adicionarItem('Notebook', 2.4)
  .adicionarItem('Mouse', 0.3);

const freteCorreios = carrinho.calcularFrete();

carrinho.setFrete(new FreteJadlog());
const freteJadlog = carrinho.calcularFrete();

carrinho.setFrete(new FreteRetirada());
const freteRetirada = carrinho.calcularFrete();
```

Nesse exemplo, o mesmo `Carrinho` troca a estratégia de frete sem alterar sua própria implementação. Para adicionar uma nova transportadora, basta criar outra classe que implemente `calcular(peso)`.

---

### 6. **OBSERVER** - Notificações ao Confirmar Pedido

#### O que é Observer?

O padrão **Observer** permite que objetos interessados sejam avisados automaticamente quando outro objeto muda de estado. Neste projeto, um `Pedido` mantém uma lista de observadores e chama `notificar()` quando seu status é alterado.

#### Implementação

**Arquivo: `src/patterns/PedidoObserver.js`**

```javascript
class Observer {
  atualizar(pedido) {
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
    this.observers.push(observer);
    return this;
  }

  notificar() {
    this.observers.forEach(observer => observer.atualizar(this));
  }

  alterarStatus(status) {
    this.status = status;
    this.notificar();
  }
}
```

#### Demonstração de registro e disparo

```javascript
const pedido = new Pedido(1);

pedido
  .adicionarObserver(new EmailObserver())
  .adicionarObserver(new EstoqueObserver())
  .adicionarObserver(new LogObserver());

pedido.alterarStatus('confirmado');
```

Ao confirmar o pedido, os três observadores são disparados automaticamente: o cliente é notificado por e-mail, o estoque recebe a solicitação de baixa e o logger registra a auditoria. Para adicionar um novo observador, basta criar uma classe com `atualizar(pedido)` e registrá-la no pedido, sem alterar a classe `Pedido`.

---

### 7. **COMMAND** - Cancelamento Desfeito de Pedido

#### O que é Command?

O padrão **Command** transforma uma ação em um objeto. Assim, operações como cancelar pedido ou atualizar endereço podem ser executadas, armazenadas em histórico, auditadas e desfeitas depois.

#### Implementação

**Arquivo: `src/patterns/PedidoCommand.js`**

```javascript
class Comando {
  executar() {
    throw new Error('Metodo executar() deve ser implementado');
  }

  desfazer() {
    throw new Error('Metodo desfazer() deve ser implementado');
  }
}

class CancelarPedidoComando extends Comando {
  executar() {
    this.statusAnterior = this.pedido.status;
    this.pedido.status = 'cancelado';
  }

  desfazer() {
    this.pedido.status = this.statusAnterior;
  }
}
```

#### Demonstração de execução e undo

```javascript
const pedido = new PedidoAdministrativo(1, 'confirmado');
const gerenciador = new GerenciadorComandos();

gerenciador.executar(new CancelarPedidoComando(pedido));
console.log(pedido.status); // cancelado

gerenciador.desfazerUltimo();
console.log(pedido.status); // confirmado
```

O `GerenciadorComandos` mantém um histórico das ações executadas e permite desfazer a última ação. Ele também registra auditoria de execução e undo. Como bônus, foi implementado `AtualizarEnderecoComando`, que altera o endereço do pedido e também consegue restaurar o endereço anterior.

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
| **Adapter** | Integrar gateway legado sem alterar o contrato original | `GatewayAdapter` | `src/patterns/PagamentoFactory.js` |
| **Strategy** | Trocar cálculo de frete em tempo de execução | `Carrinho`, `FreteCorreios`, `FreteJadlog`, `FreteRetirada` | `src/patterns/FreteStrategy.js` |
| **Observer** | Notificar interessados quando o pedido muda de status | `Pedido`, `EmailObserver`, `EstoqueObserver`, `LogObserver` | `src/patterns/PedidoObserver.js` |
| **Command** | Executar, auditar e desfazer ações administrativas | `CancelarPedidoComando`, `AtualizarEnderecoComando`, `GerenciadorComandos` | `src/patterns/PedidoCommand.js` |

---

## 📚 Referências

- [Padrões de Design - Gang of Four](https://en.wikipedia.org/wiki/Design_Patterns)
- [Sequelize Documentation](https://sequelize.org/)
- [Express.js Guide](https://expressjs.com/)

---

**Desenvolvido para aula de Design Patterns - Arquiteto de Software**
