function createCodeRain() {
  const codeRain = document.getElementById("codeRain");
  const characters = [
    "0",
    "1",
    "{",
    "}",
    "(",
    ")",
    ";",
    "=",
    "+",
    "-",
    "*",
    "/",
    "<",
    ">",
    "function",
    "const",
    "let",
    "var",
    "if",
    "else",
    "for",
    "while",
  ];

  setInterval(() => {
    const char = document.createElement("div");
    char.className = "code-char";
    char.textContent =
      characters[Math.floor(Math.random() * characters.length)];
    char.style.left = Math.random() * 100 + "%";
    char.style.animationDuration = Math.random() * 3 + 2 + "s";
    codeRain.appendChild(char);

    setTimeout(() => {
      char.remove();
    }, 5000);
  }, 200);
}

// Create sparkles
function createSparkles() {
  const sparklesContainer = document.getElementById("sparkles");

  for (let i = 0; i < 50; i++) {
    const sparkle = document.createElement("div");
    sparkle.className = "sparkle";
    sparkle.style.left = Math.random() * 100 + "%";
    sparkle.style.top = Math.random() * 100 + "%";
    sparkle.style.animationDelay = Math.random() * 3 + "s";
    sparklesContainer.appendChild(sparkle);
  }
}

// Trigger fireworks effect
function triggerFireworks() {
    // Pause background music
  const music = document.getElementById("backgroundMusic");
  music.pause();
  const colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#ffeaa7"];

  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      const firework = document.createElement("div");
      firework.style.position = "fixed";
      firework.style.left = Math.random() * window.innerWidth + "px";
      firework.style.top = Math.random() * window.innerHeight + "px";
      firework.style.width = "10px";
      firework.style.height = "10px";
      firework.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      firework.style.borderRadius = "50%";
      firework.style.pointerEvents = "none";
      firework.style.animation = "sparkle 1s ease-out forwards";

      document.body.appendChild(firework);

      setTimeout(() => {
        firework.remove();
      }, 1000);
    }, i * 100);
  }
}
function playMusic() {
  const music = document.getElementById("backgroundMusic");
  music.volume = 0.5; // adjust volume 0.0 - 1.0
  music.play();
}

// Show code message
function showMessage() {
  alert(`🎉 Hello MergeFund Challenge Submission! 🎉

This creative program features:
✨ Animated text with scaling effects
🌧️ Falling code rain background
⭐ Sparkle effects
🎆 Interactive fireworks
🇳🇬 Nigerian developer pride
💻 Clean, well-documented code

Technical Details:
- Pure HTML/CSS/JS (no external libraries)
- Responsive design
- Smooth animations
- Interactive elements
- Creative visual effects

Made with love from Nigeria! 🚀`);
}

// Typing effect for main text
function typeText(element, text, speed = 150) {
  element.textContent = "";
  element.style.opacity = "1";

  let i = 0;
  const timer = setInterval(() => {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(timer);
      element.classList.remove("typing-effect");
    }
  }, speed);
}

// Console art
function displayConsoleArt() {
  console.log(`
🎨 MergeFund Challenge Submission 🎨

██╗  ██╗███████╗██╗     ██╗      ██████╗ 
██║  ██║██╔════╝██║     ██║     ██╔═══██╗
███████║█████╗  ██║     ██║     ██║   ██║
██╔══██║██╔══╝  ██║     ██║     ██║   ██║
██║  ██║███████╗███████╗███████╗╚██████╔╝
╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝ ╚═════╝ 

███╗   ███╗███████╗██████╗  ██████╗ ███████╗███████╗██╗   ██╗███╗   ██╗██████╗ 
████╗ ████║██╔════╝██╔══██╗██╔════╝ ██╔════╝██╔════╝██║   ██║████╗  ██║██╔══██╗
██╔████╔██║█████╗  ██████╔╝██║  ███╗█████╗  █████╗  ██║   ██║██╔██╗ ██║██║  ██║
██║╚██╔╝██║██╔══╝  ██╔══██╗██║   ██║██╔══╝  ██╔══╝  ██║   ██║██║╚██╗██║██║  ██║
██║ ╚═╝ ██║███████╗██║  ██║╚██████╔╝███████╗██║     ╚██████╔╝██║ ╚████║██████╔╝
╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝      ╚═════╝ ╚═╝  ╚═══╝╚═════╝ 

🚀 From Nigeria with Code! 🇳🇬
💻 Interactive • Creative • Fun
🎆 Click the buttons to interact!
            `);
}

// Initialize everything
document.addEventListener("DOMContentLoaded", function () {
  createCodeRain();
  createSparkles();
  displayConsoleArt();

  // Typing effect to main text
  const mainText = document.getElementById("mainText");
  setTimeout(() => {
    mainText.classList.add("typing-effect");
    typeText(mainText, "Hello MergeFund");
  }, 1000);
});
