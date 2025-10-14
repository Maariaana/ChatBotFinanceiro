//enviar mensagens
async function sendMessage(socket, to, text) {
    try {
        await socket.sendMessage(to, { text });
        console.log('📤 Mensagem enviada:', text);
    } catch (error) {
        console.error('❌ Erro ao enviar mensagem:', error);
    }
}

export default sendMessage;