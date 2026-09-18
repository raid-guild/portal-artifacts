import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { buildQuestions } from './public/engine.js';
const defaultPort = Number(process.env.PORT || 4317);
const root = new URL('./public/', import.meta.url);
const files = new Map([['/', ['index.html', 'text/html']], ['/app.js', ['app.js', 'text/javascript']], ['/engine.js', ['engine.js', 'text/javascript']], ['/style.css', ['style.css', 'text/css']], ['/favicon.svg', ['favicon.svg', 'image/svg+xml']]]);

function json(res, status, data) { res.writeHead(status, {'Content-Type':'application/json', 'Cache-Control':'no-store'}); res.end(JSON.stringify(data)); }
export function createApp({apiKey=process.env.TYPESAFE_API_KEY,model=process.env.TYPESAFE_MODEL||'jev-latest',fetchImpl=fetch}={}) {
let active = false;
const server = http.createServer(async (req, res) => {
  // Only this local UI may trigger authenticated requests. Do not serve .env or source directories.
  const port = server.address().port;
  const hosts = new Set([`127.0.0.1:${port}`, `localhost:${port}`]);
  if (!hosts.has(req.headers.host)) return json(res, 403, {error:'Local requests only.'});
  if (req.headers.origin && !new Set([`http://127.0.0.1:${port}`, `http://localhost:${port}`]).has(req.headers.origin)) return json(res,403,{error:'Origin not allowed.'});
  try {
    const suppliedKey = req.headers['x-jev-key'];
    if (suppliedKey !== undefined && (typeof suppliedKey !== 'string' || !suppliedKey.trim() || suppliedKey.length > 4096 || /[^\x21-\x7e]/.test(suppliedKey))) return json(res,400,{error:'Enter a valid API key without spaces.'});
    const requestKey = suppliedKey ?? apiKey;
    if (req.method === 'POST' && req.url === '/api/check-key') {
      if (!suppliedKey) return json(res,400,{error:'Enter your Jev key first.'});
      const check = await fetchImpl('https://api.typesafe.ai/v1/systemone', {method:'POST',headers:{Authorization:`Bearer ${requestKey}`,'Content-Type':'application/json'},body:JSON.stringify({model,state:'Connection test.',questions:{connected:{type:'noul',instructions:'Does the state contain the words Connection test?'}}}),signal:AbortSignal.timeout(30_000)});
      if (!check.ok) return json(res,502,{error:`Key check failed (TypeSafe HTTP ${check.status}). Check the key and account access.`});
      return json(res,200,{ok:true,model});
    }
    if (req.method === 'GET' && req.url === '/api/status') return json(res,200,{configured:Boolean(apiKey),model});
    if (req.method === 'POST' && req.url === '/api/decision') {
      if (!requestKey) return json(res,503,{error:'Enter a Jev key above, or add TYPESAFE_API_KEY to .env and restart.'});
      if (active) return json(res,429,{error:'A Jev request is already running. Try again when it finishes.'});
      let raw = '';
      for await (const chunk of req) { raw += chunk; if (raw.length > 100_000) return json(res,413,{error:'Request is too large.'}); }
      let state;
      try { state = JSON.parse(raw); } catch { return json(res,400,{error:'Invalid JSON.'}); }
      if (!Array.isArray(state.exits) || state.exits.length < 2 || state.exits.length > 4 || state.exits.some(e => !['north','east','south','west'].includes(e.direction)) || new Set(state.exits.map(e=>e.direction)).size !== state.exits.length) return json(res,400,{error:'Expected two to four distinct legal exits.'});
      const request = {model,state,questions:buildQuestions(state)};
      active = true;
      try {
        const started = performance.now();
        const upstream = await fetchImpl('https://api.typesafe.ai/v1/systemone', {method:'POST',headers:{Authorization:`Bearer ${requestKey}`,'Content-Type':'application/json'},body:JSON.stringify(request),signal:AbortSignal.timeout(30_000)});
        if (!upstream.ok) return json(res,502,{error:`TypeSafe returned HTTP ${upstream.status}. Check your key, account balance, and model setting. No automatic retry was made.`});
        const response = await upstream.json();
        if (!state.exits.some(e=>e.direction === response.answers?.move?.choice)) return json(res,502,{error:'Jev returned an invalid move; the run has stopped.'});
        json(res,200,{request,response,latencyMs:Math.round(performance.now()-started)});
      } finally { active = false; }
      return;
    }
    if (req.method === 'GET' && files.has(req.url)) {
      const [file,type] = files.get(req.url);
      res.writeHead(200,{'Content-Type':type,'Cache-Control':'no-cache'});
      res.end(await readFile(new URL(file,root))); return;
    }
    json(res,404,{error:'Not found.'});
  } catch (err) {
    json(res,500,{error:err.name === 'TimeoutError' ? 'Jev timed out after 30 seconds. No automatic retry was made.' : 'Request failed. Check your network and restart the run.'});
  }
});
return server;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  createApp().listen(defaultPort,'127.0.0.1',()=>console.log(`Maze Lab: http://127.0.0.1:${defaultPort}\nJev: ${process.env.TYPESAFE_API_KEY ? 'key configured' : 'add key to .env and restart'} (${process.env.TYPESAFE_MODEL || 'jev-latest'})`));
}
