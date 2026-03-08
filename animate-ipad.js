


async function celebrateMatchWin_iPad_starburstLoop() {

    celebrateMatchIpad_v3();
    return;

    for (let i = 0; i < 3; i++) {
	celebrateMatchWin_iPad_starburst_v2();
	await sleep(2000);
	
    }

}//celebrateMatchWin_iPad_starburstLoop

// for the ipad on a win
function celebrateMatchWin_iPad_starburst_v1() {
    injectIpadStarburstCSS_v2();

    const region = document.getElementById("star-ipad-region");
    region.innerHTML = ""; // clear previous particles

    const regionW = 800;
    const regionH = 800;

    region.style.width  = regionW + "px";
    region.style.height = regionH + "px";
    region.style.left   = (window.innerWidth  - regionW) / 2 + "px";
    region.style.top    = (window.innerHeight - regionH) / 2 + "px";

    const cx = regionW / 2;
    const cy = regionH / 2;

    const palettes = [
        { core: "#FFD700", mid: "#FFEA00", ring: "#FFF176" },
        { core: "#FF69B4", mid: "#FF1493", ring: "#FFC0CB" },
        { core: "#00BFFF", mid: "#87CEFA", ring: "#E0FFFF" },
        { core: "#7CFC00", mid: "#32CD32", ring: "#CCFFCC" },
        { core: "#FF8C00", mid: "#FFA500", ring: "#FFE5B4" },
        { core: "#FF4444", mid: "#FF0000", ring: "#FFB3B3" },
        { core: "#DA70D6", mid: "#BA55D3", ring: "#EE82EE" },
        { core: "#FFFFFF", mid: "#E0E0FF", ring: "#C0C0FF" },
    ];

    // ── 1. Bright core flash ──────────────────────────────────────────────
    const core = document.createElement("div");
    core.className = "starburst-core";
    const coreSize = 60;
    core.style.cssText = `
        left: ${cx - coreSize / 2}px;
        top:  ${cy - coreSize / 2}px;
        width:  ${coreSize}px;
        height: ${coreSize}px;
        background: radial-gradient(circle, #fff 0%, #FFD700 40%, transparent 100%);
        box-shadow: 0 0 30px 10px rgba(255,220,0,0.6);
        z-index: 2;
    `;
    region.appendChild(core);
    setTimeout(() => core.remove(), 1200);

    // ── 2. Expanding rings ────────────────────────────────────────────────
    [0, 120, 260].forEach((delay, ri) => {
        const ring = document.createElement("div");
        ring.className = "starburst-ipad ring";
        const rSize = 20 + ri * 10;
        ring.style.cssText = `
            left: ${cx - rSize / 2}px;
            top:  ${cy - rSize / 2}px;
            width:  ${rSize}px;
            height: ${rSize}px;
            --ring-color: ${["rgba(255,220,0,0.9)", "rgba(255,180,0,0.6)", "rgba(255,140,0,0.35)"][ri]};
            --dur: ${0.9 + ri * 0.15}s;
            animation-delay: ${delay}ms;
        `;
        region.appendChild(ring);
        setTimeout(() => ring.remove(), delay + 1400);
    });

    // ── 3. Main burst particles ───────────────────────────────────────────
    const PARTICLE_COUNT = 55;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const star = document.createElement("div");
        star.className = "starburst-ipad";

        const palette   = palettes[Math.floor(Math.random() * palettes.length)];
        const size      = 8 + Math.random() * 22;
        const angle     = (i / PARTICLE_COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        const distance  = 80 + Math.random() * 160;
        const dx        = Math.cos(angle) * distance;
        const dy        = Math.sin(angle) * distance;
        const dur       = 0.9 + Math.random() * 0.9;
        const delay     = Math.random() * 0.25; // tight launch window = punchy

        star.style.cssText = `
            left:   ${cx - size / 2}px;
            top:    ${cy - size / 2}px;
            width:  ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, ${palette.core} 0%, ${palette.mid} 50%, transparent 100%);
            --dx: ${dx}px;
            --dy: ${dy}px;
            --dur: ${dur}s;
            animation-delay: ${delay}s;
        `;

        region.appendChild(star);
        setTimeout(() => star.remove(), (dur + delay + 0.2) * 1000);
    }

    // ── 4. Slow trailing sparkles ─────────────────────────────────────────
    for (let i = 0; i < 18; i++) {
        const sparkle = document.createElement("div");
        sparkle.className = "starburst-ipad";

        const palette  = palettes[Math.floor(Math.random() * palettes.length)];
        const size     = 4 + Math.random() * 8;
        const angle    = Math.random() * Math.PI * 2;
        const distance = 50 + Math.random() * 220;
        const dx       = Math.cos(angle) * distance;
        const dy       = Math.sin(angle) * distance;
        const dur      = 1.6 + Math.random() * 1.0;
        const delay    = 0.2 + Math.random() * 0.6;

        sparkle.style.cssText = `
            left:   ${cx - size / 2}px;
            top:    ${cy - size / 2}px;
            width:  ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, #fff 0%, ${palette.core} 60%, transparent 100%);
            --dx: ${dx}px;
            --dy: ${dy}px;
            --dur: ${dur}s;
            animation-delay: ${delay}s;
        `;

        region.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), (dur + delay + 0.2) * 1000);
    }

    // ── cleanup style tag after everything finishes ───────────────────────
    setTimeout(() => document.getElementById("ipad-starburst-style")?.remove(), 4000);
}//v1


