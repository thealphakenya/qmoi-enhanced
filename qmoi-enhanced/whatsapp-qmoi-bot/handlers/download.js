async function sendDownloadLink(sock, jid, deviceType) {
    // Provide download link for app/project based on device type
    let url = '';
    switch (deviceType) {
        case 'android': url = 'https://example.com/app-android.apk'; break;
        case 'apple': url = 'https://example.com/app-ios.ipa'; break;
        case 'windows': url = 'https://example.com/app-windows.exe'; break;
        case 'linux': url = 'https://example.com/app-linux.AppImage'; break;
        default: url = 'https://example.com/app';
    }
    await sock.sendMessage(jid, { text: `Download the app for ${deviceType}: ${url}` });
}

module.exports = sendDownloadLink;
