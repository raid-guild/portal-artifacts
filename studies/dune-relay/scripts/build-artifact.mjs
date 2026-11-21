import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { cp, mkdir, rename, rm, stat } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const publishedParent = resolve(root, "../../public");
const published = resolve(publishedParent, "dune-relay");
// Keep temporary copies out of Docker's public/ tree, including after a crash.
const token = randomUUID();
const staged = resolve(root, `.artifact-stage-${token}`);
const backup = resolve(root, `.artifact-backup-${token}`);
const build = spawnSync("npm", ["run", "build"], {
  cwd: root,
  env: { ...process.env, NEXT_PUBLIC_BASE_PATH: "/dune-relay", NEXT_PUBLIC_DUNE_PLAYTEST: "0" },
  stdio: "inherit",
});
if (build.status !== 0) process.exit(build.status ?? 1);

await stat(resolve(root, "out/index.html"));
await mkdir(publishedParent, { recursive: true });
await cp(resolve(root, "out"), staged, { recursive: true });
let hadPublished = false;
try {
  try { await rename(published, backup); hadPublished = true; }
  catch (error) { if (error?.code !== "ENOENT") throw error; }
  try {
    await rename(staged, published);
  } catch (publishError) {
    if (hadPublished) {
      try { await rename(backup, published); }
      catch (rollbackError) { throw new AggregateError([publishError, rollbackError], `Publish and rollback failed; previous artifact is at ${backup}`); }
    }
    throw publishError;
  }
} finally {
  try { await rm(staged, { recursive: true, force: true }); }
  catch (error) { console.warn(`Could not remove staging directory ${staged}:`, error); }
}

// Publication is already complete. A cleanup failure must never roll back over
// the new artifact or leave an extra directory under public/.
if (hadPublished) {
  try { await rm(backup, { recursive: true, force: true }); }
  catch (error) { throw new Error(`Published ${published}, but could not remove old backup ${backup}`, { cause: error }); }
}
console.log(`Published static artifact to ${published}`);
