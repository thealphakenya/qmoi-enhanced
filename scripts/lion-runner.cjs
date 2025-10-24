#!/usr/bin/env node
// Minimal Lion runner: executes a small subset for examples/tests.
// Ensure lion directories exist before running (idempotent).
try {
  require('./lion-ensure-dirs.cjs');
} catch (e) {
  // non-fatal: continue if ensure script cannot be loaded
}
const { execSync } = require('child_process');
const fs = require('fs');
const CryptoJS = require('crypto-js');
const track = require('./track.cjs');

function runPlan(planText) {
  // naive parser: supports `print:`, `run:`, `calc:`, `encrypt:`, `decrypt:`, `parallel:`, `dns:`
  const out = [];
  planText.split(/\r?\n/).forEach(raw => {
    const line = raw.trim();
    if (!line) return;
    if (line.startsWith('print:')) {
      const msg = line.slice('print:'.length).trim();
      out.push(msg);
      try { track.writeTrack('lion-runner','info','print', { text: msg }); } catch(e){}
    } else if (line.startsWith('run:')) {
      const cmd = line.slice('run:'.length).trim().replace(/^shell\("|"\)$/g, '');
      try {
        const res = execSync(cmd, { encoding: 'utf8' }).trim();
        out.push(res);
        try { track.writeTrack('lion-runner','info','run', { cmd, result: res }); } catch(e){}
      } catch (e) {
        out.push(`ERR:${e.message}`);
        try { track.writeTrack('lion-runner','error','run-error', { cmd, error: e.message }); } catch(e){}
      }
    } else if (line.startsWith('calc:')) {
      const expr = line.slice('calc:'.length).trim();
      try { // only for trusted examples
        // eslint-disable-next-line no-eval
        const val = eval(expr);
        out.push(String(val));
        try { track.writeTrack('lion-runner','info','calc', { expr, result: val }); } catch(e){}
      } catch (e) {
        out.push('ERR');
        try { track.writeTrack('lion-runner','error','calc-error', { expr, error: e.message }); } catch(e){}
      }
    } else if (line.startsWith('encrypt:')) {
      // format: encrypt: AES("key","plaintext")
      const m = /AES\("([^"]+)","([\s\S]*)"\)/.exec(line.slice('encrypt:'.length));
      if (m) {
        const key = m[1];
        const plaintext = m[2];
        try {
          const cipher = CryptoJS.AES.encrypt(plaintext, key).toString();
          out.push(cipher);
          try { track.writeTrack('lion-runner','info','encrypt', { keyLen: key.length, cipherLen: cipher.length }); } catch(e){}
        } catch (e) { out.push('ERR:encrypt'); }
      } else out.push('ERR:encrypt-format');
    } else if (line.startsWith('decrypt:')) {
      // format: decrypt: AES("key","ciphertext")
      const m = /AES\("([^"]+)","([\s\S]*)"\)/.exec(line.slice('decrypt:'.length));
      if (m) {
        const key = m[1];
        const cipher = m[2];
        try {
          const bytes = CryptoJS.AES.decrypt(cipher, key);
          const text = bytes.toString(CryptoJS.enc.Utf8);
          out.push(text);
          try { track.writeTrack('lion-runner','info','decrypt', { keyLen: key.length, textLen: (text||'').length }); } catch(e){}
        } catch (e) { out.push('ERR:decrypt'); }
      } else out.push('ERR:decrypt-format');
    } else if (line.startsWith('parallel:')) {
      // format: parallel: file1.li,file2.li
      const list = line.slice('parallel:'.length).trim().split(',').map(s => s.trim()).filter(Boolean);
      list.forEach(f => {
        try {
          const txt = fs.readFileSync(f, 'utf8');
          out.push(`--- parallel:${f}`);
          const sub = runPlan(txt);
          out.push(...sub);
          out.push(`--- end:${f}`);
        } catch (e) { out.push(`ERR:${e.message}`); try { track.writeTrack('lion-runner','error','parallel-error',{file:f,error:e.message}); } catch(e){} }
      });
    } else if (line.startsWith('dns:')) {
      // lightweight DNS helper simulation
      const cmd = line.slice('dns:'.length).trim();
      out.push(`dns:${cmd}`);
      try { track.writeTrack('lion-runner','info','dns', { cmd }); } catch(e){}
    } else {
      out.push(`UNKNOWN:${line}`);
      try { track.writeTrack('lion-runner','warn','unknown-line', { line }); } catch(e){}
    }
  });
  return out;
}

if (require.main === module) {
  const fs = require('fs');
  const file = process.argv[2];
  if (!file) {
    console.error('Usage: node lion-runner.cjs <file.li>');
    process.exit(2);
  }
  const txt = fs.readFileSync(file, 'utf8');
  const lines = runPlan(txt);
  lines.forEach(l => console.log(l));
}

module.exports = { runPlan };
