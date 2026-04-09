import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Parcela = sequelize.define('Parcela', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  venda_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'vendas',
      key: 'id'
    }
  },
  numero_parcela: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  valor_original: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  valor_atual: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  data_vencimento: {
    type: DataTypes.DATE,
    allowNull: false
  },
  data_pagamento: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pendente', 'paga', 'parcial', 'atrasada'),
    defaultValue: 'pendente'
  }
}, {
  tableName: 'parcelas',
  timestamps: false
});

export default Parcela;