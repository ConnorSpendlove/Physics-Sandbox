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
const toggleLinesCheckbox = document.getElementById('toggleLines');
const ballCounterDisplay = document.getElementById('ball-counter'); // Reference to the ball counter display

// Step 1: Create a variable to track the number of bounces and the status of the double balls option
let bounceCount = 0;
let doubleBallsEnabled = false; // Initially disabled

// Step 2: Define a threshold value for the number of bounces
const bounceThreshold = 10; // Adjust as needed

// Step 3: Add an event listener to toggle the double balls option
document.getElementById('doubleBallsCheckbox').addEventListener('change', function() {
    doubleBallsEnabled = this.checked;
});

// Get reference to the ball size slider
const ballSizeSlider = document.getElementById('ball-size-slider');

// Update shape size display
const shapeSizeDisplay = document.getElementById('shape-size-display')

// Add event listener to handle changes in the slider value
ballSizeSlider.addEventListener('input', function() {
    // Update ball radius based on slider value
    balls.forEach(ball => {
        ball.radius = parseInt(this.value);
    });
    shapeSizeDisplay.textContent = this.value;
});


resetButton.addEventListener('click', function() {
    location.reload(); // Reload the page
});


let ringRadius = 150;
let ballRadius = 20;
const gravity = 0.2;
let animationRunning = false; // Flag to control animation state

const speedIncreaseFactor = 0.025; // Speed increase factor per bounce
const sizeIncreaseAmount = 0.4; // Radius increase amount per bounce

let balls = []; // Array to store all balls
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

function drawBall(ball) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    if (rainbowBallChecked) {
        // Update hue value gradually to cycle through the colors of the rainbow
        hue = (hue + 1) % 360; // Increment hue value by 1 (360 degrees in the color wheel)
        const color = `hsl(${hue}, 100%, 50%)`; // Use HSL color model with varying hue
        ctx.fillStyle = color;
    } else {
        ctx.fillStyle = ball.color;
    }

     // Draw white outline if tracing mode is active
     if (document.getElementById('tracingModeCheckbox').checked) {
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 4;
        ctx.stroke();
    }
    ctx.fill();
    ctx.closePath();
}

let hueLines = 0; // Initial hue value for lines

function drawLines() {
    // Check if the toggleLinesCheckbox is checked
    if (toggleLinesCheckbox.checked) {
        // If rainbowLinesChecked is true, apply rainbow effect
        if (rainbowLinesChecked) {
            hueLines = (hueLines + 1) % 360; // Increment hue value for lines
            const color = `hsl(${hueLines}, 100%, 50%)`; // Use HSL color model with varying hue
            ctx.strokeStyle = color;
        } else {
            // Use the color selected by the user
            ctx.strokeStyle = lineColorInput.value;
        }

        // Draw lines
        ctx.beginPath();
        balls.forEach(ball => {
            ball.hitPoints.forEach(point => {
                ctx.moveTo(ball.x, ball.y);
                ctx.lineTo(point.x, point.y);
            });
        });
        ctx.stroke();
    }
}

let tracedBallPositions = []; // Array to store positions of traced balls

// Modify the traceBallPath() function to store the current position of each ball
function traceBallPath() {
    if (document.getElementById('tracingModeCheckbox').checked) {
        // Store the current position of the main ball
        const currentPosition = { x: balls[0].x, y: balls[0].y };

        // Add the current position to the array of traced positions
        tracedBallPositions.push(currentPosition);
    }
}


function drawTracedBalls(color, rainbowActive) {
    const mainBallRadius = balls[0].radius; // Get the radius of the main ball
    if (document.getElementById('tracingModeCheckbox').checked) {
        // Track the number of times the function has been called
        drawTracedBalls.callCount = (drawTracedBalls.callCount || 0) + 1;

        if (drawTracedBalls.callCount > 100) {
            tracedBallPositions.shift(); // Remove the oldest traced ball
        }

        tracedBallPositions.forEach((position, index) => {
            ctx.save();
            ctx.beginPath();
            ctx.arc(position.x, position.y, mainBallRadius, 0, Math.PI * 2); // Use the radius of the main ball
            if (rainbowActive) {
                const color = `hsl(${hue}, 100%, 50%)`; // Use HSL color model with varying hue
                ctx.fillStyle = color;
            } else {
                ctx.fillStyle = color; // Use the color of the main ball for traced balls
            }
            ctx.globalAlpha = 1; // Set opacity to 100%
            ctx.fill();
            ctx.strokeStyle = 'black'; // Set black stroke color
            ctx.lineWidth = 0.2; // Set stroke width
            ctx.stroke(); // Draw the outline
            ctx.restore();
        });
        console.log(".")
    }
}



