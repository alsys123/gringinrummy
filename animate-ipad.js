
// NOTE **** THIS IS USED for all displays incuding PC and MAC.

const CelebrationLength = 15000; // 15 seconds

async function celebrateMatchWin_iPad_starburstLoop() {

    const celebrationEffects = [
    celebrateMatchWin_canvasBalloons_v1,
    celebrateMatchWin_canvasBalloons_v2,
    celebrateMatchWin_canvasBalloons_v3,
    celebrateMatchWin_canvasStarburst_v7,
    celebrateMatchWin_fireworks,
    celebrateMatchWin_canvasLightning_v1
];

    const randomIndex = Math.floor(Math.random() * celebrationEffects.length);

    celebrationEffects[randomIndex]();



    
}//celebrateMatchWin_iPad_starburstLoop

/*
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
*/

/*
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
*/
/*
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
  background-size: 100% 100%;   
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
*/
/*
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
*/
/*
// this one works!
function celebrateMatchWin_canvasStarburst_v4() {
    const canvas = document.getElementById("starburst-canvas");
    const ctx = canvas.getContext("2d");

    // full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = "fixed";
    canvas.style.left = "0";
    canvas.style.top = "0";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "999999";
    canvas.style.display = "block";

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    const colors = [
        "#FFD700", "#FF69B4", "#87CEFA",
        "#7CFC00", "#FFA500", "#FF4444"
    ];

    const particles = [];
    const count = 80;

    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 4;
        const size = 3 + Math.random() * 4;

        particles.push({
            x: cx,
            y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size,
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 0,
            maxLife: 50 + Math.random() * 30
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let alive = false;

        for (const p of particles) {
            p.life++;
            if (p.life >= p.maxLife) continue;

            alive = true;

            // simple motion
            p.x += p.vx;
            p.y += p.vy;

            // slight gravity
            p.vy += 0.03;

            const t = p.life / p.maxLife;
            const alpha = 1 - t;

            ctx.globalAlpha = alpha;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.globalAlpha = 1;

        if (alive) {
            requestAnimationFrame(draw);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.style.display = "none";
        }
    }

    requestAnimationFrame(draw);
}//v4
*/
/*
function celebrateMatchWin_canvasStarburst_v5() {
    const canvas = document.getElementById("starburst-canvas");
    const ctx = canvas.getContext("2d");

    // full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = "fixed";
    canvas.style.left = "0";
    canvas.style.top = "0";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "999999";
    canvas.style.display = "block";

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    const colors = [
        "#FFD700", "#FF69B4", "#87CEFA",
        "#7CFC00", "#FFA500", "#FF4444"
    ];

    const particles = [];
    const count = 80;

    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 4;
        const size = 6 + Math.random() * 10;

        particles.push({
            x: cx,
            y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size,
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 0,
            maxLife: 50 + Math.random() * 30,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.1
        });
    }

    function drawStar(ctx, x, y, radius, rotation, color, alpha) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;

        ctx.beginPath();
        const spikes = 5;
        const outer = radius;
        const inner = radius * 0.45;

        for (let i = 0; i < spikes * 2; i++) {
            const r = (i % 2 === 0) ? outer : inner;
            const a = (Math.PI / spikes) * i;
            ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }

        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let alive = false;

        for (const p of particles) {
            p.life++;
            if (p.life >= p.maxLife) continue;

            alive = true;

            // motion
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.03;

            // rotation
            p.rotation += p.rotationSpeed;

            // flashing effect
            const t = p.life / p.maxLife;
            const flash = 0.5 + Math.sin(p.life * 0.3) * 0.5; // 0–1 pulsing
            const alpha = (1 - t) * flash;

            drawStar(ctx, p.x, p.y, p.size, p.rotation, p.color, alpha);
        }

        if (alive) {
            requestAnimationFrame(draw);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.style.display = "none";
        }
    }

    requestAnimationFrame(draw);
}//v5
*/
/*
function celebrateMatchWin_canvasStarburst_v6() {
    const canvas = document.getElementById("starburst-canvas");
    const ctx = canvas.getContext("2d");

    // full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = "fixed";
    canvas.style.left = "0";
    canvas.style.top = "0";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "999999";
    canvas.style.display = "block";

    const colors = [
        "#FFD700", "#FF69B4", "#87CEFA",
        "#7CFC00", "#FFA500", "#FF4444"
    ];

    const particles = [];
    const count = 120;   // more stars for full-screen sparkle

    let running = true;   // ⭐ controls whether stars keep respawning

    // stop after 5 seconds
    setTimeout(() => {
        running = false;
    }, 5000);

    // create random stars anywhere on screen
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: 6 + Math.random() * 12,
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 0,
            maxLife: 40 + Math.random() * 40,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.05
        });
    }

    function drawStar(ctx, x, y, radius, rotation, color, alpha) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;

        ctx.beginPath();
        const spikes = 5;
        const outer = radius;
        const inner = radius * 0.45;

        for (let i = 0; i < spikes * 2; i++) {
            const r = (i % 2 === 0) ? outer : inner;
            const a = (Math.PI / spikes) * i;
            ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }

        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let alive = false;

        for (const p of particles) {
            p.life++;

            if (p.life >= p.maxLife) {
                // respawn a new star in a new random location
                p.x = Math.random() * canvas.width;
                p.y = Math.random() * canvas.height;
                p.life = 0;
                p.maxLife = 40 + Math.random() * 40;
                p.size = 6 + Math.random() * 12;
                p.color = colors[Math.floor(Math.random() * colors.length)];
                p.rotation = Math.random() * Math.PI * 2;
            }

            alive = true;

            // rotation
            p.rotation += p.rotationSpeed;

            // flashing effect
            const t = p.life / p.maxLife;
            const flash = 0.5 + Math.sin(p.life * 0.25) * 0.5; // twinkle
            const alpha = (1 - t) * flash;

            drawStar(ctx, p.x, p.y, p.size, p.rotation, p.color, alpha);
        }

        if (alive) {
            requestAnimationFrame(draw);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.style.display = "none";
        }
    }

    requestAnimationFrame(draw);
}//v6
*/

