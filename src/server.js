const express = require('express');
const Database = require('./config/database');
const routes = require('./routes');

const app = express();
app.use(express.json());

// Documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs)); 

// Inicializar banco de dados
const db = Database.getInstance();

// Conectar e sincronizar
(async () => {
  try {
    await db.conectar();
    await db.sincronizar();

    // Registrar rotas
    app.use('/api', routes);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
      console.log(`📝 Documentação: http://localhost:${PORT}/api/health`);
    });
  } catch (erro) {
    console.error('Erro ao iniciar aplicação:', erro);
    process.exit(1);
  }
})();