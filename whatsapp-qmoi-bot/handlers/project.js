const askQmoi = require("../services/qmoi");

async function continueProject(sock, jid, projectDetails) {
    // Use Qmoi to continue or manage a project
    const result = await askQmoi({ type: 'project', details: projectDetails });
    await sock.sendMessage(jid, { text: result });
}

module.exports = continueProject;
