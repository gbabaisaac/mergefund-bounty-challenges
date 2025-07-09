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

// Audio context
let audioContext;
let shootSound, explosionSound, collectSound, victorySound, fireworkSound;

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

// Initialize audio
function initAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create sound effects
        shootSound = createBeep(800, 0.1);
        explosionSound = createBeep(200, 0.2);
        collectSound = createBeep(1200, 0.15);
        victorySound = createBeep(400, 0.5);
        fireworkSound = createBeep(600, 0.1);
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

// Handle key down
function handleKeyDown(e) {
    keys[e.code] = true;
    
    if (e.code === 'Space') {
        e.preventDefault();
        if (gameRunning) {
            shoot();
        } else if (victoryMode && restartPromptShown) {
            restartGame();
        }
    }
}

// Handle key up
function handleKeyUp(e) {
    keys[e.code] = false;
}

// Shoot bullet
function shoot() {
    if (shootSound) shootSound();
    
    bullets.push({
        x: player.x + player.width / 2,
        y: player.y,
        width: 2,
        height: 8,
        speed: 8,
        color: '#0f0'
    });
}

// Spawn enemy
function spawnEnemy() {
    if (!gameRunning) return;
    
    const letters = ['H', 'e', 'l', 'l', 'o', ' ', 'M', 'e', 'r', 'g', 'e', 'F', 'u', 'n', 'd'];
    const availableIndices = [];
    
    // Find available letter indices (not yet collected)
    for (let i = 0; i < letters.length; i++) {
        if (!collectedIndices.has(i)) {
            availableIndices.push(i);
        }
    }
    
    if (availableIndices.length === 0) {
        // All letters collected, spawn regular enemies
        enemies.push({
            x: Math.random() * (canvas.width - 20),
            y: -20,
            width: 20,
            height: 20,
            speed: 1 + Math.random() * 2,
            color: '#f00',
            letter: null,
            letterIndex: null
        });
    } else {
        // Spawn letter enemy
        const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        const letter = letters[randomIndex];
        enemies.push({
            x: Math.random() * (canvas.width - 20),
            y: -20,
            width: 20,
            height: 20,
            speed: 1 + Math.random() * 2,
            color: '#ff0',
            letter: letter,
            letterIndex: randomIndex
        });
    }
}

// Update game objects
function update() {
    if (!gameRunning) return;
    
    // Update player
    if (keys['ArrowLeft'] && player.x > 0) {
        player.x -= player.speed;
    }
    if (keys['ArrowRight'] && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }
    
    // Update bullets
    bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        if (bullet.y < 0) {
            bullets.splice(index, 1);
        }
    });
    
    // Update enemies
    enemies.forEach((enemy, index) => {
        enemy.y += enemy.speed;
        
        // Check if enemy hits player
        if (checkCollision(enemy, player)) {
            enemies.splice(index, 1);
            createExplosion(player.x + player.width / 2, player.y);
            if (explosionSound) explosionSound();
            // Player respawns automatically
        }
        
        // Remove enemies that go off screen
        if (enemy.y > canvas.height) {
            enemies.splice(index, 1);
        }
    });
    
    // Check bullet-enemy collisions
    bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            if (checkCollision(bullet, enemy)) {
                // Remove bullet and enemy
                bullets.splice(bulletIndex, 1);
                enemies.splice(enemyIndex, 1);
                
                // Create explosion
                createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
                if (explosionSound) explosionSound();
                
                // Handle letter collection
                if (enemy.letter && enemy.letterIndex !== null) {
                    collectedIndices.add(enemy.letterIndex);
                    updateLetterDisplay();
                    updateProgress();
                    if (collectSound) collectSound();
                }
                
                // Check if all letters collected
                if (collectedIndices.size >= 15) {
                    victory();
                }
            }
        });
    });
    
    // Update explosions
    explosions.forEach((explosion, index) => {
        explosion.life--;
        if (explosion.life <= 0) {
            explosions.splice(index, 1);
        }
    });
    
    // Update progress display
    document.getElementById('progress').textContent = progress;
}

// Check collision between two objects
function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

// Create explosion effect
function createExplosion(x, y) {
    explosions.push({
        x: x,
        y: y,
        life: 10,
        maxLife: 10
    });
}

// Update letter display
function updateLetterDisplay() {
    const letterElements = document.querySelectorAll('.letter');
    letterElements.forEach(element => {
        const index = parseInt(element.getAttribute('data-index'));
        if (collectedIndices.has(index)) {
            element.classList.add('collected');
        }
    });
}

// Update progress
function updateProgress() {
    progress = Math.round((collectedIndices.size / 15) * 100);
}

// Victory function
function victory() {
    gameRunning = false;
    victoryMode = true;
    if (victorySound) victorySound();
    
    setTimeout(() => {
        document.getElementById('gameOver').classList.remove('hidden');
        startFireworks();
        
        setTimeout(() => {
            restartPromptShown = true;
            document.querySelector('.restart-prompt').classList.remove('hidden');
        }, 5000);
    }, 1000);
}

// --- Firework Animation ---
let canvasFireworks = [];

