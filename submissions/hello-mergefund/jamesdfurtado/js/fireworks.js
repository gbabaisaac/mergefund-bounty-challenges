// Fireworks engine variables
let fireworksActive = false;
let fireworksQueue = [];
let fireworksParticles = [];
let fireworksCanvas = null;
let fireworksCtx = null;
let fireworksAnimationId = null;

// Victory screen fireworks variables
let fireworksIntervalId = null;
let fireworksResizeListener = null;

// Utility: Generate a random bright color
function randomBrightColor() {
    const h = Math.floor(Math.random() * 360);
    return `hsl(${h}, 100%, 60%)`;
}

function playExplosionSound() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'triangle';
        o.frequency.value = 120 + Math.random() * 80;
        g.gain.value = 0.15;
        o.connect(g);
        g.connect(ctx.destination);
        o.start();
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        o.stop(ctx.currentTime + 0.25);
        o.onended = () => ctx.close();
    } catch (e) {}
}

function triggerFireworks(canvas, count = 14) {
    if (fireworksActive) return;
    fireworksActive = true;
    fireworksCanvas = canvas;
    fireworksCtx = canvas.getContext('2d');
    fireworksQueue = [];
    fireworksParticles = [];
    for (let i = 0; i < count; i++) {
        const delay = i * 400 + Math.random() * 200;
        fireworksQueue.push({
            launchTime: performance.now() + delay,
            x: Math.random() * canvas.width
        });
    }
    fireworksLoop();
}

function setFireworksZIndex(z) {
    if (fireworksCanvas) fireworksCanvas.style.zIndex = z;
}

function fireworksLoop() {
    if (!fireworksActive) return;
    const now = performance.now();
    while (fireworksQueue.length && fireworksQueue[0].launchTime <= now) {
        const fw = fireworksQueue.shift();
        launchFirework(fw.x);
    }
    updateFireworksParticles();
    drawFireworksParticles();
    if (fireworksParticles.length > 0 || fireworksQueue.length > 0) {
        fireworksAnimationId = requestAnimationFrame(fireworksLoop);
    } else {
        fireworksActive = false;
        fireworksAnimationId = null;
    }
}

function launchFirework(x) {
    const y0 = fireworksCanvas.height - 10;
    const y1 = Math.random() * (fireworksCanvas.height * 0.7) + fireworksCanvas.height * 0.1;
    const color = randomBrightColor();
    fireworksParticles.push({
        type: 'rocket',
        x: x,
        y: y0,
        vx: 0,
        vy: -6 - Math.random() * 2,
        targetY: y1,
        color: color,
        exploded: false,
        trail: []
    });
}

function updateFireworksParticles() {
    const newParticles = [];
    for (let p of fireworksParticles) {
        if (p.type === 'rocket') {
            p.trail.push({x: p.x, y: p.y, alpha: 1, life: 0});
            if (p.trail.length > 24) p.trail.shift();
            p.y += p.vy;
            for (let t of p.trail) {
                t.life++;
                t.alpha = Math.max(0, 1 - t.life / 18);
            }
            p.trail = p.trail.filter(t => t.alpha > 0.01);
            if (p.y <= p.targetY && !p.exploded) {
                p.exploded = true;
                playExplosionSound();
                for (let i = 0; i < 36; i++) {
                    const angle = (i / 36) * Math.PI * 2;
                    const speed = 2.5 + Math.random() * 2;
                    newParticles.push({
                        type: 'particle',
                        x: p.x,
                        y: p.y,
                        vx: Math.cos(angle) * speed,
                        vy: Math.sin(angle) * speed,
                        color: randomBrightColor(),
                        alpha: 1,
                        life: 0
                    });
                }
            }
            if (!p.exploded) {
                newParticles.push(p);
            }
        } else if (p.type === 'particle') {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.04;
            p.life++;
            p.alpha -= 0.014;
            if (p.alpha > 0) {
                newParticles.push(p);
            }
        }
    }
    fireworksParticles = newParticles;
}

function drawFireworksParticles() {
    if (!fireworksCtx) return;
    fireworksCtx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
    for (let p of fireworksParticles) {
        if (p.type === 'rocket') {
            for (let t of p.trail) {
                fireworksCtx.save();
                fireworksCtx.globalAlpha = t.alpha;
                fireworksCtx.strokeStyle = '#fff';
                fireworksCtx.lineWidth = 1;
                fireworksCtx.beginPath();
                fireworksCtx.moveTo(t.x, t.y);
                fireworksCtx.lineTo(t.x, t.y + 8);
                fireworksCtx.stroke();
                fireworksCtx.restore();
            }
            fireworksCtx.save();
            fireworksCtx.globalAlpha = 1;
            fireworksCtx.fillStyle = p.color;
            fireworksCtx.beginPath();
            fireworksCtx.arc(p.x, p.y, 5, 0, Math.PI * 2);
            fireworksCtx.fill();
            fireworksCtx.restore();
        } else if (p.type === 'particle') {
            fireworksCtx.save();
            fireworksCtx.globalAlpha = Math.max(0, p.alpha);
            fireworksCtx.fillStyle = p.color;
            fireworksCtx.beginPath();
            fireworksCtx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            fireworksCtx.fill();
            fireworksCtx.restore();
        }
    }
}

// Utility to resize the fireworks canvas to the window size
function resizeFireworksCanvas() {
    const fwCanvas = document.getElementById('fireworksCanvas');
    if (fwCanvas) {
        fwCanvas.width = window.innerWidth;
        fwCanvas.height = window.innerHeight;
        fwCanvas.style.width = '100vw';
        fwCanvas.style.height = '100vh';
    }
}

// Start the fireworks celebration on the win screen
function startVictoryFireworks() {
    const fwCanvas = document.getElementById('fireworksCanvas');
    resizeFireworksCanvas();
    fwCanvas.style.display = 'block';
    if (window.setFireworksZIndex) window.setFireworksZIndex(2);
    if (window.triggerFireworks) window.triggerFireworks(fwCanvas, 8);
    fireworksIntervalId = setInterval(() => {
        if (window.triggerFireworks) window.triggerFireworks(fwCanvas, 8);
    }, 200);
    fireworksResizeListener = () => resizeFireworksCanvas();
    window.addEventListener('resize', fireworksResizeListener);
    setTimeout(() => {
        clearInterval(fireworksIntervalId);
        fireworksIntervalId = null;
    }, 8000);
}

// Stop the fireworks and cleanup
function stopVictoryFireworks() {
    const fwCanvas = document.getElementById('fireworksCanvas');
    if (fwCanvas) fwCanvas.style.display = 'none';
    if (fireworksIntervalId) clearInterval(fireworksIntervalId);
    fireworksIntervalId = null;
    if (fireworksResizeListener) window.removeEventListener('resize', fireworksResizeListener);
    fireworksResizeListener = null;
}

// Expose functions to global scope
window.triggerFireworks = triggerFireworks;
window.setFireworksZIndex = setFireworksZIndex; 