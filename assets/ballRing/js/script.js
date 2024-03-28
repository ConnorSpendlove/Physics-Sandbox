import { playRandomNote } from './audio2.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const hideControlsButton = document.getElementById('hideControlsButton');
const hideButton = document.getElementById('hide-button')
const backButton = document.getElementById('back-button');
const resetButton = document.getElementById('reset');// Reference to the start button

resetButton.addEventListener('click', function() {
    location.reload(); // Reload the page
});

hideControlsButton.addEventListener('click', function(){
    hideButton.classList.toggle('hide');
    backButton.classList.toggle('hide');
});

let ringRadius = 150;
let ballRadius = 20;
const gravity = 0.2;
let animationRunning = false; // Flag to control animation state

const speedIncreaseFactor = 0.05; // Speed increase factor per bounce
const sizeIncreaseAmount = 0.5; // Radius increase amount per bounce

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    vx: 5, // initial velocity
    vy: 2
};

let hitPoints = []; // Store hit points

let speedUpChecked = false; // Flag to determine if speed increase checkbox is checked

document.getElementById('speedUp').addEventListener('change', function() {
    speedUpChecked = this.checked;
});

document.getElementById('sizeUp').addEventListener('change', function() {
    sizeUpChecked = this.checked;
});

document.getElementById('startButton').addEventListener('click', function() {
    if (!animationRunning) {
        animationRunning = true;
        update();
    }
});

function drawRing() {
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, ringRadius, 0, Math.PI * 2);
    ctx.strokeStyle = 'white';
    ctx.stroke();
    ctx.closePath();
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.closePath();
}

function drawLines() {
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    hitPoints.forEach(point => {
        ctx.moveTo(ball.x, ball.y);
        ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();
}

function update() {
    // Apply gravity
    ball.vy += gravity;
    
    // Calculate next position
    const nextX = ball.x + ball.vx;
    const nextY = ball.y + ball.vy;
    
    // Check if the next position would be inside the ring
    const dx = nextX - canvas.width / 2;
    const dy = nextY - canvas.height / 2;
    const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);
    if (distanceFromCenter + ballRadius >= ringRadius) {
        // If the ball would penetrate the ring, adjust its position
        const normalX = dx / distanceFromCenter;
        const normalY = dy / distanceFromCenter;
        const dot = ball.vx * normalX + ball.vy * normalY;
        ball.vx -= 2 * dot * normalX;
        ball.vy -= 2 * dot * normalY;
        ball.x = canvas.width / 2 + normalX * (ringRadius - ballRadius);
        ball.y = canvas.height / 2 + normalY * (ringRadius - ballRadius);
        
        // Store hit point
        hitPoints.push({ x: ball.x + normalX * ballRadius, y: ball.y + normalY * ballRadius });
        
        // Increase ball speed only if the checkbox is checked
        if (speedUpChecked) {
            ball.vx *= (1 + speedIncreaseFactor);
            ball.vy *= (1 + speedIncreaseFactor);
        }
        
        // Increase ball size
        ballRadius += sizeIncreaseAmount;

        // Play random note
        playRandomNote();
    } else {
        // If the next position is safe, update ball position
        ball.x = nextX;
        ball.y = nextY;
    }
    
    // Draw everything
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRing();
    drawLines();
    drawBall();
    
    if (animationRunning) {
        requestAnimationFrame(update);
    }
}

// Start animation when the page loads
update();
