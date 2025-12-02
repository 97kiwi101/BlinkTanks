import { GravEngine } from './grav.js';
import { Tank } from './tank.js';
import { shoot } from './combat.js';
import { TurnManager } from './turnManager.js';
import { scoreboard } from "./scoreboard.js";

// --- Canvas Setup ---
const canvas = document.getElementById('wiggilyCanvas');
const ctx = canvas.getContext('2d');

// --- Initialize GravEngine ---
GravEngine.init(canvas);

// --- Spawn Tanks ---
const SpawnY = 50;
const tanks = [
    new Tank("P1", canvas.width * 0.3, SpawnY, "green", 40, 40, 10, "basic"),
    new Tank("P2", canvas.width * 0.7, SpawnY, "purple", 40, 40, 10, "basic")
];

let gameEnded = false;

// Map tanks to GravEngine boxes
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
    P1: { tank: tanks[0], cpu: false },
    P2: { tank: tanks[1], cpu: true }
});

// --- Ammo Selection UI ---
let selectedAmmo = 'basic';
const ammoContainer = document.createElement('div');
ammoContainer.style.position = 'absolute';
ammoContainer.style.top = '10px';
ammoContainer.style.left = '10px';
document.body.appendChild(ammoContainer);

['basic', 'triple', 'sniper'].forEach(ammo => {
    const btn = document.createElement('button');
    btn.innerText = ammo;
    btn.style.marginRight = '5px';
    btn.onclick = () => {
        selectedAmmo = ammo;
        const currentTank = TurnManager.tanks[TurnManager.currentPlayer].tank;
        currentTank.switchAmmo(ammo);
    };
    ammoContainer.appendChild(btn);
});

// ---- Scoreboard UI Setup ----
const scoreEl = document.createElement('div');
scoreEl.style.position = 'absolute';
scoreEl.style.top = '10px';
scoreEl.style.right = '10px';
scoreEl.style.color = 'white';
scoreEl.style.fontFamily = 'Arial, sans-serif';
scoreEl.style.fontSize = '18px';
scoreEl.style.background = 'rgba(0,0,0,0.5)';
scoreEl.style.padding = '8px 14px';
scoreEl.style.borderRadius = '8px';
scoreEl.style.zIndex = '9999';
document.body.appendChild(scoreEl);

function updateScoreDisplay() {
    const s = scoreboard.getScores();
    scoreEl.textContent = `Player: ${s.player}  |  AI: ${s.ai}`;
}

// initial draw
updateScoreDisplay();

// --- Mouse Drag Shooting ---
let isDragging = false;
let dragStart = { x: 0, y: 0 };
let aimMouse = { x: 0, y: 0 };

canvas.addEventListener('mousedown', e => {
    const tank = TurnManager.tanks[TurnManager.currentPlayer].tank;
    const box = GravEngine.boxes.find(b => b.tankRef === tank);
    if (!TurnManager.isTurn(TurnManager.currentPlayer) || !box || box.isFalling) return;

    isDragging = true;
    dragStart.x = box.x + box.width / 2;
    dragStart.y = box.y + box.height / 2;

    const rect = canvas.getBoundingClientRect();
    aimMouse.x = e.clientX - rect.left;
    aimMouse.y = e.clientY - rect.top;
});

canvas.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const rect = canvas.getBoundingClientRect();
    aimMouse.x = e.clientX - rect.left;
    aimMouse.y = e.clientY - rect.top;
});

canvas.addEventListener('mouseup', e => {
    if (!isDragging) return;
    isDragging = false;

    const tank = TurnManager.tanks[TurnManager.currentPlayer].tank;
    const box = GravEngine.boxes.find(b => b.tankRef === tank);
    if (!box || box.isFalling) return;

    fireTankProjectile(box, tank);
    TurnManager.nextTurn();
});

// --- Fire Projectile based on ammo ---
function fireTankProjectile(box, tank) {
    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;

    const dx = aimMouse.x - startX;
    const dy = aimMouse.y - startY;
    const distance = Math.sqrt(dx*dx + dy*dy);
    const power = Math.min(distance / 8, 12);
    const angle = Math.atan2(dy, dx);
    const speedX = power * Math.cos(angle);
    const speedY = power * Math.sin(angle);

    let shots = [];
    let radius;

    switch (tank.getCurrentAmmo()) {
        case 'basic':
            radius = 10; // bigger ball
            shots.push({ vx: speedX, vy: speedY });
            break;
        case 'triple':
            radius = 5; // old basic size
            shots.push({ vx: speedX, vy: speedY });
            shots.push({ vx: speedX, vy: speedY * 0.95 });
            shots.push({ vx: speedX, vy: speedY * 1.05 });
            break;
        case 'sniper':
            radius = 3; // small for precision
            shots.push({ vx: speedX, vy: speedY });
            break;
    }

    for (const s of shots) {
        GravEngine.spawnProjectile(startX, startY, s.vx, s.vy, tank, radius, 'yellow', tank.damage);
    }
}

