export const GravEngine = {
    canvas: null,
    ctx: null,

    line: {
        color: 'hsl(180, 100%, 60%)',
        width: 3,
        amplitude: 250,
        segments: 21
    },

    linePoints: [],
    boxes: [],
    balls: [],

    init(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.generateLine();
        this.createBoxes();
    },

    // -------- LINE GENERATION ----------
    generateLine() {
    const segmentWidth = this.canvas.width / this.line.segments;
    this.linePoints = [];
    for (let i = 0; i <= this.line.segments; i++) {
        const x = i * segmentWidth;
        const y = (this.canvas.height / 2) + (Math.random() - 0.5) * this.line.amplitude;
        this.linePoints.push({ x, y });
    }
},

    getLineY(targetX) {
        const { linePoints, canvas, line } = this;
        if (linePoints.length === 0) return canvas.height;

        const segmentWidth = canvas.width / line.segments;
        const segmentIndex = Math.floor(targetX / segmentWidth);
        
        const p1 = linePoints[segmentIndex];
        const p2 = linePoints[segmentIndex + 1];

        if (!p1 || !p2) return p1 ? p1.y : canvas.height;

        const t = (targetX - p1.x) / (p2.x - p1.x);
        return p1.y + (p2.y - p1.y) * t;
    },

    // -------- BOXES ----------
    createBoxes() {
    this.boxes = []; // clear first
    this.boxes.push(
        { x: this.canvas.width * 0.3, y: -50, width: 30, height: 30, color: 'red', isFalling: true, velocityY: 3 },
        { x: this.canvas.width * 0.7, y: -100, width: 25, height: 25, color: 'blue', isFalling: true, velocityY: 4 }
    );
},

    teleportBox(box) {
        const canvas = this.canvas;
        const angle = Math.random() * (5 * Math.PI / 6 - Math.PI / 6) + Math.PI / 6;
        const distance = Math.random() * (300 - 100) + 100;

        let dx = Math.cos(angle) * distance;
        let dy = Math.sin(angle) * distance;

        let newX = box.x + dx;
        let newY = box.y - dy;

        const mid = canvas.width / 2;

        if (box.x < mid) {
            if (newX + box.width > mid) newX = mid - box.width;
            if (newX < 0) newX = 0;
        } else {
            if (newX < mid) newX = mid;
            if (newX + box.width > canvas.width) newX = canvas.width - box.width;
        }

        if (newY < 0) newY = 0;

        box.x = newX;
        box.y = newY;
        box.isFalling = true;
    },

    // -------- PROJECTILES --------
    spawnProjectile(x, y, speedX, speedY, shooter = null, radius = 5, color = 'yellow', damage = 3) {
    this.balls.push({
        x, y,
        radius,
        color,
        speedX,
        speedY,
        gravity: 0.1,
        shooter,
        damage // store damage here for game.js to use
    });
},

    // -------- UPDATE ----------
    // -------- UPDATE ----------
update() {
    // Boxes fall + hit terrain
    for (const box of this.boxes) {
        if (box.isFalling) {
            box.y += box.velocityY;

            const bottom = box.y + box.height;
            const leftY = this.getLineY(box.x);
            const centerY = this.getLineY(box.x + box.width / 2);
            const rightY = this.getLineY(box.x + box.width);

            if (bottom >= leftY || bottom >= centerY || bottom >= rightY) {
                box.isFalling = false;
                const ground = Math.min(leftY, centerY, rightY);
                box.y = ground - box.height;
            }
        }
    }

    // Balls arc + terrain collision only
    for (let i = this.balls.length - 1; i >= 0; i--) {
        const b = this.balls[i];
        b.speedY += b.gravity;

        b.x += b.speedX;
        b.y += b.speedY;

        // Remove if hits terrain
        if (b.y + b.radius >= this.getLineY(b.x)) {
            this.balls.splice(i, 1);
            continue;
        }

        // --- Remove this: ball vs box collision ---
        // GravEngine no longer handles tank collisions
    }
},

    // -------- DRAW ----------
    draw() {
        const ctx = this.ctx;

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Line terrain
        ctx.lineWidth = this.line.width;
        ctx.strokeStyle = this.line.color;
        ctx.beginPath();
        ctx.moveTo(this.linePoints[0].x, this.linePoints[0].y);

        for (let i = 1; i < this.linePoints.length; i++) {
            ctx.lineTo(this.linePoints[i].x, this.linePoints[i].y);
        }
        ctx.stroke();

        // Boxes
        for (const box of this.boxes) {
            ctx.fillStyle = box.color;
            ctx.fillRect(box.x, box.y, box.width, box.height);
        }

        // Balls
        for (const b of this.balls) {
            ctx.fillStyle = b.color;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
};