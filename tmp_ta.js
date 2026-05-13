const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const out = {};
  for (const w of [390, 760, 1280]) {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: 900, isMobile: w < 760 });
    await page.goto('http://127.0.0.1:8767/pages/services/transaction-advisory.html', { waitUntil: 'networkidle0', timeout: 60000 });
    const data = await page.evaluate(() => {
      const grid = document.querySelector('.value-opt-intro-grid');
      const eyebrow = document.querySelector('.value-opt-intro-copy .section-eyebrow');
      const h2 = document.querySelector('.value-opt-intro-copy .display-lg');
      const visual = document.querySelector('.value-opt-intro-visual');
      const body1 = document.querySelector('.value-opt-intro-copy .rto_body');
      const get = el => el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : null;
      return {
        gridDisplay: getComputedStyle(grid).display,
        eyebrowTop: get(eyebrow),
        h2Top: get(h2),
        visualTop: get(visual),
        body1Top: get(body1),
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });
    out['w' + w] = data;
    await page.close();
  }
  console.log(JSON.stringify(out, null, 2));
  await browser.close();
})();
