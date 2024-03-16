document.addEventListener("DOMContentLoaded", function() {
    const square = document.getElementById('square');
    const box = document.getElementById('box');
    const pauseButton = document.getElementById('pause');
    const unpauseButton = document.getElementById('unpause');

    let positionX = 0;
    let positionY = 0;
    let velocityX = 2;
    let velocityY = 2;
    let paused = false;
    let animationId;

    function moveSquare() {
        if (!paused) {
            positionX += velocityX;
            positionY += velocityY;

            const boxWidth = box.offsetWidth;
            const boxHeight = box.offsetHeight;
            const squareWidth = square.offsetWidth;
            const squareHeight = square.offsetHeight;

            // Check collision with box edges
            if (positionX <= 0 || positionX + squareWidth >= boxWidth) {
                velocityX = -velocityX; // Reverse direction on X-axis
            }
            if (positionY <= 0 || positionY + squareHeight >= boxHeight) {
                velocityY = -velocityY; // Reverse direction on Y-axis
            }

            square.style.left = positionX + 'px';
            square.style.top = positionY + 'px';

            animationId = requestAnimationFrame(moveSquare);
        }
    }

    moveSquare();

    pauseButton.addEventListener('click', function() {
        paused = true;
        cancelAnimationFrame(animationId);
    });

    unpauseButton.addEventListener('click', function() {
        paused = false;
        moveSquare();
    });
});

