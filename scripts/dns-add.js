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

  // Go to domain page
  console.log('Going to domain page...');
  await page.goto('https://my.dnshe.com/index.php?m=domain_hub&view=domain&domain_id=3731050722', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  // Click "DNS 解析" tab to see existing records
  console.log('Clicking DNS 解析 tab...');
  const dnsTab = await page.$$('button', { text: 'DNS 解析' });
  // Find the tab button with text "DNS 解析"
  const allButtons = await page.$$('button');
  for (const btn of allButtons) {
    const text = await btn.textContent();
    if (text.includes('DNS 解析') && text.length < 20) {
      await btn.click();
      break;
    }
  }
  await page.waitForTimeout(2000);

  // Take screenshot to see current state
  await page.screenshot({ path: 'dns-records.png', fullPage: true });
  console.log('Screenshot saved');

  // Print page text to see existing records
  const text = await page.evaluate(() => document.body.innerText);
  console.log('\n=== Page text (DNS records area) ===');
  // Find the section with DNS records
  const dnsSection = text.split('\n').filter(l => l.includes('解析') || l.includes('TXT') || l.includes('CNAME') || l.includes('A记录') || l.includes('A ')).join('\n');
  console.log(dnsSection || text.substring(0, 3000));

  // Now click "添加解析" button
  console.log('\nClicking 添加解析...');
  const addBtn = await page.$('button:has-text("添加解析")');
  if (addBtn) {
    await addBtn.click();
    await page.waitForTimeout(2000);
    console.log('Add form opened');

    // Screenshot the form
    await page.screenshot({ path: 'dns-add-form.png', fullPage: true });

    // Print form elements
    const formElements = await page.$$eval('select, input', els => els.map(e => ({
      tag: e.tagName,
      name: e.name || e.id || '',
      type: e.type || '',
      placeholder: e.placeholder || '',
      value: e.value || '',
      options: e.tagName === 'SELECT' ? Array.from(e.options).map(o => o.text + ':' + o.value) : []
    })));
    console.log('\n=== Form elements ===');
    formElements.forEach((el, i) => {
      console.log(`${i}: ${el.tag} name="${el.name}" type="${el.type}" placeholder="${el.placeholder}"${el.options ? ' options=' + el.options.join(',') : ''}`);
    });
  } else {
    console.log('Could not find 添加解析 button');
  }

  console.log('\nKeeping browser open...');
  await page.waitForTimeout(120000);
  await browser.close();
})();