"use client";

import React, { useEffect, useRef, useState } from 'react';

type TranscriptSegment = { text: string; confidence?: number; lang?: string };

export default function AudioMonitor() {
  const waveformRef = useRef<HTMLCanvasElement | null>(null);
  const spectrumRef = useRef<HTMLCanvasElement | null>(null);
  const aiWaveRef = useRef<HTMLCanvasElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const [listening, setListening] = useState(false);
  const [volume, setVolume] = useState(0);
  const [peakVolume, setPeakVolume] = useState(0);
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([]);
  const [language, setLanguage] = useState('auto');
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const [detectedIntent, setDetectedIntent] = useState<string | null>(null);
  const [processingSteps, setProcessingSteps] = useState<string[]>([]);
  const [speakingText, setSpeakingText] = useState('');

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close().catch(() => {});
    };
  }, []);

  async function startCapture() {
    if (listening) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      const audioCtx = new AudioContext();
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      sourceRef.current = source;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;
      const gain = audioCtx.createGain();
      source.connect(gain);
      gain.connect(analyser);

      setListening(true);
      drawLoop();
      startTranscription(stream);
    } catch (err) {
      console.error('Microphone error', err);
    }
  }

  function stopCapture() {
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    setListening(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }

  function drawLoop() {
    const analyser = analyserRef.current;
    const waveformEl = waveformRef.current;
    const spectrumEl = spectrumRef.current;
    if (!analyser || !waveformEl || !spectrumEl) {
      rafRef.current = requestAnimationFrame(drawLoop);
      return;
    }

    const bufferLength = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);
    const freqData = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteTimeDomainData(dataArray);
    analyser.getByteFrequencyData(freqData);

    // waveform
    const wfCtx = waveformEl.getContext('2d');
    if (wfCtx) {
      const { width, height } = waveformEl;
      wfCtx.clearRect(0, 0, width, height);
      wfCtx.fillStyle = '#041022';
      wfCtx.fillRect(0, 0, width, height);
      wfCtx.lineWidth = 2;
      wfCtx.strokeStyle = '#3fb1ff';
      wfCtx.beginPath();
      const sliceWidth = (width * 1.0) / bufferLength;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * height) / 2;
        if (i === 0) wfCtx.moveTo(x, y);
        else wfCtx.lineTo(x, y);
        x += sliceWidth;
      }
      wfCtx.stroke();
    }

    // spectrum
    const spCtx = spectrumEl.getContext('2d');
    if (spCtx) {
      const { width, height } = spectrumEl;
      spCtx.clearRect(0, 0, width, height);
      const barWidth = (width / freqData.length) * 2.5;
      let x = 0;
      for (let i = 0; i < freqData.length; i++) {
        const v = freqData[i] / 255.0;
        const y = v * height;
        const hue = Math.round((i / freqData.length) * 240);
        spCtx.fillStyle = `hsl(${240 - hue}, 90%, ${20 + v * 50}%)`;
        spCtx.fillRect(x, height - y, barWidth, y);
        x += barWidth + 1;
      }
    }

    // volume estimation
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const d = dataArray[i] - 128;
      sum += d * d;
    }
    const rms = Math.sqrt(sum / dataArray.length);
    const newVol = Math.min(1, rms / 64);
    setVolume(newVol);
    if (newVol > peakVolume) setPeakVolume(newVol);

    rafRef.current = requestAnimationFrame(drawLoop);
  }

  // Lightweight SpeechRecognition integration (graceful fallback)
  function startTranscription(stream: MediaStream) {
    const SpeechRecognition: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      // no builtin speech recognition — add placeholder
      setTranscript((t) => [...t, { text: 'SpeechRecognition not available in this browser', confidence: 0 }]);
      return;
    }
    const recognizer = new SpeechRecognition();
    recognizer.lang = language === 'auto' ? 'en-US' : language;
    recognizer.interimResults = true;
    recognizer.continuous = true;
    recognizer.onresult = (ev: any) => {
      const results = ev.results;
      const last = results[results.length - 1];
      const text = last[0].transcript;
      const conf = last[0].confidence;
      setDetectedLanguage(recognizer.lang || null);
      setTranscript((t) => [...t.slice(-50), { text, confidence: conf, lang: recognizer.lang }]);
      // simple intent detection heuristic
      if (/weather|forecast|temperature/i.test(text)) setDetectedIntent('Weather Query');
      else if (/play|pause|stop|next|previous/i.test(text)) setDetectedIntent('Playback Command');
      else setDetectedIntent(null);
    };
    recognizer.onerror = (err: any) => {
      console.warn('SpeechRecognition error', err);
    };
    try {
      recognizer.start();
    } catch (e) {}
  }

  // Simple TTS demonstration with visualization
  function speakSample(text: string) {
    if (!('speechSynthesis' in window)) return;
    setSpeakingText(text);
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1.0;
    utter.onend = () => setSpeakingText('');
    (window as any).speechSynthesis.speak(utter);
  }

  // Small UI render
  return (
    <div className="qmoi-audio-monitor grid gap-4 p-4" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gridAutoRows: 'minmax(200px, auto)' }}>
      <div style={{ gridColumn: '1 / span 1' }}>
        <section className="rounded-lg border p-3" style={{ background: '#071228', borderColor: '#183048' }}>
          <h3 className="text-white">Hearing Panel</h3>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <div style={{ flex: 1 }}>
              <canvas ref={waveformRef} width={800} height={120} style={{ width: '100%', height: 120, borderRadius: 6, background: '#041022' }} />
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <canvas ref={spectrumRef} width={800} height={80} style={{ width: '70%', height: 80, borderRadius: 6 }} />
                <div style={{ width: '30%', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ color: '#cfefff' }}>Volume: {(volume * 100).toFixed(0)}%</div>
                  <div style={{ background: '#0b1320', borderRadius: 6, height: 12 }}>
                    <div style={{ width: `${Math.round(volume * 100)}%`, height: '100%', background: '#3fb1ff', borderRadius: 6 }} />
                  </div>
                  <div style={{ color: '#cfefff' }}>Peak: {(peakVolume * 100).toFixed(0)}%</div>
                  <div style={{ color: '#cfefff' }}>Language: {detectedLanguage || '—'}</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={{ color: '#9fbfdf', fontSize: 13 }}>Live transcription</div>
            <div style={{ marginTop: 6, maxHeight: 140, overflow: 'auto', background: '#021018', padding: 8, borderRadius: 8 }}>
              {transcript.length === 0 ? <div style={{ color: '#6f8ea3' }}>No speech detected yet.</div> : transcript.slice().reverse().map((s, i) => (
                <div key={i} style={{ color: '#e6f7ff', padding: '4px 0' }}>{s.text} <span style={{ color: '#9fbfdf', fontSize: 12 }}>({Math.round((s.confidence || 0) * 100)}%)</span></div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <button onClick={startCapture} disabled={listening} className="rounded px-3 py-2" style={{ background: '#0f1724', color: '#dff4ff' }}>Start</button>
            <button onClick={stopCapture} disabled={!listening} className="rounded px-3 py-2" style={{ background: '#0f1724', color: '#dff4ff' }}>Stop</button>
            <button onClick={() => speakSample('This is a QMOI audio monitor test.')} className="rounded px-3 py-2" style={{ background: '#093243', color: '#dff4ff' }}>Speak Sample</button>
          </div>
        </section>

        <section className="rounded-lg border p-3 mt-4" style={{ background: '#071228', borderColor: '#183048' }}>
          <h3 className="text-white">Understanding Panel</h3>
          <div style={{ marginTop: 8 }}>
            <div style={{ color: '#cfefff' }}>Intent: <strong>{detectedIntent || '—'}</strong></div>
            <div style={{ color: '#9fbfdf', marginTop: 6 }}>Entities / Keywords:</div>
            <div style={{ marginTop: 6, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {/* Example keywords */}
              <span style={{ background: '#0f2130', color: '#9fd6ff', padding: '6px 8px', borderRadius: 6 }}>Nairobi</span>
              <span style={{ background: '#0f2130', color: '#9fd6ff', padding: '6px 8px', borderRadius: 6 }}>Weather</span>
              <span style={{ background: '#0f2130', color: '#9fd6ff', padding: '6px 8px', borderRadius: 6 }}>Tomorrow</span>
            </div>
            <div style={{ marginTop: 10, color: '#9fbfdf' }}>Confidence: {transcript.length ? `${Math.round((transcript[transcript.length - 1].confidence || 0) * 100)}%` : '—'}</div>
          </div>
        </section>

        <section className="rounded-lg border p-3 mt-4" style={{ background: '#071228', borderColor: '#183048' }}>
          <h3 className="text-white">Thinking & Processing</h3>
          <div style={{ marginTop: 8 }}>
            <div style={{ color: '#cfefff' }}>Pipeline</div>
            <ul style={{ marginTop: 8, color: '#9fbfdf' }}>
              <li>Speech Recognition {processingSteps.includes('sr') ? '✓' : '⟳'}</li>
              <li>Intent Detection {processingSteps.includes('intent') ? '✓' : '⟳'}</li>
              <li>Knowledge Lookup {processingSteps.includes('lookup') ? '✓' : '⟳'}</li>
              <li>Response Generation {processingSteps.includes('response') ? '✓' : '⟳'}</li>
            </ul>
            <div style={{ marginTop: 12 }}>
              <div style={{ color: '#9fbfdf' }}>Processing timeline</div>
              <div style={{ height: 8, background: '#031217', borderRadius: 6, overflow: 'hidden', marginTop: 8 }}>
                <div style={{ width: '40%', height: '100%', background: '#7dd3fc' }} />
              </div>
            </div>
          </div>
        </section>
      </div>

      <aside style={{ gridColumn: '2 / span 1' }}>
        <section className="rounded-lg border p-3" style={{ background: '#071228', borderColor: '#183048' }}>
          <h3 className="text-white">Speaking Panel</h3>
          <canvas ref={aiWaveRef} width={360} height={120} style={{ width: '100%', height: 120, borderRadius: 6, background: '#031017', marginTop: 8 }} />
          <div style={{ marginTop: 8, color: '#cfefff' }}>Voice: <strong>QMOI Assistant</strong></div>
          <div style={{ marginTop: 8, color: '#9fbfdf' }}>Now speaking: <span style={{ color: '#e6f7ff' }}>{speakingText || '—'}</span></div>
          <div style={{ marginTop: 8 }}>
            <div style={{ color: '#9fbfdf' }}>Output volume</div>
            <div style={{ height: 12, background: '#021018', borderRadius: 6, marginTop: 6 }}>
              <div style={{ width: `${Math.round((volume || 0) * 100)}%`, height: '100%', background: '#34d399' }} />
            </div>
          </div>
          <div style={{ marginTop: 10 }}>
            <button onClick={() => speakSample('Hello — this is the QMOI assistant speaking.')} className="rounded px-3 py-2" style={{ background: '#0f1724', color: '#dff4ff' }}>Speak Test</button>
          </div>
        </section>

        <section className="rounded-lg border p-3 mt-4" style={{ background: '#071228', borderColor: '#183048' }}>
          <h3 className="text-white">Audio Analytics</h3>
          <div style={{ marginTop: 8, color: '#cfefff' }}>Mic volume: {(volume * 100).toFixed(0)}%</div>
          <div style={{ marginTop: 6, color: '#cfefff' }}>Peak mic: {(peakVolume * 100).toFixed(0)}%</div>
          <div style={{ marginTop: 6, color: '#cfefff' }}>Latency: <span style={{ color: '#9fbfdf' }}>~{Math.round((audioCtxRef.current?.baseLatency || 0) * 1000)} ms</span></div>
          <div style={{ marginTop: 8 }}>
            <div style={{ color: '#9fbfdf' }}>Diagnostics</div>
            <ul style={{ marginTop: 6, color: '#9fbfdf' }}>
              <li>Noise suppression: enabled</li>
              <li>Echo cancellation: enabled</li>
              <li>Speech model: browser-native (best-effort)</li>
            </ul>
          </div>
        </section>
      </aside>
    </div>
  );
}
