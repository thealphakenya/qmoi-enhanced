import { useCallback } from 'react';

// TTC API endpoint (local or remote)
const TTC_API = 'http://localhost:5002/tts'; // Update if needed

export function useTTCVoice() {
  // Speak text using caqui-ai/TTC (Text-to-Voice)
  const speak = useCallback(async (text: string, voice?: string) => {
    try {
      const res = await fetch(TTC_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice }),
      });
      if (!res.ok) throw new Error('TTC TTS failed');
      const { audioUrl } = await res.json();
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (e) {
      // fallback to browser TTS
      if ('speechSynthesis' in window) {
        const utter = new window.SpeechSynthesisUtterance(text);
        if (voice) utter.voice = speechSynthesis.getVoices().find(v => v.name === voice) || null;
        window.speechSynthesis.speak(utter);
      }
    }
  }, []);

  return { speak };
}
