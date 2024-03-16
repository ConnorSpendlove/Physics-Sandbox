document.addEventListener("DOMContentLoaded", function() {
    const shapeContainer = document.getElementById('shape-container');
    const box = document.getElementById('box');
    const shapeSelector = document.getElementById('shape');
    const pauseButton = document.getElementById('pause');
    const unpauseButton = document.getElementById('unpause');

    let paused = false;
    let animationId;
    let storedPositionX, storedPositionY, storedVelocityX, storedVelocityY;

    function moveShape(shape, velocityX, velocityY) {
        let positionX = storedPositionX || 0;
        let positionY = storedPositionY || 0;
        let velX = storedVelocityX || velocityX;
        let velY = storedVelocityY || velocityY;

        function updatePosition() {
            if (!paused) {
                positionX += velX;
                positionY += velY;

                const boxWidth = box.offsetWidth;
                const boxHeight = box.offsetHeight;
                const shapeWidth = shape.offsetWidth;
                const shapeHeight = shape.offsetHeight;

                // Check collision with box edges
                if (positionX <= 0 || positionX + shapeWidth >= boxWidth) {
                    velX = -velX; // Reverse direction on X-axis
                }
                if (positionY <= 0 || positionY + shapeHeight >= boxHeight) {
                    velY = -velY; // Reverse direction on Y-axis
                }

                shape.style.left = positionX + 'px';
                shape.style.top = positionY + 'px';
            }

            animationId = requestAnimationFrame(updatePosition);
        }

        updatePosition();
    }

    function createCircle() {
        const circle = document.createElement('div');
        circle.classList.add('circle');
        shapeContainer.appendChild(circle);
        moveShape(circle, 2, 2);
    }

    function createSquare() {
        const square = document.createElement('div');
        square.classList.add('square');
        shapeContainer.appendChild(square);
        moveShape(square, 2, 2);
    }

    function createTriangle() {
        const triangle = document.createElement('div');
        triangle.classList.add('triangle');
        shapeContainer.appendChild(triangle);
        moveShape(triangle, 2, 2);
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

    pauseButton.addEventListener('click', function() {
        paused = true;
        cancelAnimationFrame(animationId);
        storedPositionX = parseFloat(shapeContainer.firstElementChild.style.left);
        storedPositionY = parseFloat(shapeContainer.firstElementChild.style.top);
        storedVelocityX = storedPositionX ? 2 : null;
        storedVelocityY = storedPositionY ? 2 : null;
    });

    unpauseButton.addEventListener('click', function() {
        if (!paused) {
            return; // Do nothing if animation is already running
        }
        paused = false;
        handleShapeSelection();
    });

    // Initial setup
    handleShapeSelection();
    shapeSelector.addEventListener('change', handleShapeSelection);
});
