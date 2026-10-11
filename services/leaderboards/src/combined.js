import express from 'express';
import {createNeonApp} from './neon-app.js';
import { createApp } from './app.js';
import { createRaidApp } from './raid-app.js';

export function createCombinedApp({ pool, origin, issuer, cosmicSecret, raidSecret, neonSecret, secure = true }) {
  const app=express();
  const common={pool,origin,issuer,secure};
  if (raidSecret?.length >= 32) {
    const raid=createRaidApp({...common,launchSecret:raidSecret});
    // Dispatch only Raid paths: the game app owns its own routes and catch-all.
    app.use((req,res,next)=>req.path.startsWith('/leaderboard-api/raid-survivor/') ? raid(req,res,next) : next());
  } else {
    app.use('/leaderboard-api/raid-survivor', (_req,res)=>res.status(503).json({message:'Ranked play is temporarily unavailable. Local play still works.'}));
  }
  if(neonSecret?.length>=32){const neon=createNeonApp({...common,launchSecret:neonSecret});app.use((req,res,next)=>req.path.startsWith('/leaderboard-api/neon-drop/')?neon(req,res,next):next());}
  else app.use('/leaderboard-api/neon-drop',(_req,res)=>res.status(503).json({message:'Leaderboard unavailable. Local practice works.'}));
  app.use(createApp({...common,launchSecret:cosmicSecret}));
  return app;
}
