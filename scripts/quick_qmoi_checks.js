/* global fetch */
import fs from 'fs';
import path from 'path';

const UI_BASE = process.env.QMOI_UI_BASE || 'http://127.0.0.1:3001';
const HELPER_BASE = process.env.QMOI_TEST_BASE || 'http://127.0.0.1:8080';

async function fetchJson(url, opts) {
  const res = await fetch(url, opts);
  const txt = await res.text();
  try { return JSON.parse(txt); } catch { return txt; }
}

async function run() {
  console.log('Checking helper /health...');
  try {
    const h = await fetchJson(`${HELPER_BASE}/health`);
    if (h.status !== 'ok') throw new Error('health not ok');
    console.log('helper health ok');
  } catch (e) {
    console.error('helper health failed', e);
    process.exitCode = 2; return;
  }

  console.log('Checking /v1/chat/completions greeting...');
  try {
    const r = await fetchJson(`${HELPER_BASE}/v1/chat/completions`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [{role:'user', content:'How are you'}] }) });
    const content = r.choices?.[0]?.message?.content || r.choices?.[0]?.text || '';
    if (!content || !(/How are you|I'm doing well|How can I help/.test(content))) throw new Error('unexpected greeting reply: '+String(content).slice(0,120));
    console.log('helper greeting ok');
  } catch (e) {
    console.error('helper greeting check failed', e);
    process.exitCode = 2; return;
  }

  console.log('Checking UI proxy /api/qmoi/chat...');
  try {
    const r = await fetchJson(`${UI_BASE}/api/qmoi/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [{role:'user', content:'How are you'}] }) });
    const content = r.choices?.[0]?.message?.content || '';
    if (!content) throw new Error('empty content from UI proxy');
    console.log('UI proxy returns content');
  } catch (e) {
    console.error('UI proxy check failed', e);
    process.exitCode = 2; return;
  }

  console.log('Checking file creation intent...');
  // Helper may create file in repo base or strip directories; accept either location
  const candidate1 = path.join('tests', 'quick_tmp_file.txt');
  const candidate2 = path.join('quick_tmp_file.txt');
  try {
    [candidate1, candidate2].forEach((p)=>{ if (fs.existsSync(p)) fs.unlinkSync(p); });
    const payload = { messages: [{ role: 'user', content: `Create a file named ${candidate1} with the content 'quick-test'` }] };
    const r = await fetchJson(`${HELPER_BASE}/v1/chat/completions`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const content = r.choices?.[0]?.message?.content || '';
    if (!content.includes('[Action]') && !content.includes('created')) throw new Error('no action result in reply');
    // Check either candidate
    const found = fs.existsSync(candidate1) || fs.existsSync(candidate2);
    if (!found) throw new Error('expected file not created: '+candidate1+' or '+candidate2);
    const foundPath = fs.existsSync(candidate1) ? candidate1 : candidate2;
    const data = fs.readFileSync(foundPath, 'utf8');
    if (!data.includes('quick-test') && !data.includes('Created by qmoi agent')) throw new Error('file content unexpected');
    fs.unlinkSync(foundPath);
    console.log('file creation intent ok');
  } catch (e) {
    console.error('file creation check failed', e);
    process.exitCode = 2; return;
  }

  console.log('Checking memory/recall behavior...');
  try {
    const msg = 'I like strawberries';
    await fetchJson(`${HELPER_BASE}/v1/chat/completions`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [{role:'user', content:msg}] }) });
    const recall = await fetchJson(`${HELPER_BASE}/v1/chat/completions`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [{role:'user', content:'What did I say earlier?'}] }) });
    const rc = recall.choices?.[0]?.message?.content || '';
    if (!/strawberries|strawb/.test(rc)) throw new Error('memory recall failed: '+String(rc).slice(0,120));
    console.log('memory/recall behavior ok');
  } catch (e) { console.error('memory/recall check failed', e); process.exitCode=2; return; }

  console.log('All quick checks passed ✅');
}

run().catch((e)=>{ console.error(e); process.exitCode=2; });
