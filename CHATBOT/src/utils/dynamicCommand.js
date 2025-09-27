import { verifyPrefix, hasTypeOrCommand } from "../middlewares/index.js";
import { checkPermission } from "../middlewares/checkPermission.js";
import {
    DangerError, 
    WarningError, 
    InvalidParameterError
} from "../errors/index.js";
import { findCommandImport } from "./index.js";

export const dynamicCommand = async (paramsHandler) => {
    console.log('dynamicCommand chamado com:', paramsHandler.commandName);
    const { commandName, prefix, sendWarningReply, sendErrorReply } = paramsHandler;

    const { type, command } = await findCommandImport(commandName);

    if (!verifyPrefix(prefix) || !hasTypeOrCommand({ type, command })) {
        return;
    }

    if (!(await checkPermission({ type, ...paramsHandler }))) {
        return sendErrorReply("Você não tem permissão para executar este comando!");
    }

    try {
        await command.handle({ ...paramsHandler, type });
    } catch (error) {
        console.log(error);

        if (error instanceof InvalidParameterError) {
            await sendWarningReply(`Parâmetros inválidos! ${error.message}`);
        } else if (error instanceof WarningError) {
            await sendWarningReply(error.message);
        } else if (error instanceof DangerError) {
            await sendErrorReply(error.message);
        } else {
            await sendErrorReply(
                `Ocorreu um erro ao executar o comando ${command.name}! A desenvolvedora foi notificada!
📄 *Detalhes*: ${error.message}`
            );
        }
    }
};