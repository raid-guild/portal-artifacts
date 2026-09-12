from pathlib import Path
import subprocess,wave,array,math,json
out=Path('studies/sirocco-oasis/public/audio/machinery');out.mkdir(parents=True,exist_ok=True)
for name,start,duration,loop in [('diesel',12,8.2,True),('generator',4,8.2,True),('ratchet',6,8.2,True),('clunk',0,.978,False),('air',0,5.9,False)]:
 wav=Path('work/mechanics/'+name+'.wav')
 subprocess.run(['ffmpeg','-y','-v','error','-ss',str(start),'-i','work/mechanics/'+name+'.mp3','-t',str(duration),'-ac','1','-ar','44100','-af','highpass=f=32,loudnorm=I=-20:TP=-3:LRA=6','-c:a','pcm_s16le',str(wav)],check=True)
 if loop:
  with wave.open(str(wav),'rb') as f:pcm=array.array('h',f.readframes(f.getnframes()))
  n=8820;cut=len(pcm)-n;y=pcm[:cut]
  for i in range(n):w=i/n;y[i]=int(pcm[cut+i]*(1-w)+pcm[i]*w)
  with wave.open(str(wav),'wb') as f:f.setnchannels(1);f.setsampwidth(2);f.setframerate(44100);f.writeframes(y.tobytes())
 subprocess.run(['ffmpeg','-y','-v','error','-i',str(wav),'-c:a','libmp3lame','-b:a','128k',str(out/(name+'.mp3'))],check=True)
 print(name,(out/(name+'.mp3')).stat().st_size)
sources=json.loads(Path('work/mechanics/sources.json').read_text());(out/'credits.json').write_text(json.dumps({'license':'CC0 1.0','processing':'HQ preview recordings excerpted, mono, loudness normalized, loop seams crossfaded. Runtime pitch, EQ and layers vary with operation.','sources':sources},indent=2))
