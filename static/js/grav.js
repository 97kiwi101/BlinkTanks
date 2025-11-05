const gravity = 0.1

let bulletWidth = 30
let bulletHeight = 30
let bulletColor = "red"
let bulletX = 100
let bulletY = 100
let bulletSpeedX = 0;
let bulletSpeedY = 0;

let myGamePiece;



function startGame() {
    myGameArea.start();
    myGamePiece = new component(bulletWidth, bulletHeight, bulletColor, bulletX,bulletY,bulletSpeedX,bulletSpeedY );
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);        
    },
    stop : function() {
        clearInterval(this.interval);
    },    
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y, speedX,speedY) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;    
    this.speedX = speedX;
    this.speedY = speedY;    
    this.gravity = 0.05;
    this.gravitySpeed = 0;
    this.update = function() {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;        
    }
}

function updateGameArea() {
    myGameArea.clear();
    myGamePiece.newPos();
    myGamePiece.update();
}