function celebrateMatchWin_canvasStarburst_v7() {

    log("celebrateMatchWin_canvasStarburst_v7", "player");
    
    const canvas = document.getElementById("starburst-canvas");
    const ctx = canvas.getContext("2d");

    // full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = "fixed";
    canvas.style.left = "0";
    canvas.style.top = "0";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "999999";
    canvas.style.display = "block";

    const colors = [
        "#FFD700", "#FF69B4", "#87CEFA",
        "#7CFC00", "#FFA500", "#FF4444"
    ];

    const particles = [];
    const count = 120;

    let running = true;

    // stop spawning after 5 seconds
    setTimeout(() => { running = false; }, CelebrationLength);

    // initial stars
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: 6 + Math.random() * 12,
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 0,
            maxLife: 40 + Math.random() * 40,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.05,
            dead: false
        });
    }

    function drawStar(ctx, x, y, radius, rotation, color, alpha) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;

        ctx.beginPath();
        const spikes = 5;
        const outer = radius;
        const inner = radius * 0.45;

        for (let i = 0; i < spikes * 2; i++) {
            const r = (i % 2 === 0) ? outer : inner;
            const a = (Math.PI / spikes) * i;
            ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }

        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let alive = false;

        for (const p of particles) {
            if (p.dead) continue;

            p.life++;

            if (p.life >= p.maxLife) {
                if (running) {
                    // respawn
                    p.x = Math.random() * canvas.width;
                    p.y = Math.random() * canvas.height;
                    p.life = 0;
                    p.maxLife = 40 + Math.random() * 40;
                    p.size = 6 + Math.random() * 12;
                    p.color = colors[Math.floor(Math.random() * colors.length)];
                    p.rotation = Math.random() * Math.PI * 2;
                } else {
                    // mark as dead
                    p.dead = true;
                    continue;
                }
            }

            alive = true;

            p.rotation += p.rotationSpeed;

            const t = p.life / p.maxLife;
            const flash = 0.5 + Math.sin(p.life * 0.25) * 0.5;
            const alpha = (1 - t) * flash;

            drawStar(ctx, p.x, p.y, p.size, p.rotation, p.color, alpha);
        }

        // stop when all stars are dead AND no respawning
        if (!alive && !running) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.style.display = "none";
            return;
        }

        requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
}//v7

