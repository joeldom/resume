/*
 * Resume V4 — visible scale diagnostics and reversible scale experiment.
 *
 * Purpose:
 * - Report browser-visible measurements when developer tools are unavailable.
 * - Browser zoom and OS display scaling cannot be reliably distinguished from
 *   page JavaScript alone. DPR is evidence, not a definitive OS-scale reading.
 * - Keep automatic scaling OFF. Test scales are temporary and user-triggered.
 *
 * Context / history:
 * - V4 was created to investigate apparent page scaling differences across
 *   home and work systems, including restricted Linux/Firefox environments
 *   where developer tools are unavailable.
 * - The diagnostic UI is intended for internal use: keep visible copy concise
 *   and matter-of-fact. Put caveats, rationale, and implementation history in
 *   code comments rather than repeating them in the report itself.
 * - No third-party diagnostic APIs or automatic telemetry. Report only values
 *   exposed by the current browser tab; unavailable fields should say so.
 */
(function () {
  "use strict";

  var html = document.documentElement;
  var body = document.body;
  var originalStyles = {
    zoom: html.style.zoom,
    transform: html.style.transform,
    transformOrigin: html.style.transformOrigin,
    width: html.style.width,
    height: html.style.height
  };
  var currentTest = "default";
  var panel, output, summary, trigger, themeReadout;

  function round(value) {
    return typeof value === "number" && isFinite(value) ? Math.round(value * 100) / 100 : "n/a";
  }

  function px(value) {
    return typeof value === "number" && isFinite(value) ? Math.round(value) + "px" : "n/a";
  }

  function computed(element, property) {
    if (!element || !window.getComputedStyle) return "n/a";
    return window.getComputedStyle(element).getPropertyValue(property) || "n/a";
  }

  function collect() {
    var vv = window.visualViewport;
    var de = document.documentElement;
    var screenObj = window.screen || {};
    var nav = window.navigator || {};
    var htmlStyle = window.getComputedStyle ? window.getComputedStyle(de) : null;
    var bodyStyle = window.getComputedStyle && body ? window.getComputedStyle(body) : null;
    var zoomSupported = "zoom" in de.style;
    var resolution = "unknown";
    try {
      if (window.matchMedia) {
        if (window.matchMedia("(min-resolution: 3dppx)").matches) resolution = "3dppx+";
        else if (window.matchMedia("(min-resolution: 2dppx)").matches) resolution = "2dppx+";
        else if (window.matchMedia("(min-resolution: 1.5dppx)").matches) resolution = "1.5dppx+";
        else if (window.matchMedia("(min-resolution: 1dppx)").matches) resolution = "1dppx+";
        else resolution = "below 1dppx";
      }
    } catch (e) {}

    return {
      theme: (body && body.getAttribute("data-theme")) || "default / not set",
      browser: nav.userAgent || "unavailable",
      platform: (nav.userAgentData && nav.userAgentData.platform) || nav.platform || "unavailable",
      language: nav.language || "unavailable",
      languages: nav.languages && nav.languages.length ? nav.languages.join(", ") : "unavailable",
      timezone: (function () { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || "unavailable"; } catch (e) { return "unavailable"; } })(),
      online: typeof nav.onLine === "boolean" ? String(nav.onLine) : "unavailable",
      cookiesEnabled: typeof nav.cookieEnabled === "boolean" ? String(nav.cookieEnabled) : "unavailable",
      cookieCount: (function () { try { return document.cookie ? document.cookie.split(";").length : 0; } catch (e) { return "blocked"; } })(),
      storage: (function () { try { var k = "__diag_test__"; localStorage.setItem(k, "1"); localStorage.removeItem(k); return "available"; } catch (e) { return "blocked/unavailable"; } })(),
      cores: nav.hardwareConcurrency || "not exposed",
      memory: nav.deviceMemory ? nav.deviceMemory + " GB (approx.)" : "not exposed",
      touchPoints: typeof nav.maxTouchPoints === "number" ? nav.maxTouchPoints : "not exposed",
      connection: (function () { var c = nav.connection || nav.mozConnection || nav.webkitConnection; return c ? [c.effectiveType || "", typeof c.downlink === "number" ? c.downlink + " Mbps" : "", typeof c.rtt === "number" ? c.rtt + " ms RTT estimate" : ""].filter(Boolean).join("; ") || "limited data" : "not exposed"; })(),
      colorDepth: screenObj.colorDepth ? screenObj.colorDepth + "-bit" : "unavailable",
      dpr: round(window.devicePixelRatio || 1),
      resolution: resolution,
      viewport: (window.innerWidth || de.clientWidth) + " × " + (window.innerHeight || de.clientHeight) + " CSS px",
      client: de.clientWidth + " × " + de.clientHeight + " CSS px",
      document: de.scrollWidth + " × " + de.scrollHeight + " CSS px",
      screen: (screenObj.width || "n/a") + " × " + (screenObj.height || "n/a") + " CSS px",
      availableScreen: (screenObj.availWidth || "n/a") + " × " + (screenObj.availHeight || "n/a") + " CSS px",
      outer: (window.outerWidth || "n/a") + " × " + (window.outerHeight || "n/a") + " CSS px",
      visualViewport: vv ? round(vv.width) + " × " + round(vv.height) + " CSS px; scale " + round(vv.scale) : "not supported",
      rootFont: htmlStyle ? htmlStyle.fontSize : "n/a",
      bodyFont: bodyStyle ? bodyStyle.fontSize : "n/a",
      htmlZoom: html.style.zoom || "(unset / browser default)",
      htmlTransform: html.style.transform || "(none)",
      zoomProperty: zoomSupported ? "supported" : "not detected",
      testScale: currentTest,
      scrollOverflowX: de.scrollWidth > de.clientWidth ? "YES (" + (de.scrollWidth - de.clientWidth) + "px)" : "no",
      scrollOverflowY: de.scrollHeight > de.clientHeight ? "document taller than viewport (normal for resume)" : "no",
      time: new Date().toLocaleString()
    };
  }

  function summaryText(data) {
    return " | SCALE: DPR " + data.dpr +
      " / VV " + (window.visualViewport ? round(window.visualViewport.scale) : "n/a") +
      " / ROOT " + data.rootFont +
      " / TEST " + data.testScale;
  }

  function format(data) {
    return [
      "RESUME V4 — DIAGNOSTIC REPORT",
      "Captured: " + data.time,
      "",
      "Theme: " + data.theme,
      "Browser: " + data.browser,
      "Platform: " + data.platform,
      "Locale: " + data.language + " / " + data.languages + " | TZ: " + data.timezone,
      "Online: " + data.online + " | Cookies: " + data.cookiesEnabled + " (" + data.cookieCount + " visible) | Storage: " + data.storage,
      "CPU threads: " + data.cores + " | Memory: " + data.memory + " | Touch: " + data.touchPoints,
      "Network: " + data.connection + " | Color depth: " + data.colorDepth,
      "",
      "DPR (devicePixelRatio): " + data.dpr,
      "Resolution query: " + data.resolution,
      "Layout viewport: " + data.viewport,
      "Client / document: " + data.client + " / " + data.document,
      "Screen / available: " + data.screen + " / " + data.availableScreen,
      "Window: " + data.outer + " | Visual viewport: " + data.visualViewport,
      "",
      "Fonts (root/body): " + data.rootFont + " / " + data.bodyFont,
      "CSS zoom: " + data.zoomProperty + " | Inline zoom: " + data.htmlZoom + " | Transform: " + data.htmlTransform,
      "Manual test setting: " + data.testScale,
      "Horizontal overflow: " + data.scrollOverflowX,
      "Vertical overflow: " + data.scrollOverflowY,
      "",

    ].join("\n");
  }

  function updateThemeReadout() {
    if (!themeReadout) return;
    var activeTheme = body && body.getAttribute("data-theme") || "default / not set";
    var names = {
      "paper": "Paper",
      "blue": "Blue",
      "dark-high": "Dark High",
      "dark-low": "Dark Low"
    };
    themeReadout.textContent = "/THEME " + (names[activeTheme] || activeTheme);
  }

  function update() {
    var data = collect();
    if (summary) summary.textContent = summaryText(data);
    if (output && !panel.hidden) output.textContent = format(data);
    updateThemeReadout();
  }

  function applyTest(value, label) {
    // Change only html zoom. No transform/width/height compensation is applied.
    // Reset restores the exact inline values that existed before this utility ran.
    if (value === null) {
      html.style.zoom = originalStyles.zoom;
      html.style.transform = originalStyles.transform;
      html.style.transformOrigin = originalStyles.transformOrigin;
      html.style.width = originalStyles.width;
      html.style.height = originalStyles.height;
      currentTest = "default";
    } else {
      html.style.zoom = String(value);
      currentTest = label;
    }
    update();
  }

  function fallbackCopy(value) {
    var field = document.createElement("textarea");
    field.value = value;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.left = "-9999px";
    document.body.appendChild(field);
    field.select();
    try { document.execCommand("copy"); } catch (e) {}
    field.remove();
  }

  function makeButton(label, action, title) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "scale-diagnostics__button";
    button.textContent = label;
    button.title = title || label;
    button.addEventListener("click", action);
    return button;
  }

  function init() {
    var info = document.querySelector(".info");
    if (!info) return;

    summary = document.createElement("span");
    summary.id = "scale-summary";
    summary.setAttribute("aria-label", "Scale diagnostics summary");

    var existingReadout = document.getElementById("browser-status-readout");
    if (existingReadout) existingReadout.insertAdjacentElement("afterend", summary);
    else info.appendChild(summary);

    // Show the currently selected theme as a read-only label in the information bar.
    themeReadout = document.createElement("span");
    themeReadout.className = "scale-diagnostics__theme-readout";
    themeReadout.setAttribute("aria-label", "Selected resume theme");
    info.appendChild(themeReadout);

    var wrapper = document.createElement("section");
    wrapper.className = "scale-diagnostics";
    wrapper.setAttribute("aria-label", "Scale diagnostics controls");

    trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "scale-diagnostics__trigger";
    trigger.textContent = "DIAGNOSTIC";
    trigger.setAttribute("aria-expanded", "false");
    trigger.setAttribute("aria-controls", "scale-diagnostics-panel");

    panel = document.createElement("div");
    panel.className = "scale-diagnostics__panel";
    panel.id = "scale-diagnostics-panel";
    panel.hidden = true;

    var heading = document.createElement("h2");
    heading.className = "scale-diagnostics__title";
    heading.textContent = "Visible diagnostics · V4";
    output = document.createElement("pre");
    output.className = "scale-diagnostics__output";

    var controls = document.createElement("div");
    controls.className = "scale-diagnostics__controls";
    controls.appendChild(makeButton("Reset / 100%", function () { applyTest(null); }, "Restore original page styles"));
    controls.appendChild(makeButton("Test 90%", function () { applyTest(0.9, "90%"); }));
    controls.appendChild(makeButton("Test 80%", function () { applyTest(0.8, "80%"); }));
    controls.appendChild(makeButton("Test 70%", function () { applyTest(0.7, "70%"); }));

    controls.appendChild(makeButton("Copy report", function () {
      var report = format(collect());
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(report).catch(function () { fallbackCopy(report); });
      } else {
        fallbackCopy(report);
      }
    }));
    controls.appendChild(makeButton("Download .txt", function () {
      var blob = new Blob([format(collect())], { type: "text/plain;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var link = document.createElement("a");
      link.href = url;
      link.download = "resume-v4-diagnostics.txt";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    }));

    var note = document.createElement("p");
    note.className = "scale-diagnostics__note";
    note.textContent = "Manual scale tests only. Reset before comparing. No automatic correction.";

    panel.appendChild(heading);
    panel.appendChild(output);
    panel.appendChild(controls);
    panel.appendChild(note);
    wrapper.appendChild(trigger);
    wrapper.appendChild(panel);
    document.body.appendChild(wrapper);

    trigger.addEventListener("click", function () {
      panel.hidden = !panel.hidden;
      trigger.setAttribute("aria-expanded", String(!panel.hidden));
      if (!panel.hidden) update();
    });

    window.addEventListener("resize", update, { passive: true });
    if (body && window.MutationObserver) {
      new MutationObserver(updateThemeReadout).observe(body, { attributes: true, attributeFilter: ["data-theme"] });
    }
    window.addEventListener("orientationchange", update, { passive: true });
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", update, { passive: true });
      window.visualViewport.addEventListener("scroll", update, { passive: true });
    }
    window.setInterval(update, 1000);
    update();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
