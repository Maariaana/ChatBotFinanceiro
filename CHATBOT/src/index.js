import { connect } from "./services/connection.js";
import { setupMessageHandler } from "./services/messageProcessor.js";

async function startApp() {
  try {
    const socket = await connect();

    socket.ev.on('messages.upsert', async ({ messages }) => {
      try {
        await setupMessageHandler({ socket, messages });
      } catch (err) {
        console.error('Erro no handler de mensagens:', err);
      }
    });
  } catch (err) {
    console.error('Erro ao conectar e iniciar o bot:', err);
  }
}

startApp();