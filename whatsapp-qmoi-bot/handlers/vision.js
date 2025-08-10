 
import askQmoi from '../services/qmoi';
import fs from 'fs';

async function handleVision(sock, jid, imagePath) {
    // Send image to Qmoi for vision/captioning
    const image = fs.readFileSync(imagePath, { encoding: 'base64' });
    const caption = await askQmoi({ type: 'vision', image });
    await sock.sendMessage(jid, { text: caption });
}

module.exports = handleVision;
