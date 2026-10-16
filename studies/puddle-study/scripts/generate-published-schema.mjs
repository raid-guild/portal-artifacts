import {readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const source=new URL('../src/published-level-schema.js',import.meta.url);
const target=new URL('../../../services/leaderboards/src/puddle-level-schema.js',import.meta.url);
const expected=await readFile(source);
if(process.argv.includes('--check')){
  const actual=await readFile(target).catch(()=>null);
  if(!actual||!expected.equals(actual))throw new Error('Puddle portable schema copy is stale. Run npm run build:published-schema.');
  console.log('Puddle portable schema copy matches.');
}else{
  await writeFile(target,expected);
  console.log(`Updated ${fileURLToPath(target)}.`);
}
