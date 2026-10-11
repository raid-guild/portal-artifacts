// Original 16-bar scores for the cabinet's five synthesized stations. A dot is a rest;
// melody numbers are semitones above each bar's root. Every bar has 16 sixteenth notes.
export const RADIO_STATIONS = [
  {
    id:'circuit',name:'Circuit FM',subtitle:'Neon pulse / analog skyline',cost:0,bpm:110,color:'#5cecff',
    wave:'sawtooth',leadWave:'triangle',chords:[45,41,48,43,45,41,50,43,45,41,48,43,45,41,50,52],voicing:[0,3,7,10],
    melody:['12 . . 15 . . 19 . 17 . 15 . 12 . . .','12 . 15 . 19 . 22 . 19 . 17 . 15 . . .','19 . . 22 . 19 . 17 . 15 . . 12 . 10 .','12 . 15 . 19 . 22 . 24 . 22 . 19 . 17 .'],
    bass:'x...x.x.x...x.x.',kick:'x...x...x...x...',snare:'....x.......x...',hat:'x.x.x.x.x.x.x.x.'
  },
  {
    id:'glass',name:'Midnight Tokens',subtitle:'Crystal drift / midnight water',cost:45,bpm:106,color:'#8df7e8',
    wave:'sine',leadWave:'sine',chords:[50,46,53,48,50,46,55,48,50,46,53,48,50,46,55,57],voicing:[0,5,7,12],
    melody:['. . 12 . . . 19 . . . 17 . . . . .','. . . 15 . . 19 . . . . 22 . . . .','. . 24 . . . 19 . . 17 . . 15 . . .','. . 12 . . 15 . . . 19 . . 17 . . .'],
    bass:'x.......x.......',kick:'x.......x.......',snare:'........x.......',hat:'..x...x...x...x.'
  },
  {
    id:'afterburn',name:'Chrome Rush',subtitle:'Overdrive / arcade chase',cost:120,bpm:114,color:'#ff826a',
    wave:'sawtooth',leadWave:'square',chords:[40,43,45,47,40,43,48,47,40,43,45,47,40,43,48,52],voicing:[0,3,7,12],
    melody:['12 . 12 15 . 19 15 . 12 . 10 . 12 15 19 .','19 . 19 22 . 24 22 . 19 . 17 . 15 17 19 .','12 . 15 19 . 22 19 . 15 . 12 . 10 12 15 .','19 . 22 24 . 27 24 . 22 . 19 . 17 19 22 .'],
    bass:'x.x.x.x.x.x.x.x.',kick:'x...x...x.x.x...',snare:'....x.......x...',hat:'xxxxxxxxxxxxxxxx'
  },
  {
    id:'velvet',name:'Astral Lounge',subtitle:'Soft groove / orbital lounge',cost:260,bpm:105,color:'#ff8ed0',
    wave:'triangle',leadWave:'sine',chords:[48,45,41,43,48,45,41,46,48,45,41,43,48,45,41,43],voicing:[0,4,7,11],
    melody:['. 12 . . 16 . 19 . . 16 . 14 . . 12 .','. 12 . 16 . . 19 . 21 . . 19 . 16 . .','. 19 . . 16 . 14 . . 12 . 11 . . 9 .','. 12 . 16 . 19 . . 23 . 21 . 19 . 16 .'],
    bass:'x...x..x....x..x',kick:'x.......x...x...',snare:'....x.......x...',hat:'x..x..x.x..x..x.'
  },
  {
    id:'starlight',name:'Boss Frequency',subtitle:'Ascension / radiant finale',cost:500,bpm:112,color:'#ffe39a',
    wave:'sine',leadWave:'triangle',chords:[53,48,50,45,53,48,55,45,53,48,50,45,53,48,55,57],voicing:[0,4,7,12],
    melody:['12 . 16 . 19 . 24 . 19 . 16 . 12 . 16 .','19 . 24 . 28 . 24 . 19 . 16 . 19 . 24 .','16 . 19 . 24 . 28 . 24 . 19 . 16 . 12 .','19 . 24 . 28 . 31 . 28 . 24 . 19 . 16 .'],
    bass:'x...x...x...x...',kick:'x...x...x...x...',snare:'....x.......x...',hat:'x.x.x.x.x.x.x.x.'
  }
].map(station=>({...station,melody:station.melody.map(bar=>bar.split(' '))}));

export const RADIO_BY_ID = Object.fromEntries(RADIO_STATIONS.map(station=>[station.id,station]));
export const DEFAULT_RADIO = 'circuit';
export const midiToHz = midi=>440*2**((midi-69)/12);

export function eventsForStep(id,step,activity=0) {
  const station=RADIO_BY_ID[id]||RADIO_BY_ID[DEFAULT_RADIO];
  const index=((step%256)+256)%256,bar=Math.floor(index/16),beat=index%16,root=station.chords[bar];
  const events=[];
  if(beat===0)events.push({kind:'chord',notes:station.voicing.map(offset=>root+offset+12),duration:station.id==='glass'?3.6:station.id==='starlight'?3.2:2.8});
  if(station.kick[beat]==='x')events.push({kind:'kick'});
  if(station.snare[beat]==='x')events.push({kind:'snare'});
  if(station.hat[beat]==='x')events.push({kind:'hat'});
  if(station.bass[beat]==='x')events.push({kind:'bass',note:root-12,duration:station.id==='glass'?.65:.32});
  const note=station.melody[bar%4][beat];
  if(note!=='.')events.push({kind:'lead',note:root+Number(note),duration:station.id==='glass'?.45:.22});
  if(activity>=2&&beat%8===6)events.push({kind:'accent',note:root+station.voicing[(bar+beat)%station.voicing.length]+24,duration:.16});
  if(activity>=4&&beat%4===2)events.push({kind:'hat'});
  return events;
}
