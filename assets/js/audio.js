// Define the AudioContext and gainNode variables globally
let audioContext = null;
let gainNode = null;

// Function to initialize the audio context and gain node
function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);
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

// Add event listener to update volume when slider value changes
document.getElementById('volumeSlider').addEventListener('input', function() {
    const volume = parseFloat(this.value);
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
});

export { playRandomNote, initAudio };
