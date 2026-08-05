const { chromium } = require('playwright');

async function addRecord(page, type, name, content) {
  await page.evaluate(() => {
    const btns = document.querySelectorAll('button');
    for (const b of btns) {
      if (b.textContent.includes('添加解析') && b.textContent.length < 30 && b.offsetParent !== null) {
        b.click();
        return true;
      }
    }
  });
  await page.waitForTimeout(2000);

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
  await page.goto('https://my.dnshe.com/login.php?language=chinese');
  await page.fill('input[name="username"]', 'carmenyym');
  await page.fill('input[name="password"]', '3ZbZYzNgf.94r8C');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(4000);

  console.log('Opening domain page...');
  await page.goto('https://my.dnshe.com/index.php?m=domain_hub&view=domain&domain_id=3731050722');
  await page.waitForTimeout(5000);

  // Add CNAME for www
  console.log('\n=== Adding CNAME ===');
  const cname = await addRecord(page, 'CNAME', 'www', '2f36f6c2803d418a.vercel-dns-017.com.');
  console.log('CNAME submit:', cname);
  await page.screenshot({ path: 'after-cname-www.png' });

  // Add TXT for _vercel
  console.log('\n=== Adding TXT ===');
  const txt = await addRecord(page, 'TXT', '_vercel', 'vc-domain-verify=www.meadownote.bot.cd,6a30e6d5aa6ccb360217');
  console.log('TXT submit:', txt);
  await page.screenshot({ path: 'after-txt-www.png' });

  // Print current records
  console.log('\n=== Current records ===');
  const text = await page.evaluate(() => document.body.innerText);
  text.split('\n').filter(l => l.includes('vercel') || l.includes('_vercel') || l.includes('www') || l.includes('CNAME') || l.includes('TXT')).forEach(l => console.log('  ' + l));

  console.log('\nDone! Browser open 2 min...');
  await page.waitForTimeout(120000);
  await browser.close();
})();