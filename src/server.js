require('dotenv').config({ quiet: true });

const express = require('express');
const Database = require('./config/database');
const routes = require('./routes');
const swaggerUi = require('swagger-ui-express');
const { specs } = require('./config/swagger');

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs)); 

// Inicializar banco de dados
const db = Database.getInstance();

// Conectar, sincronizar e iniciar o servidor HTTP
async function iniciarServidor() {
  try {
    await db.conectar();
    await db.sincronizar();

    // Registrar rotas
    app.use('/api', routes);

    const server = app.listen(PORT);

    server.on('listening', () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
      console.log(`📝 Documentação: http://localhost:${PORT}/api-docs`);
    });

    server.on('error', (erro) => {
      if (erro.code === 'EADDRINUSE') {
        console.error(`Erro ao iniciar servidor: a porta HTTP ${PORT} já está em uso.`);
      } else {
        console.error('Erro no servidor HTTP:', erro);
      }
      process.exitCode = 1;
    });
  } catch (erro) {
    console.error('Erro ao iniciar aplicação:', erro);
    process.exitCode = 1;
  }
}

iniciarServidor();