// --- Resize Handler ---
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    GravEngine.generateLine();
    tanks.forEach(tank => {
        tank.x = tank.id === "P1" ? canvas.width * 0.3 : canvas.width * 0.7;
        tank.y = SpawnY;
    });
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
    if (gameEnded) return;
    GravEngine.update();

    // Ball vs Tank collisions
    for (let i = GravEngine.balls.length - 1; i >= 0; i--) {
        const b = GravEngine.balls[i];
        for (const box of GravEngine.boxes) {
            const tank = box.tankRef;
            if (b.shooter && tank === b.shooter) continue;

            if (
                b.x > box.x && b.x < box.x + box.width &&
                b.y > box.y && b.y < box.y + box.height &&
                tank.isAlive
            ) {
                tank.takeDamage(b.damage);
                GravEngine.teleportBox(box);
                box.velocityY = 3;
                GravEngine.balls.splice(i, 1);
                break;
            }
        }
    }

    GravEngine.boxes.forEach(box => {
        const tank = box.tankRef;
        tank.x = box.x;
        tank.y = box.y;
    });

    if (checkWinCondition()) return;
}

// --- Draw ---
function drawWorld() {
    GravEngine.draw();
    GravEngine.boxes.forEach(box => {
        const tank = box.tankRef;
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.fillText(`HP: ${tank.getHP()}`, tank.getX(), tank.getY() - 5);
    });
}

function drawTrajectory(startX, startY, speedX, speedY) {
    let previewX = startX;
    let previewY = startY;
    let vx = speedX;
    let vy = speedY;

    ctx.strokeStyle = "rgba(255,255,255,0.7)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(previewX, previewY);

    for (let i = 0; i < 60; i++) {
        vx *= 0.995;
        vy += 0.1;
        previewX += vx;
        previewY += vy;
        ctx.lineTo(previewX, previewY);
    }
    ctx.stroke();
}

function draw() {
    if (gameEnded) return;
    drawWorld();

    if (isDragging) {
        const tank = TurnManager.tanks[TurnManager.currentPlayer].tank;
        const box = GravEngine.boxes.find(b => b.tankRef === tank);
        if (!box || box.isFalling) return;

        const tankX = box.x + box.width / 2;
        const tankY = box.y + box.height / 2;
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(tankX, tankY);
        ctx.lineTo(aimMouse.x, aimMouse.y);
        ctx.stroke();

        const dx = aimMouse.x - tankX;
        const dy = aimMouse.y - tankY;
        const distance = Math.sqrt(dx*dx + dy*dy);
        const power = Math.min(distance / 8, 12);
        const angle = Math.atan2(dy, dx);
        drawTrajectory(tankX, tankY, power * Math.cos(angle), power * Math.sin(angle));
    }
}

// --- CPU Logic ---
let cpuActedThisTurn = false;
function maybeRunCPU() {
    if (gameEnded) return;
    if (checkWinCondition()) return;

    const current = TurnManager.currentPlayer;
    const info = TurnManager.tanks[current];
    if (!info.cpu) {
        cpuActedThisTurn = false;
        return;
    }

    if (cpuActedThisTurn) return;
    const box = GravEngine.boxes.find(b => b.tankRef === info.tank);
    if (!box || box.isFalling || GravEngine.balls.length > 0) return; // wait for all balls

    cpuActedThisTurn = true;

    // Simple ammo choice for CPU (random)
    const ammoOptions = ['basic', 'triple', 'sniper'];
    const choice = ammoOptions[Math.floor(Math.random() * ammoOptions.length)];
    info.tank.switchAmmo(choice);

    setTimeout(() => fireTankProjectile(box, info.tank) || TurnManager.nextTurn(), 700);
}

// --- Win/Lose ---
function checkWinCondition() {
    if (gameEnded) return true;

    const p1 = TurnManager.tanks["P1"].tank;
    const p2 = TurnManager.tanks["P2"].tank;

    // If PLAYER dies → AI wins
    if (!p1.isAlive) { 
        gameEnded = true;
        scoreboard.addAIWin();        // FIXED (you previously awarded the player)
        updateScoreDisplay();
        return endGame("CPU Wins!");
    }

    // If CPU dies → Player wins
    if (!p2.isAlive) { 
        gameEnded = true;
        scoreboard.addPlayerWin();     // FIXED (you previously awarded the AI)
        updateScoreDisplay();
        return endGame("Player Wins!");
    }

    return false;
}

let gameLoopId;
function endGame(message) {
    cancelAnimationFrame(gameLoopId);

    GravEngine.balls = [];
    cpuActedThisTurn = true;

    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(canvas.width / 2 - 160, canvas.height / 2 - 40, 320, 80);

    ctx.fillStyle = 'white';
    ctx.font = '36px Arial';
    ctx.fillText(message, canvas.width / 2 - ctx.measureText(message).width / 2, canvas.height / 2 + 10);

    // Prevent duplicate buttons
    if (!document.getElementById("restartBtn")) {
        const restartBtn = document.createElement('button');
        restartBtn.id = "restartBtn";
        restartBtn.innerText = 'Restart';
        restartBtn.style.position = 'absolute';
        restartBtn.style.top = '100px';
        restartBtn.style.left = '50%';
        restartBtn.style.transform = 'translateX(-50%)';
        restartBtn.onclick = () => window.location.reload();
        document.body.appendChild(restartBtn);
    }

    return true;
}

// --- Main Loop ---
function gameLoop() {
    update();
    draw();
    maybeRunCPU();
    gameLoopId = requestAnimationFrame(gameLoop);
}

gameLoop();