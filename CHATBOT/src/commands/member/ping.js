
import { PREFIX } from '../config.js';

export default {
    name: "ping",
    description: "Verificar se o bot está online",
    commands: ["ping"],
    usage: `&{PREFIX}ping`,
    handle: async ({ sendReply, sendReact}) => {
        await sendReact("🏓");
        await sendReply("🏓 Pong!");
    },
};