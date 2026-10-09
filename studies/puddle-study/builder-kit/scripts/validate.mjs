#!/usr/bin/env node
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const args=process.argv.slice(2),json=args.includes('--json'),paths=args.filter(arg=>arg!=='--json');
const emit=(result,code)=>{
  process.stdout.write(json?`${JSON.stringify(result)}\n`:
    `${result.valid?'Valid':'Invalid'}${result.name?`: ${result.name}`:''}\n${[
      ...result.errors.map(item=>`Error: ${item}`),...result.warnings.map(item=>`Warning: ${item}`)
    ].join('\n')}${result.errors.length||result.warnings.length?'\n':''}`);
  process.exitCode=code;
};
const failure=(message)=>({valid:false,playability:'not-tested',errors:[message],warnings:[]});
if(paths.length!==1||paths[0]==='--help'||paths[0].startsWith('--')){
  emit(failure('Usage: npm run validate -- [--json] path/to/level.puddle.json'),2);
}else{
  let source;
  try{source=await readFile(resolve(paths[0]),'utf8');}
  catch(error){emit(failure(`Cannot read level file: ${error.message}`),2);}
  if(source!==undefined){
    try{
      const {importDraft,validateDraft}=await import('../runtime/editor-workbench.js');
      const draft=importDraft(source),checks=validateDraft(draft);
      emit({valid:checks.errors.length===0,playability:'not-tested',name:draft.name,
        objects:draft.objects.length,errors:checks.errors,warnings:checks.warnings},checks.errors.length?1:0);
    }catch(error){
      emit(failure(error.message),error instanceof TypeError||error instanceof RangeError||
        ['ERR_MODULE_NOT_FOUND','ERR_PACKAGE_PATH_NOT_EXPORTED'].includes(error.code)?2:1);
    }
  }
}
