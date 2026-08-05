const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: false });
  const page = await browser.newPage();

  console.log('Login...');
  try {
    await page.goto('https://my.dnshe.com/login.php?language=chinese', { waitUntil: 'commit', timeout: 60000 });
  } catch (e) { console.log('Login page slow, continuing...'); }
  await page.waitForSelector('input[name="username"]', { timeout: 30000 });
  await page.fill('input[name="username"]', 'carmenyym');
  await page.fill('input[name="password"]', '3ZbZYzNgf.94r8C');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(5000);

  console.log('Opening submit ticket page...');
  try {
    await page.goto('https://my.dnshe.com/submitticket.php', { waitUntil: 'commit', timeout: 60000 });
  } catch (e) { console.log('Ticket page slow, continuing...'); }
  await page.waitForSelector('input[name="subject"]', { timeout: 60000 });
  await page.waitForTimeout(2000);

  // Fill form
  console.log('Filling ticket form...');
  
  await page.fill('input[name="name"]', 'Ying');
  await page.fill('input[name="email"]', 'carmenyym1122@gmail.com');
  await page.fill('input[name="subject"]', '请帮我在 bot.cd 顶级域名层添加 _vercel TXT 记录（用于 Vercel 域名验证）');
  
  await page.selectOption('select[name="deptid"]', '3');
  await page.waitForTimeout(300);
  await page.selectOption('select[name="urgency"]', 'Medium');
  await page.waitForTimeout(300);
  
  const message = `您好 DNSHE 团队，

我在 Vercel 部署了个人网站，使用我的域名 www.meadownote.bot.cd。
Vercel 要求验证域名所有权，需要添加一条 TXT 记录到 _vercel.bot.cd。
但我作为 DNSHE 免费子域名用户只能管理 meadownote.bot.cd 这一层，无法在 bot.cd 顶级域名层添加记录。

烦请帮忙在 bot.cd 顶级域名层添加以下 TXT 记录：

主机记录：_vercel
类型：TXT
值：vc-domain-verify=www.meadownote.bot.cd,6a30e6d5aa6ccb360217

验证完成后这条记录可以删除。

非常感谢！`;

  await page.fill('textarea[name="message"]', message);
  await page.waitForTimeout(500);

  console.log('Form filled. Taking screenshot...');
  await page.screenshot({ path: 'ticket-filled.png', fullPage: true });
  console.log('Screenshot saved. Browser open for 5 minutes for captcha entry.');

  // Wait 5 minutes for manual captcha
  await page.waitForTimeout(300000);
  await browser.close();
})();