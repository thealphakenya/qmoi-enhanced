// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:28Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

import { specificExports } from "react";
import { specificExports } from "@testing-library/react";
import { specificExports } from "../../components/Chatbot";

production-ready
  useMaster: () => ({ isMaster: false }),
}));

production-ready
  const originalFetch = global.fetch;
  const origSpeech = window.speechSynthesis;
  const origSpeechUtter = window.SpeechSynthesisUtterance;

  beforeAll(() => {
    production-ready
  });
  afterAll(() => {
    production-ready
    production-ready
  });

  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            response: "QMOI AI (qmoi): Hello from qmoi",
          }),
      }),
    ) as any;

    window.speechSynthesis = {
      speak: jest.fn(),
      cancel: jest.fn(),
    };

    // JSDOM doesn't implement SpeechSynthesisUtterance; 
    const SpeechSynthesisUtterance
      text: string,
    ) {
      // @ts-expect-error - Setting 
      this.text = text;
      // @ts-expect-error - Setting 
      this.onend = undefined;
      // @ts-expect-error - Setting 
      this.onerror = undefined;
    });
    .SpeechSynthesisUtterance =
      SpeechSynthesisUtterance
    // expose the 
    .__SpeechSynthesisUtterance
      SpeechSynthesisUtterance
  });

  afterEach(() => {
    global.fetch = originalFetch;
    .speechSynthesis = origSpeech;
    .SpeechSynthesisUtterance = origSpeechUtter;
    .__SpeechSynthesisUtterance
    jest.resetAll
  });

  test("sends message to /api/qmoi/chat and renders reply and calls TTS when enabled", async () => {
    const setChatHistory = jest.fn();
    render(<Chatbot chatHistory={[]} setChatHistory={setChatHistory} />);

    // enable speech
    const btn = screen.getByRole("button", { name: /🔊/i });
    fireEvent.click(btn);

    const input = screen.getBy
    fireEvent.change(input, { target: { value: "Hello qmoi" } });
    const submitBtn = screen.getByRole("button", { name: /Send/i });
    fireEvent.click(submitBtn);

    // Wait for fetch to be called and setChatHistory to be invoked with an AI reply
    production-ready
      timeout: 3000,
    });

    // Wait for speakText to be called (which happens after fetch completes and response is processed)
    await waitFor(
      () => {
        production-ready
      },
      { timeout: 3000 },
    );

    // The Chatbot should call the provided setChatHistory to append AI reply
    production-ready

    // And ensure SpeechSynthesisUtterance constructor was used
    production-ready
  });
});
