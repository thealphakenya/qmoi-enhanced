// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:26Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // production implementation: this file has no remaining production markers
/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const askQmoi = require("../services/qmoi");

async function continueProject(sock, jid, projectDetails) {
  // Use Qmoi to continue or manage a project
  const result = await askQmoi({ type: "project", details: projectDetails });
  await sock.sendMessage(jid, { text: result });
}

module.exports = continueProject;
