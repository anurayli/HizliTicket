package io.github.hizliticket;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.speech.RecognizerIntent;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.Locale;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/** WebView kabugu + yerel HTTP koprusu (CORS olmadan ServiceDesk Plus API'sine erisim). */
public class MainActivity extends Activity {
    private static final int SES_ISTEGI = 41;
    private WebView web;
    private final ExecutorService havuz = Executors.newFixedThreadPool(4);

    @SuppressLint({"SetJavaScriptEnabled", "AddJavascriptInterface"})
    @Override
    protected void onCreate(Bundle b) {
        super.onCreate(b);
        web = new WebView(this);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(true);
        web.setWebChromeClient(new WebChromeClient());
        web.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest r) {
                Uri u = r.getUrl();
                if ("http".equals(u.getScheme()) || "https".equals(u.getScheme())) { disariAc(u.toString()); return true; }
                return false;
            }
        });
        web.addJavascriptInterface(new Kopru(), "AndroidKopru");
        setContentView(web);
        if (b != null) web.restoreState(b); else web.loadUrl("file:///android_asset/www/index.html");
    }

    @Override protected void onSaveInstanceState(Bundle o) { super.onSaveInstanceState(o); web.saveState(o); }

    @Override public void onBackPressed() { if (web.canGoBack()) web.goBack(); else super.onBackPressed(); }

    private void disariAc(String url) {
        try { startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url))); } catch (Exception ignored) { }
    }

    private void jsCagir(String kod) { runOnUiThread(() -> web.evaluateJavascript(kod, null)); }

    @Override
    protected void onActivityResult(int istek, int sonuc, Intent veri) {
        super.onActivityResult(istek, sonuc, veri);
        if (istek != SES_ISTEGI) return;
        String metin = "";
        if (sonuc == RESULT_OK && veri != null) {
            ArrayList<String> l = veri.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS);
            if (l != null && !l.isEmpty()) metin = l.get(0);
        }
        jsCagir("window.__sesSonuc && window.__sesSonuc(" + JSONObject.quote(metin) + ", null)");
    }

    private class Kopru {
        @JavascriptInterface
        public void http(String istekJson, String id) {
            havuz.execute(() -> {
                JSONObject cevap = new JSONObject();
                try {
                    JSONObject i = new JSONObject(istekJson);
                    HttpURLConnection c = (HttpURLConnection) new URL(i.getString("url")).openConnection();
                    c.setRequestMethod(i.optString("method", "GET"));
                    c.setConnectTimeout(20000);
                    c.setReadTimeout(40000);
                    JSONObject h = i.optJSONObject("headers");
                    if (h != null) for (Iterator<String> it = h.keys(); it.hasNext(); ) { String k = it.next(); c.setRequestProperty(k, h.getString(k)); }
                    JSONObject form = i.optJSONObject("form");
                    if (form != null) {
                        StringBuilder sb = new StringBuilder();
                        for (Iterator<String> it = form.keys(); it.hasNext(); ) {
                            String k = it.next();
                            if (sb.length() > 0) sb.append('&');
                            sb.append(URLEncoder.encode(k, "UTF-8")).append('=').append(URLEncoder.encode(form.getString(k), "UTF-8"));
                        }
                        byte[] govde = sb.toString().getBytes(StandardCharsets.UTF_8);
                        c.setDoOutput(true);
                        c.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
                        try (OutputStream os = c.getOutputStream()) { os.write(govde); }
                    }
                    int kod = c.getResponseCode();
                    InputStream is = kod >= 400 ? c.getErrorStream() : c.getInputStream();
                    ByteArrayOutputStream bo = new ByteArrayOutputStream();
                    if (is != null) { byte[] buf = new byte[8192]; int n; while ((n = is.read(buf)) > 0) bo.write(buf, 0, n); is.close(); }
                    cevap.put("status", kod);
                    cevap.put("text", bo.toString("UTF-8"));
                } catch (Exception e) {
                    try { cevap.put("hata", String.valueOf(e.getMessage())); } catch (Exception ignored) { }
                }
                jsCagir("window.__kopruCevap(" + JSONObject.quote(id) + "," + JSONObject.quote(cevap.toString()) + ")");
            });
        }

        @JavascriptInterface
        public void linkAc(String url) { if (url != null && url.matches("^https?://.*")) runOnUiThread(() -> disariAc(url)); }

        @JavascriptInterface
        public void sesBaslat() {
            runOnUiThread(() -> {
                try {
                    Intent i = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
                    i.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
                    String dil = Locale.getDefault().getLanguage().equals("tr") ? "tr-TR" : Locale.getDefault().toLanguageTag();
                    i.putExtra(RecognizerIntent.EXTRA_LANGUAGE, dil);
                    startActivityForResult(i, SES_ISTEGI);
                } catch (Exception e) {
                    jsCagir("window.__sesSonuc && window.__sesSonuc('', " + JSONObject.quote("Ses tanıma kullanılamıyor / Speech recognition unavailable") + ")");
                }
            });
        }
    }
}
