document.addEventListener("DOMContentLoaded", function() {
    const shapeContainer = document.getElementById('shape-container');
    const box = document.getElementById('box');
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    const applySizeButton = document.getElementById('apply-size');
    const shapeSelector = document.getElementById('shape');
    const shapeSelectorHeading = document.getElementById('shape-selector');
    const speedControl = document.getElementById('speed');
    const speedDisplay = document.getElementById('speed-display'); // Reference to the speed display element
    const controlButton = document.getElementById('control-button');
    const startButton = document.getElementById('start'); 
    const resetButton = document.getElementById('reset');// Reference to the start button

    let animationId;
    let paused = true; // Animation is paused initially
    let storedPositionX = 0;
    let storedPositionY = 0;
    let storedVelocityX = 2;
    let storedVelocityY = 2;

    if (localStorage.getItem('speed')) {
        speedControl.value = localStorage.getItem('speed');
        speedDisplay.textContent = speedControl.value;
    }

    if (localStorage.getItem('width')) {
        widthInput.value = localStorage.getItem('width');
        box.style.width = widthInput.value + 'px';
    }

    if (localStorage.getItem('height')) {
        heightInput.value = localStorage.getItem('height');
        box.style.height = heightInput.value + 'px';
    }

    if (localStorage.getItem('shape')) {
        shapeSelector.value = localStorage.getItem('shape');
    }

    function moveShape(shape, velocityX, velocityY) {
        let positionX = storedPositionX;
        let positionY = storedPositionY;

        function updatePosition() {
            if (!paused) {
                positionX += velocityX * (speedControl.value / 5); // Adjust velocity based on speed control value
                positionY += velocityY * (speedControl.value / 5);

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
         // Save selected shape to localStorage
         localStorage.setItem('shape', selectedShape);
    }

    applySizeButton.addEventListener('click', function() {
        let width = parseInt(widthInput.value);
        let height = parseInt(heightInput.value);
    
        // Cap width and height at 1000 pixels if exceeded
        width = Math.min(width, 1000);
        height = Math.min(height, 1000);

        if (width === 1000 && parseInt(widthInput.value) > 1000 || height === 1000 && parseInt(heightInput.value) > 1000) {
            alert('Width and height cannot exceed 1000 pixels.');
            width = Math.min(width, 1000);
            height = Math.min(height, 1000);
        }
    
        // Apply size only if within the limit
        box.style.width = width + 'px';
        box.style.height = height + 'px';
        // Save width and height to localStorage
        localStorage.setItem('width', width);
        localStorage.setItem('height', height);
    
        // Update input values in case they were capped
        widthInput.value = width;
        heightInput.value = height;
    });
    
    startButton.addEventListener('click', function() {
        if (paused) { // Check if animation is paused
            paused = false; // Start the animation
            handleShapeSelection(); // Create the selected shape
        }
        shapeSelectorHeading.classList.add('hide')
    });

    function toggleAnimation() {
        paused = !paused;
        if (paused) {
            controlButton.textContent = 'Unpause';
            cancelAnimationFrame(animationId);
            // Store the current position and velocity
            storedPositionX = parseFloat(shapeContainer.firstElementChild.style.left);
            storedPositionY = parseFloat(shapeContainer.firstElementChild.style.top);
            storedVelocityX = storedVelocityX;
            storedVelocityY = storedVelocityY;
        } else {
            controlButton.textContent = 'Pause';
            handleShapeSelection();
            // Resume animation from the stored position with the stored velocities
            moveShape(shapeContainer.firstElementChild, storedVelocityX, storedVelocityY);
        }
    }

    // Initial setup
    shapeSelector.addEventListener('change', handleShapeSelection);

    resetButton.addEventListener('click', function() {
        shapeSelectorHeading.classList.remove("hide");
        paused = true; // Animation is paused initially
        location.reload(); // Reload the page
    });

     // Update speed display when the speed control value changes
     speedControl.addEventListener('input', function() {
        speedDisplay.textContent = speedControl.value;
        localStorage.setItem('speed', speedControl.value);
    });

    controlButton.addEventListener('click', toggleAnimation);

     shapeSelector.addEventListener('change', function() {
        startButton.disabled = shapeSelector.value === ''; // Disable start button if no shape is selected
    });
});


