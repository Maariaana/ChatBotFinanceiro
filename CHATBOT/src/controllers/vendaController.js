import sendMessage from "../services/messageSender.js";
import { VendaService } from "../../../BANCO/src/services/vendaService.js";

export class VendaController {
    constructor() {
        this.vendaService = new VendaService();
    }

    async processarVenda(socket, text, from) {
        try {
            console.log('🛒 Processando Venda...');

            const { nomeCliente, valor, parcelas, diaVencimento } = this.extrairDadosVenda(text);

            if (!nomeCliente || !valor) {
                await sendMessage(socket, from,
                    '❌ Formato incorreto. Use:\n' +
                    '"Nome comprou valor, X parcelas, vencimento dia"\n\n' +
                    '💡 Exemplo:\n' +
                    '"Maria comprou 400, 3 parcelas, vencimento 10"'
                );
                return;
            }

            console.log('📋 Venda detectada:', { nomeCliente, valor, parcelas, diaVencimento });

            const { venda, cliente } = await this.vendaService.criarVenda(
                nomeCliente, valor, parcelas
            );

            let resposta = `✅ *Venda registrada!*\n\n`;
            resposta += `👤 *Cliente:* ${nomeCliente}\n`;
            resposta += `💰 *Valor:* R$ ${valor.toFixed(2)}\n`;

            if (parcelas > 1) {
                const valorParcela = (valor / parcelas).toFixed(2);
                resposta += `📅 *Parcelas:* ${parcelas}x de R$ ${valorParcela}\n`;
                resposta += `📋 *Vencimento:* dia ${diaVencimento}`;
            } else {
                resposta += `💳 *Pagamento:* À vista`;
            }

            await sendMessage(socket, from, resposta);

        } catch (error) {
            console.error('❌ Erro ao processar Venda:', error);
            await sendMessage(socket, from, '❌ Erro ao registrar Venda. Verifique o formato.');
        }
    }

    extrairDadosVenda(text) {

        const nomeMatch = text.match(/(.+?)\s+(comprou|venda|compra)/i);
        const nomeCliente = nomeMatch ? nomeMatch[1].trim() : null;

        const valorMatch = text.match(/(\d+(?:[.,]\d+)?)/);
        const valor = valorMatch ? parseFloat(valorMatch[1].replace(',', '.')) : null;

        const parcelasMatch = text.match(/(\d+)\s*(x|parcela)/i);
        const parcelas = parcelasMatch ? parseInt(parcelasMatch[1]) : 1;

        const vencimentoMatch = text.match(/vencimento\s*(\d+)/i);
        const diaVencimento = vencimentoMatch ? parseInt(vencimentoMatch[1]) : 10;

        return { nomeCliente, valor, parcelas, diaVencimento };
    }
}

export default VendaController;