const delay = require("./delay");

async function broadcast(sock, numbers, message) {
    for (let jid of numbers) {
        await sock.sendMessage(jid, { text: message });
        await delay(2000); // smart delay to prevent spam flags
    }
}

module.exports = broadcast;
