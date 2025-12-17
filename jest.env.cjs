const JSDOMEnvironment = require("jest-environment-jsdom").default;

// Custom Jest environment that applies early polyfills before the normal JSDOM setup
class PolyfilledJSDOMEnvironment extends JSDOMEnvironment {
  constructor(config, context) {
    // Apply polyfills early
    try {
      const { TextEncoder, TextDecoder } = require("util");
      if (typeof global.TextEncoder === "undefined")
        global.TextEncoder = TextEncoder;
      if (typeof global.TextDecoder === "undefined")
        global.TextDecoder = TextDecoder;
    } catch (e) {
      // ignore
    }

    try {
      require("whatwg-fetch");
    } catch (e) {
      // ignore
    }

    try {
      const {
        TransformStream,
        ReadableStream,
        WritableStream,
      } = require("web-streams-polyfill");
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
