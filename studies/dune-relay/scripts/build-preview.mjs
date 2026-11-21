import { spawnSync } from "node:child_process";
import { cp, rm, stat } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const preview = resolve(root, "preview-out");
const build = spawnSync("npm", ["run", "build"], {
  cwd: root,
  env: { ...process.env, NEXT_PUBLIC_BASE_PATH: "/dune-relay", NEXT_PUBLIC_DUNE_PLAYTEST: "1" },
  stdio: "inherit",
});
if (build.status !== 0) process.exit(build.status ?? 1);
await stat(resolve(root, "out/index.html"));
await rm(preview, { recursive: true, force: true });
await cp(resolve(root, "out"), preview, { recursive: true });
console.log(`Local sandbox preview at ${preview}; public/dune-relay is unchanged.`);
