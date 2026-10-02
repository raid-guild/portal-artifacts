import pg from 'pg';
import { createCombinedApp } from './combined.js';
const pool = new pg.Pool({ connectionString:process.env.DATABASE_URL, max:5, connectionTimeoutMillis:5000, statement_timeout:5000 });
const app = createCombinedApp({ pool, origin:process.env.ARTIFACT_ORIGIN, issuer:process.env.PORTAL_ISSUER,
  cosmicSecret:process.env.COSMIC_LAUNCH_SECRET, raidSecret:process.env.RAID_SURVIVOR_LAUNCH_SECRET,
  secure:process.env.NODE_ENV !== 'development' });
const server = app.listen(Number(process.env.PORT || 8080), '0.0.0.0', () => console.log('Leaderboard API listening.'));
process.on('SIGTERM', () => server.close(() => pool.end().then(() => process.exit(0))));
