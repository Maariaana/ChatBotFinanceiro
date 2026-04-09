const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Pagamento = sequelize.define('Pagamento', {
    pagamento_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    valor_pago: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    data_pagamento: {
      type: DataTypes.DATE,
      allowNull: false
    },
    metodo_pagamento: {
      type: DataTypes.STRING(50)
    },
    descricao: {
      type: DataTypes.TEXT
    }
  }, {
    tableName: 'PAGAMENTO',
    timestamps: false
  });

  return Pagamento;
};