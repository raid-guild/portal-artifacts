// Copy into a Portal checkout and run with `pnpm payload run scripts/register-raid-survivor.ts`.
// Dry-run by default. `--apply` is the only switch that writes Portal data.
// Set RAID_SURVIVOR_COVER_PATH to the local copy of the approved PNG.
// Set RAID_SURVIVOR_AGENT_ID to the existing automation user's exact ID (production: 13).
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { createHash } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

const slug = 'raid-survivor'
const name = 'Raid Survivor'
const filename = 'raid-survivor-social-v1.png'
const expectedHash = '6983ad80a66a44b53c2d694cf22c42393789c45da24d1ff564433740130d3072'
const entryRoute = 'https://portal-artifacts-production.up.railway.app/raid-survivor/'
const summary = 'Choose a champion, survive the vault’s hordes, and build powerful weapon combinations in this single-player RaidGuild arcade shooter.'
const repositoryURL = 'https://github.com/raid-guild/portal-artifacts'
const receiptPath = path.join(tmpdir(), 'raid-survivor-registration-receipt.json')
const apply = process.argv.includes('--apply')
const digest = (bytes: Buffer) => createHash('sha256').update(bytes).digest('hex')
const idOf = (value: unknown): number | string | null =>
  typeof value === 'number' || typeof value === 'string' ? value :
  value && typeof value === 'object' && 'id' in value &&
  (typeof value.id === 'number' || typeof value.id === 'string') ? value.id : null

