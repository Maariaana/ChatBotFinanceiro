import { connect } from "./connection.js";
import { load } from "./loader.js";

async function start() {
    const socket = await connect();

    load(socket);
}

start();