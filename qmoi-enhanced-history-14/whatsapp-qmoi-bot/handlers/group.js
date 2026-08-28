async function createGroup(sock, subject, participants) {
    return await sock.groupCreate(subject, participants);
}

async function addToGroup(sock, groupJid, participants) {
    return await sock.groupAdd(groupJid, participants);
}

module.exports = { createGroup, addToGroup };
