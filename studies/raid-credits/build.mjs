import { cp, mkdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const sourceDirectory = dirname(fileURLToPath(import.meta.url));
const outputDirectory = join(sourceDirectory, "..", "..", "public", "raid-credits");
const publicFiles = ["index.html", "styles.css", "members.js", "app.js"];

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });
await Promise.all(publicFiles.map((file) => cp(join(sourceDirectory, file), join(outputDirectory, file))));
await cp(join(sourceDirectory, "assets"), join(outputDirectory, "assets"), { recursive: true });

console.log(`Built Raid Credits → ${outputDirectory}`);
