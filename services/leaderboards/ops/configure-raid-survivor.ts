// Run from a Portal checkout with `pnpm payload run <path> [--apply]`.
// Dry-run by default. Configure a pre-registered Raid Survivor module only.
import configPromise from '@payload-config'
import { getPayload } from 'payload'
const payload = await getPayload({ config: configPromise })
const result = await payload.find({ collection: 'modules', depth: 0, limit: 2, overrideAccess: true, where: { slug: { equals: 'raid-survivor' } } })
if (result.docs.length !== 1) throw new Error('Expected exactly one Raid Survivor module; register the external module first')
const module = result.docs[0]
const entry = 'https://portal-artifacts-production.up.railway.app/raid-survivor/'
if (module.moduleKind !== 'external' || module.entryRoute !== entry) throw new Error('Unexpected module configuration')
if (!process.env.RAID_SURVIVOR_LAUNCH_SECRET) throw new Error('Dedicated launch secret missing')
const data = {
  authMode: 'signed_launch' as const,
  externalCallbackURL: 'https://portal-artifacts-production.up.railway.app/leaderboard-api/raid-survivor/callback',
  launchAudience: 'raid-survivor',
  launchSecretEnvKey: 'RAID_SURVIVOR_LAUNCH_SECRET',
  launchTokenTTLSeconds: 120,
  includeProfileInLaunch: true,
  includeHandleInLaunch: true,
  includeEmailInLaunch: false,
  includeRolesInLaunch: false,
  includeWalletsInLaunch: false,
  includeCredentialsInLaunch: false,
  includeAvatarInLaunch: false,
}
console.log(JSON.stringify({ id: module.id, previousAuthMode: module.authMode, proposed: data }, null, 2))
if (process.argv.includes('--apply')) {
  await payload.update({ collection: 'modules', id: module.id, overrideAccess: true, data })
  console.log('Raid Survivor signed launch configured.')
}
process.exit(0)
