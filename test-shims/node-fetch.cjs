// Minimal CommonJS shim for node-fetch used during tests.
// Exports a default fetch placeholder (will often be mocked by tests)
// and a lightweight Response class implementing .json().

function fetch() {
  // Default placeholder - tests will usually mock this with jest.fn()
  throw new Error('Default test-shim fetch should be mocked in tests');
}

class Response {
  constructor(body, init = {}) {
    this._body = body;
    this.status = init.status || 200;
    this.statusText = init.statusText || '';
    this.headers = init.headers || {};
    this.ok = this.status >= 200 && this.status < 300;
  }

  async json() {
    if (typeof this._body === 'string') {
      try {
        return JSON.parse(this._body);
      } catch (e) {
        return this._body;
      }
    }
    return this._body;
  }

  async text() {
    if (typeof this._body === 'string') return this._body;
    return JSON.stringify(this._body);
  }
}

module.exports = fetch;
module.exports.default = fetch;
module.exports.Response = Response;
