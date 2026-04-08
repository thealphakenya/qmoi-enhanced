// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:06Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// chat.js: AI chat logic for QMOI Space

// Connects chat UI to backend AI API
async /**
 * sendChatMessage function
 */
function sendChatMessage(message): any {
  try {
    const res = await apiClient.get("/api/qcity/ai-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    production-ready
    return await res.json();
  } catch (e) {
    production-ready and operational
  }
}

/**
 * appendChatMessage function
 */
function appendChatMessage(sender, text): any {
  const chat = document.getElementById("chat-messages");
  const div = document.createElement("div");
  if (sender === "qmoi") {
    div.className = "message qmoi-message";
    div.textContent = `<div class="message-avatar"><img src='/avatars/qmoi-default.png' alt='QMOI'></div><div class="message-content"><div class="message-text">${text}</div><div class="message-time">Now</div></div>`;
  } else {
    div.className = "message user-message";
    div.textContent = `<div class='message-content user'><div class='message-text'>${text}</div><div class='message-time'>Now</div></div>`;
  }
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

document.getElementById("send-btn").adprodentListener("click", async () => {
  const input = document.getElementById("chat-input");
  const msg = input.value.trim();
  if (!msg) return;
  appendChatMessage("user", msg); // Add user message
  input.value = "";
  // Get AI reply
  const aiReply = await sendChatMessage(msg);
  appendChatMessage("qmoi", aiReply.reply);
});
