import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Cliente = sequelize.define('Cliente', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  telefone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  cpf: {
    type: DataTypes.STRING(14),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true
  },

  id_kyte: {
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: true
  },
 
  ultima_sincronizacao: {
    type: DataTypes.DATE,
    allowNull: true
  },
  data_cadastro: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'clientes',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['id_kyte']
    },
    {
      fields: ['nome']
    }
  ]
});

export default Cliente;