function startRainbowEffect() {
    rainbowBallInterval = setInterval(() => {
        balls.forEach(ball => drawBall(ball));
    }, 100); // Update ball color every 100 milliseconds

    rainbowLinesInterval = setInterval(() => {
        drawLines();
    }, 100); // Update lines color every 100 milliseconds
}

function stopRainbowEffect() {
    clearInterval(rainbowBallInterval);
    clearInterval(rainbowLinesInterval);
}

const bounceCounterDisplay = document.getElementById('bounce-counter'); // Reference to the bounce counter display

// Define a variable to track the number of bounces
let bounceCounter = 0;


function update() {
    // Apply gravity to each ball
    balls.forEach(ball => {
        ball.vy += gravity;

        // Calculate next position
        const nextX = ball.x + ball.vx;
        const nextY = ball.y + ball.vy;

        // Check if the next position would be inside the ring
        const dx = nextX - canvas.width / 2;
        const dy = nextY - canvas.height / 2;
        const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);
        if (distanceFromCenter + ball.radius >= ringRadius) {
            // If the ball would penetrate the ring, adjust its position
            const normalX = dx / distanceFromCenter;
            const normalY = dy / distanceFromCenter;
            const dot = ball.vx * normalX + ball.vy * normalY;
            ball.vx -= 2 * dot * normalX;
            ball.vy -= 2 * dot * normalY;
            ball.x = canvas.width / 2 + normalX * (ringRadius - ball.radius);
            ball.y = canvas.height / 2 + normalY * (ringRadius - ball.radius);

            // Store hit point
            ball.hitPoints.push({ x: ball.x + normalX * ball.radius, y: ball.y + normalY * ball.radius });

            // Increase ball speed
            if (speedUpChecked) {
                ball.vx *= (1 + speedIncreaseFactor);
                ball.vy *= (1 + speedIncreaseFactor);
            }

            // Increase ball size
            if (sizeUpChecked) {
                ball.radius += sizeIncreaseAmount;
            }

            // Play random note
            playRandomNote();
            bounceCount++;
             // Increment bounce counter
             bounceCounter++;
             // Update bounce counter display
             bounceCounterDisplay.textContent = bounceCounter;
        } else {
            // If the next position is safe, update ball position
            ball.x = nextX;
            ball.y = nextY;
        }

        if (doubleBallsEnabled && bounceCount >= bounceThreshold) {
            // Step 5: Double the number of balls
            const newBall = {
                x: Math.random() * canvas.width, // Random x position within canvas width
                y: Math.random() * canvas.height, // Random y position within canvas height
                vx: Math.random() * 10 - 5, // Initial x velocity
                vy: Math.random() * 10 - 5, // Initial y velocity
                radius: 10, // Initial ball radius
                color: ballColorInput.value, // Ball color
                hitPoints: [] // Array to store hit points
            };
        
            // Add the new ball to the balls array
            balls.push(newBall);
            // Increment the ball counter
            ballCounter++;
        
            // Update the ball counter display
            ballCounterDisplay.textContent = ballCounter;
            // Reset bounce counter
            bounceCount = 0;
        }
    });

    // Check for collisions between balls
    for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
            const dx = balls[i].x - balls[j].x;
            const dy = balls[i].y - balls[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < balls[i].radius + balls[j].radius) {
                // Balls collide, adjust their velocities
                const angle = Math.atan2(dy, dx);
                const magnitude1 = Math.sqrt(balls[i].vx * balls[i].vx + balls[i].vy * balls[i].vy);
                const magnitude2 = Math.sqrt(balls[j].vx * balls[j].vx + balls[j].vy * balls[j].vy);
                const direction1 = Math.atan2(balls[i].vy, balls[i].vx);
                const direction2 = Math.atan2(balls[j].vy, balls[j].vx);

                const vx1 = magnitude1 * Math.cos(direction1 - angle);
                const vy1 = magnitude1 * Math.sin(direction1 - angle);
                const vx2 = magnitude2 * Math.cos(direction2 - angle);
                const vy2 = magnitude2 * Math.sin(direction2 - angle);

                const finalVelocityX1 = ((balls[i].radius - balls[j].radius) * vx1 + (balls[j].radius + balls[j].radius) * vx2) / (balls[i].radius + balls[j].radius);
                const finalVelocityX2 = ((balls[i].radius + balls[i].radius) * vx1 + (balls[j].radius - balls[i].radius) * vx2) / (balls[i].radius + balls[j].radius);

                const finalVelocityY1 = vy1;
                const finalVelocityY2 = vy2;

                // Update velocities
                balls[i].vx = Math.cos(angle) * finalVelocityX1 + Math.cos(angle + Math.PI / 2) * finalVelocityY1;
                balls[i].vy = Math.sin(angle) * finalVelocityX1 + Math.sin(angle + Math.PI / 2) * finalVelocityY1;
                balls[j].vx = Math.cos(angle) * finalVelocityX2 + Math.cos(angle + Math.PI / 2) * finalVelocityY2;
                balls[j].vy = Math.sin(angle) * finalVelocityX2 + Math.sin(angle + Math.PI / 2) * finalVelocityY2;
            }
        }
    }

    // Draw everything
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawRing();

    drawLines();

    balls.forEach(ball => {
        drawTracedBalls(ball.color, rainbowBallChecked); // Draw traced balls first
        drawBall(ball, rainbowBallChecked); // Draw main ball on top
    });

    
    traceBallPath();

    if (animationRunning) {
        requestAnimationFrame(update);
    }
}