function startFireworks() {
    // Use canvas-based fireworks
    canvasFireworks = [];
    let fireworkCount = 0;
    function launchFirework() {
        if (!victoryMode || fireworkCount >= 6) return;
        const cx = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
        const cy = Math.random() * canvas.height * 0.3 + canvas.height * 0.1;
        const color = ['#ff0', '#f80', '#f00', '#80f', '#0ff', '#0f0'][Math.floor(Math.random()*6)];
        const particles = [];
        for (let i = 0; i < 24; i++) {
            const angle = (i / 24) * Math.PI * 2;
            const speed = 2 + Math.random() * 2;
            particles.push({
                x: cx, y: cy,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color,
                alpha: 1,
                life: 0
            });
        }
        canvasFireworks.push({particles, time: 0});
        if (fireworkSound) fireworkSound();
        fireworkCount++;
        setTimeout(launchFirework, 800 + Math.random()*400);
    }
    launchFirework();
}

function drawFireworks() {
    for (let fw of canvasFireworks) {
        for (let p of fw.particles) {
            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, 3, 3);
            ctx.restore();
        }
    }
}

function updateFireworks() {
    for (let fw of canvasFireworks) {
        for (let p of fw.particles) {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.05; // gravity
            p.life++;
            if (p.life > 30) p.alpha -= 0.03;
        }
    }
    // Remove finished fireworks
    canvasFireworks = canvasFireworks.filter(fw => fw.particles.some(p => p.alpha > 0));
}

// Restart game
function restartGame() {
    gameRunning = true;
    victoryMode = false;
    restartPromptShown = false;
    progress = 0;
    collectedLetters.clear();
    collectedIndices.clear();
    bullets = [];
    enemies = [];
    explosions = [];
    
    // Reset player position
    player.x = 400;
    player.y = 550;
    
    // Reset letter display
    document.querySelectorAll('.letter').forEach(element => {
        element.classList.remove('collected');
    });
    
    // Hide game over screen
    document.getElementById('gameOver').classList.add('hidden');
    document.querySelector('.restart-prompt').classList.add('hidden');
}

// Draw game objects
function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw stars background
    drawStars();
    
    // Draw player
    drawPlayer();
    
    // Draw bullets
    bullets.forEach(bullet => {
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
    
    // Draw enemies
    enemies.forEach(enemy => {
        if (enemy.letter) {
            // Draw letter enemy
            ctx.fillStyle = enemy.color;
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            ctx.fillStyle = '#000';
            ctx.font = '12px "Press Start 2P"';
            ctx.textAlign = 'center';
            ctx.fillText(enemy.letter, enemy.x + enemy.width / 2, enemy.y + enemy.height / 2 + 4);
        } else {
            // Draw regular enemy
            ctx.fillStyle = enemy.color;
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        }
    });
    
    // Draw explosions
    explosions.forEach(explosion => {
        const alpha = explosion.life / explosion.maxLife;
        ctx.fillStyle = `rgba(255, 255, 0, ${alpha})`;
        ctx.beginPath();
        ctx.arc(explosion.x, explosion.y, (explosion.maxLife - explosion.life) * 2, 0, Math.PI * 2);
        ctx.fill();
    });
    drawFireworks();
}

// Draw player
function drawPlayer() {
    const x = Math.round(player.x);
    const y = Math.round(player.y);
    // Pixel art ship (11x16 grid, scale 2x)
    // 0: transparent, 1: blue, 2: red
    const shipPixels = [
        [0,0,0,0,1,1,1,0,0,0,0],
        [0,0,0,0,1,1,1,0,0,0,0],
        [0,0,0,0,1,1,1,0,0,0,0],
        [0,0,0,1,1,1,1,1,0,0,0],
        [0,0,0,1,1,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,1,1,0,0],
        [0,0,1,1,2,1,2,1,1,0,0],
        [0,1,1,1,1,1,1,1,1,1,0],
        [0,1,1,2,1,2,1,2,1,1,0],
        [1,1,1,1,1,1,1,1,1,1,1],
        [1,1,2,1,1,1,1,1,2,1,1],
        [1,1,1,2,2,1,2,2,1,1,1],
        [0,0,1,1,0,0,0,1,1,0,0],
        [0,0,1,2,0,0,0,2,1,0,0],
        [0,0,1,2,0,0,0,2,1,0,0],
        [0,0,1,0,0,0,0,0,1,0,0],
    ];
    const scale = 2;
    for (let row = 0; row < shipPixels.length; row++) {
        for (let col = 0; col < shipPixels[row].length; col++) {
            let color = null;
            if (shipPixels[row][col] === 1) color = '#cbe8fa';
            if (shipPixels[row][col] === 2) color = '#f26a5e';
            if (color) {
                ctx.fillStyle = color;
                ctx.fillRect(x + col * scale, y + row * scale, scale, scale);
            }
        }
    }
}

// Draw stars background
function drawStars() {
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 50; i++) {
        const x = (i * 37) % canvas.width;
        const y = (i * 73) % canvas.height;
        ctx.fillRect(x, y, 1, 1);
    }
}

// Game loop
function gameLoop() {
    update();
    updateFireworks();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game when page loads
window.addEventListener('load', init); 