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
  console.log('Logged in');

  // Domain page
  console.log('Opening domain page...');
  await page.goto('https://my.dnshe.com/index.php?m=domain_hub&view=domain&domain_id=3731050722');
  await page.waitForTimeout(5000);

  // Source - print page HTML to find 添加解析 button
  console.log('\Looking for add button via evaluate...');
  const btnInfo = await page.evaluate(() => {
    const result = [];
    const all = document.querySelectorAll('button, a[href="#"], a, div');
    for (const e of all) {
      if (e.textContent && e.textContent.includes('添加解析') && e.textContent.length < 30) {
        result.push({
          tag: e.tagName,
          text: e.textContent.trim(),
          id: e.id,
          cls: e.className,
          onclick: e.getAttribute('onclick') || '',
          href: e.getAttribute('href') || '',
          visible: e.offsetParent !== null
        });
      }
    }
    return result;
  });
  console.log('Found elements with 添加解析:');
  btnInfo.forEach((b, i) => console.log(`  ${i}: ${b.tag} id="${b.id}" cls="${b.cls}" onclick="${b.onclick}" visible=${b.visible}`));

  // Find and click the first visible "添加解析" using JS API + evaluate
  console.log('\nClicking add button via JS...');
  const clicked = await page.evaluate(() => {
    const buttons = document.querySelectorAll('button');
    for (const b of buttons) {
      if (b.textContent.includes('添加解析') && b.textContent.length < 30 && b.offsetParent !== null) {
        b.click();
        return true;
      }
    }
    // Try a tags
    const aTags = document.querySelectorAll('a');
    for (const a of aTags) {
      if (a.textContent.includes('添加解析') && a.textContent.length < 30 && a.offsetParent !== null) {
        a.click();
        return true;
      }
    }
    // Try div
    const divs = document.querySelectorAll('div');
    for (const d of divs) {
      if (d.textContent === '添加解析' && d.offsetParent !== null) {
        d.click();
        return true;
      }
    }
    return false;
  });
  console.log('Click result:', clicked);
  await page.waitForTimeout(2000);

  // Check if modal is open
  const modalOpen = await page.evaluate(() => {
    const modal = document.querySelector('#dnsModal');
    if (!modal) return 'no modal element';
    const style = window.getComputedStyle(modal);
    return { display: style.display, opacity: style.opacity, hasShow: modal.classList.contains('show') };
  });
  console.log('Modal state:', JSON.stringify(modalOpen));

  // If modal is open, fill form
  if (modalOpen && (modalOpen.hasShow || modalOpen.display !== 'none')) {
    console.log('\nFilling TXT record...');
    await page.selectOption('#dnsModal select[name="record_type"]', 'TXT');
    await page.waitForTimeout(500);
    await page.fill('#dnsModal input[name="record_name"]', '_vercel');
    await page.waitForTimeout(300);
    await page.fill('#dnsModal input[name="record_content"]', 'vc-domain-verify=bot.cd,c92feba81936d97827fc');
    await page.waitForTimeout(300);
    await page.selectOption('#dnsModal select[name="record_ttl"]', 'auto');
    await page.waitForTimeout(300);
    
    // Submit via JS
    console.log('Submitting form via JS...');
    const submitted = await page.evaluate(() => {
      const form = document.querySelector('#dnsModal form');
      if (form) {
        // Look for submit button in that form
        const submits = form.querySelectorAll('button[type="submit"], input[type="submit"]');
        for (const s of submits) {
          if (s.offsetParent !== null) {
            s.click();
            return 'clicked: ' + s.textContent.trim();
          }
        }
        form.submit();
        return 'form.submit()';
      }
      // Try finding any visible submit button within modal
      const btns = document.querySelectorAll('#dnsModal button, #dnsModal input[type="submit"]');
      for (const b of btns) {
        const t = b.textContent || '';
        if ((b.type === 'submit' || t.includes('添加') || t.includes('确定')) && b.offsetParent !== null) {
          b.click();
          return 'clicked button: ' + t;
        }
      }
      return 'no submit found';
    });
    console.log('Submit result:', submitted);
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'after-txt.png', fullPage: true });
    console.log('TXT screenshot saved');
  } else {
    console.log('Modal not open!');
    await page.screenshot({ path: 'modal-closed.png', fullPage: true });
  }

  console.log('\nBrowser open 2 min...');
  await page.waitForTimeout(120000);
  await browser.close();
})();