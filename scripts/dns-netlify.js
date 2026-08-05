const { chromium } = require('playwright');

async function addRecord(page, type, name, content) {
  console.log('  Finding add button via JS...');
  const clicked = await page.evaluate(() => {
    const btns = document.querySelectorAll('button, a');
    for (const b of btns) {
      const t = b.textContent.trim();
      if ((t === '添加解析' || t === '添加第一条解析记录') && b.offsetParent !== null) {
        b.click();
        return 'clicked: ' + t;
      }
    }
    return 'not found';
  });
  console.log('  Click:', clicked);
  await page.waitForTimeout(3000);

  await page.selectOption('#dnsModal select[name="record_type"]', type);
  await page.waitForTimeout(500);
  await page.fill('#dnsModal input[name="record_name"]', name);
  await page.waitForTimeout(300);
  await page.fill('#dnsModal input[name="record_content"]', content);
  await page.waitForTimeout(300);
  await page.selectOption('#dnsModal select[name="record_ttl"]', 'auto');
  await page.waitForTimeout(300);

  const result = await page.evaluate(() => {
    const btns = document.querySelectorAll('#dnsModal button, #dnsModal input[type="submit"]');
    for (const b of btns) {
      if ((b.type === 'submit' || b.textContent.includes('添加') || b.textContent.includes('确定') || b.textContent.includes('保存')) && b.offsetParent !== null) {
        b.click();
        return b.textContent.trim();
      }
    }
    return 'no submit found';
  });
  await page.waitForTimeout(4000);
  return result;
}

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: false });
  const page = await browser.newPage();

  console.log('Login...');
  try {
    await page.goto('https://my.dnshe.com/login.php?language=chinese', { waitUntil: 'commit', timeout: 60000 });
  } catch (e) {}
  await page.waitForSelector('input[name="username"]', { timeout: 30000 });
  await page.fill('input[name="username"]', 'carmenyym');
  await page.fill('input[name="password"]', '3ZbZYzNgf.94r8C');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(5000);

  console.log('Opening domain page...');
  try {
    await page.goto('https://my.dnshe.com/index.php?m=domain_hub&view=domain&domain_id=3731050722', { waitUntil: 'commit', timeout: 60000 });
  } catch (e) {}
  await page.waitForTimeout(8000);
  console.log('Page title:', await page.title());

  // Try clicking "DNS 解析" tab button first
  console.log('\nLooking for DNS tab...');
  const tabResult = await page.evaluate(() => {
    const btns = document.querySelectorAll('button');
    const found = [];
    for (const b of btns) {
      const t = b.textContent.trim();
      if (t.length < 30 && b.offsetParent !== null) {
        found.push(t);
        if (t.includes('DNS') && t.includes('解析')) {
          b.click();
          return { clicked: t, allBtns: found.slice(0, 30) };
        }
      }
    }
    return { clicked: 'none', allBtns: found.slice(0, 30) };
  });
  console.log('Tab result:', JSON.stringify(tabResult, null, 2));
  await page.waitForTimeout(3000);

  // Add TXT
  console.log('\n=== Adding TXT ===');
  const txt = await addRecord(page, 'TXT', 'subdomain-owner-verification', '0a7ccb698a63aa99849fee8fabd15eef');
  console.log('TXT result:', txt);
  await page.screenshot({ path: 'after-netlify-txt.png' });

  // Print records
  console.log('\n=== Records found ===');
  const text = await page.evaluate(() => document.body.innerText);
  text.split('\n').filter(l => 
    l.includes('vercel') || l.includes('_vercel') || l.includes('www') || 
    l.includes('CNAME') || l.includes('TXT') || l.includes('subdomain') ||
    l.includes('0a7ccb') || l.includes('@	')
  ).slice(0, 20).forEach(l => console.log('  ' + l));

  console.log('\nBrowser open 3 min...');
  await page.waitForTimeout(180000);
  await browser.close();
})();