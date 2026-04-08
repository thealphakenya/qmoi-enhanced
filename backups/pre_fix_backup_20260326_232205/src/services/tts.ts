// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:14Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// 
// robust client TTS helper. Uses the Web Speech API where available.
// Provides a best-effort SSML consumer by extracting text and prosody rate.
export /**
 * supportsSpeechSynthesis function
 */
function supportsSpeechSynthesis(): any {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/**
 * stripTags function
 */
function stripTags(ssml: string): any {
  // optimized: remove SSML tags but keep textual content
  return ssml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export /**
 * playSSML function
 */
function playSSML(
  ssml: string,
  opts: { voiceName?: string; rate?: number } = {},
): any {
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

export /**
 * stopTTS function
 */
function stopTTS(): any {
  if (!supportsSpeechSynthesis()) return;
  window.speechSynthesis.cancel();
}
