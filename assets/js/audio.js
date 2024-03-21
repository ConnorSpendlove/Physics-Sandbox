// Function to play audio
function playRandomNote() {
    // Initialize audio context
    const audioContext = new AudioContext();

    // Create oscillator node
    const oscillator = audioContext.createOscillator();

    // Create gain node for controlling volume
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.05; // Adjust volume here

    // Connect oscillator to gain node and gain node to destination
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Set oscillator type to sine wave for a smoother sound
    oscillator.type = 'sine';

    // Generate a random frequency between 200 and 800 Hz for a pleasing pitch
   // Define an array of frequencies corresponding to notes in a musical scale (e.g., C4 to C5)
const frequencies = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];

// Randomly select a frequency from the array
const randomFrequency = frequencies[Math.floor(Math.random() * frequencies.length)];

// Use the selected frequency to generate a note
oscillator.frequency.setValueAtTime(randomFrequency, audioContext.currentTime);


    // Set attack and release times for smoother sound
    const attackTime = 0.05; // 50 milliseconds
    const releaseTime = 0.1; // 200 milliseconds
    gainNode.gain.setTargetAtTime(1, audioContext.currentTime, attackTime);
    gainNode.gain.setTargetAtTime(0, audioContext.currentTime + attackTime, releaseTime);

    // Start the oscillator
    oscillator.start();

    // Stop the oscillator after release time + 50 milliseconds buffer
    const duration = (attackTime + releaseTime + 0.05) * 1000; // Convert to milliseconds
    setTimeout(() => {
        oscillator.stop();
        audioContext.close();
    }, duration);
}

export { playRandomNote };
