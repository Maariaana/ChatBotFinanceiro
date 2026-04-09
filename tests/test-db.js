const { Cliente } = require('../src/models');

async function testDatabase() {
  try {
    // Testar criação
    const cliente = await Cliente.create({
      nome: 'Teste Silva',
      telefone: '11988887777',
      cpf: '111.222.333-44',
      data_cadastro: new Date()
    });
    
    console.log('✅ Cliente criado:', cliente.toJSON());
    
    // Testar leitura
    const clientes = await Cliente.findAll();
    console.log('📋 Todos os clientes:', clientes.map(c => c.nome));
    
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

testDatabase();