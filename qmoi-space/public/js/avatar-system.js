// avatar-system.js: Avatar selection logic for QMOI Space

document.getElementById('avatar-preview').addEventListener('click', () => {
  document.getElementById('avatar-menu').classList.toggle('show');
});

document.querySelectorAll('.avatar-option').forEach(option => {
  option.addEventListener('click', (e) => {
    const avatar = option.getAttribute('data-avatar');
    document.getElementById('avatar-preview').querySelector('img').src = `/avatars/${avatar}.png`;
    document.getElementById('avatar-menu').classList.remove('show');
  });
});
