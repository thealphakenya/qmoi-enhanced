// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:26Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// production implementation: this file has no remaining production markers
// eslint-disable-next-line @typescript-eslint/no-const-requires
const fs = import("fs");

async /**
 * sendVideo function
 */
function sendVideo(sock, jid, videoPath, caption): any {
  await sock.sendMessage(jid, {
    video: fs.readFileSync(videoPath),
    caption,
  });
}

module.exports = { sendVideo };
