import sendMessage from "../services/messageSender.js";
import { VendaService } from "../../../BANCO/src/services/vendaService.js";

//NÃO É COMPRA! É VENDA!!!!! MUDA ISSO!!!!!

export class VendaController {
    constructor() {
        this.vendaService = new VendaService();
    }

    //processar vendas
    async processarVenda(socket, text, from) {
        try {
            console.log('🛒 Processando Venda...');

            // Extrai dados da mensagem
            const { nomeCliente, valor, parcelas, produto, diaVencimento } = this.extrairDadosVenda(text);

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

            //SALVAR NO BANCO DEPOIS!!!!!!!!!
            const { venda, cliente } = await this.vendaService.criarVenda(
                nomeCliente, valor, parcelas, produto
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

    // ✅ EXTRAIR DADOS DA VENDA
    extrairDadosVenda(text) {
        // Exemplo: "Maria Silva comprou 400, 3 parcelas, vencimento 10"

        // Nome (tudo antes de "comprou")
        const nomeMatch = text.match(/(.+?)\s+(comprou|venda|compra)/i);
        const nomeCliente = nomeMatch ? nomeMatch[1].trim() : null;

        // Valor
        const valorMatch = text.match(/(\d+(?:[.,]\d+)?)/);
        const valor = valorMatch ? parseFloat(valorMatch[1].replace(',', '.')) : null;

        // Parcelas
        const parcelasMatch = text.match(/(\d+)\s*(x|parcela)/i);
        const parcelas = parcelasMatch ? parseInt(parcelasMatch[1]) : 1;

        // Vencimento
        const vencimentoMatch = text.match(/vencimento\s*(\d+)/i);
        const diaVencimento = vencimentoMatch ? parseInt(vencimentoMatch[1]) : 10;

        // Produto (opcional)
        const produtoMatch = text.match(/,\s*([^,]+?)(?=,|$)/);
        const produto = produtoMatch ? produtoMatch[1].trim() : '';

        return { nomeCliente, valor, parcelas, produto, diaVencimento };
    }
}

// ✅ EXPORT DEFAULT também
export default VendaController;