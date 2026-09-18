import {mkdir,copyFile,readFile,writeFile} from 'node:fs/promises';
const out=new URL('../../public/jev-maze/',import.meta.url);
await mkdir(out,{recursive:true});
for(const name of ['app.js','api.js','engine.js','style.css','favicon.svg'])await copyFile(new URL(`public/${name}`,import.meta.url),new URL(name,out));
let html=await readFile(new URL('public/index.html',import.meta.url),'utf8');
html=html.replace('<html lang="en">','<html lang="en" data-hosted="true">')
  .replace('LOCAL EXPERIMENT · 01','JEV NAVIGATION EXPERIMENT')
  .replace('Sent through this local server to TypeSafe.','Sent through this artifact’s proxy to TypeSafe.')
  .replace('Clearing or refreshing returns to the server’s .env key, if configured.','Clearing or refreshing removes the key; enter your own key again to continue.');
await writeFile(new URL('index.html',out),html);
console.log('Built public/jev-maze (static assets only; no secrets or Node server).');
