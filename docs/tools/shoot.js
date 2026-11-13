// README ekran goruntuleri: sahte (demo) SDP sunucusuyla uygulamayi calistirip ekran goruntusu alir.
// Screenshots for the README, rendered against a mocked (demo) SDP server.
// Kullanim / usage: npm i --no-save playwright && npx playwright install chromium && node docs/tools/shoot.js
const { chromium } = require('playwright');
const path = require('path');
const SRC = 'file://' + path.resolve(path.join(__dirname, '..', '..', 'www', 'index.html'));
const OUT = process.argv[2] || path.join(__dirname, '..', 'screenshots');
require('fs').mkdirSync(OUT, { recursive: true });
const users = [
  { id: 11, name: 'Ayşe Yılmaz', email_id: 'ayilmaz@example.com', login_name: 'ayilmaz', department: { name: 'Fen Bilimleri' } },
  { id: 12, name: 'Burak Kaya', email_id: 'bkaya@example.com', login_name: 'bkaya', department: { name: 'Matematik' } },
  { id: 13, name: 'Can Demir', email_id: 'cdemir@example.com', login_name: 'cdemir', department: { name: 'Bilişim' } },
];
let nextId = 10421;
function gecmis(lang) {
  const now = Date.now(), d = 86400000;
  const rows = [
    ['Akıllı tahta kalibrasyonu', 'Ayşe Yılmaz', 'Sınıf içi teknik sorunlar / Akıllı tahta sorunları', 0],
    ['Wi-Fi bağlantı sorunu', 'Burak Kaya', 'Bağlantı Sorunları / İnternet Bağlantı Sorunu', 0],
    ['7A iPad MDM kurulumu', 'Can Demir', 'iPad İşlemleri / MDM kayıt', 1],
    ['7B iPad MDM kurulumu', 'Can Demir', 'iPad İşlemleri / MDM kayıt', 1],
    ['Yazıcı sorunu', 'Ayşe Yılmaz', 'Cihaz arızaları / Yazıcı sorunları', 2],
    ['Şifre sıfırlama', 'Burak Kaya', 'Hesap işlemleri / Şifre sorunları', 3],
    ['Ekran yansıtma sorunu', 'Ayşe Yılmaz', 'Sınıf içi teknik sorunlar / Ekran yansıtma', 4],
    ['Oditoryum sunum desteği', 'Can Demir', 'Etkinlik destek / Oditoryum', 5],
  ];
  const en = { 'Akıllı tahta kalibrasyonu':['Smartboard calibration','Classroom / Smartboard issues'], 'Wi-Fi bağlantı sorunu':['Wi-Fi connection issue','Connectivity / Internet issue'], '7A iPad MDM kurulumu':['7A iPad MDM enrollment','iPad / MDM enrollment'], '7B iPad MDM kurulumu':['7B iPad MDM enrollment','iPad / MDM enrollment'], 'Yazıcı sorunu':['Printer issue','Hardware / Printer issues'], 'Şifre sıfırlama':['Password reset','Accounts / Password issues'], 'Ekran yansıtma sorunu':['Screen mirroring issue','Classroom / Screen mirroring'], 'Oditoryum sunum desteği':['Auditorium presentation support','Events / Auditorium'] };
  if (lang === 'en') rows.forEach(r => { const e = en[r[0]]; r[0] = e[0]; r[2] = e[1]; r[1] = r[1].replace('Ayşe Yılmaz','Alice Young').replace('Burak Kaya','Bob King').replace('Can Demir','Carl Dean'); });
  return rows.map((r, i) => ({ id: 10400 - i, link: 'https://servicedesk.example.com/WorkOrder.do?woID=' + (10400 - i), konu: r[0], kisi: r[1], kategori: r[2], tarih: new Date(now - r[3] * d - i * 3600000).toISOString() }));
}
(async () => {
  const browser = await chromium.launch();
  for (const lang of ['tr', 'en']) {
    for (const [tag, vp] of [['desktop', { width: 860, height: 820 }], ['mobile', { width: 390, height: 844 }]]) {
      const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 2, locale: lang === 'tr' ? 'tr-TR' : 'en-US' });
      const page = await ctx.newPage();
      page.on('pageerror', e => console.log('PAGEERR', e.message));
      await page.route('https://servicedesk.example.com/**', async (route) => {
        const req = route.request();
        const u = new URL(req.url());
        const hdr = { 'access-control-allow-origin': '*', 'content-type': 'application/json' };
        if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: { ...hdr, 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' } });
        let body = {};
        if (u.pathname.endsWith('/users')) {
          const q = JSON.parse(u.searchParams.get('input_data')).list_info.search_criteria[0].value.toLowerCase();
          body = { users: users.filter(x => x.login_name.includes(q) || x.name.toLowerCase().includes(q) || x.email_id.includes(q)) };
        } else if (req.method() === 'POST') body = { request: { id: String(nextId++) } };
        else body = { requests: [] };
        return route.fulfill({ status: 200, headers: hdr, body: JSON.stringify(body) });
      });
      await page.addInitScript(([lang, g]) => {
        if (localStorage.getItem('__init')) return;
        localStorage.setItem('__init', '1');
        localStorage.setItem('hizliticket.dil', JSON.stringify(lang));
        localStorage.setItem('hizliticket.ayar', JSON.stringify({ url: 'https://servicedesk.example.com', apiKey: 'demo-key', teknisyenId: '1', teknisyenAd: 'Demo Teknisyen', alanAdi: 'example.com', otomatik: false }));
        localStorage.setItem('hizliticket.gecmis', JSON.stringify(g));
      }, [lang, gecmis(lang)]);
      await page.goto(SRC);
      await page.waitForTimeout(300);
      const ISTENEN = ['desktop-2-onizleme','desktop-3-acildi','desktop-4-gecmis','desktop-5-ayarlar','mobile-2-onizleme','mobile-4-gecmis'];
      const p = (n) => ISTENEN.includes(`${tag}-${n}`) ? path.join(OUT, `${lang}-${tag}-${n}.png`) : undefined;
      await page.screenshot({ path: p('1-yeni') });
      await page.fill('#metin', 'ayilmaz smartboard kalibrasyon, bkaya wifi bağlantı sorunu, 7a,7b ipad mdm kurulumu kullanıcı olarak cdemir');
      await page.click('#cozumle');
      await page.waitForTimeout(800);
      await page.screenshot({ path: p('2-onizleme'), fullPage: tag === 'desktop' ? false : false });
      await page.click('#gonder');
      await page.waitForTimeout(1200);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: p('3-acildi') });
      await page.click('[data-sekme="gecmis"]');
      await page.waitForTimeout(300);
      await page.screenshot({ path: p('4-gecmis') });
      await page.click('[data-sekme="ayarlar"]');
      await page.waitForTimeout(300);
      await page.screenshot({ path: p('5-ayarlar') });
      await ctx.close();
    }
  }
  await browser.close();
})();
