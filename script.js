// DOM Elements
const themeToggle = document.getElementById("theme-toggle");
const nameInput = document.getElementById("name-input");
const saveNameBtn = document.getElementById("save-name");
const kidNameDisplay = document.getElementById("kid-name");
const playButtons = document.querySelectorAll(".play-btn");
const drawingCanvas = document.getElementById("drawing-canvas");
const colorButtons = document.querySelectorAll(".color-btn");
const clearDrawingBtn = document.getElementById("clear-drawing");
const bubbleToy = document.getElementById("bubble-toy");
const drumToy = document.getElementById("drum-toy");
const rocketToy = document.getElementById("rocket-toy");
const confettiContainer = document.getElementById("confetti");

// Audio Elements
const bubbleSound = document.getElementById("bubble-sound");
const drumSound = document.getElementById("drum-sound");
const rocketSound = document.getElementById("rocket-sound");
const successSound = document.getElementById("success-sound");

// State
let currentColor = "red";
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  // Load saved theme preference
  const savedTheme = localStorage.getItem("themePreference");
  if (savedTheme === "dark-mode") {
    document.body.classList.add("dark-mode");
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }

  // Load saved name
  const savedName = localStorage.getItem("kidName");
  if (savedName) {
    kidNameDisplay.textContent = savedName;
    nameInput.value = savedName;
  }

  // Set up drawing canvas
  setupDrawing();
});

// Theme toggle functionality
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  // Save theme preference
  const themePreference = document.body.classList.contains("dark-mode")
    ? "dark-mode"
    : "light-mode";
  localStorage.setItem("themePreference", themePreference);

  // Update icon
  const icon = themeToggle.querySelector("i");
  if (document.body.classList.contains("dark-mode")) {
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
  } else {
    icon.classList.remove("fa-sun");
    icon.classList.add("fa-moon");
  }
});

// Save name functionality
saveNameBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();
  if (name) {
    kidNameDisplay.textContent = name;
    localStorage.setItem("kidName", name);
    successSound.play();
    createConfetti();
  }
});

// Play with toys functionality
playButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const toy = this.closest(".toy");

    if (toy.id === "bubble-toy") {
      createBubbles();
      bubbleSound.currentTime = 0;
      bubbleSound.play();
    } else if (toy.id === "drum-toy") {
      animateDrum();
      drumSound.currentTime = 0;
      drumSound.play();
    } else if (toy.id === "rocket-toy") {
      launchRocket();
      rocketSound.currentTime = 0;
      rocketSound.play();
    }
  });
});

// Drawing functionality
function setupDrawing() {
  // Mouse events
  drawingCanvas.addEventListener("mousedown", startDrawing);
  drawingCanvas.addEventListener("mousemove", draw);
  drawingCanvas.addEventListener("mouseup", stopDrawing);
  drawingCanvas.addEventListener("mouseout", stopDrawing);

  // Touch events for mobile
  drawingCanvas.addEventListener("touchstart", handleTouchStart);
  drawingCanvas.addEventListener("touchmove", handleTouchMove);
  drawingCanvas.addEventListener("touchend", stopDrawing);
}

function startDrawing(e) {
  isDrawing = true;
  [lastX, lastY] = getPosition(e);
}

function draw(e) {
  if (!isDrawing) return;

  const [x, y] = getPosition(e);
  drawLine(lastX, lastY, x, y);
  [lastX, lastY] = [x, y];
}

function stopDrawing() {
  isDrawing = false;
}

function getPosition(e) {
  let x, y;
  if (e.type.includes("touch")) {
    const touch = e.touches[0] || e.changedTouches[0];
    const rect = drawingCanvas.getBoundingClientRect();
    x = touch.clientX - rect.left;
    y = touch.clientY - rect.top;
  } else {
    x = e.offsetX;
    y = e.offsetY;
  }
  return [x, y];
}

function drawLine(x1, y1, x2, y2) {
  const line = document.createElement("div");
  line.style.position = "absolute";
  line.style.left = `${x1}px`;
  line.style.top = `${y1}px`;
  line.style.width = `${Math.sqrt(
    Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)
  )}px`;
  line.style.height = "4px";
  line.style.backgroundColor = currentColor;
  line.style.transformOrigin = "0 0";
  line.style.transform = `rotate(${Math.atan2(y2 - y1, x2 - x1)}rad)`;
  drawingCanvas.appendChild(line);
}

function handleTouchStart(e) {
  e.preventDefault();
  startDrawing(e);
}

function handleTouchMove(e) {
  e.preventDefault();
  draw(e);
}

// Color picker functionality
colorButtons.forEach((button) => {
  button.addEventListener("click", function () {
    currentColor = this.dataset.color;
  });
});

// Clear drawing functionality
clearDrawingBtn.addEventListener("click", () => {
  drawingCanvas.innerHTML = "";
});

// Toy animations
function createBubbles() {
  for (let i = 0; i < 20; i++) {
    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.style.left = `${Math.random() * 100}%`;
    bubble.style.width = `${10 + Math.random() * 20}px`;
    bubble.style.height = bubble.style.width;
    bubble.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 80%)`;
    bubble.style.animation = `bubble ${
      1 + Math.random() * 2
    }s ease-in forwards`;
    bubble.style.animationDelay = `${Math.random() * 0.5}s`;
    bubbleToy.appendChild(bubble);

    bubble.addEventListener("animationend", () => {
      bubble.remove();
    });
  }
}

function animateDrum() {
  drumToy.style.animation = "drum-beat 0.3s ease";
  drumToy.addEventListener("animationend", () => {
    drumToy.style.animation = "";
  });
}

function launchRocket() {
  const rocket = document.createElement("div");
  rocket.innerHTML =
    '<i class="fas fa-rocket" style="font-size: 2rem; color: var(--accent-color)"></i>';
  rocket.style.position = "absolute";
  rocket.style.left = "50%";
  rocket.style.bottom = "20px";
  rocket.style.transform = "translateX(-50%)";
  rocket.style.animation = "rocket-launch 2s ease-in forwards";
  rocketToy.appendChild(rocket);

  rocket.addEventListener("animationend", () => {
    rocket.remove();
  });
}

function createConfetti() {
  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.left = `${Math.random() * 100}vw`;
    confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
    confetti.style.animation = `confetti-fall ${
      2 + Math.random() * 3
    }s linear forwards`;
    confetti.style.animationDelay = `${Math.random() * 0.5}s`;
    confettiContainer.appendChild(confetti);

    confetti.addEventListener("animationend", () => {
      confetti.remove();
    });
  }
}
