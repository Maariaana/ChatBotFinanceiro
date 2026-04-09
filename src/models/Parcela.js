const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Parcela = sequelize.define('Parcela', {
    parcela_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
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
    data_vencimento_original: {
      type: DataTypes.DATE,
      allowNull: false
    },
    data_vencimento_atual: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pendente', 'paga', 'parcial', 'renegociada'),
      defaultValue: 'pendente'
    }
  }, {
    tableName: 'PARCELA',
    timestamps: false
  });

  return Parcela;
};