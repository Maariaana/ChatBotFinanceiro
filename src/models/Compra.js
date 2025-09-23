const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Compra = sequelize.define('Compra', {
    compra_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    valor_total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    data_compra: {
      type: DataTypes.DATE,
      allowNull: false
    },
    produto_descricao: {
      type: DataTypes.TEXT
    },
    tipo_pagamento: {
      type: DataTypes.ENUM('à vista', 'parcelado'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('ativa', 'finalizada', 'cancelada'),
      defaultValue: 'ativa'
    }
  }, {
    tableName: 'COMPRA',
    timestamps: false
  });

  return Compra;
};