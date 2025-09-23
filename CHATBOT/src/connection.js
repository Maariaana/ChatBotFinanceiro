import makeWASocket, { useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } from "@whiskeysockets/baileys";
import path from "path";
import pino from "pino";
import { fileURLToPath } from "url";
import { question, onlyNumbers } from "./utils/index.js";

// Em ESM, não existe __dirname por padrão, precisamos recriar:
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

  if (!socket.authState.creds.registered) {
    const phoneNumber = await question("Informe seu número de telefone: ");

    if (!phoneNumber) {
      throw new Error("Número de telefone inválido!");
    }

    const code = await socket.requestPairingCode(onlyNumbers(phoneNumber));

    console.log(`Código de pareamento: ${code}`);
  }

  socket.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

      if (shouldReconnect) {
        connect(); // chama de novo
      }
    }
  });

  socket.ev.on("creds.update", saveCreds);

  return socket;
}