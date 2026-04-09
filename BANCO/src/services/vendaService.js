import Venda from '../../src/models/Venda.js';
import Parcela from '../../src/models/Parcela.js';
import { ClienteService } from './clienteService.js';

export class VendaService {
  constructor() {
    this.clienteService = new ClienteService();
  }

  async criarVenda(nomeCliente, valorTotal, parcelas = 1) {
    try {
      const cliente = await this.clienteService.buscarOuCriarPeloNome(nomeCliente);

      const venda = await Venda.create({
        cliente_id: cliente.id,
        valor_total: valorTotal,
        tipo_pagamento: parcelas > 1 ? 'parcelado' : 'à vista',
        status: 'ativa'
      });

      if (parcelas > 1) {
        await this.criarParcelas(venda.id, valorTotal, parcelas);
      }

      console.log('💰 Venda registrada:', { 
        venda_id: venda.id, 
        cliente: cliente.nome, 
        valor: valorTotal 
      });

      return { venda, cliente };

    } catch (error) {
      console.error('❌ Erro ao criar venda:', error);
      throw error;
    }
  }

  async criarParcelas(vendaId, valorTotal, numeroParcelas) {
    const valorParcela = valorTotal / numeroParcelas;
    const hoje = new Date();
    
    const parcelas = [];

    for (let i = 1; i <= numeroParcelas; i++) {
      const dataVencimento = new Date(hoje);
      dataVencimento.setMonth(hoje.getMonth() + i);

      const parcela = await Parcela.create({
        venda_id: vendaId,
        numero_parcela: i,
        valor_original: valorParcela,
        valor_atual: valorParcela,
        data_vencimento: dataVencimento,
        status: 'pendente'
      });

      parcelas.push(parcela);
    }

    console.log(`📅 ${numeroParcelas} parcelas criadas para venda ${vendaId}`);
    return parcelas;
  }

  async buscarVendasPorCliente(nomeCliente) {
    const cliente = await this.clienteService.buscarOuCriarPeloNome(nomeCliente);
    
    const vendas = await Venda.findAll({
      where: { cliente_id: cliente.id },
      include: ['parcelas']
    });

    return vendas;
  }
}