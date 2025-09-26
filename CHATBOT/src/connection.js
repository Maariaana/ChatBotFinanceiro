import makeWASocket, { 
  useMultiFileAuthState, 
  fetchLatestBaileysVersion, 
  DisconnectReason 
} from "@whiskeysockets/baileys";
import path from "path";
import pino from "pino";
import { fileURLToPath } from "url";
import qrcode from "qrcode-terminal"; // 👈 precisa instalar: npm install qrcode-terminal

// Em ESM, não existe __dirname por padrão, precisamos recriar:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function connect() {
  const { state, saveCreds } = await useMultiFileAuthState(
    path.resolve(__dirname, "..", "assets", "auth", "baileys")
  );

  const { version } = await fetchLatestBaileysVersion();

  const socket = makeWASocket({
    printQRInTerminal: false, // vamos exibir manualmente
    version,
    logger: pino({ level: "error" }),
    auth: state,
    browser: ["ChatBotFinanceiro", "Chrome", "3.0"],
  });

  // Exibe o QR Code no terminal
  socket.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      qrcode.generate(qr, { small: true });
    }

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

      if (shouldReconnect) {
        connect(); // reconecta
      }
    }
  });

  socket.ev.on("creds.update", saveCreds);

  return socket;
}
