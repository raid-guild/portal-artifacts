const PRODUCT = 'rg:digital:dune-relay-pass';
const CAPABILITY = 'dune-relay:campaign-pass';
const TTL_MS = 5 * 60_000;
const UNAVAILABLE_TTL_MS = 20_000;
const MAX_ENTRIES = 500;

export function createDuneCommerce({ origin = process.env.DUNE_COMMERCE_API_ORIGIN, apiKey = process.env.DUNE_COMMERCE_ENTITLEMENT_API_KEY, environment = process.env.DUNE_COMMERCE_ENTITLEMENT_ENVIRONMENT || 'live', storeUrl = process.env.DUNE_COMMERCE_STORE_URL, fetchImpl = fetch, now = Date.now } = {}) {
  const cache = new Map();
  const inFlight = new Map();
  let lookupSerial = 0;
  const safeUrl = value => { try { const url = new URL(value); return !url.username && !url.password && (url.protocol === 'https:' || url.protocol === 'http:' && ['localhost','127.0.0.1','[::1]'].includes(url.hostname)) ? url : null; } catch { return null; } };
  const apiOrigin = safeUrl(origin)?.origin ?? null;
  const configured = Boolean(apiOrigin && apiKey && ['live', 'test'].includes(environment));
  const productUrl = safeUrl(storeUrl)?.href ?? null;
  function status(state, grant = null) {
    return { state, unlocked: state === 'active', unlockedAt: grant?.grantedAt ?? null, checkedAt: grant?.checkedAt ?? null, storeUrl: productUrl };
  }
  async function check({ issuer, subject }, { refresh = false } = {}) {
    const match = /^user:([0-9]+)$/.exec(subject ?? '');
    if (!match || typeof issuer !== 'string') return status('unavailable');
    const portalUserId = match[1];
    const key = JSON.stringify([issuer, portalUserId, environment]);
    if (!configured) return status('unavailable');
    const running = inFlight.get(key);
    if (running?.forced) return running.forced;
    if (!refresh && cache.get(key)?.expires > now()) return cache.get(key).result;
    if (!refresh && running?.normal) return running.normal;
    if (!running && inFlight.size >= MAX_ENTRIES) return status('unavailable');
    const serial = ++lookupSerial;
    const lookup = (async () => {
      let result;
      try {
      const url = new URL('/api/v1/entitlements/dune-relay', apiOrigin);
      url.searchParams.set('issuer', issuer);
      url.searchParams.set('portalUserId', portalUserId);
      const response = await fetchImpl(url, { headers: { Authorization: `Bearer ${apiKey}`, Accept: 'application/json' }, cache: 'no-store', signal: AbortSignal.timeout(5_000) });
      if (!response.ok) throw new Error('Commerce lookup failed');
      const value = await response.json();
      const timestamp = value?.checkedAt;
      const grantTime = value?.grantedAt;
      if (value?.schemaVersion !== 1 || value.productId !== PRODUCT || value.capability !== CAPABILITY || value.issuer !== issuer || value.portalUserId !== portalUserId || value.environment !== environment || typeof value.active !== 'boolean' || typeof timestamp !== 'string' || !Number.isFinite(Date.parse(timestamp)) || (value.active ? typeof grantTime !== 'string' || !Number.isFinite(Date.parse(grantTime)) : grantTime !== null)) throw new Error('Invalid Commerce entitlement');
      result = status(value.active ? 'active' : 'locked', value);
      } catch { result = status('unavailable'); }
      if ((cache.get(key)?.serial ?? 0) < serial) {
        cache.delete(key);
        if (cache.size >= MAX_ENTRIES) cache.delete(cache.keys().next().value);
        cache.set(key, { serial, expires: now() + (result.state === 'unavailable' ? UNAVAILABLE_TTL_MS : TTL_MS), result });
      }
      return result;
    })();
    const slot = refresh ? 'forced' : 'normal';
    const entry = running ?? {};
    entry[slot] = lookup;
    inFlight.set(key,entry);
    try { return await lookup; } finally {
      if (entry[slot] === lookup) delete entry[slot];
      if (!entry.normal && !entry.forced && inFlight.get(key) === entry) inFlight.delete(key);
    }
  }
  return { check };
}
