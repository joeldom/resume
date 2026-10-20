const resolver = {
    resolve: function resolve(options, callback) {
        // The string to resolve
        const resolveString =
            options.resolveString ||
            options.element.getAttribute("data-target-resolver");
        const combinedOptions = Object.assign({}, options, {
            resolveString: resolveString
        });

        function getRandomInteger(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function randomCharacter(characters) {
            return characters[getRandomInteger(0, characters.length - 1)];
        }

        function doRandomiserEffect(options, callback) {
            const characters = options.characters;
            const timeout = options.timeout;
            const element = options.element;
            const partialString = options.partialString;

            let iterations = options.iterations;

            setTimeout(() => {
                if (iterations >= 0) {
                    const nextOptions = Object.assign({}, options, {
                        iterations: iterations - 1
                    });

                    // Ensures partialString without the random character as the final state.
                    if (iterations === 0) {
                        element.textContent = partialString;
                    } else {
                        // Replaces the last character of partialString with a random character
                        element.textContent =
                            partialString.substring(0, partialString.length - 1) +
                            randomCharacter(characters);
                    }

                    doRandomiserEffect(nextOptions, callback);
                } else if (typeof callback === "function") {
                    callback();
                }
            }, options.timeout);
        }

        function doResolverEffect(options, callback) {
            const resolveString = options.resolveString;
            const characters = options.characters;
            const offset = options.offset;
            const partialString = resolveString.substring(0, offset);
            const combinedOptions = Object.assign({}, options, {
                partialString: partialString
            });

            doRandomiserEffect(combinedOptions, () => {
                const nextOptions = Object.assign({}, options, { offset: offset + 1 });

                if (offset <= resolveString.length) {
                    doResolverEffect(nextOptions, callback);
                } else if (typeof callback === "function") {
                    callback();
                }
            });
        }

        doResolverEffect(combinedOptions, callback);
    }
};

// const strings = [
//   'BRANDING',
//   'UX',
//   'UI',
//   'FRONT-END',
//   'USER-EXPERIENCE',
//   'USER-INTERFACE',
//   '▂▃▅▇█▓▒░░▒▓█▇▅▃▂▂▂▂▃▅▇█▓▒░░▒▓█▇▅▃▂▂▂▂▃▅▇█▓▒░░▒▓█▇▅▃▂',
//   'BEGIN WITH THE END IN MIND',
//   'DESIGN IS HOW IT WORKS.',
//   '▂▃▅▇█▓▒░░▒▓█▇▅▃▂▂▂▂▃▅▇█▓▒░░▒▓█▇▅▃▂▂▂▂▃▅▇█▓▒░░▒▓█▇▅▃▂',
//   'HELL0 WORLD!',
//   'TEST. TEST. TEST.',
//   '▂▃▅▇█▓▒░░▒▓█▇▅▃▂▂▂▂▃▅▇█▓▒░░▒▓█▇▅▃▂▂▂▂▃▅▇█▓▒░░▒▓█▇▅▃▂',
//   'GET RID OF MORE.',
//   'DO NOT EVER MAKE IT "POP".',
//   '▂▃▅▇█▓▒░░▒▓█▇▅▃▂▂▂▂▃▅▇█▓▒░░▒▓█▇▅▃▂▂▂▂▃▅▇█▓▒░░▒▓█▇▅▃▂',
//   'SPEAK TO GOALS, NOT FEATURES.',
//   'YOUR GOALS DON\'T CARE HOW YOU FEEL.',
//   '▂▃▅▇█▓▒░░▒▓█▇▅▃▂▂▂▂▃▅▇█▓▒░░▒▓█▇▅▃▂▂▂▂▃▅▇█▓▒░░▒▓█▇▅▃▂',
//   '( ͡° ͜ʖ ͡°)',
// ];

const strings = [
    "BRANDING",
    "UX",
    "UI",
    "FRONT_END",
    "USER_EXPERIENCE",
    "USER_INTERFACE",
    "BEGIN WITH THE END IN MIND",
    "DESIGN IS HOW IT WORKS.",
    "HELL0 WORLD!",
    "TEST. TEST. TEST.",
    "GET RID OF MORE.",
    'DO NOT EVER MAKE IT "POP".',
    "SPEAK TO GOALS, NOT FEATURES.",
    "YOUR GOALS DON'T CARE HOW YOU FEEL."
];

let counter = 0;

const options = {
    // Initial position
    offset: 0,
    // Timeout between each random character
    timeout: 10,
    // Number of random characters to show
    iterations: 5,
    // Random characters to pick from
    characters: [
        "$",
        "3",
        "8",
        "d",
        "_",
        "f",
        "g",
        "!",
        "5",
        "j",
        "k",
        "l",
        "2",
        "n",
        "_",
        "p",
        "q",
        "r",
        "s",
        "t",
        "u",
        "v",
        "x",
        "y",
        "x",
        "#",
        "%",
        "&",
        "-",
        "+",
        "_",
        "?",
        "/",
        "\\",
        "="
    ],
    // String to resolve
    resolveString: strings[counter],
    // The element
    element: document.querySelector("[data-string-01]")
};

// Callback function when resolve completes
function callback() {
    setTimeout(() => {
        counter++;

        if (counter >= strings.length) {
            counter = 0;
        }

        let nextOptions = Object.assign({}, options, {
            resolveString: strings[counter]
        });
        resolver.resolve(nextOptions, callback);
    }, 1000);
}

resolver.resolve(options, callback);

//right click
// if (document.addEventListener) {
//     // IE >= 9; other browsers
//     document.addEventListener(
//         "contextmenu",
//         function(e) {
//             alert(
//                 "You've tried to open context menu by right clicking.\n\nI've disabled this to make it a smidge more difficult to see behind the scenes of the code and content I have spent a ton of time currating that defines my career here as well as to safegaurd my personal information.\n\n\nThere are others ways to see the source if you really need to ;}"
//             ); //here you draw your own menu
//             e.preventDefault();
//         },
//         false
//     );
// } else {
//     // IE < 9
//     document.attachEvent("oncontextmenu", function() {
//         alert("You've tried to open context menu");
//         window.event.returnValue = false;
//     });
// }

//color swapping
// function bgColor1() {
//     // document.getElementById("body").style.backgroundColor = "#1ACCAB";
//     // document.getElementById("body").style.color = "#e0e9fe";

//     document
//         .getElementById("body")
//         .setAttribute(
//             "style",
//             "color:#1A3ACC !important;background-color:#1ACCAB !important;"
//         );
// }

// function bgColor2() {
//     // document.getElementById("body").style.backgroundColor = "#1A3ACC";
//     document
//         .getElementById("body")
//         .setAttribute(
//             "style",
//             "color:white !important;background-color:#1A3ACC !important;"
//         );
// }

// Resume v3 theme picker lives in index.html; existing animation behavior retained.


// ============================================================================
// CHANGE: Aphex Twin-inspired browser status readout.
// Adds lightweight, client-side telemetry after the existing browser/IP line.
// Existing resolver animation and resume interactions above remain untouched.
// NOTE: IP is still supplied by the existing index.html/ipify callback;
// referrer may be blank when the browser suppresses it or the visit is direct.
// FPS is intentionally a visual, pseudo counter—not a performance benchmark.
// ============================================================================

(function initBrowserStatusReadout() {
    // CHANGE: Guard against duplicate injection if this script is evaluated twice.
    if (document.getElementById("browser-status-readout")) return;

    var infoBar = document.querySelector(".info");
    var address = document.getElementById("address");
    if (!infoBar || !address) return;

    // CHANGE: Capture when this page instance began; this is elapsed page time,
    // not a persistent visitor identity or a server-side session.
    var arrivalTime = Date.now();

    // CHANGE: Insert telemetry directly after the existing IP field.
    var readout = document.createElement("span");
    readout.id = "browser-status-readout";
    readout.setAttribute("aria-label", "Live browser status");
    readout.style.cssText = [
        "display:inline-block",
        "margin-left:8px",
        "font-family:'Roboto Mono',monospace",
        "font-size:inherit",
        "line-height:1.5",
        "overflow-wrap:anywhere"
    ].join(";");
    address.insertAdjacentElement("afterend", readout);

    var mouseX = "--";
    var mouseY = "--";
    var fps = 60;
    var fpsTimer = null;
    var scrollAnimation = null;
    var lastTopState = window.scrollY <= 2;

    // CHANGE: Format clock like a compact system timestamp, including date and
    // 24-hour time. Uses the visitor's local device clock and timezone.
    function pad(value, length) {
        return String(value).padStart(length || 2, "0");
    }

    function getClockLabel() {
        var now = new Date();
        return now.getFullYear() + "-" +
            pad(now.getMonth() + 1) + "-" +
            pad(now.getDate()) + " " +
            pad(now.getHours()) + ":" +
            pad(now.getMinutes()) + ":" +
            pad(now.getSeconds());
    }

    // CHANGE: Elapsed time starts on arrival and is displayed as HH:MM:SS.
    function getElapsedLabel() {
        var elapsed = Math.max(0, Math.floor((Date.now() - arrivalTime) / 1000));
        var hours = Math.floor(elapsed / 3600);
        var minutes = Math.floor((elapsed % 3600) / 60);
        var seconds = elapsed % 60;
        return pad(hours) + ":" + pad(minutes) + ":" + pad(seconds);
    }

    // CHANGE: Show a readable source hostname when available, without query strings.
    function getReferrerLabel() {
        if (!document.referrer) return "direct / hidden";
        try {
            var ref = new URL(document.referrer);
            var host = ref.hostname.replace(/^www\./i, "");
            var searchEngines = {
                "google.com": "Google",
                "bing.com": "Bing",
                "duckduckgo.com": "DuckDuckGo",
                "search.yahoo.com": "Yahoo",
                "ecosia.org": "Ecosia",
                "yandex.com": "Yandex"
            };
            var matched = Object.keys(searchEngines).filter(function (domain) {
                return host === domain || host.slice(-(domain.length + 1)) === "." + domain;
            })[0];
            return matched ? searchEngines[matched] : host;
        } catch (error) {
            return "referrer unavailable";
        }
    }

    var referrerLabel = getReferrerLabel();

    function renderReadout() {
        // CHANGE: Clock and elapsed time appear before FPS; FPS is always last.
        readout.textContent =
            " | XY: " + mouseX + "," + mouseY +
            " | FROM: " + referrerLabel +
            " | TIME: " + getClockLabel() +
            " | HERE: " + getElapsedLabel() +
            " | FPS: " + fps;
    }

    window.addEventListener("mousemove", function (event) {
        mouseX = Math.round(event.clientX);
        mouseY = Math.round(event.clientY);
        renderReadout();
    }, { passive: true });

    window.addEventListener("mouseout", function (event) {
        if (!event.relatedTarget && !event.toElement) {
            mouseX = "--";
            mouseY = "--";
            renderReadout();
        }
    }, { passive: true });

    // CHANGE: Pseudo FPS drifts between 59 and 60 every eight seconds.
    function startIdleFpsDrift() {
        window.clearInterval(fpsTimer);
        fpsTimer = window.setInterval(function () {
            fps = fps === 60 ? 59 : 60;
            renderReadout();
        }, 8000);
    }

    // CHANGE: When returning to the top, count the decorative FPS from 50 to 60.
    function countUpAtTop() {
        window.clearInterval(fpsTimer);
        window.clearInterval(scrollAnimation);
        var value = 50;
        fps = value;
        renderReadout();
        scrollAnimation = window.setInterval(function () {
            value += 1;
            fps = Math.min(value, 60);
            renderReadout();
            if (value >= 60) {
                window.clearInterval(scrollAnimation);
                scrollAnimation = null;
                startIdleFpsDrift();
            }
        }, 100);
    }

    window.addEventListener("scroll", function () {
        var atTop = window.scrollY <= 2;
        if (atTop && !lastTopState) countUpAtTop();
        lastTopState = atTop;
    }, { passive: true });

    // CHANGE: Keep the clock, elapsed timer, and readout live each second.
    window.setInterval(renderReadout, 1000);
    window.addEventListener("resize", renderReadout, { passive: true });

    renderReadout();
    startIdleFpsDrift();
})();


// ============================================================================
// INLINE SCRIPT CONSOLIDATION
// CHANGE: Former inline scripts from index.html live here to keep the HTML
// focused on markup. Keep their original relative order where practical.
// External libraries/JSONP tags remain in index.html because load order matters.
// ============================================================================

// Migrated from index.html inline script #1
function myFunction() {
        window.print();
      }


// Migrated from index.html inline script #4
(function(i, s, o, g, r, a, m) {
        i["GoogleAnalyticsObject"] = r;
        (i[r] =
          i[r] ||
          function() {
            (i[r].q = i[r].q || []).push(arguments);
          }),
          (i[r].l = 1 * new Date());
        (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m);
      })(
        window,
        document,
        "script",
        "https://www.google-analytics.com/analytics.js",
        "ga"
      );
      ga("create", "UA-15718770-4", "auto");
      ga("send", "pageview");


// Migrated from index.html inline script #5
$("#monitor").html($(window).width());
      $(window).resize(function() {
        var viewportWidth = $(window).width();
        $("#monitor").html(viewportWidth);
      });


// Migrated from index.html inline script #6
(function() {
        var message = "No! Don't leave! I have such sights to show you.";
        var now = new Date();
        var timestamp = now.toLocaleDateString("en-US") + " " +
          now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
        var resumeTitle = "Joel Dombek - Resume [" + timestamp + "]";

        document.title = resumeTitle;

        window.addEventListener("blur", function() {
          document.title = message;
        });

        window.addEventListener("focus", function() {
          document.title = resumeTitle;
        });

        // Keep the playful away title on screen, but never use it for printing.
        window.addEventListener("beforeprint", function() {
          document.title = resumeTitle;
        });

        window.addEventListener("afterprint", function() {
          document.title = document.hasFocus() ? resumeTitle : message;
        });
      })();


// Migrated from index.html inline script #7
navigator.browserInfo = (function() {
        var browser = "";
        var version = "";
        var idString = "";

        var ua = navigator.userAgent;
        var tem = [];
        var M = ua.match(
          /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
        );

        //IE will be identified as 'Trident' and a different version number. The name must be corrected to 'Internet Explorer' and the correct version identified.
        //ie correction
        if (/trident/i.test(M[1])) {
          tem = /\brv[ :]+(\d+.?\d*)/g.exec(ua) || [];
          browser = "IE";
          version = tem[1];
        }

        //firefox
        else if (/firefox/i.test(M[1])) {
          tem = /\brv[ :]+(\d+.?\d*)/g.exec(ua) || [];
          browser = "Firefox";
          version = tem[1];
        }

        //safari
        else if (/safari/i.test(M[1])) {
          tem = ua.match(/\bVersion\/(\d+.?\d*\s*\w+)/);
          browser = "Safari";
          version = tem[1];
        }

        //If 'Chrome' is found, it may be another browser.
        else if (M[1] === "Chrome") {
          //opera
          var temOpr = ua.match(/\b(OPR)\/(\d+.?\d*.?\d*.?\d*)/);
          //edge
          var temEdge = ua.match(/\b(Edge)\/(\d+.?\d*)/);
          //chrome
          //var temChrome = ua.match(/\b(Chrome)\/(\d+.?\d*.?\d*.?\d*)/);
          //var temChrome = ua.match(/\b(Chrome)\/(\d+.?\d*)/);
          var temChrome = ua.match(/\b(Chrome)\/(\d+.?\d*)/);

          //a genuine 'Chrome' reading will result from ONLY temChrome not being null.
          var genuineChrome =
            temOpr == null && temEdge == null && temChrome != null;

          if (temOpr != null) {
            browser = temOpr[1].replace("OPR", "Opera");
            version = temOpr[2];
          }

          if (temEdge != null) {
            browser = temEdge[1];
            version = temEdge[2];
          }

          if (genuineChrome) {
            browser = temChrome[1];
            version = temChrome[2];
          }
        }
        //There will be some odd balls, so if you wish to support those browsers, add functionality to display those browsers as well.

        if (browser == "" || version == "") {
          idString =
            "We couldn't find your browser, but you can still use the site";
        } else {
          idString = browser + " ver: " + version;
        }

        //alert('Your browser is ' + idString);
        document.getElementById("version").innerHTML =
          "Browser:&nbsp;" + idString;

        //store the type of browser locally
        if (typeof Storage !== "undefined") {
          //Store
          localStorage.setItem("browser", browser);
          localStorage.setItem("version", version);
        } else {
          alert("local storage not available");
          document.getElementById("version").innerHTML =
            "local storage not available";
        }
      })();


// Migrated from index.html inline script #8
function randomString(len, an) {
        an = an && an.toLowerCase();
        var str = "",
          i = 0,
          min = an == "a" ? 10 : 0,
          max = an == "n" ? 10 : 62;
        for (; i++ < len; ) {
          var r = (Math.random() * (max - min) + min) << 0;
          str += String.fromCharCode((r += r > 9 ? (r < 36 ? 55 : 61) : 48));
        }
        return str;
      }
      //document.getElementById("obfuscate-1").innerHTML = randomString(18);
      //document.getElementById("obfuscate-2").innerHTML = randomString(10);


// Migrated from index.html inline script #11
if (document.addEventListener) {
        // IE >= 9; other browsers
        document.addEventListener(
          "contextmenu",
          function(e) {
            alert(
              "You've tried to open context menu by right clicking.\n\nI've disabled this to make it a smidge more difficult to see behind the scenes of the code and content I have spent a ton of time currating that defines my career here as well as to safegaurd my personal information.\n\n\nThere are others ways to see the source if you really need to ;}"
            ); //here you draw your own menu
            e.preventDefault();
          },
          false
        );
      } else {
        // IE < 9
        document.attachEvent("oncontextmenu", function() {
          alert("You've tried to open context menu");
          window.event.returnValue = false;
        });
      }


// Migrated from index.html inline script #12
function getIP(json) {
        document.getElementById("address").innerHTML = "IP:&nbsp;" + json.ip;
      }


// Migrated from index.html inline script #14
(function () {
        var body = document.body;
        var picker = document.getElementById('theme-picker');
        var trigger = document.getElementById('theme-picker-trigger');
        var options = document.getElementById('theme-picker-options');
        var swatches = Array.prototype.slice.call(document.querySelectorAll('[data-theme-choice]'));
        var themes = ['paper', 'blue', 'dark-high', 'dark-low'];
        var key = 'resume-v3-theme';
        var idleTimer = null;
        var scrollTimer = null;
        var isPointerOver = false;
        var isScrolling = false;
        var hasBeenHovered = false;
        var idleDelay = 4000;
        var saved = null;
        try { saved = localStorage.getItem(key); } catch (e) {}
        var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        var initial = themes.indexOf(saved) !== -1 ? saved : (prefersDark ? 'dark-low' : 'paper');

        function applyTheme(theme) {
          if (themes.indexOf(theme) === -1) return;
          body.setAttribute('data-theme', theme);
          try { localStorage.setItem(key, theme); } catch (e) {}
          swatches.forEach(function (button) {
            button.setAttribute('aria-pressed', String(button.getAttribute('data-theme-choice') === theme));
          });
        }
        function closePicker() {
          options.hidden = true;
          trigger.setAttribute('aria-expanded', 'false');
          picker.classList.remove('is-open');
        }
        function clearIdleTimer() {
          window.clearTimeout(idleTimer);
          idleTimer = null;
        }
        function scheduleIdle() {
          clearIdleTimer();
          if (isScrolling || isPointerOver || picker.classList.contains('is-open') ||
              picker.contains(document.activeElement)) return;
          idleTimer = window.setTimeout(function () {
            if (isScrolling || isPointerOver || picker.classList.contains('is-open') ||
                picker.contains(document.activeElement)) return;
            if (hasBeenHovered) {
              picker.classList.remove('is-hidden');
              picker.classList.add('is-idle');
            } else {
              picker.classList.remove('is-idle');
              picker.classList.add('is-hidden');
            }
          }, idleDelay);
        }
        function revealFromHover() {
          hasBeenHovered = true;
          picker.classList.remove('is-hidden', 'is-idle');
          scheduleIdle();
        }
        trigger.addEventListener('click', function () {
          picker.classList.remove('is-hidden', 'is-idle');
          var opening = options.hidden;
          options.hidden = !opening;
          trigger.setAttribute('aria-expanded', String(opening));
          picker.classList.toggle('is-open', opening);
          if (opening) clearIdleTimer();
          else scheduleIdle();
        });
        swatches.forEach(function (button) {
          button.addEventListener('click', function (event) {
            event.stopPropagation();
            applyTheme(button.getAttribute('data-theme-choice'));
            closePicker();
            scheduleIdle();
          });
        });
        picker.addEventListener('mouseenter', function () {
          isPointerOver = true;
          revealFromHover();
        });
        picker.addEventListener('mouseleave', function () {
          isPointerOver = false;
          scheduleIdle();
        });
        picker.addEventListener('focusin', function () {
          clearIdleTimer();
          picker.classList.remove('is-hidden', 'is-idle');
        });
        picker.addEventListener('focusout', function () {
          window.setTimeout(scheduleIdle, 0);
        });
        window.addEventListener('scroll', function () {
          isScrolling = true;
          picker.classList.add('is-hidden');
          picker.classList.remove('is-idle');
          clearIdleTimer();
          window.clearTimeout(scrollTimer);
          scrollTimer = window.setTimeout(function () {
            isScrolling = false;
            // Stay hidden while scrolling settles; then return to the dim state
            // if already hovered once, otherwise stay hidden until first hover.
            if (hasBeenHovered) {
              picker.classList.remove('is-hidden');
              picker.classList.add('is-idle');
            } else {
              picker.classList.add('is-hidden');
            }
            scheduleIdle();
          }, 700);
        }, { passive: true });
        document.addEventListener('click', function (event) {
          if (!picker.contains(event.target)) closePicker();
        });
        document.addEventListener('keydown', function (event) {
          if (event.key === 'Escape') {
            closePicker();
            scheduleIdle();
          }
        });
        applyTheme(initial);
        // Show on initial load, then hide if untouched after four seconds.
        scheduleIdle();
      })();
