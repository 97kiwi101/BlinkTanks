// --- 1. SETUP ---
const canvas = document.getElementById('wiggilyCanvas');
const ctx = canvas.getContext('2d'); // 'ctx' is the drawing "pen"

// --- 2. GLOBAL SETTINGS ---
const line = {
    color: 'hsl(180, 100%, 60%)',
    width: 3,
    amplitude: 250, 
    segments: 21
};

let linePoints = [];
let boxes = [];
let balls = [];


// --- 3. HELPER FUNCTION: GET LINE Y at a specific X ---
function getLineY(targetX) {
    if (linePoints.length === 0) {
        return canvas.height;
    }
    const segmentWidth = canvas.width / line.segments;
    const segmentIndex = Math.floor(targetX / segmentWidth);

    if (!linePoints[segmentIndex] || !linePoints[segmentIndex + 1]) {
        return linePoints[segmentIndex] ? linePoints[segmentIndex].y : canvas.height;
    }
    
    const p1 = linePoints[segmentIndex];
    const p2 = linePoints[segmentIndex + 1];
    const t = (targetX - p1.x) / (p2.x - p1.x);
    
    if (isNaN(t)) {
        return p1.y;
    }
    return p1.y + (p2.y - p1.y) * t;
}


// --- 4. GAME LOGIC FUNCTIONS ---

function generateLine() {
    linePoints = []; 
    const segmentWidth = canvas.width / line.segments;
    
    for (let i = 0; i <= line.segments; i++) {
        const x = i * segmentWidth;
        const y = (canvas.height / 2) + (Math.random() - 0.5) * line.amplitude;
        linePoints.push({ x: x, y: y });
    }
}

function createBoxes() {
    boxes = []; 
    
    const box1 = {
        x: canvas.width * 0.3,
        y: -50,
        width: 30,
        height: 30,
        color: 'hsl(0, 100%, 60%)',
        isFalling: true,
        velocityY: 3
    };

    const box2 = {
        x: canvas.width * 0.7,
        y: -100,
        width: 25,
        height: 25,
        color: 'hsl(220, 100%, 60%)',
        isFalling: true,
        velocityY: 4
    };

    boxes.push(box1, box2);
}

function teleportBox(box) {
    const minAngle = Math.PI / 6;
    const maxAngle = 5 * Math.PI / 6;
    const randomAngle = Math.random() * (maxAngle - minAngle) + minAngle;

    const minDistance = 100;
    const maxDistance = 300;
    const randomDistance = Math.random() * (maxDistance - minDistance) + minDistance;

    const dx = Math.cos(randomAngle) * randomDistance;
    const dy = Math.sin(randomAngle) * randomDistance;

    let newX = box.x + dx;
    let newY = box.y - dy;

    // Boundary check
    const middleX = canvas.width / 2;
    if (box.x < middleX) {
        if (newX + box.width > middleX) newX = middleX - box.width;
        if (newX < 0) newX = 0;
    } else { 
        if (newX < middleX) newX = middleX;
        if (newX + box.width > canvas.width) newX = canvas.width - box.width;
    }
    if (newY < 0) newY = 0;

    box.x = newX;
    box.y = newY;
    box.isFalling = true;
}

/**
 * **UPDATED FUNCTION**
 * Creates a ball at the mouse's click position with a CONSISTENT arc
 */
function createBall(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // --- NEW: Determine consistent speed based on click side ---
    const middleX = canvas.width / 2;
    let initialSpeedX;

    if (mouseX < middleX) {
        // Clicked on the left, fire right
        initialSpeedX = 3;
    } else {
        // Clicked on the right, fire left
        initialSpeedX = -3;
    }

    const newBall = {
        x: mouseX,
        y: mouseY,
        radius: 5,
        color: 'hsl(60, 100%, 75%)', // Bright yellow
        
        // --- NEW: Use consistent speeds, not random ---
        speedX: initialSpeedX,
        speedY: -6,  // Always fire with a strong upward speed
        gravity: 0.1 // The force of gravity
    };
    
    balls.push(newBall);
}


/**
 * Updates the state (position, velocity) of all game objects
 */
function update() {
    // --- 1. Update Boxes ---
    for (const box of boxes) {
        if (box.isFalling) {
            box.y += box.velocityY;

            // --- Box-to-Line Collision ---
            const boxBottom = box.y + box.height;
            const leftX = box.x;
            const centerX = box.x + box.width / 2;
            const rightX = box.x + box.width;

            const lineY_Left = getLineY(leftX);
            const lineY_Center = getLineY(centerX);
            const lineY_Right = getLineY(rightX);

            if (boxBottom >= lineY_Left || boxBottom >= lineY_Center || boxBottom >= lineY_Right) {
                box.isFalling = false;
                const stickyY = Math.min(lineY_Left, lineY_Center, lineY_Right);
                box.y = stickyY - box.height; 
            }
        }
    }

    // --- 2. Update Balls (UPDATED) ---
    for (let i = balls.length - 1; i >= 0; i--) {
        const ball = balls[i];
        
        // --- Apply Arc Physics ---
        // 1. Apply gravity to the vertical speed
        ball.speedY += ball.gravity; 
        
        // 2. Update position based on new speeds
        ball.x += ball.speedX;
        ball.y += ball.speedY;

        // --- Ball-to-Line Collision (Disappear) ---
        const lineY = getLineY(ball.x);
        // Check the bottom of the ball
        if (ball.y + ball.radius >= lineY) {
            balls.splice(i, 1); // Remove the ball
            continue; // Skip to the next ball
        }

        // --- Ball-to-Box Collision (Teleport) ---
        for (const box of boxes) {
            // Check if the ball's center is inside the box
            if (ball.x > box.x && 
                ball.x < box.x + box.width && 
                ball.y > box.y && 
                ball.y < box.y + box.height) 
            {
                teleportBox(box);   // Teleport the box
                balls.splice(i, 1); // Remove the ball
                break; // Stop checking this ball against other boxes
            }
        }
    }
}

/**
 * Clears the canvas and draws all game objects
 */
function draw() {
    // A. Clear the whole canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // B. Draw the line (using only lineTo for 100% accuracy)
    ctx.lineWidth = line.width;
    ctx.strokeStyle = line.color;
    ctx.beginPath();
    ctx.moveTo(linePoints[0].x, linePoints[0].y);
    for (let i = 1; i < linePoints.length; i++) {
        ctx.lineTo(linePoints[i].x, linePoints[i].y);
    }
    ctx.stroke();

    // C. Draw the boxes
    for (const box of boxes) {
        ctx.fillStyle = box.color;
        ctx.fillRect(box.x, box.y, box.width, box.height);
    }
    
    // D. Draw the balls
    for (const ball of balls) {
        ctx.fillStyle = ball.color;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}


// --- 5. MAIN ANIMATION LOOP ---
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// --- 6. RESIZE HANDLER ---
function onResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    generateLine(); 
    createBoxes();
    balls = []; // Clear balls on resize
}

// --- 7. START EVERYTHING ---
window.addEventListener('resize', onResize);
canvas.addEventListener('mousedown', createBall);
onResize();
gameLoop();