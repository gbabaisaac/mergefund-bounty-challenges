# 🚀 Hello MergeFund - Space Invaders Game

A retro-style Space Invaders game where you shoot letters to spell "Hello MergeFund"! Built with vanilla JavaScript, HTML5 Canvas, and Web Audio API.

## 🎮 Game Description

**Hello MergeFund** is a creative twist on the classic Space Invaders game. Instead of just shooting generic enemies, you're on a mission to collect the letters that spell "Hello MergeFund" by shooting them out of the sky!

### Features:
- **Letter Collection**: Shoot yellow enemies with letters to collect them
- **Progress Tracking**: See your progress at the top of the screen
- **Retro Aesthetics**: Pixel art style with retro sound effects
- **Victory Screen**: Fireworks celebration when you complete the phrase
- **Infinite Respawn**: Player respawns automatically when hit
- **Sound Effects**: Retro beep sounds for shooting, explosions, and letter collection

## 🎯 How to Play

1. **Movement**: Use ← → arrow keys to move left and right
2. **Shooting**: Press SPACE to shoot bullets
3. **Objective**: Collect all letters to spell "Hello MergeFund"
4. **Strategy**: Focus on yellow enemies (they have letters) over red ones
5. **Victory**: Complete the phrase to see the celebration screen!

## 🚀 Quick Start

### Option 1: Direct Play (Easiest)
1. Download all files to a folder
2. Double-click `index.html` to open in your browser
3. Start playing immediately!

### Option 2: Local Server (Recommended)
1. Open terminal/command prompt
2. Navigate to the game folder
3. Run a simple HTTP server:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   
   # Node.js (if you have http-server installed)
   npx http-server
   ```
4. Open `http://localhost:8000` in your browser

## 🛠️ Technical Details

### Tech Stack
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Graphics**: HTML5 Canvas for pixel-perfect rendering
- **Audio**: Web Audio API for retro sound effects
- **Styling**: CSS with pixel art aesthetics
- **Font**: Press Start 2P (Google Fonts) for authentic retro feel

### Game Architecture
- **Game Loop**: 60fps requestAnimationFrame loop
- **Object Management**: Arrays for bullets, enemies, and explosions
- **Collision Detection**: AABB (Axis-Aligned Bounding Box) system
- **Audio Synthesis**: Real-time beep generation using Web Audio API
- **State Management**: Simple game state with victory conditions

### Creative Approach

This submission takes the "Hello MergeFund" challenge and transforms it into an interactive gaming experience:

1. **Educational Twist**: Players learn the phrase through gameplay
2. **Visual Feedback**: Real-time progress display shows collected letters
3. **Retro Aesthetic**: Authentic 80s arcade feel with modern web tech
4. **Sound Design**: Retro beep sounds enhance the experience
5. **Victory Celebration**: Fireworks animation when completing the challenge

The game combines the simplicity of "Hello World" with the complexity of a full arcade game, making it both accessible and engaging.

## 🎨 Visual Design

- **Color Scheme**: Green (#0f0) for player and UI, red (#f00) for enemies, yellow (#ff0) for letter enemies
- **Pixel Art**: Clean, retro aesthetic with pixel-perfect rendering
- **Animations**: Smooth explosions, glowing letters, and victory fireworks
- **Typography**: Press Start 2P font for authentic retro feel

## 🔊 Audio Design

- **Shoot Sound**: High-pitched beep (800Hz)
- **Explosion Sound**: Low-pitched beep (200Hz)
- **Letter Collection**: Success beep (1200Hz)
- **Victory Sound**: Celebration beep (400Hz)

## 🏆 Challenge Criteria Met

✅ **Must print "Hello MergeFund"** - Displayed in victory screen  
✅ **Creative and fun** - Interactive Space Invaders game  
✅ **Well-documented code** - Comprehensive comments and structure  
✅ **Easy setup** - Single HTML file, no dependencies  
✅ **Originality** - Unique letter collection mechanic  
✅ **Technical quality** - Clean, modular JavaScript architecture  

## 🐛 Browser Compatibility

- ✅ Chrome/Chromium (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ⚠️ Internet Explorer (limited audio support)

## 📝 License

This project is created for the MergeFund "Hello MergeFund" challenge.

---

**Ready to play? Open `index.html` and start shooting letters! 🎮** 