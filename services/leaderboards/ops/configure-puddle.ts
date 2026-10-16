// Copy into a Portal checkout and run with its Payload CLI. Dry-run by default.
// --apply changes only signed-launch fields after the module identity checks.
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { writeFile, chmod } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

const entryRoute = 'https://portal-artifacts-production.up.railway.app/puddle-study/'
const callback = 'https://portal-artifacts-production.up.railway.app/leaderboard-api/puddle-study/callback'
const receiptPath = process.env.PUDDLE_AUTH_RECEIPT_PATH || path.join(tmpdir(), 'puddle-auth-receipt.json')
const fields = [
  'authMode', 'externalCallbackURL', 'launchAudience', 'launchSecretEnvKey', 'launchTokenTTLSeconds',
  'includeProfileInLaunch', 'includeHandleInLaunch', 'includeEmailInLaunch', 'includeRolesInLaunch',
  'includeWalletsInLaunch', 'includeCredentialsInLaunch', 'includeAvatarInLaunch',
] as const
const proposed = {
  authMode: 'signed_launch' as const, externalCallbackURL: callback,
  launchAudience: 'puddle-study', launchSecretEnvKey: 'PUDDLE_LAUNCH_SECRET', launchTokenTTLSeconds: 120,
  includeProfileInLaunch: true, includeHandleInLaunch: true, includeEmailInLaunch: false,
  includeRolesInLaunch: false, includeWalletsInLaunch: false, includeCredentialsInLaunch: false,
  includeAvatarInLaunch: false,
}
const authOnly = (module: Record<string, unknown>) => Object.fromEntries(fields.map(key => [key, module[key] ?? null]))
async function receipt(data: unknown) {
  await writeFile(receiptPath, JSON.stringify(data, null, 2) + '\n', { mode: 0o600 })
  await chmod(receiptPath, 0o600)
}
async function main() {
  if (!process.env.PUDDLE_LAUNCH_SECRET || process.env.PUDDLE_LAUNCH_SECRET.length < 32)
    throw new Error('Dedicated Puddle launch secret is missing or too short')
  const payload = await getPayload({ config: configPromise })
  const matches = await payload.find({ collection: 'modules', depth: 0, limit: 2, overrideAccess: true,
    where: { slug: { equals: 'puddle-study' } } })
  if (matches.totalDocs !== 1 || matches.docs.length !== 1) throw new Error('Expected exactly one Puddle module')
  const module = matches.docs[0]
  if (module.slug !== 'puddle-study' || module.moduleKind !== 'external' || module.entryRoute !== entryRoute)
    throw new Error('Puddle module identity, kind, or entry route differs from the reviewed record')
  const unchanged = fields.every(key => module[key] === proposed[key])
  const record: Record<string, unknown> = { mode: process.argv.includes('--apply') ? 'apply' : 'dry-run',
    moduleID: module.id, priorAuth: authOnly(module as Record<string, unknown>), proposedAuth: proposed,
    unchanged, resultAuth: null }
  await receipt(record)
  console.log(JSON.stringify({ mode: record.mode, moduleID: module.id, unchanged, receiptPath,
    proposedAuth: proposed }, null, 2))
  if (!process.argv.includes('--apply')) return
  if (!unchanged) await payload.update({ collection: 'modules', id: module.id, depth: 0, overrideAccess: true,
    data: proposed, context: { skipNotificationHooks: true } })
  const readback = await payload.findByID({ collection: 'modules', id: module.id, depth: 0, overrideAccess: true })
  record.resultAuth = authOnly(readback as Record<string, unknown>)
  await receipt(record)
  if (!fields.every(key => readback[key] === proposed[key])) throw new Error(`Launch auth readback differs; inspect ${receiptPath}`)
  console.log(JSON.stringify({ configured: true, moduleID: module.id, unchanged, receiptPath }))
}
try { await main(); process.exit(0) }
catch (error) { console.error('Puddle launch configuration stopped:', error instanceof Error ? error.message : String(error)); process.exit(1) }
