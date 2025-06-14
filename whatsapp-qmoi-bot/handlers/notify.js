async function sendNotification(sock, jids, message) {
    for (const jid of jids) {
        await sock.sendMessage(jid, { text: message });
    }
}

module.exports = sendNotification;
