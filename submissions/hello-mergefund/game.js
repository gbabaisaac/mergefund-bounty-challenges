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
        this.playerAnimation = { offset: 0, direction: 1, trail: [] };
        this.letterAnimations = new Map();
        this.particleSystem = [];
        this.backgroundParticles = [];
        this.lightBeams = [];
        this.glowEffects = [];
        
        // Visual enhancements
        this.time = 0;
        this.cameraShake = { x: 0, y: 0, intensity: 0 };
        
        // Initialize background effects
        this.initializeBackgroundEffects();
        
        this.initializeGame();
        this.setupEventListeners();
        this.setupAudio();
        this.gameLoop();
    }
    
    setupAudio() {
        // Audio context setup for sound effects
        this.audioContext = null;
        this.sounds = {
            collect: null,
            move: null,
            victory: null,
            background: null
        };
        
        // Initialize audio context on first user interaction
        this.audioInitialized = false;
        this.initAudioOnUserInteraction();
    }
    
    initAudioOnUserInteraction() {
        const initAudio = () => {
            if (!this.audioInitialized) {
                try {
                    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    this.createSoundEffects();
                    this.audioInitialized = true;
                    console.log('Audio initialized');
                } catch (e) {
                    console.log('Audio not supported');
                }
                document.removeEventListener('click', initAudio);
                document.removeEventListener('keydown', initAudio);
            }
        };
        
        document.addEventListener('click', initAudio);
        document.addEventListener('keydown', initAudio);
    }
    
    createSoundEffects() {
        // Create simple procedural sound effects using Web Audio API
        // These are placeholders that can be replaced with actual audio files
        
        // Collect sound - a pleasant ding
        this.sounds.collect = () => {
            if (!this.audioContext) return;
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.3);
        };
        
        // Move sound - subtle blip
        this.sounds.move = () => {
            if (!this.audioContext) return;
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.1);
        };
        
        // Victory sound - triumph fanfare
        this.sounds.victory = () => {
            if (!this.audioContext) return;
            const frequencies = [261.63, 329.63, 392.00, 523.25]; // C, E, G, C octave
            
            frequencies.forEach((freq, index) => {
                setTimeout(() => {
                    const oscillator = this.audioContext.createOscillator();
                    const gainNode = this.audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(this.audioContext.destination);
                    
                    oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
                    
                    oscillator.start(this.audioContext.currentTime);
                    oscillator.stop(this.audioContext.currentTime + 0.5);
                }, index * 100);
            });
        };
    }
    
    playSound(soundName) {
        if (this.sounds[soundName] && typeof this.sounds[soundName] === 'function') {
            this.sounds[soundName]();
        }
    }
    
    initializeGame() {
        this.generateMaze();
        this.placeMazeLetters();
        this.updateUI();
        this.initializeBackgroundEffects();
    }
    
    initializeBackgroundEffects() {
        // Create floating background particles
        this.backgroundParticles = [];
        for (let i = 0; i < 50; i++) {
            this.backgroundParticles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 0.5,
                alpha: Math.random() * 0.3 + 0.1,
                color: this.getRandomColor()
            });
        }
        
        // Create light beams
        this.lightBeams = [];
        for (let i = 0; i < 5; i++) {
            this.lightBeams.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                angle: Math.random() * Math.PI * 2,
                length: 100 + Math.random() * 200,
                speed: 0.01 + Math.random() * 0.02,
                alpha: 0.1 + Math.random() * 0.1
            });
        }
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
            
            // Play move sound
            this.playSound('move');
            
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
        
        // Play collect sound
        this.playSound('collect');
        
        // Screen shake effect
        this.cameraShake.intensity = 8;
        
        // Create explosion of particles
        for (let i = 0; i < 20; i++) {
            const angle = (Math.PI * 2 * i) / 20;
            const speed = 3 + Math.random() * 4;
            this.particleSystem.push({
                x: x * this.cellSize + this.cellSize / 2,
                y: y * this.cellSize + this.cellSize / 2,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 40,
                maxLife: 40,
                color: this.getRandomColor(),
                size: 2 + Math.random() * 3
            });
        }
        
        // Create glow effect
        this.glowEffects.push({
            x: x * this.cellSize + this.cellSize / 2,
            y: y * this.cellSize + this.cellSize / 2,
            size: 0,
            maxSize: 50,
            life: 30,
            maxLife: 30,
            color: this.getRandomColor()
        });
        
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
    }
    
    winGame() {
        this.gameState = 'victory';
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('victoryScreen').classList.remove('hidden');
        document.getElementById('gameOverlay').style.display = 'flex';
        
        // Play victory sound
        this.playSound('victory');
        
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
        this.time += 0.016; // Roughly 60fps
        
        // Update animations
        this.playerAnimation.offset += this.playerAnimation.direction * 0.1;
        if (this.playerAnimation.offset > 1 || this.playerAnimation.offset < -1) {
            this.playerAnimation.direction *= -1;
        }
        
        // Update player trail
        this.playerAnimation.trail.push({
            x: this.player.x * this.cellSize + this.cellSize / 2,
            y: this.player.y * this.cellSize + this.cellSize / 2,
            life: 10
        });
        this.playerAnimation.trail = this.playerAnimation.trail.filter(point => {
            point.life--;
            return point.life > 0;
        });
        
        // Update camera shake
        if (this.cameraShake.intensity > 0) {
            this.cameraShake.x = (Math.random() - 0.5) * this.cameraShake.intensity;
            this.cameraShake.y = (Math.random() - 0.5) * this.cameraShake.intensity;
            this.cameraShake.intensity *= 0.9;
            if (this.cameraShake.intensity < 0.1) {
                this.cameraShake.intensity = 0;
                this.cameraShake.x = 0;
                this.cameraShake.y = 0;
            }
        }
        
        // Update letter animations
        this.letterAnimations.forEach((anim, key) => {
            anim.bounce += 0.15;
            anim.pulse = Math.sin(this.time * 3) * 0.2 + 1;
        });
        
        // Update particles
        this.particleSystem = this.particleSystem.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vx *= 0.98;
            particle.vy *= 0.98;
            particle.life--;
            return particle.life > 0;
        });
        
        // Update background particles
        this.backgroundParticles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.alpha = 0.1 + Math.sin(this.time + particle.x * 0.01) * 0.1;
            
            // Wrap around screen
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
        });
        
        // Update light beams
        this.lightBeams.forEach(beam => {
            beam.angle += beam.speed;
            beam.alpha = 0.05 + Math.sin(this.time + beam.angle) * 0.05;
        });
        
        // Update glow effects
        this.glowEffects = this.glowEffects.filter(glow => {
            glow.size += (glow.maxSize - glow.size) * 0.1;
            glow.life--;
            return glow.life > 0;
        });
    }
    
    render() {
        // Save context for camera shake
        this.ctx.save();
        this.ctx.translate(this.cameraShake.x, this.cameraShake.y);
        
        // Clear canvas with animated background
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, '#0F0F0F');
        gradient.addColorStop(0.5, '#1A1A1A');
        gradient.addColorStop(1, '#2C2C2C');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.renderBackgroundEffects();
        this.renderMaze();
        this.renderGlowEffects();
        this.renderLetters();
        this.renderPlayerTrail();
        this.renderPlayer();
        this.renderParticles();
        this.renderUI();
        
        // Restore context
        this.ctx.restore();
    }
    
    renderBackgroundEffects() {
        // Render floating background particles
        this.backgroundParticles.forEach(particle => {
            this.ctx.globalAlpha = particle.alpha;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        // Render light beams
        this.lightBeams.forEach(beam => {
            this.ctx.globalAlpha = beam.alpha;
            this.ctx.strokeStyle = '#4ECDC4';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(beam.x, beam.y);
            this.ctx.lineTo(
                beam.x + Math.cos(beam.angle) * beam.length,
                beam.y + Math.sin(beam.angle) * beam.length
            );
            this.ctx.stroke();
        });
        
        this.ctx.globalAlpha = 1;
    }
    
    renderMaze() {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                if (this.maze[y][x] === 1) {
                    // Wall with gradient and lighting effect
                    const gradient = this.ctx.createLinearGradient(
                        x * this.cellSize, y * this.cellSize,
                        (x + 1) * this.cellSize, (y + 1) * this.cellSize
                    );
                    gradient.addColorStop(0, '#4A4A4A');
                    gradient.addColorStop(0.5, '#3A3A3A');
                    gradient.addColorStop(1, '#2A2A2A');
                    this.ctx.fillStyle = gradient;
                    this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
                    
                    // 3D effect borders
                    this.ctx.strokeStyle = '#5A5A5A';
                    this.ctx.lineWidth = 1;
                    this.ctx.strokeRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
                    
                    // Highlight top-left corner for 3D effect
                    this.ctx.strokeStyle = '#6A6A6A';
                    this.ctx.beginPath();
                    this.ctx.moveTo(x * this.cellSize, y * this.cellSize);
                    this.ctx.lineTo((x + 1) * this.cellSize, y * this.cellSize);
                    this.ctx.moveTo(x * this.cellSize, y * this.cellSize);
                    this.ctx.lineTo(x * this.cellSize, (y + 1) * this.cellSize);
                    this.ctx.stroke();
                } else {
                    // Floor with subtle pattern - darker gray
                    const baseColor = Math.sin(x * 0.1 + y * 0.1 + this.time) * 5 + 80;
                    this.ctx.fillStyle = `rgb(${baseColor}, ${baseColor}, ${baseColor + 5})`;
                    this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
                    
                    // Subtle grid pattern
                    this.ctx.strokeStyle = `rgba(100, 100, 100, 0.2)`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.strokeRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
                }
            }
        }
    }
    
    renderGlowEffects() {
        this.glowEffects.forEach(glow => {
            const alpha = glow.life / glow.maxLife;
            this.ctx.globalAlpha = alpha * 0.6;
            
            // Create radial gradient for glow
            const gradient = this.ctx.createRadialGradient(
                glow.x, glow.y, 0,
                glow.x, glow.y, glow.size
            );
            gradient.addColorStop(0, glow.color + 'aa');
            gradient.addColorStop(0.5, glow.color + '44');
            gradient.addColorStop(1, glow.color + '00');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(glow.x, glow.y, glow.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.globalAlpha = 1;
    }
    
    renderLetters() {
        this.letters.forEach((letter, key) => {
            const [x, y] = key.split(',').map(Number);
            const anim = this.letterAnimations.get(key);
            
            if (anim && !anim.collected) {
                const centerX = x * this.cellSize + this.cellSize / 2;
                const centerY = y * this.cellSize + this.cellSize / 2;
                const bounceOffset = Math.sin(anim.bounce) * 4;
                const pulse = anim.pulse || 1;
                const rotation = Math.sin(this.time + x + y) * 0.1;
                
                this.ctx.save();
                this.ctx.translate(centerX, centerY + bounceOffset);
                this.ctx.rotate(rotation);
                this.ctx.scale(pulse, pulse);
                
                // Letter background glow
                const glowGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, 15);
                glowGradient.addColorStop(0, anim.color + '66');
                glowGradient.addColorStop(1, anim.color + '00');
                this.ctx.fillStyle = glowGradient;
                this.ctx.beginPath();
                this.ctx.arc(0, 0, 15, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Letter border/outline
                this.ctx.strokeStyle = '#000000';
                this.ctx.lineWidth = 3;
                this.ctx.font = 'bold 18px "Arial Black", Arial';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.strokeText(letter, 0, 0);
                
                // Letter main fill
                this.ctx.fillStyle = anim.color;
                this.ctx.fillText(letter, 0, 0);
                
                // Letter highlight
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                this.ctx.font = 'bold 18px "Arial Black", Arial';
                this.ctx.fillText(letter, -1, -1);
                
                this.ctx.restore();
            }
        });
    }
    
    renderPlayerTrail() {
        // Render player trail
        this.playerAnimation.trail.forEach((point, index) => {
            const alpha = point.life / 10;
            const size = (point.life / 10) * 6;
            
            this.ctx.globalAlpha = alpha * 0.3;
            this.ctx.fillStyle = '#E74C3C';
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.globalAlpha = 1;
    }
    
    renderPlayer() {
        const centerX = this.player.x * this.cellSize + this.cellSize / 2;
        const centerY = this.player.y * this.cellSize + this.cellSize / 2;
        const bounceOffset = this.playerAnimation.offset * 3;
        const pulse = 1 + Math.sin(this.time * 4) * 0.1;
        
        this.ctx.save();
        this.ctx.translate(centerX, centerY + bounceOffset);
        this.ctx.scale(pulse, pulse);
        
        // Player aura/glow
        const auraGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, 20);
        auraGradient.addColorStop(0, 'rgba(231, 76, 60, 0.4)');
        auraGradient.addColorStop(0.7, 'rgba(231, 76, 60, 0.2)');
        auraGradient.addColorStop(1, 'rgba(231, 76, 60, 0)');
        this.ctx.fillStyle = auraGradient;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 20, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Player shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        this.ctx.beginPath();
        this.ctx.arc(2, 3, 9, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Player body gradient
        const bodyGradient = this.ctx.createRadialGradient(-3, -3, 0, 0, 0, 10);
        bodyGradient.addColorStop(0, '#FF6B6B');
        bodyGradient.addColorStop(0.7, '#E74C3C');
        bodyGradient.addColorStop(1, '#C0392B');
        this.ctx.fillStyle = bodyGradient;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 10, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Player highlight
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        this.ctx.beginPath();
        this.ctx.arc(-3, -3, 4, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Player face - eyes
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.beginPath();
        this.ctx.arc(-3, -1, 2, 0, Math.PI * 2);
        this.ctx.arc(3, -1, 2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Eye pupils
        this.ctx.fillStyle = '#2C3E50';
        this.ctx.beginPath();
        this.ctx.arc(-3, -1, 1, 0, Math.PI * 2);
        this.ctx.arc(3, -1, 1, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Player mouth
        this.ctx.strokeStyle = '#2C3E50';
        this.ctx.lineWidth = 1.5;
        this.ctx.beginPath();
        this.ctx.arc(0, 1, 3, 0, Math.PI);
        this.ctx.stroke();
        
        this.ctx.restore();
    }
    
    renderParticles() {
        this.particleSystem.forEach(particle => {
            const alpha = particle.life / particle.maxLife;
            const size = (particle.size || 3) * alpha;
            
            this.ctx.globalAlpha = alpha;
            
            // Particle glow
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, size * 2
            );
            gradient.addColorStop(0, particle.color);
            gradient.addColorStop(0.5, particle.color + '88');
            gradient.addColorStop(1, particle.color + '00');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, size * 2, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Particle core
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.globalAlpha = 1;
    }
    
    renderUI() {
        if (this.gameState === 'playing') {
            this.renderProgressBar();
        }
    }
    
    
    renderProgressBar() {
        const barWidth = 200;
        const barHeight = 20;
        const barX = (this.canvas.width - barWidth) / 2;
        const barY = this.canvas.height - 40;
        
        const progress = this.collectedLetters.length / this.targetWord.length;
        
        // Progress bar background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(barX - 5, barY - 5, barWidth + 10, barHeight + 10);
        
        this.ctx.strokeStyle = '#4ECDC4';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(barX - 5, barY - 5, barWidth + 10, barHeight + 10);
        
        // Progress bar fill
        const gradient = this.ctx.createLinearGradient(barX, barY, barX + barWidth, barY);
        gradient.addColorStop(0, '#4ECDC4');
        gradient.addColorStop(0.5, '#45B7D1');
        gradient.addColorStop(1, '#96CEB4');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(barX, barY, barWidth * progress, barHeight);
        
        // Progress bar text
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`${this.collectedLetters.length}/${this.targetWord.length} Letters`, barX + barWidth/2, barY + 15);
    }
    
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MergeFundWordQuest();
});