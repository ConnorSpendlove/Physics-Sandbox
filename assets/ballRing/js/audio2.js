// Define the AudioContext and gainNode variables globally
let audioCtx = null;
let gainNode = null;
let isMuted = false; // Flag to track mute state
let prevVolumeSliderValue = 0.1

// Function to initialize the audio context and gain node
function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        gainNode = audioCtx.createGain(); // Create a gain node for volume control
        gainNode.connect(audioCtx.destination);
        // Load volume from local storage
        loadVolumeFromLocalStorage();
        // Update volume display
        updateVolumeDisplay();
    }
}
function updateVolume() {
    if (!audioCtx) {
        // Initialize the AudioContext if it's not already initialized
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    if (!gainNode) {
        // Create a gain node if it's not already created
        gainNode = audioCtx.createGain();
    }
    
    // Update the gain value
    const volumeSlider = document.getElementById('volumeSlider');
    const volume = parseFloat(volumeSlider.value);
    gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
    updateVolumeDisplay(); // Update volume display
    saveVolumeToLocalStorage(); // Save volume to local storage
}

// Add event listener to update volume when slider value changes
document.getElementById('volumeSlider').addEventListener('input', updateVolume);

// Function to toggle mute/unmute when the mute button is clicked
function toggleMute() {
    isMuted = !isMuted;
    const volumeSlider = document.getElementById('volumeSlider');
    if (isMuted) {
        prevVolumeSliderValue = volumeSlider.value;
        volumeSlider.value = 0; // Set volume slider value to 0 when muted
    } else {
        volumeSlider.value = prevVolumeSliderValue; // Restore previous volume slider value
    }
    updateVolume(); // Update volume
}

// Add event listener to toggle mute/unmute when the mute button is clicked
document.getElementById('muteButton').addEventListener('click', toggleMute);

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

// Function to play a random note
function playRandomNote() {
    // Check if audio context is initialized
    if (!audioCtx) {
        console.error('AudioContext not initialized. Initializing now...');
        initAudio(); // Initialize audio context if not already initialized
    }

    const oscillator = audioCtx.createOscillator();

    // Choose a random waveform type;
    oscillator.type = 'sine';

    // Define an array of frequencies corresponding to notes in a wider musical scale
    const frequencies = [130.81, 146.83, 164.81, 174.61, 196.00, 220.00, 246.94, 261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];

    // Randomly select a frequency from the array
    const randomFrequency = frequencies[Math.floor(Math.random() * frequencies.length)];

    // Use the selected frequency to generate a note
    oscillator.frequency.setValueAtTime(randomFrequency, audioCtx.currentTime);

    // Apply envelope to control volume over time
    const attackTime = 0.1; // Duration for volume ramp-up (in seconds)
    const releaseTime = 0.; // Duration for volume ramp-down (in seconds)

    oscillator.connect(gainNode);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + attackTime + releaseTime); // Adjust note duration as needed
}

export { playRandomNote, initAudio };
