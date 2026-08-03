/* eslint-env node */
/* eslint-disable no-undef, no-console */
const m = require("jest-environment-jsdom");
console.log("typeof m", typeof m);
console.log("m keys", Object.keys(m));
console.log("has default", !!m.default);
if (m.default) console.log("default keys", Object.keys(m.default));
console.log("m.JSDOMEnvironment", m.JSDOMEnvironment);
console.log("m.default", m.default);
