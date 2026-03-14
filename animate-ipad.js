
// NOTE **** THIS IS USED for all displays incuding PC and MAC.

const CelebrationLength = 15000; // 15 seconds


function celebrateMatchWin() {

    log("celebrateMatchWin","player");

    const celebrationEffects = [
	celebrateMatchWin_canvasBalloons_v1,
	celebrateMatchWin_canvasBalloons_v2,
	celebrateMatchWin_canvasBalloons_v3,
	celebrateMatchWin_canvasStarburst_v7,
	celebrateMatchWin_fireworks,
	celebrateMatchWin_canvasButterflies_v3	
	//    celebrateMatchWin_canvasLightning_v1
    ];

    const randomIndex = Math.floor(Math.random() * celebrationEffects.length);

    celebrationEffects[randomIndex]();



    
}//celebrateMatchWin


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
    setTimeout(() => running = false, CelebrationLength);

    const speciesImages = [];

    const paths = [
	"images/butterflies/b1.png",
	"images/butterflies/b2.png",
	"images/butterflies/b3.png",
	"images/butterflies/b4.png",
	"images/butterflies/b5.png",
	"images/butterflies/b6.png",
	"images/butterflies/b7.png",
	"images/butterflies/b8.png",
	"images/butterflies/b9.png",
	"images/butterflies/b10.png",
	"images/butterflies/b11.png",
	"images/butterflies/b12.png",
	"images/butterflies/b13.png",
	"images/butterflies/b14.png"
    ];
    
for (const p of paths) {
    const img = new Image();
    img.src = p;
    speciesImages.push(img);
}

    
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

        if (!running) {
            canvas.style.display = "none";
            return;
        }

        requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
}

function celebrateMatchWin_canvasButterflies_v2() {

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
    setTimeout(() => running = false, CelebrationLength);

    // ------------------------------------------------------------
    // LOAD PNG SPECIES
    // ------------------------------------------------------------
    const speciesImages = [];
    const paths = [
        "images/butterflies/b1.png",
        "images/butterflies/b2.png",
        "images/butterflies/b3.png",
        "images/butterflies/b4.png",
        "images/butterflies/b5.png",
        "images/butterflies/b6.png",
        "images/butterflies/b7.png",
        "images/butterflies/b8.png",
        "images/butterflies/b9.png",
        "images/butterflies/b10.png",
        "images/butterflies/b11.png",
        "images/butterflies/b12.png",
        "images/butterflies/b13.png",
        "images/butterflies/b14.png",
        "images/butterflies/b15.png",
        "images/butterflies/b16.png",
        "images/butterflies/b17.png",
        "images/butterflies/b18.png",
        "images/butterflies/b19.png",
        "images/butterflies/b20.png"
    ];

    for (const p of paths) {
        const img = new Image();
        img.src = p;
        speciesImages.push(img);
    }

    // ------------------------------------------------------------
    // CREATE BUTTERFLIES
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
    // DRAW BUTTERFLY
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
    // UPDATE MOTION (with hover + landing)
    // ------------------------------------------------------------
    function updateButterfly(b) {

        // Wing flap
        b.flap += b.flapSpeed;

        // HOVER / LANDING BEHAVIOR
        if (b.hoverTime > 0) {
            b.hoverTime--;

            // Slow flapping while hovering
            b.flap += b.flapSpeed * 0.2;

            // Gentle bobbing
            b.y += Math.sin(b.flap * 0.3) * 0.2;

            return;
        } 
        else if (Math.random() < 0.004) {
            // Hover for 1–3 seconds
            b.hoverTime = 60 + Math.random() * 120;

            // 20% chance to "land" lower
            if (Math.random() < 0.2) {
                b.y = canvas.height - 150 + Math.random() * 80;
            }
        }

        // S-curve drifting
        b.x += Math.sin(b.flap * 0.3) * 1.2 * b.depth;

        // Vertical bobbing
        b.y += b.vy + Math.sin(b.flap * 0.2) * 0.5;

        // Flutter bursts
        if (b.flutterTime > 0) {
            b.flutterTime--;
            b.x += (Math.random() - 0.5) * 4;
            b.y += (Math.random() - 0.5) * 4;
        } 
        else if (Math.random() < 0.005) {
            b.flutterTime = 10 + Math.random() * 10;
        }

        // Drift
        b.x += b.vx * b.depth;
        b.y += b.vy * b.depth;

        // Respawn only if animation is still running
        if (running && (b.y < -200 || b.x < -200 || b.x > canvas.width + 200)) {
            const idx = butterflies.indexOf(b);
            butterflies[idx] = makeButterfly();
        }
    }

    // ------------------------------------------------------------
    // MAIN LOOP
    // ------------------------------------------------------------
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (const b of butterflies) {
            updateButterfly(b);
            drawButterfly(b);
        }

        // STOP CONDITION
        if (!running) {
            canvas.style.display = "none";
            return;
        }

        requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
}