let ballCounter = 0;
// Event listener to trigger adding a new ball

// Event listener to trigger adding a new ball
document.getElementById('addBallButton').addEventListener('click', function() {
    // Generate random coordinates until a position without overlap is found
    let newBallX, newBallY;
    let overlap = true;

    while (overlap) {
        newBallX = canvas.width / 2 + (Math.random() * 2 - 1) * ringRadius;
        newBallY = canvas.height / 2 + (Math.random() * 2 - 1) * ringRadius;
        overlap = balls.some(ball => checkOverlap(newBallX, newBallY, ball));
    }

    // Create the ball with the calculated coordinates
    const newBall = {
        x: newBallX,
        y: newBallY,
        vx: Math.random() * 10 - 5,
        vy: Math.random() * 10 - 5,
        radius: ballRadius,
        color: ballColorInput.value,
        hitPoints: []
    };
    balls.push(newBall);
    ballCounter++;

    // Update the ball counter display
    ballCounterDisplay.textContent = ballCounter;
});


// Function to check if there's overlap between a new ball and an existing ball
function checkOverlap(x, y, otherBall) {
    // Calculate the distance between the centers of the new ball and the existing ball
    const dx = x - otherBall.x;
    const dy = y - otherBall.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Check if the distance is less than the sum of their radii
    return distance < ballRadius + otherBall.radius;
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

// Function to update the color input and save the selected color to local storage
function updateColorInput(inputId, color) {
    document.getElementById(inputId).value = color;
    localStorage.setItem(inputId, color);
}

// Event listener for ball color input
ballColorInput.addEventListener('input', function() {
    updateColorInput('ball-color', this.value);
});

// Event listener for line color input
lineColorInput.addEventListener('input', function() {
    updateColorInput('line-color', this.value);
});

// Function to retrieve the last selected color from local storage
function getStoredColor(inputId) {
    return localStorage.getItem(inputId);
}

// Set initial color for ball color input from local storage
const storedBallColor = getStoredColor('ball-color');
if (storedBallColor) {
    ballColorInput.value = storedBallColor;
}

// Set initial color for line color input from local storage
const storedLineColor = getStoredColor('line-color');
if (storedLineColor) {
    lineColorInput.value = storedLineColor;
}



