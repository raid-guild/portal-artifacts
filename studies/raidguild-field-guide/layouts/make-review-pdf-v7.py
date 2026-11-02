from pathlib import Path
import json,html,math
from PIL import Image
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import ImageReader
ROOT=Path(__file__).resolve().parents[1]
import sys
OUT=Path(sys.argv[1]) if len(sys.argv)>1 else ROOT/'layouts'
OUT.mkdir(parents=True,exist_ok=True)
D=json.loads((ROOT/'../../public/raidguild-field-guide/publication.json').resolve().read_text())
for name,file in [('Serif',ROOT/'fonts/LastDuel-Ex2.ttf'),('Sans',ROOT/'fonts/Ubuntu-Regular.ttf'),('Bold',ROOT/'fonts/Ubuntu-Bold.ttf'),('SansItalic',ROOT/'fonts/Ubuntu-Italic.ttf'),('BoldItalic',ROOT/'fonts/Ubuntu-BoldItalic.ttf')]:pdfmetrics.registerFont(TTFont(name,str(file)))
pdfmetrics.registerFontFamily('Sans',normal='Sans',bold='Bold',italic='SansItalic',boldItalic='BoldItalic')
W,H=504,720; M=35; CW=W-2*M
tokens=json.loads((ROOT/'design/louchi-tokens.json').read_text())['colors']
CREAM=tokens['paper'];INK=tokens['ink'];TEAL=tokens['deep'];CORAL=tokens['coral'];LINE=tokens['cyan'];MUTED=tokens['ink']
C=canvas.Canvas(str(OUT/'raidguild-field-guide-integrated-base-v7.pdf'),pagesize=(W,H),pageCompression=1)
C.setTitle('RaidGuild Field Guide - Complete Review Draft');C.setAuthor('RaidGuild')
metrics=[]
def color(v):return HexColor(v)
def txt(s):return html.escape(str(s).replace('\u2011','-').replace('–','-').replace('—','-'))
def para(s,x,y,w,size=10.2,font='Sans',fill=INK,leading=None):
 if not s:return y
 st=ParagraphStyle('p',fontName=font,fontSize=size,leading=leading or size*1.43,textColor=color(fill),spaceAfter=0)
 p=Paragraph(txt(s),st);_,h=p.wrap(w,10000);p.drawOn(C,x,H-y-h);return y+h

def rule(y,x=M,w=CW):C.setStrokeColor(color(LINE));C.setLineWidth(.65);C.line(x,H-y,x+w,H-y)
def image(asset,x,y,w,h,crop=None):
 p=ROOT/D['assets'][asset]['path']; iw,ih=Image.open(p).size
 cx,cy,cw,ch=crop or [0,0,1,1]
 scale=min(w/(iw*cw),h/(ih*ch));dw=iw*cw*scale;dh=ih*ch*scale
 xx=x+(w-dw)/2;yy=y+(h-dh)/2
 C.saveState();clip=C.beginPath();clip.rect(xx,H-yy-dh,dw,dh);C.clipPath(clip,stroke=0,fill=0)
 C.drawImage(str(p),xx-cx*iw*scale,H-yy-ih*scale+cy*ih*scale,width=iw*scale,height=ih*scale,mask='auto');C.restoreState()
 return yy+dh

def sourcefooter(page):
 rule(677)
 xx=M; yy=687
 for sid in page.get('sourceIds',[]):
  if sid not in D['sources']:continue
  label=D['sources'][sid]['title'].replace(' · handbook','')
  ww=pdfmetrics.stringWidth(label,'Sans',6.5)
  if xx+ww>W-M-20:xx=M; yy+=10
  C.setFont('Sans',6.5);C.setFillColor(color(MUTED));C.drawString(xx,H-yy,label)
  C.linkURL(D['sources'][sid]['url'],(xx,H-yy-2,xx+ww,H-yy+8),thickness=0)
  xx+=ww+12
 C.setFillColor(color(TEAL));C.setFont('Bold',9);C.drawRightString(W-M,27,str(page['number']))
 C.bookmarkPage('page-'+str(page['number']))
 C.addOutlineEntry(page['title'],'page-'+str(page['number']),level=0,closed=False)

