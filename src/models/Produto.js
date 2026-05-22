const { DataTypes } = require('sequelize');
const Database = require('../config/database');

const db = Database.getInstance();
const sequelize = db.obterSequelize();

const Produto = sequelize.define('Produto', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nome: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  preco: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  estoque: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  criado_em: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'produtos',
  timestamps: false
});

module.exports = Produto;