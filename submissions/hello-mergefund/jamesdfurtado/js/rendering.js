function draw() {
    // Clear canvas with black background
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    drawStars();
    drawPlayer();
    
    // Draw bullets
    bullets.forEach(bullet => {
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
    
    // Draw enemies with letter or regular variants
    enemies.forEach(enemy => {
        if (enemy.letter) {
            // Draw letter enemy with text
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
    
    // Draw explosion effects with fade-out animation
    explosions.forEach(explosion => {
        const alpha = explosion.life / explosion.maxLife;
        ctx.fillStyle = `rgba(255, 255, 0, ${alpha})`;
        ctx.beginPath();
        ctx.arc(explosion.x, explosion.y, (explosion.maxLife - explosion.life) * 2, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawPlayer() {
    const x = Math.round(player.x);
    const y = Math.round(player.y);
    // Pixel art ship (11x16 grid, scale 2x)
    // 0: transparent, 1: purple, 2: accent purple
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
            if (shipPixels[row][col] === 1) color = '#b18cff';
            if (shipPixels[row][col] === 2) color = '#a07be6';
            if (color) {
                ctx.fillStyle = color;
                ctx.fillRect(x + col * scale, y + row * scale, scale, scale);
            }
        }
    }
}

function drawStars() {
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 50; i++) {
        const x = (i * 37) % canvas.width;
        const y = (i * 73) % canvas.height;
        ctx.fillRect(x, y, 1, 1);
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
} 