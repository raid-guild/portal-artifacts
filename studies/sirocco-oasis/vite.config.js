import { defineConfig } from 'vite';
import { createReadStream } from 'node:fs';
import { fileURLToPath } from 'node:url';
const tracks=new Set(['walker-radio.mp3','orbital-rad.mp3','docking-lights.mp3']);
export default defineConfig({
 base:'/sirocco-oasis/',
 plugins:[{name:'local-field-radio',configureServer(server){server.middlewares.use((req,res,next)=>{const prefix='/desert-walker/assets/';const name=req.url?.slice(prefix.length);if(!req.url?.startsWith(prefix)||!tracks.has(name))return next();res.setHeader('Content-Type','audio/mpeg');const stream=createReadStream(fileURLToPath(new URL('../../public/desert-walker/assets/'+name,import.meta.url)));stream.on('error',()=>{res.statusCode=404;res.end();});stream.pipe(res);});}}]
});
