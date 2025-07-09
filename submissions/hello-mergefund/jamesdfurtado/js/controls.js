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
    if (e.code === 'KeyS') {
        // Skip to end screen: fill all letters and trigger victory
        if (gameRunning) {
            for (let i = 0; i < 15; i++) collectedIndices.add(i);
            updateLetterDisplay();
            updateProgress();
            victory();
        }
    }
}

function handleKeyUp(e) {
    keys[e.code] = false;
} 