const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Renegociacao = sequelize.define('Renegociacao', {
    renegociacao_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    data_renegociacao: {
      type: DataTypes.DATE,
      allowNull: false
    },
    valor_anterior: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    valor_novo: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    vencimento_anterior: {
      type: DataTypes.DATE,
      allowNull: false
    },
    vencimento_novo: {
      type: DataTypes.DATE,
      allowNull: false
    },
    motivo: {
      type: DataTypes.TEXT
    },
    usuario: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    tableName: 'RENEGOCIACAO',
    timestamps: false
  });

  return Renegociacao;
};