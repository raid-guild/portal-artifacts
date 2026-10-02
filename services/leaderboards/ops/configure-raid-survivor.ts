// Copy into a Portal checkout and run `pnpm payload run scripts/configure-raid-survivor.ts`.
// Dry-run by default; --apply explicitly writes only Raid Survivor launch auth.
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { writeFile, chmod } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

const moduleID = 44
const agentID = 13
const entryRoute = 'https://portal-artifacts-production.up.railway.app/raid-survivor/'
const receiptPath = process.env.RAID_SURVIVOR_AUTH_RECEIPT_PATH || path.join(tmpdir(), 'raid-survivor-auth-receipt.json')
const authFields = [
  'authMode', 'externalCallbackURL', 'launchAudience', 'launchSecretEnvKey', 'launchTokenTTLSeconds',
  'includeProfileInLaunch', 'includeHandleInLaunch', 'includeEmailInLaunch', 'includeRolesInLaunch',
  'includeWalletsInLaunch', 'includeCredentialsInLaunch', 'includeAvatarInLaunch',
] as const
const proposed = {
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
const authOnly = (module: Record<string, unknown>) => Object.fromEntries(authFields.map(key => [key, module[key] ?? null]))
async function saveReceipt(receipt: unknown) {
  await writeFile(receiptPath, JSON.stringify(receipt, null, 2) + '\n', { mode: 0o600 })
  await chmod(receiptPath, 0o600)
}

async function main() {
  if (!process.env.RAID_SURVIVOR_LAUNCH_SECRET?.trim()) throw new Error('Dedicated Raid Survivor launch secret is missing in this Portal runtime')
  const payload = await getPayload({ config: configPromise })
  const agent = await payload.findByID({ collection: 'users', id: agentID, depth: 0, overrideAccess: true })
  if (String(agent.id) !== String(agentID) || agent.name !== 'Queen Raida' || !Array.isArray(agent.roles) ||
      !agent.roles.includes('agent') || !agent.roles.some(role => role === 'editor' || role === 'admin')) {
    throw new Error('Expected the existing Queen Raida automation account with agent and editor/admin roles')
  }
  const user = { ...agent, collection: 'users' as const }
  const matches = await payload.find({ collection: 'modules', depth: 0, limit: 2, overrideAccess: false, user,
    where: { slug: { equals: 'raid-survivor' } } })
  if (matches.totalDocs !== 1 || matches.docs.length !== 1) throw new Error('Expected exactly one Raid Survivor module')
  const module = matches.docs[0]
  if (String(module.id) !== String(moduleID) || module.name !== 'Raid Survivor' || module.slug !== 'raid-survivor' ||
      module.moduleKind !== 'external' || module.entryRoute !== entryRoute) {
    throw new Error('Raid Survivor module ID, identity, kind, or entry route differs from the reviewed record')
  }
  const priorAuth = authOnly(module as Record<string, unknown>)
  const unchanged = authFields.every(key => module[key] === proposed[key])
  const receipt: Record<string, unknown> = {
    mode: process.argv.includes('--apply') ? 'apply' : 'dry-run', moduleID, automationUserID: agentID,
    priorAuth, proposedAuth: proposed, unchanged, resultAuth: null,
  }
  await saveReceipt(receipt)
  console.log(JSON.stringify({ mode: receipt.mode, moduleID, automationUserID: agentID, unchanged, receiptPath, proposedAuth: proposed }, null, 2))
  if (!process.argv.includes('--apply')) return
  if (!unchanged) await payload.update({ collection: 'modules', id: moduleID, data: proposed,
    depth: 0, overrideAccess: false, user, context: { skipNotificationHooks: true } })
  const readback = await payload.findByID({ collection: 'modules', id: moduleID, depth: 0, overrideAccess: false, user })
  receipt.resultAuth = authOnly(readback as Record<string, unknown>)
  await saveReceipt(receipt)
  if (!authFields.every(key => readback[key] === proposed[key])) throw new Error(`Launch auth readback differs; inspect ${receiptPath}`)
  console.log(JSON.stringify({ configured: true, moduleID, unchanged, receiptPath }, null, 2))
}

try {
  await main()
  process.exit(0)
} catch (error) {
  console.error('Raid Survivor launch configuration stopped:', error instanceof Error ? error.message : String(error))
  process.exit(1)
}
