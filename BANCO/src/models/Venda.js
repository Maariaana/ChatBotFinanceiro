import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Venda = sequelize.define('Venda', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cliente_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'clientes',
      key: 'id'
    }
  },
  valor_total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  data_venda: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  tipo_pagamento: {
    type: DataTypes.ENUM('à vista', 'parcelado'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('ativa', 'finalizada', 'cancelada'),
    defaultValue: 'ativa'
  },
  observacoes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'vendas',
  timestamps: false
});

export default Venda;