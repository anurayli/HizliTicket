// ServiceDesk Plus REST API v3 istemcisi.
// http(istek) -> Promise<{status, text}>; istek = {method, url, headers, form, insecure}
(function (root) {
  class SDPHata extends Error {}

  function hataMesaji(text) {
    try {
      const d = JSON.parse(text);
      let rs = d.response_status;
      if (Array.isArray(rs)) rs = rs[0] || {};
      if (rs && rs.messages && rs.messages.length) {
        return rs.messages.map((m) => (m.field ? m.field + ": " : "") + (m.message || JSON.stringify(m))).join(" | ");
      }
      return JSON.stringify(rs || d).slice(0, 300);
    } catch (e) {
      return String(text || "").slice(0, 300);
    }
  }

  class SDP {
    constructor(ayar, http) {
      this.ayar = ayar;
      this.http = http;
      this.onbellek = new Map();
    }

    get base() {
      return (this.ayar.url || "").replace(/\/+$/, "");
    }

    async api(method, yol, veri) {
      if (!this.ayar.apiKey) throw new SDPHata("API anahtarı girilmemiş (Ayarlar).");
      let url = this.base + "/api/v3/" + yol;
      const istek = {
        method,
        url,
        headers: { authtoken: this.ayar.apiKey, Accept: "application/vnd.manageengine.sdp.v3+json" },
        insecure: !!this.ayar.sslKapali,
      };
      if (veri !== undefined) {
        const js = JSON.stringify(veri);
        if (method === "GET") istek.url += "?input_data=" + encodeURIComponent(js);
        else istek.form = { input_data: js };
      }
      let yanit;
      try {
        yanit = await this.http(istek);
      } catch (e) {
        throw new SDPHata("Sunucuya bağlanılamadı: " + (e && e.message ? e.message : e));
      }
      if (yanit.status < 200 || yanit.status >= 300) {
        throw new SDPHata("HTTP " + yanit.status + ": " + hataMesaji(yanit.text));
      }
      return yanit.text ? JSON.parse(yanit.text) : {};
    }

    // anahtar: kullanici adi, e-posta veya "Ad Soyad". Tam eslesme yoksa null.
    async kullaniciBul(anahtar, isimle) {
      const a = (anahtar || "").trim().toLocaleLowerCase("tr");
      if (!a) return null;
      const ck = (isimle ? "i:" : "k:") + a;
      if (this.onbellek.has(ck)) return this.onbellek.get(ck);
      const liste = await this.kullaniciAra(anahtar);
      const kucuk = (s) => (s || "").toLocaleLowerCase("tr");
      let bulunan = null;
      if (isimle) {
        bulunan = liste.find((u) => kucuk(u.ad) === a) || null;
      } else {
        bulunan =
          liste.find((u) => kucuk(u.kullanici_adi) === a) ||
          liste.find((u) => kucuk(u.eposta) === a || kucuk(u.ad) === a) ||
          liste.find((u) => kucuk(u.eposta).split("@")[0] === a) ||
          liste.find((u) => kucuk(u.ad).split("@")[0] === a && kucuk(u.ad).includes("@")) ||
          null;
        // Ayni adres icin hem e-posta-adli hem gercek adli kayit varsa gercek adliyi sec
        if (bulunan && kucuk(bulunan.ad).includes("@")) {
          const adli = liste.find((u) => u !== bulunan && kucuk(u.eposta) === kucuk(bulunan.ad));
          if (adli) bulunan = adli;
        }
      }
      this.onbellek.set(ck, bulunan);
      return bulunan;
    }

    async kullaniciAra(arama) {
      const kriter = [
        { field: "name", condition: "like", value: arama },
        { field: "email_id", condition: "like", value: arama, logical_operator: "or" },
        { field: "login_name", condition: "like", value: arama, logical_operator: "or" },
      ];
      let son = null;
      for (const k of [kriter, kriter.slice(0, 2), kriter.slice(0, 1)]) {
        try {
          const d = await this.api("GET", "users", { list_info: { row_count: 25, search_criteria: k } });
          return (d.users || []).map((u) => ({
            id: String(u.id),
            ad: u.name,
            eposta: u.email_id || null,
            kullanici_adi: u.login_name || null,
            departman: u.department ? u.department.name : null,
          }));
        } catch (e) {
          son = e;
        }
      }
      throw son;
    }

    async teknisyenAra(ad) {
      const d = await this.api("GET", "technicians", {
        list_info: { row_count: 20, search_criteria: { field: "name", condition: "like", value: ad } },
      });
      return (d.technicians || []).map((t) => ({ id: String(t.id), ad: t.name, eposta: t.email_id }));
    }

    async test() {
      await this.api("GET", "requests", { list_info: { row_count: 1 } });
      return true;
    }

    // t: {kullanici: {id}|{eposta}, konu, aciklama, cozum, kategori_id, alt_kategori_id}
    async ticketAc(t) {
      if (!this.ayar.teknisyenId) throw new SDPHata("Teknisyen ID girilmemiş (Ayarlar).");
      const k = t.kullanici || {};
      const requester = k.id ? { id: String(k.id) } : k.eposta ? { email_id: k.eposta, name: k.eposta.split("@")[0] } : null;
      if (!requester) throw new SDPHata("Talep sahibi seçilmemiş.");
      if (!t.kategori_id || !t.alt_kategori_id) throw new SDPHata("Kategori seçilmemiş.");
      const istek = {
        subject: t.konu,
        description: t.aciklama,
        requester,
        template: { id: String(this.ayar.sablonId || "1") },
        request_type: { name: this.ayar.istekTuru || "Request/Talep" },
        technician: { id: String(this.ayar.teknisyenId) },
        category: { id: String(t.kategori_id) },
        subcategory: { id: String(t.alt_kategori_id) },
      };
      if (this.ayar.grupId) istek.group = { id: String(this.ayar.grupId) };
      if (t.oge_id) istek.item = { id: String(t.oge_id) };
      let d;
      try {
        d = await this.api("POST", "requests", { request: { ...istek, resolution: { content: t.cozum } } });
      } catch (e) {
        d = await this.api("POST", "requests", { request: istek });
      }
      const id = d.request && d.request.id;
      if (!id) throw new SDPHata("Ticket oluşturuldu mu anlaşılamadı.");
      const notlar = [];
      try {
        await this.api("PUT", "requests/" + id, { request: { resolution: { content: t.cozum }, status: { name: "Resolved" } } });
      } catch (e) {
        try { await this.api("PUT", "requests/" + id + "/resolutions", { resolution: { content: t.cozum } }); }
        catch (e2) { notlar.push("Çözüm yazılamadı: " + e2.message); }
        try { await this.api("PUT", "requests/" + id, { request: { status: { name: "Resolved" } } }); }
        catch (e3) { notlar.push("Resolved yapılamadı: " + e3.message); }
      }
      return { id: String(id), link: this.link(id), notlar };
    }

    async sonTicketlar(adet) {
      const li = { row_count: adet || 20, sort_field: "created_time", sort_order: "desc" };
      if (this.ayar.teknisyenId) li.search_criteria = { field: "technician.id", condition: "is", value: String(this.ayar.teknisyenId) };
      const d = await this.api("GET", "requests", { list_info: li });
      return (d.requests || []).map((r) => ({
        id: String(r.id),
        konu: r.subject,
        talep_sahibi: r.requester ? r.requester.name : "",
        durum: r.status ? r.status.name : "",
        tarih: r.created_time ? r.created_time.display_value : "",
        link: this.link(r.id),
      }));
    }

    // Kategori / alt kategori listesini SDP'den cek. Yetki yoksa kendi ticket gecmisinden ogren.
    // ilerleme(metin) cagrilir. Donus: {kaynak, kategoriler:[{k,kad,a,aad}], ornekler:[{konu,k,a}]}
    async kategorileriCek(ilerleme, adet) {
      const bildir = (m) => { try { ilerleme && ilerleme(m); } catch (e) { /* yok */ } };
      const kategoriler = [], ornekler = [];
      // 1) Dogrudan liste (yonetici yetkisi gerekebilir)
      try {
        bildir("Kategori listesi isteniyor…");
        const d = await this.api("GET", "categories", { list_info: { row_count: 100 } });
        for (const c of d.categories || []) {
          bildir("Alt kategoriler: " + c.name);
          try {
            const s = await this.api("GET", "categories/" + c.id + "/subcategories", { list_info: { row_count: 100 } });
            for (const a of s.subcategories || []) kategoriler.push({ k: String(c.id), kad: c.name, a: String(a.id), aad: a.name });
          } catch (e) { /* bu kategori atlanir */ }
        }
        if (kategoriler.length) return { kaynak: "liste", kategoriler, ornekler };
      } catch (e) { /* yetki yok: gecmise gec */ }

      // 2) Kendi ticket gecmisi
      const hedef = adet || 150;
      const ozetler = [];
      for (let bas = 1; ozetler.length < hedef; bas += 100) {
        bildir("Ticket geçmişi okunuyor… (" + ozetler.length + ")");
        const li = {
          row_count: Math.min(100, hedef - ozetler.length), start_index: bas,
          sort_field: "created_time", sort_order: "desc",
          fields_required: ["subject", "category", "subcategory"],
        };
        if (this.ayar.teknisyenId) li.search_criteria = { field: "technician.id", condition: "is", value: String(this.ayar.teknisyenId) };
        let d;
        try { d = await this.api("GET", "requests", { list_info: li }); }
        catch (e) { delete li.fields_required; d = await this.api("GET", "requests", { list_info: li }); }
        const l = d.requests || [];
        ozetler.push(...l);
        if (l.length < li.row_count) break;
      }
      const ekle = (r) => {
        const c = r.category, s = r.subcategory;
        if (!c || !c.id || !s || !s.id) return;
        kategoriler.push({ k: String(c.id), kad: c.name, a: String(s.id), aad: s.name });
        if (r.subject) ornekler.push({ konu: r.subject, k: String(c.id), a: String(s.id) });
      };
      const kategoriVar = ozetler.some((r) => r.category && r.category.id);
      if (kategoriVar) ozetler.forEach(ekle);
      else {
        for (let i = 0; i < ozetler.length; i++) {
          bildir("Ticket ayrıntıları okunuyor… (" + (i + 1) + "/" + ozetler.length + ")");
          try { ekle((await this.api("GET", "requests/" + ozetler[i].id)).request || {}); } catch (e) { /* atla */ }
        }
      }
      return { kaynak: "gecmis", kategoriler, ornekler };
    }

    link(id) {
      return this.base + "/WorkOrder.do?woMode=viewWO&woID=" + id;
    }
  }

  const api = { SDP, SDPHata };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.SDPIstemci = api;
})(typeof window !== "undefined" ? window : globalThis);
