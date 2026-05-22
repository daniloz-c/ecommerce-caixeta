const { DataTypes } = require('sequelize');
const Database = require('../config/database');
const Pedido = require('./Pedido');
const Produto = require('./Produto');

const db = Database.getInstance();
const sequelize = db.obterSequelize();

const ItemPedido = sequelize.define('ItemPedido', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  pedido_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  produto_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  preco_unitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'itens_pedido',
  timestamps: false
});

// Relacionamentos
ItemPedido.belongsTo(Pedido, { foreignKey: 'pedido_id', as: 'pedido' });
ItemPedido.belongsTo(Produto, { foreignKey: 'produto_id', as: 'produto' });

Pedido.hasMany(ItemPedido, { foreignKey: 'pedido_id', as: 'itens' });
Produto.hasMany(ItemPedido, { foreignKey: 'produto_id', as: 'itens_pedido' });

module.exports = ItemPedido;