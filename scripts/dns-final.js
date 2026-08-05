const { chromium } = require('playwright');

async function addRecord(page, type, name, content) {
  // Click the "添加解析" button
  console.log('  Looking for 添加解析 button...');
  
  // Try multiple ways to find it
  let clicked = false;
  
  // Method 1: Direct text
  try {
    await page.click('text=添加解析', { timeout: 10000 });
    clicked = true;
    console.log('  Clicked via text=添加解析');
  } catch (e) {
    console.log('  text= failed, trying other methods...');
  }

  if (!clicked) {
    // Method 2: Find by role and text
    try {
      await page.getByRole('button', { name: /添加解析/ }).click({ timeout: 5000 });
      clicked = true;
      console.log('  Clicked via getByRole');
    } catch (e) {}
  }

  if (!clicked) {
    // Method 3: Evaluate all elements
    const handle = await page.evaluateHandle(() => {
      const all = document.querySelectorAll('*');
      for (const e of all) {
        if (e.children.length < 3 && e.textContent.includes('添加解析') && !e.textContent.includes('第一条') && e.offsetParent !== null) {
          return e;
        }
      }
      return null;
    });
    if (handle) {
      await handle.click({ timeout: 5000 });
      clicked = true;
      console.log('  Clicked via evaluateHandle');
    }
  }

  if (!clicked) {
    console.log('  Cannot find 添加解析 button!');
    return false;
  }

  await page.waitForTimeout(2000);

  // Fill form inside modal
  const modal = page.locator('#dnsModal');
  
  await modal.locator('select[name="record_type"]').selectOption(type);
  await page.waitForTimeout(500);
  await modal.locator('input[name="record_name"]').fill(name);
  await page.waitForTimeout(300);
  await modal.locator('input[name="record_content"]').fill(content);
  await page.waitForTimeout(500);
  await modal.locator('select[name="record_ttl"]').selectOption('auto');
  await page.waitForTimeout(300);

  // Find submit button inside modal
  console.log('  Looking for save button...');
  const modalBtns = await modal.locator('button, input[type="submit"]').all();
  for (const btn of modalBtns) {
    const text = (await btn.textContent()).trim();
    const btnType = await btn.getAttribute('type');
    if (btnType === 'submit' || text.includes('添加') || text.includes('保存') || text.includes('确定')) {
      console.log(`  Clicking save: "${text}" type=${btnType}`);
      await btn.click();
      await page.waitForTimeout(3000);
      return true;
    }
  }
  console.log('  No save button found');
  return false;
}

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

  // Domain page
  console.log('Going to domain page...');
  await page.goto('https://my.dnshe.com/index.php?m=domain_hub&view=domain&domain_id=3731050722', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(5000);

  // Click "DNS 解析" tab first
  console.log('Clicking DNS 解析 tab...');
  try {
    await page.click('text=DNS 解析', { timeout: 5000 });
    console.log('Clicked DNS 解析 tab');
  } catch (e) {
    console.log('DNS 解析 tab click failed, continuing...');
  }
  await page.waitForTimeout(2000);

  // Screenshot to see current state
  await page.screenshot({ path: 'before-add.png', fullPage: true });

  // Add TXT record
  console.log('\n=== Adding TXT ===');
  const txtOk = await addRecord(page, 'TXT', '_vercel', 'vc-domain-verify=bot.cd,c92feba81936d97827fc');
  console.log('TXT result:', txtOk);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'after-txt.png', fullPage: true });

  // Add CNAME record  
  console.log('\n=== Adding CNAME ===');
  const cnameOk = await addRecord(page, 'CNAME', '@', 'cname.vercel-dns.com');
  console.log('CNAME result:', cnameOk);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'final-records.png', fullPage: true });

  console.log('\nDone! Browser open 2 min...');
  await page.waitForTimeout(120000);
  await browser.close();
})();