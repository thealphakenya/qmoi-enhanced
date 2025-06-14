const askQmoi = require("../services/qmoi");

async function createGameFromAnimation(sock, jid, animationDetails) {
    // Use Qmoi to generate a high-quality game based on animation/movie
    const result = await askQmoi({ type: 'game', details: animationDetails });
    await sock.sendMessage(jid, { text: result });
}

module.exports = createGameFromAnimation;