function celebrateMatchWin_fireworks() {

    const canvas = document.getElementById("starburst-canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = "fixed";
    canvas.style.left = "0";
    canvas.style.top = "0";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "999999";
    canvas.style.display = "block";

    const colors = ["#FF4444", "#FFD700", "#7CFC00", "#87CEFA", "#FF69B4", "#FFA500"];

    const fireworks = [];
    let running = true;

    // stop spawning after 6 seconds
    setTimeout(() => running = false, CelebrationLength); // was 6000

    function spawnFirework() {
        const x = Math.random() * canvas.width;
        const y = canvas.height + 20; // start below screen
        const targetY = 100 + Math.random() * (canvas.height * 0.4);

        fireworks.push({
            x,
            y,
            vx: 0,
            vy: -6 - Math.random() * 3,
            targetY,
            exploded: false,
            particles: [],
            color: colors[Math.floor(Math.random() * colors.length)]
        });
    }

    function explode(fw) {
        const count = 40 + Math.random() * 40;

        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2) * (i / count);
            const speed = 2 + Math.random() * 3;

            fw.particles.push({
                x: fw.x,
                y: fw.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 0,
                maxLife: 40 + Math.random() * 40,
                color: fw.color
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (running && Math.random() < 0.08) {
            spawnFirework();
        }

        let alive = false;

        for (const fw of fireworks) {

            // Launch phase
            if (!fw.exploded) {
                fw.x += fw.vx;
                fw.y += fw.vy;

                // draw launch comet
                ctx.globalAlpha = 1;
                ctx.fillStyle = fw.color;
                ctx.beginPath();
                ctx.arc(fw.x, fw.y, 3, 0, Math.PI * 2);
                ctx.fill();

                if (fw.y <= fw.targetY) {
                    fw.exploded = true;
                    explode(fw);
                }

                alive = true;
                continue;
            }

            // Explosion particles
            for (const p of fw.particles) {
                if (p.life >= p.maxLife) continue;

                p.life++;
                alive = true;

                // physics
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.03; // gravity

                const t = p.life / p.maxLife;
                const alpha = 1 - t;

                ctx.globalAlpha = alpha;
                ctx.fillStyle = p.color;

                ctx.beginPath();
                ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        if (!alive && !running) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.style.display = "none";
            return;
        }

        requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
}//celebrateMatchWin_fireworks

function celebrateMatchWin_canvasBalloons_v1() {

    const canvas = document.getElementById("starburst-canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = "fixed";
    canvas.style.left = "0";
    canvas.style.top = "0";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "999999";
    canvas.style.display = "block";

    const colors = [
        "#FF4D4D", "#FFB84D", "#FFFF66",
        "#66FF66", "#66CCFF", "#CC66FF",
        "#FF66CC", "#00E6E6"
    ];

    const particles = [];
    const count = 80;
    let running = true;

    setTimeout(() => running = false, CelebrationLength);

    function makeBalloon() {
        return {
            x: Math.random() * canvas.width,
            y: canvas.height - Math.random() * 50,   // visible immediately
            size: 20 + Math.random() * 30,
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 0,
            maxLife: 120 + Math.random() * 80,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: 0.02 + Math.random() * 0.03,
            riseSpeed: 1 + Math.random() * 2,
            rotation: (Math.random() - 0.5) * 0.2,
            dead: false
        };
    }

    for (let i = 0; i < count; i++) {
        particles.push(makeBalloon());
    }

    function drawBalloon(ctx, x, y, size, rotation, color, alpha) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.globalAlpha = alpha;

        // balloon body (browser-safe)
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.save();
        ctx.scale(0.7, 1);
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.restore();
        ctx.fill();

        // shine
        ctx.globalAlpha = alpha * 0.6;
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(-size * 0.3, -size * 0.3, size * 0.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let alive = false;

        for (const p of particles) {
            if (p.dead) continue;

            p.life++;

            if (p.life >= p.maxLife) {
                if (running) {
                    Object.assign(p, makeBalloon());
                } else {
                    p.dead = true;
                    continue;
                }
            }

            alive = true;

            p.y -= p.riseSpeed;
            p.wobble += p.wobbleSpeed;
            p.x += Math.sin(p.wobble) * 0.8;
            p.rotation += Math.sin(p.wobble) * 0.01;

            const t = p.life / p.maxLife;
            const alpha = 1 - t * 0.8;

            drawBalloon(ctx, p.x, p.y, p.size, p.rotation, p.color, alpha);
        }

        if (!alive && !running) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.style.display = "none";
            return;
        }

        requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
}

function celebrateMatchWin_canvasBalloons_v2() {

    const canvas = document.getElementById("starburst-canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = "fixed";
    canvas.style.left = "0";
    canvas.style.top = "0";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "999999";
    canvas.style.display = "block";

    const balloonColors = [
        "#FF4D4D", "#FFB84D", "#FFFF66",
        "#66FF66", "#66CCFF", "#CC66FF",
        "#FF66CC", "#00E6E6"
    ];

    const confettiColors = [
        "#FF4444", "#FFBB33", "#00C851",
        "#33B5E5", "#AA66CC", "#FF8800"
    ];

    const particles = [];
    const count = 80;
    let running = true;

    setTimeout(() => running = false, CelebrationLength);

    function makeBalloon() {
        return {
            type: "balloon",
            x: Math.random() * canvas.width,
            y: canvas.height - Math.random() * 50,
            size: 20 + Math.random() * 30,
            color: balloonColors[Math.floor(Math.random() * balloonColors.length)],
            life: 0,
            maxLife: 120 + Math.random() * 80,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: 0.02 + Math.random() * 0.03,
            riseSpeed: 1 + Math.random() * 2,
            rotation: (Math.random() - 0.5) * 0.2,
            dead: false
        };
    }

    function makeConfettiBurst(x, y, color) {
        const burst = [];
        const pieces = 25 + Math.random() * 20;

        for (let i = 0; i < pieces; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 3;

            burst.push({
                type: "confetti",
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 3 + Math.random() * 3,
                color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
                life: 0,
                maxLife: 60 + Math.random() * 40,
                dead: false
            });
        }

        return burst;
    }

    for (let i = 0; i < count; i++) {
        particles.push(makeBalloon());
    }

    function drawBalloon(p) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = 1 - (p.life / p.maxLife) * 0.8;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.save();
        ctx.scale(0.7, 1);
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.restore();
        ctx.fill();

        ctx.fillStyle = "white";
        ctx.globalAlpha *= 0.6;
        ctx.beginPath();
        ctx.arc(-p.size * 0.3, -p.size * 0.3, p.size * 0.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    function drawConfetti(p) {
        ctx.save();
        ctx.globalAlpha = 1 - (p.life / p.maxLife);
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
        ctx.restore();
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let alive = false;

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            if (p.dead) continue;

            p.life++;

            if (p.type === "balloon") {

                // pop conditions
                if (p.y < -p.size || p.life >= p.maxLife) {
                    const burst = makeConfettiBurst(p.x, p.y, p.color);
                    particles.splice(i, 1, ...burst);
                    i += burst.length - 1;
                    continue;
                }

                alive = true;

                p.y -= p.riseSpeed;
                p.wobble += p.wobbleSpeed;
                p.x += Math.sin(p.wobble) * 0.8;
                p.rotation += Math.sin(p.wobble) * 0.01;

                drawBalloon(p);

            } else if (p.type === "confetti") {

                if (p.life >= p.maxLife) {
                    p.dead = true;
                    continue;
                }

                alive = true;

                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.05; // gravity

                drawConfetti(p);
            }
        }

        if (!alive && !running) {
            canvas.style.display = "none";
            return;
        }

        requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
}

function celebrateMatchWin_canvasBalloons_v3() {

    const canvas = document.getElementById("starburst-canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = "fixed";
    canvas.style.left = "0";
    canvas.style.top = "0";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "999999";
    canvas.style.display = "block";

    const balloonColors = [
        "#FF4D4D", "#FFB84D", "#FFFF66",
        "#66FF66", "#66CCFF", "#CC66FF",
        "#FF66CC", "#00E6E6"
    ];

    const confettiColors = [
        "#FF4444", "#FFBB33", "#00C851",
        "#33B5E5", "#AA66CC", "#FF8800"
    ];

    const particles = [];
    const count = 80;
    let running = true;

    setTimeout(() => running = false, CelebrationLength);

    function makeBalloon() {
        return {
            type: "balloon",
            x: Math.random() * canvas.width,
            y: canvas.height - Math.random() * 50,
            size: 20 + Math.random() * 30,
            baseSize: 0, // set later
            color: balloonColors[Math.floor(Math.random() * balloonColors.length)],
            life: 0,
            maxLife: 120 + Math.random() * 80,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: 0.02 + Math.random() * 0.03,
            riseSpeed: 1 + Math.random() * 2,
            rotation: (Math.random() - 0.5) * 0.2,
            stretching: false,
            stretchLife: 0,
            stretchMax: 20 + Math.random() * 20,
            dead: false
        };
    }

    for (let i = 0; i < count; i++) {
        const b = makeBalloon();
        b.baseSize = b.size;
        particles.push(b);
    }

    function makeConfettiBurst(x, y) {
        const burst = [];
        const pieces = 25 + Math.random() * 25;

        for (let i = 0; i < pieces; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 4;

            burst.push({
                type: "confetti",
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 3 + Math.random() * 3,
                color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
                life: 0,
                maxLife: 60 + Math.random() * 40,
                spin: (Math.random() - 0.5) * 0.3,
                angle: Math.random() * Math.PI * 2,
                dead: false
            });
        }

        return burst;
    }

    function drawBalloon(p) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        ctx.globalAlpha = 1 - (p.life / p.maxLife) * 0.6;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.save();
        ctx.scale(0.7 + p.stretchLife * 0.02, 1 + p.stretchLife * 0.04);
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.restore();
        ctx.fill();

        ctx.fillStyle = "white";
        ctx.globalAlpha *= 0.6;
        ctx.beginPath();
        ctx.arc(-p.size * 0.3, -p.size * 0.3, p.size * 0.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    function drawConfetti(p) {
        ctx.save();
        ctx.globalAlpha = 1 - (p.life / p.maxLife);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let alive = false;

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            if (p.dead) continue;

            p.life++;

            if (p.type === "balloon") {

                if (!p.stretching && (p.y < canvas.height * 0.25 || p.life > p.maxLife * 0.7)) {
                    p.stretching = true;
                }

                if (p.stretching) {
                    p.stretchLife++;

                    p.size = p.baseSize * (1 + p.stretchLife * 0.03);

                    p.rotation += (Math.random() - 0.5) * 0.1;

                    if (p.stretchLife >= p.stretchMax) {
                        const burst = makeConfettiBurst(p.x, p.y);
                        particles.splice(i, 1, ...burst);
                        i += burst.length - 1;
                        continue;
                    }
                } else {
                    p.y -= p.riseSpeed;
                    p.wobble += p.wobbleSpeed;
                    p.x += Math.sin(p.wobble) * 0.8;
                    p.rotation += Math.sin(p.wobble) * 0.01;
                }

                alive = true;
                drawBalloon(p);

            } else if (p.type === "confetti") {

                if (p.life >= p.maxLife) {
                    p.dead = true;
                    continue;
                }

                alive = true;

                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.05;
                p.angle += p.spin;

                drawConfetti(p);
            }
        }

        if (!alive && !running) {
            canvas.style.display = "none";
            return;
        }

        requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
}

function celebrateMatchWin_canvasLightning_v1() {

    const canvas = document.getElementById("starburst-canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = "fixed";
    canvas.style.left = "0";
    canvas.style.top = "0";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "999999";
    canvas.style.display = "block";

    const colors = [
        "#00FFFF", "#7DF9FF", "#FF00FF",
        "#39FF14", "#FF1493", "#00FF7F",
        "#1E90FF", "#FFD700"
    ];

    const bolts = [];
    let running = true;

    // stop after 6 seconds
    setTimeout(() => running = false, CelebrationLength);

    function makeBolt() {
        const startX = Math.random() * canvas.width;
        const startY = Math.random() * canvas.height;

        const segments = [];
        const length = 8 + Math.random() * 12;
        const angle = Math.random() * Math.PI * 2;

        let x = startX;
        let y = startY;

        for (let i = 0; i < length; i++) {
            const step = 20 + Math.random() * 40;
            const jitter = (Math.random() - 0.5) * 0.8;

            x += Math.cos(angle + jitter) * step;
            y += Math.sin(angle + jitter) * step;

            segments.push({ x, y });

            // occasional branching
            if (Math.random() < 0.15) {
                segments.push({
                    branch: true,
                    x, y,
                    angle: angle + (Math.random() - 0.5) * 1.2
                });
            }
        }

        return {
            segments,
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 0,
            maxLife: 8 + Math.random() * 8,
            glow: 8 + Math.random() * 12
        };
    }

    function drawBolt(b) {
        ctx.save();
        ctx.lineWidth = 2 + Math.random() * 2;
        ctx.strokeStyle = b.color;
        ctx.globalAlpha = 1 - (b.life / b.maxLife);

        ctx.shadowBlur = b.glow;
        ctx.shadowColor = b.color;

        ctx.beginPath();

        const first = b.segments[0];
        ctx.moveTo(first.x, first.y);

        for (let i = 1; i < b.segments.length; i++) {
            const s = b.segments[i];

            if (s.branch) {
                drawBranch(s.x, s.y, s.angle, b.color);
                continue;
            }

            ctx.lineTo(s.x, s.y);
        }

        ctx.stroke();
        ctx.restore();
    }

    function drawBranch(x, y, angle, color) {
        ctx.save();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.7;

        ctx.beginPath();
        ctx.moveTo(x, y);

        const steps = 3 + Math.random() * 4;
        for (let i = 0; i < steps; i++) {
            const step = 15 + Math.random() * 25;
            const jitter = (Math.random() - 0.5) * 0.8;
            x += Math.cos(angle + jitter) * step;
            y += Math.sin(angle + jitter) * step;
            ctx.lineTo(x, y);
        }

        ctx.stroke();
        ctx.restore();
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (running && Math.random() < 0.25) {
            bolts.push(makeBolt());
        }

        let alive = false;

        for (let i = 0; i < bolts.length; i++) {
            const b = bolts[i];
            b.life++;

            if (b.life >= b.maxLife) {
                bolts.splice(i, 1);
                i--;
                continue;
            }

            alive = true;
            drawBolt(b);
        }

        if (!alive && !running) {
            canvas.style.display = "none";
            return;
        }

        requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
}

function createButterflySpeciesCanvases() {
    const species = [];

    // 8 mixed natural + vibrant palettes (top → bottom)
    const palettes = [
        ["#b7e3ff", "#5aa7e8"], // sky blue
        ["#e8c8ff", "#a06ad9"], // lavender
        ["#ffd4c2", "#ff8b5c"], // peach
        ["#fff7b3", "#f2d23c"], // soft yellow
        ["#caffea", "#4ecf9f"], // mint green
        ["#b3e5ff", "#3ca7ff"], // vibrant blue
        ["#ffc2d9", "#ff4f7a"], // coral pink
        ["#d7c6ff", "#7a5cff"]  // violet
    ];

    for (let i = 0; i < 8; i++) {
        const c = document.createElement("canvas");
        c.width = 96;
        c.height = 96;
        const ctx = c.getContext("2d");

        const [topColor, bottomColor] = palettes[i];

        // Vertical gradient
        const grad = ctx.createLinearGradient(0, 0, 0, 96);
        grad.addColorStop(0, topColor);
        grad.addColorStop(1, bottomColor);

        ctx.fillStyle = grad;

        // Draw angled 3/4 asymmetrical wings
        ctx.save();
        ctx.translate(48, 48);

        // Near wing (larger, closer)
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(40, -20, 50, -40, 20, -45);
        ctx.bezierCurveTo(45, -10, 35, 20, 5, 25);
        ctx.closePath();
        ctx.fill();

        // Far wing (smaller, slightly darker)
        ctx.fillStyle = shadeColor(bottomColor, -20);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-30, -15, -35, -35, -10, -40);
        ctx.bezierCurveTo(-30, -5, -20, 15, 0, 20);
        ctx.closePath();
        ctx.fill();

        // Body
        ctx.fillStyle = "#333";
        ctx.beginPath();
        ctx.ellipse(0, 10, 4, 14, 0, 0, Math.PI * 2);
        ctx.fill();

        // Head
        ctx.beginPath();
        ctx.arc(0, -2, 4, 0, Math.PI * 2);
        ctx.fill();

        // Antennae
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -4);
        ctx.quadraticCurveTo(8, -16, 4, -22);
        ctx.moveTo(0, -4);
        ctx.quadraticCurveTo(-8, -16, -4, -22);
        ctx.stroke();

        ctx.restore();

        species.push(c);
    }

    return species;

    // Utility: darken a hex color
    function shadeColor(hex, percent) {
        const num = parseInt(hex.replace("#", ""), 16);
        const r = Math.max(0, Math.min(255, (num >> 16) + percent));
        const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + percent));
        const b = Math.max(0, Math.min(255, (num & 0x0000FF) + percent));
        return `rgb(${r},${g},${b})`;
    }
}

function celebrateMatchWin_canvasButterflies_v1() {

    const canvas = document.getElementById("starburst-canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = "fixed";
    canvas.style.left = "0";
    canvas.style.top = "0";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "999999";
    canvas.style.display = "block";

    let running = true;
    setTimeout(() => running = false, 9000);

    // ------------------------------------------------------------
    // 8 SPECIES — soft gradient placeholders (replace later)
    // ------------------------------------------------------------
    const speciesImages = createButterflySpeciesCanvases();

/*
    const speciesImages = [];

    const speciesBase64 = [
        // Species 1 — soft blue
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAA...",
        // Species 2 — pastel pink
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAA...",
        // Species 3 — lavender
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAA...",
        // Species 4 — soft yellow
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAA...",
        // Species 5 — mint green
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAA...",
        // Species 6 — sky blue
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAA...",
        // Species 7 — peach
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAA...",
        // Species 8 — violet
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAA..."
    ];

    for (let i = 0; i < speciesBase64.length; i++) {
        const img = new Image();
        img.src = speciesBase64[i];
        speciesImages.push(img);
    }
*/
    
    // ------------------------------------------------------------
    // BUTTERFLY CREATION
    // ------------------------------------------------------------
    const butterflies = [];
    const count = 80;

    function makeButterfly() {
        const sp = Math.floor(Math.random() * speciesImages.length);

        return {
            species: sp,
            img: speciesImages[sp],

            x: Math.random() * canvas.width,
            y: canvas.height + Math.random() * 200,

            vx: (Math.random() - 0.5) * 1,
            vy: -1 - Math.random() * 1.5,

            flap: Math.random() * Math.PI * 2,
            flapSpeed: 0.15 + Math.random() * 0.1,

            rot: (Math.random() - 0.5) * 0.2,

            size: 40 + Math.random() * 40,
            depth: 0.4 + Math.random() * 0.6,

            flutterTime: 0,
            hoverTime: 0
        };
    }

    for (let i = 0; i < count; i++) {
        butterflies.push(makeButterfly());
    }

    // ------------------------------------------------------------
    // DRAW BUTTERFLY (angled 3/4 asymmetrical)
    // ------------------------------------------------------------
    function drawButterfly(b) {
        const s = b.size * b.depth;

        const flapScale = 1 + Math.sin(b.flap) * 0.25;
        const tilt = Math.sin(b.flap * 0.5) * 0.15;

        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.rot + tilt);
        ctx.scale(flapScale, 1);

        ctx.drawImage(b.img, -s / 2, -s / 2, s, s);

        ctx.restore();
    }

    // ------------------------------------------------------------
    // UPDATE MOTION
    // ------------------------------------------------------------
    function updateButterfly(b) {

        b.flap += b.flapSpeed;

        // S-curve drifting
        b.x += Math.sin(b.flap * 0.3) * 1.2 * b.depth;

        // Vertical bobbing
        b.y += b.vy + Math.sin(b.flap * 0.2) * 0.5;

        // Occasional flutter bursts
        if (b.flutterTime > 0) {
            b.flutterTime--;
            b.x += (Math.random() - 0.5) * 4;
            b.y += (Math.random() - 0.5) * 4;
        } else if (Math.random() < 0.005) {
            b.flutterTime = 10 + Math.random() * 10;
        }

        // Hover pauses
        if (b.hoverTime > 0) {
            b.hoverTime--;
            return;
        } else if (Math.random() < 0.002) {
            b.hoverTime = 20 + Math.random() * 20;
        }

        // Drift
        b.x += b.vx * b.depth;
        b.y += b.vy * b.depth;

        // Respawn if off-screen
        if (b.y < -200 || b.x < -200 || b.x > canvas.width + 200) {
            const idx = butterflies.indexOf(b);
            butterflies[idx] = makeButterfly();
        }
    }

    // ------------------------------------------------------------
    // MAIN LOOP
    // ------------------------------------------------------------
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let alive = false;

        for (const b of butterflies) {
            alive = true;
            updateButterfly(b);
            drawButterfly(b);
        }

        if (!alive && !running) {
            canvas.style.display = "none";
            return;
        }

        requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
}
