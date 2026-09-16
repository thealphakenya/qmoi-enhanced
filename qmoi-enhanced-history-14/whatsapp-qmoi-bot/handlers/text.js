/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const askQmoi = require("../services/qmoi");
const { commandResult } = require("../utils/command_router");

module.exports = async function handleText(sock, jid, text) {
    const commandReply = commandResult(text);
    const reply = commandReply || await askQmoi(text);
    await sock.sendMessage(jid, { text: reply });
};
