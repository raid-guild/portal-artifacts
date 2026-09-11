import { cp, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const sourceDirectory = dirname(fileURLToPath(import.meta.url));
const outputDirectory = join(sourceDirectory, "..", "..", "public", "module-gallery-study");
const publicFiles = ["index.html", "styles.css", "app.js", "THREE_LICENSE.txt"];

await mkdir(join(outputDirectory, "vendor"), { recursive: true });
await Promise.all(publicFiles.map((file) => cp(join(sourceDirectory, file), join(outputDirectory, file))));
await cp(join(sourceDirectory, "vendor", "three.min.js"), join(outputDirectory, "vendor", "three.min.js"));

console.log(`Built Module Gallery Study → ${outputDirectory}`);
