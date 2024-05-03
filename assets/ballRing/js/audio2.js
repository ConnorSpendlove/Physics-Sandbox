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

    // Create an oscillator
    const oscillator = audioCtx.createOscillator();

    // Choose a random waveform type
    oscillator.type = 'triangle';

    // Define an array of frequencies corresponding to notes in a wider musical scale
    const frequencies = [
        130.81, // C3
        138.59, // C#3/D♭3
        146.83, // D3
        155.56, // D#3/E♭3
        164.81, // E3
        174.61, // F3
        185.00, // F#3/G♭3
        196.00, // G3
        207.65, // G#3/A♭3
        220.00, // A3
        233.08, // A#3/B♭3
        246.94, // B3
        261.63, // C4
        277.18, // C#4/D♭4
        293.66, // D4
        311.13, // D#4/E♭4
        329.63, // E4
        349.23, // F4
        369.99, // F#4/G♭4
        392.00, // G4
        415.30, // G#4/A♭4
        440.00, // A4
        466.16, // A#4/B♭4
        493.88, // B4
        523.25, // C5
        554.37, // C#5/D♭5
        587.33, // D5
        622.25, // D#5/E♭5
        659.25, // E5

    ];
    

    // Randomly select a frequency from the array
    const randomFrequency = frequencies[Math.floor(Math.random() * frequencies.length)];

    // Use the selected frequency to generate a note
    oscillator.frequency.setValueAtTime(randomFrequency, audioCtx.currentTime);

    // Apply envelope to control volume over time
    const attackTime = 0.001; // Duration for volume ramp-up (in seconds)
    const releaseTime = 0.08; // Duration for volume ramp-down (in seconds)

    // Set up gain node for volume control
    const gainNode = audioCtx.createGain();
    gainNode.connect(audioCtx.destination);

    // Ramp up volume
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + attackTime);

    // Ramp down volume
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + attackTime + releaseTime);

    // Connect oscillator to gain node
    oscillator.connect(gainNode);

    // Start and stop the oscillator to play the note
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + attackTime + releaseTime); // Adjust note duration as needed
}


export { playRandomNote, initAudio };