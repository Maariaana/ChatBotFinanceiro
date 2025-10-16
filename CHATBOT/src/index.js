import { connect } from "./services/connection.js";
import { setupMessageHandler } from "./services/messageProcessor.js";

async function startApp() {
  const socket = await connect();

  socket.ev.on('messages.upsert', async ({ messages }) => {
    await setupMessageHandler({ socket, messages });
  });
}

startApp();