function celebrateMatchWin_iPad_starburst_v2() {
    injectIpadStarburstCSS_v2();

    const region = document.getElementById("star-ipad-region");
    region.innerHTML = "";

//    const regionW = window.innerWidth;
//    const regionH = window.innerHeight;
    const regionW = 800;
    const regionH = 800;

    region.style.width  = regionW + "px";
    region.style.height = regionH + "px";
    region.style.left   = (window.innerWidth  - regionW) / 2 + "px";
    region.style.top    = (window.innerHeight - regionH) / 2 + "px";

    const cx = regionW / 2;
    const cy = regionH / 2;

    const palettes = [
        { core: "#FFD700", mid: "#FFEA00" },
        { core: "#FF69B4", mid: "#FF1493" },
        { core: "#00BFFF", mid: "#87CEFA" },
        { core: "#7CFC00", mid: "#32CD32" },
        { core: "#FF8C00", mid: "#FFA500" },
        { core: "#FF4444", mid: "#FF0000" },
        { core: "#DA70D6", mid: "#BA55D3" },
        { core: "#FFFFFF", mid: "#E0E0FF" },
    ];

    // ── 1. Core flash ───────────────────────────────────────────────
    const core = document.createElement("div");
    core.className = "starburst-core";
    const coreSize = 60;
    core.style.cssText = `
        left: ${cx - coreSize / 2}px;
        top:  ${cy - coreSize / 2}px;
        width:  ${coreSize}px;
        height: ${coreSize}px;
        background: radial-gradient(circle, #fff 0%, #FFD700 40%, transparent 100%);
        box-shadow: 0 0 30px 10px rgba(255,220,0,0.6);
        z-index: 2;
    `;
    region.appendChild(core);
    setTimeout(() => core.remove(), 1200);

    // ── 2. Rings ─────────────────────────────────────────────────────
    [0, 120, 260].forEach((delay, ri) => {
        const ring = document.createElement("div");
        ring.className = "starburst-ipad ring";
        const rSize = 20 + ri * 10;

        ring.style.cssText = `
            left: ${cx - rSize / 2}px;
            top:  ${cy - rSize / 2}px;
            width:  ${rSize}px;
            height: ${rSize}px;
            --core: rgba(255,220,0,${0.9 - ri * 0.25});
            --mid:  rgba(255,180,0,${0.6 - ri * 0.2});
            --dur: ${0.9 + ri * 0.15}s;
            animation-delay: ${delay}ms;
        `;

        region.appendChild(ring);
        setTimeout(() => ring.remove(), delay + 1400);
    });

    // ── 3. Main burst particles (STARS) ──────────────────────────────
    const PARTICLE_COUNT = 55;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const star = document.createElement("div");
        star.className = "starburst-ipad";

        const palette   = palettes[Math.floor(Math.random() * palettes.length)];
        const size      = 8 + Math.random() * 40;
        const angle     = (i / PARTICLE_COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        const distance  = 80 + Math.random() * 160;
        const dx        = Math.cos(angle) * distance;
        const dy        = Math.sin(angle) * distance;
        const dur       = 0.9 + Math.random() * 0.9;
        const delay     = Math.random() * 0.25;

        star.style.cssText = `
            left:   ${cx - size / 2}px;
            top:    ${cy - size / 2}px;
            width:  ${size}px;
            height: ${size}px;
            --core: ${palette.core};
            --mid:  ${palette.mid};
            --dx: ${dx}px;
            --dy: ${dy}px;
            --dur: ${dur}s;
            animation-delay: ${delay}s;
        `;

        region.appendChild(star);
        setTimeout(() => star.remove(), (dur + delay + 0.2) * 1000);
    }

    // ── 4. Trailing sparkles (ALSO STARS) ────────────────────────────
    for (let i = 0; i < 18; i++) {
        const sparkle = document.createElement("div");
        sparkle.className = "starburst-ipad";

        const palette  = palettes[Math.floor(Math.random() * palettes.length)];
        const size     = 4 + Math.random() * 8;
        const angle    = Math.random() * Math.PI * 2;
        const distance = 50 + Math.random() * 220;
        const dx       = Math.cos(angle) * distance;
        const dy       = Math.sin(angle) * distance;
        const dur      = 1.6 + Math.random() * 1.0;
        const delay    = 0.2 + Math.random() * 0.6;

        sparkle.style.cssText = `
            left:   ${cx - size / 2}px;
            top:    ${cy - size / 2}px;
            width:  ${size}px;
            height: ${size}px;
            --core: ${palette.core};
            --mid:  ${palette.mid};
            --dx: ${dx}px;
            --dy: ${dy}px;
            --dur: ${dur}s;
            animation-delay: ${delay}s;
        `;

        region.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), (dur + delay + 0.2) * 1000);
    }

    setTimeout(() => document.getElementById("ipad-starburst-style")?.remove(), 4000);
}//v2

