
// chat.js: AI chat logic for QMOI Space

// Connects chat UI to backend AI API
async function sendChatMessage(message) {
  try {
    const res = await fetch('/api/qcity/ai-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    if (!res.ok) throw new Error('Failed to send message');
    return await res.json();
  } catch (e) {
    return { reply: 'AI backend unavailable.' };
  }
}

function appendChatMessage(sender, text) {
  const chat = document.getElementById('chat-messages');
  const div = document.createElement('div');
  if (sender === 'qmoi') {
    div.className = 'message qmoi-message';
    div.innerHTML = `<div class="message-avatar"><img src='/avatars/qmoi-default.png' alt='QMOI'></div><div class="message-content"><div class="message-text">${text}</div><div class="message-time">Now</div></div>`;
  } else {
    div.className = 'message user-message';
    div.innerHTML = `<div class='message-content user'><div class='message-text'>${text}</div><div class='message-time'>Now</div></div>`;
  }
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

document.getElementById('send-btn').addEventListener('click', async () => {
  const input = document.getElementById('chat-input');
  const msg = input.value.trim();
  if (!msg) return;
  appendChatMessage('user', msg); // Add user message
  input.value = '';
  // Get AI reply
  const aiReply = await sendChatMessage(msg);
  appendChatMessage('qmoi', aiReply.reply);
});
