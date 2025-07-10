/**
 * MergeFund Word Quest - Web Game
 * Interactive HTML5 Canvas game for the MergeFund Challenge
 */

class MergeFundWordQuest {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gameState = 'start'; // 'start', 'playing', 'victory'
        
        // Game dimensions
        this.cellSize = 25;
        this.cols = Math.floor(this.canvas.width / this.cellSize);
        this.rows = Math.floor(this.canvas.height / this.cellSize);
        
        // Game state
        this.player = { x: 1, y: 1 };
        this.maze = [];
        this.letters = new Map();
        this.collectedLetters = [];
        this.targetWord = "HELLOMERGEFUND";
        this.score = 0;
        this.animationFrame = null;
        
        // Animation properties
        this.playerAnimation = { offset: 0, direction: 1 };
        this.letterAnimations = new Map();
        this.particleSystem = [];
        
        this.initializeGame();
        this.setupEventListeners();
        this.gameLoop();
    }
    
    initializeGame() {
        this.generateMaze();
        this.placeMazeLetters();
        this.updateUI();
    }
    
    generateMaze() {
        // Initialize maze with walls
        this.maze = Array(this.rows).fill().map(() => Array(this.cols).fill(1));
        
        // Create paths using recursive backtracking
        const stack = [];
        const visited = Array(this.rows).fill().map(() => Array(this.cols).fill(false));
        
        const startX = 1;
        const startY = 1;
        this.maze[startY][startX] = 0;
        visited[startY][startX] = true;
        stack.push([startX, startY]);
        
        const directions = [[0, -2], [2, 0], [0, 2], [-2, 0]];
        
        while (stack.length > 0) {
            const [currentX, currentY] = stack[stack.length - 1];
            const neighbors = [];
            
            for (const [dx, dy] of directions) {
                const newX = currentX + dx;
                const newY = currentY + dy;
                
                if (newX >= 1 && newX < this.cols - 1 && 
                    newY >= 1 && newY < this.rows - 1 && 
                    !visited[newY][newX]) {
                    neighbors.push([newX, newY, currentX + dx/2, currentY + dy/2]);
                }
            }
            
            if (neighbors.length > 0) {
                const [newX, newY, wallX, wallY] = neighbors[Math.floor(Math.random() * neighbors.length)];
                this.maze[newY][newX] = 0;
                this.maze[wallY][wallX] = 0;
                visited[newY][newX] = true;
                stack.push([newX, newY]);
            } else {
                stack.pop();
            }
        }
        
        // Add some random connections for more open maze
        for (let i = 0; i < Math.floor(this.rows * this.cols * 0.05); i++) {
            const x = Math.floor(Math.random() * (this.cols - 2)) + 1;
            const y = Math.floor(Math.random() * (this.rows - 2)) + 1;
            this.maze[y][x] = 0;
        }
    }
    
    placeMazeLetters() {
        this.letters.clear();
        const availableSpaces = [];
        
        // Find all empty spaces (excluding player start position)
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                if (this.maze[y][x] === 0 && !(x === 1 && y === 1)) {
                    availableSpaces.push({x, y});
                }
            }
        }
        
        // Shuffle and place letters
        for (let i = availableSpaces.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [availableSpaces[i], availableSpaces[j]] = [availableSpaces[j], availableSpaces[i]];
        }
        
        for (let i = 0; i < Math.min(this.targetWord.length, availableSpaces.length); i++) {
            const pos = availableSpaces[i];
            const letter = this.targetWord[i];
            this.letters.set(`${pos.x},${pos.y}`, letter);
            
            // Initialize letter animation
            this.letterAnimations.set(`${pos.x},${pos.y}`, {
                bounce: Math.random() * Math.PI * 2,
                color: this.getRandomColor(),
                collected: false
            });
        }
    }
    
    getRandomColor() {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (this.gameState !== 'playing') return;
            
            const key = e.key.toLowerCase();
            switch (key) {
                case 'w':
                case 'arrowup':
                    this.movePlayer(0, -1);
                    e.preventDefault();
                    break;
                case 's':
                case 'arrowdown':
                    this.movePlayer(0, 1);
                    e.preventDefault();
                    break;
                case 'a':
                case 'arrowleft':
                    this.movePlayer(-1, 0);
                    e.preventDefault();
                    break;
                case 'd':
                case 'arrowright':
                    this.movePlayer(1, 0);
                    e.preventDefault();
                    break;
            }
        });
        
        // Mobile controls
        document.querySelectorAll('.d-pad-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (this.gameState !== 'playing') return;
                
                const direction = e.target.dataset.direction;
                switch (direction) {
                    case 'up': this.movePlayer(0, -1); break;
                    case 'down': this.movePlayer(0, 1); break;
                    case 'left': this.movePlayer(-1, 0); break;
                    case 'right': this.movePlayer(1, 0); break;
                }
            });
        });
        
        // Game controls
        document.getElementById('startButton').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('playAgainButton').addEventListener('click', () => {
            this.resetGame();
        });
        
        // Touch controls for mobile
        let touchStartX = 0;
        let touchStartY = 0;
        
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            if (this.gameState !== 'playing') return;
            e.preventDefault();
            
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const dx = touchEndX - touchStartX;
            const dy = touchEndY - touchStartY;
            
            if (Math.abs(dx) > Math.abs(dy)) {
                this.movePlayer(dx > 0 ? 1 : -1, 0);
            } else {
                this.movePlayer(0, dy > 0 ? 1 : -1);
            }
        });
    }
    
    movePlayer(dx, dy) {
        const newX = this.player.x + dx;
        const newY = this.player.y + dy;
        
        // Check bounds and walls
        if (newX >= 0 && newX < this.cols && 
            newY >= 0 && newY < this.rows && 
            this.maze[newY][newX] === 0) {
            
            this.player.x = newX;
            this.player.y = newY;
            
            // Check for letter collection
            const letterKey = `${newX},${newY}`;
            if (this.letters.has(letterKey)) {
                const letter = this.letters.get(letterKey);
                this.collectLetter(letter, newX, newY);
                this.letters.delete(letterKey);
                
                // Mark animation as collected
                if (this.letterAnimations.has(letterKey)) {
                    this.letterAnimations.get(letterKey).collected = true;
                }
            }
        }
    }
    
    collectLetter(letter, x, y) {
        this.collectedLetters.push(letter);
        this.score += 100;
        this.updateUI();
        
        // Create collection particles
        for (let i = 0; i < 8; i++) {
            this.particleSystem.push({
                x: x * this.cellSize + this.cellSize / 2,
                y: y * this.cellSize + this.cellSize / 2,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                life: 30,
                maxLife: 30,
                color: this.getRandomColor()
            });
        }
        
        // Check win condition
        if (this.collectedLetters.length === this.targetWord.length) {
            setTimeout(() => this.winGame(), 500);
        }
    }
    
    updateUI() {
        document.getElementById('collected-letters').textContent = this.collectedLetters.join('');
        document.getElementById('progress-counter').textContent = 
            `(${this.collectedLetters.length}/${this.targetWord.length})`;
        document.getElementById('score').textContent = this.score;
    }
    
    startGame() {
        this.gameState = 'playing';
        document.getElementById('gameOverlay').style.display = 'none';
        document.getElementById('mobileControls').style.display = 'block';
    }
    
    winGame() {
        this.gameState = 'victory';
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('victoryScreen').classList.remove('hidden');
        document.getElementById('gameOverlay').style.display = 'flex';
        document.getElementById('mobileControls').style.display = 'none';
        
        this.animateVictoryMessage();
    }
    
    animateVictoryMessage() {
        const letters = document.querySelectorAll('.reveal-letter');
        letters.forEach((letter, index) => {
            setTimeout(() => {
                letter.style.animationDelay = `${index * 0.1}s`;
                letter.classList.add('animate');
            }, index * 100);
        });
    }
    
    resetGame() {
        this.gameState = 'start';
        this.player = { x: 1, y: 1 };
        this.collectedLetters = [];
        this.score = 0;
        this.particleSystem = [];
        
        document.getElementById('victoryScreen').classList.add('hidden');
        document.getElementById('startScreen').style.display = 'block';
        document.getElementById('gameOverlay').style.display = 'flex';
        document.getElementById('mobileControls').style.display = 'none';
        
        // Reset victory animation
        document.querySelectorAll('.reveal-letter').forEach(letter => {
            letter.classList.remove('animate');
        });
        
        this.initializeGame();
    }
    
    gameLoop() {
        this.update();
        this.render();
        this.animationFrame = requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        // Update animations
        this.playerAnimation.offset += this.playerAnimation.direction * 0.1;
        if (this.playerAnimation.offset > 1 || this.playerAnimation.offset < -1) {
            this.playerAnimation.direction *= -1;
        }
        
        // Update letter animations
        this.letterAnimations.forEach((anim, key) => {
            anim.bounce += 0.15;
        });
        
        // Update particles
        this.particleSystem = this.particleSystem.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vx *= 0.95;
            particle.vy *= 0.95;
            particle.life--;
            return particle.life > 0;
        });
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#2C3E50';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.renderMaze();
        this.renderLetters();
        this.renderPlayer();
        this.renderParticles();
        this.renderUI();
    }
    
    renderMaze() {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                if (this.maze[y][x] === 1) {
                    // Wall
                    this.ctx.fillStyle = '#34495E';
                    this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
                    
                    // Wall border
                    this.ctx.strokeStyle = '#2C3E50';
                    this.ctx.lineWidth = 1;
                    this.ctx.strokeRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
                } else {
                    // Floor
                    this.ctx.fillStyle = '#ECF0F1';
                    this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
                }
            }
        }
    }
    
    renderLetters() {
        this.letters.forEach((letter, key) => {
            const [x, y] = key.split(',').map(Number);
            const anim = this.letterAnimations.get(key);
            
            if (anim && !anim.collected) {
                const centerX = x * this.cellSize + this.cellSize / 2;
                const centerY = y * this.cellSize + this.cellSize / 2;
                const bounceOffset = Math.sin(anim.bounce) * 3;
                
                // Letter shadow
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                this.ctx.font = '16px bold Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(letter, centerX + 1, centerY + bounceOffset + 1);
                
                // Letter
                this.ctx.fillStyle = anim.color;
                this.ctx.fillText(letter, centerX, centerY + bounceOffset);
                
                // Glow effect
                this.ctx.shadowColor = anim.color;
                this.ctx.shadowBlur = 10;
                this.ctx.fillText(letter, centerX, centerY + bounceOffset);
                this.ctx.shadowBlur = 0;
            }
        });
    }
    
    renderPlayer() {
        const centerX = this.player.x * this.cellSize + this.cellSize / 2;
        const centerY = this.player.y * this.cellSize + this.cellSize / 2;
        const bounceOffset = this.playerAnimation.offset * 2;
        
        // Player shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.beginPath();
        this.ctx.arc(centerX + 1, centerY + bounceOffset + 1, 8, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Player
        this.ctx.fillStyle = '#E74C3C';
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY + bounceOffset, 8, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Player glow
        this.ctx.shadowColor = '#E74C3C';
        this.ctx.shadowBlur = 15;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY + bounceOffset, 8, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
        
        // Player face
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.beginPath();
        this.ctx.arc(centerX - 2, centerY + bounceOffset - 2, 1.5, 0, Math.PI * 2);
        this.ctx.arc(centerX + 2, centerY + bounceOffset - 2, 1.5, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    renderParticles() {
        this.particleSystem.forEach(particle => {
            const alpha = particle.life / particle.maxLife;
            this.ctx.fillStyle = particle.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, 3 * alpha, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    renderUI() {
        if (this.gameState === 'playing') {
            // Mini-map or additional UI elements could go here
        }
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MergeFundWordQuest();
});