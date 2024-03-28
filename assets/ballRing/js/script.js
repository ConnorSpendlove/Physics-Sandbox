import { playRandomNote } from './audio2.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const hideControlsButton = document.getElementById('hideControlsButton');
const hideButton = document.getElementById('hide-button');
const backButton = document.getElementById('back-button');
const resetButton = document.getElementById('reset'); // Reference to the start button
const ballColorInput = document.getElementById('ball-color');
const lineColorInput = document.getElementById('line-color');
const rainbowBallCheckbox = document.getElementById('rainbowBall');
const rainbowLinesCheckbox = document.getElementById('rainbowLines');

resetButton.addEventListener('click', function() {
    location.reload(); // Reload the page
});

hideControlsButton.addEventListener('click', function() {
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
let sizeUpChecked = false; // Flag to determine if size increase checkbox is checked
let rainbowBallChecked = false; // Flag to determine if rainbow ball checkbox is checked
let rainbowLinesChecked = false; // Flag to determine if rainbow lines checkbox is checked

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

let rainbowBallInterval; // Interval for updating rainbow ball color
let rainbowLinesInterval; // Interval for updating rainbow lines color
let hue = 0; // Initial hue value

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
    if (rainbowBallChecked) {
        // Update hue value gradually to cycle through the colors of the rainbow
        hue = (hue + 1) % 360; // Increment hue value by 1 (360 degrees in the color wheel)
        const color = `hsl(${hue}, 100%, 50%)`; // Use HSL color model with varying hue
        ctx.fillStyle = color;
    } else {
        ctx.fillStyle = ballColorInput.value;
    }
    ctx.fill();
    ctx.closePath();
}
let hueLines = 0; // Initial hue value for lines
function drawLines() {
    if (rainbowLinesChecked) {
        hueLines = (hueLines + 1) % 360; // Increment hue value for lines
        const color = `hsl(${hueLines}, 100%, 50%)`; // Use HSL color model with varying hue
        ctx.strokeStyle = color;
    } else {
        ctx.strokeStyle = lineColorInput.value;
    }
    
    ctx.beginPath();
    hitPoints.forEach(point => {
        ctx.moveTo(ball.x, ball.y);
        ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();
}

function startRainbowEffect() {
    rainbowBallInterval = setInterval(() => {
        drawBall();
    }, 100); // Update ball color every 100 milliseconds

    rainbowLinesInterval = setInterval(() => {
        drawLines();
    }, 100); // Update lines color every 100 milliseconds
}

function stopRainbowEffect() {
    clearInterval(rainbowBallInterval);
    clearInterval(rainbowLinesInterval);
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

        // Increase ball speed
        if (speedUpChecked) {
            ball.vx *= (1 + speedIncreaseFactor);
            ball.vy *= (1 + speedIncreaseFactor);
        }

        // Increase ball size
        if (sizeUpChecked) {
            ballRadius += sizeIncreaseAmount;
        }

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

// Start rainbow effect when the rainbow checkboxes are checked
rainbowBallCheckbox.addEventListener('change', function() {
    rainbowBallChecked = this.checked;
    ballColorInput.disabled = this.checked; // Disable ball color input if rainbow ball is checked
    if (this.checked) {
        startRainbowEffect();
    } else {
        stopRainbowEffect();
    }
});

rainbowLinesCheckbox.addEventListener('change', function() {
    rainbowLinesChecked = this.checked;
    lineColorInput.disabled = this.checked; // Disable line color input if rainbow lines is checked
    if (this.checked) {
        startRainbowEffect();
    } else {
        stopRainbowEffect();
    }
});