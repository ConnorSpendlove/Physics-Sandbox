document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const personWidth = 50;
    const personHeight = 100;
    let personX = (canvas.width - personWidth) / 2;
    const personY = canvas.height - personHeight;
    const speed = 5; // Movement speed
    let keys = {};
    let score = 0;
    let lives = 3;
    let gameOver = false;
    let playerHit = false;
    let bullets = 20; // Current number of bullets
    const maxBullets = 20; // Maximum number of bullets
    const replenishRate = 1000; // Replenish rate in milliseconds (1 bullet every 2 seconds)

    const balls = [];
    const projectiles = [];
    const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6'];

    // Function to check if the player can shoot
    function canShoot() {
        return bullets > 0;
    }

    // Function to replenish bullets over time
    function replenishBullets() {
        setInterval(() => {
            if (bullets < maxBullets) {
                bullets++;
                updateBulletDisplay();
            }
        }, replenishRate);
    }

    // Function to update the bullet display
    function updateBulletDisplay() {
        document.getElementById('bulletCount').textContent = bullets;
    }

    class Ball {
        constructor(x, y, dx, dy, radius, color) {
            this.x = x;
            this.y = y;
            this.dx = dx;
            this.dy = dy;
            this.radius = radius;
            this.color = color;
            this.isExploded = false;
        }

        explode() {
            this.isExploded = true;
            const index = balls.indexOf(this);
            if (index !== -1) {
                balls.splice(index, 1);
            }
            // Show explosion image at the position
            const explosion = document.getElementById('explosion');
            explosion.style.left = (this.x - this.radius) + 'px';
            explosion.style.top = (this.y - this.radius) + 'px';
            explosion.style.width = (this.radius * 2) + 'px';
            explosion.style.height = (this.radius * 2) + 'px';
            explosion.style.display = 'block';
            setTimeout(() => {
                explosion.style.display = 'none';
            }, 600); // Adjust the duration as needed
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        }

        update() {
            if (this.y + this.radius + this.dy > canvas.height) {
                this.dy = -this.dy * 0.9;
            } else {
                this.dy += 0.05;
            }

            if (this.x + this.radius + this.dx > canvas.width || this.x - this.radius + this.dx < 0) {
                this.dx = -this.dx;
            }

            this.x += this.dx;
            this.y += this.dy;

            this.draw();
        }
    }

    function drawPerson() {
        ctx.beginPath();
        ctx.rect(personX, personY, personWidth, personHeight);
        ctx.fillStyle = playerHit ? 'red' : 'green'; // Flash red when hit
        ctx.fill();
        ctx.closePath();
    }

    function drawProjectiles() {
        projectiles.forEach(projectile => {
            ctx.beginPath();
            ctx.rect(projectile.x, projectile.y, 5, 10); // Adjust bullet size
            ctx.fillStyle = 'red';
            ctx.fill();
            ctx.closePath();
        });
    }

    function drawHealthBar() {
        const healthBar = document.getElementById('healthBar');
        const hearts = healthBar.querySelectorAll('.heart');
        for (let i = 0; i < hearts.length; i++) {
            if (i < lives) {
                hearts[i].style.display = 'inline';
            } else {
                hearts[i].style.display = 'none';
            }
        }
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function update() {
        clearCanvas();
        balls.forEach(ball => {
            ball.update();
        });
        drawPerson();
        drawProjectiles();
        drawHealthBar();
        if (gameOver) {
            showGameOverModal();
        }
    }

    function moveLeft() {
        personX -= speed;
        if (personX < 0) {
            personX = 0;
        }
    }

    function moveRight() {
        personX += speed;
        if (personX + personWidth > canvas.width) {
            personX = canvas.width - personWidth;
        }
    }

    function shoot() {
        if (canShoot()) {
            const projectile = {
                x: personX + personWidth / 2,
                y: personY,
                dy: -10 // Bullet flies upwards
            };
            projectiles.push(projectile);
            bullets--; // Reduce the number of bullets
            updateBulletDisplay(); // Update the bullet display
        }
    }

    function keyDownHandler(event) {
        keys[event.key] = true;
        if (event.key === ' ') { // Space key for shooting
            shoot();
        }
    }

    function keyUpHandler(event) {
        keys[event.key] = false;
    }

    function handleMovement() {
        if (keys['ArrowLeft'] || keys['a']) {
            moveLeft();
        }
        if (keys['ArrowRight'] || keys['d']) {
            moveRight();
        }
    }

    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);

    function animate() {
        requestAnimationFrame(animate);
        if (!gameOver) {
            handleMovement();
            update();
            handleCollisions();
        } else {
            updateBestScore(score);
            showGameOverModal();
        }
    }

    // Define a variable to store the current score
    let currentScore = 0;

    // Update the current score when a ball is exploded
    function updateCurrentScore() {
        currentScore++;
        document.getElementById('currentScoreValue').textContent = currentScore;
    }

    function handleCollisions() {
        for (let i = 0; i < projectiles.length; i++) {
            for (let j = 0; j < balls.length; j++) {
                const projectile = projectiles[i];
                const ball = balls[j];
                const dx = projectile.x - ball.x;
                const dy = projectile.y - ball.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 10 + ball.radius) { // Adjust bullet size
                    ball.explode(); // Ball explodes upon collision
                    projectiles.splice(i, 1); // Remove projectile
                    score++; // Increase score
                    updateCurrentScore();
                    break;
                }
            }
        }

        for (let j = 0; j < balls.length; j++) {
            const ball = balls[j];
            const dx = personX + personWidth / 2 - ball.x;
            const dy = personY + personHeight / 2 - ball.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < personWidth / 2 + ball.radius && dy > 0) { // Exclude explosion area and only collide with balls from above
                if (!ball.collided) {
                    loseLife();
                    ball.collided = true;
                }
                ball.explode();
            }
        }
    }

    function loseLife() {
        lives--;
        if (lives <= 0) {
            gameOver = true;
        } else {
            playerHit = true;
            setTimeout(() => {
                playerHit = false;
                update();
            }, 200); // Flash red for 200 milliseconds
        }
    }

    function showGameOverModal() {
        const gameOverModal = document.getElementById('gameOverModal');
        const destroyedBallsText = document.getElementById('destroyedBalls');
        const bestScoreValue = document.getElementById('bestScoreValue');
        const restartButton = document.getElementById('restartButton');

        gameOverModal.style.display = 'block';
        destroyedBallsText.innerText = score;
        bestScoreValue.innerText = bestScore;

        restartButton.addEventListener('click', function () {
            gameOverModal.style.display = 'none';
            resetGame();
        });
    }

    function resetGame() {
        balls.length = 0;
        projectiles.length = 0;
        currentScore = 0;
        lives = 3;
        score = 0;
        gameOver = false;
        playerHit = false;
        bullets = maxBullets; // Reset the number of bullets
        updateBulletDisplay(); // Update the bullet display
    }

    // Best score handling
    let bestScore = localStorage.getItem('bestScore') || 0;
    document.getElementById('currentBestScore').innerText = bestScore;

    function saveBestScore(score) {
        localStorage.setItem('bestScore', score);
    }

    function updateBestScore(score) {
        bestScore = Math.max(score, bestScore);
        document.getElementById('currentBestScore').innerText = bestScore;
        saveBestScore(bestScore);
    }

    // Game over handling
    if (gameOver) {
        updateBestScore(score);
        showGameOverModal();
    }

    function spawnBall() {
        const radius = Math.random() * 30 + 10;
        const x = Math.random() * (canvas.width - radius * 2) + radius;
        const y = -radius; // Spawn above the canvas
        const dx = (Math.random() - 0.5) * 4; // Horizontal velocity
        const dy = (Math.random() - 0.5) * 4; // Vertical velocity
        const color = colors[Math.floor(Math.random() * colors.length)];
        balls.push(new Ball(x, y, dx, dy, radius, color));
    }

    function spawnBallsInterval() {
        setInterval(() => {
            spawnBall();
        }, 1000);
    }

    function updateProjectiles() {
        for (let i = 0; i < projectiles.length; i++) {
            projectiles[i].y += projectiles[i].dy; // Move bullets upward
            // Remove bullets that go out of canvas
            if (projectiles[i].y < 0) {
                projectiles.splice(i, 1);
            }
        }
    }

    setInterval(updateProjectiles, 1000 / 60); // Update projectiles' position

    replenishBullets(); // Start replenishing bullets over time

    animate(); // Initial drawing
    spawnBallsInterval(); // Start spawning balls
});