function celebrateMatchWin_canvasButterflies_v3() {

    const canvas = document.getElementById("starburst-canvas");
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
canvas.width = canvas.width;   // full internal reset

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = "fixed";
    canvas.style.left = "0";
    canvas.style.top = "0";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "999999";
    canvas.style.display = "block";

    let running = true;
    let fadeOut = false;
    let fadeOutStart = null;

    const edgeMarginOnFade = 150;
    const edgeMargin        = 50;

    // CelebrationLength is defined outside this function
    setTimeout(() => {
        running = false;
        fadeOut = true;
    }, CelebrationLength);
//    }, 30000);

    let allowRespawn = true;
    setTimeout(() => allowRespawn = false, CelebrationLength * 0.5); // stop halfway
//    setTimeout(() => allowRespawn = false, CelebrationLength * 0.1); 
//    setTimeout(() => allowRespawn = false, 2000); 

    // ------------------------------------------------------------
    // LOAD PNG SPECIES
    // ------------------------------------------------------------
    const speciesImages = [];
    const paths = [
        "images/butterflies/b1.png",
        "images/butterflies/b2.png",
        "images/butterflies/b3.png",
        "images/butterflies/b4.png",
        "images/butterflies/b5.png",
        "images/butterflies/b6.png",
        "images/butterflies/b7.png",
        "images/butterflies/b8.png",
        "images/butterflies/b9.png",
        "images/butterflies/b10.png",
        "images/butterflies/b11.png",
        "images/butterflies/b12.png",
        "images/butterflies/b13.png",
        "images/butterflies/b14.png",
	"images/butterflies/b15.png",
        "images/butterflies/b16.png",
        "images/butterflies/b17.png",
        "images/butterflies/b18.png",
        "images/butterflies/b19.png",
        "images/butterflies/b20.png"
    ];

    for (const p of paths) {
        const img = new Image();
        img.src = p;
        speciesImages.push(img);
    }

    // ------------------------------------------------------------
    // CREATE BUTTERFLIES
    // ------------------------------------------------------------

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
    }//makeButterfly v1

    const butterflies = [];
    const count = 80; // was 80;

    // one time call to create the initial butterflies
    for (let i = 0; i < count; i++) {
        butterflies.push(makeButterfly());
    }

    // ------------------------------------------------------------
    // DRAW BUTTERFLY
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
    // UPDATE MOTION (with hover + fade-out)
    // ------------------------------------------------------------
    function updateButterfly(b) {

	
	// Fade-out: butterflies fly upward and leave the screen
if (fadeOut) {

    // Disable hover and flutter
    b.hoverTime = 0;
    b.flutterTime = 0;

    b.flap += b.flapSpeed;   // keep wings flapping

    // Decide escape direction
    if (b.x < edgeMarginOnFade) {
        // Flutter LEFT
        b.vx = -3 - Math.random() * 2;
        b.x += b.vx;
        b.y -= 1 + Math.random() * 1;   // slight upward drift
    }
    else if (b.x > canvas.width - edgeMargin) {
        // Flutter RIGHT
        b.vx = 3 + Math.random() * 2;
        b.x += b.vx;
        b.y -= 1 + Math.random() * 1;
    }
    else {
        // Flutter UP
        b.vy = -2 - Math.random() * 2;
        b.y += b.vy;
        b.x += (Math.random() - 0.5) * 4;  // sideways flutter
    }
	
    // Remove butterfly only when it leaves the screen
    if (b.y < -200 || b.x < -200 || b.x > canvas.width + 200) {
        const idx = butterflies.indexOf(b);
        butterflies.splice(idx, 1);

        return;
    }

    return; // IMPORTANT: skip normal movement + respawn
}//fadeOut

        // Wing flap
        b.flap += b.flapSpeed;

        // Hover / landing behavior
        if (b.hoverTime > 0) {
            b.hoverTime--;

            b.flap += b.flapSpeed * 0.2; // slow flap
            b.y += Math.sin(b.flap * 0.3) * 0.2; // gentle bob

            return;
        } 
        else if (!fadeOut && Math.random() < 0.004) {
            b.hoverTime = 60 + Math.random() * 120; // 1–3 seconds

            if (Math.random() < 0.2) {
                b.y = canvas.height - 150 + Math.random() * 80; // landing
            }
        }

        // S-curve drifting
        b.x += Math.sin(b.flap * 0.3) * 1.2 * b.depth;

        // Vertical bobbing
        b.y += b.vy + Math.sin(b.flap * 0.2) * 0.5;

        // Flutter bursts
        if (b.flutterTime > 0) {
            b.flutterTime--;
            b.x += (Math.random() - 0.5) * 4;
            b.y += (Math.random() - 0.5) * 4;
        } 
        else if (!fadeOut && Math.random() < 0.005) {
            b.flutterTime = 10 + Math.random() * 10;
        }

        // Drift
        b.x += b.vx * b.depth;
        b.y += b.vy * b.depth;

	// nudge them left or right so they exit tht way
	if (!fadeOut) {    
	    // Encourage sideways exit if near edges
	    if (b.x < edgeMargin) {
		b.vx -= 0.2;   // drift left
	    }
	    else if (b.x > canvas.width - edgeMargin) {
		b.vx += 0.2;   // drift right
	    }
	}
	
        // Respawn only while running
        if (allowRespawn && !fadeOut &&
	    (b.y < -200 || b.x < -200 || b.x > canvas.width + 200)) {

            const idx = butterflies.indexOf(b);
            butterflies[idx] = makeButterfly();

            }
	
    }

    // ------------------------------------------------------------
    // MAIN LOOP
    // ------------------------------------------------------------
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (const b of butterflies) {
            updateButterfly(b);
            drawButterfly(b);
        }

	
        // End when all butterflies are gone
        if (fadeOut && butterflies.length === 0) {

//	    log("All butterflies are gone","sys");
	    
	    ctx.clearRect(0, 0, canvas.width, canvas.height);
	    canvas.width = canvas.width;   // full internal reset
            canvas.style.display = "none";
            return;
        }

	
        requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
}
