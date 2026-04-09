import { sequelize } from '../config/database.js';

import Cliente from './Cliente.js';
import Venda from './Venda.js';
import Parcela from './Parcela.js';
import Pagamento from './Pagamento.js';

Cliente.hasMany(Venda, {
  foreignKey: 'cliente_id',
  as: 'vendas'
});
Venda.belongsTo(Cliente, {
  foreignKey: 'cliente_id',
  as: 'cliente'
});

Venda.hasMany(Parcela, {
  foreignKey: 'venda_id', 
  as: 'parcelas'
});
Parcela.belongsTo(Venda, {
  foreignKey: 'venda_id',
  as: 'venda'
});

Parcela.hasMany(Pagamento, {
  foreignKey: 'parcela_id',
  as: 'pagamentos'
});
Pagamento.belongsTo(Parcela, {
  foreignKey: 'parcela_id', 
  as: 'parcela'
});

Cliente.hasMany(Pagamento, {
  foreignKey: 'cliente_id',
  as: 'pagamentos'
});
Pagamento.belongsTo(Cliente, {
  foreignKey: 'cliente_id',
  as: 'cliente'
});

export async function sincronizarBanco(force = false) {
  try {
    console.log('🔄 Sincronizando banco de dados...');
    
    await sequelize.sync({ force });
    
    console.log('✅ Banco sincronizado com sucesso!');
    if (force) {
      console.log('⚠️  ATENÇÃO: Todas as tabelas foram RECRIADAS (dados perdidos!)');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Erro ao sincronizar banco:', error);
    return false;
  }
}

export {
  sequelize,
  Cliente,
  Venda, 
  Parcela,
  Pagamento
};

export const models = {
  Cliente,
  Venda,
  Parcela, 
  Pagamento
};

export const associations = {
  Cliente_Venda: '1:N',
  Venda_Parcela: '1:N', 
  Parcela_Pagamento: '1:N',
  Cliente_Pagamento: '1:N'
};