import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { test } from 'node:test';
import vm from 'node:vm';
import { injectPlausible } from './inject-plausible.mjs';

const script = await readFile(new URL('../public/artifact-links.js', import.meta.url), 'utf8');

function run(hrefs, pathname = '/ragdoll-lab/') {
  let observer;
  const handlers = {};
  const links = hrefs.map((href) => ({
    value: href,
    nodeType: 1,
    getAttribute() { return this.value; },
    setAttribute(_name, value) { this.value = value; },
    matches() { return true; },
    querySelectorAll() { return []; },
    closest() { return this; }
  }));
  const root = { nodeType: 1, matches: () => false, querySelectorAll: () => links };
  const document = {
    readyState: 'complete', documentElement: root,
    addEventListener(name, handler) { handlers[name] = handler; }
  };
  const context = { window: { location: { pathname, href: `https://artifacts.example${pathname}` } },
    document, URL, URLSearchParams, Set,
    MutationObserver: class { constructor(callback) { observer = callback; } observe() {} }
  };
  vm.runInNewContext(script, context);
  return { links, handlers, mutate: (change) => observer([change]) };
}

test('tags exact target domains and preserves query, fragment, and existing UTM values', () => {
  const { links } = run([
    'https://raidguild.org/path?x=1&utm_source=#section',
    'https://portal.raidguild.org/members#team',
    'http://raidguild.org/',
    'https://evilraidguild.org/',
    'https://dekan.raidguild.org/',
    'mailto:hello@raidguild.org'
  ]);
  assert.match(links[0].value, /^https:\/\/raidguild\.org\/path\?x=1&utm_source=&utm_medium=referral&/);
  assert.match(links[0].value, /utm_content=ragdoll-lab#section$/);
  assert.match(links[1].value, /utm_source=portal-artifacts.*utm_content=ragdoll-lab#team$/);
  assert.match(links[2].value, /utm_source=portal-artifacts/);
  assert.equal(links[3].value, 'https://evilraidguild.org/');
  assert.equal(links[4].value, 'https://dekan.raidguild.org/');
  assert.equal(links[5].value, 'mailto:hello@raidguild.org');
});

test('is idempotent and tags changed and immediately clicked links', () => {
  const state = run(['https://raidguild.org/?utm_campaign=custom'], '/');
  const first = state.links[0].value;
  state.mutate({ type: 'attributes', target: state.links[0] });
  assert.equal(state.links[0].value, first);
  assert.match(first, /utm_campaign=custom/);
  assert.match(first, /utm_content=index/);
  state.links[0].value = 'https://portal.raidguild.org/new';
  state.handlers.click({ target: state.links[0] });
  assert.match(state.links[0].value, /utm_content=index/);
  assert.match(state.links[0].value, /utm_source=portal-artifacts/);
});

test('does not tag a non-navigation href after an attribute mutation', () => {
  const state = run([]);
  const stylesheet = {
    value: 'https://raidguild.org/style.css',
    matches: () => false,
    getAttribute() { return this.value; },
    setAttribute(_name, value) { this.value = value; }
  };
  state.mutate({ type: 'attributes', target: stylesheet });
  assert.equal(stylesheet.value, 'https://raidguild.org/style.css');
});

test('build injection is independent of Plausible marker and covers all pages twice', async () => {
  async function walk(dir) {
    const files = [];
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) files.push(...await walk(path));
      else if (entry.name.endsWith('.html')) files.push(path);
    }
    return files;
  }
  const files = await walk(new URL('../public/', import.meta.url).pathname);
  assert.ok(files.length > 0);
  for (const file of files) {
    const html = await readFile(file, 'utf8');
    const injected = injectPlausible(html, file);
    assert.equal(injectPlausible(injected, file), injected);
    assert.equal(injected.match(/<script defer src="\/artifact-links\.js"><\/script>/g)?.length, 1);
    assert.equal(injected.match(/Plausible analytics: injected at build time/g)?.length, 1);
    const withOldMarker = html.replace('</head>', '<!-- Plausible analytics: injected at build time -->\n</head>');
    assert.match(injectPlausible(withOldMarker, file), /artifact-links\.js/);
  }
});
