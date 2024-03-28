// Define the AudioContext and gainNode variables globally
let audioContext = null;
let gainNode = null;
let isMuted = false; // Flag to track mute state

// Function to initialize the audio context and gain node
function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);
}

// Define a variable to store the previous volume slider value
let prevVolumeSliderValue = 0.5; // Default value

// Function to mute/unmute the audio
function toggleMute() {
    if (gainNode) {
        // Toggle between mute (0) and unmute (1)
        gainNode.gain.value = gainNode.gain.value === 0 ? 1 : 0;

        // Toggle the mute icon
        const muteIcon = document.getElementById('muteIcon');
        muteIcon.classList.toggle('fa-volume-mute');
        muteIcon.classList.toggle('fa-volume-up');

        // Get the volume slider element
        const volumeSlider = document.getElementById('volumeSlider');

        // Disable/enable the volume slider based on the mute state
        volumeSlider.disabled = gainNode.gain.value === 0;

        // If muting, store the current volume slider value
        if (gainNode.gain.value === 0) {
            prevVolumeSliderValue = volumeSlider.value;
            volumeSlider.value = 0; // Set volume slider value to 0 when muted
        } else {
            // If unmuting, restore the previous volume slider value
            volumeSlider.value = prevVolumeSliderValue;
        }

        // Update volume display
        updateVolumeDisplay();
    }
}


// Function to play a random note
function playRandomNote() {
    // Check if audio context is initialized
    if (!audioContext) {
        console.error('AudioContext not initialized. Initializing now...');
        initAudio(); // Initialize audio context if not already initialized
    }

    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine'; // Change oscillator type here if needed

    // Define an array of frequencies corresponding to notes in a musical scale (e.g., C4 to C5)
    const frequencies = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];

    // Randomly select a frequency from the array
    const randomFrequency = frequencies[Math.floor(Math.random() * frequencies.length)];

    // Use the selected frequency to generate a note
    oscillator.frequency.setValueAtTime(randomFrequency, audioContext.currentTime);

    // Set gain value based on volume slider
    const volume = parseFloat(document.getElementById('volumeSlider').value);
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);

    oscillator.connect(gainNode);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.05); // Adjust note duration as needed
}

// Function to update volume display
function updateVolumeDisplay() {
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeDisplay = document.getElementById('volumeDisplay');
    const volume = parseFloat(volumeSlider.value).toFixed(2); // Format volume to 2 decimal places
    volumeDisplay.textContent = volume;
}

// Function to save volume to local storage
function saveVolumeToLocalStorage() {
    const volume = parseFloat(document.getElementById('volumeSlider').value);
    localStorage.setItem('volume', volume);
}

// Function to load volume from local storage
function loadVolumeFromLocalStorage() {
    const volume = localStorage.getItem('volume');
    if (volume !== null) {
        document.getElementById('volumeSlider').value = volume;
        updateVolumeDisplay(); // Update volume display
    }
}

// Add event listener to update volume when slider value changes
document.getElementById('volumeSlider').addEventListener('input', function() {
    const volumeSlider = document.getElementById('volumeSlider');
    const volume = parseFloat(volumeSlider.value);

    // If the mute button is not pressed, allow setting the volume
    if (!isMuted) {
        // Ensure volume is not set to 0
        if (volume === 0) {
            // If volume is 0, set it to a small non-zero value
            volumeSlider.value = 0.01;
        }
        gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
        updateVolumeDisplay(); // Update volume display
        saveVolumeToLocalStorage(); // Save volume to local storage
    }
});

loadVolumeFromLocalStorage();

// Add event listener to toggle mute/unmute when the mute button is clicked
const muteButton = document.getElementById('muteButton');
muteButton.addEventListener('click', toggleMute);

export { playRandomNote, initAudio };
