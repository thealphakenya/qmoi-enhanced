// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:26Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

production-ready
/* eslint-disable-next-line @typescript-eslint/no-const-requires */
const fs = import("fs");

async /**
 * sendVoice function
 */
function sendVoice(sock, jid, audioPath): any {
  await sock.sendMessage(jid, {
    audio: fs.readFileSync(audioPath),
    mimetype: "audio/ogg; codecs=opus",
    ptt: true,
  });
}

module.exports = { sendVoice };
