// Core game state variables
let canvas, ctx;
let gameRunning = true;
let progress = 0;
let collectedIndices = new Set();
let victoryMode = false;
let restartPromptShown = false;

// Player object with position and movement properties
let player = {
    x: 400,
    y: 550,
    width: 30,
    height: 20,
    speed: 5
};

// Dynamic game objects arrays
let bullets = [];
let enemies = [];
let explosions = [];

// Keyboard input tracking
let keys = {};

function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    initAudio();
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    gameLoop();
    
    // Spawn enemies every 2 seconds
    setInterval(spawnEnemy, 2000);
}

window.addEventListener('load', init); 