def header(p):
 y=para(p.get('eyebrow','').upper(),M,30,CW,7.7,'Bold',TEAL)
 y=para(p['title'],M,y+10,CW,24,'Serif',INK,28)
 y=para(p.get('intro',''),M,y+10,CW,9.4,fill=MUTED)
 return y+18

def block(b,x,y,w,size=10):
 typ=b['type']
 if b.get('title'):y=para(b['title'],x,y,w,12,'Serif')+5
 if b.get('text'):y=para(b['text'],x,y,w,size,fill=MUTED)+11
 for idx,it in enumerate(b.get('items',[])):
  if typ=='contents':
   rule(y+1,x,w); yy=y+10
   yy=para(it['title'],x,yy,w-55,11,'Serif');num=it.get('text',str(it.get('destination',{}).get('pageNumber','')))
   para(num,x+w-45,y+11,45,9,'Bold',TEAL)
   dest=it.get('destination',{}).get('pageNumber')
   if dest:C.linkRect('', 'page-'+str(dest),(x,H-yy-6,x+w,H-y+2),relative=0,thickness=0)
   y=max(yy+10,y+35)
  else:
   title=it.get('title',''); prefix=(f'{idx+1:02d}  ' if typ=='steps' else '')
   y=para(prefix+title,x,y,w,11.3,'Serif')+4
   y=para(it.get('text',''),x,y,w,size,fill=MUTED)+9
   if it.get('url'):
    url=it['url'];shown=url.replace('https://','')
    if len(shown)>90:shown='Open current governance record online'
    yy=y;y=para(shown,x,y,w,7.7,'Sans',TEAL)+11
    C.linkURL(url,(x,H-y,x+w,H-yy+2),relative=0,thickness=0)
 return y

