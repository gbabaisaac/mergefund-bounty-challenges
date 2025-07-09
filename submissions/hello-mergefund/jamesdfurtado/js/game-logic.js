function update() {
    if (!gameRunning) return;
    
    // Handle player movement with boundary checking
    if (keys['ArrowLeft'] && player.x > 0) {
        player.x -= player.speed;
    }
    if (keys['ArrowRight'] && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }
    
    // Move bullets upward and remove off-screen bullets
    bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        if (bullet.y < 0) {
            bullets.splice(index, 1);
        }
    });
    
    // Move enemies downward and handle player collisions
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
    
    // Check bullet-enemy collisions and handle letter collection
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
    
    // Update explosion animations and remove expired ones
    explosions.forEach((explosion, index) => {
        explosion.life--;
        if (explosion.life <= 0) {
            explosions.splice(index, 1);
        }
    });
    
    // Update progress display
    document.getElementById('progress').textContent = progress;
} 