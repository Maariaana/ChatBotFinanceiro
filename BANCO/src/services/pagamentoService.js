import { Pagamento, Parcela, Venda } from '../models/index.js'; // ✅ Import do index
import { ClienteService } from './clienteService.js';

export class PagamentoService {
    constructor() {
        this.clienteService = new ClienteService();
    }

    async registrarPagamento(nomeCliente, valorPago, descricao = '') {
        try {
            console.log(`💰 Registrando pagamento: ${nomeCliente} - R$ ${valorPago}`);

            // Busca o cliente
            const cliente = await this.clienteService.buscarOuCriarPeloNome(nomeCliente);

            // Busca parcelas em aberto do cliente
            const parcelasEmAberto = await this.buscarParcelasEmAberto(cliente.id);

            if (parcelasEmAberto.length === 0) {
                throw new Error('Cliente não possui parcelas em aberto');
            }

            let valorRestante = parseFloat(valorPago);
            const pagamentosRegistrados = [];
            const parcelasAtualizadas = [];

            // Aplica o pagamento nas parcelas (ordem de vencimento)
            for (const parcela of parcelasEmAberto) {
                if (valorRestante <= 0) break;

                const valorDevido = parseFloat(parcela.valor_atual);

                if (valorRestante >= valorDevido) {
                    // Paga a parcela completa
                    await this.quitarParcela(parcela.id, valorDevido);

                    const pagamento = await Pagamento.create({
                        cliente_id: cliente.id,
                        parcela_id: parcela.id,
                        valor_pago: valorDevido,
                        descricao: descricao || `Pagamento parcela ${parcela.numero_parcela}`,
                        tipo: 'parcela'
                    });

                    pagamentosRegistrados.push(pagamento);
                    parcelasAtualizadas.push(parcela);
                    valorRestante -= valorDevido;

                } else {
                    // Pagamento parcial da parcela
                    await this.atualizarParcelaParcialmente(parcela.id, valorRestante);

                    const pagamento = await Pagamento.create({
                        cliente_id: cliente.id,
                        parcela_id: parcela.id,
                        valor_pago: valorRestante,
                        descricao: descricao || `Pagamento parcial parcela ${parcela.numero_parcela}`,
                        tipo: 'parcela'
                    });

                    pagamentosRegistrados.push(pagamento);
                    parcelasAtualizadas.push(parcela);
                    valorRestante = 0;
                }
            }

            console.log(`✅ Pagamento registrado: ${pagamentosRegistrados.length} parcelas atualizadas`);

            return {
                cliente,
                pagamentos: pagamentosRegistrados,
                parcelas: parcelasAtualizadas,
                troco: valorRestante > 0 ? valorRestante : 0
            };

        } catch (error) {
            console.error('❌ Erro ao registrar pagamento:', error);
            throw error;
        }
    }

    async buscarParcelasEmAberto(clienteId) {
        const parcelas = await Parcela.findAll({
            include: [{
                model: Venda, // ✅ Use 'model' em vez de 'association'
                as: 'venda',
                where: { cliente_id: clienteId }
            }],
            where: {
                status: 'pendente'
            },
            order: [
                ['data_vencimento', 'ASC']
            ]
        });

        return parcelas;
    }

    async quitarParcela(parcelaId, valorPago) {
        await Parcela.update({
            status: 'paga',
            valor_atual: 0,
            data_pagamento: new Date()
        }, {
            where: { id: parcelaId }
        });
    }

    async atualizarParcelaParcialmente(parcelaId, valorPago) {
        const parcela = await Parcela.findByPk(parcelaId);
        const novoValor = parseFloat(parcela.valor_atual) - parseFloat(valorPago);

        await Parcela.update({
            valor_atual: novoValor,
            // Mantém status como 'pendente' pois não foi quitada totalmente
        }, {
            where: { id: parcelaId }
        });
    }

    async consultarDivida(nomeCliente) {
        try {
            const cliente = await this.clienteService.buscarOuCriarPeloNome(nomeCliente);
            const parcelasEmAberto = await this.buscarParcelasEmAberto(cliente.id);

            const totalDevido = parcelasEmAberto.reduce((total, parcela) => {
                return total + parseFloat(parcela.valor_atual);
            }, 0);

            return {
                cliente,
                parcelas: parcelasEmAberto,
                totalDevido,
                quantidadeParcelas: parcelasEmAberto.length
            };

        } catch (error) {
            console.error('❌ Erro ao consultar dívida:', error);
            throw error;
        }
    }
}