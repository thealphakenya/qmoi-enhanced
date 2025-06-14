const askQmoi = require("../services/qmoi");

module.exports = async function handleText(sock, jid, text) {
    const reply = await askQmoi(text);
    await sock.sendMessage(jid, { text: reply });
};
