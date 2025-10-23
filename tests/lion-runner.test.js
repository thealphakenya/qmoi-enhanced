const path = require('path');
const { runPlan } = require('../scripts/lion-runner.cjs');

test('lion-runner handles print, calc, and run (echo)', () => {
  const plan = `print: Hello Lion\ncalc: 1+2*3\nrun: shell("echo hi")`;
  const out = runPlan(plan);
  expect(out[0]).toBe('Hello Lion');
  expect(out[1]).toBe('7');
  expect(out[2].trim()).toBe('hi');
});
