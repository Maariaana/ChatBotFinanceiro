import { TIMEOUT_IN_MILLESECONDS_BY_EVENT } from "./config.js";
import { onMessagesUpsert } from "./middlewares/onMessagesUpsert.js";

export const load = (socket) => {
  socket.ev.on("messages.upsert", ({ messages }) => {
    setTimeout(() => {
      onMessagesUpsert({ socket, messages });
    }, TIMEOUT_IN_MILLESECONDS_BY_EVENT);
  });
};
