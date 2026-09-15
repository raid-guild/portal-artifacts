import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync(new URL('../dist/app.js',import.meta.url),'utf8');
const declaration=source.match(/^const isTouch=.*;$/m)?.[0];assert.ok(declaration);
for(const [name,coarse,fineHover,expected] of [
 ['desktop mouse',false,true,false],['touchscreen laptop',true,true,false],
 ['phone',true,false,true],['tablet',true,false,true],
 ['tablet with trackpad',true,true,false],['no pointer reported',false,false,false]
]){
 const result=vm.runInNewContext(declaration+'\nisTouch',{matchMedia:q=>({matches:q==='(pointer:coarse)'?coarse:q==='(any-pointer:fine) and (any-hover:hover)'?fineHover:false})});
 assert.equal(result,expected,name);
}
console.log('PASS: desktop/hybrid devices retain toolbar and keyboard UI; touch-only phones/tablets use mobile controls.');
