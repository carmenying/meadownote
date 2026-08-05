const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: false });
  const page = await browser.newPage();

  console.log('Login...');
  await page.goto('https://my.dnshe.com/login.php?language=chinese', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.fill('input[name="username"]', 'carmenyym');
  await page.fill('input[name="password"]', '3ZbZYzNgf.94r8C');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(4000);

  console.log('Opening submit ticket page...');
  await page.goto('https://my.dnshe.com/submitticket.php', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);

  // Get all visible form elements including selects
  const allFields = await page.$$eval('select, input, textarea', els => els.map(e => ({
    tag: e.tagName, name: e.name || e.id || '', type: e.type || '',
    placeholder: e.placeholder || '', visible: e.offsetParent !== null,
    options: e.tagName === 'SELECT' ? Array.from(e.options).map(o => o.text + ':' + o.value) : []
  })));
  console.log('=== Form fields (all) ===');
  allFields.forEach((f, i) => console.log(`${i}: ${f.tag} name="${f.name}" type="${f.type}" vis=${f.visible}${f.options ? '\n    options: ' + f.options.join(' | ') : ''} placeholder="${f.placeholder}"`));

  // Also list all buttons
  console.log('\n=== Buttons ===');
  const btns = await page.$$eval('button', els => els.map(e => ({ text: e.textContent.trim().substring(0, 40), type: e.type, visible: e.offsetParent !== null })));
  btns.forEach((b, i) => console.log(`Btn${i}: visible=${b.visible} type=${b.type} "${b.text}"`));

  // Print all links
  console.log('\n=== Links ===');
  const links = await page.$$eval('a', els => els.map(e => ({ text: e.textContent.trim().substring(0, 50), href: e.getAttribute('href') })).filter(e => e.text && e.text.length < 50));
  links.forEach((l, i) => console.log(`${i}: ${l.text} -> ${l.href}`));

  // Page text
  console.log('\n=== Page text ===');
  const text = await page.evaluate(() => document.body.innerText.substring(0, 2000));
  console.log(text);

  console.log('\nDone');
  await browser.close();
})();