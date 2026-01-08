import { playSSML, supportsSpeechSynthesis } from "../tts";

describe("TTS service", () => {
  beforeEach(() => {
    // Ensure a clean jsdom window for each test
    // @ts-expect-error - test environment manipulation
    delete (global as any).window.speechSynthesis; // clear any previous mock
  });

  test("supportsSpeechSynthesis returns false when not available", () => {
    // @ts-ignore
    delete (global as any).window;
    expect(supportsSpeechSynthesis()).toBe(false);
  });

  test("supportsSpeechSynthesis returns true when available", () => {
    // set up a minimal speechSynthesis
    // @ts-expect-error - test environment manipulation
    global.window = Object.create(window);
    // @ts-expect-error - test environment manipulation
    global.window.speechSynthesis = {
      getVoices: () => [],
      cancel: () => {},
      speak: () => {},
    };
    expect(supportsSpeechSynthesis()).toBe(true);
  });

  test("playSSML returns false when speechSynthesis not available", () => {
    // @ts-expect-error - test environment manipulation
    delete (global as any).window;
    expect(playSSML("<speak>Hello</speak>")).toBe(false);
  });

  test("playSSML calls speak with stripped text and sets rate and voice when available", () => {
    const speakMock = jest.fn();
    const getVoicesMock = jest.fn(() => [{ name: "TestVoice" }]);
    const addEventListenerMock = jest.fn();
    const removeEventListenerMock = jest.fn();

    // @ts-expect-error - test environment manipulation
    global.window = Object.create(window);
    // @ts-expect-error - test environment manipulation
    global.window.speechSynthesis = {
      getVoices: getVoicesMock,
      cancel: jest.fn(),
      speak: speakMock,
      addEventListener: addEventListenerMock,
      removeEventListener: removeEventListenerMock,
    };
    // JSDOM doesn't have SpeechSynthesisUtterance, polyfill a minimal constructor
    // @ts-expect-error - test environment manipulation
    global.SpeechSynthesisUtterance = function (text: string) {
      this.text = text;
      this.rate = undefined;
      this.voice = undefined;
    } as any;
    const ok = playSSML("<speak>Hello <break/>world</speak>", {
      voiceName: "TestVoice",
      rate: 0,
    });
    expect(ok).toBe(true);
    expect(speakMock).toHaveBeenCalled();
    const utter = speakMock.mock.calls[0][0];
    expect(utter.text).toBe("Hello world");
    expect(utter.rate).toBe(0);
    // voice set to the voice object we provided
    expect(utter.voice && utter.voice.name).toBe("TestVoice");
  });
});