function injectIpadStarburstCSS_v2() {
    if (document.getElementById("ipad-starburst-style")) return;

    //  left: 200 !important;
//  top: 200 !important;
//  padding: 0 !important;
//  margin: 0 !important;
//  position: fixed !important;
//  transform: none !important;
//  contain: layout style paint !important;
//  box-sizing: content-box !important;
//  width: 400px !important;
//  height: 400px !important;
//  outline: 2px solid red !important;
//  background: rgba(255,0,0,0.2) !important;
//  display: block;

    const css = `
#star-ipad-region {
  pointer-events: none;
  overflow: hidden;
  z-index: 999999;
}

.starburst-ipad {
  position: absolute;
  opacity: 0;
  animation: ipadBurst var(--dur, 2.5s) ease-out forwards;
  background:
    radial-gradient(circle at 50% 20%, var(--core) 0%, transparent 60%),
    radial-gradient(circle at 80% 50%, var(--core) 0%, transparent 60%),
    radial-gradient(circle at 50% 80%, var(--core) 0%, transparent 60%),
    radial-gradient(circle at 20% 50%, var(--core) 0%, transparent 60%),
    radial-gradient(circle at 50% 50%, var(--mid) 0%, transparent 70%);
  border-radius: 50%;
  background-size: 100% 100%;   /* ⭐ REQUIRED FOR SAFARI */
}

@keyframes ipadBurst {
  0% {
    opacity: 1;
    transform: translate(0, 0);
  }
  100% {
    opacity: 0;
    transform: translate(var(--dx), var(--dy));
  }
}

`;

    const style = document.createElement("style");
    style.id = "ipad-starburst-style";
    style.textContent = css;
    document.head.appendChild(style);
}

function celebrateMatchIpad_v3() {
    const field = document.getElementById("star-field");

    // spawn 40–60 stars
    for (let i = 0; i < 1500; i++) {  // was 50 .. try 300
        const star = document.createElement("div");
        star.className = "starflash";

        // random position
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;

        star.style.left = x + "px";
        star.style.top = y + "px";

        // random size variation
        const size = 6 + Math.random() * 10;
        star.style.width = size + "px";
        star.style.height = size + "px";

        // random delay so they don't all flash at once
        star.style.animationDelay = (Math.random() * 5.0) + "s"; // was 0.6

	// multi-color
// multi-color glow palettes
const glows = [
    ["#FFD700", "#FFEA00", "#FFFACD"], // gold
    ["#FF69B4", "#FF1493", "#FFC0CB"], // pink
    ["#87CEFA", "#00BFFF", "#E0FFFF"], // blue
    ["#7CFC00", "#32CD32", "#CCFFCC"], // green
    ["#FFA500", "#FF8C00", "#FFE5B4"], // orange
    ["#FF4444", "#FF0000", "#FFB3B3"]  // red
];

// pick a random palette
const g = glows[Math.floor(Math.random() * glows.length)];

// apply background + glow
star.style.background = g[0];
//star.style.background = `radial-gradient(circle, ${g[0]} 0%, transparent 70%)`; //.. ipad?

	star.style.boxShadow = `
    0 0 6px ${g[0]},
    0 0 10px ${g[1]},
    0 0 14px ${g[2]}
`;

	
        field.appendChild(star);

        // remove after animation
        setTimeout(() => star.remove(), 15000);

    }
    
}//celebrateMatchIpad_v3
