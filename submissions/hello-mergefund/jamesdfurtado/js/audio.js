// Web Audio API context and sound effect functions
let audioContext;
let shootSound, explosionSound, collectSound, victorySound;

function initAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create different sound effects with varying frequencies and durations
        shootSound = createBeep(800, 0.1);
        explosionSound = createBeep(200, 0.2);
        collectSound = createBeep(1200, 0.15);
        victorySound = createBeep(400, 0.5);
    } catch (e) {
        console.log('Audio not supported');
    }
}

// Creates a beep sound using Web Audio API
// Returns a function that can be called to play the sound
function createBeep(frequency, duration) {
    return function() {
        if (!audioContext) return;
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'square';
        
        // Fade out the sound for a more natural effect
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
    };
} 