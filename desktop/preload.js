const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("masaustu", {
  http: (istek) => ipcRenderer.invoke("http", istek),
  linkAc: (url) => ipcRenderer.invoke("linkAc", url),
  depo: {
    oku: (anahtar) => ipcRenderer.sendSync("depoOku", anahtar),
    yaz: (anahtar, deger) => ipcRenderer.sendSync("depoYaz", anahtar, deger),
  },
});
