import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ BANCO DE TESTE - separado do oficial
export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', '..', 'database', 'loja_teste.db'),
  logging: console.log,  // Mostra SQL no console para debug
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// ✅ Função para testar conexão
export async function testarConexao() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com banco de teste estabelecida!');
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com banco:', error);
    return false;
  }
}