async function askDeviceTypeAndSendLink(sock, jid) {
    await sock.sendMessage(jid, { text: 'Which device do you want to download the app for? (android/apple/windows/linux)' });
    // The next message handler should listen for the reply and call sendDownloadLink
}

module.exports = askDeviceTypeAndSendLink;
