import { GravEngine } from './grav.js';
import { Tank } from './tank.js';
import { shoot } from './combat.js';
import { TurnManager } from './turnManager.js';

// --- Canvas Setup ---
const canvas = document.getElementById('wiggilyCanvas');
const ctx = canvas.getContext('2d');

// --- Initialize GravEngine ---
GravEngine.init(canvas);

// --- Helper to spawn tanks at the top ---
function getSpawnY() {
    return 50; // spawn 50px from top
}

// --- Create Tanks ---
const tanks = [
    new Tank("P1", canvas.width * 0.3, getSpawnY(), "green", 40, 40, 10, "basic"),
    new Tank("P2", canvas.width * 0.7, getSpawnY(), "purple", 40, 40, 10, "basic")
];

// --- Map tanks to GravEngine boxes ---
GravEngine.boxes = tanks.map(tank => ({
    x: tank.getX(),
    y: tank.getY(),
    width: tank.getWidth(),
    height: tank.getHeight(),
    color: tank.getColor(),
    isFalling: true,
    velocityY: 3,       
    tankRef: tank
}));

// --- Register players ---
TurnManager.registerPlayers("P1", "P2", {
    P1: tanks[0],
    P2: tanks[1]
});

// --- Mouse Drag Shooting ---
let isDragging = false;
let dragStart = { x: 0, y: 0 };

canvas.addEventListener('mousedown', (e) => {
    if (!TurnManager.isTurn(TurnManager.currentPlayer)) return;
    isDragging = true;

    const tank = TurnManager.tanks[TurnManager.currentPlayer];
    const box = GravEngine.boxes.find(b => b.tankRef === tank);
    if (!box || box.isFalling) return;

    // Start drag from the tank center
    dragStart.x = box.x + box.width / 2;
    dragStart.y = box.y + box.height / 2;
});

canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
        draw();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(dragStart.x, dragStart.y);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    }
});

canvas.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    isDragging = false;

    const tank = TurnManager.tanks[TurnManager.currentPlayer];
    const box = GravEngine.boxes.find(b => b.tankRef === tank);
    if (!box || box.isFalling) return;

    // Compute distance between mouse and tank center
    const dx = e.offsetX - dragStart.x;
    const dy = e.offsetY - dragStart.y;
    const distance = Math.sqrt(dx*dx + dy*dy);

    // Scale distance to velocity
    const maxPower = 10; // max projectile speed
    const power = Math.min(distance / 10, maxPower); 

    const angle = Math.atan2(dy, dx);

    const speedX = power * Math.cos(angle);
    const speedY = power * Math.sin(angle);

    // Spawn projectile
    GravEngine.spawnProjectile(
        dragStart.x,
        dragStart.y,
        speedX,
        speedY,
        tank
    );

    TurnManager.nextTurn();
});

// --- Resize Handler ---
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    GravEngine.generateLine();

    // Reposition tanks proportionally at top
    tanks.forEach(tank => {
        tank.x = tank.id === "P1" ? canvas.width * 0.3 : canvas.width * 0.7;
        tank.y = getSpawnY();
    });

    // Update GravEngine boxes
    GravEngine.boxes.forEach(box => {
        const tank = box.tankRef;
        box.x = tank.getX();
        box.y = tank.getY();
        box.isFalling = true;
        box.velocityY = 3;
    });
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// --- Update Loop ---
function update() {
    GravEngine.update();

    // Balls vs tanks
    for (let i = GravEngine.balls.length - 1; i >= 0; i--) {
        const b = GravEngine.balls[i];

        for (const box of GravEngine.boxes) {
            const tank = box.tankRef;

            // Ignore collisions with shooter
            if (tank === b.shooter) continue;

            if (
                b.x > box.x && b.x < box.x + box.width &&
                b.y > box.y && b.y < box.y + box.height &&
                tank.isAlive
            ) {
                // Damage the tank
                shoot(b.shooter, tank);

                // Teleport the tank
                GravEngine.teleportBox(box);
                box.velocityY = 3; // fall after teleport

                GravEngine.balls.splice(i, 1);
                break;
            }
        }
    }

    // Sync GravEngine box positions with tank objects
    GravEngine.boxes.forEach(box => {
        const tank = box.tankRef;
        tank.x = box.x;
        tank.y = box.y;
    });
}

// --- Draw Loop ---
function draw() {
    GravEngine.draw();

    // Draw HP above tanks
    GravEngine.boxes.forEach(box => {
        const tank = box.tankRef;
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.fillText(`HP: ${tank.getHP()}`, tank.getX(), tank.getY() - 5);
    });
}

// --- Main Loop ---
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();