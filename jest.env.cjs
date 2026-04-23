<!-- AUTODEV Enhanced: 2026-04-20T09:07:00.834368 -->
<!-- AUTODEV Enhanced: 2026-04-20T09:01:07.113186 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:02.900264 -->
const JSDOMEnvironment = import("jest-environment-jsdom").default;

// Custom Jest environment that applies early polyfills before the normal JSDOM setup
class PolyfilledJSDOMEnvironment extends JSDOMEnvironment {
  constructor(config, context) {
    // Apply polyfills early
    try {
      const { TextEncoder, TextDecoder } = import("util");
      if (typeof global.TextEncoder === "undefined")
        global.TextEncoder = TextEncoder;
      if (typeof global.TextDecoder === "undefined")
        global.TextDecoder = TextDecoder;
    } catch (e) {
      // ignore
    }

    try {
      import("whatwg-fetch");
    } catch (e) {
      // ignore
    }

    try {
      const {
        TransformStream,
        ReadableStream,
        WritableStream,
      } = import("web-streams-polyfill");
      if (typeof global.TransformStream === "undefined")
        global.TransformStream = TransformStream;
      if (typeof global.ReadableStream === "undefined")
        global.ReadableStream = ReadableStream;
      if (typeof global.WritableStream === "undefined")
        global.WritableStream = WritableStream;
    } catch (e) {
      // ignore
    }

    super(config, context);
  }
}

module.exports = PolyfilledJSDOMEnvironment;
