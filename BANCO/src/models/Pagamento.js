import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Pagamento = sequelize.define('Pagamento', {
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
  parcela_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'parcelas', 
      key: 'id'
    }
  },
  valor_pago: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  data_pagamento: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  metodo_pagamento: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  tipo: {
    type: DataTypes.ENUM('parcela', 'avulso'),
    defaultValue: 'parcela'
  }
}, {
  tableName: 'pagamentos',
  timestamps: false
});

export default Pagamento;