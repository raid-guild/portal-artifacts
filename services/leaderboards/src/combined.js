import express from 'express';
import { createApp } from './app.js';
import { createRaidApp } from './raid-app.js';

export function createCombinedApp({ pool, origin, issuer, cosmicSecret, raidSecret, secure = true }) {
  const app=express();
  const common={pool,origin,issuer,secure};
  if (raidSecret?.length >= 32) {
    const raid=createRaidApp({...common,launchSecret:raidSecret});
    // Dispatch only Raid paths: the game app owns its own routes and catch-all.
    app.use((req,res,next)=>req.path.startsWith('/leaderboard-api/raid-survivor/') ? raid(req,res,next) : next());
  } else {
    app.use('/leaderboard-api/raid-survivor', (_req,res)=>res.status(503).json({message:'Ranked play is temporarily unavailable. Local play still works.'}));
  }
  app.use(createApp({...common,launchSecret:cosmicSecret}));
  return app;
}
