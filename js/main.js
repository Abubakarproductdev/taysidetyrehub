/* Tayside Tyre Hub: interactions */
(function () {
  "use strict";

  var WA_NUMBER = "447777923577";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var NS = "http://www.w3.org/2000/svg";
  var C = 300;   // svg centre
  var R = 290;   // outer tyre radius
  var uid = 0;

  /* ---------------------------------------------------------
     Tyre drawing. Proportions follow the real size: a lower
     profile means a bigger wheel and a thinner sidewall.
     --------------------------------------------------------- */
  function f(n) { return Math.round(n * 100) / 100; }

  function polar(radius, deg) {
    var a = (deg - 90) * Math.PI / 180;
    return [C + radius * Math.cos(a), C + radius * Math.sin(a)];
  }

  function tyreMarkup(w, p, r, topText, bottomText) {
    var id = "ty" + (++uid);
    var wheelMm = r * 25.4;
    var dia = wheelMm + 2 * w * p / 100;
    var treadIn = R - 18;
    var rimR = (R - 6) * wheelMm / dia;
    var side = treadIn - rimR;
    var mid = rimR + side / 2;
    var fs = Math.max(13, Math.min(30, side * 0.36));
    var rt = mid - fs * 0.36;   // top text grows outward from its path
    var rb = mid + fs * 0.36;   // bottom text grows inward from its path

    var s = "";
    s += '<svg viewBox="0 0 600 600" xmlns="' + NS + '" aria-hidden="true" focusable="false">';
    s += "<defs>";
    s += '<radialGradient id="' + id + 'rub" gradientUnits="userSpaceOnUse" cx="300" cy="300" r="' + R + '">' +
         '<stop offset="' + f(rimR / R) + '" stop-color="#1F1E1D"/>' +
         '<stop offset="' + f(mid / R) + '" stop-color="#363431"/>' +
         '<stop offset="' + f(treadIn / R) + '" stop-color="#1D1C1B"/>' +
         '<stop offset="1" stop-color="#111010"/></radialGradient>';
    s += '<radialGradient id="' + id + 'met" gradientUnits="userSpaceOnUse" cx="270" cy="260" r="' + f(rimR * 1.2) + '">' +
         '<stop offset="0" stop-color="#F4F5F6"/><stop offset=".6" stop-color="#C5C9CE"/><stop offset="1" stop-color="#8D939A"/></radialGradient>';
    s += '<linearGradient id="' + id + 'spk" x1="0" y1="0" x2="1" y2="1">' +
         '<stop offset="0" stop-color="#F0F2F4"/><stop offset="1" stop-color="#9DA3AA"/></linearGradient>';
    s += '<linearGradient id="' + id + 'sheen" x1="0" y1="0" x2="1" y2="1">' +
         '<stop offset="0" stop-color="#fff" stop-opacity=".13"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/>' +
         '<stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient>';
    s += '<path id="' + id + 'top" d="M ' + f(C - rt) + " " + C + " A " + f(rt) + " " + f(rt) + " 0 0 1 " + f(C + rt) + " " + C + '"/>';
    s += '<path id="' + id + 'bot" d="M ' + f(C - rb) + " " + C + " A " + f(rb) + " " + f(rb) + " 0 0 0 " + f(C + rb) + " " + C + '"/>';
    s += "</defs>";

    /* rotating layer A: tyre, rim barrel, brake disc */
    s += '<g class="spin" style="transform-origin:300px 300px">';
    s += '<circle cx="300" cy="300" r="' + R + '" fill="#151413"/>';
    for (var i = 0; i < 72; i++) {
      var h = i % 2 ? 9 : 15;
      s += '<rect x="297" y="' + (C - R - 1) + '" width="6" height="' + h + '" rx="1.5" fill="#080807" transform="rotate(' + (i * 5) + ' 300 300)"/>';
    }
    s += '<circle cx="300" cy="300" r="' + treadIn + '" fill="url(#' + id + 'rub)"/>';
    s += '<circle cx="300" cy="300" r="' + (treadIn - 5) + '" fill="none" stroke="#fff" stroke-opacity=".05"/>';
    s += '<circle cx="300" cy="300" r="' + f(rimR + 7) + '" fill="none" stroke="#fff" stroke-opacity=".06"/>';

    // moulded lettering: dark under-shadow, then raised face
    [["#0D0C0B", 1.4], ["#5A5752", 0]].forEach(function (layer) {
      s += '<g fill="' + layer[0] + '" transform="translate(0 ' + layer[1] + ')">';
      s += '<text class="sidewall-text" font-size="' + f(fs) + '"><textPath href="#' + id + 'top" startOffset="50%" text-anchor="middle">' + topText + "</textPath></text>";
      s += '<text class="sidewall-text" font-size="' + f(fs * 0.86) + '"><textPath href="#' + id + 'bot" startOffset="50%" text-anchor="middle" xml:space="preserve">' + bottomText + "</textPath></text>";
      s += "</g>";
    });

    s += '<circle cx="300" cy="300" r="' + f(rimR) + '" fill="url(#' + id + 'met)"/>';
    s += '<circle cx="300" cy="300" r="' + f(rimR - 5) + '" fill="#26282B"/>';
    s += '<circle cx="300" cy="300" r="' + f(rimR * 0.74) + '" fill="#55585C"/>';
    s += '<circle cx="300" cy="300" r="' + f(rimR * 0.74 - 7) + '" fill="none" stroke="#6F7378" stroke-width="2"/>';
    s += '<circle cx="300" cy="300" r="' + f(rimR * 0.4) + '" fill="#3A3D40"/>';
    s += "</g>";

    /* fixed brake caliper, painted in chalk yellow */
    var rc = rimR * 0.64;
    var a1 = polar(rc, -62), a2 = polar(rc, -18);
    s += '<path d="M ' + f(a1[0]) + " " + f(a1[1]) + " A " + f(rc) + " " + f(rc) + " 0 0 1 " + f(a2[0]) + " " + f(a2[1]) +
         '" fill="none" stroke="#E3242B" stroke-width="' + f(rimR * 0.17) + '" stroke-linecap="round"/>';
    s += '<path d="M ' + f(a1[0]) + " " + f(a1[1]) + " A " + f(rc) + " " + f(rc) + " 0 0 1 " + f(a2[0]) + " " + f(a2[1]) +
         '" fill="none" stroke="#A3161C" stroke-width="' + f(rimR * 0.03) + '" stroke-linecap="round" transform="translate(0 ' + f(rimR * 0.03) + ')" opacity=".6"/>';

    /* rotating layer B: spokes and hub */
    s += '<g class="spin" style="transform-origin:300px 300px">';
    s += '<circle cx="300" cy="300" r="' + f(rimR * 0.9) + '" fill="none" stroke="url(#' + id + 'spk)" stroke-width="' + f(rimR * 0.07) + '"/>';
    var hIn = rimR * 0.22, hOut = rimR * 0.9;
    for (var k = 0; k < 5; k++) {
      var ang = k * 72;
      [-1, 1].forEach(function (side2) {
        // twin spokes that split towards the rim
        var pIn1 = polar(hIn, ang + side2 * 6), pIn2 = polar(hIn, ang + side2 * 15);
        var pOut1 = polar(hOut, ang + side2 * 3), pOut2 = polar(hOut, ang + side2 * 10);
        s += '<path d="M ' + f(pIn1[0]) + " " + f(pIn1[1]) + " L " + f(pOut1[0]) + " " + f(pOut1[1]) + " L " + f(pOut2[0]) + " " + f(pOut2[1]) + " L " + f(pIn2[0]) + " " + f(pIn2[1]) +
             ' Z" fill="url(#' + id + 'spk)" stroke="#8D939A" stroke-width="1" stroke-linejoin="round"/>';
      });
    }
    s += '<circle cx="300" cy="300" r="' + f(rimR * 0.27) + '" fill="url(#' + id + 'spk)" stroke="#8D939A"/>';
    for (var n = 0; n < 5; n++) {
      var lp = polar(rimR * 0.19, n * 72 + 36);
      s += '<circle cx="' + f(lp[0]) + '" cy="' + f(lp[1]) + '" r="' + f(rimR * 0.03) + '" fill="#6F757B" stroke="#4A4E52"/>';
    }
    s += '<circle cx="300" cy="300" r="' + f(rimR * 0.12) + '" fill="#111214"/>';
    s += '<circle cx="300" cy="300" r="' + f(rimR * 0.05) + '" fill="#E3242B"/>';
    s += "</g>";

    s += '<circle cx="300" cy="300" r="' + R + '" fill="url(#' + id + 'sheen)" pointer-events="none"/>';
    s += "</svg>";
    return s;
  }

  function renderTyre(el, w, p, r, top, bottom) {
    el.innerHTML = tyreMarkup(w, p, r, top, bottom);
    return el.querySelectorAll(".spin");
  }

  /* ---------- Hero tyre: turns as you scroll ---------- */
  var heroEl = document.querySelector('[data-tyre="hero"]');
  var heroSpins = [];
  if (heroEl) {
    heroSpins = renderTyre(heroEl, +heroEl.dataset.w, +heroEl.dataset.p, +heroEl.dataset.r, heroEl.dataset.top, heroEl.dataset.bottom);
  }

  /* wheel slice in the services panel */
  var decoEl = document.querySelector('[data-tyre="deco"]');
  var decoSpins = decoEl ? Array.prototype.slice.call(renderTyre(decoEl, +decoEl.dataset.w, +decoEl.dataset.p, +decoEl.dataset.r, decoEl.dataset.top, decoEl.dataset.bottom)) : [];

  /* drilled brake disc with a fixed caliper, for the yellow services panel */
  function discMarkup() {
    var id = "dk" + (++uid);
    var s = '<svg viewBox="0 0 600 600" xmlns="' + NS + '" aria-hidden="true" focusable="false"><defs>';
    s += '<radialGradient id="' + id + 'm" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="#F4F5F6"/><stop offset=".55" stop-color="#C8CCD1"/><stop offset="1" stop-color="#8F959C"/></radialGradient>';
    s += '<radialGradient id="' + id + 'h" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#C9CDD2"/><stop offset="1" stop-color="#7F858C"/></radialGradient>';
    s += '<linearGradient id="' + id + 's" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".25"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></linearGradient>';
    s += "</defs>";

    s += '<g class="spin" style="transform-origin:300px 300px">';
    s += '<circle cx="300" cy="300" r="285" fill="url(#' + id + 'm)" stroke="#7D838A" stroke-width="3"/>';
    [268, 246, 224, 202, 182].forEach(function (rr) {
      s += '<circle cx="300" cy="300" r="' + rr + '" fill="none" stroke="#000" stroke-opacity=".06" stroke-width="1.2"/>';
    });
    // three staggered rings of cross-drilled holes
    [[254, 0], [228, 5], [202, 2.5]].forEach(function (ring) {
      for (var i = 0; i < 24; i++) {
        var p = polar(ring[0], i * 15 + ring[1]);
        s += '<circle cx="' + f(p[0]) + '" cy="' + f(p[1]) + '" r="7.5" fill="#3A3C3F" stroke="#6C7278" stroke-width="1.5"/>';
      }
    });
    s += '<circle cx="300" cy="300" r="165" fill="url(#' + id + 'h)" stroke="#6F757C" stroke-width="4"/>';
    s += '<circle cx="300" cy="300" r="122" fill="#A9AEB4" stroke="#7A8087" stroke-width="2"/>';
    for (var b = 0; b < 5; b++) {
      var bp = polar(88, b * 72);
      s += '<circle cx="' + f(bp[0]) + '" cy="' + f(bp[1]) + '" r="15" fill="#2A2C2F" stroke="#5E646A" stroke-width="2"/>';
    }
    s += '<circle cx="300" cy="300" r="48" fill="#1F2022" stroke="#6F757C" stroke-width="4"/>';
    s += "</g>";

    // caliper stays put while the disc turns
    var a1 = polar(232, 198), a2 = polar(232, 248);
    var arc = "M " + f(a1[0]) + " " + f(a1[1]) + " A 232 232 0 0 1 " + f(a2[0]) + " " + f(a2[1]);
    s += '<path d="' + arc + '" fill="none" stroke="#111214" stroke-width="96" stroke-linecap="round"/>';
    s += '<path d="' + arc + '" fill="none" stroke="#2A2D33" stroke-width="64" stroke-linecap="round"/>';
    var c1 = polar(232, 208), c2 = polar(232, 238);
    s += '<path d="M ' + f(c1[0]) + " " + f(c1[1]) + " A 232 232 0 0 1 " + f(c2[0]) + " " + f(c2[1]) + '" fill="none" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round"/>';
    s += '<circle cx="300" cy="300" r="285" fill="url(#' + id + 's)" pointer-events="none"/>';
    s += "</svg>";
    return s;
  }
  var discEl = document.querySelector("[data-disc]");
  if (discEl) {
    discEl.innerHTML = discMarkup();
    decoSpins = decoSpins.concat(Array.prototype.slice.call(discEl.querySelectorAll(".spin")));
  }

  /* each service opens WhatsApp with a ready-written question */
  document.querySelectorAll("[data-ask]").forEach(function (a) {
    var msg = "Hi Tayside Tyre Hub, I'd like to ask about " + a.dataset.ask + ".";
    a.href = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(msg);
    var name = a.querySelector("strong");
    if (name) a.setAttribute("aria-label", name.textContent + ": ask on WhatsApp");
  });

  var header = document.querySelector(".site-header");
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY;
      if (header) header.classList.toggle("scrolled", y > 8);
      if (!reduceMotion && y < window.innerHeight * 1.5) {
        var deg = -y * 0.28;
        for (var i = 0; i < heroSpins.length; i++) heroSpins[i].style.transform = "rotate(" + deg + "deg)";
      }
      if (!reduceMotion) {
        for (var j = 0; j < decoSpins.length; j++) decoSpins[j].style.transform = "rotate(" + (y * 0.12) + "deg)";
      }
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Open / closed status (Dundee time) ---------- */
  var HOURS = { 0: null, 1: [9, 18], 2: [9, 18], 3: [9, 18], 4: [9, 18], 5: [9, 18], 6: [10, 18] };
  var DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var DAY_SHORT = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

  function fmtHour(h) { return (h > 12 ? h - 12 : h) + (h >= 12 ? "pm" : "am"); }

  function londonNow() {
    try {
      var parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/London", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23"
      }).formatToParts(new Date());
      var o = {};
      parts.forEach(function (p) { o[p.type] = p.value; });
      return { day: DAY_SHORT[o.weekday], mins: (+o.hour) * 60 + (+o.minute) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }

  function updateStatus() {
    var now = londonNow();
    var today = HOURS[now.day];
    var open = !!today && now.mins >= today[0] * 60 && now.mins < today[1] * 60;
    var text;
    if (open) {
      var left = today[1] * 60 - now.mins;
      text = left <= 60 ? "Open, closing at " + fmtHour(today[1]) : "Open now until " + fmtHour(today[1]);
    } else if (today && now.mins < today[0] * 60) {
      text = "Closed, opens at " + fmtHour(today[0]);
    } else {
      for (var i = 1; i <= 7; i++) {
        var d = (now.day + i) % 7;
        if (HOURS[d]) {
          text = "Closed, opens " + (i === 1 ? "tomorrow" : DAY_NAMES[d]) + " at " + fmtHour(HOURS[d][0]);
          break;
        }
      }
    }
    document.querySelectorAll("[data-status]").forEach(function (el) {
      el.classList.toggle("is-open", open);
      el.classList.toggle("is-closed", !open);
      var t = el.querySelector("[data-status-text]");
      if (t) t.textContent = text;
      var sh = el.querySelector("[data-status-short]");
      if (sh) sh.textContent = open ? "Open now" : "Closed";
    });
    document.querySelectorAll(".hours tr").forEach(function (tr) {
      tr.classList.toggle("today", +tr.dataset.day === now.day);
    });
  }
  updateStatus();
  setInterval(updateStatus, 60000);

  /* ---------- Tyre size finder -> WhatsApp ---------- */
  var form = document.getElementById("finder-form");
  if (form) {
    var selW = document.getElementById("f-width");
    var selP = document.getElementById("f-profile");
    var selR = document.getElementById("f-rim");
    var preview = document.getElementById("wa-preview");
    var send = document.getElementById("wa-send");
    var finderEl = document.querySelector('[data-tyre="finder"]');

    function fill(sel, from, to, step, val, prefix) {
      for (var v = from; v <= to; v += step) {
        var o = document.createElement("option");
        o.value = v;
        o.textContent = (prefix || "") + v;
        if (v === val) o.selected = true;
        sel.appendChild(o);
      }
    }
    fill(selW, 135, 315, 10, 205);
    fill(selP, 25, 80, 5, 55);
    fill(selR, 13, 22, 1, 16, "R");

    var first = true;
    function update() {
      var w = +selW.value, p = +selP.value, r = +selR.value;
      var qty = +form.querySelector('input[name="qty"]:checked').value;
      var kind = form.querySelector('input[name="kind"]:checked').value;
      var size = w + "/" + p + " R" + r;
      var kindWord = kind === "either" ? "new or part-worn" : kind;

      var phrase = qty === 1 ? "a " + kindWord + " " + size + " tyre" : qty + " " + kindWord + " " + size + " tyres";
      var msg = "Hi Tayside Tyre Hub, do you have " + phrase + " in stock? How much would that be fitted and balanced? Thanks";
      preview.textContent = msg;
      send.href = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(msg);
      document.getElementById("wa-send-label").textContent = "Send on WhatsApp";

      var sideMm = Math.round(w * p / 100);
      document.getElementById("d-w-k").textContent = w;
      document.getElementById("d-p-k").textContent = p;
      document.getElementById("d-r-k").textContent = "R" + r;
      document.getElementById("d-w").textContent = "Width in millimetres.";
      document.getElementById("d-p").textContent = "Sidewall height is " + p + "% of the width, about " + sideMm + " mm.";
      document.getElementById("d-r").textContent = "Fits a " + r + "-inch wheel.";

      var spins = renderTyre(finderEl, w, p, r, "TAYSIDE TYRE HUB", size);
      if (!first && !reduceMotion) {
        // a short quarter-turn so you can see the tyre change
        spins.forEach(function (g) { g.style.transform = "rotate(-70deg)"; });
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            spins.forEach(function (g) {
              g.style.transition = "transform 650ms cubic-bezier(.2,.8,.2,1)";
              g.style.transform = "rotate(0deg)";
            });
          });
        });
      }
      first = false;
    }
    form.addEventListener("change", update);
    form.addEventListener("submit", function (e) { e.preventDefault(); });
    update();
  }

  /* ---------- Tread depth checker ---------- */
  var range = document.getElementById("tread-range");
  if (range) {
    var blocksG = document.getElementById("tread-blocks");
    var BASE = 160, SCALE = 15, X0 = 20, WIDTH = 480, GROOVE = 22, COUNT = 5;
    var bw = (WIDTH - GROOVE * (COUNT - 1)) / COUNT;
    var rects = [];
    for (var b = 0; b < COUNT; b++) {
      var rect = document.createElementNS(NS, "rect");
      rect.setAttribute("x", X0 + b * (bw + GROOVE));
      rect.setAttribute("width", bw);
      rect.setAttribute("rx", 4);
      rect.setAttribute("fill", "url(#rubberCut)");
      blocksG.appendChild(rect);
      rects.push(rect);
    }
    function yFor(mm) { return BASE - mm * SCALE; }
    [["line-new", "t-new", 8], ["line-3", "t-3", 3], ["line-legal", "t-legal", 1.6]].forEach(function (l) {
      var y = yFor(l[2]);
      var line = document.getElementById(l[0]);
      line.setAttribute("y1", y); line.setAttribute("y2", y);
      var t = document.getElementById(l[1]);
      t.setAttribute("y", y - 6);
      t.setAttribute("paint-order", "stroke");
      t.setAttribute("stroke", "#FBFAF6");
      t.setAttribute("stroke-width", "4");
    });

    var mmOut = document.getElementById("tread-mm");
    var verdict = document.getElementById("tread-verdict");
    function treadUpdate() {
      var mm = +range.value;
      var h = Math.max(0, mm * SCALE + 4); // +4 so blocks overlap the base
      rects.forEach(function (rc) {
        rc.setAttribute("y", BASE - mm * SCALE);
        rc.setAttribute("height", mm > 0 ? h : 0);
      });
      mmOut.textContent = mm.toFixed(1);
      range.setAttribute("aria-valuetext", mm.toFixed(1) + " millimetres");
      if (mm < 1.6) {
        verdict.dataset.level = "bad";
        verdict.innerHTML = 'Below the legal limit. Time for new tyres. <a class="link" href="#finder">Ask about your size</a>';
      } else if (mm < 3) {
        verdict.dataset.level = "warn";
        verdict.innerHTML = 'Legal, but getting low. Worth planning new tyres. <a class="link" href="#finder">Ask about your size</a>';
      } else {
        verdict.dataset.level = "ok";
        verdict.textContent = "Plenty of tread left.";
      }
    }
    range.addEventListener("input", treadUpdate);
    treadUpdate();
  }

  /* ---------- One-time reveals ---------- */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("in-view");
        if (en.target.id === "reviews" && !reduceMotion) countUp(en.target);
        io.unobserve(en.target);
      });
    }, { threshold: 0.25 });
    ["reviews"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) io.observe(el);
    });
    var ev = document.querySelector(".ev-feature");
    if (ev) io.observe(ev);
  } else {
    var evf = document.querySelector(".ev-feature");
    if (evf) evf.classList.add("in-view");
  }

  function countUp(scope) {
    scope.querySelectorAll("[data-count]").forEach(function (el) {
      var target = parseFloat(el.dataset.count);
      var start = null, dur = 1100;
      function step(ts) {
        if (!start) start = ts;
        var t = Math.min(1, (ts - start) / dur);
        var eased = 1 - Math.pow(1 - t, 3);
        el.textContent = (target * eased).toFixed(1);
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  var yr = document.querySelector("[data-year]");
  if (yr) yr.textContent = new Date().getFullYear();
})();
