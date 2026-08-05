const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: false });
  const page = await browser.newPage();

  // Login
  console.log('Logging in...');
  await page.goto('https://my.dnshe.com/login.php?language=chinese', { waitUntil: 'domcontentloaded' });
  await page.fill('input[name="username"]', 'carmenyym');
  await page.fill('input[name="password"]', '3ZbZYzNgf.94r8C');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);
  console.log('After login URL:', page.url());

  // Go to client area / dashboard
  console.log('Going to dashboard...');
  await page.goto('https://my.dnshe.com/clientarea.php', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  // List all links
  console.log('\n=== Links on dashboard ===');
  const links = await page.$$eval('a', els => els.map(e => ({ text: e.textContent.trim().substring(0, 60), href: e.getAttribute('href') })).filter(e => e.text && e.href));
  links.forEach((l, i) => console.log(`${i}: ${l.text} -> ${l.href}`));

  // Look for domain-related links
  console.log('\n=== Domain related ===');
  const domainLinks = links.filter(l => l.text.includes('域') || l.text.includes('Domain') || l.text.includes('DNS') || l.text.includes('dns') || (l.href && l.href.includes('domain')));
  domainLinks.forEach((l, i) => console.log(`DOMAIN-${i}: ${l.text} -> ${l.href}`));

  // Try domain management page with hash
  console.log('\nTrying domain page...');
  try {
    await page.goto('https://my.dnshe.com/index.php?m=domain_hub&view=domain&domain_id=3731050722', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(2000);
    console.log('Domain page URL:', page.url());
    
    const dLinks = await page.$$eval('a', els => els.map(e => ({ text: e.textContent.trim().substring(0, 60), href: e.getAttribute('href') })).filter(e => e.text));
    console.log('\n=== Links on domain page ===');
    dLinks.forEach((l, i) => console.log(`${i}: ${l.text} -> ${l.href}`));

    const dButtons = await page.$$eval('button', els => els.map(e => e.textContent.trim().substring(0, 60)));
    console.log('\n=== Buttons ===');
    dButtons.forEach((b, i) => console.log(`Btn ${i}: ${b}`));

    // Also get page text snippet
    const text = await page.evaluate(() => document.body.innerText.substring(0, 2000));
    console.log('\n=== Page text ===');
    console.log(text);
  } catch (e) {
    console.log('Domain page error:', e.message.substring(0, 200));
  }

  console.log('\nKeeping browser open for 2 min...');
  await page.waitForTimeout(120000);
  await browser.close();
})();