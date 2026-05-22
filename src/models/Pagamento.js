const { DataTypes } = require('sequelize');
const Database = require('../config/database');

const db = Database.getInstance();
const sequelize = db.obterSequelize();

const Pagamento = sequelize.define('Pagamento', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  pedido_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  tipo: {
    type: DataTypes.ENUM('cartao_credito', 'pix', 'boleto'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pendente', 'aprovado', 'recusado', 'cancelado'),
    defaultValue: 'pendente'
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  numero_cartao: {
    type: DataTypes.STRING(4), // Apenas últimos 4 dígitos
    allowNull: true
  },
  chave_pix: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  numero_boleto: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  data_vencimento: {
    type: DataTypes.DATE,
    allowNull: true
  },
  transacao_id: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  processado_em: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'pagamentos',
  timestamps: false
});

module.exports = Pagamento;