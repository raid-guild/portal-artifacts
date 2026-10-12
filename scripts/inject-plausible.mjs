import { cp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const marker = '<!-- Plausible analytics: injected at build time -->';
const snippet = `${marker}
<!-- Privacy-friendly analytics by Plausible -->
<script async src="https://plausible-production-78b3.up.railway.app/js/pa-79P_LlS6hIThPlgmf9zJS.js"></script>
<script>
  window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};
  plausible.init()
</script>`;
const linksMarker = '<!-- Artifact outbound links: injected at build time -->';
const linksSnippet = `${linksMarker}
<script defer src="/artifact-links.js"></script>`;

export function injectPlausible(html, path = '<HTML>') {
  const head = /<\/head\s*>/i;
  if (!head.test(html)) throw new Error(`Missing </head> in ${path}`);
  const additions = [
    ...(html.includes(marker) ? [] : [snippet]),
    ...(html.includes(linksMarker) ? [] : [linksSnippet])
  ];
  return additions.length ? html.replace(head, `${additions.join('\n')}\n$&`) : html;
}

export async function injectDirectory(root) {
  let count = 0;
  async function visit(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) await visit(path);
      else if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) {
        const html = await readFile(path, 'utf8');
        const updated = injectPlausible(html, relative(root, path));
        if (updated !== html) await writeFile(path, updated);
        count++;
      }
    }
  }
  await visit(root);
  return count;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const [source, destination] = process.argv.slice(2);
  if (!source || !destination) {
    console.error('Usage: node scripts/inject-plausible.mjs <source-directory> <destination-directory>');
    process.exitCode = 1;
  } else {
    try {
      await mkdir(destination, { recursive: true });
      await cp(source, destination, { recursive: true });
      const count = await injectDirectory(destination);
      console.log(`Injected analytics and outbound link tagging into ${count} HTML files in ${destination}`);
    } catch (error) {
      console.error(error);
      process.exitCode = 1;
    }
  }
}
