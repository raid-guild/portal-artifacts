(() => {
  'use strict';

  const API_BASE = '/veydrift-api';
  const DEFAULT_MISSION = '26031';
  const DEFAULT_ALLIANCE = '29';
  const SHIPS = {
    smallCargo:'Small Cargo', largeCargo:'Large Cargo', lightFighter:'Light Fighter', heavyFighter:'Heavy Fighter',
    cruiser:'Cruiser', battleship:'Battleship', colonyShip:'Colony Ship', recycler:'Recycler', bomber:'Bomber',
    destroyer:'Destroyer', deathstar:'Deathstar', battlecruiser:'Battlecruiser', reaper:'Reaper', pathfinder:'Pathfinder'
  };
  const SHIP_IDS = {0:'Small Cargo',1:'Large Cargo',2:'Light Fighter',3:'Heavy Fighter',4:'Cruiser',5:'Battleship',6:'Colony Ship',7:'Recycler',9:'Bomber',11:'Destroyer',12:'Deathstar',13:'Battlecruiser',14:'Reaper',15:'Pathfinder'};
  const DEFENSES = ['Rocket Launcher','Light Laser','Heavy Laser','Gauss Cannon','Ion Cannon','Plasma Turret','Small Shield Dome','Large Shield Dome','Anti-Ballistic Missile','Interplanetary Missile'];
  const app = document.querySelector('#app');
  const input = document.querySelector('#missionInput');
  const allianceId = new URLSearchParams(location.search).get('alliance')?.replace(/\D/g, '') || DEFAULT_ALLIANCE;

  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  }

  function missionIdFromLocation() {
    const match = location.pathname.match(/\/mission\/(\d+)\/?$/);
    return match?.[1] || new URLSearchParams(location.search).get('mission')?.replace(/\D/g, '') || DEFAULT_MISSION;
  }

  async function fetchJson(path) {
    const response = await fetch(`${API_BASE}${path}`, {headers:{accept:'application/json'}});
    if (!response.ok) throw new Error(response.status === 404 ? 'Mission not found in the public index.' : `Veydrift returned ${response.status}.`);
    return response.json();
  }

  function countShips(ships) { return Object.values(ships || {}).reduce((sum, count) => sum + Number(count || 0), 0); }
  function formatNumber(value) { return Number(value || 0).toLocaleString(); }
  function planetName(planet) { return planet?.name || (planet?.planetId ? `Planet #${planet.planetId}` : 'Unknown planet'); }
  function coord(planet) { return planet?.coordinates || [planet?.galaxy, planet?.system, planet?.position].filter(v => v != null).join(':') || 'Unknown coordinates'; }
  function officialPlanet(planet) { return planet ? `https://veydrift.com/planet/${planet.galaxy}/${planet.system}/${planet.position}` : '#'; }
  function allianceMap(hash) { return `/veydrift-alliance-map/?alliance=${encodeURIComponent(allianceId)}#${hash}`; }
  function phase(mission) {
    const now = Date.now() / 1000;
    if (mission.status === 'Returning' || (now >= Number(mission.arrivalAt) && now < Number(mission.returnAt))) return 'returning';
    if (mission.status === 'Returned' || now >= Number(mission.returnAt)) return 'returned';
    return 'outbound';
  }
  function remaining(mission) {
    const state = phase(mission);
    const target = state === 'outbound' ? Number(mission.arrivalAt) : state === 'returning' ? Number(mission.returnAt) : 0;
    return Math.max(0, target - Math.floor(Date.now() / 1000));
  }
  function duration(seconds) {
    if (!seconds) return 'Complete';
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor(seconds % 86400 / 3600);
    const mins = Math.floor(seconds % 3600 / 60);
    const secs = seconds % 60;
    return [days && `${days}d`, (days || hours) && `${hours}h`, `${mins}m`, `${secs}s`].filter(Boolean).join(' ');
  }
  function dateTime(value) {
    if (!value) return '—';
    return new Date(Number(value) * 1000).toLocaleString([], {dateStyle:'medium', timeStyle:'short'});
  }
  function unitRows(items, labels) {
    const rows = Array.isArray(items)
      ? items.filter(x => Number(x.count) > 0).map(x => [labels[Number(x.id)] || `Unit #${x.id}`, x.count])
      : Object.entries(items || {}).filter(([,count]) => Number(count) > 0).map(([key,count]) => [labels[key] || key.replace(/([A-Z])/g, ' $1'), count]);
    return rows.length ? `<div class="unit-list">${rows.map(([name,count]) => `<div class="unit"><span>${esc(name)}</span><b>${formatNumber(count)}</b></div>`).join('')}</div>` : '<p class="empty">None reported</p>';
  }
  function resourceRows(resources) {
    const rows = Object.entries(resources || {}).filter(([,amount]) => Number(amount) > 0);
    return rows.length ? `<div class="unit-list">${rows.map(([name,amount]) => `<div class="unit"><span>${esc(name[0].toUpperCase()+name.slice(1))}</span><b>${formatNumber(amount)}</b></div>`).join('')}</div>` : '<p class="empty">No cargo reported</p>';
  }
  function planetPanel(title, planet, ownedByAlliance, target = false) {
    if (!planet) return `<section class="section panel"><h2>${esc(title)}</h2><p class="empty">Planet data unavailable</p></section>`;
    return `<section class="section panel">
      <h2>${esc(title)}</h2>
      <div class="planet-card">
        <div class="planet-placeholder ${target ? 'target-planet' : ''}" aria-hidden="true"></div>
        <div><h3>${esc(planetName(planet))}</h3><p>${esc(coord(planet))} · ${esc(planet.ownerDisplayName || shortAddress(planet.owner))}</p></div>
        <div class="planet-links">
          <a class="text-link" href="${officialPlanet(planet)}" target="_blank" rel="noopener noreferrer">Open in Veydrift ↗</a>
          ${ownedByAlliance ? `<a class="text-link" href="${allianceMap(`planet=${planet.planetId}`)}">View on alliance map →</a>` : ''}
        </div>
      </div>
    </section>`;
  }
  function shortAddress(value) { return value ? `${value.slice(0,6)}…${value.slice(-4)}` : 'Unclaimed'; }

  function routePlot(mission) {
    const state = phase(mission);
    const returning = state === 'returning';
    const keyPoints = returning ? '0.88;0.12' : '0.12;0.88';
    return `<section class="plot panel">
      <svg class="route-svg" viewBox="0 0 800 290" role="img" aria-label="${esc(state)} route from ${esc(planetName(mission.originPlanet))} to ${esc(planetName(mission.targetPlanet))}">
        <defs><radialGradient id="planetFill" cx="35%" cy="30%"><stop offset="0" stop-color="#b8fff2"/><stop offset=".24" stop-color="#327b8c"/><stop offset=".7" stop-color="#111d2c"/><stop offset="1" stop-color="#07090d"/></radialGradient></defs>
        <path class="path-shadow" d="M 115 145 C 280 35, 520 255, 685 145"/>
        <path id="flightPath" class="flight-path" d="M 115 145 C 280 35, 520 255, 685 145"/>
        <g class="origin"><circle class="orbit" cx="110" cy="145" r="66"/><circle class="world-ring" cx="110" cy="145" r="39"/><circle class="world-core" cx="110" cy="145" r="34"/><text class="route-name" x="110" y="232">${esc(planetName(mission.originPlanet))}</text><text class="route-label" x="110" y="251">${esc(coord(mission.originPlanet))}</text></g>
        <g class="target"><circle class="orbit" cx="690" cy="145" r="66"/><circle class="world-ring" cx="690" cy="145" r="39"/><circle class="world-core" cx="690" cy="145" r="34"/><text class="route-name" x="690" y="232">${esc(planetName(mission.targetPlanet))}</text><text class="route-label" x="690" y="251">${esc(coord(mission.targetPlanet))}</text></g>
        ${state !== 'returned' ? `<path class="craft ${returning ? 'returning' : ''}" d="M -8 -6 L 9 0 L -8 6 L -3 0 Z"><animateMotion dur="5s" repeatCount="indefinite" rotate="auto" keyPoints="${keyPoints}" keyTimes="0;1" calcMode="linear"><mpath href="#flightPath"/></animateMotion></path>` : ''}
      </svg>
      <div class="plot-caption"><p><strong>${esc(mission.originPlanet?.ownerDisplayName || shortAddress(mission.owner))}</strong> ${returning ? 'is returning from' : state === 'returned' ? 'completed a route to' : 'is en route to'} <strong>${esc(planetName(mission.targetPlanet))}</strong></p><span class="countdown" data-countdown>${state === 'returned' ? 'Mission complete' : duration(remaining(mission))}</span></div>
    </section>`;
  }

  function renderMission(plot, allianceMembers) {
    const mission = plot.mission;
    const report = plot.battleReport;
    const state = phase(mission);
    const originAllied = allianceMembers.has(String(mission.originPlanet?.owner || mission.owner).toLowerCase());
    const targetAllied = allianceMembers.has(String(mission.targetPlanet?.owner || '').toLowerCase());
    const resultClass = report?.outcome === 'DefenderWin' ? 'loss' : '';
    const resultTitle = report?.outcome?.replace(/([A-Z])/g, ' $1').trim() || 'No battle report';
    app.innerHTML = `
      <div class="mission-head"><div><span class="kicker">Mission telemetry</span><h1>${esc(mission.missionType)} <span>#${esc(mission.missionId)}</span></h1></div><span class="status ${esc(state)}">${esc(mission.status || state)}</span></div>
      ${routePlot(mission)}
      <div class="metrics">
        <div class="metric"><span>Task force</span><strong>${formatNumber(countShips(mission.ships))} ships</strong></div>
        <div class="metric"><span>Fuel cost</span><strong>${formatNumber(mission.fuelCost)}</strong></div>
        <div class="metric"><span>Arrival</span><strong>${esc(dateTime(mission.arrivalAt))}</strong></div>
        <div class="metric"><span>Return</span><strong>${esc(dateTime(mission.returnAt))}</strong></div>
      </div>
      <div class="grid">
        ${planetPanel('Origin', mission.originPlanet, originAllied)}
        ${planetPanel('Target', mission.targetPlanet, targetAllied, true)}
        <section class="section panel"><h2>Task force</h2>${unitRows(mission.ships, SHIPS)}</section>
        <section class="section panel"><h2>${state === 'returned' ? 'Return cargo' : 'Cargo'}</h2>${resourceRows(state === 'returned' ? mission.returnCargo : mission.cargo)}</section>
        <section class="section panel">
          <h2>Combat result</h2>
          <div class="outcome ${resultClass}"><span class="outcome-mark">${report ? (resultClass ? '×' : '✓') : '·'}</span><div><h3>${esc(resultTitle)}</h3><p>${report ? `${report.rounds || 0} rounds · ${formatNumber(report.loot?.metal)} metal, ${formatNumber(report.loot?.crystal)} crystal, ${formatNumber(report.loot?.deuterium)} deuterium looted` : 'This mission did not produce a public combat report.'}</p></div></div>
        </section>
        <section class="section panel"><h2>Defender snapshot</h2>${unitRows(plot.defenderPlanetState?.fleet, SHIP_IDS)}${unitRows(plot.defenderPlanetState?.defenses, DEFENSES)}</section>
        <section class="section wide panel">
          <h2>Identifiers & navigation</h2>
          <div class="identifiers">
            <div class="identifier"><span>Mission</span><code>#${esc(mission.missionId)}</code></div>
            <div class="identifier"><span>Commander</span><a href="https://basescan.org/address/${esc(mission.owner)}" target="_blank" rel="noopener noreferrer">${esc(mission.owner)}</a></div>
            <div class="identifier"><span>Launch tx</span><a href="https://basescan.org/tx/${esc(mission.transactionHash)}" target="_blank" rel="noopener noreferrer">${esc(mission.transactionHash)}</a></div>
            ${report?.transactionHash ? `<div class="identifier"><span>Battle tx</span><a href="https://basescan.org/tx/${esc(report.transactionHash)}" target="_blank" rel="noopener noreferrer">${esc(report.transactionHash)}</a></div>` : ''}
            <div class="identifier"><span>Official record</span><a href="https://veydrift.com/mission/${esc(mission.missionId)}" target="_blank" rel="noopener noreferrer">veydrift.com/mission/${esc(mission.missionId)} ↗</a></div>
            ${originAllied && state !== 'returned' ? `<div class="identifier"><span>Alliance signal</span><a href="${allianceMap(`mission=${mission.missionId}`)}">Open live transit on alliance map →</a></div>` : ''}
          </div>
        </section>
      </div>
      <section id="live-board" class="live-board"><div class="live-board-head"><h2>Live board</h2><span id="liveStatus">Loading current missions…</span></div><div id="missionTable" class="mission-table panel"></div></section>`;
    updateCountdown(mission);
    loadLiveBoard(mission.missionId);
  }

  async function loadLiveBoard(currentId) {
    const table = document.querySelector('#missionTable');
    const status = document.querySelector('#liveStatus');
    try {
      const payload = await fetchJson('/missions');
      const missions = (payload.missions || []).filter(row => row.missionId !== currentId).slice(0, 12);
      status.textContent = `${missions.length} recent public signals`;
      table.innerHTML = missions.map(row => `<a class="mission-row" href="/veydrift-mission-explorer/mission/${encodeURIComponent(row.missionId)}?alliance=${encodeURIComponent(allianceId)}"><b>#${esc(row.missionId)}</b><span class="mission-type">${esc(row.missionType)}</span><span>${esc(planetName(row.originPlanet))} → ${esc(planetName(row.targetPlanet))}</span><span class="row-time">${esc(row.status)}</span></a>`).join('') || '<p class="empty section">No active missions reported.</p>';
    } catch (error) {
      status.textContent = 'Live board unavailable';
      table.innerHTML = `<p class="empty section">${esc(error.message)}</p>`;
    }
  }

  function updateCountdown(mission) {
    const node = document.querySelector('[data-countdown]');
    if (!node) return;
    const state = phase(mission);
    node.textContent = state === 'returned' ? 'Mission complete' : `${state === 'returning' ? 'Return' : 'Arrival'} in ${duration(remaining(mission))}`;
  }

  async function loadMission(id) {
    input.value = id;
    app.innerHTML = '<section class="loading panel"><span class="loader" aria-hidden="true"></span><p>Reading mission telemetry…</p></section>';
    try {
      const [plot, allianceResult] = await Promise.all([
        fetchJson(`/mission/${id}`),
        fetchJson(`/alliance/${allianceId}`).catch(() => ({alliance:{members:[]}}))
      ]);
      const members = new Set((allianceResult.alliance?.members || []).map(member => String(member.address).toLowerCase()));
      document.title = `Mission #${id} — Rift Plot`;
      renderMission(plot, members);
      clearInterval(window.riftClock);
      window.riftClock = setInterval(() => updateCountdown(plot.mission), 1000);
    } catch (error) {
      app.innerHTML = `<section class="error panel"><span class="kicker">Signal lost</span><h1>Mission #${esc(id)} unavailable</h1><p>${esc(error.message)}</p><a class="button-link" href="/veydrift-mission-explorer/mission/${DEFAULT_MISSION}">Open sample mission</a></section>`;
    }
  }

  document.querySelector('#missionForm').addEventListener('submit', event => {
    event.preventDefault();
    const id = input.value.replace(/\D/g, '');
    if (!id) return;
    location.assign(`/veydrift-mission-explorer/mission/${id}?alliance=${encodeURIComponent(allianceId)}`);
  });

  loadMission(missionIdFromLocation());
})();
