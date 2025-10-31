import sendMessage from "./messageSender.js";
import processarPagamento from "../controllers/pagamentoController.js";
import VendaController from "../controllers/vendaController.js";

//processar mensagens
function setupMessageHandler(socket) {
    socket.ev.on("messages.upsert", async ({ messages }) => {
        const message = messages[0];

        if (!message.message || message.key.fromMe) return;

        const text = extractText(message);
        const from = message.key.remoteJid;

        console.log('📩 Mensagem recebida:', text);

        await processarMensagemNatural(socket, text, from);
    });
}

//extrair o texto de diferentes tipos de mensagem
function extractText(message) {
    return message.message.conversation ||
        message.message.extendedTextMessage?.text ||
        message.message.imageMessage?.caption || '';
}

//processar mensagens naturais
async function processarMensagemNatural(socket, text, from) {
    const mensagem = text.toLowerCase();

    // VENDA
    if (mensagem.includes('comprou') || mensagem.includes('venda') || mensagem.includes('compra')) {
        const vendaController = new VendaController();
        await vendaController.processarVenda(socket, text, from); // ✅ MÉTODO CORRETO
    }

    //PAGAMENTO
    else if (mensagem.includes('pagou') || mensagem.includes('pagamento') || mensagem.includes('pago')) {
        await processarPagamento(socket, text, from);
    }

    //Saudação
    else if (mensagem.includes('oi') || mensagem.includes('olá') || mensagem.includes('ola')) {
        await sendMessage(socket, from,
            'Olá! 😊 Sou seu assistente financeiro.\n\n' +
            'Exemplos:\n• "Maria comprou 400, 4 parcelas"\n' +
            '• "João pagou 150"'
        );
    }

    //Ajuda
    else if (mensagem.includes('ajuda') || mensagem.includes('help')) {
        await sendMessage(socket, from,
            '💡 *Como usar:*\n\n' +
            '📦 Registrar venda:\n"Maria comprou 300, 2 parcelas, vencimento 10"\n\n' +
            '💰 Registrar pagamento:\n"João pagou 150"'
        );
    }

    //Não entendeu
    else {
        await sendMessage(socket, from,
            '🤔 Não entendi. Diga algo como:\n' +
            '• "Maria comprou 300, 2x"\n' +
            '• "João pagou 150"\n' +
            '• Digite "ajuda" para mais opções'
        );
    }
}


export {
    setupMessageHandler,
    extractText,
    processarMensagemNatural
};