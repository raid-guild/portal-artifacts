// Copy into a Portal checkout and run with Payload's CLI. Dry-run by default.
// --apply creates the reviewed Dune module, or updates only launch fields on a matching module.
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { writeFile, chmod } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

const entryRoute = 'https://portal-artifacts-production.up.railway.app/dune-relay/'
const callback = 'https://portal-artifacts-production.up.railway.app/leaderboard-api/dune-relay/callback'
const receiptPath = process.env.DUNE_AUTH_RECEIPT_PATH || path.join(tmpdir(), 'dune-relay-auth-receipt.json')
const authFields = [
  'authMode', 'externalCallbackURL', 'launchAudience', 'launchSecretEnvKey', 'launchTokenTTLSeconds',
  'includeProfileInLaunch', 'includeHandleInLaunch', 'includeEmailInLaunch', 'includeRolesInLaunch',
  'includeWalletsInLaunch', 'includeCredentialsInLaunch', 'includeAvatarInLaunch',
] as const
const auth = {
  authMode: 'signed_launch' as const, externalCallbackURL: callback,
  launchAudience: 'dune-relay', launchSecretEnvKey: 'DUNE_RELAY_LAUNCH_SECRET', launchTokenTTLSeconds: 120,
  includeProfileInLaunch: true, includeHandleInLaunch: true, includeEmailInLaunch: false,
  includeRolesInLaunch: false, includeWalletsInLaunch: false, includeCredentialsInLaunch: false,
  includeAvatarInLaunch: false,
}
const createFields = {
  name: 'Dune Relay', slug: 'dune-relay', summary: 'Restore the kingdom in a story-driven match-three adventure.',
  status: 'prototype' as const, category: 'games' as const, visibility: 'authenticated' as const,
  enabled: true, featured: false, entryRoute, moduleKind: 'external' as const,
  launchRequiredRoles: [], ...auth,
}
const authOnly = (module: Record<string, unknown>) => Object.fromEntries(authFields.map(key => [key, module[key] ?? null]))
async function receipt(data: unknown) {
  await writeFile(receiptPath, JSON.stringify(data, null, 2) + '\n', { mode: 0o600 })
  await chmod(receiptPath, 0o600)
}
async function main() {
  if (!process.env.DUNE_RELAY_LAUNCH_SECRET || process.env.DUNE_RELAY_LAUNCH_SECRET.length < 32)
    throw new Error('Dedicated Dune launch secret is missing or too short')
  const payload = await getPayload({ config: configPromise })
  const matches = await payload.find({ collection: 'modules', depth: 0, limit: 2, overrideAccess: true,
    where: { slug: { equals: 'dune-relay' } } })
  if (matches.totalDocs > 1) throw new Error('Expected at most one Dune Relay module')
  const module = matches.docs[0]
  if (module && (module.slug !== 'dune-relay' || module.moduleKind !== 'external' || module.entryRoute !== entryRoute || module.visibility === 'member' || module.visibility === 'admin'))
    throw new Error('Dune module identity, kind, entry route, or visibility differs from the reviewed record')
  const unchanged = Boolean(module && authFields.every(key => module[key] === auth[key]))
  const record: Record<string, unknown> = { mode: process.argv.includes('--apply') ? 'apply' : 'dry-run',
    moduleID: module?.id ?? null, action: module ? unchanged ? 'unchanged' : 'update-auth' : 'create',
    priorAuth: module ? authOnly(module as Record<string, unknown>) : null, proposed: module ? auth : createFields, result: null }
  await receipt(record)
  console.log(JSON.stringify({ mode: record.mode, moduleID: record.moduleID, action: record.action, receiptPath,
    proposed: module ? auth : createFields }, null, 2))
  if (!process.argv.includes('--apply')) return
  if (!module) await payload.create({ collection: 'modules', depth: 0, overrideAccess: true,
    data: createFields, context: { skipNotificationHooks: true } })
  else if (!unchanged) await payload.update({ collection: 'modules', id: module.id, depth: 0, overrideAccess: true,
    data: auth, context: { skipNotificationHooks: true } })
  const result = await payload.find({ collection: 'modules', depth: 0, limit: 2, overrideAccess: true,
    where: { slug: { equals: 'dune-relay' } } })
  const readback = result.docs[0]
  record.result = readback ? { id: readback.id, slug: readback.slug, entryRoute: readback.entryRoute,
    auth: authOnly(readback as Record<string, unknown>) } : null
  await receipt(record)
  if (result.totalDocs !== 1 || !readback || readback.entryRoute !== entryRoute || !authFields.every(key => readback[key] === auth[key]))
    throw new Error(`Launch auth readback differs; inspect ${receiptPath}`)
  console.log(JSON.stringify({ configured: true, moduleID: readback.id, unchanged, receiptPath }))
}
try { await main(); process.exit(0) }
catch (error) { console.error('Dune launch configuration stopped:', error instanceof Error ? error.message : String(error)); process.exit(1) }