def draw_wide(spread, half):
 spW=W*2; left=D['pages'][spread['artPage']-1];right=D['pages'][spread['notesPage']-1]
 C.saveState();C.translate(-half*W,0)
 C.setFillColor(color(CREAM));C.rect(0,0,spW,H,fill=1,stroke=0)
 para(left.get('eyebrow',''),30,24,900,8,'Bold',TEAL)
 para(left['title'],30,44,900,30,'Serif',INK,35)
 para(left['intro'],30,87,900,9,fill=MUTED)
 if spread['layout']=='atlas-spread':
  ax=0;ay=108;aw=spW;ah=spW/2
  image(left['art']['assetId'],ax,ay,aw,ah,[0,0,1,1])
  landmarks=spread['atlas']['landmarks'];boxH=58
  # Leaders and circles use the image plane; card positions are separate.
  for it in landmarks:
   px=ax+aw*it['x']/100;py=ay+ah*it['y']/100
   xx=aw*it['card']['x']/100; yy=ay+ah*it['card']['y']/100;ww=aw*it['card']['width']/100
   sx=max(xx,min(px,xx+ww));sy=max(yy,min(py,yy+boxH))
   C.setStrokeColor(color(CORAL));C.setLineWidth(.85);C.line(sx,H-sy,px,H-py)
  for it in landmarks:
   px=ax+aw*it['x']/100;py=ay+ah*it['y']/100
   C.setFillColor(color(INK));C.setStrokeColor(color(CREAM));C.setLineWidth(1.8);C.circle(px,H-py,10,fill=1,stroke=1)
   C.setFillColor(color(CREAM));C.setFont('Bold',8.5);C.drawCentredString(px,H-py-3,str(it['number']))
  for it in landmarks:
   xx=aw*it['card']['x']/100;yy=ay+ah*it['card']['y']/100;ww=aw*it['card']['width']/100
   C.setFillColor(color('#fff8e7'));C.setStrokeColor(color('#c9b596'));C.setLineWidth(.6);C.roundRect(xx,H-yy-boxH,ww,boxH,3,fill=1,stroke=1)
   C.setFillColor(color(TEAL));C.circle(xx+13,H-yy-13,7,fill=1,stroke=0)
   C.setFillColor(color(CREAM));C.setFont('Bold',7);C.drawCentredString(xx+13,H-yy-15.5,str(it['number']))
   ty=para(it['title'],xx+26,yy+6,ww-32,10,'Serif',INK,11)
   ty=para(it['meaning'],xx+8,max(yy+22,ty+3),ww-16,7.6,'Sans',MUTED,10)
   dest=it['destination'];pp=dest.get('pageNumber')
   final_notes=next(p['number'] for p in D['pages'] if p.get('legacyNumber')==14)
   label=dest['label']+(' / p. '+str(pp) if pp else ' / p. '+str(final_notes))
   para(label,xx+8,yy+43,ww-16,7.4,'Bold',TEAL,9)
   side=int(xx//W)
   if side==half:C.linkRect('', 'page-'+str(pp or final_notes),(xx,H-yy-boxH,xx+ww,H-yy),relative=1,thickness=0)
  para('An imagined landscape of Guild life. Follow the numbered landmarks into the guide. Full field notes: p. '+str(final_notes)+'.',30,635,940,8.2,fill=MUTED)
  wb=lambda id:next(p['number'] for p in D['pages'] if p.get('sourceRef',{}).get('pageId')==id)
  jumps=[('Guild history',wb('lore')),('Character sheet',wb('worksheet')),('RaidBrood',wb('brood')),('Class field notes',wb('classes')),('Warlock',wb('warlock'))]
  for j,(label,n) in enumerate(jumps):
   xx=30+j*190
   para(label+' / p. '+str(n),xx,651,180,8,'Bold',TEAL)
   if int(xx//W)==half:C.linkRect('', 'page-'+str(n),(xx,H-663,xx+180,H-649),relative=1,thickness=0)

 elif spread['layout']=='trail-spread':
  # A full-width, uncropped 3:2 scene carries the six stages across the gutter.
  C.setFillColor(color(CREAM));C.rect(0,0,spW,H,fill=1,stroke=0)
  ax=0;ay=0;aw=spW;ah=672
  image(left['art']['assetId'],ax,ay,aw,ah,[0,0,1,1])
  C.setFillColor(color('#fff8e7'));C.roundRect(22,H-48,spW-44,42,3,fill=1,stroke=0)
  para('THE IMPROVEMENT TRAIL',32,11,260,7,'Bold',TEAL)
  para(left['title'],310,10,650,22,'Serif',INK,27)
  items={it['id']:(i+1,it) for i,it in enumerate(next(b['items'] for b in right['blocks'] if b['type']=='steps'))}
  spots={it['itemId']:it for it in spread['trail']['hotspots']}
  boxes=[]
  for card in spread['trail']['cards']:
   n,it=items[card['itemId']];xx=aw*card['x']/100;yy=max(60,ah*card['y']/100);ww=aw*card['width']/100
   st=ParagraphStyle('trailbody',fontName='Sans',fontSize=9,leading=12)
   ph=Paragraph(txt(it['text']),st).wrap(ww-38,10000)[1]
   titleh=Paragraph(txt(it['title']),ParagraphStyle('trailtitle',fontName='Serif',fontSize=11,leading=13)).wrap(ww-38,10000)[1]
   hh=16+titleh+5+ph
   if yy+hh>640:yy=640-hh
   boxes.append((card,n,it,xx,yy,ww,hh))
  for card,n,it,xx,yy,ww,hh in boxes:
   spot=spots[card['itemId']];px=aw*spot['x']/100;py=ah*spot['y']/100
   sx=max(xx,min(px,xx+ww));sy=max(yy,min(py,yy+hh))
   C.setStrokeColor(color(CORAL));C.setLineWidth(.9);C.line(sx,H-sy,px,H-py)
  for card,n,it,xx,yy,ww,hh in boxes:
   spot=spots[card['itemId']];px=aw*spot['x']/100;py=ah*spot['y']/100
   C.setFillColor(color(INK));C.setStrokeColor(color(CREAM));C.setLineWidth(1.5);C.circle(px,H-py,11,fill=1,stroke=1)
   C.setFillColor(color(CREAM));C.setFont('Bold',9);C.drawCentredString(px,H-py-3,str(n))
   C.setFillColor(color('#fff8e7'));C.setStrokeColor(color('#c9b596'));C.setLineWidth(.6);C.roundRect(xx,H-yy-hh,ww,hh,3,fill=1,stroke=1)
   C.setFillColor(color(TEAL));C.circle(xx+14,H-yy-15,8,fill=1,stroke=0)
   C.setFillColor(color(CREAM));C.setFont('Bold',8);C.drawCentredString(xx+14,H-yy-18,str(n))
   ty=para(it['title'],xx+29,yy+8,ww-38,11,'Serif',INK,13)+5
   end=para(it['text'],xx+29,ty,ww-38,9,'Sans',MUTED,12)
   if end>yy+hh-3:raise RuntimeError('Trail card overflow '+it['id'])
  notes=[left['intro'],right['intro']]+[b['text'] for b in left['blocks']+right['blocks'] if b.get('text')]
  C.setFillColor(color(CREAM));C.rect(0,0,spW,76,fill=1,stroke=0)
  end=para(' '.join(notes),30,646,948,6.5,'Sans',MUTED,8.2)
  if end>672:raise RuntimeError('Trail context overflow '+str(end))
 else:
  asset=left['art']['assetId']; ax=166;ay=141;aw=676;ah=450.667
  image(asset,ax,ay,aw,ah,[0,0,1,1])
  items={it['id']:it for b in right['blocks'] for it in b.get('items',[])}
  spots={it['itemId']:it for it in left['diagram']['hotspots']}
  sideYs={}
  for side in ['left','right']:
   ids=spread['calloutSides'][side]; heights=[]
   for id in ids:
    it=items[id];st=ParagraphStyle('measure',fontName='Sans',fontSize=8.3,leading=11.5)
    title=Paragraph(txt(it['title']),ParagraphStyle('t',fontName='Serif',fontSize=11,leading=13))
    body=Paragraph(txt(it['text']),st)
    heights.append(16+title.wrap(128,10000)[1]+6+body.wrap(128,10000)[1])
   gaps=max(10,(510-sum(heights))/max(1,len(ids)-1));yy=126
   for id,hh in zip(ids,heights):sideYs[id]=(side,yy);yy+=hh+gaps
   if yy-gaps>661:raise RuntimeError('Wide callouts overflow '+side+str(yy-gaps))
  # Quiet leader lines preserve the source image and point to its actual features.
  for side in ['left','right']:
   for id in spread['calloutSides'][side]:
    side,yy=sideYs[id];spot=spots[id];px=ax+aw*spot['x']/100;py=ay+ah*spot['y']/100
    start=160 if side=='left' else 848;bend=163 if side=='left' else 845
    C.setStrokeColor(color('#bb7a65'));C.setLineWidth(.7)
    C.line(start,H-yy-5,bend,H-yy-5);C.line(bend,H-yy-5,px,H-py)
    C.setFillColor(color(CREAM));C.circle(px,H-py,2.2,fill=1,stroke=1)
  for side in ['left','right']:
   for id in spread['calloutSides'][side]:
    it=items[id];_,yy=sideYs[id];xx=30 if side=='left' else 850
    n=next(i+1 for i,z in enumerate(right['blocks'][0]['items']) if z['id']==id)
    yy=para(str(n).zfill(2),xx,yy,128,8,'Bold',CORAL)+5
    yy=para(it['title'],xx,yy,128,11,'Serif',leading=13)+6
    yy=para(it['text'],xx,yy,128,8.3,fill=MUTED,leading=11.5)
  # Retain the source captions as a full-width note below the artwork.
  captions=[right['intro']]+[b['text'] for b in left['blocks']+right['blocks'] if b['type']=='caption']
  para(' '.join(captions),174,612,660,7.1,fill=MUTED,leading=9.4)
 C.restoreState()

for p in D['pages']:
 C.setFillColor(color(CREAM));C.rect(0,0,W,H,fill=1,stroke=0)
 if p.get('sourceRef',{}).get('document')=='workbook' or p.get('workbookPage'):
  C.bookmarkPage('page-'+str(p['number']));C.addOutlineEntry(p['title'],'page-'+str(p['number']),level=0)
  metrics.append((p['number'],'HTML content placeholder'));C.showPage();continue
 wide=next((sp for sp in D['spreads'] if sp.get('layout') in ['illustrated-spread','atlas-spread','trail-spread'] and p['number'] in sp['pageNumbers']),None)
 if wide:
  draw_wide(wide,wide['pageNumbers'].index(p['number']));sourcefooter(p);metrics.append((p['number'],'full spread'));C.showPage();continue
 if p['layout']=='cover':
  image(p['art']['assetId'],0,0,W,H,p['art'].get('crop'))
  C.setFillColor(color(INK));C.setFont('Bold',9)
  C.drawCentredString(W/2,H-43,'RAIDGUILD / VOLUME 01')
  C.setFont('Serif',48);C.drawCentredString(W/2,H-105,p['title'])
  C.setFont('Sans',11);C.drawCentredString(W/2,H-128,p.get('intro',''))
  C.bookmarkPage('page-'+str(p['number']));C.addOutlineEntry(p['title'],'page-'+str(p['number']),level=0)
  metrics.append((p['number'],'Moloch cover'));C.showPage();continue
 if p['layout']=='back-cover':
  C.setFillColor(color(INK));C.rect(0,0,W,H,fill=1,stroke=0)
  image(p['art']['assetId'],0,270,W,390,p['art'].get('crop'))
  para('RAIDGUILD / FIELD GUIDE',M,38,CW,9,'Bold','#f6e7cd')
  yy=para(p['title'],M,90,CW,43,'Serif','#f6e7cd',49)
  yy=para(p.get('intro',''),M,yy+20,CW,13,'Sans','#f6e7cd')
  if p['number']==1:
   para('Review draft · Volume 01',M,670,CW,9,'Sans','#f6e7cd')
  else:
   for i,(label,url) in enumerate([('portal.raidguild.org','https://portal.raidguild.org/'),('handbook.raidguild.org','https://handbook.raidguild.org/')]):
    para(label,M,655+i*23,CW,10,'Sans','#f6e7cd');C.linkURL(url,(M,H-675-i*23,W-M,H-652-i*23),thickness=0)
  C.bookmarkPage('page-'+str(p['number']));C.addOutlineEntry(p['title'],'page-'+str(p['number']),level=0)
  metrics.append((p['number'],690));C.showPage();continue
 if p['layout']=='closing-quote':
  image(p['art']['assetId'],0,0,W,H,[0,0,1,1])
  C.setFillColor(color('#fcf3e3'));C.setStrokeColor(color('#d8baa0'));C.setLineWidth(1.5)
  # Last Duel's wider letterforms wrap the quote onto one additional line.
  C.roundRect(47,180,410,284,5,fill=1,stroke=1)
  para(p['eyebrow'],70,270,364,8,'Bold',TEAL)
  para(p['title'],70,289,364,21,'Serif',INK,25)
  para(p['quote'],70,333,364,28,'Serif',INK,36)
  para('RAIDGUILD · FIELD GUIDE',M,618,CW,8,'Bold','#f8efdc')
  C.bookmarkPage('page-'+str(p['number']));C.addOutlineEntry(p['title'],'page-'+str(p['number']),level=0)
  metrics.append((p['number'],'castle closing quote'));C.showPage();continue
 if p['id']=='joining-plate':
  # The source illustration includes its own title, route labels, and closing note.
  # Fit all of that content to the trim with a slight horizontal adjustment instead
  # of cropping the top or bottom of the 2:3 artwork to the 7:10 page.
  art=ROOT/D['assets'][p['art']['assetId']]['path']
  C.drawImage(str(art),0,0,width=W,height=H,mask='auto')
  C.bookmarkPage('page-'+str(p['number']))
  C.addOutlineEntry(p['title'],'page-'+str(p['number']),level=0)
  metrics.append((p['number'],'full bleed joining art'));C.showPage();continue
 if p['layout']=='resources-and-next':
  y=header(p);gap=20;colW=(CW-gap)/2
  links=next(b['items'] for b in p['blocks'] if b['type']=='links')
  steps=next(b['items'] for b in p['blocks'] if b['type']=='steps')
  ends=[]
  for side,items in enumerate([links,steps]):
   xx=M+side*(colW+gap);yy=para('FIVE PUBLIC DOORS' if side==0 else 'FIVE POSSIBLE MOVES',xx,y,colW,9,'Bold',TEAL)+10
   for i,it in enumerate(items):
    rule(yy,xx,colW);yy+=7
    label=(f'{i+1:02d}  ' if side else '')+it['title']
    yy=para(label,xx,yy,colW,11,'Serif',INK,13)+3
    yy=para(it['text'],xx,yy,colW,8.9,'Sans',MUTED,12)+10
    if side==0:C.linkURL(it['url'],(xx,H-yy+3,xx+colW,H-yy+36),thickness=0)
   ends.append(yy)
  yy=max(ends)+18
  rule(yy);yy+=11
  yy=para('ATLAS FIELD NOTES',M,yy,CW,8,'Bold',TEAL)+7
  yy=para('The Gathering Hall, Workshop, Expedition Dock, Archive, and Commons are places to gather, build, raid, learn, and share. Queen Raida helps surface context; people make the judgments. Moloch names coordination failure. The arrival road is yours to walk.',M,yy,CW,9,'Serif',INK,12)
  if yy>660:raise RuntimeError(f'Resource page overflow: {yy}')
  metrics.append((p['number'],round(yy,1)));sourcefooter(p);C.showPage();continue
 y=header(p)
 if p['layout']=='character-plate':
  roles=next(b['items'] for b in p['blocks'] if b['type']=='roles')
  rowH=(655-y)/3;gap=17;cellW=(CW-gap)/2
  for i,r in enumerate(roles):
   xx=M+(i%2)*(cellW+gap);yy=y+(i//2)*rowH
   image(r['assetId'],xx,yy,cellW,rowH-76,r['crop'])
   ty=yy+rowH-73
   ty=para(r['title'],xx,ty,cellW,11.3,'Serif')+1
   ty=para(r['skill'],xx,ty,cellW,7.9,'Bold',TEAL)+3
   ty=para(r['text'],xx,ty,cellW,8.4,fill=MUTED,leading=11.1)
   if ty>yy+rowH+4:raise RuntimeError(f'Role caption overflow {r["title"]}: {ty} vs {yy+rowH}')
  end=655
 elif p['layout']=='full-art':
  maxh=470 if p.get('legacyNumber',p['number'])==4 else 260 if p.get('legacyNumber',p['number'])==2 else 350
  maxh=min(maxh,610-y)
  bottom=image(p['art']['assetId'],M-8,y,CW+16,maxh,p['art'].get('crop'))
  y=bottom+15
  for b in p['blocks']:y=block(b,M,y,CW,9)
  end=y
 elif p['layout']=='trail':
  bottom=image(p['art']['assetId'],M,y,CW,220,p['art'].get('crop'));y=bottom+19
  for b in p['blocks']:y=block(b,M,y,CW,10)
  labels=['Idea','Discuss','Shape','Propose','Decide','Deliver']
  y+=13
  for i,label in enumerate(labels):
   xx=M+20+i*(CW-40)/5
   if i<5:C.setStrokeColor(color(CORAL));C.setLineWidth(2);C.line(xx,H-y,xx+(CW-40)/5,H-y)
   C.setFillColor(color(TEAL));C.circle(xx,H-y,6,fill=1,stroke=0)
   para(label,xx-29,y+14,60,7.5,'Bold',TEAL)
  end=y+50
 else:
  # Dense process and resource notes use two balanced columns.
  collections=[b for b in p['blocks'] if b['type']=='steps']
  if collections and len(collections[0]['items'])>=6 and p.get('legacyNumber')==7:
   b=collections[0];items=b['items'];split=math.ceil(len(items)/2);gap=23;colW=(CW-gap)/2
   ends=[]
   for col,its in enumerate([items[:split],items[split:]]):
    yy=y;xx=M+col*(colW+gap)
    for j,it in enumerate(its):
     yy=para(f'{j+col*split+1:02d}',xx,yy,colW,8,'Bold',CORAL)+5
     yy=para(it['title'],xx,yy,colW,12,'Serif')+6
     yy=para(it['text'],xx,yy,colW,9.2,fill=MUTED)+18
    ends.append(yy)
   y=max(ends)
   for b2 in p['blocks']:
    if b2 is not b:y=block(b2,M,y,CW,8.8)
  else:
   for b in p['blocks']:y=block(b,M,y,CW,9.5)
  end=y
 if end>668:raise RuntimeError(f'Page {p["number"]} overflow: {end}')
 metrics.append((p['number'],round(end,1)))
 sourcefooter(p);C.showPage()
C.save();print('PDF created',metrics)
