const express = require('express');
const sequelize = require('..src/config/database');
const app = express();

// Conectar ao banco
async function initDatabase() {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // Cria as tabelas automaticamente
    console.log('✅ Banco de dados conectado e sincronizado!');
  } catch (error) {
    console.error('❌ Erro no banco de dados:', error);
  }
}

initDatabase();

// Resto do seu código...