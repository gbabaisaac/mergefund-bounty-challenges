// MergeFund Interactive Matrix Experience
class MergeFundMatrix {
    constructor() {
        this.matrixCanvas = document.getElementById('matrixCanvas');
        this.particleCanvas = document.getElementById('particleCanvas');
        this.matrixCtx = this.matrixCanvas.getContext('2d');
        this.particleCtx = this.particleCanvas.getContext('2d');
        
        this.resizeCanvases();
        this.initializeMatrix();
        this.initializeParticles();
        this.setupEventListeners();
        this.initializeTerminal();
        this.initializeASCII();
        this.startAnimations();
        
        // Audio context for synthetic sounds
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Stats
        this.stats = {
            matrixLines: 0,
            particles: 0,
            hackLevel: 0
        };
    }
    
    resizeCanvases() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.matrixCanvas.width = width;
        this.matrixCanvas.height = height;
        this.particleCanvas.width = width;
        this.particleCanvas.height = height;
    }
    
    initializeMatrix() {
        this.matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()MERGEFUND';
        this.fontSize = 16;
        this.columns = Math.floor(this.matrixCanvas.width / this.fontSize);
        this.drops = new Array(this.columns).fill(0);
        this.matrixActive = true;
    }
    
    initializeParticles() {
        this.particles = [];
        this.maxParticles = 30; // Reduced from 100
        this.mouse = { x: 0, y: 0 };
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resizeCanvases();
            this.initializeToggleButton(); // Reset toggle button on resize
        });
        
        // Mouse interaction - only on click, not movement
        document.addEventListener('click', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.createParticles(e.clientX, e.clientY);
        });
        
        // Button interactions
        document.getElementById('activateBtn').addEventListener('click', () => {
            this.activateMatrix();
        });
        
        document.getElementById('hackBtn').addEventListener('click', () => {
            this.initiateHack();
        });
        
        document.getElementById('fundBtn').addEventListener('click', () => {
            this.deployFunds();
        });
        
        document.getElementById('soundBtn').addEventListener('click', () => {
            this.enableSound();
        });
        
        // Terminal toggle for mobile
        const terminalToggle = document.getElementById('terminalToggle');
        if (terminalToggle) {
            terminalToggle.addEventListener('click', () => {
                this.toggleTerminal();
            });
            
            // Initialize toggle button text based on screen size
            this.initializeToggleButton();
        }
        
        // Terminal close functionality
        const closeBtn = document.querySelector('.control.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideTerminal();
            });
        }
        
        // Terminal interaction
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.executeTerminalCommand();
            }
        });
    }
    
    drawMatrix() {
        // Create fade effect - completely transparent background
        this.matrixCtx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        this.matrixCtx.fillRect(0, 0, this.matrixCanvas.width, this.matrixCanvas.height);
        
        this.matrixCtx.fillStyle = 'rgba(0, 255, 0, 0.25)'; // Further reduced opacity
        this.matrixCtx.font = `${this.fontSize}px monospace`;
        
        for (let i = 0; i < this.drops.length; i++) {
            const char = this.matrixChars[Math.floor(Math.random() * this.matrixChars.length)];
            const x = i * this.fontSize;
            const y = this.drops[i] * this.fontSize;
            
            // Highlight special characters with very low opacity
            if (char.match(/[MERGEFUND]/)) {
                this.matrixCtx.fillStyle = 'rgba(0, 255, 255, 0.4)';
                this.matrixCtx.shadowBlur = 0; // No shadow
                this.matrixCtx.shadowColor = 'transparent';
            } else {
                this.matrixCtx.fillStyle = 'rgba(0, 255, 0, 0.25)';
                this.matrixCtx.shadowBlur = 0; // No shadow
                this.matrixCtx.shadowColor = 'transparent';
            }
            
            this.matrixCtx.fillText(char, x, y);
            
            // Reset drop position
            if (y > this.matrixCanvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            
            this.drops[i]++;
        }
        
        // Stats removed for cleaner interface
    }
    
    createParticles(x, y) {
        // Greatly reduced particle creation - only on click/touch
        if (this.particles.length < this.maxParticles && Math.random() > 0.95) {
            for (let i = 0; i < 2; i++) {
                this.particles.push({
                    x: x + (Math.random() - 0.5) * 20,
                    y: y + (Math.random() - 0.5) * 20,
                    vx: (Math.random() - 0.5) * 4,
                    vy: (Math.random() - 0.5) * 4,
                    life: 1,
                    decay: 0.02,
                    size: Math.random() * 4 + 2,
                    color: `hsl(${Math.random() * 60 + 180}, 100%, ${50 + Math.random() * 20}%)`
                });
            }
        }
    }
    
    updateParticles() {
        this.particleCtx.clearRect(0, 0, this.particleCanvas.width, this.particleCanvas.height);
        
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= particle.decay;
            
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
                continue;
            }
            
            // Simple particle without excessive glow
            this.particleCtx.save();
            this.particleCtx.globalAlpha = particle.life;
            this.particleCtx.fillStyle = particle.color;
            this.particleCtx.beginPath();
            this.particleCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.particleCtx.fill();
            this.particleCtx.restore();
        }
        
        // Stats removed for cleaner interface
    }
    
    initializeASCII() {
        const asciiArt = [
            '███╗   ███╗███████╗██████╗  ██████╗ ███████╗███████╗██╗   ██╗███╗   ██╗██████╗ ',
            '████╗ ████║██╔════╝██╔══██╗██╔════╝ ██╔════╝██╔════╝██║   ██║████╗  ██║██╔══██╗',
            '██╔████╔██║█████╗  ██████╔╝██║  ███╗█████╗  █████╗  ██║   ██║██╔██╗ ██║██║  ██║',
            '██║╚██╔╝██║██╔══╝  ██╔══██╗██║   ██║██╔══╝  ██╔══╝  ██║   ██║██║╚██╗██║██║  ██║',
            '██║ ╚═╝ ██║███████╗██║  ██║╚██████╔╝███████╗██║     ╚██████╔╝██║ ╚████║██████╔╝',
            '╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝      ╚═════╝ ╚═╝  ╚═══╝╚═════╝ ',
            '',
            '       💎 Empowering Developers • Solving Open-Source Issues • Building Impact 🚀'
        ];
        
        this.animateASCII(asciiArt);
    }
    
    animateASCII(lines) {
        const asciiDisplay = document.getElementById('asciiDisplay');
        let currentLine = 0;
        
        const addLine = () => {
            if (currentLine < lines.length) {
                const lineElement = document.createElement('div');
                lineElement.textContent = lines[currentLine];
                lineElement.style.opacity = '0';
                lineElement.style.animation = 'fadeIn 0.5s ease-out forwards';
                asciiDisplay.appendChild(lineElement);
                
                currentLine++;
                setTimeout(addLine, 200);
            }
        };
        
        setTimeout(addLine, 1000);
    }
    
    enableSound() {
        // Initialize audio context on user interaction
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume().then(() => {
                this.addTerminalOutput('🔊 Sound system activated!');
                this.addTerminalOutput('🎵 Audio ready for the ultimate experience!');
                document.getElementById('soundBtn').style.display = 'none';
                this.playSound(440, 0.3, 'sine');
            });
        } else {
            this.addTerminalOutput('🔊 Sound already enabled!');
            this.playSound(440, 0.3, 'sine');
        }
    }
    
    updateStats() {
        // Stats removed - keeping method for compatibility
    }
    
    initializeToggleButton() {
        const terminalToggle = document.getElementById('terminalToggle');
        const terminal = document.getElementById('terminal');
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // On mobile, terminal starts hidden
            terminalToggle.textContent = '💻';
            terminal.classList.remove('show');
        } else {
            // On desktop, terminal starts visible
            terminalToggle.textContent = '❌';
            terminal.classList.remove('hidden');
        }
    }
    
    toggleTerminal() {
        const terminal = document.getElementById('terminal');
        const terminalToggle = document.getElementById('terminalToggle');
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // On mobile, show/hide with scroll to terminal
            if (terminal.classList.contains('show')) {
                terminal.classList.remove('show');
                terminalToggle.textContent = '💻';
            } else {
                terminal.classList.add('show');
                terminalToggle.textContent = '❌';
                // Scroll to terminal smoothly
                setTimeout(() => {
                    terminal.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        } else {
            // Desktop behavior - toggle hidden class
            if (terminal.classList.contains('hidden')) {
                terminal.classList.remove('hidden');
                terminalToggle.textContent = '❌';
            } else {
                terminal.classList.add('hidden');
                terminalToggle.textContent = '💻';
            }
        }
    }
    
    hideTerminal() {
        const terminal = document.getElementById('terminal');
        const terminalToggle = document.getElementById('terminalToggle');
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            terminal.classList.remove('show');
            terminalToggle.textContent = '💻';
        } else {
            terminal.classList.add('hidden');
            terminalToggle.textContent = '💻';
        }
    }
    
    activateMatrix() {
        this.playSound(440, 0.1, 'sawtooth');
        this.matrixActive = !this.matrixActive;
        
        if (this.matrixActive) {
            document.body.classList.add('success-flash');
            this.addTerminalOutput('🚀 Developer platform activated successfully!');
            this.addTerminalOutput('🔍 Scanning for open-source issues...');
            setTimeout(() => document.body.classList.remove('success-flash'), 500);
        } else {
            this.addTerminalOutput('📴 Platform deactivated. Taking a coding break!');
        }
    }
    
    initiateHack() {
        this.playSound(220, 0.2, 'square');
        this.stats.hackLevel++;
        document.body.classList.add('hack-mode');
        
        this.addTerminalOutput(`� SOLVING ISSUE #${this.stats.hackLevel}...`);
        this.addTerminalOutput('� Analyzing repository structure...');
        this.addTerminalOutput('� Identifying solution approach...');
        this.addTerminalOutput('⚡ Writing clean, efficient code...');
        
        // Create visual glitch effect
        this.createGlitchEffect();
        
        setTimeout(() => {
            this.addTerminalOutput('✅ Issue solved! Hello MergeFund community!');
            this.addTerminalOutput('💻 Developer hacker in the building!');
            this.addTerminalOutput('🚀 Ready to solve issues and earn rewards!');
            document.body.classList.remove('hack-mode');
        }, 3000);
        
        // Create explosion of particles
        for (let i = 0; i < 100; i++) {
            setTimeout(() => {
                this.createParticles(
                    Math.random() * window.innerWidth,
                    Math.random() * window.innerHeight
                );
            }, i * 20);
        }
    }
    
    createGlitchEffect() {
        const glitchInterval = setInterval(() => {
            document.body.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
        }, 50);
        
        setTimeout(() => {
            clearInterval(glitchInterval);
            document.body.style.transform = 'translate(0, 0)';
        }, 2000);
    }
    
    deployFunds() {
        this.playSound(880, 0.15, 'sine');
        this.addTerminalOutput('🎯 Deploying developer rewards...');
        this.addTerminalOutput('💰 $1,000 bounty transferred to Hello MergeFund project!');
        this.addTerminalOutput('📋 Issue #42: "Implement Hello MergeFund" - SOLVED!');
        this.addTerminalOutput('🏆 Developer reputation increased! Keep building!');
        
        // Special fund deployment effect
        const fundEffect = () => {
            for (let i = 0; i < 20; i++) {
                setTimeout(() => {
                    this.createParticles(
                        window.innerWidth / 2 + (Math.random() - 0.5) * 200,
                        window.innerHeight / 2 + (Math.random() - 0.5) * 200
                    );
                }, i * 50);
            }
        };
        
        fundEffect();
    }
    
    initializeTerminal() {
        this.terminalOutput = document.getElementById('terminalOutput');
        this.terminalCommands = [
            'Initializing MergeFund Developer Platform...',
            'Loading open-source issue tracker...',
            'Connecting to reward distribution network...',
            'Hello MergeFund! Ready to build real impact!'
        ];
        
        this.typewriterEffect(this.terminalCommands, 0);
    }
    
    typewriterEffect(commands, index) {
        if (index >= commands.length) return;
        
        const command = commands[index];
        let charIndex = 0;
        const line = document.createElement('div');
        this.terminalOutput.appendChild(line);
        
        const typeChar = () => {
            if (charIndex < command.length) {
                line.textContent += command[charIndex];
                charIndex++;
                setTimeout(typeChar, 50 + Math.random() * 50);
            } else {
                setTimeout(() => {
                    this.typewriterEffect(commands, index + 1);
                }, 500);
            }
        };
        
        typeChar();
    }
    
    addTerminalOutput(text) {
        const line = document.createElement('div');
        line.textContent = `> ${text}`;
        line.style.color = '#00ffff';
        this.terminalOutput.appendChild(line);
        this.terminalOutput.scrollTop = this.terminalOutput.scrollHeight;
    }
    
    executeTerminalCommand() {
        const responses = [
            'Hello MergeFund! Ready to solve some issues! �',
            'Developer platform online. Let\'s build impact!',
            'Open-source issues loading... Time to earn rewards!',
            'Welcome to the MergeFund ecosystem, developer!',
            'Error 404: Traditional bounties not found. Use MergeFund instead!',
            'Git commit -m "Building real impact with MergeFund" 🚀',
            'Pull request approved! Your contribution matters! ✅'
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        this.addTerminalOutput(randomResponse);
    }
    
    playSound(frequency, duration, type = 'sine') {
        // Use external sound API - Tone.js alternative or Web Audio with user interaction
        try {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            // Resume audio context if suspended (Chrome policy)
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            oscillator.type = type;
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
            
            // Also play notification sound as backup
            this.playNotificationSound();
        } catch (error) {
            console.log('Audio not available:', error);
            // Fallback: visual feedback only
            this.showAudioFeedback();
        }
    }
    
    playNotificationSound() {
        // Fallback using HTML5 audio with data URI
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const buffer = audioContext.createBuffer(1, 22050, 22050);
        const output = buffer.getChannelData(0);
        
        for (let i = 0; i < 22050; i++) {
            output[i] = Math.random() * 0.1;
        }
        
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        source.start();
    }
    
    showAudioFeedback() {
        // Visual feedback when audio is not available
        document.body.style.background = '#001100';
        setTimeout(() => {
            document.body.style.background = '#000';
        }, 100);
    }
    
    startAnimations() {
        const animate = () => {
            if (this.matrixActive) {
                this.drawMatrix();
            }
            this.updateParticles();
            requestAnimationFrame(animate);
        };
        
        animate();
    }
}

// Easter Eggs and Special Features
class EasterEggs {
    constructor(matrix) {
        this.matrix = matrix;
        this.konamiCode = [];
        this.konamiSequence = [
            'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
            'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
            'KeyB', 'KeyA'
        ];
        
        this.setupEasterEggs();
    }
    
    setupEasterEggs() {
        // Konami Code
        document.addEventListener('keydown', (e) => {
            this.konamiCode.push(e.code);
            
            if (this.konamiCode.length > this.konamiSequence.length) {
                this.konamiCode.shift();
            }
            
            if (this.konamiCode.join(',') === this.konamiSequence.join(',')) {
                this.activateKonamiMode();
            }
        });
        
        // Secret click sequence
        let clickCount = 0;
        document.querySelector('.glitch-text').addEventListener('click', () => {
            clickCount++;
            if (clickCount === 5) {
                this.activateSecretMode();
                clickCount = 0;
            }
        });
        
        // Time-based Easter egg
        this.checkTimeEasterEgg();
    }
    
    activateKonamiMode() {
        this.matrix.addTerminalOutput('🎮 KONAMI CODE ACTIVATED! 🎮');
        this.matrix.addTerminalOutput('HELLO MERGEFUND - CHEAT MODE ENABLED!');
        
        // Rainbow mode
        document.body.style.animation = 'rainbow 2s infinite';
        
        // Super particle explosion
        for (let i = 0; i < 200; i++) {
            setTimeout(() => {
                this.matrix.createParticles(
                    Math.random() * window.innerWidth,
                    Math.random() * window.innerHeight
                );
            }, i * 10);
        }
    }
    
    activateSecretMode() {
        this.matrix.addTerminalOutput('🔐 SECRET MODE UNLOCKED! 🔐');
        this.matrix.addTerminalOutput('You found the hidden MergeFund treasure!');
        
        // Special visual effect
        document.body.style.filter = 'hue-rotate(45deg) saturate(1.5)';
        setTimeout(() => {
            document.body.style.filter = '';
        }, 3000);
    }
    
    checkTimeEasterEgg() {
        const now = new Date();
        const hour = now.getHours();
        
        if (hour === 13 && now.getMinutes() === 37) { // 1:37 PM - "LEET" time
            this.matrix.addTerminalOutput('🕐 LEET TIME DETECTED! 1337 H4X0R M0D3!');
            this.matrix.stats.hackLevel += 1337;
        }
        
        if (hour >= 2 && hour <= 4) { // Late night coding
            this.matrix.addTerminalOutput('🌙 Late night coding detected. Hello MergeFund, night owl!');
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const matrix = new MergeFundMatrix();
    const easterEggs = new EasterEggs(matrix);
    
    // Add rainbow animation to CSS dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    // Add welcome message after loading
    setTimeout(() => {
        matrix.addTerminalOutput('🎉 Welcome to MergeFund Developer Platform!');
        matrix.addTerminalOutput('💻 Connect with projects, showcase skills, earn rewards!');
        matrix.addTerminalOutput('🖱️ Click anywhere to create particles!');
        matrix.addTerminalOutput('🎮 Try clicking buttons or pressing Enter!');
        matrix.addTerminalOutput('🥚 Easter eggs are hidden throughout... 👀');
        matrix.addTerminalOutput('💫 Hello MergeFund - Let\'s build real impact together!');
    }, 6000);
});

