// Shoot bullet
function shoot() {
    if (shootSound) shootSound();
    
    bullets.push({
        x: player.x + player.width / 2,
        y: player.y,
        width: 2,
        height: 8,
        speed: 8,
        color: '#b18cff' // purple accent
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

// Create explosion effect
function createExplosion(x, y) {
    explosions.push({
        x: x,
        y: y,
        life: 10,
        maxLife: 10
    });
}

// Check collision between two objects
function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
} 