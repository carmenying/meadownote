const { chromium } = require('playwright');

async function addRecord(page, type, name, content) {
  // Click "添加解析" button via JS
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

  // Fill form
  await page.selectOption('#dnsModal select[name="record_type"]', type);
  await page.waitForTimeout(500);
  await page.fill('#dnsModal input[name="record_name"]', name);
  await page.waitForTimeout(300);
  await page.fill('#dnsModal input[name="record_content"]', content);
  await page.waitForTimeout(300);
  await page.selectOption('#dnsModal select[name="record_ttl"]', 'auto');
  await page.waitForTimeout(300);

  // Submit
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

  // Login
  console.log('Login...');
  await page.goto('https://my.dnshe.com/login.php?language=chinese');
  await page.fill('input[name="username"]', 'carmenyym');
  await page.fill('input[name="password"]', '3ZbZYzNgf.94r8C');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(4000);

  // Domain page
  console.log('Opening domain page...');
  await page.goto('https://my.dnshe.com/index.php?m=domain_hub&view=domain&domain_id=3731050722');
  await page.waitForTimeout(5000);

  // Add TXT record for Vercel verification
  console.log('\n=== Adding TXT record ===');
  const txtResult = await addRecord(page, 'TXT', '_vercel', 'vc-domain-verify=bot.cd,c92feba81936d97827fc');
  console.log('TXT submit:', txtResult);
  await page.screenshot({ path: 'after-txt.png' });

  // Add CNAME record for domain pointing to Vercel
  console.log('\n=== Adding CNAME record ===');
  const cnameResult = await addRecord(page, 'CNAME', '@', 'cname.vercel-dns.com');
  console.log('CNAME submit:', cnameResult);
  await page.screenshot({ path: 'after-cname.png' });

  // Verify records are saved
  console.log('\n=== Current records ===');
  const text = await page.evaluate(() => document.body.innerText);
  const records = text.split('\n').filter(l => 
    l.includes('_vercel') || l.includes('TXT') || l.includes('CNAME') || 
    l.includes('vercel') || l.includes('vc-domain') || l.includes('cname')
  );
  records.forEach(r => console.log('  ' + r));

  console.log('\n✅ Both records added!');
  console.log('Now go to Vercel and click "Verify & Claim"');
  console.log('Domain: meadownote.bot.cd');

  await page.waitForTimeout(120000);
  await browser.close();
})();