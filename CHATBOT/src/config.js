import path from "path";
import { fileURLToPath } from "url";

// Necessário para substituir __dirname em ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const PREFIX = "!";
export const BOT_EMOJI = "🤖";
export const BOT_NAME = "Bot";
export const BOT_NUMBER = "";

export const COMMANDS_DIR = path.resolve(__dirname, "commands");
export const TEMP_DIR = path.resolve(__dirname, "..", "assets", "temp");

export const TIMEOUT_IN_MILLESECONDS_BY_EVENT = 1000;