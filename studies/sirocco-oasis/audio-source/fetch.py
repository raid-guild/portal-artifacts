import urllib.request,re,json,concurrent.futures
from pathlib import Path
Path('work/mechanics').mkdir(parents=True,exist_ok=True)
sources=[('diesel','BeeProductive',395586),('generator','qubodup',189896),('clunk','Swedger',170633),('air','davidlay1',416080),('ratchet','strikingtwice',260208)]
def fetch(item):
 name,author,num=item;url=f'https://freesound.org/people/{author}/sounds/{num}/';html=urllib.request.urlopen(url,timeout=60).read().decode();assert 'Creative Commons 0' in html
 link=re.search(r'https://cdn.freesound.org/previews/[^"\s<>]+-hq.mp3',html).group(0)
 Path('work/mechanics/'+name+'.mp3').write_bytes(urllib.request.urlopen(link,timeout=60).read());return dict(name=name,author=author,page=url,preview=link,license='CC0 1.0')
with concurrent.futures.ThreadPoolExecutor() as e:out=list(e.map(fetch,sources))
Path('work/mechanics/sources.json').write_text(json.dumps(out,indent=2));print(out)
