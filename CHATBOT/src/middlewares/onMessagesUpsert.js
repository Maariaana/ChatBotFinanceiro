import { loadCommonFunctions } from "../utils/loadCommonFunctions.js";
import { dynamicCommand } from "../utils/dynamicCommand.js";

export const onMessagesUpsert = async ({ socket, messages }) => {
    if(!messages.length) {
        return;
    }

    const webMessage = messages[0];
    const commonFunctions = loadCommonFunctions({ socket, webMessage });

    await dynamicCommand(commonFunctions);
};