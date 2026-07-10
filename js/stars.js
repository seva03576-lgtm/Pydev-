(() => {
    const canvas = document.getElementById("stars-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    let w = window.innerWidth;
    let h = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.scale(dpr, dpr);

    const mouse = {
        x: -9999,
        y: -9999
    };

    const stars = [];

    const STAR_COUNT = Math.min(120, Math.floor((w * h) / 12000));
    const LINK_DISTANCE = 130;

    class Star {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;

            this.vx = (Math.random() - 0.5) * 0.35;
            this.vy = (Math.random() - 0.5) * 0.35;

            this.r = Math.random() * 1.4 + 0.8;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > w) this.vx *= -1;
            if (this.y < 0 || this.y > h) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255,255,255,.9)";
            ctx.fill();
        }
    }

    function createStars() {
        stars.length = 0;

        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push(new Star());
        }
    }

    function drawLinks() {

        for (let i = 0; i < stars.length; i++) {

            for (let j = i + 1; j < stars.length; j++) {

                const dx = stars[i].x - stars[j].x;
                const dy = stars[i].y - stars[j].y;

                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < LINK_DISTANCE) {

                    ctx.beginPath();

                    ctx.strokeStyle =
                        `rgba(180,180,180,${0.18 - dist / LINK_DISTANCE * 0.18})`;

                    ctx.lineWidth = 1;

                    ctx.moveTo(stars[i].x, stars[i].y);
                    ctx.lineTo(stars[j].x, stars[j].y);

                    ctx.stroke();
                }
            }

            const dx = stars[i].x - mouse.x;
            const dy = stars[i].y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 170) {

                ctx.beginPath();

                ctx.strokeStyle =
                    `rgba(90,140,255,${0.35 - dist / 170 * 0.35})`;

                ctx.lineWidth = 1;

                ctx.moveTo(stars[i].x, stars[i].y);
                ctx.lineTo(mouse.x, mouse.y);

                ctx.stroke();
            }
        }
    }

    function animate() {

        ctx.clearRect(0, 0, w, h);

        for (const star of stars) {
            star.update();
            star.draw();
        }

        drawLinks();

        requestAnimationFrame(animate);
    }

    window.addEventListener("mousemove", e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener("touchmove", e => {

        if (e.touches.length) {
            mouse.x = e.touches[0].clientX;
            mouse.y = e.touches[0].clientY;
        }

    }, {
        passive: true
    });

    window.addEventListener("touchend", () => {
        mouse.x = -9999;
        mouse.y = -9999;
    });

    window.addEventListener("resize", () => {

        w = window.innerWidth;
        h = window.innerHeight;

        dpr = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = w * dpr;
        canvas.height = h * dpr;

        canvas.style.width = w + "px";
        canvas.style.height = h + "px";

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);

        createStars();

    });

    createStars();
    animate();

})();