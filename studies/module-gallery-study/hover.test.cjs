const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');

// Exercise the actual DOM geometry handler with lightweight layout fixtures.
const source = readFileSync(`${__dirname}/app.js`, 'utf8');
const geometry = source.slice(source.indexOf('  function rememberHoverZones()'), source.indexOf('  // Viewport-relative rectangles'));
function fixture({ left = 100, top = 200, active = false, scrollLeft = 0 } = {}) {
  const cards = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
  const row = { children: cards, getBoundingClientRect: () => ({ left, top, width: 620, height: 260 }) };
  const context = vm.createContext({
    gallery: { dataset: { columns: '3' }, querySelectorAll: () => active ? [] : [row] },
    thumbnails: { children: cards, scrollLeft, getBoundingClientRect: () => ({ left, top, height: 125 }) },
    activeModule: active ? {} : null, hoverZones: [], peekedModule: {},
    clearPeek() { context.peekedModule = null; context.cleared = true; },
    getComputedStyle: () => ({ columnGap: '10px', paddingLeft: '4px' }),
    DOMRect: class { constructor(left, top, width, height) { Object.assign(this, { left, top, width, height, right: left + width, bottom: top + height }); } },
  });
  vm.runInContext(geometry, context);
  return context;
}
test('row targets use resting columns, never animated card bounds', () => {
  const context = fixture();
  vm.runInContext('rememberHoverZones()', context);
  assert.deepEqual(Array.from(context.hoverZones, zone => [zone.rect.left, zone.rect.width]), [[100, 200], [310, 200], [520, 200]]);
});
test('scroll invalidation clears peek and rebuilds viewport coordinates', () => {
  const context = fixture({ top: -120 });
  vm.runInContext('rememberHoverZones(); invalidateHoverZones()', context);
  assert.equal(context.hoverZones.length, 0);
  assert.equal(context.cleared, true);
  vm.runInContext('rememberHoverZones()', context);
  assert.equal(context.hoverZones[0].rect.top, -120);
});
test('thumbnail resting slots account for strip scroll and padding', () => {
  const context = fixture({ active: true, scrollLeft: 80 });
  vm.runInContext('rememberHoverZones()', context);
  assert.deepEqual(Array.from(context.hoverZones, zone => [zone.rect.left, zone.rect.width]), [[24, 140], [174, 140], [324, 140]]);
});
