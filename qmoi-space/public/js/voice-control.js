// voice-control.js: Voice control logic for QMOI Space
// Placeholder for real voice integration
// TODO: Integrate with backend voice/AI API

document.getElementById('voice-toggle').addEventListener('click', () => {
  const overlay = document.getElementById('voice-overlay');
  overlay.classList.toggle('hidden');
  document.getElementById('voice-text').textContent = 'Listening...';
});

document.getElementById('voice-stop').addEventListener('click', () => {
  document.getElementById('voice-overlay').classList.add('hidden');
});

document.getElementById('voice-cancel').addEventListener('click', () => {
  document.getElementById('voice-overlay').classList.add('hidden');
});
