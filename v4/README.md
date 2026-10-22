# Resume V4 — Scale Diagnostics

V4 is an isolated diagnostic copy of the root resume release. It is not promoted to `/resume/` and does not change the production root files.

## Purpose

- Make browser-visible scale and viewport measurements available without developer tools.
- Add a compact `SCALE` summary to the existing information bar.
- Provide a `DIAGNOSTIC` panel with the full report.
- Expose Paper, Blue, Dark High, and Dark Low theme choices in the top information bar.
- Offer manual 90%, 80%, and 70% CSS zoom tests with a reset control.
- Keep automatic scaling disabled.

## What it can and cannot diagnose

The page reports `devicePixelRatio`, resolution media-query thresholds, viewport and screen dimensions, visual viewport scale, computed font sizes, CSS zoom support, inline zoom/transform values, and overflow.

Standard page JavaScript cannot reliably distinguish Windows display scaling from desktop browser zoom. DPR is useful evidence, not a definitive reading. The visual viewport scale is useful for pinch-zoom behavior, but is not a universal desktop browser-zoom detector.

## Test procedure

1. Open the page at home and at work, ideally with browser zoom reset to 100% using `Ctrl+0`.
2. Open **DIAGNOSTIC** and compare the reports.
3. Record the `DPR`, layout viewport, screen size, root/body font sizes, and visual viewport values. The report updates automatically on load, while open, once per second, and when the viewport changes; no manual refresh button is needed.
4. Use 90%, 80%, or 70% only as a temporary visual experiment; use **Reset / 100%** before reloading or comparing the baseline.
5. If the report does not explain the issue, keep the reporting utility and remove the scaling experiment rather than adding automatic corrections.

## Files

- `index.html` — isolated V4 resume copy and diagnostics entry point.
- `style.css` — V3/root styles plus V4-only diagnostics styling; image URLs point to the shared parent `/img` folder.
- `script.js` — copied root script, including the existing IP/time/referrer/FPS readout.
- `collapse-v4.js` — copied detail-collapse behavior.
- `scale-diagnostics.js` — visible measurements and manual scale tests.
