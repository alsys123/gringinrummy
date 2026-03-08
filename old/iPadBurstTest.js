function celebrateMatchWin_canvasStarburst() {
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
}
