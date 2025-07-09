// Game state
let canvas, ctx;
let gameRunning = true;
let progress = 0;
let collectedLetters = new Set();
let collectedIndices = new Set();
let gameOver = false;
let victoryMode = false;
let restartPromptShown = false;

// Player
let player = {
    x: 400,
    y: 550,
    width: 30,
    height: 20,
    speed: 5,
    color: '#0f0'
};

// Game objects
let bullets = [];
let enemies = [];
let explosions = [];

// Controls
let keys = {};

// Initialize game
function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    // Initialize audio
    initAudio();
    
    // Event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    // Start game loop
    gameLoop();
    
    // Spawn enemies periodically
    setInterval(spawnEnemy, 2000);
}

// Start the game when page loads
window.addEventListener('load', init); 