async function main() {
  const coverPath = process.env.RAID_SURVIVOR_COVER_PATH
  if (!coverPath) throw new Error('Set RAID_SURVIVOR_COVER_PATH to the approved PNG in this container')
  const agentID = Number(process.env.RAID_SURVIVOR_AGENT_ID || '13')
  if (!Number.isSafeInteger(agentID) || agentID <= 0) throw new Error('Invalid RAID_SURVIVOR_AGENT_ID')
  const cover = await readFile(coverPath)
  if (digest(cover) !== expectedHash) throw new Error('Cover checksum does not match the approved social image')
  const payload = await getPayload({ config: configPromise })
  const agent = await payload.findByID({ collection: 'users', id: agentID, depth: 0, overrideAccess: true })
  if (String(agent.id) !== String(agentID) || agent.name !== 'Queen Raida' || !Array.isArray(agent.roles) ||
      !agent.roles.includes('agent') || !agent.roles.some((role) => role === 'editor' || role === 'admin')) {
    throw new Error('Expected the existing Queen Raida automation account with agent and editor/admin roles')
  }
  const user = { ...agent, collection: 'users' as const }
  const modules = await payload.find({
    collection: 'modules', depth: 0, limit: 10, overrideAccess: false, user,
    where: { or: [{ slug: { equals: slug } }, { name: { equals: name } }, { entryRoute: { equals: entryRoute } }] },
  })
  if (modules.hasNextPage || modules.docs.length > 1) throw new Error('Ambiguous existing Raid Survivor module')
  const previous = modules.docs[0] ?? null
  if (previous && (previous.slug !== slug || previous.name !== name || previous.entryRoute !== entryRoute || previous.moduleKind !== 'external')) {
    throw new Error('Existing module identity or entry route does not match the requested game')
  }
  const media = await payload.find({
    collection: 'media', depth: 0, limit: 2, overrideAccess: false, user,
    where: { filename: { equals: filename } },
  })
  if (media.hasNextPage || media.docs.length > 1) throw new Error('Ambiguous existing cover media')
  const mediaDir = process.env.RAID_SURVIVOR_MEDIA_DIR || path.resolve(process.cwd(), 'public/media')
  const publishedFile = path.join(mediaDir, filename)
  let publishedBytes: Buffer | null = null
  try { publishedBytes = await readFile(publishedFile) } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
  }
  if (publishedBytes && digest(publishedBytes) !== expectedHash) throw new Error('Published filename contains different bytes; refusing overwrite')
  if (media.docs.length && !publishedBytes) throw new Error('Media document exists but original file is missing')
  if (!media.docs.length && publishedBytes) throw new Error('Published file exists without media document; reconcile before upload')
  const existingMedia = media.docs[0] ?? null
  const priorNotificationCount = previous ? (await payload.find({
    collection: 'notifications', depth: 0, limit: 1, overrideAccess: false, user,
    where: { relatedModule: { equals: previous.id } },
  })).totalDocs : 0
  const proposed = previous
    ? { summary, category: 'games', thumbnail: existingMedia?.id ?? '<new media ID>' }
    : {
        name, slug, summary, category: 'games', status: 'experimental', enabled: true,
        featured: false, visibility: 'public', moduleKind: 'external', entryRoute,
        repositoryURL, thumbnail: existingMedia?.id ?? '<new media ID>', authMode: 'none',
        includeEmailInLaunch: false, includeRolesInLaunch: false,
        includeProfileInLaunch: false, includeHandleInLaunch: false,
        includeWalletsInLaunch: false, includeCredentialsInLaunch: false,
        includeAvatarInLaunch: false,
      }
  const receipt: Record<string, unknown> = {
    mode: apply ? 'apply' : 'dry-run', coverPath, coverHash: expectedHash, mediaDir,
    automationUser: { id: agent.id, name: agent.name, roles: agent.roles },
    prior: { module: previous, media: existingMedia, notificationCount: priorNotificationCount }, proposed,
    result: null,
  }
  const saveReceipt = () => writeFile(receiptPath, JSON.stringify(receipt, null, 2) + '\n', { mode: 0o600 })
  await saveReceipt()
  console.log(JSON.stringify({ mode: receipt.mode, receiptPath, existingModuleID: previous?.id ?? null,
    existingMediaID: existingMedia?.id ?? null, proposed }, null, 2))
  if (!apply) return

  let thumbnailID = existingMedia?.id
  if (!thumbnailID) {
    const createdMedia = await payload.create({
      collection: 'media', data: { alt: 'Raid Survivor cover artwork: ranger, wizard, and dwarf facing Moloch and a dungeon horde' },
      file: { name: filename, data: cover, mimetype: 'image/png', size: cover.byteLength },
      overrideAccess: false, user, context: { skipNotificationHooks: true },
    })
    thumbnailID = createdMedia.id
    receipt.result = { mediaID: thumbnailID, moduleID: null }
    await saveReceipt()
    const createdFile = await readFile(publishedFile)
    if (digest(createdFile) !== expectedHash) throw new Error('Uploaded media original does not match approved bytes')
  }
  const unchanged = previous && previous.summary === summary && previous.category === 'games' &&
    idOf(previous.thumbnail) === thumbnailID
  const updateData = { summary, category: 'games' as const, thumbnail: thumbnailID }
  const createData = {
    name, slug, summary, category: 'games' as const, status: 'experimental' as const,
    enabled: true, featured: false, visibility: 'public' as const,
    moduleKind: 'external' as const, entryRoute, repositoryURL,
    thumbnail: thumbnailID, authMode: 'none' as const,
    includeEmailInLaunch: false, includeRolesInLaunch: false,
    includeProfileInLaunch: false, includeHandleInLaunch: false,
    includeWalletsInLaunch: false, includeCredentialsInLaunch: false,
    includeAvatarInLaunch: false,
  }
  const module = unchanged ? previous : previous
    ? await payload.update({ collection: 'modules', id: previous.id, data: updateData,
        depth: 0, overrideAccess: false, user, context: { skipNotificationHooks: true } })
    : await payload.create({ collection: 'modules', data: createData,
        depth: 0, overrideAccess: false, user, context: { skipNotificationHooks: true } })
  if (!module) throw new Error('Module registration returned no document')
  const notificationCount = (await payload.find({
    collection: 'notifications', depth: 0, limit: 1, overrideAccess: false, user,
    where: { relatedModule: { equals: module.id } },
  })).totalDocs
  receipt.result = { mediaID: thumbnailID, moduleID: module.id, unchanged: !!unchanged,
    notificationCount, priorNotificationCount,
    module: { name: module.name, slug: module.slug, summary: module.summary,
      category: module.category, status: module.status, enabled: module.enabled,
      featured: module.featured, visibility: module.visibility, moduleKind: module.moduleKind,
      entryRoute: module.entryRoute, repositoryURL: module.repositoryURL,
      thumbnail: idOf(module.thumbnail), authMode: module.authMode } }
  await saveReceipt()
  if (notificationCount > priorNotificationCount) throw new Error('Module registration created notifications; inspect receipt')
  console.log(JSON.stringify({ receiptPath, mediaID: thumbnailID, moduleID: module.id, notificationCount }, null, 2))
}

try {
  await main()
  process.exit(0)
} catch (error) {
  console.error('Raid Survivor registration stopped:', error instanceof Error ? error.message : String(error))
  process.exit(1)
}
