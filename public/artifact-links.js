// Attribute visits from an artifact to RaidGuild's public sites.
(function () {
  'use strict';

  var destinations = new Set(['raidguild.org', 'portal.raidguild.org']);
  var segment = window.location.pathname.split('/').filter(Boolean)[0] || 'index';
  var campaign;
  try { campaign = decodeURIComponent(segment); } catch (_) { campaign = segment; }
  var tags = {
    utm_source: 'portal-artifacts',
    utm_medium: 'referral',
    utm_campaign: 'artifact-links',
    utm_content: campaign
  };

  function tag(link) {
    if (!link.matches('a[href], area[href]')) return;
    var href = link.getAttribute('href');
    if (!href) return;
    var url;
    try { url = new URL(href, window.location.href); } catch (_) { return; }
    if (!/^https?:$/.test(url.protocol) || !destinations.has(url.hostname)) return;

    var missing = new URLSearchParams();
    Object.keys(tags).forEach(function (key) {
      if (!url.searchParams.has(key)) missing.append(key, tags[key]);
    });
    if (!missing.toString()) return;

    // Keep the original path, query spelling, and fragment intact.
    var hash = href.indexOf('#');
    var before = hash < 0 ? href : href.slice(0, hash);
    var after = hash < 0 ? '' : href.slice(hash);
    var separator = before.includes('?') ? (/[?&]$/.test(before) ? '' : '&') : '?';
    link.setAttribute('href', before + separator + missing.toString() + after);
  }

  function scan(node) {
    if (node.nodeType !== 1) return;
    if (node.matches('a[href], area[href]')) tag(node);
    node.querySelectorAll('a[href], area[href]').forEach(tag);
  }

  function start() {
    scan(document.documentElement);
    new MutationObserver(function (changes) {
      changes.forEach(function (change) {
        if (change.type === 'attributes') tag(change.target);
        else change.addedNodes.forEach(scan);
      });
    }).observe(document.documentElement, {
      subtree: true, childList: true, attributes: true, attributeFilter: ['href']
    });
  }

  // Capture handles links inserted and followed before the observer callback runs.
  function onFollow(event) {
    var target = event.target;
    if (target && target.closest) {
      var link = target.closest('a[href], area[href]');
      if (link) tag(link);
    }
  }
  document.addEventListener('click', onFollow, true);
  document.addEventListener('auxclick', onFollow, true);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
}());
