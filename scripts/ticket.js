const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: false });
  const page = await browser.newPage();

  // Login
  console.log('Login...');
  await page.goto('https://my.dnshe.com/login.php?language=chinese');
  await page.fill('input[name="username"]', 'carmenyym');
  await page.fill('input[name="password"]', '3ZbZYzNgf.94r8C');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(4000);

  // Go to submit ticket page
  console.log('Opening submit ticket page...');
  await page.goto('https://my.dnshe.com/submitticket.php');
  await page.waitForTimeout(3000);

  // Screenshot to see the form
  await page.screenshot({ path: 'ticket-form.png', fullPage: true });

  // List all form elements
  const fields = await page.$$eval('select, input, textarea', els => els.map(e => ({
    tag: e.tagName,
    name: e.name || e.id || '',
    type: e.type || '',
    placeholder: e.placeholder || '',
    visible: e.offsetParent !== null,
    options: e.tagName === 'SELECT' ? Array.from(e.options).map(o => o.text + ':' + o.value) : []
  })));
  console.log('\n=== Form fields ===');
  fields.forEach((f, i) => console.log(`${i}: ${f.tag} name="${f.name}" type="${f.type}" visible=${f.visible}${f.options ? ' options=' + f.options.join(',') : ''} placeholder="${f.placeholder}"`));

  console.log('\nKeeping open...');
  await page.waitForTimeout(120000);
  await browser.close();
})();