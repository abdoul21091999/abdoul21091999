/* =========================================================
   HI-TECH — Rendus vectoriels des appareils (style « studio »)
   ---------------------------------------------------------
   Dessine chaque appareil (dos + face, comme sur samsung.com)
   dans la couleur choisie. Aucune photo nécessaire : changer de
   couleur redessine l'appareil instantanément.
   Utilisation : RENDER.svg(produit.render, "#a9b4c6")
   ========================================================= */

const RENDER = (function () {
  "use strict";
  let uid = 0;

  /* ---------- Couleurs ---------- */
  const hex2rgb = (h) => { h = h.replace("#", ""); if (h.length === 3) h = h.replace(/./g, "$&$&"); const n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
  const rgb2hex = (r, g, b) => "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
  const mix = (a, b, t) => { const x = hex2rgb(a), y = hex2rgb(b); return rgb2hex(x[0] + (y[0] - x[0]) * t, x[1] + (y[1] - x[1]) * t, x[2] + (y[2] - x[2]) * t); };
  const light = (c, t) => mix(c, "#ffffff", t);
  const dark = (c, t) => mix(c, "#000000", t);
  const lum = (c) => { const [r, g, b] = hex2rgb(c); return (0.299 * r + 0.587 * g + 0.114 * b) / 255; };
  function hueShift(c, deg) {
    let [r, g, b] = hex2rgb(c).map((v) => v / 255);
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b); let h = 0, s = 0; const l = (mx + mn) / 2;
    if (mx !== mn) {
      const d = mx - mn; s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn);
      h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h /= 6;
    }
    h = (h + deg / 360) % 1; s = Math.max(s, .55); const L = Math.min(Math.max(l, .45), .7);
    const q = L < .5 ? L * (1 + s) : L + s - L * s, p = 2 * L - q;
    const f = (t) => { t = (t + 1) % 1; return t < 1 / 6 ? p + (q - p) * 6 * t : t < .5 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p; };
    return rgb2hex(f(h + 1 / 3) * 255, f(h) * 255, f(h - 1 / 3) * 255);
  }

  /* ---------- Briques communes ---------- */
  function defs(id, c) {
    const a1 = hueShift(c, 35), a2 = hueShift(c, -40);
    return `<defs>
      <linearGradient id="${id}b" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${light(c, .22)}"/><stop offset=".45" stop-color="${c}"/><stop offset="1" stop-color="${dark(c, .14)}"/>
      </linearGradient>
      <linearGradient id="${id}f" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="${dark(c, .28)}"/><stop offset=".5" stop-color="${light(c, .1)}"/><stop offset="1" stop-color="${dark(c, .3)}"/>
      </linearGradient>
      <linearGradient id="${id}w" x1="0" y1="0" x2=".3" y2="1">
        <stop offset="0" stop-color="${light(a1, .15)}"/><stop offset=".55" stop-color="${a2}"/><stop offset="1" stop-color="${dark(a2, .35)}"/>
      </linearGradient>
      <radialGradient id="${id}g1" cx=".25" cy=".3" r=".6"><stop offset="0" stop-color="${light(a1, .45)}" stop-opacity=".95"/><stop offset="1" stop-color="${a1}" stop-opacity="0"/></radialGradient>
      <radialGradient id="${id}g2" cx=".8" cy=".75" r=".55"><stop offset="0" stop-color="${light(c, .5)}" stop-opacity=".85"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>
      <radialGradient id="${id}sh" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".22"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
      <radialGradient id="${id}lens" cx=".35" cy=".35" r=".7"><stop offset="0" stop-color="#3b4a63"/><stop offset=".55" stop-color="#121821"/><stop offset="1" stop-color="#05070a"/></radialGradient>
    </defs>`;
  }
  const shadow = (id, cx, cy, rx, ry) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${id}sh)"/>`;

  function lens(id, c, cx, cy, r) {
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${dark(c, .35)}"/>
      <circle cx="${cx}" cy="${cy}" r="${r * .86}" fill="${light(c, .25)}"/>
      <circle cx="${cx}" cy="${cy}" r="${r * .74}" fill="#0b0e13"/>
      <circle cx="${cx}" cy="${cy}" r="${r * .52}" fill="url(#${id}lens)"/>
      <circle cx="${cx - r * .18}" cy="${cy - r * .2}" r="${r * .12}" fill="#fff" opacity=".55"/>`;
  }
  const flash = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#f4efe2" stroke="#cfc7b4" stroke-width="1"/>`;

  /* Écran avec fond d'écran abstrait */
  function screen(id, x, y, w, h, r) {
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="url(#${id}w)"/>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="url(#${id}g1)"/>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="url(#${id}g2)"/>
      <path d="M${x} ${y + h * .62} C ${x + w * .35} ${y + h * .48}, ${x + w * .6} ${y + h * .8}, ${x + w} ${y + h * .58} L ${x + w} ${y + h - r} Q ${x + w} ${y + h} ${x + w - r} ${y + h} L ${x + r} ${y + h} Q ${x} ${y + h} ${x} ${y + h - r} Z" fill="#fff" opacity=".12"/>`;
  }

  /* ---------- Téléphone : dos ---------- */
  function phoneBack(id, c, x, y, w, h, r, cam) {
    const frame = `<rect x="${x - 2}" y="${y - 2}" width="${w + 4}" height="${h + 4}" rx="${r + 2}" fill="url(#${id}f)"/>`;
    const body = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="url(#${id}b)"/>
      <rect x="${x + 3}" y="${y + 3}" width="${w - 6}" height="${h - 6}" rx="${r - 2}" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="1.2"/>`;
    let m = "";
    const L = (cx, cy, rr) => lens(id, c, cx, cy, rr);
    switch (cam) {
      case "s-ultra": {
        const rr = w * .085, cx = x + w * .2;
        m = L(cx, y + h * .085, rr) + L(cx, y + h * .175, rr) + L(cx, y + h * .265, rr) + L(x + w * .4, y + h * .13, rr * .9) + flash(x + w * .4, y + h * .215, rr * .3);
        break;
      }
      case "s": {
        const rr = w * .08, cx = x + w * .2;
        m = L(cx, y + h * .08, rr) + L(cx, y + h * .165, rr) + L(cx, y + h * .25, rr) + flash(x + w * .38, y + h * .085, rr * .32);
        break;
      }
      case "a": {
        const rr = w * .072, cx = x + w * .2;
        m = `<rect x="${cx - rr * 1.45}" y="${y + h * .035}" width="${rr * 2.9}" height="${h * .27}" rx="${rr * 1.45}" fill="${light(c, .12)}" stroke="${dark(c, .12)}" stroke-width="1"/>` +
          L(cx, y + h * .085, rr) + L(cx, y + h * .165, rr) + L(cx, y + h * .245, rr) + flash(x + w * .38, y + h * .07, rr * .32);
        break;
      }
      case "iphone-plateau": {
        const rr = w * .082, px = x + w * .05, py = y + h * .025, pw = w * .9, ph = h * .24;
        m = `<rect x="${px}" y="${py}" width="${pw}" height="${ph}" rx="${w * .1}" fill="${light(c, .1)}" stroke="${dark(c, .15)}" stroke-width="1"/>
          <rect x="${px + 4}" y="${py + 4}" width="${pw - 8}" height="${ph - 8}" rx="${w * .08}" fill="none" stroke="#fff" stroke-opacity=".35"/>` +
          L(x + w * .22, y + h * .07, rr) + L(x + w * .22, y + h * .19, rr) + L(x + w * .45, y + h * .13, rr) + flash(x + w * .75, y + h * .08, rr * .35) +
          `<circle cx="${x + w * .75}" cy="${y + h * .18}" r="${rr * .3}" fill="#1a1d22"/>`;
        break;
      }
      case "iphone-pro": {
        const s = w * .5, rr = w * .095, bx = x + w * .05, by = y + h * .025;
        m = `<rect x="${bx}" y="${by}" width="${s}" height="${s}" rx="${s * .26}" fill="${light(c, .14)}" stroke="${dark(c, .15)}" stroke-width="1"/>` +
          L(bx + s * .3, by + s * .28, rr) + L(bx + s * .3, by + s * .72, rr) + L(bx + s * .72, by + s * .5, rr) +
          flash(bx + s * .74, by + s * .2, rr * .32) + `<circle cx="${bx + s * .74}" cy="${by + s * .8}" r="${rr * .25}" fill="#1a1d22"/>`;
        break;
      }
      case "iphone-duo-v": {
        const rr = w * .085, cx = x + w * .2;
        m = `<rect x="${cx - rr * 1.5}" y="${y + h * .03}" width="${rr * 3}" height="${h * .2}" rx="${rr * 1.5}" fill="${light(c, .12)}" stroke="${dark(c, .15)}" stroke-width="1"/>` +
          L(cx, y + h * .075, rr) + L(cx, y + h * .185, rr) + flash(x + w * .4, y + h * .07, rr * .3);
        break;
      }
      case "iphone-duo-d": {
        const s = w * .42, rr = w * .085, bx = x + w * .05, by = y + h * .025;
        m = `<rect x="${bx}" y="${by}" width="${s}" height="${s}" rx="${s * .26}" fill="${light(c, .14)}" stroke="${dark(c, .15)}" stroke-width="1"/>` +
          L(bx + s * .32, by + s * .32, rr) + L(bx + s * .68, by + s * .68, rr) + flash(bx + s * .74, by + s * .26, rr * .3);
        break;
      }
      case "xiaomi-ultra": {
        const R = w * .33, cx = x + w / 2, cy = y + h * .2, rr = R * .3;
        m = `<circle cx="${cx}" cy="${cy}" r="${R + 4}" fill="${dark(c, .3)}"/><circle cx="${cx}" cy="${cy}" r="${R}" fill="#1b1d21" stroke="#9a9ca1" stroke-width="3"/>` +
          L(cx - R * .42, cy - R * .42, rr) + L(cx + R * .42, cy - R * .42, rr) + L(cx - R * .42, cy + R * .42, rr) + L(cx + R * .42, cy + R * .42, rr);
        break;
      }
      case "xiaomi": {
        const s = w * .5, rr = w * .085, bx = x + w * .06, by = y + h * .03;
        m = `<rect x="${bx}" y="${by}" width="${s}" height="${s}" rx="${s * .3}" fill="${dark(c, .08)}" stroke="#9a9ca1" stroke-width="1.5"/>` +
          L(bx + s * .3, by + s * .3, rr) + L(bx + s * .7, by + s * .3, rr) + L(bx + s * .3, by + s * .7, rr) + flash(bx + s * .7, by + s * .7, rr * .35);
        break;
      }
      case "redmi": {
        const rr = w * .09, bx = x + w * .07, by = y + h * .03;
        m = `<rect x="${bx}" y="${by}" width="${w * .42}" height="${h * .26}" rx="${w * .12}" fill="${light(c, .1)}" stroke="${dark(c, .2)}" stroke-width="1"/>` +
          L(bx + w * .14, by + h * .065, rr) + L(bx + w * .14, by + h * .185, rr) + L(bx + w * .3, by + h * .065, rr * .7) + flash(bx + w * .3, by + h * .17, rr * .3);
        break;
      }
      case "pixel": {
        const by = y + h * .14, bh = h * .095;
        m = `<rect x="${x}" y="${by}" width="${w}" height="${bh}" fill="${dark(c, .45)}"/>
          <rect x="${x + w * .12}" y="${by + bh * .18}" width="${w * .62}" height="${bh * .64}" rx="${bh * .32}" fill="#0d0f13"/>` +
          L(x + w * .24, by + bh / 2, bh * .27) + L(x + w * .43, by + bh / 2, bh * .27) + L(x + w * .62, by + bh / 2, bh * .27) + flash(x + w * .84, by + bh / 2, bh * .13);
        break;
      }
    }
    return frame + body + m;
  }

  /* ---------- Téléphone : face ---------- */
  function phoneFront(id, c, x, y, w, h, r, notch) {
    const bz = 5;
    let n = notch === "island"
      ? `<rect x="${x + w / 2 - w * .16}" y="${y + bz + 8}" width="${w * .32}" height="${w * .095}" rx="${w * .048}" fill="#000"/>`
      : `<circle cx="${x + w / 2}" cy="${y + bz + 13}" r="${w * .032}" fill="#000"/>`;
    return `<rect x="${x - 2}" y="${y - 2}" width="${w + 4}" height="${h + 4}" rx="${r + 2}" fill="url(#${id}f)"/>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="#0a0b0d"/>` +
      screen(id, x + bz, y + bz, w - bz * 2, h - bz * 2, r - bz) + n +
      `<path d="M${x + bz + 6} ${y + bz} L ${x + w * .55} ${y + bz} L ${x + bz + 6} ${y + h * .45} Z" fill="#fff" opacity=".07"/>`;
  }

  /* ---------- Compositions ---------- */
  const phone = (id, c, o) => {
    const w = 150, h = 312, r = o.corner ?? 26;
    return shadow(id, 250, 432, 150, 14) +
      phoneBack(id, c, 112, 92, w, h, r, o.cam) +
      phoneFront(id, c, 238, 96, w, h, r, o.notch || "punch");
  };

  const fold = (id, c, o) => {
    const h = 300, y = 100, r = 18;
    // dos plié + écran intérieur déplié
    return shadow(id, 255, 428, 175, 14) +
      phoneBack(id, c, 70, y - 4, 118, h, r, "s") +
      `<rect x="198" y="${y - 2}" width="236" height="${h + 4}" rx="${r + 2}" fill="url(#${id}f)"/>
       <rect x="200" y="${y}" width="232" height="${h}" rx="${r}" fill="#0a0b0d"/>` +
      screen(id, 205, y + 5, 222, h - 10, r - 5) +
      `<line x1="316" y1="${y + 5}" x2="316" y2="${y + h - 5}" stroke="#fff" stroke-opacity=".18" stroke-width="2"/>
       <circle cx="380" cy="${y + 18}" r="4" fill="#000"/>`;
  };

  const flip = (id, c, o) => {
    // clapet fermé (écran externe) + téléphone ouvert
    const cx = 92, cy = 214, s = 140;
    return shadow(id, 250, 432, 160, 14) +
      `<rect x="${cx - 2}" y="${cy - 2}" width="${s + 4}" height="${s * 1.04 + 4}" rx="24" fill="url(#${id}f)"/>
       <rect x="${cx}" y="${cy}" width="${s}" height="${s * 1.04}" rx="22" fill="url(#${id}b)"/>
       <rect x="${cx + 7}" y="${cy + 7}" width="${s - 14}" height="${s * 1.04 - 14}" rx="17" fill="#0a0b0d"/>` +
      screen(id, cx + 10, cy + 10, s - 20, s * 1.04 - 20, 14) +
      lens(id, c, cx + 30, cy + s * .82, 12) + lens(id, c, cx + 62, cy + s * .82, 12) +
      `<rect x="${cx + 4}" y="${cy + s * 1.04 + 4}" width="${s - 8}" height="10" rx="5" fill="${dark(c, .2)}"/>` +
      `<rect x="244" y="74" width="136" height="356" rx="24" fill="url(#${id}f)"/>
       <rect x="246" y="76" width="132" height="352" rx="22" fill="#0a0b0d"/>` +
      screen(id, 251, 81, 122, 342, 18) +
      `<line x1="251" y1="252" x2="373" y2="252" stroke="#fff" stroke-opacity=".15" stroke-width="2"/><circle cx="312" cy="94" r="4" fill="#000"/>`;
  };

  const tablet = (id, c, o) => {
    return shadow(id, 255, 440, 170, 14) +
      `<rect x="72" y="72" width="230" height="330" rx="22" fill="url(#${id}f)"/><rect x="74" y="74" width="226" height="326" rx="20" fill="url(#${id}b)"/>` +
      lens(id, c, 100, 102, 13) +
      `<rect x="168" y="96" width="262" height="346" rx="22" fill="url(#${id}f)"/>
       <rect x="170" y="98" width="258" height="342" rx="20" fill="#0a0b0d"/>` +
      screen(id, 180, 108, 238, 322, 12);
  };

  const laptop = (id, c, o) => {
    const mac = o.style !== "pc";
    const bz = mac ? 9 : 13;
    return shadow(id, 250, 392, 215, 16) +
      `<rect x="70" y="110" width="360" height="236" rx="14" fill="${dark(c, .2)}"/>
       <rect x="72" y="112" width="356" height="232" rx="12" fill="#0b0c0e"/>` +
      screen(id, 72 + bz, 112 + bz, 356 - bz * 2, 232 - bz * 2 - (mac ? 0 : 6), 4) +
      (mac ? `<rect x="230" y="112" width="40" height="11" rx="4" fill="#0b0c0e"/>` : `<circle cx="250" cy="118" r="2.5" fill="#333"/>`) +
      `<path d="M44 346 L456 346 L448 366 Q446 372 438 372 L62 372 Q54 372 52 366 Z" fill="url(#${id}b)"/>
       <rect x="44" y="344" width="412" height="5" rx="2" fill="${light(c, .3)}"/>
       <path d="M212 346 L288 346 L284 352 L216 352 Z" fill="${dark(c, .2)}"/>`;
  };

  const watch = (id, c, o) => {
    const band = o.band || dark(c, .1);
    return shadow(id, 250, 440, 110, 12) +
      `<rect x="190" y="40" width="120" height="120" rx="26" fill="${band}"/><rect x="190" y="330" width="120" height="110" rx="26" fill="${band}"/>
       <rect x="190" y="40" width="120" height="400" fill="none"/>
       <rect x="165" y="130" width="170" height="214" rx="46" fill="url(#${id}f)"/>
       <rect x="169" y="134" width="162" height="206" rx="42" fill="url(#${id}b)"/>
       <rect x="180" y="145" width="140" height="184" rx="34" fill="#050607"/>
       <rect x="335" y="190" width="10" height="38" rx="5" fill="${dark(c, .2)}"/><rect x="336" y="250" width="7" height="30" rx="3" fill="${dark(c, .25)}"/>
       <text x="250" y="232" text-anchor="middle" font-family="system-ui,sans-serif" font-size="40" font-weight="700" fill="${hueShift(c, 190)}">10:09</text>
       <text x="250" y="270" text-anchor="middle" font-family="system-ui,sans-serif" font-size="17" fill="#9aa">LUN 8</text>`;
  };

  const KINDS = { phone, fold, flip, tablet, laptop, watch };

  return {
    svg(spec, color) {
      const id = "r" + (++uid) + "_";
      const fn = KINDS[spec.kind] || phone;
      const bg = lum(color) > .85 ? "" : "";
      return `<svg class="render" viewBox="0 0 500 480" role="img" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">${defs(id, color)}${bg}${fn(id, color, spec)}</svg>`;
    }
  };
})();
