// Platforma gore HTTP istegi: Electron (masaustu), Capacitor (Android) veya tarayici.
(function (root) {
  function formKodla(form) {
    return Object.entries(form).map(([k, v]) => encodeURIComponent(k) + "=" + encodeURIComponent(v)).join("&");
  }

  // Android (yerel WebView koprusu): istek Java tarafinda yapilir, CORS yok
  let sayac = 0;
  const bekleyen = {};
  root.__kopruCevap = function (id, json) {
    const b = bekleyen[id];
    if (!b) return;
    delete bekleyen[id];
    let o;
    try { o = JSON.parse(json); } catch (e) { b.rej(new Error("Geçersiz yanıt")); return; }
    if (o.hata) b.rej(new Error(o.hata)); else b.res({ status: o.status, text: o.text });
  };

  async function http(istek) {
    if (root.AndroidKopru) {
      return new Promise((res, rej) => {
        const id = String(++sayac);
        bekleyen[id] = { res, rej };
        root.AndroidKopru.http(JSON.stringify(istek), id);
      });
    }

    // Masaustu (Electron): istek ana surece gider, CORS yok
    if (root.masaustu && root.masaustu.http) {
      return root.masaustu.http(istek);
    }

    // Android (Capacitor): yerel HTTP eklentisi, CORS yok
    const cap = root.Capacitor;
    if (cap && cap.isNativePlatform && cap.isNativePlatform() && cap.Plugins && cap.Plugins.CapacitorHttp) {
      const headers = { ...istek.headers };
      let data;
      if (istek.form) {
        headers["Content-Type"] = "application/x-www-form-urlencoded";
        data = istek.form;
      }
      const y = await cap.Plugins.CapacitorHttp.request({
        method: istek.method,
        url: istek.url,
        headers,
        data,
        responseType: "text",
      });
      const text = typeof y.data === "string" ? y.data : JSON.stringify(y.data);
      return { status: y.status, text };
    }

    // Tarayici (test icin; SDP CORS izni vermezse calismaz)
    const opts = { method: istek.method, headers: { ...istek.headers } };
    if (istek.form) {
      opts.headers["Content-Type"] = "application/x-www-form-urlencoded";
      opts.body = formKodla(istek.form);
    }
    const r = await fetch(istek.url, opts);
    return { status: r.status, text: await r.text() };
  }

  function linkAc(url) {
    if (root.AndroidKopru) return root.AndroidKopru.linkAc(url);
    if (root.masaustu && root.masaustu.linkAc) return root.masaustu.linkAc(url);
    const cap = root.Capacitor;
    if (cap && cap.Plugins && cap.Plugins.Browser) return cap.Plugins.Browser.open({ url });
    root.open(url, "_blank");
  }

  const platformAdi = () =>
    root.AndroidKopru ? "android" : root.masaustu ? "masaustu" : root.Capacitor && root.Capacitor.isNativePlatform && root.Capacitor.isNativePlatform() ? "android" : "web";

  root.Platform = { http, linkAc, platformAdi };
})(window);
