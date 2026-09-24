import test from 'node:test';
import assert from 'node:assert/strict';
import {neighbors} from '../dist/js/neighbors.js';
import {stops,breweryStops} from '../dist/js/content.js';
import {parkBlocked} from '../dist/js/layout.js';
import {neighborStatus} from '../dist/js/neighbor-state.js';
import {createStageMusic} from '../dist/js/music.js';

test('optional neighbors have reachable meeting points without altering the tasting tour',()=>{
  assert.equal(stops.length,9);assert.equal(breweryStops.length,6);
  assert.equal(neighbors.filter(n=>n.kind==='chat').length,3);
  for(const neighbor of neighbors){
    assert.equal(parkBlocked(neighbor.meet.x,neighbor.meet.z,breweryStops),false,neighbor.id);
    assert.equal(neighborStatus(neighbor.meet,neighbor),'ready');
    const far={x:neighbor.meet.x+3,z:neighbor.meet.z};
    assert.equal(neighborStatus(far,neighbor),'far');
    assert.equal(neighborStatus(far,neighbor,true),'approaching');
    assert.equal(neighborStatus(far,neighbor,false),'far');
    assert.equal(stops.some(s=>s.id===neighbor.id),false);
    for(const topic of neighbor.topics)assert.match(topic.sourceUrl,/^https:\/\//);
  }
});
class FakeAudio extends EventTarget{
  muted=false;volume=.55;ended=false;currentTime=0;plays=0;pauses=0;
  play(){this.plays++;return this.pending||Promise.resolve();}
  pause(){this.pauses++;this.dispatchEvent(new Event('pause'));}
  fire(type){this.dispatchEvent(new Event(type));}
}
test('song loops without autoplay; band follows playback and Stop resets the track',async()=>{
  const audio=new FakeAudio(),states=[];const music=createStageMusic(audio,s=>states.push(s));
  assert.equal(audio.plays,0);assert.equal(audio.loop,true);
  music.start();assert.equal(audio.plays,1);assert.equal(music.snapshot().playing,false);
  audio.fire('playing');assert.equal(music.snapshot().playing,true);
  audio.fire('waiting');assert.equal(music.snapshot().playing,false);
  audio.fire('playing');assert.equal(music.snapshot().playing,true);
  audio.currentTime=12;music.stop();
  assert.equal(music.snapshot().playing,false);assert.equal(audio.currentTime,0);assert.equal(audio.plays,1);
  music.start();assert.equal(audio.currentTime,0);assert.equal(audio.plays,2);
  music.stop();assert.equal(music.snapshot().playing,false);music.dispose();
});
test('Stop during pending playback prevents a late playback event restarting the band',async()=>{
  const audio=new FakeAudio();let resolve;audio.pending=new Promise(r=>resolve=r);
  const music=createStageMusic(audio);music.start();music.stop();resolve();await Promise.resolve();
  audio.fire('playing');assert.equal(music.snapshot().playing,false);assert.ok(audio.pauses>=2);music.dispose();
});
test('play rejection and load failure are visible and retryable',async()=>{
  const audio=new FakeAudio();audio.pending=Promise.reject(new Error('blocked'));
  const music=createStageMusic(audio);music.start();await new Promise(r=>setImmediate(r));
  assert.match(music.snapshot().error,/did not start/);assert.equal(music.snapshot().pending,false);
  audio.pending=Promise.resolve();music.start();audio.fire('playing');assert.equal(music.snapshot().error,'');
  audio.fire('error');assert.match(music.snapshot().error,/could not load/);assert.equal(music.snapshot().playing,false);
  music.dispose();
});
