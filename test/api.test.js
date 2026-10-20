const test = require('node:test');
const assert = require('node:assert');
const BASE = process.env.BASE_URL || 'http://localhost:3000';

test('health check returns UP', async () => {
  const r = await fetch(BASE + '/health');
  assert.strictEqual(r.status, 200);
});

test('create product returns 201', async () => {
  const r = await fetch(BASE + '/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pid: Date.now(), pname: 'CI item', price: 10, quantity: 1 })
  });
  assert.strictEqual(r.status, 201);
});