// Renders page 1 of a PDF as a JPG using Puppeteer
const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const pdfPath = path.resolve('assets/white-papers/exit-readiness-gap-2026-q2.pdf');
  const outPath = path.resolve('assets/images/exit-readiness-gap-cover.jpg');
  const fileUrl = 'file:///' + pdfPath.replace(/\\/g, '/');

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 2 });
  await page.goto(fileUrl, { waitUntil: 'networkidle2', timeout: 60000 });
  // Give the PDF viewer a moment to render
  await new Promise(r => setTimeout(r, 2500));
  await page.screenshot({ path: outPath, type: 'jpeg', quality: 90, fullPage: false });
  await browser.close();
  console.log('Wrote', outPath);
})().catch(e => { console.error(e); process.exit(1); });
