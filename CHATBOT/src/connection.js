import makeWASocket, {
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason
} from "@whiskeysockets/baileys";
import path from "path";
import pino from "pino";
import { fileURLToPath } from "url";
import qrcode from "qrcode-terminal";
import { setupMessageHandler } from "./utils/messageProcessor.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function connect() {
  const { state, saveCreds } = await useMultiFileAuthState(
    path.resolve(__dirname, "..", "assets", "auth", "baileys")
  );

  const { version } = await fetchLatestBaileysVersion();

  const socket = makeWASocket({
    printQRInTerminal: false,
    version,
    logger: pino({ level: "error" }),
    auth: state,
    browser: ["ChatBotFinanceiro", "Chrome", "3.0"],
  });

  socket.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      qrcode.generate(qr, { small: true });
    }

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

      if (shouldReconnect) {
        connect();
      }
    } else if (connection === "open") {
      console.log('✅ Conectado ao WhatsApp!');
      setupMessageHandler(socket);
    }
  });

  socket.ev.on("creds.update", saveCreds);

  return socket;
}