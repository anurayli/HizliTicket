// Serbest metni ticket listesine ceviren kural tabanli cozumleyici.
// kullaniciBul(anahtar) -> Promise<{id, ad, eposta, kullanici_adi} | null>
(function (root) {
  const K = typeof module !== "undefined" && module.exports ? require("./kategoriler.js") : root.Kategoriler;
  const { katla, kategoriBul } = K;

  // Kullanici adi olamayacak sozcukler (katlanmis)
  const DOLGU = new Set(("ve ile icin bir bu su o da de ki mi hep hepsi hepsini ayri ayrica tum butun " +
    "ticket ticketi ticketlari tiket ac acar acin acalim olarak isimli kullanici kullanicisi kullanicisina kullancisi " +
    "yeni eski ogrenci ogrenciler ogretmen personel sinif sinifi siniflari sinifinin ortaokul ilkokul lise " +
    "hazir olanlar olan islemleri islemi islem talepleri talebi talep sorunlari sorunu sorun destek it " +
    "smartboard smart akilli tahta macbook mac windows bilgisayar laptop ipad ipadler ipadleri wifi internet " +
    "yazici yazilim sifre hesap kart dosya video muzik sunum oditoryum kutuphane fh class set mdm sistem " +
    "kurulum kurulumu kurulumlari teslim teslimi veri dokunmatik ekran baglanti ayni bu").split(" "));

  const SINIF = /^(1[0-2]|[1-9])[-\s]?([a-hçA-HÇ])$/;
  const EPOSTA = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const KULLANICI_KELIME = /^kull?an?[iı]?c[iı]/; // kullanici, kullanicisi, kullancisi, kullanicisina...
  const SON_EKLER = new Set(["ya", "ye", "a", "e", "na", "ne", "nin", "in"]);

  function sinifMi(t) {
    const m = (t || "").replace(/\.$/, "").match(SINIF);
    return m ? m[1] + m[2].toLocaleUpperCase("tr") : null;
  }

  function temizToken(t) {
    return t.replace(/^[("'“]+|[)"'”.:;!?]+$/g, "");
  }

  function kAdi(t) {
    // kullanici adi icin: Turkce buyuk harfleri ASCII'ye indir
    return t.replace(/İ/g, "i").replace(/I/g, "i").toLowerCase().replace(/'.*$/, "");
  }

  function dolguMu(t) {
    return DOLGU.has(katla(t));
  }

  function kullaniciAdiGibi(t) {
    return /^[a-z][a-z0-9._-]{2,30}$/.test(kAdi(t)) && !dolguMu(t) && !sinifMi(t);
  }

  // Cumle sonundaki "ticket ac", "hepsini ayri ayri ac" vb. kaliplari sil
  function sonlariTemizle(metin) {
    let s = metin;
    const kaliplar = [
      /\b(hepsini|hepsi|tümünü|tamamını)\b[^,]*$/i,
      /\b(için\s+)?(ayrı\s+ayrı|ayrı)\s+(ticket\S*\s+)?aç\S*\s*$/i,
      /\bticket\S*\s+aç\S*\s*$/i,
      /\baç\S*\s+ticket\S*\s*$/i,
      /\bticket\S*\s*$/i,
      /\baç\s*$/i,
    ];
    let degisti = true;
    while (degisti) {
      degisti = false;
      for (const k of kaliplar) {
        const y = s.replace(k, "").trim().replace(/[,\s]+$/, "");
        if (y !== s) { s = y; degisti = true; }
      }
    }
    return s;
  }

  // Turkce harflerle calisan kelime siniri (JS \b sadece ASCII'yi tanir)
  const B0 = "(?<![\\p{L}\\p{N}])", B1 = "(?![\\p{L}\\p{N}])";
  const R = (govde, bayrak) => new RegExp(govde.replace(/<</g, B0).replace(/>>/g, B1), (bayrak || "gi") + "u");

  const BICIM = [
    [R("<<(ıt|it|IT)>>"), "IT"], [R("<<fh>>"), "FH"], [R("<<mdm>>"), "MDM"], [R("<<wi-?fi>>"), "Wi-Fi"],
    [R("<<macbook>>"), "MacBook"], [R("<<ipad"), "iPad"], [R("<<type-?c>>"), "Type-C"], [R("<<hdmi>>"), "HDMI"],
    [R("<<smart\\s?board>>"), "smartboard"], [R("<<youtube>>"), "YouTube"],
  ];

  const TEMIZLE = [
    R("^\\s*(isimli\\s+)?kull?an?[ıi]?c[ıi]s[ıi](na|nın)?>>"),
    R("<<ti[cke]{2,4}t\\S*(\\s+aç\\S*)?"),
    R("<<her\\s+sınıf\\s+için>>"),
    R("<<aynı\\s+konulu>>"),
    R("<<(ayrı\\s+ayrı|ayrı)>>"),
    R("^\\s*için>>"),
    R("^\\s*sınıf(ları|ı|lar|ın|ının)?>>"),
    R("\\s+için(\\s+aç\\S*)?\\s*$"),
    R("\\s+aç\\s*$"),
  ];

  function aciklamaTemizle(s) {
    for (let tur = 0; tur < 2; tur++) for (const r of TEMIZLE) s = s.replace(r, " ");
    s = s.replace(/\s{2,}/g, " ").replace(/^[\s,;-]+|[\s,;-]+$/g, "").trim();
    for (const [r, y] of BICIM) s = s.replace(r, y);
    return s;
  }

  // Aciklama sadece dolgu kelimeleri / sayilardan mi olusuyor? ("bu 5 kullanici icin")
  function bosAciklamaMi(s) {
    const t = s.split(/\s+/).filter(Boolean);
    const BOS = new Set("bu su ayni ayri icin ve ile her hepsi hepsini tum tumu butun kisi kisiye kisiler olarak ac".split(" "));
    return t.every((w) => /^\d+$/.test(w) || BOS.has(katla(w)) || KULLANICI_KELIME.test(katla(w)));
  }

  function buyukBasla(s) {
    if (!s || /^i[A-Z]/.test(s)) return s;
    return s.charAt(0).toLocaleUpperCase("tr") + s.slice(1);
  }

  // Bir parcadaki "kullanici olarak X", "X kullanicisina", "kullanici X" kalibini bul
  function vekilBul(tokenlar) {
    for (let i = 0; i < tokenlar.length; i++) {
      const f = katla(tokenlar[i]);
      if (!KULLANICI_KELIME.test(f)) continue;
      let hedef = -1;
      const sil = [i];
      if (tokenlar[i + 1] && katla(tokenlar[i + 1]) === "olarak" && tokenlar[i + 2]) {
        hedef = i + 2; sil.push(i + 1);
      } else if (f === "kullanici" && tokenlar[i + 1] && kullaniciAdiGibi(tokenlar[i + 1])) {
        hedef = i + 1;
      } else if (i > 0) {
        hedef = i - 1;
        if (katla(tokenlar[hedef]) === "isimli" && i > 1) { sil.push(hedef); hedef = i - 2; }
        if (tokenlar[i + 1] && katla(tokenlar[i + 1]) === "icin") sil.push(i + 1);
      }
      if (hedef < 0 || !tokenlar[hedef]) continue;
      const ad = temizToken(tokenlar[hedef]).replace(/'.*$/, "");
      if (!EPOSTA.test(ad) && !kullaniciAdiGibi(ad)) continue;
      sil.push(hedef);
      if (tokenlar[hedef + 1] && SON_EKLER.has(katla(tokenlar[hedef + 1]))) sil.push(hedef + 1);
      const kalan = tokenlar.filter((_, j) => !sil.includes(j));
      return { anahtar: ad, kalan };
    }
    return null;
  }

  async function kullaniciCoz(anahtar, kullaniciBul) {
    if (EPOSTA.test(anahtar)) {
      const u = await kullaniciBul(anahtar.toLowerCase());
      return u ? { ...u, durum: "bulundu" } : { durum: "eposta", eposta: anahtar.toLowerCase(), ad: anahtar.toLowerCase() };
    }
    const u = await kullaniciBul(kAdi(anahtar));
    return u ? { ...u, durum: "bulundu" } : null;
  }

  // Sesle yazmadan gelen metni duzelt: "virgul" -> ",", "yedi a" / "7 A" -> "7a"
  const SAYILAR = { bir: 1, iki: 2, uc: 3, dort: 4, bes: 5, alti: 6, yedi: 7, sekiz: 8, dokuz: 9, on: 10 };
  function sesDuzelt(m) {
    m = m.replace(/(^|\s)virgül(?=\s|$)/giu, ",").replace(/\s+,/g, ",");
    m = m.replace(/(^|[\s,])(\d{1,2})\s*[-\s]\s*([a-hA-H])(?=$|[\s,])/g, "$1$2$3");
    m = m.replace(/(^|[\s,])([^\s,]+)\s+([a-hA-H])(?=$|[\s,])/g, (t, on, kelime, harf) => {
      const n = SAYILAR[katla(kelime)];
      return n ? on + n + harf : t;
    });
    return m;
  }

  async function cozumle(metin, kullaniciBul, ayar) {
    ayar = ayar || {};
    const alan = ayar.alanAdi || "example.com";
    const govde = sonlariTemizle(sesDuzelt((metin || "").replace(/\r/g, "").replace(/\n+/g, ", ")).trim());
    const parcalar = govde.split(/\s*[,;]\s*/).map((p) => p.trim()).filter(Boolean);

    const gruplar = [];
    let bekleyenKullanicilar = [];
    let bekleyenSiniflar = [];

    for (const parca of parcalar) {
      let tokenlar = parca.split(/\s+/).map(temizToken).filter(Boolean);
      if (!tokenlar.length) continue;

      // 1) Bastaki siniflar
      const siniflar = [];
      while (tokenlar.length && sinifMi(tokenlar[0])) siniflar.push(sinifMi(tokenlar.shift()));

      // 2) Bastaki kullanici
      let kullanici = null;
      if (!siniflar.length && tokenlar.length) {
        const ilk = tokenlar[0];
        if (!dolguMu(ilk)) {
          kullanici = await kullaniciCoz(ilk, kullaniciBul);
          if (!kullanici && tokenlar[1] && !dolguMu(tokenlar[1])) {
            const ikili = await kullaniciBul(ilk + " " + tokenlar[1], true);
            if (ikili) { kullanici = { ...ikili, durum: "bulundu" }; tokenlar.shift(); }
          }
          if (kullanici) { tokenlar.shift(); kullanici.anahtar = kullanici.anahtar || kAdi(ilk); }
        }
      }

      // 3) Vekil kalip ("kullanici olarak X")
      let vekil = null;
      if (!kullanici) {
        const v = vekilBul(tokenlar);
        if (v) {
          tokenlar = v.kalan;
          vekil = (await kullaniciCoz(v.anahtar, kullaniciBul)) ||
            { durum: "eposta", eposta: kAdi(v.anahtar) + "@" + alan, ad: kAdi(v.anahtar) };
          vekil.anahtar = kAdi(v.anahtar);
        }
      }

      // 4) Hala kullanici yoksa ve ilk kelime kullanici adina benziyorsa: kayitsiz kullanici
      // (Devam parcalari dolgu kelimesiyle baslar, ornegin "hazir olanlar teslimi".)
      const oncekiVar = gruplar.length > 0;
      if (!kullanici && !vekil && !siniflar.length && tokenlar.length && kullaniciAdiGibi(tokenlar[0])) {
        const ilk = tokenlar.shift();
        kullanici = { durum: "eposta", eposta: kAdi(ilk) + "@" + alan, ad: kAdi(ilk), anahtar: kAdi(ilk) };
      }

      // Parca icindeki siniflar (ornegin "ayilmaz 7a macbook ...")
      const icSiniflar = [];
      tokenlar = tokenlar.filter((t) => {
        const s = sinifMi(t);
        if (s) { icSiniflar.push(s); return false; }
        return true;
      });

      let aciklama = aciklamaTemizle(tokenlar.join(" "));
      if (aciklama && bosAciklamaMi(aciklama) && !kullanici) aciklama = "";

      if (!aciklama) {
        // Sadece kullanici / sinif: bir sonraki aciklamayi bekler
        if (kullanici) bekleyenKullanicilar.push(kullanici);
        if (vekil) bekleyenKullanicilar.push(vekil);
        bekleyenSiniflar.push(...siniflar, ...icSiniflar);
        continue;
      }

      if (!kullanici && !siniflar.length && oncekiVar && !bekleyenKullanicilar.length && !bekleyenSiniflar.length &&
          (!vekil || (dolguMu(tokenlar[0] || "") && !gruplar[gruplar.length - 1].kullanicilar.length))) {
        // Onceki grubun devami ("toplama, hazir olanlar teslimi")
        const g = gruplar[gruplar.length - 1];
        g.aciklama += ", " + aciklama;
        g.siniflar.push(...icSiniflar);
        if (vekil) g.vekil = vekil;
        continue;
      }

      gruplar.push({
        kullanicilar: [...bekleyenKullanicilar, ...(kullanici ? [kullanici] : [])],
        vekil,
        siniflar: [...bekleyenSiniflar, ...siniflar, ...icSiniflar],
        aciklama,
      });
      bekleyenKullanicilar = [];
      bekleyenSiniflar = [];
    }

    // Sona kalan bekleyenler: son gruba ekle
    if ((bekleyenKullanicilar.length || bekleyenSiniflar.length) && gruplar.length) {
      const g = [...gruplar].reverse().find((x) => !x.kullanicilar.length && !x.vekil) || gruplar[gruplar.length - 1];
      g.kullanicilar.push(...bekleyenKullanicilar);
      g.siniflar.push(...bekleyenSiniflar);
    }

    // Vekil devam parcasindaysa (ornegin son parcada "kullanici olarak ayilmaz")
    // devam parcalari gruba eklendiginden vekil zaten grupta; ayrica tum metinde tek vekil varsa
    // kullanicisiz gruplara uygula.
    const tekVekil = gruplar.map((g) => g.vekil).filter(Boolean);

    const ticketlar = [];
    for (const g of gruplar) {
      let kisiler = g.kullanicilar.length ? g.kullanicilar : (g.vekil ? [g.vekil] : (tekVekil.length === 1 ? [tekVekil[0]] : [null]));
      if (g.vekil && g.kullanicilar.length) kisiler = [g.vekil]; // "kullanici olarak X" acik talimat
      const siniflar = [...new Set(g.siniflar)];
      const kat = kategoriBul(g.aciklama);
      for (const kisi of kisiler) {
        for (const sinif of siniflar.length ? siniflar : [null]) {
          const temel = buyukBasla(g.aciklama);
          const konu = (sinif ? sinif + " - " : "") + temel;
          const kimIcin = kisi && kisi.ad && kisi.durum === "bulundu" ? kisi.ad : null;
          ticketlar.push({
            kullanici: kisi,
            sinif,
            konu: konu.length > 120 ? konu.slice(0, 117) + "..." : konu,
            aciklama: (sinif ? sinif + " sınıfı: " : "") + temel + (kimIcin ? " (" + kimIcin + ")" : "") + ".",
            cozum: kat ? kat.cozum : "",
            kategori_id: kat ? kat.kategori_id : "",
            alt_kategori_id: kat ? kat.alt_kategori_id : "",
            oge_id: kat ? kat.oge_id || "" : "",
            emin: !!kat && kat.puan >= 2 && !!kisi && kisi.durum === "bulundu",
            kategoriPuani: kat ? kat.puan : 0,
            ham: { kisi: kisi ? kisi.anahtar || kisi.kullanici_adi || kisi.eposta || "" : "", sinif, aciklama: g.aciklama },
          });
        }
      }
    }
    return ticketlar;
  }

  const api = { cozumle, sonlariTemizle, sinifMi, vekilBul, sesDuzelt };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.Cozumleyici = api;
})(typeof window !== "undefined" ? window : globalThis);
