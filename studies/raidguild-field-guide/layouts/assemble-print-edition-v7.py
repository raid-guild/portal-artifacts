from pathlib import Path
import re,sys
from pypdf import PdfReader,PdfWriter
from pypdf.generic import NameObject,ArrayObject,DictionaryObject,TextStringObject
# Usage: python assemble-print-edition-v7.py BASE_PDF DENSE_PDF OUTPUT_PDF
if len(sys.argv)!=4:raise SystemExit('Expected base PDF, content PDF, and output PDF')
output=Path(sys.argv[3]);a=PdfReader(sys.argv[1]);b=PdfReader(sys.argv[2])
import json
edition=json.loads((Path(__file__).resolve().parents[1]/'../../public/raidguild-field-guide/publication.json').resolve().read_text())
total=len(edition['pages']); folio=[p['number'] for p in edition['pages'] if p.get('sourceRef',{}).get('document')=='workbook']
assert len(a.pages)==total;assert len(b.pages)==len(folio)
# Normalize Chromium internal dense-page destinations before importing.

refs={p.indirect_reference.idnum:n for p,n in zip(b.pages,folio)}
for page in b.pages:
 for ar in page.get('/Annots',[]):
  an=ar.get_object();dest=an.get('/Dest')
  action=an.get('/A')
  if not dest and action and action.get('/S')=='/GoTo':dest=action.get('/D')
  if isinstance(dest,ArrayObject) and dest and getattr(dest[0],'idnum',None) in refs:
   n=refs[dest[0].idnum]
   if '/Dest' in an:del an['/Dest']
   an[NameObject('/A')]=DictionaryObject({NameObject('/S'):NameObject('/URI'),NameObject('/URI'):TextStringObject('https://field-guide.local/#page'+str(n))})
w=PdfWriter();w.clone_document_from_reader(a)
for i,n in enumerate(folio):w.pages[n-1].merge_page(b.pages[i])
for page in w.pages:
 for ar in page.get('/Annots',[]):
  an=ar.get_object();action=an.get('/A')
  if action and action.get('/S')=='/URI':
   uri=str(action.get('/URI',''));m=re.search(r'#page(\d+)$',uri)
   if m and 1<=int(m[1])<=total:
    an[NameObject('/Dest')]=ArrayObject([w.pages[int(m[1])-1].indirect_reference,NameObject('/Fit')]);del an['/A']
w.add_metadata({'/Title':'RaidGuild Field Guide — Complete illustrated edition','/Author':'RaidGuild'})
with output.open('wb') as f:w.write(f)
r=PdfReader(output);assert len(r.pages)==total
for p in r.pages:assert abs(float(p.mediabox.width)-504)<1 and abs(float(p.mediabox.height)-720)<1
print('Merged',total,'pages;',len(folio),'dense pages; retained outlines and links.')
