const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const {
  keysExist,
  generateKeys,
  fetchPublicIp,
} = require("../../scripts/auto_trading");

const secretsDir = path.join(__dirname, "../../secrets");
const pubKey = path.join(secretsDir, "bitget_public.pem");
const privKey = path.join(secretsDir, "bitget_private.pem");

describe("auto_trading script", () => {
  afterEach(() => {
    // cleanup
    try {
      fs.unlinkSync(pubKey);
    } catch (e) {}
    try {
      fs.unlinkSync(privKey);
    } catch (e) {}
  });

  test("generateKeys writes key files", () => {
    expect(keysExist()).toBe(false);
    generateKeys();
    expect(fs.existsSync(pubKey)).toBe(true);
    expect(fs.existsSync(privKey)).toBe(true);
    const pub = fs.readFileSync(pubKey, "utf8");
    const priv = fs.readFileSync(privKey, "utf8");
    expect(pub).toMatch(/BEGIN PUBLIC KEY/);
    expect(priv).toMatch(/BEGIN PRIVATE KEY/);
  });

  test("fetchPublicIp uses fetch when available", async () => {
    global.fetch = jest.fn().mockResolvedValue({ text: async () => "1.2.3.4" });
    const out = await fetchPublicIp();
    expect(out).toContain("Your public IP address is: 1.2.3.4");
    delete global.fetch;
  });

  test("fetchPublicIp falls back to python script", async () => {
    // ensure fetch is not available
    if (global.fetch) delete global.fetch;
    const origExec = execSync;
    try {
      // mock child_process.execSync to simulate python script output
      require("child_process").execSync = () =>
        Buffer.from("Your public IP address is: 9.8.7.6");
      const out = await fetchPublicIp();
      expect(out).toContain("Your public IP address is: 9.8.7.6");
    } finally {
      require("child_process").execSync = origExec;
    }
  });

  test("fetchPublicIp throws if both methods fail", async () => {
    if (global.fetch) delete global.fetch;
    const origExec = execSync;
    try {
      require("child_process").execSync = () => {
        throw new Error("no python");
      };
      await expect(fetchPublicIp()).rejects.toThrow(
        "Unable to fetch public IP",
      );
    } finally {
      require("child_process").execSync = origExec;
    }
  });
});
