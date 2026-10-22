/*
 * Resume V4 — visible scale diagnostics and reversible scale experiment.
 *
 * Purpose:
 * - Report browser-visible measurements when developer tools are unavailable.
 * - Avoid claiming that browser zoom or Windows display scaling can be read
 *   directly; web pages do not have a reliable, universal API for either.
 * - Keep automatic scaling OFF. Test scales are temporary and user-triggered.
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
  var panel, output, summary, trigger;

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
      browser: nav.userAgent || "unavailable",
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
      "RESUME V4 — SCALE / VIEWPORT REPORT",
      "Captured: " + data.time,
      "",
      "DPR (devicePixelRatio): " + data.dpr + "  [clue only; not a Windows-scale reading]",
      "Resolution media query: " + data.resolution,
      "Layout viewport: " + data.viewport,
      "Document client box: " + data.client,
      "Full document size: " + data.document,
      "Screen size: " + data.screen,
      "Available screen: " + data.availableScreen,
      "Outer browser window: " + data.outer,
      "Visual viewport: " + data.visualViewport,
      "",
      "Computed root font: " + data.rootFont,
      "Computed body font: " + data.bodyFont,
      "CSS zoom property: " + data.zoomProperty,
      "Inline html zoom: " + data.htmlZoom,
      "Inline html transform: " + data.htmlTransform,
      "Manual test setting: " + data.testScale,
      "Horizontal overflow: " + data.scrollOverflowX,
      "Vertical overflow: " + data.scrollOverflowY,
      "",
      "Browser zoom / Windows display scale: not directly distinguishable by page JavaScript.",
      "Compare this report at work and at home. DPR can change with OS scaling, browser zoom,",
      "monitor settings, and browser behavior; treat it as evidence, not a diagnosis."
    ].join("\n");
  }

  function update() {
    var data = collect();
    if (summary) summary.textContent = summaryText(data);
    if (output && !panel.hidden) output.textContent = format(data);
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

    var wrapper = document.createElement("section");
    wrapper.className = "scale-diagnostics";
    wrapper.setAttribute("aria-label", "Scale diagnostics controls");

    trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "scale-diagnostics__trigger";
    trigger.textContent = "SCALE DATA";
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
    controls.appendChild(makeButton("Refresh report", update));

    var note = document.createElement("p");
    note.className = "scale-diagnostics__note";
    note.textContent = "Scale changes are manual and temporary. Reset before comparing pages. No automatic correction is active.";

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
