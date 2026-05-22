const { DataTypes } = require('sequelize');
const Database = require('../config/database');
const Pagamento = require('./Pagamento');

const db = Database.getInstance();
const sequelize = db.obterSequelize();

const Pedido = sequelize.define('Pedido', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  cliente_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('rascunho', 'confirmado', 'processando', 'enviado', 'entregue', 'cancelado'),
    defaultValue: 'rascunho'
  },
  valor_total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  rua: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  numero: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  complemento: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  cidade: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  estado: {
    type: DataTypes.STRING(2),
    allowNull: false
  },
  cep: {
    type: DataTypes.STRING(9),
    allowNull: false
  },
  criado_em: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'pedidos',
  timestamps: false
});

// Relacionamento: Um Pedido tem um Pagamento
Pedido.hasOne(Pagamento, {
  foreignKey: 'pedido_id',
  as: 'pagamento'
});

Pagamento.belongsTo(Pedido, {
  foreignKey: 'pedido_id'
});

module.exports = Pedido;