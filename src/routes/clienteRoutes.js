const { Cliente } = require('../models');

class ClienteController {
  // Criar novo cliente
  async criarCliente(req, res) {
    try {
      const { nome, telefone, cpf } = req.body;
      
      const cliente = await Cliente.create({
        nome,
        telefone,
        cpf,
        data_cadastro: new Date()
      });
      
      res.status(201).json(cliente);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Buscar todos os clientes
  async listarClientes(req, res) {
    try {
      const clientes = await Cliente.findAll();
      res.json(clientes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Buscar cliente por ID
  async buscarCliente(req, res) {
    try {
      const cliente = await Cliente.findByPk(req.params.id);
      if (!cliente) {
        return res.status(404).json({ error: 'Cliente não encontrado' });
      }
      res.json(cliente);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ClienteController();