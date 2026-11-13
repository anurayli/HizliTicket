// macOS: imzasiz Electron uygulamasi Apple Silicon'da "hasarli" gorunmesin diye ad-hoc imza atar.
// macOS: ad-hoc sign the unsigned app so Apple Silicon does not report it as "damaged".
const { execSync } = require("child_process");
const path = require("path");
exports.default = async function (ctx) {
  if (ctx.electronPlatformName !== "darwin") return;
  const app = path.join(ctx.appOutDir, ctx.packager.appInfo.productFilename + ".app");
  execSync(`codesign --force --deep --sign - "${app}"`, { stdio: "inherit" });
};
