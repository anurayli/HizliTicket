// Arayuz dili (Turkce / English).
// Uygulama metinleri Turkce yazilir; dil "en" ise bu modul ekrandaki metinleri
// (statik ve sonradan eklenen) sozluk + kaliplarla Ingilizceye cevirir.
(function (root) {
  const ANAHTAR = "hizliticket.dil";

  function depoOku() {
    try {
      if (root.masaustu && root.masaustu.depo) {
        const v = root.masaustu.depo.oku(ANAHTAR);
        if (v) return JSON.parse(v);
      }
    } catch (e) { /* yok */ }
    try { const v = localStorage.getItem(ANAHTAR); return v ? JSON.parse(v) : null; } catch (e) { return null; }
  }
  function depoYaz(dil) {
    const js = JSON.stringify(dil);
    try { if (root.masaustu && root.masaustu.depo) root.masaustu.depo.yaz(ANAHTAR, js); } catch (e) { /* yok */ }
    try { localStorage.setItem(ANAHTAR, js); } catch (e) { /* yok */ }
  }

  const tarayiciDili = ((navigator.language || "tr") + "").toLowerCase().startsWith("tr") ? "tr" : "en";
  const dil = depoOku() || tarayiciDili;

  // Birebir eslesmeler (bas/son bosluklar korunur)
  const SOZLUK = {
    "Hızlı Ticket": "Quick Ticket",
    "Yeni": "New",
    "Geçmiş": "History",
    "Ayarlar": "Settings",
    "Önce": "First enter the server URL, API key and technician in",
    "bölümünden API anahtarını ve teknisyen bilgisini girin.": ".",
    "Ne yapıldı? Virgülle ayırdıklarınız ayrı ticket olur.": "What was done? Each comma-separated part becomes a separate ticket.",
    "Sesle yaz": "Dictate",
    "Sesle yazmak için Windows'ta Win+H tuşlarına basın.": "To dictate on Windows, press Win+H (on macOS press Fn twice).",
    "Ticket aç": "Open tickets",
    "Çözümle": "Parse",
    "Boş ticket ekle": "Add empty ticket",
    "Temizle": "Clear",
    "Gönder": "Send",
    "Sunucudan son ticket'lar": "Latest tickets from server",
    "Yerel geçmişi temizle": "Clear local history",
    "Bugün": "Today",
    "Son 7 gün": "Last 7 days",
    "Son 30 gün": "Last 30 days",
    "Tümü": "All",
    "Özet bu cihazdan açılan ticket'lara göre hazırlanır.": "The summary is based on tickets opened from this device.",
    "ServiceDesk adresi": "ServiceDesk URL",
    "API anahtarı": "API key",
    "SDP profil menüsünden oluşturulan anahtar": "Key generated from your SDP profile menu",
    "Anahtar yalnızca bu cihazda saklanır. Yeni anahtar oluşturmak eskisini geçersiz kılabilir; mevcut anahtarınızı kullanın.":
      "The key is stored only on this device. Generating a new key may invalidate the old one; use your existing key.",
    "Bağlantıyı test et": "Test connection",
    "Teknisyen (ticket'lar size atanır)": "Technician (tickets are assigned to you)",
    "Adınız veya soyadınız": "Your first or last name",
    "Ara": "Search",
    "Teknisyen ID": "Technician ID",
    "Grup ID": "Group ID",
    "(isteğe bağlı)": "(optional)",
    "Kayıtsız kullanıcılar için e-posta alan adı": "E-mail domain for unregistered users",
    "kurumunuz.com": "yourcompany.com",
    "https://servicedesk.kurumunuz.com": "https://servicedesk.yourcompany.com",
    " SSL sertifika doğrulamasını kapat": " Disable SSL certificate verification",
    " Yazdığımı çözümleyip ticket'ları otomatik aç": " Parse my text and open tickets automatically",
    " Göndermeden önce her zaman sor": " Always ask before sending",
    "Hızlı düğmeler (virgülle ayırın)": "Quick buttons (comma separated)",
    "Kategori bulunamazsa kullanılacak kategori": "Fallback category when none is detected",
    "Kategoriler": "Categories",
    "SDP'deki kategorileri ve son ticket'larınızda seçtiğiniz kategorileri öğrenir. Kartta kategoriyi elle düzelttiğinizde de uygulama bunu hatırlar, bir dahaki sefere kendisi seçer.":
      "Learns the categories in SDP and the ones you used in your recent tickets. When you fix a category manually on a card, the app remembers it and picks it next time.",
    "Kategorileri SDP'den öğren": "Learn categories from SDP",
    "Öğrenilenleri sıfırla": "Reset learned data",
    "Kaydet": "Save",
    "Dil / Language": "Dil / Language",
    "örnek: ayilmaz smartboard kalibrasyon, bkaya wifi bağlantı sorunu, 7a,7b ipad mdm kurulumu kullanıcı olarak cdemir":
      "e.g.: ayilmaz smartboard kalibrasyon, bkaya wifi bağlantı sorunu, 7a,7b ipad mdm kurulumu kullanıcı olarak cdemir",
    "Talep sahibi": "Requester",
    "kullanıcı adı, e-posta veya ad soyad": "username, e-mail or full name",
    "Kategori": "Category",
    "Öğe": "Item",
    "Konu": "Subject",
    "Açıklama ve çözüm": "Description and resolution",
    "Açıklama": "Description",
    "Çözüm": "Resolution",
    "Kaldır": "Remove",
    "— Kategori seçin —": "— Select category —",
    "— Öğe yok —": "— No item —",
    "— Yok (sorsun) —": "— None (ask me) —",
    "Hata": "Error",
    "Talep sahibi yok": "No requester",
    "Kategori yok": "No category",
    "Yeni kullanıcı": "New user",
    "Hazır": "Ready",
    "Bulunamadı — yazıp listeden seçin": "Not found — type and pick from the list",
    "SDP'de kayıtlı değil, bu e-posta ile oluşturulacak": "Not registered in SDP, will be created with this e-mail",
    "SDP'de kayıtlı değilse bu e-posta ile oluşturulur": "Will be created with this e-mail if not registered in SDP",
    "1 ticket gönder": "Send 1 ticket",
    "Önce ne yapıldığını yazın.": "First type what was done.",
    "API anahtarı ve teknisyen ID gerekli.": "ServiceDesk URL, API key and technician ID are required.",
    "Kullanıcılar aranıyor…": "Searching users…",
    ", sonraki": ", next",
    "Yeni ticket'a geç": "Start next ticket",
    "Söylediğiniz eklendi. Kontrol edip Ticket aç'a basın.": "Your dictation was added. Check it and press Open tickets.",
    " ticket açıldı": " tickets opened",
    "Kategoriye göre": "By category",
    "Alt kategoriye göre": "By subcategory",
    "En çok ticket açılan kişiler": "Top requesters",
    "Günlere göre": "By day",
    "Bu cihazdan henüz ticket açılmadı.": "No tickets opened from this device yet.",
    "Yükleniyor…": "Loading…",
    "Değişiklikler otomatik kaydedildi.": "Changes saved automatically.",
    "Kaydedildi.": "Saved.",
    "Kaydedilemedi (depolama kapalı).": "Could not save (storage disabled).",
    "Deneniyor…": "Testing…",
    "Bağlantı başarılı.": "Connection successful.",
    "Aranıyor…": "Searching…",
    "Bulunamadı. ID'yi elle girebilirsiniz.": "Not found. You can enter the ID manually.",
    "Seç": "Select",
    "Öğrenilenler silindi (uygulamayı yeniden açınca listeden de kalkar).": "Learned data cleared (it disappears from the list after restarting the app).",
    "Masaüstü": "Desktop",
    "API anahtarı girilmemiş (Ayarlar).": "API key is missing (Settings).",
    "Teknisyen ID girilmemiş (Ayarlar).": "Technician ID is missing (Settings).",
    "Talep sahibi seçilmemiş.": "No requester selected.",
    "Kategori seçilmemiş.": "No category selected.",
    "Ticket oluşturuldu mu anlaşılamadı.": "Could not confirm whether the ticket was created.",
    "Kategori listesi isteniyor…": "Requesting category list…",
  };

  // Kalipli metinler (sayi / degisken iceren)
  const KALIPLAR = [
    [/^Zaten açılmıştı #(\d+)$/, "Already opened #$1"],
    [/^Açıldı #(\d+)$/, "Opened #$1"],
    [/^(\d+) ticket gönder$/, "Send $1 tickets"],
    [/^Yeni kullanıcı: (.+)$/, "New user: $1"],
    [/^Otomatik açılmadı, kullanıcı aranırken hata oluştu: (.*)$/, "Not opened automatically, an error occurred while searching users: $1"],
    [/^(\d+) ticket hazırlandı, (\d+) tanesinde eksik alan var\.$/, "$1 tickets prepared, $2 have missing fields."],
    [/^(\d+) ticket hazırlandı\. Kontrol edip gönderin\.$/, "$1 tickets prepared. Review and send."],
    [/^Çözümlenemedi: (.*)$/, "Could not parse: $1"],
    [/^(\d+) ticket'ta talep sahibi, kategori veya konu eksik\.$/, "$1 tickets are missing a requester, category or subject."],
    [/^Otomatik açılmadı: (\d+) ticket'ta talep sahibi veya kategori eksik\. Tamamlayıp Gönder'e basın\.$/, "Not opened automatically: $1 tickets are missing a requester or category. Complete them and press Send."],
    [/^(\d+) ticket açılacak\. Devam edilsin mi\?$/, "$1 tickets will be opened. Continue?"],
    [/^Gönderiliyor… \((\d+)\/(\d+)\)$/, "Sending… ($1/$2)"],
    [/^(\d+) ticket açıldı(, (\d+) hata)?(\. (\d+) ticket'ta eksik alan var, kartta tamamlayıp Gönder'e basın\.|\.)$/, (m, a, _h, h, _k, k) =>
      a + " tickets opened" + (h ? ", " + h + " errors" : "") + (k ? ". " + k + " tickets have missing fields; complete them on the card and press Send." : ".")],
    [/^(.*) — ID'yi elle girebilirsiniz\.$/, "$1 — you can enter the ID manually."],
    [/^(SDP kategori listesinden|Son ticket'larınızdan) (\d+) alt kategori bulundu, (\d+) tanesi yeni eklendi, (\d+) örnek öğrenildi\.(.*)$/, (m, k, a, b, c, rest) =>
      (k.startsWith("SDP") ? "From the SDP category list: " : "From your recent tickets: ") + a + " subcategories found, " + b + " newly added, " + c + " examples learned." + rest],
    [/^Sunucuya bağlanılamadı: (.*)$/, "Could not connect to server: $1"],
    [/^Çözüm yazılamadı: (.*)$/, "Could not write resolution: $1"],
    [/^Resolved yapılamadı: (.*)$/, "Could not set status to Resolved: $1"],
    [/^Alt kategoriler: (.*)$/, "Subcategories: $1"],
    [/^Ticket geçmişi okunuyor… \((\d+)\)$/, "Reading ticket history… ($1)"],
    [/^Ticket ayrıntıları okunuyor… \((\d+)\/(\d+)\)$/, "Reading ticket details… ($1/$2)"],
    [/^Hızlı Ticket ([\d.]+) · $/, "Quick Ticket $1 · "],
  ];

  function cevir(s) {
    if (dil !== "en" || s == null) return s;
    const str = String(s);
    if (Object.prototype.hasOwnProperty.call(SOZLUK, str)) return SOZLUK[str];
    const kirp = str.trim();
    if (kirp && Object.prototype.hasOwnProperty.call(SOZLUK, kirp)) return str.replace(kirp, SOZLUK[kirp]);
    for (const [re, y] of KALIPLAR) if (re.test(kirp)) return str.replace(kirp, kirp.replace(re, y));
    return str;
  }

  const ATLA = new Set(["TEXTAREA", "SCRIPT", "STYLE", "INPUT"]);
  function dugumCevir(n) {
    if (n.nodeType === 3) {
      const p = n.parentNode;
      if (!p || ATLA.has(p.nodeName) || (p.closest && p.closest("[data-cevirme]"))) return;
      const y = cevir(n.nodeValue);
      if (y !== n.nodeValue) n.nodeValue = y;
      return;
    }
    if (n.nodeType !== 1 || n.hasAttribute("data-cevirme")) return;
    for (const a of ["placeholder", "title", "aria-label"]) {
      if (n.hasAttribute(a)) { const v = n.getAttribute(a); const y = cevir(v); if (y !== v) n.setAttribute(a, y); }
    }
    for (const c of n.childNodes) dugumCevir(c);
  }

  function baslat() {
    document.documentElement.lang = dil;
    if (dil === "en") {
      document.title = "Quick Ticket";
      dugumCevir(document.body);
      new MutationObserver((ms) => {
        for (const m of ms) {
          if (m.type === "characterData") dugumCevir(m.target);
          else if (m.type === "attributes") dugumCevir(m.target);
          else m.addedNodes.forEach(dugumCevir);
        }
      }).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["placeholder", "title"] });
      const conf = root.confirm.bind(root);
      root.confirm = (msg) => conf(cevir(msg));
    }
    const sec = document.getElementById("aDil");
    if (sec) {
      sec.value = dil;
      sec.addEventListener("change", (e) => {
        e.stopPropagation();
        depoYaz(sec.value);
        location.reload();
      });
    }
  }

  root.Dil = { dil, cevir, baslat };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", baslat);
  else baslat();
})(window);
