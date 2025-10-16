import sendMessage from "../services/messageSender.js";

 //NÃO É COMPRA! É VENDA!!!!! MUDA ISSO!!!!!
 
//processar vendas
async function processarVenda(socket, text, from) {
    try {
        console.log('🛒 Processando Venda...');

        const nomeMatch = text.match(/(.+?)\s+(comprou|venda|compra)/i);
        const valorMatch = text.match(/(\d+(?:[.,]\d+)?)/);
        const parcelasMatch = text.match(/(\d+)\s*(x|parcela)/i);
        const vencimentoMatch = text.match(/vencimento\s*(\d+)/i);

        if (!nomeMatch || !valorMatch) {
            await sendMessage(socket, from, '❌ Formato incorreto. Use: "Nome comprou valor, X parcelas, vencimento dia"');
            return;
        }

        const nomeCliente = nomeMatch[1].trim();
        const valor = parseFloat(valorMatch[1].replace(',', '.'));
        const parcelas = parcelasMatch ? parseInt(parcelasMatch[1]) : 1;
        const diaVencimento = vencimentoMatch ? parseInt(vencimentoMatch[1]) : 10;

        console.log('📋 Venda detectada:', { nomeCliente, valor, parcelas, diaVencimento });

        //SALVAR NO BANCO DEPOIS!!!!!!!!!


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

export default processarVenda;