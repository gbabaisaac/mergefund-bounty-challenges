// Audio context
let audioContext;
let shootSound, explosionSound, collectSound, victorySound;

// Initialize audio
function initAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create sound effects
        shootSound = createBeep(800, 0.1);
        explosionSound = createBeep(200, 0.2);
        collectSound = createBeep(1200, 0.15);
        victorySound = createBeep(400, 0.5);
    } catch (e) {
        console.log('Audio not supported');
    }
}

// Create beep sound
function createBeep(frequency, duration) {
    return function() {
        if (!audioContext) return;
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'square';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
    };
} 