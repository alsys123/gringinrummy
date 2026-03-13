


async function celebrateMatchWin_iPad_starburstLoop() {

    //    celebrateMatchWin_canvasStarburst_v7(); // this one is good, as well!!

    celebrateMatchWin_fireworks();
    
//    for (let i = 0; i < 3; i++) {
//	celebrateMatchWin_iPad_starburst_v2();
//    celebrateMatchWin_canvasStarburst_v4(); // works
//    celebrateMatchWin_canvasStarburst_v5(); // stars shooting out
//	await sleep(2000);
//	
//    }

    
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
    setTimeout(() => {
        running = false;
    }, 10000); // was 5000

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
    setTimeout(() => running = false, 15000); // was 6000

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

