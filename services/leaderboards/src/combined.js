import express from 'express';
import {createNeonApp} from './neon-app.js';
import { createApp } from './app.js';
import { createRaidApp } from './raid-app.js';
import { createPuddleApp } from './puddle-app.js';
import { createRcRacersApp } from './rc-racers-app.js';

export function createCombinedApp({ pool, origin, issuer, cosmicSecret, raidSecret, puddleSecret, neonSecret, rcRacersSecret, secure = true }) {
  const app=express();
  const common={pool,origin,issuer,secure};
  if (raidSecret?.length >= 32) {
    const raid=createRaidApp({...common,launchSecret:raidSecret});
    // Dispatch only Raid paths: the game app owns its own routes and catch-all.
    app.use((req,res,next)=>req.path.startsWith('/leaderboard-api/raid-survivor/') ? raid(req,res,next) : next());
  } else {
    app.use('/leaderboard-api/raid-survivor', (_req,res)=>res.status(503).json({message:'Ranked play is temporarily unavailable. Local play still works.'}));
  }
  if (puddleSecret?.length >= 32) {
    const puddle=createPuddleApp({...common,launchSecret:puddleSecret});
    app.use((req,res,next)=>req.path.startsWith('/leaderboard-api/puddle-study/') ? puddle(req,res,next) : next());
  } else {
    app.use('/leaderboard-api/puddle-study', (_req,res)=>res.status(503).json({message:'Leaderboard temporarily unavailable. Local play still works.'}));
  }
  if(neonSecret?.length>=32){const neon=createNeonApp({...common,launchSecret:neonSecret});app.use((req,res,next)=>req.path.startsWith('/leaderboard-api/neon-drop/')?neon(req,res,next):next());}
  else app.use('/leaderboard-api/neon-drop',(_req,res)=>res.status(503).json({message:'Leaderboard unavailable. Local practice works.'}));
  if (rcRacersSecret?.length >= 32) {
    const rcRacers=createRcRacersApp({...common,launchSecret:rcRacersSecret});
    app.use((req,res,next)=>req.path.startsWith('/leaderboard-api/rc-racers/') ? rcRacers(req,res,next) : next());
  } else {
    app.use('/leaderboard-api/rc-racers', (_req,res)=>res.status(503).set('Cache-Control','no-store').json({message:'Leaderboard temporarily unavailable. Local play still works.'}));
  }
  app.use(createApp({...common,launchSecret:cosmicSecret}));
  return app;
}
