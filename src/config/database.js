const { Sequelize } = require('sequelize');
require('dotenv').config();

class Database {
    static instance = null;

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    constructor() {
        this.sequelize = new Sequelize(
            process.env.DB_NAME,
            process.env.DB_USER,
            process.env.DB_PASSWORD,
            {
                host: process.env.DB_HOST,
                port: process.env.DB_PORT,
                dialect: 'mysql',
                logging: false, // Mude para console.log para ver as queries
                pool: {
                    max: 10,
                    min: 0,
                    acquire: 30000,
                    idle: 10000
                }
            }
        );
    }

    async conectar() {
        try {
            await this.sequelize.authenticate();
            console.log('Conexão com banco de dados estabelecida');
        } catch (erro) {
            console.error('Erro ao conectar ao banco:', erro);
            throw erro;
        }
    }

    async sincronizar() {
        try {
            await this.sequelize.sync({ alter: false });
            console.log('Modelos sincronizados com o banco');
        } catch (erro) {
            console.error('Erro ao sincronizar:', erro);
            throw erro;
        }
    }

    obterSequelize() {
        return this.sequelize;
    }
}

module.exports = Database;