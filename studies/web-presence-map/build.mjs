import { cp, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const sourceDirectory = dirname(fileURLToPath(import.meta.url));
const outputDirectory = join(sourceDirectory, "..", "..", "public", "web-presence-map");
const publicFiles = ["index.html", "styles.css", "app.js"];

await mkdir(outputDirectory, { recursive: true });
await Promise.all(publicFiles.map((file) => cp(join(sourceDirectory, file), join(outputDirectory, file))));

console.log(`Built RaidGuild Web Presence Map → ${outputDirectory}`);
