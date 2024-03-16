document.addEventListener("DOMContentLoaded", function() {
    const shapeContainer = document.getElementById('shape-container');
    const box = document.getElementById('box');
    const shapeSelector = document.getElementById('shape');
    const pauseButton = document.getElementById('pause');
    const unpauseButton = document.getElementById('unpause');
    const startButton = document.getElementById('start'); // Reference to the start button

    let animationId;
    let paused = true; // Animation is paused initially
    let storedPositionX = 0;
    let storedPositionY = 0;
    let storedVelocityX = 2;
    let storedVelocityY = 2;

    function moveShape(shape, velocityX, velocityY) {
        let positionX = storedPositionX;
        let positionY = storedPositionY;

        function updatePosition() {
            if (!paused) {
                positionX += velocityX;
                positionY += velocityY;

                const boxWidth = box.offsetWidth;
                const boxHeight = box.offsetHeight;
                const shapeWidth = shape.offsetWidth;
                const shapeHeight = shape.offsetHeight;

                // Check collision with box edges
                if (positionX <= 0 || positionX + shapeWidth >= boxWidth) {
                    velocityX = -velocityX; // Reverse direction on X-axis
                }
                if (positionY <= 0 || positionY + shapeHeight >= boxHeight) {
                    velocityY = -velocityY; // Reverse direction on Y-axis
                }

                shape.style.left = positionX + 'px';
                shape.style.top = positionY + 'px';
            }

            animationId = requestAnimationFrame(function() {
                updatePosition();
                updateVelocity();
            });
        }

        function updateVelocity() {
            // This function ensures that the velocity remains constant
            storedVelocityX = velocityX;
            storedVelocityY = velocityY;
        }

        updatePosition();
    }

    function createCircle() {
        const circle = document.createElement('div');
        circle.classList.add('circle');
        shapeContainer.appendChild(circle);
        moveShape(circle, storedVelocityX, storedVelocityY);
    }

    function createSquare() {
        const square = document.createElement('div');
        square.classList.add('square');
        shapeContainer.appendChild(square);
        moveShape(square, storedVelocityX, storedVelocityY);
    }

    function createTriangle() {
        const triangle = document.createElement('div');
        triangle.classList.add('triangle');
        shapeContainer.appendChild(triangle);
        moveShape(triangle, storedVelocityX, storedVelocityY);
    }

    function clearShapes() {
        shapeContainer.innerHTML = '';
    }

    function handleShapeSelection() {
        clearShapes();
        const selectedShape = shapeSelector.value;
        switch (selectedShape) {
            case 'circle':
                createCircle();
                break;
            case 'square':
                createSquare();
                break;
            case 'triangle':
                createTriangle();
                break;
            default:
                break;
        }
    }

    startButton.addEventListener('click', function() {
        if (paused) { // Check if animation is paused
            paused = false; // Start the animation
            handleShapeSelection(); // Create the selected shape
        }
    });

    pauseButton.addEventListener('click', function() {
        paused = true;
        cancelAnimationFrame(animationId);
        // Store the current position and velocity
        storedPositionX = parseFloat(shapeContainer.firstElementChild.style.left);
        storedPositionY = parseFloat(shapeContainer.firstElementChild.style.top);
        storedVelocityX = storedVelocityX;
        storedVelocityY = storedVelocityY;
    });

    unpauseButton.addEventListener('click', function() {
        if (!paused) {
            return; // Do nothing if animation is already running
        }
        paused = false;
        handleShapeSelection();
        // Resume animation from the stored position with the stored velocities
        moveShape(shapeContainer.firstElementChild, storedVelocityX, storedVelocityY);
    });

    // Initial setup
    shapeSelector.addEventListener('change', handleShapeSelection);
});
