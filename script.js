document.addEventListener("DOMContentLoaded", function() {
    const shapeContainer = document.getElementById('shape-container');
    const box = document.getElementById('box');
    const containerShapeSelector = document.getElementById('container-shape');
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    const applySizeButton = document.getElementById('apply-size');
    const restoreDefaultsButton = document.getElementById('restore-defaults');
    const shapeSelector = document.getElementById('shape');
    const shapeSelectorHeading = document.getElementById('shape-selector');
    const shapeColorInput = document.getElementById('shape-color')
    const speedControl = document.getElementById('speed');
    const speedDisplay = document.getElementById('speed-display'); // Reference to the speed display element
    const shapeSizeInput = document.getElementById('shape-size');
    const shapeSizeDisplay = document.getElementById('shape-size-display');
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

    if (localStorage.getItem('shapeColor')) {
        shapeColorInput.value = localStorage.getItem('shapeColor');
    }

    if (localStorage.getItem('shapeSize')) {
        const size = parseInt(localStorage.getItem('shapeSize'));
        shapeSizeInput.value = size;

        const shapes = shapeContainer.querySelectorAll('.shape');
        shapes.forEach(shape => {
            updateShapeSize(shape, size);
        });
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

    function updateShapeSize(shape, size) {
        // Update the width and height of the shape element
        shape.style.width = size + 'px';
        shape.style.height = size + 'px';
    }

    function createCircle(color, size) {
        const circle = document.createElement('div');
        circle.classList.add('circle', 'shape');
        circle.style.backgroundColor = color;
        shapeContainer.appendChild(circle);
        updateShapeSize(circle, size);
        moveShape(circle, storedVelocityX, storedVelocityY); // Move the circle immediately after creation
    }

    function createSquare(color, size) {
        const square = document.createElement('div');
        square.classList.add('square', 'shape');
        square.style.backgroundColor = color;
        shapeContainer.appendChild(square);
        updateShapeSize(square, size);
        moveShape(square, storedVelocityX, storedVelocityY); // Move the square immediately after creation
    }

    function createTriangle(color, size) {
        const triangle = document.createElement('div');
        triangle.classList.add('triangle', 'shape');
        triangle.style.backgroundColor = color;
        shapeContainer.appendChild(triangle);
        updateShapeSize(triangle, size);
        moveShape(triangle, storedVelocityX, storedVelocityY); // Move the triangle immediately after creation
    }
  
    // event listener for shape size input changes
    shapeSizeInput.addEventListener('input', function() {
        // Update the shape size display
        shapeSizeDisplay.textContent = shapeSizeInput.value;
    
        // Save the shape size to local storage
        localStorage.setItem('shapeSize', shapeSizeInput.value);
    
        // Update the size of existing shapes immediately
        const shapes = shapeContainer.querySelectorAll('.shape');
        shapes.forEach(shape => {
            shape.style.width = shapeSizeInput.value + 'px';
            shape.style.height = shapeSizeInput.value + 'px';
        });
    });
    
    // Retrieve the shape size from local storage on page load
    const savedShapeSize = localStorage.getItem('shapeSize');
    if (savedShapeSize) {
        shapeSizeInput.value = savedShapeSize;
        shapeSizeDisplay.textContent = savedShapeSize;
    
        // Update the size of existing shapes based on the retrieved value
        const shapes = shapeContainer.querySelectorAll('.shape');
        shapes.forEach(shape => {
            shape.style.width = savedShapeSize + 'px';
            shape.style.height = savedShapeSize + 'px';
        });
    }

    // Retrieve last shape size from local storage or set a default value
    let lastShapeSize = parseInt(localStorage.getItem('shapeSize')) || 50;

    shapeSizeInput.value = lastShapeSize;

    function clearShapes() {
        shapeContainer.innerHTML = '';
    }

    function handleShapeSelection() {
        clearShapes();
        const selectedShape = shapeSelector.value;
        const shapeColor = shapeColorInput.value;
        switch (selectedShape) {
            case 'circle':
                createCircle(shapeColor, parseInt(shapeSizeInput.value)); // Pass the size to the createCircle function
                break;
            case 'square':
                createSquare(shapeColor, parseInt(shapeSizeInput.value)); // Pass the size to the createSquare function
                break;
            case 'triangle':
                createTriangle(shapeColor, parseInt(shapeSizeInput.value)); // Pass the size to the createTriangle function
                break;
            default:
                break;
        }
         // Save selected shape to localStorage
         localStorage.setItem('shape', selectedShape);
         // Save selected color to localStorage
         localStorage.setItem('shapeColor', shapeColor);
    }

   // Retrieve last width and height from local storage or set default values
   let lastWidth = parseInt(localStorage.getItem('lastWidth')) || window.innerWidth * 0.3;
   let lastHeight = parseInt(localStorage.getItem('lastHeight')) || window.innerHeight * 0.3;

   // Set initial values for width and height inputs
   widthInput.value = lastWidth;
   heightInput.value = lastHeight;

   // Set initial size for the box
   box.style.width = lastWidth + 'px';
   box.style.height = lastHeight + 'px';

   // Add event listener for apply size button
   applySizeButton.addEventListener('click', applySize);

   // Add event listener for restore defaults button
   restoreDefaultsButton.addEventListener('click', restoreDefaults);

   function applySize() {
       let width = parseInt(widthInput.value);
       let height = parseInt(heightInput.value);

       // Check if width or height exceeds 1000
       if (width > 1000 || height > 1000) {
           alert('Width and height cannot exceed 1000 pixels.');
           return;
       }

       // Calculate maximum width and height based on screen size
       const maxScreenWidth = window.innerWidth * 0.8; // Use 80% of the screen width
       const maxScreenHeight = window.innerHeight * 0.8; // Use 80% of the screen height

       // Cap width and height at maximum screen dimensions
       width = Math.min(width, maxScreenWidth);
       height = Math.min(height, maxScreenHeight);

       // Apply size only if within the limit
       box.style.width = width + 'px';
       box.style.height = height + 'px';
       // Save width and height to localStorage
       localStorage.setItem('lastWidth', width);
       localStorage.setItem('lastHeight', height);

       // Update input values in case they were capped
       widthInput.value = width;
       heightInput.value = height;
   }

   function restoreDefaults() {
       // Calculate default width and height based on screen size
       const defaultWidth = window.innerWidth * 0.3;
       const defaultHeight = window.innerHeight * 0.3;

       // Set width and height inputs to default values
       widthInput.value = defaultWidth;
       heightInput.value = defaultHeight;

       // Apply default size to the box
       box.style.width = defaultWidth + 'px';
       box.style.height = defaultHeight + 'px';

       // Save default width and height to localStorage
       localStorage.setItem('lastWidth', defaultWidth);
       localStorage.setItem('lastHeight', defaultHeight);
   }
    
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
