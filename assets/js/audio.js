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

    // Set oscillator type to square wave
    oscillator.type = 'sine'; // Use a sine wave for a smoother sound

    // Generate a random frequency between 200 and 800 Hz for a satisfying pitch
    const frequency = Math.random() * (800 - 200) + 200;
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

    // Start the oscillator
    oscillator.start();

    // Stop the oscillator after a certain duration (e.g., 500 milliseconds)
    const duration = 150; // 500 milliseconds
    setTimeout(() => {
        oscillator.stop();
        audioContext.close();
    }, duration);
}

export { playRandomNote };
