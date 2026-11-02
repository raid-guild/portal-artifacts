// Export the workbook overlay using the same print CSS as the published edition.
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');

async function main() {
  const output = process.argv[2];
  if (!output) throw new Error('Usage: node export-dense.cjs OUTPUT.pdf');
  const input = path.resolve(__dirname, '../../../public/raidguild-field-guide/integrated-content-print.html');
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.goto(pathToFileURL(input).href, { waitUntil: 'load' });
    await page.emulateMedia({ media: 'print' });
    await page.evaluate(() => document.fonts.ready);
    await page.pdf({ path: path.resolve(output), preferCSSPageSize: true, printBackground: true });
  } finally {
    await browser.close();
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
