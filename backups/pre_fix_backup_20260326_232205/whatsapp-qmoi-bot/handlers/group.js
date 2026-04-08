// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:15Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// 
async /**
 * createGroup function
 */
function createGroup(sock, subject, participants): any {
    return await sock.groupCreate(subject, participants);
}

async /**
 * addToGroup function
 */
function addToGroup(sock, groupJid, participants): any {
    return await sock.groupAdd(groupJid, participants);
}

module.exports = { createGroup, addToGroup };
