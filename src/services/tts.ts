// Lightweight client TTS helper. Uses the Web Speech API where available.
// Provides a best-effort SSML consumer by extracting text and prosody rate.
export function supportsSpeechSynthesis(): boolean {
  return (
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    !!window.speechSynthesis
  );
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
  opts: { voiceName?: string; rate?: number } = {}
): boolean {
  if (!supportsSpeechSynthesis()) return false;
  try {
    const text = stripTags(ssml);
    const utter = new SpeechSynthesisUtterance(text);

    if (opts.rate !== undefined) utter.rate = opts.rate as number;

    if (opts.voiceName) {
      const voices = window.speechSynthesis.getVoices();
      const v = voices.find((x) => x.name === opts.voiceName);
      if (v) utter.voice = v;
      else if (typeof window.speechSynthesis.addEventListener === "function") {
        // voice list can be populated asynchronously; attempt a one-time listener
        const onVoices = () => {
          try {
            const later = window.speechSynthesis.getVoices();
            const found = later.find((x) => x.name === opts.voiceName);
            if (found) utter.voice = found;
          } finally {
            window.speechSynthesis.removeEventListener(
              "voiceschanged",
              onVoices
            );
          }
        };
        window.speechSynthesis.addEventListener("voiceschanged", onVoices);
      }
    }

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    return true;
  } catch (e: unknown) {
    console.warn("TTS playback failed", e);
    return false;
  }
}

export function stopTTS(): void {
  if (!supportsSpeechSynthesis()) return;
  window.speechSynthesis.cancel();
}
