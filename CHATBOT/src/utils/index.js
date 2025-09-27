import { downloadContentFromMessage } from "baileys";
import readline from "readline";
import path from "path";
import { writeFile } from "fs/promises";
import fs from "fs";
import { TEMP_DIR, COMMANDS_DIR, PREFIX } from "../config.js";

export function question(message) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => rl.question(message, resolve));
}

export function onlyNumbers(text) {
  return text.replace(/[^0-9]/g, "");
}

export function extractDataFromMessage(webMessage) {
  const textMessage = webMessage.message?.conversation;
  const extendedTextMessage = webMessage.message?.extendedTextMessage;
  const extendedTextMessageText = extendedTextMessage?.text;
  const imageTextMessage = webMessage.message?.imageMessage?.caption;
  const videoTextMessage = webMessage.message?.videoMessage?.caption;

  const fullMessage =
    textMessage || extendedTextMessageText || imageTextMessage || videoTextMessage;

  if (!fullMessage) {
    return {
      remoteJid: null,
      userJid: null,
      prefix: null,
      commandName: null,
      isReply: null,
      replyJid: null,
      args: [],
    };
  }

  const isReply =
    !!extendedTextMessage && !!extendedTextMessage.contextInfo?.quotedMessage;

  const replyJid =
    !!extendedTextMessage && extendedTextMessage.contextInfo?.participant
      ? extendedTextMessage.contextInfo.participant
      : null;

  const userJid = webMessage?.key?.participant?.replace(
    /:[0-9][0-9]|:[0-9]/g,
    ""
  );

  const [command, ...args] = fullMessage.split(" ");
  const prefix = command.charAt(0);

  const commandWithoutPrefix = command.replace(new RegExp(`^[${PREFIX}]+`), "");

  return {
    remoteJid: webMessage?.key?.remoteJid,
    prefix,
    userJid,
    replyJid,
    isReply,
    commandName: formatCommand(commandWithoutPrefix),
    args: splitByCharacters(args.join(" "), ["\\", "|", "/"]),
  };
}

export function splitByCharacters(str, characters) {
  characters = characters.map((char) => (char === "\\" ? "\\\\" : char));
  const regex = new RegExp(`[${characters.join("")}]`);

  return str
    .split(regex)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function formatCommand(text) {
  return onlyLettersAndNumbers(
    removeAccentsAndSpecialCharacters(text.toLowerCase().trim())
  );
}

export function onlyLettersAndNumbers(text) {
  return text.replace(/[^a-zA-Z0-9]/g, "");
}

export function removeAccentsAndSpecialCharacters(text) {
  if (!text) return "";
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function baileysIs(webMessage, context) {
  return !!getContent(webMessage, context);
}

export function getContent(webMessage, context) {
  return (
    webMessage.message?.[`${context}Message`] ||
    webMessage.message?.extendedTextMessage?.contextInfo?.quotedMessage?.[
      `${context}Message`
    ]
  );
}

export async function download(webMessage, filename, context, extension) {
  const content = getContent(webMessage, context);

  if (!content) {
    return null;
  }

  const stream = await downloadContentFromMessage(content, context);

  let buffer = Buffer.from([]);

  for await (const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk]);
  }

  const filePath = path.resolve(TEMP_DIR, `${filename}.${extension}`);

  await writeFile(filePath, buffer);

  return filePath;
}

export async function findCommandImport(commandName) {
  const commandImports = await readCommandImports();

  console.log("🔍 Comandos carregados:", Object.keys(commandImports));

  let typeReturn = "";
  let targetCommandReturn = null;

  for (const [type, commands] of Object.entries(commandImports)) {
    if (!commands.length) continue;

    console.log(`📂 Verificando pasta ${type}:`, commands.map(c => c.name));

    const targetCommand = commands.find((cmd) =>
      cmd.commands.map((c) => formatCommand(c)).includes(commandName)
    );

    if (targetCommand) {
      typeReturn = type;
      targetCommandReturn = targetCommand;
      break;
    }
  }

  return {
    type: typeReturn,
    command: targetCommandReturn,
  };
}

export async function readCommandImports() {
  const subdirectories = fs
    .readdirSync(COMMANDS_DIR, { withFileTypes: true })
    .filter((directory) => directory.isDirectory())
    .map((directory) => directory.name);

  const commandImports = {};

  for (const subdir of subdirectories) {
    const subdirectoryPath = path.join(COMMANDS_DIR, subdir);
    const files = fs
      .readdirSync(subdirectoryPath)
      .filter(
        (file) =>
          !file.startsWith("_") &&
          (file.endsWith(".js") || file.endsWith(".ts"))
      );

    // Importação dinâmica ESM
    const importedFiles = [];
    for (const file of files) {
      const filePath = path.join(subdirectoryPath, file);
      const module = await import(filePath.startsWith("/") || filePath.startsWith("."
        ) ? `file://${filePath}` : `file:///${filePath.replace(/\\/g, "/")}`);
      importedFiles.push(module.default || module);
    }
    commandImports[subdir] = importedFiles;
  }

  return commandImports;
}