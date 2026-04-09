import sendMessage from "../services/messageSender.js";
import { PagamentoService } from "../../../BANCO/src/services/pagamentoService.js";

export class PagamentoController {
    constructor() {
        this.pagamentoService = new PagamentoService();
    }

    async processarPagamento(socket, text, from) {
        try {
            console.log('💰 Processando Pagamento...');

            const { nomeCliente, valor, descricao } = this.extrairDadosPagamento(text);

            if (!nomeCliente || !valor) {
                await this.enviarInstrucoesPagamento(socket, from);
                return;
            }

            console.log('📋 Pagamento detectado:', { nomeCliente, valor, descricao });

            const resultado = await this.pagamentoService.registrarPagamento(
                nomeCliente, valor, descricao
            );

            await this.enviarRespostaPagamento(socket, from, resultado);

        } catch (error) {
            console.error('❌ Erro ao processar pagamento:', error);
            await this.enviarErroPagamento(socket, from, error);
        }
    }

    async consultarDivida(socket, text, from) {
        try {
            console.log('📊 Consultando Dívida...');

            const nomeCliente = this.extrairNomeCliente(text);
            
            if (!nomeCliente) {
                await sendMessage(socket, from,
                    '❌ Digite o nome do cliente. Exemplo:\n' +
                    '"Quanto João deve?"\n' +
                    '"Dívida da Maria"'
                );
                return;
            }

            const divida = await this.pagamentoService.consultarDivida(nomeCliente);

            await this.enviarRespostaDivida(socket, from, divida);

        } catch (error) {
            console.error('❌ Erro ao consultar dívida:', error);
            await sendMessage(socket, from, 
                '❌ Erro ao consultar dívida. Verifique o nome do cliente.'
            );
        }
    }

    extrairDadosPagamento(text) {
        // Exemplo: "João pagou 150" ou "Maria pagou 200, entrada"
        
        const nomeMatch = text.match(/(.+?)\s+(pagou|pagamento|pago)/i);
        const nomeCliente = nomeMatch ? nomeMatch[1].trim() : null;

        const valorMatch = text.match(/(\d+(?:[.,]\d+)?)/);
        const valor = valorMatch ? parseFloat(valorMatch[1].replace(',', '.')) : null;

        // Descrição (opcional) - tudo depois da vírgula
        const descricaoMatch = text.match(/,\s*(.+)$/i);
        const descricao = descricaoMatch ? descricaoMatch[1].trim() : '';

        return { nomeCliente, valor, descricao };
    }

    extrairNomeCliente(text) {
        // Remove palavras chave e pega o resto como nome
        const textoLimpo = text
            .replace(/(quanto|deve|dívida|divida|consulta|saldo)/gi, '')
            .trim();
        
        return textoLimpo || null;
    }

    async enviarInstrucoesPagamento(socket, from) {
        await sendMessage(socket, from,
            '❌ Formato incorreto. Use:\n' +
            '"Nome pagou valor"\n\n' +
            '💡 Exemplos:\n' +
            '"João pagou 150"\n' +
            '"Maria pagou 200, entrada"\n' +
            '"Carlos pagou 350, pagamento parcial"'
        );
    }

    async enviarRespostaPagamento(socket, from, resultado) {
        const { cliente, pagamentos, troco } = resultado;

        let resposta = `✅ *Pagamento registrado!*\n\n`;
        resposta += `👤 *Cliente:* ${cliente.nome}\n`;
        resposta += `💰 *Valor pago:* R$ ${resultado.pagamentos.reduce((sum, p) => sum + parseFloat(p.valor_pago), 0).toFixed(2)}\n`;
        resposta += `📋 *Parcelas quitadas:* ${pagamentos.length}\n`;

        if (troco > 0) {
            resposta += `🔄 *Troco:* R$ ${troco.toFixed(2)}\n`;
        }

        resposta += `\n💳 *Status:* Pagamento aplicado nas parcelas mais antigas`;

        await sendMessage(socket, from, resposta);
    }

    async enviarRespostaDivida(socket, from, divida) {
        const { cliente, parcelas, totalDevido, quantidadeParcelas } = divida;

        if (parcelas.length === 0) {
            await sendMessage(socket, from,
                `✅ *${cliente.nome} não possui dívidas!* 🎉\n` +
                `Todas as parcelas estão em dia.`
            );
            return;
        }

        let resposta = `📊 *Dívida de ${cliente.nome}*\n\n`;
        resposta += `💰 *Total devido:* R$ ${totalDevido.toFixed(2)}\n`;
        resposta += `📋 *Parcelas em aberto:* ${quantidadeParcelas}\n\n`;
        resposta += `📅 *Próximas parcelas:*\n`;

        // Mostra as 3 primeiras parcelas
        parcelas.slice(0, 3).forEach(parcela => {
            const vencimento = new Date(parcela.data_vencimento).toLocaleDateString('pt-BR');
            resposta += `• ${parcela.numero_parcela}ª - R$ ${parseFloat(parcela.valor_atual).toFixed(2)} (venc: ${vencimento})\n`;
        });

        if (quantidadeParcelas > 3) {
            resposta += `... e mais ${quantidadeParcelas - 3} parcelas`;
        }

        await sendMessage(socket, from, resposta);
    }

    async enviarErroPagamento(socket, from, error) {
        if (error.message.includes('não possui parcelas em aberto')) {
            await sendMessage(socket, from,
                '✅ *Cliente sem dívidas!*\n\n' +
                'Este cliente não possui parcelas em aberto no momento. 🎉'
            );
        } else {
            await sendMessage(socket, from,
                '❌ Erro ao registrar pagamento.\n' +
                'Verifique o formato e tente novamente.'
            );
        }
    }
}

export default PagamentoController;