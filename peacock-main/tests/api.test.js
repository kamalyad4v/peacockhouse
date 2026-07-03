const assert = require('assert');

const BASE_URL = process.env.REACT_APP_BACKEND_URL || "https://scroll-plumage.preview.emergentagent.com";
const API = `${BASE_URL.replace(/\/+$/, '')}/api`;

console.log(`Running API Integration Tests against: ${API}`);

async function runTests() {
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`✓ ${name}`);
      passed++;
    } catch (err) {
      console.error(`✗ ${name}`);
      console.error(err);
      failed++;
    }
  }

  // ---------- Root ----------
  await test('Root welcome message', async () => {
    const r = await fetch(`${API}/`);
    assert.strictEqual(r.status, 200);
    const data = await r.json();
    assert.strictEqual(data.message, "Peacock Blouse House API");
  });

  // ---------- Newsletter ----------
  const uniqueId = Math.random().toString(36).substring(2, 10);
  const testEmail = `test_${uniqueId}@example.com`;

  await test('Newsletter signup valid email', async () => {
    const r = await fetch(`${API}/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail })
    });
    assert.ok([200, 201].includes(r.status), `Expected 200 or 201, got ${r.status}`);
    const data = await r.json();
    assert.strictEqual(data.email, testEmail.toLowerCase());
    assert.ok(typeof data.id === 'string' && data.id.length > 0);
    assert.ok(typeof data.created_at === 'string');
  });

  await test('Newsletter signup duplicate email', async () => {
    const r = await fetch(`${API}/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail })
    });
    assert.strictEqual(r.status, 409);
    const data = await r.json();
    assert.ok(data.detail.toLowerCase().includes('already subscribed'));
  });

  await test('Newsletter signup case insensitive duplicate email', async () => {
    const r = await fetch(`${API}/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail.toUpperCase() })
    });
    assert.strictEqual(r.status, 409);
  });

  await test('Newsletter signup invalid email format', async () => {
    const r = await fetch(`${API}/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'notanemail' })
    });
    assert.strictEqual(r.status, 422);
  });

  await test('Newsletter signup empty email', async () => {
    const r = await fetch(`${API}/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: '' })
    });
    assert.strictEqual(r.status, 422);
  });

  await test('Newsletter count increments', async () => {
    const rBefore = await fetch(`${API}/newsletter/count`);
    assert.strictEqual(rBefore.status, 200);
    const dataBefore = await rBefore.json();
    const beforeCount = dataBefore.count;
    assert.strictEqual(typeof beforeCount, 'number');

    const email = `count_${Math.random().toString(36).substring(2, 10)}@example.com`;
    const s = await fetch(`${API}/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    assert.ok([200, 201].includes(s.status));

    const rAfter = await fetch(`${API}/newsletter/count`);
    assert.strictEqual(rAfter.status, 200);
    const dataAfter = await rAfter.json();
    assert.strictEqual(dataAfter.count, beforeCount + 1);
  });

  // ---------- Status ----------
  await test('Create and list status check', async () => {
    const name = `TEST_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const r = await fetch(`${API}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_name: name })
    });
    assert.strictEqual(r.status, 200);
    const data = await r.json();
    assert.strictEqual(data.client_name, name);
    assert.ok(data.id);
    assert.ok(data.timestamp);

    const rList = await fetch(`${API}/status`);
    assert.strictEqual(rList.status, 200);
    const list = await rList.json();
    assert.ok(Array.isArray(list));
    assert.ok(list.some(item => item.client_name === name));
  });

  console.log(`\nTests finished: ${passed} passed, ${failed} failed.`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(err => {
  console.error('Fatal error running tests:', err);
  process.exit(1);
});
