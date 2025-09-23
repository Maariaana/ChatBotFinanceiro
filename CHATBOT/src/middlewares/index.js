import { PREFIX } from "../config.js";

export const verifyPrefix = (prefix) => PREFIX === prefix;
export const hasTypeOrCommand = ({ type, command }) => type && command;