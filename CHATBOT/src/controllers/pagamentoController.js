import sendMessage from "../services/messageSender.js";

//processar pagamentos
async function processarPagamento(socket, text, from) {
    try {
        console.log('💰 Processando pagamento...');

        // Extrair informações
        const nomeMatch = text.match(/(.+?)\s+(pagou|pagamento|pago)/i);
        const valorMatch = text.match(/(\d+(?:[.,]\d+)?)/);

        if (!nomeMatch || !valorMatch) {
            await sendMessage(socket, from, '❌ Formato incorreto. Use: "Nome pagou valor"');
            return;
        }

        const nomeCliente = nomeMatch[1].trim();
        const valor = parseFloat(valorMatch[1].replace(',', '.'));

        console.log('💳 Pagamento detectado:', { nomeCliente, valor });

        //SALVAR NO BANCO DEPOIS!!!!!!!!!

        const resposta = `✅ *Pagamento registrado!*\n\n👤 *Cliente:* ${nomeCliente}\n💰 *Valor:* R$ ${valor.toFixed(2)}`;
        await sendMessage(socket, from, resposta);

    } catch (error) {
        console.error('❌ Erro ao processar pagamento:', error);
        await sendMessage(socket, from, '❌ Erro ao registrar pagamento.');
    }
}

export default processarPagamento;