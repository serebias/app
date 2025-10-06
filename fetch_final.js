// fetch_final.js
// Abre a página, aguarda o JS anti-bot e salva final_page.html
const fs = require('fs');
const { chromium } = require('playwright');

(async () => {
  const target = 'https://gestortv.freesite.online/iptv/notificar_vencimentos.php';

  const browser = await chromium.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0 Safari/537.36',
    ignoreHTTPSErrors: true,
    locale: 'pt-BR'
  });

  const page = await context.newPage();

  try {
    console.log('Navigating to initial URL:', target);
    await page.goto(target, { waitUntil: 'networkidle', timeout: 30000 });

    // Esperar redirect para ?i=1 ou aguardar execução do JS
    try {
      await page.waitForURL('**?i=1', { timeout: 10000 });
      console.log('Redirect to ?i=1 detected.');
    } catch (e) {
      console.log('Redirect not detected within timeout, waiting additional time...');
      await page.waitForTimeout(1500);
    }

    // Se a página atual não contém ?i=1, navegar explicitamente para garantir execução
    const finalUrl = page.url().includes('?i=1') ? page.url() : target + '?i=1';
    console.log('Final URL to fetch:', finalUrl);

    await page.goto(finalUrl, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(800);

    const content = await page.content();
    fs.writeFileSync('final_page.html', content, 'utf8');
    console.log('Saved final_page.html (length:', content.length, 'chars)');
    console.log('Printing preview (first 1000 chars):');
    console.log(content.slice(0, 1000));
  } catch (err) {
    console.error('ERROR during page fetch:', err);
    process.exitCode = 2;
  } finally {
    await browser.close();
  }
})();
