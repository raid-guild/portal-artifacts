const clone = value => structuredClone(value);
const oldToNew = new Map([[1,1],[2,2],[3,3],[4,6],[5,7],[6,8],[7,9],[8,18],[9,19],[10,20],[11,21],[12,22],[13,23],[14,24],[15,25],[16,35]]);
const workbookToNew = new Map([['lore',4],['culture',5],['classes',10],['classes2',11],['classes3',12],['classes4',13],['classes5',14],['classes6',15],['warlock',16],['artificer',17],['brood',26],['branches',27],['worksheet',28],['sidequest',29],['mmd',30],['membership',31],['backstory',32],['mapgrid',33],['credits1',34]]);
const remapNumber = number => { const mapped=oldToNew.get(number); if(!mapped)throw new Error(`Unmapped original page ${number}`);return mapped; };
function remapRefs(value) {
 if(Array.isArray(value))return value.map(remapRefs);
 if(!value||typeof value!=='object')return value;
 return Object.fromEntries(Object.entries(value).map(([key,item])=>[key,['pageNumber','artPage','notesPage'].includes(key)&&Number.isInteger(item)?remapNumber(item):remapRefs(item)]));
}
const range = numbers => numbers.length===1?String(numbers[0]):`${numbers[0]}–${numbers.at(-1)}`;
export function composePublication(book,workbook) {
 if(book.pages.length!==16||workbook.pages.length!==19)throw new Error('Expected 16 illustrated source pages and 19 workbook pages');
 const source=clone(book);
 const edition={...source,schemaVersion:2,edition:'Integrated field edition · Volume 01',pageSizeInches:[7,10],statKey:clone(workbook.statKey),statsNote:workbook.statsNote,pathsIntro:workbook.pathsIntro,assets:{...source.assets}};
 for(const [id,art] of Object.entries(workbook.art||{})){
  const existing=edition.assets[id];if(existing&&existing.path!==art.path)throw new Error(`Conflicting workbook art for ${id}`);
  edition.assets[id]=existing?{...art,...existing}:art;
 }
 edition.assets.castleClosing={path:'art/castle-dot-matrix-closing-v1.png',alt:'Louchi castle walls in a navy, cream, and coral dot matrix texture'};
 edition.sources={...source.sources,...Object.fromEntries(Object.entries(workbook.sources).map(([id,value])=>[`workbook-${id}`,value]))};
 const original=source.pages.map(page=>({...remapRefs(page),legacyNumber:page.number,number:remapNumber(page.number)}));
 const resourcePage=original.find(page=>page.legacyNumber===14);
 const nextPage=original.find(page=>page.legacyNumber===15);
 const steps=nextPage.blocks.find(block=>block.type==='steps');
 resourcePage.layout='resources-and-next';
 resourcePage.title='Open the doors. Choose a move.';
 resourcePage.intro='Five places to look; five ways to begin.';
 resourcePage.blocks=[...resourcePage.blocks,steps];
 resourcePage.sourceIds=[...new Set([...resourcePage.sourceIds,...nextPage.sourceIds])];
 nextPage.layout='closing-quote';
 nextPage.eyebrow='THE ROAD CONTINUES';
 nextPage.title='The next quest is yours';
 nextPage.intro='';
 nextPage.art={assetId:'castleClosing',crop:[0,0,1,1]};
 nextPage.quote='Bring something strange. Find your party. Build something worth sharing.';
 nextPage.blocks=[];
 nextPage.sourceIds=[];
 const group=id=>['lore','culture'].includes(id)?'history':['brood','branches'].includes(id)?'supplement':['worksheet','sidequest','mmd','membership','backstory','mapgrid'].includes(id)?'appendix':id.startsWith('credits')?'credits':'classes';
 const imported=workbook.pages.map(page=>({number:workbookToNew.get(page.id),id:`workbook-${page.id}`,sectionId:group(page.id),layout:'workbook',eyebrow:group(page.id).toUpperCase(),title:page.title,intro:page.subtitle,sourceRef:{document:'workbook',pageId:page.id},workbookPage:{...clone(page),sourceIds:(page.sourceIds||[]).map(id=>`workbook-${id}`)},sourceIds:(page.sourceIds||[]).map(id=>`workbook-${id}`),blocks:[]}));
 if(imported.some(page=>!page.number))throw new Error('Unmapped workbook page');
 edition.pages=[...original,...imported].sort((a,b)=>a.number-b.number);
 if(edition.pages.some((page,i)=>page.number!==i+1))throw new Error('Noncontinuous edition');
 const sourceSection=id=>{const section=source.sections.find(section=>section.id===id);return {...section,pageNumbers:section.pageNumbers.filter(n=>id!=='doors'||n!==16).map(remapNumber)};};
 edition.sections=[sourceSection('opening'),sourceSection('world'),{id:'history',title:'History, culture & party agreements',pageNumbers:[4,5]},sourceSection('joining'),sourceSection('party'),{id:'classes',title:'Guild classes',pageNumbers:[10,11,12,13,14,15,16,17]},...['raid','rip','kit','doors'].map(sourceSection),{id:'supplement',title:'Side quests & other paths',pageNumbers:[26,27]},{id:'appendix',title:'Appendix · character & quest sheets',pageNumbers:[28,29,30,31,32,33]},{id:'credits',title:'The Guild roll',pageNumbers:[34]},{id:'closing',title:'Until the next quest',pageNumbers:[35]}];
 const pair=(numbers,id)=>({id,pageNumbers:numbers});
 const mapSpread=spread=>({...remapRefs(spread),pageNumbers:spread.pageNumbers.map(remapNumber)});
 edition.spreads=[...source.spreads.slice(0,2).map(mapSpread),pair([4,5],'spread-history-culture'),...source.spreads.slice(2,4).map(mapSpread),pair([10,11],'spread-classes-01'),pair([12,13],'spread-classes-02'),pair([14,15],'spread-classes-03'),pair([16,17],'spread-featured-classes'),...source.spreads.slice(4,-1).map(mapSpread),pair([26,27],'spread-supplement'),pair([28,29],'spread-appendix'),pair([30,31],'spread-mmd-membership'),pair([32,33],'spread-journal-map'),pair([34,35],'spread-credits-and-back-cover')];
 const contents=edition.pages.find(page=>page.legacyNumber===3).blocks.find(block=>block.type==='contents');
 contents.items=edition.sections.filter(section=>!['opening','world','closing'].includes(section.id)).map(section=>({id:section.id,title:section.title,text:range(section.pageNumbers),destination:{sectionId:section.id,pageNumber:section.pageNumbers[0]}}));
 if(edition.spreads.length!==18)throw new Error('Expected 18 spreads');
 return edition;
}
