const { Sequelize } = require('sequelize');
const config = require('../config/config.json').development;

const sequelize = new Sequelize(config);

const Cliente = require('./Cliente')(sequelize);
const Compra = require('./Compra')(sequelize);
const Parcela = require('./Parcela')(sequelize);
const Pagamento = require('./Pagamento')(sequelize);
const Renegociacao = require('./Renegociacao')(sequelize);

// Associações
Cliente.hasMany(Compra, { foreignKey: 'cliente_id' });
Compra.belongsTo(Cliente, { foreignKey: 'cliente_id' });

Compra.hasMany(Parcela, { foreignKey: 'compra_id' });
Parcela.belongsTo(Compra, { foreignKey: 'compra_id' });

Cliente.hasMany(Pagamento, { foreignKey: 'cliente_id' });
Pagamento.belongsTo(Cliente, { foreignKey: 'cliente_id' });

Parcela.hasOne(Renegociacao, { foreignKey: 'renegociacao_id' });
Renegociacao.belongsTo(Parcela, { foreignKey: 'renegociacao_id' });

module.exports = {
  sequelize,
  Cliente,
  Compra,
  Parcela,
  Pagamento,
  Renegociacao
};