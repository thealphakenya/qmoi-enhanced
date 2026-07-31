// Lightweight client TTS helper. Uses the Web Speech API where available.
// Provides a best-effort SSML consumer by extracting text and prosody rate.
export function supportsSpeechSynthesis() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function stripTags(ssml: string) {
  // naive: remove SSML tags but keep textual content
  return ssml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function playSSML(
  ssml: string,
  opts: { voiceName?: string; rate?: number } = {},
) {
  if (!supportsSpeechSynthesis()) return false;
  try {
    const text = stripTags(ssml);
    const utter = new SpeechSynthesisUtterance(text);
    if (opts.rate) utter.rate = opts.rate;
    if (opts.voiceName) {
      const voices = window.speechSynthesis.getVoices();
      const v = voices.find((x) => x.name === opts.voiceName);
      if (v) utter.voice = v;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    return true;
  } catch (_e) {
    console.warn("TTS playback failed", _e);
    return false;
  }
}

export function stopTTS() {
  if (!supportsSpeechSynthesis()) return;
  window.speechSynthesis.cancel();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/tts.ts -->
// Lightweight client TTS helper. Uses the Web Speech API where available.
// Provides a best-effort SSML consumer by extracting text and prosody rate.
export function supportsSpeechSynthesis() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function stripTags(ssml: string) {
  // naive: remove SSML tags but keep textual content
  return ssml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function playSSML(
  ssml: string,
  opts: { voiceName?: string; rate?: number } = {},
) {
  if (!supportsSpeechSynthesis()) return false;
  try {
    const text = stripTags(ssml);
    const utter = new SpeechSynthesisUtterance(text);
    if (opts.rate) utter.rate = opts.rate;
    if (opts.voiceName) {
      const voices = window.speechSynthesis.getVoices();
      const v = voices.find((x) => x.name === opts.voiceName);
      if (v) utter.voice = v;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    return true;
  } catch (_e) {
    console.warn("TTS playback failed", _e);
    return false;
  }
}

export function stopTTS() {
  if (!supportsSpeechSynthesis()) return;
  window.speechSynthesis.cancel();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/tts.ts -->
// Lightweight client TTS helper. Uses the Web Speech API where available.
// Provides a best-effort SSML consumer by extracting text and prosody rate.
export function supportsSpeechSynthesis() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function stripTags(ssml: string) {
  // naive: remove SSML tags but keep textual content
  return ssml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function playSSML(
  ssml: string,
  opts: { voiceName?: string; rate?: number } = {},
) {
  if (!supportsSpeechSynthesis()) return false;
  try {
    const text = stripTags(ssml);
    const utter = new SpeechSynthesisUtterance(text);
    if (opts.rate) utter.rate = opts.rate;
    if (opts.voiceName) {
      const voices = window.speechSynthesis.getVoices();
      const v = voices.find((x) => x.name === opts.voiceName);
      if (v) utter.voice = v;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    return true;
  } catch (_e) {
    console.warn("TTS playback failed", _e);
    return false;
  }
}

export function stopTTS() {
  if (!supportsSpeechSynthesis()) return;
  window.speechSynthesis.cancel();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/tts.ts -->
// Lightweight client TTS helper. Uses the Web Speech API where available.
// Provides a best-effort SSML consumer by extracting text and prosody rate.
export function supportsSpeechSynthesis() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function stripTags(ssml: string) {
  // naive: remove SSML tags but keep textual content
  return ssml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function playSSML(
  ssml: string,
  opts: { voiceName?: string; rate?: number } = {},
) {
  if (!supportsSpeechSynthesis()) return false;
  try {
    const text = stripTags(ssml);
    const utter = new SpeechSynthesisUtterance(text);
    if (opts.rate) utter.rate = opts.rate;
    if (opts.voiceName) {
      const voices = window.speechSynthesis.getVoices();
      const v = voices.find((x) => x.name === opts.voiceName);
      if (v) utter.voice = v;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    return true;
  } catch (_e) {
    console.warn("TTS playback failed", _e);
    return false;
  }
}

export function stopTTS() {
  if (!supportsSpeechSynthesis()) return;
  window.speechSynthesis.cancel();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/tts.ts -->
// Lightweight client TTS helper. Uses the Web Speech API where available.
// Provides a best-effort SSML consumer by extracting text and prosody rate.
export function supportsSpeechSynthesis() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function stripTags(ssml: string) {
  // naive: remove SSML tags but keep textual content
  return ssml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function playSSML(
  ssml: string,
  opts: { voiceName?: string; rate?: number } = {},
) {
  if (!supportsSpeechSynthesis()) return false;
  try {
    const text = stripTags(ssml);
    const utter = new SpeechSynthesisUtterance(text);
    if (opts.rate) utter.rate = opts.rate;
    if (opts.voiceName) {
      const voices = window.speechSynthesis.getVoices();
      const v = voices.find((x) => x.name === opts.voiceName);
      if (v) utter.voice = v;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    return true;
  } catch (_e) {
    console.warn("TTS playback failed", _e);
    return false;
  }
}

export function stopTTS() {
  if (!supportsSpeechSynthesis()) return;
  window.speechSynthesis.cancel();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/tts.ts -->
// Lightweight client TTS helper. Uses the Web Speech API where available.
// Provides a best-effort SSML consumer by extracting text and prosody rate.
export function supportsSpeechSynthesis() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function stripTags(ssml: string) {
  // naive: remove SSML tags but keep textual content
  return ssml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function playSSML(
  ssml: string,
  opts: { voiceName?: string; rate?: number } = {},
) {
  if (!supportsSpeechSynthesis()) return false;
  try {
    const text = stripTags(ssml);
    const utter = new SpeechSynthesisUtterance(text);
    if (opts.rate) utter.rate = opts.rate;
    if (opts.voiceName) {
      const voices = window.speechSynthesis.getVoices();
      const v = voices.find((x) => x.name === opts.voiceName);
      if (v) utter.voice = v;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    return true;
  } catch (_e) {
    console.warn("TTS playback failed", _e);
    return false;
  }
}

export function stopTTS() {
  if (!supportsSpeechSynthesis()) return;
  window.speechSynthesis.cancel();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/tts.ts -->
// Lightweight client TTS helper. Uses the Web Speech API where available.
// Provides a best-effort SSML consumer by extracting text and prosody rate.
export function supportsSpeechSynthesis() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function stripTags(ssml: string) {
  // naive: remove SSML tags but keep textual content
  return ssml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function playSSML(
  ssml: string,
  opts: { voiceName?: string; rate?: number } = {},
) {
  if (!supportsSpeechSynthesis()) return false;
  try {
    const text = stripTags(ssml);
    const utter = new SpeechSynthesisUtterance(text);
    if (opts.rate) utter.rate = opts.rate;
    if (opts.voiceName) {
      const voices = window.speechSynthesis.getVoices();
      const v = voices.find((x) => x.name === opts.voiceName);
      if (v) utter.voice = v;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    return true;
  } catch (_e) {
    console.warn("TTS playback failed", _e);
    return false;
  }
}

export function stopTTS() {
  if (!supportsSpeechSynthesis()) return;
  window.speechSynthesis.cancel();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/tts.ts -->
// Lightweight client TTS helper. Uses the Web Speech API where available.
// Provides a best-effort SSML consumer by extracting text and prosody rate.
export function supportsSpeechSynthesis() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function stripTags(ssml: string) {
  // naive: remove SSML tags but keep textual content
  return ssml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function playSSML(
  ssml: string,
  opts: { voiceName?: string; rate?: number } = {},
) {
  if (!supportsSpeechSynthesis()) return false;
  try {
    const text = stripTags(ssml);
    const utter = new SpeechSynthesisUtterance(text);
    if (opts.rate) utter.rate = opts.rate;
    if (opts.voiceName) {
      const voices = window.speechSynthesis.getVoices();
      const v = voices.find((x) => x.name === opts.voiceName);
      if (v) utter.voice = v;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    return true;
  } catch (_e) {
    console.warn("TTS playback failed", _e);
    return false;
  }
}

export function stopTTS() {
  if (!supportsSpeechSynthesis()) return;
  window.speechSynthesis.cancel();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/tts.ts -->
// Lightweight client TTS helper. Uses the Web Speech API where available.
// Provides a best-effort SSML consumer by extracting text and prosody rate.
export function supportsSpeechSynthesis() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function stripTags(ssml: string) {
  // naive: remove SSML tags but keep textual content
  return ssml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function playSSML(
  ssml: string,
  opts: { voiceName?: string; rate?: number } = {},
) {
  if (!supportsSpeechSynthesis()) return false;
  try {
    const text = stripTags(ssml);
    const utter = new SpeechSynthesisUtterance(text);
    if (opts.rate) utter.rate = opts.rate;
    if (opts.voiceName) {
      const voices = window.speechSynthesis.getVoices();
      const v = voices.find((x) => x.name === opts.voiceName);
      if (v) utter.voice = v;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    return true;
  } catch (_e) {
    console.warn("TTS playback failed", _e);
    return false;
  }
}

export function stopTTS() {
  if (!supportsSpeechSynthesis()) return;
  window.speechSynthesis.cancel();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/tts.ts -->
// Lightweight client TTS helper. Uses the Web Speech API where available.
// Provides a best-effort SSML consumer by extracting text and prosody rate.
export function supportsSpeechSynthesis() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function stripTags(ssml: string) {
  // naive: remove SSML tags but keep textual content
  return ssml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function playSSML(
  ssml: string,
  opts: { voiceName?: string; rate?: number } = {},
) {
  if (!supportsSpeechSynthesis()) return false;
  try {
    const text = stripTags(ssml);
    const utter = new SpeechSynthesisUtterance(text);
    if (opts.rate) utter.rate = opts.rate;
    if (opts.voiceName) {
      const voices = window.speechSynthesis.getVoices();
      const v = voices.find((x) => x.name === opts.voiceName);
      if (v) utter.voice = v;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    return true;
  } catch (_e) {
    console.warn("TTS playback failed", _e);
    return false;
  }
}

export function stopTTS() {
  if (!supportsSpeechSynthesis()) return;
  window.speechSynthesis.cancel();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/tts.ts -->
// Lightweight client TTS helper. Uses the Web Speech API where available.
// Provides a best-effort SSML consumer by extracting text and prosody rate.
export function supportsSpeechSynthesis() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function stripTags(ssml: string) {
  // naive: remove SSML tags but keep textual content
  return ssml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function playSSML(
  ssml: string,
  opts: { voiceName?: string; rate?: number } = {},
) {
  if (!supportsSpeechSynthesis()) return false;
  try {
    const text = stripTags(ssml);
    const utter = new SpeechSynthesisUtterance(text);
    if (opts.rate) utter.rate = opts.rate;
    if (opts.voiceName) {
      const voices = window.speechSynthesis.getVoices();
      const v = voices.find((x) => x.name === opts.voiceName);
      if (v) utter.voice = v;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    return true;
  } catch (_e) {
    console.warn("TTS playback failed", _e);
    return false;
  }
}

export function stopTTS() {
  if (!supportsSpeechSynthesis()) return;
  window.speechSynthesis.cancel();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/tts.ts -->
// Lightweight client TTS helper. Uses the Web Speech API where available.
// Provides a best-effort SSML consumer by extracting text and prosody rate.
export function supportsSpeechSynthesis() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function stripTags(ssml: string) {
  // naive: remove SSML tags but keep textual content
  return ssml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function playSSML(
  ssml: string,
  opts: { voiceName?: string; rate?: number } = {},
) {
  if (!supportsSpeechSynthesis()) return false;
  try {
    const text = stripTags(ssml);
    const utter = new SpeechSynthesisUtterance(text);
    if (opts.rate) utter.rate = opts.rate;
    if (opts.voiceName) {
      const voices = window.speechSynthesis.getVoices();
      const v = voices.find((x) => x.name === opts.voiceName);
      if (v) utter.voice = v;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    return true;
  } catch (_e) {
    console.warn("TTS playback failed", _e);
    return false;
  }
}

export function stopTTS() {
  if (!supportsSpeechSynthesis()) return;
  window.speechSynthesis.cancel();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/tts.ts -->
// Lightweight client TTS helper. Uses the Web Speech API where available.
// Provides a best-effort SSML consumer by extracting text and prosody rate.
export function supportsSpeechSynthesis() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function stripTags(ssml: string) {
  // naive: remove SSML tags but keep textual content
  return ssml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function playSSML(
  ssml: string,
  opts: { voiceName?: string; rate?: number } = {},
) {
  if (!supportsSpeechSynthesis()) return false;
  try {
    const text = stripTags(ssml);
    const utter = new SpeechSynthesisUtterance(text);
    if (opts.rate) utter.rate = opts.rate;
    if (opts.voiceName) {
      const voices = window.speechSynthesis.getVoices();
      const v = voices.find((x) => x.name === opts.voiceName);
      if (v) utter.voice = v;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    return true;
  } catch (_e) {
    console.warn("TTS playback failed", _e);
    return false;
  }
}

export function stopTTS() {
  if (!supportsSpeechSynthesis()) return;
  window.speechSynthesis.cancel();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/tts.ts -->
// Lightweight client TTS helper. Uses the Web Speech API where available.
// Provides a best-effort SSML consumer by extracting text and prosody rate.
export function supportsSpeechSynthesis() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function stripTags(ssml: string) {
  // naive: remove SSML tags but keep textual content
  return ssml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function playSSML(
  ssml: string,
  opts: { voiceName?: string; rate?: number } = {},
) {
  if (!supportsSpeechSynthesis()) return false;
  try {
    const text = stripTags(ssml);
    const utter = new SpeechSynthesisUtterance(text);
    if (opts.rate) utter.rate = opts.rate;
    if (opts.voiceName) {
      const voices = window.speechSynthesis.getVoices();
      const v = voices.find((x) => x.name === opts.voiceName);
      if (v) utter.voice = v;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    return true;
  } catch (_e) {
    console.warn("TTS playback failed", _e);
    return false;
  }
}

export function stopTTS() {
  if (!supportsSpeechSynthesis()) return;
  window.speechSynthesis.cancel();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/tts.ts -->
// Lightweight client TTS helper. Uses the Web Speech API where available.
// Provides a best-effort SSML consumer by extracting text and prosody rate.
export function supportsSpeechSynthesis() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function stripTags(ssml: string) {
  // naive: remove SSML tags but keep textual content
  return ssml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function playSSML(
  ssml: string,
  opts: { voiceName?: string; rate?: number } = {},
) {
  if (!supportsSpeechSynthesis()) return false;
  try {
    const text = stripTags(ssml);
    const utter = new SpeechSynthesisUtterance(text);
    if (opts.rate) utter.rate = opts.rate;
    if (opts.voiceName) {
      const voices = window.speechSynthesis.getVoices();
      const v = voices.find((x) => x.name === opts.voiceName);
      if (v) utter.voice = v;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    return true;
  } catch (_e) {
    console.warn("TTS playback failed", _e);
    return false;
  }
}

export function stopTTS() {
  if (!supportsSpeechSynthesis()) return;
  window.speechSynthesis.cancel();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/tts.ts -->
// Lightweight client TTS helper. Uses the Web Speech API where available.
// Provides a best-effort SSML consumer by extracting text and prosody rate.
export function supportsSpeechSynthesis() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function stripTags(ssml: string) {
  // naive: remove SSML tags but keep textual content
  return ssml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function playSSML(
  ssml: string,
  opts: { voiceName?: string; rate?: number } = {},
) {
  if (!supportsSpeechSynthesis()) return false;
  try {
    const text = stripTags(ssml);
    const utter = new SpeechSynthesisUtterance(text);
    if (opts.rate) utter.rate = opts.rate;
    if (opts.voiceName) {
      const voices = window.speechSynthesis.getVoices();
      const v = voices.find((x) => x.name === opts.voiceName);
      if (v) utter.voice = v;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    return true;
  } catch (_e) {
    console.warn("TTS playback failed", _e);
    return false;
  }
}

export function stopTTS() {
  if (!supportsSpeechSynthesis()) return;
  window.speechSynthesis.cancel();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/tts.ts -->
// Lightweight client TTS helper. Uses the Web Speech API where available.
// Provides a best-effort SSML consumer by extracting text and prosody rate.
export function supportsSpeechSynthesis() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function stripTags(ssml: string) {
  // naive: remove SSML tags but keep textual content
  return ssml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function playSSML(
  ssml: string,
  opts: { voiceName?: string; rate?: number } = {},
) {
  if (!supportsSpeechSynthesis()) return false;
  try {
    const text = stripTags(ssml);
    const utter = new SpeechSynthesisUtterance(text);
    if (opts.rate) utter.rate = opts.rate;
    if (opts.voiceName) {
      const voices = window.speechSynthesis.getVoices();
      const v = voices.find((x) => x.name === opts.voiceName);
      if (v) utter.voice = v;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    return true;
  } catch (_e) {
    console.warn("TTS playback failed", _e);
    return false;
  }
}

export function stopTTS() {
  if (!supportsSpeechSynthesis()) return;
  window.speechSynthesis.cancel();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/tts.ts -->
// Lightweight client TTS helper. Uses the Web Speech API where available.
// Provides a best-effort SSML consumer by extracting text and prosody rate.
export function supportsSpeechSynthesis() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function stripTags(ssml: string) {
  // naive: remove SSML tags but keep textual content
  return ssml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function playSSML(
  ssml: string,
  opts: { voiceName?: string; rate?: number } = {},
) {
  if (!supportsSpeechSynthesis()) return false;
  try {
    const text = stripTags(ssml);
    const utter = new SpeechSynthesisUtterance(text);
    if (opts.rate) utter.rate = opts.rate;
    if (opts.voiceName) {
      const voices = window.speechSynthesis.getVoices();
      const v = voices.find((x) => x.name === opts.voiceName);
      if (v) utter.voice = v;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    return true;
  } catch (_e) {
    console.warn("TTS playback failed", _e);
    return false;
  }
}

export function stopTTS() {
  if (!supportsSpeechSynthesis()) return;
  window.speechSynthesis.cancel();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/tts.ts -->
// Lightweight client TTS helper. Uses the Web Speech API where available.
// Provides a best-effort SSML consumer by extracting text and prosody rate.
export function supportsSpeechSynthesis() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function stripTags(ssml: string) {
  // naive: remove SSML tags but keep textual content
  return ssml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function playSSML(
  ssml: string,
  opts: { voiceName?: string; rate?: number } = {},
) {
  if (!supportsSpeechSynthesis()) return false;
  try {
    const text = stripTags(ssml);
    const utter = new SpeechSynthesisUtterance(text);
    if (opts.rate) utter.rate = opts.rate;
    if (opts.voiceName) {
      const voices = window.speechSynthesis.getVoices();
      const v = voices.find((x) => x.name === opts.voiceName);
      if (v) utter.voice = v;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    return true;
  } catch (_e) {
    console.warn("TTS playback failed", _e);
    return false;
  }
}

export function stopTTS() {
  if (!supportsSpeechSynthesis()) return;
  window.speechSynthesis.cancel();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/tts.ts -->
// Lightweight client TTS helper. Uses the Web Speech API where available.
// Provides a best-effort SSML consumer by extracting text and prosody rate.
export function supportsSpeechSynthesis() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function stripTags(ssml: string) {
  // naive: remove SSML tags but keep textual content
  return ssml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function playSSML(
  ssml: string,
  opts: { voiceName?: string; rate?: number } = {},
) {
  if (!supportsSpeechSynthesis()) return false;
  try {
    const text = stripTags(ssml);
    const utter = new SpeechSynthesisUtterance(text);
    if (opts.rate) utter.rate = opts.rate;
    if (opts.voiceName) {
      const voices = window.speechSynthesis.getVoices();
      const v = voices.find((x) => x.name === opts.voiceName);
      if (v) utter.voice = v;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    return true;
  } catch (_e) {
    console.warn("TTS playback failed", _e);
    return false;
  }
}

export function stopTTS() {
  if (!supportsSpeechSynthesis()) return;
  window.speechSynthesis.cancel();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/tts.ts -->
// Lightweight client TTS helper. Uses the Web Speech API where available.
// Provides a best-effort SSML consumer by extracting text and prosody rate.
export function supportsSpeechSynthesis() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function stripTags(ssml: string) {
  // naive: remove SSML tags but keep textual content
  return ssml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function playSSML(
  ssml: string,
  opts: { voiceName?: string; rate?: number } = {},
) {
  if (!supportsSpeechSynthesis()) return false;
  try {
    const text = stripTags(ssml);
    const utter = new SpeechSynthesisUtterance(text);
    if (opts.rate) utter.rate = opts.rate;
    if (opts.voiceName) {
      const voices = window.speechSynthesis.getVoices();
      const v = voices.find((x) => x.name === opts.voiceName);
      if (v) utter.voice = v;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    return true;
  } catch (_e) {
    console.warn("TTS playback failed", _e);
    return false;
  }
}

export function stopTTS() {
  if (!supportsSpeechSynthesis()) return;
  window.speechSynthesis.cancel();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/tts.ts -->
// Lightweight client TTS helper. Uses the Web Speech API where available.
// Provides a best-effort SSML consumer by extracting text and prosody rate.
export function supportsSpeechSynthesis() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function stripTags(ssml: string) {
  // naive: remove SSML tags but keep textual content
  return ssml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function playSSML(
  ssml: string,
  opts: { voiceName?: string; rate?: number } = {},
) {
  if (!supportsSpeechSynthesis()) return false;
  try {
    const text = stripTags(ssml);
    const utter = new SpeechSynthesisUtterance(text);
    if (opts.rate) utter.rate = opts.rate;
    if (opts.voiceName) {
      const voices = window.speechSynthesis.getVoices();
      const v = voices.find((x) => x.name === opts.voiceName);
      if (v) utter.voice = v;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    return true;
  } catch (_e) {
    console.warn("TTS playback failed", _e);
    return false;
  }
}

export function stopTTS() {
  if (!supportsSpeechSynthesis()) return;
  window.speechSynthesis.cancel();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/tts.ts -->
// Lightweight client TTS helper. Uses the Web Speech API where available.
// Provides a best-effort SSML consumer by extracting text and prosody rate.
export function supportsSpeechSynthesis() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function stripTags(ssml: string) {
  // naive: remove SSML tags but keep textual content
  return ssml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function playSSML(
  ssml: string,
  opts: { voiceName?: string; rate?: number } = {},
) {
  if (!supportsSpeechSynthesis()) return false;
  try {
    const text = stripTags(ssml);
    const utter = new SpeechSynthesisUtterance(text);
    if (opts.rate) utter.rate = opts.rate;
    if (opts.voiceName) {
      const voices = window.speechSynthesis.getVoices();
      const v = voices.find((x) => x.name === opts.voiceName);
      if (v) utter.voice = v;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    return true;
  } catch (_e) {
    console.warn("TTS playback failed", _e);
    return false;
  }
}

export function stopTTS() {
  if (!supportsSpeechSynthesis()) return;
  window.speechSynthesis.cancel();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/tts.ts -->
// Lightweight client TTS helper. Uses the Web Speech API where available.
// Provides a best-effort SSML consumer by extracting text and prosody rate.
export function supportsSpeechSynthesis() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function stripTags(ssml: string) {
  // naive: remove SSML tags but keep textual content
  return ssml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function playSSML(
  ssml: string,
  opts: { voiceName?: string; rate?: number } = {},
) {
  if (!supportsSpeechSynthesis()) return false;
  try {
    const text = stripTags(ssml);
    const utter = new SpeechSynthesisUtterance(text);
    if (opts.rate) utter.rate = opts.rate;
    if (opts.voiceName) {
      const voices = window.speechSynthesis.getVoices();
      const v = voices.find((x) => x.name === opts.voiceName);
      if (v) utter.voice = v;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    return true;
  } catch (_e) {
    console.warn("TTS playback failed", _e);
    return false;
  }
}

export function stopTTS() {
  if (!supportsSpeechSynthesis()) return;
  window.speechSynthesis.cancel();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/tts.ts -->
// Lightweight client TTS helper. Uses the Web Speech API where available.
// Provides a best-effort SSML consumer by extracting text and prosody rate.
export function supportsSpeechSynthesis() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function stripTags(ssml: string) {
  // naive: remove SSML tags but keep textual content
  return ssml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function playSSML(
  ssml: string,
  opts: { voiceName?: string; rate?: number } = {},
) {
  if (!supportsSpeechSynthesis()) return false;
  try {
    const text = stripTags(ssml);
    const utter = new SpeechSynthesisUtterance(text);
    if (opts.rate) utter.rate = opts.rate;
    if (opts.voiceName) {
      const voices = window.speechSynthesis.getVoices();
      const v = voices.find((x) => x.name === opts.voiceName);
      if (v) utter.voice = v;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    return true;
  } catch (_e) {
    console.warn("TTS playback failed", _e);
    return false;
  }
}

export function stopTTS() {
  if (!supportsSpeechSynthesis()) return;
  window.speechSynthesis.cancel();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/tts.ts -->
// Lightweight client TTS helper. Uses the Web Speech API where available.
// Provides a best-effort SSML consumer by extracting text and prosody rate.
export function supportsSpeechSynthesis() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function stripTags(ssml: string) {
  // naive: remove SSML tags but keep textual content
  return ssml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function playSSML(
  ssml: string,
  opts: { voiceName?: string; rate?: number } = {},
) {
  if (!supportsSpeechSynthesis()) return false;
  try {
    const text = stripTags(ssml);
    const utter = new SpeechSynthesisUtterance(text);
    if (opts.rate) utter.rate = opts.rate;
    if (opts.voiceName) {
      const voices = window.speechSynthesis.getVoices();
      const v = voices.find((x) => x.name === opts.voiceName);
      if (v) utter.voice = v;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    return true;
  } catch (_e) {
    console.warn("TTS playback failed", _e);
    return false;
  }
}

export function stopTTS() {
  if (!supportsSpeechSynthesis()) return;
  window.speechSynthesis.cancel();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/tts.ts -->
// Lightweight client TTS helper. Uses the Web Speech API where available.
// Provides a best-effort SSML consumer by extracting text and prosody rate.
export function supportsSpeechSynthesis() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function stripTags(ssml: string) {
  // naive: remove SSML tags but keep textual content
  return ssml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function playSSML(
  ssml: string,
  opts: { voiceName?: string; rate?: number } = {},
) {
  if (!supportsSpeechSynthesis()) return false;
  try {
    const text = stripTags(ssml);
    const utter = new SpeechSynthesisUtterance(text);
    if (opts.rate) utter.rate = opts.rate;
    if (opts.voiceName) {
      const voices = window.speechSynthesis.getVoices();
      const v = voices.find((x) => x.name === opts.voiceName);
      if (v) utter.voice = v;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    return true;
  } catch (_e) {
    console.warn("TTS playback failed", _e);
    return false;
  }
}

export function stopTTS() {
  if (!supportsSpeechSynthesis()) return;
  window.speechSynthesis.cancel();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/tts.ts -->
// Lightweight client TTS helper. Uses the Web Speech API where available.
// Provides a best-effort SSML consumer by extracting text and prosody rate.
export function supportsSpeechSynthesis() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function stripTags(ssml: string) {
  // naive: remove SSML tags but keep textual content
  return ssml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function playSSML(
  ssml: string,
  opts: { voiceName?: string; rate?: number } = {},
) {
  if (!supportsSpeechSynthesis()) return false;
  try {
    const text = stripTags(ssml);
    const utter = new SpeechSynthesisUtterance(text);
    if (opts.rate) utter.rate = opts.rate;
    if (opts.voiceName) {
      const voices = window.speechSynthesis.getVoices();
      const v = voices.find((x) => x.name === opts.voiceName);
      if (v) utter.voice = v;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    return true;
  } catch (_e) {
    console.warn("TTS playback failed", _e);
    return false;
  }
}

export function stopTTS() {
  if (!supportsSpeechSynthesis()) return;
  window.speechSynthesis.cancel();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/tts.ts -->
// Lightweight client TTS helper. Uses the Web Speech API where available.
// Provides a best-effort SSML consumer by extracting text and prosody rate.
export function supportsSpeechSynthesis() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function stripTags(ssml: string) {
  // naive: remove SSML tags but keep textual content
  return ssml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function playSSML(
  ssml: string,
  opts: { voiceName?: string; rate?: number } = {},
) {
  if (!supportsSpeechSynthesis()) return false;
  try {
    const text = stripTags(ssml);
    const utter = new SpeechSynthesisUtterance(text);
    if (opts.rate) utter.rate = opts.rate;
    if (opts.voiceName) {
      const voices = window.speechSynthesis.getVoices();
      const v = voices.find((x) => x.name === opts.voiceName);
      if (v) utter.voice = v;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    return true;
  } catch (_e) {
    console.warn("TTS playback failed", _e);
    return false;
  }
}

export function stopTTS() {
  if (!supportsSpeechSynthesis()) return;
  window.speechSynthesis.cancel();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/tts.ts -->
// Lightweight client TTS helper. Uses the Web Speech API where available.
// Provides a best-effort SSML consumer by extracting text and prosody rate.
export function supportsSpeechSynthesis() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function stripTags(ssml: string) {
  // naive: remove SSML tags but keep textual content
  return ssml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function playSSML(
  ssml: string,
  opts: { voiceName?: string; rate?: number } = {},
) {
  if (!supportsSpeechSynthesis()) return false;
  try {
    const text = stripTags(ssml);
    const utter = new SpeechSynthesisUtterance(text);
    if (opts.rate) utter.rate = opts.rate;
    if (opts.voiceName) {
      const voices = window.speechSynthesis.getVoices();
      const v = voices.find((x) => x.name === opts.voiceName);
      if (v) utter.voice = v;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    return true;
  } catch (_e) {
    console.warn("TTS playback failed", _e);
    return false;
  }
}

export function stopTTS() {
  if (!supportsSpeechSynthesis()) return;
  window.speechSynthesis.cancel();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/tts.ts -->
// Lightweight client TTS helper. Uses the Web Speech API where available.
// Provides a best-effort SSML consumer by extracting text and prosody rate.
export function supportsSpeechSynthesis() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function stripTags(ssml: string) {
  // naive: remove SSML tags but keep textual content
  return ssml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function playSSML(
  ssml: string,
  opts: { voiceName?: string; rate?: number } = {},
) {
  if (!supportsSpeechSynthesis()) return false;
  try {
    const text = stripTags(ssml);
    const utter = new SpeechSynthesisUtterance(text);
    if (opts.rate) utter.rate = opts.rate;
    if (opts.voiceName) {
      const voices = window.speechSynthesis.getVoices();
      const v = voices.find((x) => x.name === opts.voiceName);
      if (v) utter.voice = v;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    return true;
  } catch (_e) {
    console.warn("TTS playback failed", _e);
    return false;
  }
}

export function stopTTS() {
  if (!supportsSpeechSynthesis()) return;
  window.speechSynthesis.cancel();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/tts.ts -->
// Lightweight client TTS helper. Uses the Web Speech API where available.
// Provides a best-effort SSML consumer by extracting text and prosody rate.
export function supportsSpeechSynthesis() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function stripTags(ssml: string) {
  // naive: remove SSML tags but keep textual content
  return ssml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function playSSML(
  ssml: string,
  opts: { voiceName?: string; rate?: number } = {},
) {
  if (!supportsSpeechSynthesis()) return false;
  try {
    const text = stripTags(ssml);
    const utter = new SpeechSynthesisUtterance(text);
    if (opts.rate) utter.rate = opts.rate;
    if (opts.voiceName) {
      const voices = window.speechSynthesis.getVoices();
      const v = voices.find((x) => x.name === opts.voiceName);
      if (v) utter.voice = v;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    return true;
  } catch (_e) {
    console.warn("TTS playback failed", _e);
    return false;
  }
}

export function stopTTS() {
  if (!supportsSpeechSynthesis()) return;
  window.speechSynthesis.cancel();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/tts.ts -->
// Lightweight client TTS helper. Uses the Web Speech API where available.
// Provides a best-effort SSML consumer by extracting text and prosody rate.
export function supportsSpeechSynthesis() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function stripTags(ssml: string) {
  // naive: remove SSML tags but keep textual content
  return ssml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function playSSML(
  ssml: string,
  opts: { voiceName?: string; rate?: number } = {},
) {
  if (!supportsSpeechSynthesis()) return false;
  try {
    const text = stripTags(ssml);
    const utter = new SpeechSynthesisUtterance(text);
    if (opts.rate) utter.rate = opts.rate;
    if (opts.voiceName) {
      const voices = window.speechSynthesis.getVoices();
      const v = voices.find((x) => x.name === opts.voiceName);
      if (v) utter.voice = v;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    return true;
  } catch (_e) {
    console.warn("TTS playback failed", _e);
    return false;
  }
}

export function stopTTS() {
  if (!supportsSpeechSynthesis()) return;
  window.speechSynthesis.cancel();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/tts.ts -->
// Lightweight client TTS helper. Uses the Web Speech API where available.
// Provides a best-effort SSML consumer by extracting text and prosody rate.
export function supportsSpeechSynthesis() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function stripTags(ssml: string) {
  // naive: remove SSML tags but keep textual content
  return ssml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function playSSML(
  ssml: string,
  opts: { voiceName?: string; rate?: number } = {},
) {
  if (!supportsSpeechSynthesis()) return false;
  try {
    const text = stripTags(ssml);
    const utter = new SpeechSynthesisUtterance(text);
    if (opts.rate) utter.rate = opts.rate;
    if (opts.voiceName) {
      const voices = window.speechSynthesis.getVoices();
      const v = voices.find((x) => x.name === opts.voiceName);
      if (v) utter.voice = v;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    return true;
  } catch (_e) {
    console.warn("TTS playback failed", _e);
    return false;
  }
}

export function stopTTS() {
  if (!supportsSpeechSynthesis()) return;
  window.speechSynthesis.cancel();
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/services/tts.ts -->
// Lightweight client TTS helper. Uses the Web Speech API where available.
// Provides a best-effort SSML consumer by extracting text and prosody rate.
export function supportsSpeechSynthesis() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function stripTags(ssml: string) {
  // naive: remove SSML tags but keep textual content
  return ssml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function playSSML(
  ssml: string,
  opts: { voiceName?: string; rate?: number } = {},
) {
  if (!supportsSpeechSynthesis()) return false;
  try {
    const text = stripTags(ssml);
    const utter = new SpeechSynthesisUtterance(text);
    if (opts.rate) utter.rate = opts.rate;
    if (opts.voiceName) {
      const voices = window.speechSynthesis.getVoices();
      const v = voices.find((x) => x.name === opts.voiceName);
      if (v) utter.voice = v;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    return true;
  } catch (_e) {
    console.warn("TTS playback failed", _e);
    return false;
  }
}

export function stopTTS() {
  if (!supportsSpeechSynthesis()) return;
  window.speechSynthesis.cancel();
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/services/tts.ts -->
// Lightweight client TTS helper. Uses the Web Speech API where available.
// Provides a best-effort SSML consumer by extracting text and prosody rate.
export function supportsSpeechSynthesis() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function stripTags(ssml: string) {
  // naive: remove SSML tags but keep textual content
  return ssml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function playSSML(
  ssml: string,
  opts: { voiceName?: string; rate?: number } = {},
) {
  if (!supportsSpeechSynthesis()) return false;
  try {
    const text = stripTags(ssml);
    const utter = new SpeechSynthesisUtterance(text);
    if (opts.rate) utter.rate = opts.rate;
    if (opts.voiceName) {
      const voices = window.speechSynthesis.getVoices();
      const v = voices.find((x) => x.name === opts.voiceName);
      if (v) utter.voice = v;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    return true;
  } catch (_e) {
    console.warn("TTS playback failed", _e);
    return false;
  }
}

export function stopTTS() {
  if (!supportsSpeechSynthesis()) return;
  window.speechSynthesis.cancel();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/tts.ts -->
// Lightweight client TTS helper. Uses the Web Speech API where available.
// Provides a best-effort SSML consumer by extracting text and prosody rate.
export function supportsSpeechSynthesis() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function stripTags(ssml: string) {
  // naive: remove SSML tags but keep textual content
  return ssml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function playSSML(
  ssml: string,
  opts: { voiceName?: string; rate?: number } = {},
) {
  if (!supportsSpeechSynthesis()) return false;
  try {
    const text = stripTags(ssml);
    const utter = new SpeechSynthesisUtterance(text);
    if (opts.rate) utter.rate = opts.rate;
    if (opts.voiceName) {
      const voices = window.speechSynthesis.getVoices();
      const v = voices.find((x) => x.name === opts.voiceName);
      if (v) utter.voice = v;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    return true;
  } catch (_e) {
    console.warn("TTS playback failed", _e);
    return false;
  }
}

export function stopTTS() {
  if (!supportsSpeechSynthesis()) return;
  window.speechSynthesis.cancel();
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/services/tts.ts -->
// Lightweight client TTS helper. Uses the Web Speech API where available.
// Provides a best-effort SSML consumer by extracting text and prosody rate.
export function supportsSpeechSynthesis() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function stripTags(ssml: string) {
  // naive: remove SSML tags but keep textual content
  return ssml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function playSSML(
  ssml: string,
  opts: { voiceName?: string; rate?: number } = {},
) {
  if (!supportsSpeechSynthesis()) return false;
  try {
    const text = stripTags(ssml);
    const utter = new SpeechSynthesisUtterance(text);
    if (opts.rate) utter.rate = opts.rate;
    if (opts.voiceName) {
      const voices = window.speechSynthesis.getVoices();
      const v = voices.find((x) => x.name === opts.voiceName);
      if (v) utter.voice = v;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    return true;
  } catch (_e) {
    console.warn("TTS playback failed", _e);
    return false;
  }
}

export function stopTTS() {
  if (!supportsSpeechSynthesis()) return;
  window.speechSynthesis.cancel();
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/services/tts.ts -->
// Lightweight client TTS helper. Uses the Web Speech API where available.
// Provides a best-effort SSML consumer by extracting text and prosody rate.
export function supportsSpeechSynthesis() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function stripTags(ssml: string) {
  // naive: remove SSML tags but keep textual content
  return ssml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function playSSML(
  ssml: string,
  opts: { voiceName?: string; rate?: number } = {},
) {
  if (!supportsSpeechSynthesis()) return false;
  try {
    const text = stripTags(ssml);
    const utter = new SpeechSynthesisUtterance(text);
    if (opts.rate) utter.rate = opts.rate;
    if (opts.voiceName) {
      const voices = window.speechSynthesis.getVoices();
      const v = voices.find((x) => x.name === opts.voiceName);
      if (v) utter.voice = v;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    return true;
  } catch (_e) {
    console.warn("TTS playback failed", _e);
    return false;
  }
}

export function stopTTS() {
  if (!supportsSpeechSynthesis()) return;
  window.speechSynthesis.cancel();
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/services/tts.ts -->
// Lightweight client TTS helper. Uses the Web Speech API where available.
// Provides a best-effort SSML consumer by extracting text and prosody rate.
export function supportsSpeechSynthesis() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function stripTags(ssml: string) {
  // naive: remove SSML tags but keep textual content
  return ssml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function playSSML(
  ssml: string,
  opts: { voiceName?: string; rate?: number } = {},
) {
  if (!supportsSpeechSynthesis()) return false;
  try {
    const text = stripTags(ssml);
    const utter = new SpeechSynthesisUtterance(text);
    if (opts.rate) utter.rate = opts.rate;
    if (opts.voiceName) {
      const voices = window.speechSynthesis.getVoices();
      const v = voices.find((x) => x.name === opts.voiceName);
      if (v) utter.voice = v;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    return true;
  } catch (_e) {
    console.warn("TTS playback failed", _e);
    return false;
  }
}

export function stopTTS() {
  if (!supportsSpeechSynthesis()) return;
  window.speechSynthesis.cancel();
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/services/tts.ts -->
// Lightweight client TTS helper. Uses the Web Speech API where available.
// Provides a best-effort SSML consumer by extracting text and prosody rate.
export function supportsSpeechSynthesis() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function stripTags(ssml: string) {
  // naive: remove SSML tags but keep textual content
  return ssml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function playSSML(
  ssml: string,
  opts: { voiceName?: string; rate?: number } = {},
) {
  if (!supportsSpeechSynthesis()) return false;
  try {
    const text = stripTags(ssml);
    const utter = new SpeechSynthesisUtterance(text);
    if (opts.rate) utter.rate = opts.rate;
    if (opts.voiceName) {
      const voices = window.speechSynthesis.getVoices();
      const v = voices.find((x) => x.name === opts.voiceName);
      if (v) utter.voice = v;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    return true;
  } catch (_e) {
    console.warn("TTS playback failed", _e);
    return false;
  }
}

export function stopTTS() {
  if (!supportsSpeechSynthesis()) return;
  window.speechSynthesis.cancel();
}
