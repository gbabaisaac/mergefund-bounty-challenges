// Update letter display
function updateLetterDisplay() {
    const letterElements = document.querySelectorAll('.letter');
    letterElements.forEach(element => {
        const index = parseInt(element.getAttribute('data-index'));
        if (collectedIndices.has(index)) {
            element.classList.add('collected');
            element.style.background = '#b18cff';
            element.style.color = '#fff';
            element.style.borderColor = '#b18cff';
            element.style.boxShadow = '0 0 10px #b18cff, 0 0 20px #b18cff';
        } else {
            element.classList.remove('collected');
            element.style.background = '';
            element.style.color = '';
            element.style.borderColor = '';
            element.style.boxShadow = '';
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
        startVictoryFireworks();
        setTimeout(() => {
            restartPromptShown = true;
            document.querySelector('.restart-prompt').classList.remove('hidden');
        }, 8000);
    }, 1000);
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
        element.style.background = '';
        element.style.color = '';
        element.style.borderColor = '';
        element.style.boxShadow = '';
    });
    
    // Hide game over screen
    document.getElementById('gameOver').classList.add('hidden');
    document.querySelector('.restart-prompt').classList.add('hidden');
    const fwCanvas = document.getElementById('fireworksCanvas');
    if (fwCanvas) {
        fwCanvas.style.display = 'none';
    }
    stopVictoryFireworks();
} 