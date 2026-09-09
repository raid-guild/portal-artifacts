import { copyFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const sourceDirectory = dirname(fileURLToPath(import.meta.url));
const outputDirectory = join(sourceDirectory, "..", "..", "public", "motion-lab-v1");
const publicFiles = ["index.html", "styles.css", "app.js"];

await mkdir(outputDirectory, { recursive: true });
await Promise.all(
  publicFiles.map((file) => copyFile(join(sourceDirectory, file), join(outputDirectory, file))),
);

console.log(`Built Motion Lab v1 → ${outputDirectory}`);
