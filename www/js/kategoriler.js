// Kategori listesi ve anahtar kelime kurallari.
// Terimler "katlanmis" (Turkce karaktersiz, kucuk harf) yazilir.
// Tek kelimelik terimler kelime basi ile eslesir ("yansit" -> "yansitma").
(function (root) {
  const KATEGORILER = [
   {
    "id": "604",
    "ad": "Bağlantı Sorunları",
    "alt": [
     [
      "612",
      "İnternet Bağlantı Sorunu"
     ],
     [
      "613",
      "Sunucu Erişim Sorunu"
     ],
     [
      "614",
      "Telefon Sorunu"
     ]
    ]
   },
   {
    "id": "609",
    "ad": "Bağlantı talepleri",
    "alt": [
     [
      "643",
      "Misafir kullanıcı"
     ],
     [
      "644",
      "Sunucu erişim talepleri"
     ],
     [
      "645",
      "Telefon talebi"
     ],
     [
      "2411",
      "Web Sitesi Erişim Talebi"
     ],
     [
      "1806",
      "Yazıcı bağlantı talebi"
     ]
    ]
   },
   {
    "id": "603",
    "ad": "Cihaz arızaları",
    "alt": [
     [
      "909",
      "Bilgi Ekranı Sorunları"
     ],
     [
      "908",
      "Giriş Kartı Cihaz Sorunları"
     ],
     [
      "907",
      "Güvenlik Kamera Arızası"
     ],
     [
      "607",
      "Masaüstü Sorunları"
     ],
     [
      "608",
      "Notebook Sorunları"
     ],
     [
      "611",
      "Projeksiyon"
     ],
     [
      "610",
      "Telefon Sorunları"
     ],
     [
      "609",
      "Yazıcı Sorunları"
     ]
    ]
   },
   {
    "id": "608",
    "ad": "Cihaz talepleri",
    "alt": [
     [
      "3001",
      "Donanım Kurulum Talebi"
     ],
     [
      "641",
      "Ek Donanım Talebi"
     ],
     [
      "637",
      "Laptop Talebi"
     ],
     [
      "638",
      "Printer Talebi"
     ],
     [
      "912",
      "Projeksiyon Talebi"
     ],
     [
      "640",
      "Telefon Talebi"
     ],
     [
      "639",
      "Toner Talebi"
     ]
    ]
   },
   {
    "id": "1801",
    "ad": "iPad Sorunları",
    "alt": [
     [
      "2402",
      "iPad Cihaz Arızası"
     ],
     [
      "2401",
      "iPad Ekran Arızaları"
     ]
    ]
   },
   {
    "id": "1802",
    "ad": "iPad Talepleri",
    "alt": [
     [
      "2404",
      "iPad Aplikasyon Talebi"
     ],
     [
      "2403",
      "iPad Enroll Talebi",
      [
       [
        "1801",
        "iPad Aplikasyon Talebi"
       ]
      ]
     ],
     [
      "2409",
      "Mezun öğrenci iPad'ini MDM'den çıkarma"
     ],
     [
      "2405",
      "iPad Wifi Bağlantı Talebi"
     ]
    ]
   },
   {
    "id": "602",
    "ad": "Kullanıcı hesap sorunları",
    "alt": [
     [
      "910",
      "Kullanıcı Giriş Kartı Sorunları"
     ],
     [
      "905",
      "Kullanıcı Hesabı Güncelleme",
      [
       [
        "601",
        "Kullanıcı Hesabı Silme"
       ]
      ]
     ],
     [
      "906",
      "Kullanıcı Hesabı Silme"
     ],
     [
      "605",
      "Kullanıcı Şifre Sorunları"
     ],
     [
      "904",
      "Yeni Kullanıcı Hesabı Oluşturma"
     ]
    ]
   },
   {
    "id": "607",
    "ad": "Kullanıcı hesap talepleri",
    "alt": [
     [
      "634",
      "E-posta grubu üye değişiklikleri"
     ],
     [
      "631",
      "Google hesabı oluşturma"
     ],
     [
      "2410",
      "Google ortak dosya erişim talebi"
     ],
     [
      "632",
      "Google şifre değiştirme"
     ],
     [
      "1815",
      "Kimlik kartı tanımlama talebi"
     ],
     [
      "629",
      "Kurum kullanıcı kapatma"
     ],
     [
      "628",
      "Kurum kullanıcı oluşturma"
     ],
     [
      "630",
      "Kurum şifre değiştirme"
     ],
     [
      "635",
      "Yazıcı şifresi talebi"
     ],
     [
      "633",
      "Yeni e-posta grubu talebi"
     ]
    ]
   },
   {
    "id": "901",
    "ad": "Kura / Nakil Sorunları",
    "alt": [
     [
      "1501",
      "Kura ile ilgili sorunlar"
     ],
     [
      "1502",
      "Nakil ile ilgili sorunlar"
     ]
    ]
   },
   {
    "id": "1203",
    "ad": "Monitoring",
    "alt": [
     [
      "1817",
      "Altyapı Monitoring"
     ],
     [
      "1818",
      "Elektrik"
     ],
     [
      "1819",
      "ISP Monitoring"
     ],
     [
      "1816",
      "Network Monitoring"
     ]
    ]
   },
   {
    "id": "1204",
    "ad": "Network",
    "alt": [
     [
      "1823",
      "Konfigürasyon"
     ],
     [
      "1822",
      "NAC - Network Access Control"
     ],
     [
      "1820",
      "SDWAN"
     ],
     [
      "1821",
      "Switch"
     ]
    ]
   },
   {
    "id": "1201",
    "ad": "Network İzleme Problemi",
    "alt": [
     [
      "1801",
      "Network Erişim Sorunu",
      [
       [
        "1204",
        "AP Erişim Problemi"
       ],
       [
        "1203",
        "Cihaz Donanım Problemi"
       ],
       [
        "1201",
        "Cihaz Erişim Sorunu"
       ],
       [
        "1202",
        "Port Erişim Sorunu"
       ]
      ]
     ]
    ]
   },
   {
    "id": "1501",
    "ad": "Okul Talepleri",
    "alt": [
     [
      "2102",
      "Başarı Belgesi Basım İşlemleri"
     ],
     [
      "2105",
      "Dijital Saat İşlemleri"
     ],
     [
      "2104",
      "Okul Zil Sesi Değişiklik İşlemleri"
     ],
     [
      "2103",
      "Yaka Kartı Basım İşlemleri"
     ]
    ]
   },
   {
    "id": "2101",
    "ad": "Olay Kaydı",
    "alt": [
     [
      "3002",
      "Olay Kaydı",
      [
       [
        "2101",
        "Problem"
       ]
      ]
     ],
     [
      "3003",
      "Problem Kaydı"
     ]
    ]
   },
   {
    "id": "606",
    "ad": "Öğrenci Problemleri",
    "alt": [
     [
      "624",
      "Bilgisayar Sorunları"
     ],
     [
      "622",
      "Google hesabı sorunları"
     ],
     [
      "623",
      "Kablosuz bağlantı sorunu"
     ],
     [
      "2408",
      "MFA Sorunu"
     ],
     [
      "1808",
      "Öğrenci Kimlik Kartı Sorunu"
     ],
     [
      "626",
      "Tarayıcı sorunları"
     ],
     [
      "625",
      "Uygulama sorunu"
     ],
     [
      "621",
      "Yazıcı şifresi"
     ]
    ]
   },
   {
    "id": "614",
    "ad": "Öğrenci Talepleri",
    "alt": [
     [
      "1813",
      "Ek Donanım Talebi",
      [
       [
        "1205",
        "Laptop Talebi"
       ]
      ]
     ],
     [
      "1814",
      "Laptop Talebi"
     ],
     [
      "1807",
      "Öğrenci Kimlik Kartı Tanımlama Talebi"
     ],
     [
      "654",
      "Printer kontör yükleme"
     ],
     [
      "1811",
      "Printer Şifresi talebi"
     ],
     [
      "655",
      "Yazılım yükleme"
     ]
    ]
   },
   {
    "id": "1206",
    "ad": "Security",
    "alt": [
     [
      "1830",
      "DDOS"
     ],
     [
      "1827",
      "Firewall"
     ],
     [
      "1829",
      "Security Konfigürasyon"
     ],
     [
      "1828",
      "VPN"
     ]
    ]
   },
   {
    "id": "1803",
    "ad": "Ses / Video Düzenleme Talebi",
    "alt": [
     [
      "2702",
      "Fotoğraf Düzenleme Talebi"
     ],
     [
      "2406",
      "Ses Edit Talebi"
     ],
     [
      "2407",
      "Video Edit Talebi"
     ]
    ]
   },
   {
    "id": "601",
    "ad": "Sınıf içi sorunlar",
    "alt": [
     [
      "2701",
      "Akıllı Tahta Elektrik Sorunu"
     ],
     [
      "602",
      "Apple TV Sorunu"
     ],
     [
      "903",
      "Cihaz Bağlantı Sorunu"
     ],
     [
      "902",
      "İnternet Bağlantı Sorunu"
     ],
     [
      "604",
      "Projeksiyon & Smart TV Sorunları"
     ],
     [
      "603",
      "Ses Sorunu"
     ],
     [
      "601",
      "Smartboard Sorunu"
     ],
     [
      "1201",
      "Viewsonic Sorunları",
      [
       [
        "902",
        "Myviewboard Yazılım Sorunu"
       ],
       [
        "901",
        "Viewsonic Tahta Sorunu"
       ]
      ]
     ]
    ]
   },
   {
    "id": "611",
    "ad": "Sunum-Yayın talepleri",
    "alt": [
     [
      "2106",
      "Bilgilendirme Ekran Yayınları Desteği"
     ],
     [
      "652",
      "Canlı Yayın talebi"
     ],
     [
      "650",
      "Oditoryum destek talebi"
     ],
     [
      "2107",
      "Okul İçi Etkinlik Destek Talepleri"
     ],
     [
      "651",
      "Toplantı sunu destek"
     ]
    ]
   },
   {
    "id": "1202",
    "ad": "Veli Talepleri",
    "alt": [
     [
      "1804",
      "Veli Connected Sorunları"
     ],
     [
      "1803",
      "Veli Smartclass Kullanıcı Adı ve Şifre Sorunları"
     ],
     [
      "1805",
      "Veli Sorunları"
     ],
     [
      "1809",
      "Veli Talepleri"
     ]
    ]
   },
   {
    "id": "1205",
    "ad": "Wireless",
    "alt": [
     [
      "1824",
      "AP - Access Point"
     ],
     [
      "1825",
      "Controller"
     ],
     [
      "1826",
      "Wireless Konfigürasyon"
     ]
    ]
   },
   {
    "id": "605",
    "ad": "Yazılım sorunları",
    "alt": [
     [
      "659",
      "Blackboard Sorunları"
     ],
     [
      "618",
      "Google apps sorunları"
     ],
     [
      "616",
      "MS Office sorunları"
     ],
     [
      "913",
      "Kurum Portalı Sorunu"
     ],
     [
      "617",
      "Smartclass sorunları",
      [
       [
        "606",
        "Ara Karne"
       ],
       [
        "604",
        "Ders Atamaları"
       ],
       [
        "605",
        "Ders Programı"
       ],
       [
        "603",
        "Devamsızlık"
       ],
       [
        "608",
        "Toplu SMS - E-posta Sorunları"
       ],
       [
        "602",
        "Veli Görüşme Sistemi"
       ]
      ]
     ],
     [
      "619",
      "Tarayıcı sorunları"
     ],
     [
      "1831",
      "Windows sistem sorunları"
     ]
    ]
   },
   {
    "id": "610",
    "ad": "Yazılım talepleri",
    "alt": [
     [
      "647",
      "Adobe ürünleri yüklemesi"
     ],
     [
      "1833",
      "Flipbook Güncellemesi"
     ],
     [
      "1810",
      "iPad Yazılım Talepleri"
     ],
     [
      "914",
      "İşletim Sistemi Talepleri"
     ],
     [
      "646",
      "MS Office yüklemesi"
     ],
     [
      "915",
      "Smartclass Talepleri",
      [
       [
        "613",
        "Ara Karne"
       ],
       [
        "611",
        "Ders Atamaları"
       ],
       [
        "612",
        "Ders Programı"
       ],
       [
        "610",
        "Devamsızlık"
       ],
       [
        "615",
        "Toplu SMS - E-posta Sorunları"
       ],
       [
        "609",
        "Veli Görüşme Sistemi"
       ]
      ]
     ],
     [
      "648",
      "Yazılım güncelleme talebi"
     ],
     [
      "916",
      "Yazılım Lisans Talepleri"
     ]
    ]
   }
  ];

  // k: kategori, a: alt kategori, o: (istege bagli) oge, t: {terim: puan}, c: cozum metni
  // Esitlikte listede once gelen kural kazanir.
  const KURALLAR = [
    // --- Sinif ici ---
    { k: "601", a: "903", t: { yansit: 3, hdmi: 3, "type-c": 3, typec: 3, cevirici: 3, donusturucu: 3, adaptor: 2, airplay: 3, "ekran paylas": 3, baglanti: 2, baglanam: 2, macbook: 1, "ekran gelm": 3, "goruntu gelm": 3, "ekran yok": 3 },
      c: "Bağlantı sorunu incelendi ve giderildi, cihaz akıllı tahtaya bağlandı." },
    { k: "601", a: "601", t: { smartboard: 2, "smart board": 2, "akilli tahta": 2, tahta: 1, dokunmatik: 3, kalibrasyon: 3, kalem: 2 },
      c: "Akıllı tahtadaki sorun incelendi ve giderildi." },
    { k: "601", a: "2701", t: { "tahta acilm": 5, "tahta elektrik": 6, elektrik: 3, "guc gelm": 4, "acilmiyor": 1 }, c: "Akıllı tahtanın elektrik sorunu giderildi." },
    { k: "601", a: "1201", o: "901", t: { viewsonic: 7 }, c: "Viewsonic ekrandaki sorun incelendi ve giderildi." },
    { k: "601", a: "1201", o: "902", t: { myviewboard: 9 }, c: "Myviewboard yazılım sorunu giderildi." },
    { k: "601", a: "603", t: { ses: 3, hoparlor: 3, mikrofon: 3, "ses gelm": 4 }, c: "Ses sorunu incelendi ve giderildi." },
    { k: "601", a: "604", t: { projeksiyon: 4, "smart tv": 5, projektor: 4, televizyon: 3 }, c: "Projeksiyon / Smart TV sorunu giderildi." },
    { k: "601", a: "602", t: { "apple tv": 6, appletv: 6 }, c: "Apple TV sorunu giderildi." },
    { k: "601", a: "902", t: { "sinif interneti": 5, "sinifta internet": 5 }, c: "Sınıfın internet bağlantısı sağlandı." },
    // --- Baglanti ---
    { k: "604", a: "612", t: { wifi: 3, "wi-fi": 3, kablosuz: 3, internet: 3, eduroam: 3 }, c: "Bağlantı sorunu incelendi, cihaz ağa bağlandı." },
    { k: "604", a: "613", t: { sunucu: 4, server: 4, "ortak klasor": 4 }, c: "Sunucu erişim sorunu giderildi." },
    { k: "604", a: "614", t: { "telefon calism": 5, "telefon sorun": 4, dahili: 2 }, c: "Telefon sorunu giderildi." },
    { k: "609", a: "643", t: { misafir: 5, "guest": 4 }, c: "Misafir kullanıcı erişimi tanımlandı." },
    { k: "609", a: "2411", t: { "web sitesi": 4, "site erisim": 5, "siteye erisim": 5, "engelli site": 5 }, c: "Web sitesi erişimi açıldı." },
    { k: "609", a: "1806", t: { "yazici baglanti": 6, "yazici tanimla": 6, "yazici kurulum": 6, "yazici ekle": 6 }, c: "Yazıcı bağlantısı yapıldı, test çıktısı alındı." },
    { k: "608", a: "3001", t: { "masa kurulum": 5, tasinma: 5, "yer degis": 4 }, c: "Masa kurulumu / taşıma yapıldı." },
    // --- iPad ---
    { k: "1802", a: "2403", t: { ipad: 3, mdm: 3, enroll: 3, tablet: 2 }, c: "iPad işlemleri tamamlandı, cihazlar MDM sistemine kaydedildi." },
    { k: "1802", a: "2409", t: { mezun: 6 }, c: "Mezun öğrenci iPad'i MDM'den çıkarıldı." },
    { k: "1802", a: "2404", t: { "ipad uygulama": 6, "ipad aplikasyon": 6, "uygulama yukle": 2 }, c: "iPad uygulaması yüklendi." },
    { k: "1802", a: "2405", t: { "ipad wifi": 6, "ipad internet": 6 }, c: "iPad Wi-Fi bağlantısı yapıldı." },
    { k: "1801", a: "2401", t: { "ipad ekran": 7, "ekrani kirik": 5, "ekran kir": 5 }, c: "iPad ekran arızası incelendi." },
    { k: "1801", a: "2402", t: { "ipad ariza": 7, "ipad acilm": 7, "ipad bozuk": 7 }, c: "iPad cihaz arızası incelendi." },
    // --- Etkinlik / sunum ---
    { k: "611", a: "2107", t: { etkinlik: 4, kulup: 4, toren: 4, "kulup secim": 4 }, c: "Etkinlik için gerekli IT desteği verildi." },
    { k: "611", a: "650", t: { oditoryum: 5, konferans: 3 }, c: "Oditoryumda sunum ve yayın düzeneği hazırlandı, IT desteği verildi." },
    { k: "611", a: "651", t: { sunum: 2, toplanti: 2, kutuphane: 1, zoom: 3, teams: 2, meet: 2, webinar: 3 }, c: "Sunum düzeneği hazırlandı ve kullanıma hazır hale getirildi." },
    { k: "611", a: "652", t: { "canli yayin": 5, youtube: 3, yayin: 1, stream: 3 }, c: "Yayın için gerekli destek verildi." },
    { k: "611", a: "2106", t: { "bilgilendirme ekran": 6, "bilgi ekrani yayin": 6, "duyuru ekran": 5 }, c: "Bilgilendirme ekranı yayını güncellendi." },
    // --- Ses / video duzenleme ---
    { k: "1803", a: "2407", t: { video: 3, "video edit": 5, montaj: 4, kurgu: 3 }, c: "Video düzenleme işlemi yapıldı ve kullanıcıya iletildi." },
    { k: "1803", a: "2406", t: { muzik: 3, "ses edit": 5, "ses dosya": 4, "ses kayd": 3 }, c: "Ses düzenleme işlemi yapıldı ve kullanıcıya iletildi." },
    { k: "1803", a: "2702", t: { fotograf: 4, "foto": 2, resim: 2 }, c: "Fotoğraf düzenleme işlemi yapıldı." },
    // --- Cihaz ---
    { k: "603", a: "609", t: { yazici: 3, cikti: 3, renkli: 2, printer: 3, tarama: 2, scanner: 2, kagit: 2 }, c: "Yazıcı sorunu incelendi ve giderildi, çıktı alınabilir hale getirildi." },
    { k: "603", a: "608", t: { "laptop ariza": 6, "notebook": 4, "laptop bozuk": 6, "laptop acilm": 6, "bilgisayar acilm": 4, "laptop sorun": 5, "bilgisayar yavas": 4 }, c: "Bilgisayar arızası incelendi ve giderildi." },
    { k: "603", a: "607", t: { masaustu: 4, "kasa": 3 }, c: "Masaüstü bilgisayar sorunu giderildi." },
    { k: "603", a: "907", t: { "guvenlik kamera": 7, cctv: 6 }, c: "Güvenlik kamerası arızası incelendi." },
    { k: "603", a: "908", t: { "kart okuyucu": 6, turnike: 5, "giris karti cihaz": 7 }, c: "Kart sistemi cihaz sorunu giderildi." },
    { k: "603", a: "909", t: { "bilgi ekrani": 5, "info ekran": 5 }, c: "Bilgi ekranı sorunu giderildi." },
    { k: "608", a: "639", t: { toner: 6, kartus: 6 }, c: "Toner değişimi yapıldı." },
    { k: "608", a: "637", t: { "yeni bilgisayar": 5, "yeni windows": 4, "yeni laptop": 5, "laptop talep": 5, laptop: 3, "veri aktar": 4, teslim: 1, "bilgisayar kurulum": 3, format: 3, "bilgisayar hazir": 4 },
      c: "Bilgisayar hazırlandı, gerekli kurulumlar ve veri aktarımı yapılarak kullanıcıya teslim edildi." },
    { k: "608", a: "641", t: { mouse: 3, fare: 3, klavye: 3, "ek donanim": 4, kulaklik: 3, monitor: 2, kamera: 3, sarj: 2, kablo: 1 }, c: "Talep edilen donanım teslim edildi." },
    { k: "608", a: "3001", t: { "donanim kurulum": 6, "cihaz kurulum": 5 }, c: "Donanım kurulumu yapıldı." },
    { k: "608", a: "912", t: { "projeksiyon talep": 7 }, c: "Projeksiyon talebi karşılandı." },
    { k: "608", a: "640", t: { "telefon talep": 6, "yeni telefon": 6 }, c: "Telefon talebi karşılandı." },
    // --- Hesaplar ---
    { k: "602", a: "605", t: { sifre: 3, parola: 3, kilit: 3, kilitlen: 3, "hesap kilit": 4, "giris yapam": 4, oturum: 2, "sifre sifirla": 4 }, c: "Hesap kontrol edildi, şifre sıfırlandı / kilit kaldırıldı." },
    { k: "602", a: "904", t: { "yeni kullanici": 4, "hesap olustur": 4 }, c: "Yeni kullanıcı hesabı oluşturuldu." },
    { k: "602", a: "905", t: { "hesap guncelle": 6, "bilgi guncelle": 4 }, c: "Kullanıcı hesabı güncellendi." },
    { k: "602", a: "906", t: { "hesap sil": 6, "kullanici sil": 6 }, c: "Kullanıcı hesabı silindi." },
    { k: "602", a: "910", t: { "giris karti": 5, "kart calism": 5, "kart okumu": 5 }, c: "Giriş kartı sorunu giderildi." },
    { k: "607", a: "1815", t: { "personel kart": 6, "kimlik kart": 5, "kart tanim": 5, kart: 2 }, c: "Kart tanımlama işlemi yapıldı." },
    { k: "607", a: "628", t: { "kurum kullanici": 5, "hesap ac": 3 }, c: "Kurum kullanıcısı oluşturuldu." },
    { k: "607", a: "629", t: { "hesap kapat": 6, "kullanici kapat": 6 }, c: "Kurum kullanıcısı kapatıldı." },
    { k: "607", a: "631", t: { "google hesab": 5, gmail: 3 }, c: "Google hesabı oluşturuldu." },
    { k: "607", a: "632", t: { "google sifre": 7 }, c: "Google şifresi değiştirildi." },
    { k: "607", a: "2410", t: { "ortak dosya": 5, "drive erisim": 6, "paylasimli klasor": 5 }, c: "Google ortak dosya erişimi verildi." },
    { k: "607", a: "633", t: { "e-posta grub": 5, "mail grub": 5, "eposta grub": 5 }, c: "E-posta grubu oluşturuldu." },
    { k: "607", a: "634", t: { "grup uye": 6, "gruba ekle": 6, "gruptan cikar": 6 }, c: "E-posta grubu üyelikleri güncellendi." },
    { k: "607", a: "635", t: { "yazici sifre": 7 }, c: "Yazıcı şifresi tanımlandı." },
    // --- Ogrenci ---
    { k: "614", a: "1807", t: { "ogrenci kart": 7, "ogrenci kimlik": 7 }, c: "Öğrenci kimlik kartı tanımlandı." },
    { k: "614", a: "654", t: { kontor: 6, "sayfa yukle": 5 }, c: "Printer kontörü yüklendi." },
    { k: "606", a: "2408", t: { mfa: 6, authenticator: 6, "iki adim": 5 }, c: "MFA sorunu giderildi." },
    // --- Yazilim ---
    { k: "605", a: "619", t: { chrome: 3, safari: 3, "tarayici sorun": 4, edge: 2, firefox: 3 }, c: "Tarayıcı sorunu giderildi." },
    { k: "605", a: "616", t: { word: 3, excel: 3, powerpoint: 3, outlook: 3, "office sorun": 4, "e-posta": 2, mail: 2, onedrive: 3 }, c: "Office sorunu giderildi." },
    { k: "605", a: "618", t: { "google drive": 5, classroom: 5, "google dokuman": 5, "google apps": 5, drive: 3 }, c: "Google uygulamaları sorunu giderildi." },
    { k: "605", a: "659", t: { blackboard: 7 }, c: "Blackboard sorunu giderildi." },
    { k: "605", a: "913", t: { "kurum portal": 7, portal: 3 }, c: "Kurum portalı sorunu giderildi." },
    { k: "605", a: "617", t: { smartclass: 3, devamsizlik: 3, "ara karne": 3, "ders program": 3 }, c: "Smartclass sorunu giderildi." },
    { k: "605", a: "1831", t: { "windows sorun": 5, "windows hata": 5, "mavi ekran": 6, "windows guncelleme": 4 }, c: "Windows sistem sorunu giderildi." },
    { k: "610", a: "647", t: { adobe: 6, photoshop: 6, illustrator: 6, acrobat: 5, premiere: 6 }, c: "Adobe yazılımı yüklendi." },
    { k: "610", a: "914", t: { "isletim sistem": 6, macos: 5, "mac os": 5, "windows kurulum": 5, "windows 11": 4 }, c: "İşletim sistemi işlemleri yapıldı." },
    { k: "610", a: "1810", t: { "ipad yazilim": 7 }, c: "iPad yazılım talebi karşılandı." },
    { k: "610", a: "1833", t: { flipbook: 7 }, c: "Flipbook güncellemesi yapıldı." },
    { k: "610", a: "916", t: { lisans: 5, license: 5 }, c: "Yazılım lisansı tanımlandı." },
    { k: "610", a: "648", t: { guncelle: 3, update: 3, test: 2, deneme: 2 }, c: "Güncelleme işlemleri yapıldı." },
    { k: "610", a: "646", t: { yazilim: 2, program: 2, yukle: 2, kurulum: 1, indir: 2, "format donus": 3, "dosya format": 3, donustur: 2, office: 2 },
      c: "Talep edilen işlem yapıldı ve kullanıcıya iletildi." },
    // --- Diger ---
    { k: "1204", a: "1823", t: { switch: 4, network: 3, konfigurasyon: 3, "ag ayar": 3 }, c: "Ağ yapılandırması yapıldı." },
    { k: "1205", a: "1824", t: { "access point": 6, " ap ": 4 }, c: "Access point sorunu giderildi." },
    { k: "1202", a: "1803", t: { "veli smartclass": 7, veli: 3 }, c: "Veli Smartclass kullanıcı/şifre işlemi tamamlandı." },
    { k: "1202", a: "1804", t: { connected: 6 }, c: "Veli Connected sorunu giderildi." },
    { k: "1501", a: "2102", t: { "basari belge": 6, belge: 2 }, c: "Belgeler basıldı ve teslim edildi." },
    { k: "1501", a: "2103", t: { "yaka kart": 7 }, c: "Yaka kartları basıldı." },
    { k: "1501", a: "2104", t: { zil: 6 }, c: "Okul zil sesi değiştirildi." },
    { k: "1501", a: "2105", t: { "dijital saat": 7 }, c: "Dijital saat ayarlandı." },
  ];

  function katla(s) {
    return (s || "")
      .replace(/İ/g, "i").replace(/I/g, "ı")
      .toLocaleLowerCase("tr")
      .replace(/ı/g, "i").replace(/ş/g, "s").replace(/ğ/g, "g")
      .replace(/ü/g, "u").replace(/ö/g, "o").replace(/ç/g, "c")
      .replace(/â/g, "a").replace(/î/g, "i").replace(/û/g, "u");
  }

  function kategoriBul(metin) {
    const k = " " + katla(metin).replace(/[^a-z0-9\- ]/g, " ").replace(/\s+/g, " ") + " ";
    const kelimeler = k.trim().split(" ");
    let enIyi = null, enPuan = 0;
    for (const kural of KURALLAR) {
      let puan = 0;
      for (const [terim, p] of Object.entries(kural.t)) {
        if (!p) continue;
        if (terim.includes(" ")) {
          if (k.includes(" " + terim)) puan += p;
        } else if (kelimeler.some((w) => w.startsWith(terim))) {
          puan += p;
        }
      }
      if (puan > enPuan) { enPuan = puan; enIyi = kural; }
    }
    if (!enIyi) return null;
    return { kategori_id: enIyi.k, alt_kategori_id: enIyi.a, oge_id: enIyi.o || "", cozum: enIyi.c, puan: enPuan };
  }

  function kategoriAdi(kid, aid) {
    const k = KATEGORILER.find((x) => x.id === kid);
    if (!k) return "?";
    const a = k.alt.find((x) => x[0] === aid);
    return k.ad + " / " + (a ? a[1] : "?");
  }

  // SDP'den / gecmisten ogrenilen kategorileri listeye ekle: [{k, kad, a, aad}]
  function ozelKategorileriEkle(liste) {
    let eklenen = 0;
    for (const x of liste || []) {
      if (!x || !x.k || !x.a) continue;
      let k = KATEGORILER.find((c) => c.id === String(x.k));
      if (!k) { k = { id: String(x.k), ad: x.kad || "Kategori " + x.k, alt: [] }; KATEGORILER.push(k); }
      if (!k.alt.find((a) => a[0] === String(x.a))) { k.alt.push([String(x.a), x.aad || "Alt " + x.a]); eklenen++; }
    }
    return eklenen;
  }

  const DURAK = new Set(("ve ile icin bir bu su icin yapildi yapilmasi islemi islemleri islem talebi talepleri talep sorunu sorunlari sorun " +
    "destek ticket ac acildi olarak kullanici ogrenci ogretmen sinif sinifi yeni").split(" "));

  function anahtarKelimeler(metin) {
    return [...new Set(katla(metin).replace(/[^a-z0-9 ]/g, " ").split(/\s+/)
      .filter((w) => w.length >= 3 && !DURAK.has(w) && !/^\d+$/.test(w))
      .map((w) => w.slice(0, 7)))];
  }

  // ogrenilen: [{w: [kelimeler], k, a}] - kullanicinin elle duzelttigi / SDP gecmisinden gelen ornekler
  function ogrenilenBul(metin, ogrenilen) {
    const ks = new Set(anahtarKelimeler(metin));
    if (!ks.size || !ogrenilen || !ogrenilen.length) return null;
    const puan = new Map();
    for (const o of ogrenilen) {
      let ortak = 0;
      for (const w of o.w) if (ks.has(w)) ortak++;
      if (!ortak) continue;
      const oran = ortak / Math.max(o.w.length, 1);
      const key = o.k + "|" + o.a;
      puan.set(key, Math.max(puan.get(key) || 0, ortak + oran));
    }
    let enIyi = null, en = 0;
    for (const [key, p] of puan) if (p > en) { en = p; enIyi = key; }
    if (!enIyi) return null;
    const [k, a] = enIyi.split("|");
    return { kategori_id: k, alt_kategori_id: a, puan: en };
  }

  const api = { KATEGORILER, KURALLAR, katla, kategoriBul, kategoriAdi, ozelKategorileriEkle, anahtarKelimeler, ogrenilenBul };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.Kategoriler = api;
})(typeof window !== "undefined" ? window : globalThis);
