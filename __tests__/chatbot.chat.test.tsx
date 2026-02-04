import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Chatbot from "../components/Chatbot";

// Mock MasterContext to be non-master for test
jest.mock("../components/MasterContext", () => ({
  useMaster: () => ({ isMaster: false }),
}));

describe("Chatbot integration (API proxy)", () => {
  const originalFetch = global.fetch;
  const origSpeech = (global as any).speechSynthesis;
  const origSpeechUtter = (global as any).SpeechSynthesisUtterance;

  beforeAll(() => {
    Element.prototype.scrollIntoView = jest.fn();
  });
  afterAll(() => {
    // @ts-expect-error - Intentionally deleting prototype property
    delete Element.prototype.scrollIntoView;
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

    (global as any).speechSynthesis = {
      speak: jest.fn(),
      cancel: jest.fn(),
    };

    // JSDOM doesn't implement SpeechSynthesisUtterance; mock it so construction succeeds
    const SpeechSynthesisUtteranceMock = jest.fn().mockImplementation(function (
      text: string,
    ) {
      // @ts-expect-error - Setting mock properties
      this.text = text;
      // @ts-expect-error - Setting mock properties
      this.onend = undefined;
      // @ts-expect-error - Setting mock properties
      this.onerror = undefined;
    });
    (global as any).SpeechSynthesisUtterance =
      SpeechSynthesisUtteranceMock as any;
    // expose the mock for assertions in tests
    (global as any).__SpeechSynthesisUtteranceMock =
      SpeechSynthesisUtteranceMock;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    (global as any).speechSynthesis = origSpeech;
    (global as any).SpeechSynthesisUtterance = origSpeechUtter;
    (global as any).__SpeechSynthesisUtteranceMock = undefined;
    jest.resetAllMocks();
  });

  test("sends message to /api/qmoi/chat and renders reply and calls TTS when enabled", async () => {
    const setChatHistory = jest.fn();
    render(<Chatbot chatHistory={[]} setChatHistory={setChatHistory} />);

    // enable speech
    const btn = screen.getByRole("button", { name: /🔊/i });
    fireEvent.click(btn);

    const input = screen.getByPlaceholderText(/Type your message/i);
    fireEvent.change(input, { target: { value: "Hello qmoi" } });
    const submitBtn = screen.getByRole("button", { name: /Send/i });
    fireEvent.click(submitBtn);

    // Wait for fetch to be called and setChatHistory to be invoked with an AI reply
    await waitFor(() => expect(global.fetch).toHaveBeenCalled(), {
      timeout: 3000,
    });

    // Wait for speakText to be called (which happens after fetch completes and response is processed)
    await waitFor(
      () => {
        expect((global as any).speechSynthesis.speak).toHaveBeenCalled();
      },
      { timeout: 3000 },
    );

    // The Chatbot should call the provided setChatHistory to append AI reply
    expect(setChatHistory).toHaveBeenCalled();

    // And ensure SpeechSynthesisUtterance constructor was used
    expect((global as any).__SpeechSynthesisUtteranceMock).toHaveBeenCalled();
  });
});
