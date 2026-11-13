(function () {
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  const { KATEGORILER, kategoriAdi } = window.Kategoriler;

  // ---------- Ayarlar ----------
  const AYAR_ANAHTARI = "hizliticket.ayar";
  const GECMIS_ANAHTARI = "hizliticket.gecmis";
  const OGRENILEN_ANAHTARI = "hizliticket.ogrenilen";
  const OZELKAT_ANAHTARI = "hizliticket.ozelkat";
  const VARSAYILAN = { url: "", apiKey: "", teknisyenId: "", grupId: "", alanAdi: "", sslKapali: false, onaySor: false, otomatik: true, varsayilanKat: "610|648",
    hizli: "smartboard sorunu, smartboard bağlantı sorunu, ekran yansıtma sorunu, wifi bağlantı sorunu, yazıcı sorunu, şifre sıfırlama, ipad mdm kurulumu, yeni bilgisayar kurulumu ve teslimi, personel kartı tanımlama, oditoryum sunum desteği" };

  // Masaustunde ayarlar uygulama klasorundeki bir dosyada tutulur (localStorage kapanista kaybolabiliyor).
  const dosyaDepo = window.masaustu && window.masaustu.depo ? window.masaustu.depo : null;
  function hamOku(anahtar) {
    if (dosyaDepo) {
      try {
        const v = dosyaDepo.oku(anahtar);
        if (v !== null && v !== undefined) return v;
      } catch (e) { /* dosyaya ulasilamadi */ }
    }
    try { return localStorage.getItem(anahtar); } catch (e) { return null; }
  }
  function oku(anahtar, vars) {
    try { const v = hamOku(anahtar); return v ? JSON.parse(v) : vars; } catch (e) { return vars; }
  }
  function yaz(anahtar, deger) {
    const js = JSON.stringify(deger);
    let ok = false;
    if (dosyaDepo) { try { ok = dosyaDepo.yaz(anahtar, js) === true; } catch (e) { ok = false; } }
    try { localStorage.setItem(anahtar, js); ok = true; } catch (e) { /* yok */ }
    return ok;
  }

  let ayar = { ...VARSAYILAN, ...oku(AYAR_ANAHTARI, {}) };
  let sdp = new window.SDPIstemci.SDP(ayar, window.Platform.http);

  function ayarEksik() { return !ayar.url || !ayar.apiKey || !ayar.teknisyenId; }
  function ayarUyarisi() { $("#ayarUyari").classList.toggle("gizli", !ayarEksik()); }

  // ---------- Sekmeler ----------
  function sekmeGit(ad) {
    $$(".sekme").forEach((b) => b.classList.toggle("aktif", b.dataset.sekme === ad));
    $$(".panel").forEach((p) => p.classList.toggle("aktif", p.id === ad));
    if (ad === "gecmis") { gecmisCiz(); ozetCiz(); }
  }
  $$(".sekme").forEach((b) => b.addEventListener("click", () => sekmeGit(b.dataset.sekme)));
  document.addEventListener("click", (e) => {
    const g = e.target.closest("[data-git]");
    if (g) { e.preventDefault(); sekmeGit(g.dataset.git); }
    const a = e.target.closest("a[data-link]");
    if (a) { e.preventDefault(); window.Platform.linkAc(a.dataset.link); }
  });

  // ---------- Onizleme durumu ----------
  let ticketlar = [];

  function durum(metin, kotu) {
    const d = $("#durum");
    d.textContent = metin || "";
    d.classList.toggle("kotu", !!kotu);
    d.classList.toggle("buyuk-hata", !!kotu);
  }

  function kategoriSecenekleri(sel) {
    sel.innerHTML = "";
    const bos = document.createElement("option");
    bos.value = ""; bos.textContent = "— Kategori seçin —";
    sel.appendChild(bos);
    for (const k of KATEGORILER) {
      const og = document.createElement("optgroup");
      og.label = k.ad;
      for (const [aid, aad] of k.alt) {
        const o = document.createElement("option");
        o.value = k.id + "|" + aid;
        o.textContent = aad + " — " + k.ad;
        og.appendChild(o);
      }
      sel.appendChild(og);
    }
  }

  function kisiMetni(k) {
    if (!k) return "";
    if (k.durum === "eposta") return k.eposta;
    return k.kullanici_adi || k.eposta || k.ad || "";
  }

  function rozet(t) {
    if (t.sonuc && t.sonuc.id && t.sonuc.onceden) return ["dikkat", "Zaten açılmıştı #" + t.sonuc.id];
    if (t.sonuc && t.sonuc.id) return ["iyi", "Açıldı #" + t.sonuc.id];
    if (t.sonuc && t.sonuc.hata) return ["kotu", "Hata"];
    if (!t.kullanici) return ["kotu", "Talep sahibi yok"];
    if (!t.kategori_id) return ["kotu", "Kategori yok"];
    if (t.kullanici.durum === "eposta") return ["dikkat", "Yeni kullanıcı"];
    return ["iyi", "Hazır"];
  }

  function kartGuncelle(kart, t) {
    const [tur, yazi] = rozet(t);
    const r = $(".rozet", kart);
    r.className = "rozet " + tur;
    r.textContent = yazi;
    const ad = $(".kisi-ad", kart);
    if (!t.kullanici) ad.textContent = "Bulunamadı — yazıp listeden seçin";
    else if (t.kullanici.durum === "eposta") ad.textContent = "SDP'de kayıtlı değil, bu e-posta ile oluşturulacak";
    else ad.textContent = t.kullanici.ad + (t.kullanici.departman ? " · " + t.kullanici.departman : "");
    kart.classList.toggle("gonderildi", !!(t.sonuc && t.sonuc.id));
    const oz = $(".t-ozet", kart);
    oz.innerHTML = "";
    if (t.sonuc && t.sonuc.id) {
      const b = document.createElement("div"); b.textContent = t.konu;
      const k = document.createElement("small");
      k.textContent = (t.kullanici.ad || t.kullanici.eposta) + " · " + kategoriAdi(t.kategori_id, t.alt_kategori_id);
      oz.append(b, k);
    }
    kart.classList.toggle("hatali", !!(t.sonuc && t.sonuc.hata));
    const s = $(".t-sonuc", kart);
    s.innerHTML = "";
    if (t.sonuc && t.sonuc.id) {
      const a = document.createElement("a");
      a.href = t.sonuc.link; a.dataset.link = t.sonuc.link; a.textContent = "#" + t.sonuc.id + " · Resolved";
      s.appendChild(a);
      if (t.sonuc.notlar && t.sonuc.notlar.length) {
        const n = document.createElement("div"); n.className = "kucuk"; n.textContent = t.sonuc.notlar.join(" · "); s.appendChild(n);
      }
    } else if (t.sonuc && t.sonuc.hata) {
      s.textContent = t.sonuc.hata; s.style.color = "var(--kotu)";
    }
    gonderButonu();
  }

  function gonderButonu() {
    const bekleyen = ticketlar.filter((t) => !(t.sonuc && t.sonuc.id));
    $("#gonderAlani").classList.toggle("gizli", !bekleyen.length);
    $("#gonder").textContent = bekleyen.length === 1 ? "1 ticket gönder" : bekleyen.length + " ticket gönder";
  }

  function ciz() {
    const kap = $("#onizleme");
    kap.innerHTML = "";
    const sablon = $("#ticketSablon");
    ticketlar.forEach((t, i) => {
      const kart = sablon.content.firstElementChild.cloneNode(true);
      $(".t-no", kart).textContent = String(i + 1);
      const kisi = $(".t-kisi", kart);
      kisi.value = kisiMetni(t.kullanici);
      const sel = $(".t-kat", kart);
      kategoriSecenekleri(sel);
      sel.value = t.kategori_id ? t.kategori_id + "|" + t.alt_kategori_id : "";
      $(".t-konu", kart).value = t.konu || "";
      $(".t-aciklama", kart).value = t.aciklama || "";
      $(".t-cozum", kart).value = t.cozum || "";

      $(".sil", kart).addEventListener("click", () => { ticketlar.splice(i, 1); ciz(); });
      const ogeSel = $(".t-oge", kart);
      const ogeleriDoldur = () => {
        const k = KATEGORILER.find((x) => x.id === t.kategori_id);
        const a = k && k.alt.find((x) => x[0] === t.alt_kategori_id);
        const liste = a && a[2] ? a[2] : [];
        ogeSel.innerHTML = '<option value="">— Öğe yok —</option>' + liste.map((o) => '<option></option>').join("");
        liste.forEach((o, j) => { ogeSel.options[j + 1].value = o[0]; ogeSel.options[j + 1].textContent = o[1]; });
        ogeSel.value = t.oge_id || "";
        $(".oge-alani", kart).classList.toggle("gizli", !liste.length);
      };
      ogeleriDoldur();
      ogeSel.addEventListener("change", () => { t.oge_id = ogeSel.value; });
      sel.addEventListener("change", () => {
        t.katElle = true;
        const [k, a] = sel.value.split("|");
        t.kategori_id = k || ""; t.alt_kategori_id = a || ""; t.oge_id = "";
        ogeleriDoldur();
        if (!t.cozumElle) {
          const kural = window.Kategoriler.KURALLAR.find((r) => r.k === k && r.a === a);
          if (kural) { t.cozum = kural.c; $(".t-cozum", kart).value = kural.c; }
        }
        kartGuncelle(kart, t);
      });
      $(".t-konu", kart).addEventListener("input", (e) => (t.konu = e.target.value));
      $(".t-aciklama", kart).addEventListener("input", (e) => (t.aciklama = e.target.value));
      $(".t-cozum", kart).addEventListener("input", (e) => { t.cozum = e.target.value; t.cozumElle = true; });
      kisiAlani(kart, t);
      kartGuncelle(kart, t);
      kap.appendChild(kart);
    });
    gonderButonu();
  }

  // Talep sahibi alani: yazdikca SDP'de ara, listeden sec
  function kisiAlani(kart, t) {
    const inp = $(".t-kisi", kart);
    const kutu = $(".oneriler", kart);
    let zamanlayici = null, sonArama = "";
    const kapat = () => kutu.classList.remove("acik");

    inp.addEventListener("input", () => {
      clearTimeout(zamanlayici);
      const q = inp.value.trim();
      if (q.length < 3) { kapat(); return; }
      zamanlayici = setTimeout(async () => {
        sonArama = q;
        let liste = [];
        try { liste = await sdp.kullaniciAra(q); } catch (e) { durum(e.message, true); }
        if (sonArama !== q) return;
        kutu.innerHTML = "";
        for (const u of liste.slice(0, 12)) {
          const d = document.createElement("div");
          d.className = "oneri";
          d.innerHTML = "<span></span><small></small>";
          d.firstChild.textContent = u.ad;
          d.lastChild.textContent = [u.kullanici_adi, u.eposta, u.departman].filter(Boolean).join(" · ");
          d.addEventListener("mousedown", (e) => {
            e.preventDefault();
            t.kullanici = { ...u, durum: "bulundu" };
            inp.value = kisiMetni(t.kullanici);
            kapat(); kartGuncelle(kart, t);
          });
          kutu.appendChild(d);
        }
        const eposta = q.includes("@") ? q.toLowerCase() : /^[a-z0-9._-]+$/i.test(q) ? q.toLowerCase() + "@" + (ayar.alanAdi || "example.com") : null;
        if (eposta) {
          const d = document.createElement("div");
          d.className = "oneri";
          d.innerHTML = "<span></span><small>SDP'de kayıtlı değilse bu e-posta ile oluşturulur</small>";
          d.firstChild.textContent = "Yeni kullanıcı: " + eposta;
          d.addEventListener("mousedown", (e) => {
            e.preventDefault();
            t.kullanici = { durum: "eposta", eposta, ad: eposta };
            inp.value = eposta; kapat(); kartGuncelle(kart, t);
          });
          kutu.appendChild(d);
        }
        kutu.classList.toggle("acik", kutu.children.length > 0);
      }, 350);
    });
    inp.addEventListener("blur", () => setTimeout(kapat, 150));
  }

  // ---------- Cozumle ----------
  async function cozumle() {
    const metin = $("#metin").value.trim();
    if (!metin) { durum("Önce ne yapıldığını yazın."); return; }
    if (ayarEksik()) { ayarUyarisi(); durum("API anahtarı ve teknisyen ID gerekli.", true); return; }
    $("#cozumle").disabled = true;
    durum("Kullanıcılar aranıyor…");
    let aramaHatasi = null;
    const bul = async (anahtar, isimle) => {
      try { return await sdp.kullaniciBul(anahtar, isimle); }
      catch (e) { aramaHatasi = e; return null; }
    };
    try {
      const yeni = await window.Cozumleyici.cozumle(metin, bul, { alanAdi: ayar.alanAdi });
      const ogrenilen = oku(OGRENILEN_ANAHTARI, []);
      for (const t of yeni) {
        const o = window.Kategoriler.ogrenilenBul(t.ham ? t.ham.aciklama : t.konu, ogrenilen);
        if (o && (!t.kategori_id || o.puan >= 2)) {
          t.kategori_id = o.kategori_id; t.alt_kategori_id = o.alt_kategori_id; t.oge_id = "";
          const kural = window.Kategoriler.KURALLAR.find((r) => r.k === o.kategori_id && r.a === o.alt_kategori_id);
          t.cozum = kural ? kural.c : "İşlem tamamlandı.";
          t.ogrenildi = true;
        }
      }
      if (ayar.varsayilanKat) {
        const [vk, va] = ayar.varsayilanKat.split("|");
        const kural = window.Kategoriler.KURALLAR.find((r) => r.k === vk && r.a === va);
        for (const t of yeni) if (!t.kategori_id) {
          t.kategori_id = vk; t.alt_kategori_id = va; t.oge_id = "";
          if (!t.cozum) t.cozum = kural ? kural.c : "İşlem tamamlandı.";
        }
      }
      ticketlar = yeni;
      ciz();
      if (!aramaHatasi && ayar.otomatik) { await gonder(true); return; }
      if (aramaHatasi) durum("Otomatik açılmadı, kullanıcı aranırken hata oluştu: " + aramaHatasi.message, true);
      else {
        const eksik = yeni.filter((t) => !t.kullanici || !t.kategori_id).length;
        durum(yeni.length + " ticket hazırlandı" + (eksik ? ", " + eksik + " tanesinde eksik alan var." : ". Kontrol edip gönderin."));
      }
    } catch (e) {
      durum("Çözümlenemedi: " + e.message, true);
    } finally {
      $("#cozumle").disabled = false;
    }
  }

  const tamMi = (t) => !!(t.kullanici && t.kategori_id && t.konu);

  async function gonder(otomatik) {
    let bekleyen = ticketlar.filter((t) => !(t.sonuc && t.sonuc.id));
    const eksik = bekleyen.filter((t) => !tamMi(t));
    if (otomatik) bekleyen = bekleyen.filter(tamMi);
    else if (eksik.length) { durum(eksik.length + " ticket'ta talep sahibi, kategori veya konu eksik.", true); return; }
    if (!bekleyen.length) {
      if (eksik.length) durum("Otomatik açılmadı: " + eksik.length + " ticket'ta talep sahibi veya kategori eksik. Tamamlayıp Gönder'e basın.", true);
      return;
    }
    if (ayar.onaySor && !window.confirm(bekleyen.length + " ticket açılacak. Devam edilsin mi?")) return;
    $("#gonder").disabled = true;
    let ok = 0, hata = 0;
    const kartlar = $$(".ticket", $("#onizleme"));
    for (const t of bekleyen) {
      const kart = kartlar[ticketlar.indexOf(t)];
      durum("Gönderiliyor… (" + (ok + hata + 1) + "/" + bekleyen.length + ")");
      try {
        const s = await sdp.ticketAc(t);
        t.sonuc = s; ok++;
        gecmiseEkle({ id: s.id, link: s.link, konu: t.konu, kisi: t.kullanici.ad || t.kullanici.eposta, kisiKey: kisiAnahtari(t.kullanici), kategori: kategoriAdi(t.kategori_id, t.alt_kategori_id), tarih: new Date().toISOString() });
        if (t.katElle) ogren(t.ham ? t.ham.aciklama : t.konu, t.kategori_id, t.alt_kategori_id);
      } catch (e) {
        t.sonuc = { hata: e.message }; hata++;
      }
      if (kart) kartGuncelle(kart, t);
    }
    $("#gonder").disabled = false;
    const kalan = otomatik ? eksik.length : 0;
    durum(ok + " ticket açıldı" +
      (hata ? ", " + hata + " hata" : "") +
      (kalan ? ". " + kalan + " ticket'ta eksik alan var, kartta tamamlayıp Gönder'e basın." : "."), hata > 0 || kalan > 0);
    metniGuncelle();
  }

  $("#cozumle").addEventListener("click", cozumle);
  $("#metin").addEventListener("keydown", (e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) cozumle(); });
  $("#gonder").addEventListener("click", () => gonder(false));
  $("#bosEkle").addEventListener("click", () => {
    ticketlar.push({ kullanici: null, konu: "", aciklama: "", cozum: "", kategori_id: "", alt_kategori_id: "" });
    ciz();
  });
  $("#temizle").addEventListener("click", () => { ticketlar = []; $("#metin").value = ""; durum(""); ciz(); });

  // ---------- Tekrar korumasi ve ogrenme ----------
  function kisiAnahtari(k) {
    if (!k) return "";
    return (k.id ? "id:" + k.id : "e:" + (k.eposta || k.ad || "")).toLowerCase();
  }

  // Acilan ticket'lari kutudan cikar, sadece acilmayanlari birak
  function metniGuncelle() {
    const kalan = ticketlar.filter((t) => !(t.sonuc && t.sonuc.id) && t.ham);
    const parcalar = [];
    for (const t of kalan) {
      const p = [t.ham.kisi, t.ham.sinif ? t.ham.sinif.toLocaleLowerCase("tr") : "", t.ham.aciklama].filter(Boolean).join(" ");
      if (!parcalar.includes(p)) parcalar.push(p);
    }
    $("#metin").value = parcalar.join(", ");
  }

  function ogren(metin, k, a) {
    const w = window.Kategoriler.anahtarKelimeler(metin || "");
    if (!w.length || !k || !a) return;
    const imza = w.slice().sort().join(" ");
    const l = oku(OGRENILEN_ANAHTARI, []).filter((o) => o.w.slice().sort().join(" ") !== imza);
    l.unshift({ w, k: String(k), a: String(a) });
    yaz(OGRENILEN_ANAHTARI, l.slice(0, 800));
  }

  // ---------- Hizli dugmeler ----------
  function hizliCiz() {
    const kap = $("#hizliDugmeler");
    kap.innerHTML = "";
    const liste = (ayar.hizli || "").split(",").map((x) => x.trim()).filter(Boolean);
    for (const metin of liste) {
      const b = document.createElement("button");
      b.className = "cip"; b.type = "button"; b.textContent = metin;
      b.addEventListener("click", () => {
        const m = $("#metin");
        const v = m.value.replace(/\s+$/, "");
        // Son parca zaten bir is iceriyorsa (kullanici adi + aciklama) yeni parca baslatma; sadece ekle
        m.value = (v ? v + " " : "") + metin;
        m.focus();
        m.setSelectionRange(m.value.length, m.value.length);
      });
      kap.appendChild(b);
    }
    const virgul = document.createElement("button");
    virgul.className = "cip cip-virgul"; virgul.type = "button"; virgul.textContent = ", sonraki";
    virgul.title = "Yeni ticket'a geç";
    virgul.addEventListener("click", () => {
      const m = $("#metin"); const v = m.value.replace(/[\s,]+$/, "");
      m.value = v ? v + ", " : ""; m.focus(); m.setSelectionRange(m.value.length, m.value.length);
    });
    kap.appendChild(virgul);
  }

  // ---------- Sesle yazma (Android) ----------
  window.__sesSonuc = function (metin, hata) {
    const b = $("#sesBtn"); if (b) b.classList.remove("dinliyor");
    if (hata) { durum(hata, true); return; }
    if (!metin) return;
    const m = $("#metin");
    const v = m.value.replace(/\s+$/, "");
    m.value = (v ? v + (/,$/.test(v) ? " " : ", ") : "") + metin;
    durum("Söylediğiniz eklendi. Kontrol edip Ticket aç'a basın.");
  };
  function sesKur() {
    const b = $("#sesBtn");
    if (window.AndroidKopru && window.AndroidKopru.sesBaslat) {
      b.classList.remove("gizli");
      b.addEventListener("click", () => { b.classList.add("dinliyor"); window.AndroidKopru.sesBaslat(); });
    } else if (window.Platform.platformAdi() === "masaustu") {
      $("#sesIpucu").classList.remove("gizli");
    }
  }

  // ---------- Ozet ----------
  let ozetDonem = 7;
  function ozetCiz() {
    const kap = $("#ozet");
    const sinir = ozetDonem ? Date.now() - ozetDonem * 86400000 : 0;
    const l = oku(GECMIS_ANAHTARI, []).filter((r) => r.tarih && Date.parse(r.tarih) >= sinir);
    $$(".donem").forEach((b) => b.classList.toggle("aktif", Number(b.dataset.gun) === ozetDonem));
    kap.innerHTML = "";
    const baslik = document.createElement("div");
    baslik.className = "ozet-sayi";
    baslik.innerHTML = "<strong></strong><span></span>";
    baslik.firstChild.textContent = String(l.length);
    baslik.lastChild.textContent = " ticket açıldı";
    kap.appendChild(baslik);
    if (!l.length) return;
    const grupla = (f) => {
      const m = new Map();
      l.forEach((r) => { const k = f(r) || "?"; m.set(k, (m.get(k) || 0) + 1); });
      return [...m.entries()].sort((a, b) => b[1] - a[1]);
    };
    const bolum = (ad, satirlar, enFazla) => {
      const d = document.createElement("div"); d.className = "ozet-bolum";
      const h = document.createElement("div"); h.className = "etiket"; h.textContent = ad; d.appendChild(h);
      const tepe = satirlar[0] ? satirlar[0][1] : 1;
      for (const [k, n] of satirlar.slice(0, enFazla)) {
        const s = document.createElement("div"); s.className = "ozet-satir";
        s.innerHTML = '<span class="ozet-ad"></span><span class="ozet-cubuk"><i></i></span><span class="ozet-n"></span>';
        s.querySelector(".ozet-ad").textContent = k;
        s.querySelector("i").style.width = Math.max(4, Math.round((n / tepe) * 100)) + "%";
        s.querySelector(".ozet-n").textContent = String(n);
        d.appendChild(s);
      }
      kap.appendChild(d);
    };
    bolum("Kategoriye göre", grupla((r) => (r.kategori || "").split(" / ")[0]), 8);
    bolum("Alt kategoriye göre", grupla((r) => (r.kategori || "").split(" / ").slice(1).join(" / ")), 8);
    bolum("En çok ticket açılan kişiler", grupla((r) => r.kisi), 8);
    const gunler = grupla((r) => new Date(r.tarih).toLocaleDateString("tr-TR", { weekday: "short", day: "numeric", month: "short" }));
    bolum("Günlere göre", gunler.sort((a, b) => 0), 14);
  }

  // ---------- Gecmis ----------
  function gecmiseEkle(k) {
    const g = oku(GECMIS_ANAHTARI, []);
    g.unshift(k);
    yaz(GECMIS_ANAHTARI, g.slice(0, 300));
  }

  function gecmisSatir(r) {
    const d = document.createElement("div");
    d.className = "gecmis-satir";
    const a = document.createElement("a");
    a.href = r.link; a.dataset.link = r.link; a.textContent = "#" + r.id;
    const ic = document.createElement("div");
    ic.className = "ic";
    const k = document.createElement("div"); k.textContent = r.konu;
    const s = document.createElement("small");
    s.textContent = [r.kisi, r.kategori || r.durum, r.tarihYazi].filter(Boolean).join(" · ");
    ic.append(k, s);
    d.append(a, ic);
    return d;
  }

  function gecmisCiz(liste) {
    const kap = $("#gecmisListe");
    kap.innerHTML = "";
    const g = liste || oku(GECMIS_ANAHTARI, []).map((r) => ({ ...r, tarihYazi: new Date(r.tarih).toLocaleString("tr-TR", { dateStyle: "short", timeStyle: "short" }) }));
    if (!g.length) { kap.innerHTML = '<p class="ipucu">Bu cihazdan henüz ticket açılmadı.</p>'; return; }
    g.forEach((r) => kap.appendChild(gecmisSatir(r)));
  }

  $("#sunucudanYukle").addEventListener("click", async () => {
    const kap = $("#gecmisListe");
    kap.innerHTML = '<p class="ipucu">Yükleniyor…</p>';
    try {
      const l = await sdp.sonTicketlar(30);
      gecmisCiz(l.map((r) => ({ ...r, kisi: r.talep_sahibi, tarihYazi: r.tarih })));
    } catch (e) {
      kap.innerHTML = "";
      const p = document.createElement("p"); p.className = "ipucu"; p.textContent = e.message; kap.appendChild(p);
    }
  });
  $("#gecmisSil").addEventListener("click", () => { yaz(GECMIS_ANAHTARI, []); gecmisCiz(); });

  // ---------- Ayar formu ----------
  function formDoldur() {
    $("#aUrl").value = ayar.url || "";
    $("#aKey").value = ayar.apiKey || "";
    $("#aTekId").value = ayar.teknisyenId || "";
    $("#aGrup").value = ayar.grupId || "";
    $("#aAlan").value = ayar.alanAdi || "";
    $("#aSsl").checked = !!ayar.sslKapali;
    $("#aOnay").checked = !!ayar.onaySor;
    $("#aOtomatik").checked = ayar.otomatik !== false;
    $("#aHizli").value = ayar.hizli || "";
    kategoriSecenekleri($("#aVarsayilanKat"));
    $("#aVarsayilanKat").options[0].textContent = "— Yok (sorsun) —";
    $("#aVarsayilanKat").value = ayar.varsayilanKat || "";
    $("#aTekAra").value = ayar.teknisyenAd || "";
    if (ayar.katOzet) { $("#katSonuc").textContent = ayar.katOzet; $("#katSonuc").className = "kucuk iyi"; }
    $("#cozumle").textContent = ayar.otomatik !== false ? "Ticket aç" : "Çözümle";
  }
  function formdanAl() {
    return {
      url: $("#aUrl").value.trim() || VARSAYILAN.url,
      apiKey: $("#aKey").value.trim(),
      teknisyenId: $("#aTekId").value.trim(),
      grupId: $("#aGrup").value.trim(),
      alanAdi: $("#aAlan").value.trim().replace(/^@/, "") || VARSAYILAN.alanAdi,
      sslKapali: $("#aSsl").checked,
      onaySor: $("#aOnay").checked,
      otomatik: $("#aOtomatik").checked,
      hizli: $("#aHizli").value,
      varsayilanKat: $("#aVarsayilanKat").value,
      teknisyenAd: $("#aTekAra").value.trim(),
    };
  }
  function uygula(yeni) {
    ayar = { ...ayar, ...yeni };
    sdp = new window.SDPIstemci.SDP(ayar, window.Platform.http);
    $("#cozumle").textContent = ayar.otomatik !== false ? "Ticket aç" : "Çözümle";
    hizliCiz();
    ayarUyarisi();
  }

  function kaydet(otomatikMi) {
    uygula(formdanAl());
    const ok = yaz(AYAR_ANAHTARI, ayar);
    const s = $("#kaydetSonuc");
    s.textContent = ok ? (otomatikMi ? "Değişiklikler otomatik kaydedildi." : "Kaydedildi.") : "Kaydedilemedi (depolama kapalı).";
    s.className = "kucuk " + (ok ? "iyi" : "kotu");
    return ok;
  }
  $("#kaydet").addEventListener("click", () => kaydet(false));
  // Ayarlar sayfasinda yapilan her degisiklik kendiliginden kaydedilir
  let kayitZamanlayici = null;
  const otomatikKaydet = () => { clearTimeout(kayitZamanlayici); kayitZamanlayici = setTimeout(() => kaydet(true), 400); };
  $("#ayarlar").addEventListener("input", otomatikKaydet);
  $("#ayarlar").addEventListener("change", otomatikKaydet);
  window.addEventListener("beforeunload", () => { clearTimeout(kayitZamanlayici); try { kaydet(true); } catch (e) { /* yok */ } });

  $("#testEt").addEventListener("click", async () => {
    const s = $("#testSonuc");
    s.textContent = "Deneniyor…"; s.className = "kucuk";
    const gecici = new window.SDPIstemci.SDP({ ...ayar, ...formdanAl() }, window.Platform.http);
    try { await gecici.test(); s.textContent = "Bağlantı başarılı."; s.className = "kucuk iyi"; }
    catch (e) { s.textContent = e.message; s.className = "kucuk kotu"; }
  });

  $("#tekAra").addEventListener("click", async () => {
    const kap = $("#tekSonuc");
    kap.innerHTML = '<p class="ipucu">Aranıyor…</p>';
    const gecici = new window.SDPIstemci.SDP({ ...ayar, ...formdanAl() }, window.Platform.http);
    try {
      const l = await gecici.teknisyenAra($("#aTekAra").value.trim());
      kap.innerHTML = "";
      if (!l.length) kap.innerHTML = '<p class="ipucu">Bulunamadı. ID\'yi elle girebilirsiniz.</p>';
      l.forEach((t) => {
        const d = document.createElement("div");
        d.className = "tek-satir";
        const sp = document.createElement("span"); sp.textContent = t.ad + " (ID " + t.id + ")";
        const b = document.createElement("button"); b.className = "ikincil"; b.textContent = "Seç";
        b.addEventListener("click", () => { $("#aTekId").value = t.id; $("#aTekAra").value = t.ad; kap.innerHTML = ""; kaydet(true); });
        d.append(sp, b); kap.appendChild(d);
      });
    } catch (e) {
      kap.innerHTML = "";
      const p = document.createElement("p"); p.className = "ipucu"; p.textContent = e.message + " — ID'yi elle girebilirsiniz."; kap.appendChild(p);
    }
  });

  $("#katOgren").addEventListener("click", async () => {
    const s = $("#katSonuc");
    const b = $("#katOgren");
    b.disabled = true; s.className = "kucuk";
    try {
      const gecici = new window.SDPIstemci.SDP({ ...ayar, ...formdanAl() }, window.Platform.http);
      const r = await gecici.kategorileriCek((m) => (s.textContent = m), 150);
      const onceki = oku(OZELKAT_ANAHTARI, []);
      const birlesik = onceki.concat(r.kategoriler.filter((x) => !onceki.some((o) => o.k === x.k && o.a === x.a)));
      yaz(OZELKAT_ANAHTARI, birlesik);
      const yeniKat = window.Kategoriler.ozelKategorileriEkle(r.kategoriler);
      let ogrenilen = 0;
      for (const o of r.ornekler) {
        const tahmin = window.Kategoriler.kategoriBul(o.konu);
        if (!tahmin || tahmin.kategori_id !== o.k || tahmin.alt_kategori_id !== o.a) { ogren(o.konu, o.k, o.a); ogrenilen++; }
      }
      kategoriSecenekleri($("#aVarsayilanKat"));
      $("#aVarsayilanKat").options[0].textContent = "— Yok (sorsun) —";
      $("#aVarsayilanKat").value = ayar.varsayilanKat || "";
      const toplam = new Set(r.kategoriler.map((x) => x.k + "|" + x.a)).size;
      s.textContent = (r.kaynak === "liste" ? "SDP kategori listesinden " : "Son ticket'larınızdan ") +
        toplam + " alt kategori bulundu, " + yeniKat + " tanesi yeni eklendi, " + ogrenilen + " örnek öğrenildi.";
      s.className = "kucuk iyi";
      ayar.katOzet = s.textContent + " (" + new Date().toLocaleDateString("tr-TR") + ")";
      yaz(AYAR_ANAHTARI, ayar);
    } catch (e) {
      s.textContent = e.message; s.className = "kucuk kotu";
    } finally {
      b.disabled = false;
    }
  });
  $("#ogrenSifirla").addEventListener("click", () => {
    yaz(OGRENILEN_ANAHTARI, []); yaz(OZELKAT_ANAHTARI, []);
    ayar.katOzet = ""; yaz(AYAR_ANAHTARI, ayar);
    $("#katSonuc").textContent = "Öğrenilenler silindi (uygulamayı yeniden açınca listeden de kalkar)."; $("#katSonuc").className = "kucuk";
  });

  // ---------- Baslangic ----------
  window.Kategoriler.ozelKategorileriEkle(oku(OZELKAT_ANAHTARI, []));
  $$(".donem").forEach((b) => b.addEventListener("click", () => { ozetDonem = Number(b.dataset.gun); ozetCiz(); }));
  const pAdi = window.Platform.platformAdi();
  $("#platformAdi").textContent = { masaustu: "Masaüstü", android: "Android", web: "Web" }[pAdi];
  formDoldur();
  hizliCiz();
  sesKur();
  ayarUyarisi();
  if (ayarEksik()) sekmeGit("ayarlar");
  ciz();
})();
