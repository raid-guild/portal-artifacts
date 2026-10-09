import {readFile,readdir,mkdir,writeFile} from 'node:fs/promises';
import {dirname,join,relative,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {deflateRawSync} from 'node:zlib';
import {createBlankDraft,draftFromPreset,exportDraft,validateDraft} from '../src/editor-workbench.js';

const study=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const kit=join(study,'builder-kit');
const output=join(study,'public/downloads/puddle-builder-kit.zip');
const entries=new Map();
const put=(name,data)=>entries.set(`puddle-builder-kit/${name}`,Buffer.isBuffer(data)?data:Buffer.from(data));

async function addTree(base,prefix=''){
  for(const item of await readdir(base,{withFileTypes:true})){
    if(item.name.startsWith('.')||['node_modules','dist','.cache'].includes(item.name))continue;
    const name=join(base,item.name);
    if(item.isDirectory())await addTree(name,prefix?`${prefix}/${item.name}`:item.name);
    else if(item.isFile())put(`${prefix?`${prefix}/`:''}${item.name}`,await readFile(name));
  }
}
await addTree(kit);

// Follow the actual editor model's relative imports so validation uses the
// same code as the browser without bundling browser entry points or assets.
const seen=new Set();
async function addRuntime(source){
  const absolute=resolve(source);if(seen.has(absolute))return;seen.add(absolute);
  const code=await readFile(absolute,'utf8');
  put(`runtime/${relative(join(study,'src'),absolute).replaceAll('\\','/')}`,code);
  for(const match of code.matchAll(/(?:from\s*|import\s*\()\s*['"](\.[^'"]+)['"]/g)){
    const spec=match[1].split('?')[0];
    await addRuntime(resolve(dirname(absolute),spec));
  }
}
await addRuntime(join(study,'src/editor-workbench.js'));

const game=JSON.parse(await readFile(join(study,'package.json'),'utf8')),
  kitPackage=JSON.parse(await readFile(join(kit,'package.json'),'utf8'));
for(const name of Object.keys(kitPackage.dependencies))
  if(game.dependencies[name]!==kitPackage.dependencies[name])
    throw new Error(`Builder kit dependency ${name} differs from the game.`);
const blank=createBlankDraft();
if(validateDraft(blank).errors.length)throw new Error('Blank template failed validation.');
put('templates/blank.puddle.json',`${exportDraft(blank)}\n`);
for(let id=1;id<=7;id++){
  const draft=draftFromPreset(id),issues=validateDraft(draft).errors;
  if(issues.length)throw new Error(`Preset ${id} failed validation: ${issues.join(' ')}`);
  put(`templates/campaign-${id}.puddle.json`,`${exportDraft(draft)}\n`);
}

// A small deterministic ZIP (fixed timestamps, sorted names) makes the file
// directly downloadable from the static game and easy to reproduce in CI.
const crcTable=Array.from({length:256},(_,i)=>{
  let value=i;for(let n=0;n<8;n++)value=value&1?0xedb88320^(value>>>1):value>>>1;
  return value>>>0;
});
function crc32(data){let crc=0xffffffff;for(const byte of data)crc=crcTable[(crc^byte)&255]^(crc>>>8);return (crc^0xffffffff)>>>0;}
const locals=[],central=[];let offset=0;
for(const [name,data] of [...entries].sort(([a],[b])=>a.localeCompare(b))){
  const filename=Buffer.from(name),compressed=deflateRawSync(data,{level:9}),crc=crc32(data);
  const header=Buffer.alloc(30);header.writeUInt32LE(0x04034b50,0);header.writeUInt16LE(20,4);
  header.writeUInt16LE(0,6);header.writeUInt16LE(8,8);header.writeUInt16LE(0,10);
  header.writeUInt16LE(33,12);header.writeUInt32LE(crc,14);
  header.writeUInt32LE(compressed.length,18);header.writeUInt32LE(data.length,22);
  header.writeUInt16LE(filename.length,26);
  locals.push(header,filename,compressed);
  const record=Buffer.alloc(46);record.writeUInt32LE(0x02014b50,0);
  record.writeUInt16LE(20,4);record.writeUInt16LE(20,6);record.writeUInt16LE(8,10);
  record.writeUInt16LE(0,12);record.writeUInt16LE(33,14);record.writeUInt32LE(crc,16);
  record.writeUInt32LE(compressed.length,20);record.writeUInt32LE(data.length,24);
  record.writeUInt16LE(filename.length,28);record.writeUInt32LE(offset,42);
  central.push(record,filename);
  offset+=header.length+filename.length+compressed.length;
}
const directory=Buffer.concat(central),end=Buffer.alloc(22);
end.writeUInt32LE(0x06054b50,0);end.writeUInt16LE(entries.size,8);
end.writeUInt16LE(entries.size,10);end.writeUInt32LE(directory.length,12);end.writeUInt32LE(offset,16);
await mkdir(dirname(output),{recursive:true});
await writeFile(output,Buffer.concat([...locals,directory,end]));
console.log(`Built ${relative(study,output)} with ${entries.size} files.`);
