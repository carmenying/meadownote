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

  // Try clicking "DNS 解析" tab first
  console.log('Clicking DNS 解析 tab...');
  try {
    await page.click('text=添加解析', { timeout: 5000 });
    console.log('Clicked 添加解析 text');
  } catch (e) {
    console.log('text= failed, trying button approach...');
    // Find all elements with text "添加解析"
    const btns = await page.$$eval('*', els => els.filter(e => e.textContent.includes('添加解析') && e.children.length < 5).map(e => ({ tag: e.tagName, text: e.textContent.trim().substring(0, 50), id: e.id, cls: e.className.substring(0, 50) })));
    console.log('Found elements with 添加解析:');
    btns.forEach((b, i) => console.log(`  ${i}: <${b.tag.toLowerCase()}> class="${b.cls}" id="${b.id}" text="${b.text}"`));

    // Try to click the first one that's a button or a
    for (const b of btns) {
      try {
        const selector = `${b.tag.toLowerCase()}` + (b.id ? `#${b.id}` : `.${b.cls.split(' ')[0]}`);
        console.log('Trying selector:', selector);
        await page.click(selector, { text: '添加解析', timeout: 3000 });
        console.log('Clicked!');
        break;
      } catch (e2) {
        console.log('Selector failed:', e2.message.substring(0, 100));
      }
    }
  }
  await page.waitForTimeout(2000);

  await page.screenshot({ path: 'after-click.png', fullPage: true });
  console.log('Screenshot saved');

  // List form fields visible now
  const visibleInputs = await page.$$eval('input:not([type="hidden"]), select', els => els.map(e => ({
    tag: e.tagName, name: e.name || '', type: e.type || '',
    visible: e.offsetParent !== null,
    placeholder: e.placeholder || ''
  })));
  console.log('\n=== Visible form fields ===');
  visibleInputs.forEach((el, i) => console.log(`${i}: ${el.tag} name="${el.name}" type="${el.type}" visible=${el.visible} placeholder="${el.placeholder}"`));

  console.log('\nKeeping open...');
  await page.waitForTimeout(120000);
  await browser.close();
})();