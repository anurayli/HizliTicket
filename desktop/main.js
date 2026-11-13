const { app, BrowserWindow, ipcMain, shell, session } = require("electron");
const path = require("path");
const fs = require("fs");
const https = require("https");
const http = require("http");

// ---- Ayar deposu: userData/ayarlar.json (localStorage yerine kalici dosya) ----
let depoYolu = null;
let depo = {};
function depoYukle() {
  depoYolu = path.join(app.getPath("userData"), "ayarlar.json");
  try { depo = JSON.parse(fs.readFileSync(depoYolu, "utf8")) || {}; } catch (e) { depo = {}; }
}
function depoKaydet() {
  try {
    fs.mkdirSync(path.dirname(depoYolu), { recursive: true });
    fs.writeFileSync(depoYolu + ".tmp", JSON.stringify(depo), "utf8");
    fs.renameSync(depoYolu + ".tmp", depoYolu);
    return true;
  } catch (e) {
    return false;
  }
}
ipcMain.on("depoOku", (e, anahtar) => {
  if (!depoYolu) depoYukle();
  e.returnValue = Object.prototype.hasOwnProperty.call(depo, anahtar) ? depo[anahtar] : null;
});
ipcMain.on("depoYaz", (e, anahtar, deger) => {
  if (!depoYolu) depoYukle();
  depo[anahtar] = deger;
  e.returnValue = depoKaydet();
});

function istekYap({ method, url, headers, form, insecure }) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const govde = form ? new URLSearchParams(form).toString() : null;
    const h = { ...(headers || {}) };
    if (govde) {
      h["Content-Type"] = "application/x-www-form-urlencoded";
      h["Content-Length"] = Buffer.byteLength(govde);
    }
    const mod = u.protocol === "http:" ? http : https;
    const req = mod.request(u, { method, headers: h, rejectUnauthorized: !insecure, timeout: 40000 }, (res) => {
      const parcalar = [];
      res.on("data", (c) => parcalar.push(c));
      res.on("end", () => resolve({ status: res.statusCode, text: Buffer.concat(parcalar).toString("utf8") }));
    });
    req.on("timeout", () => req.destroy(new Error("Zaman aşımı")));
    req.on("error", reject);
    if (govde) req.write(govde);
    req.end();
  });
}

ipcMain.handle("http", (_e, istek) => istekYap(istek));
ipcMain.handle("linkAc", (_e, url) => {
  if (/^https?:\/\//.test(url)) shell.openExternal(url);
});

function pencere() {
  const w = new BrowserWindow({
    width: 860,
    height: 820,
    minWidth: 380,
    minHeight: 500,
    title: "Hızlı Ticket",
    autoHideMenuBar: true,
    icon: path.join(__dirname, "..", "build", "icon.png"),
    webPreferences: { preload: path.join(__dirname, "preload.js"), contextIsolation: true, nodeIntegration: false },
  });
  w.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: "deny" }; });
  w.loadFile(path.join(__dirname, "..", "www", "index.html"));
}

// Tek kopya calissin (ikinci kopya ayarlari ezmesin)
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on("second-instance", () => {
    const w = BrowserWindow.getAllWindows()[0];
    if (w) { if (w.isMinimized()) w.restore(); w.focus(); }
  });
  app.whenReady().then(() => { depoYukle(); pencere(); });
}
app.on("before-quit", () => { try { session.defaultSession.flushStorageData(); } catch (e) { /* yok */ } });
app.on("activate", () => { if (!BrowserWindow.getAllWindows().length) pencere(); });
app.on("window-all-closed", () => app.quit());
