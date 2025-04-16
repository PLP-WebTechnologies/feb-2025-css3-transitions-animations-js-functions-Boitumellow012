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
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("form-message");

// Audio Elements
const bubbleSound = document.getElementById("bubble-sound");
const drumSound = document.getElementById("drum-sound");
const rocketSound = document.getElementById("rocket-sound");
const successSound = document.getElementById("success-sound");
const kickSound = document.getElementById("kick-sound");
const snareSound = document.getElementById("snare-sound");
const hihatSound = document.getElementById("hihat-sound");
const cymbalSound = document.getElementById("cymbal-sound");

// State
let currentColor = "red";
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let bubbleInterval;
const bubbleContainer = bubbleToy ? bubbleToy.querySelector('.bubble-container') : null;

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
    // Load saved theme preference
    const savedTheme = localStorage.getItem("themePreference");
    if (savedTheme === "dark-mode") {
        document.body.classList.add("dark-mode");
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }

    // Load saved name
    const savedName = localStorage.getItem("kidName");
    if (savedName && kidNameDisplay) {
        kidNameDisplay.textContent = savedName;
        if (nameInput) {
            nameInput.value = savedName;
        }
    }

    if (drawingCanvas) {
        setupDrawing();
    }

    if (drumToy) {
        setupDrumKit();
    }

    if (contactForm) {
        setupContactForm();
    }
});

// Theme toggle functionality
if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");

        const themePreference = document.body.classList.contains("dark-mode")
            ? "dark-mode"
            : "light-mode";
        localStorage.setItem("themePreference", themePreference);

        const icon = themeToggle.querySelector("i");
        if (document.body.classList.contains("dark-mode")) {
            icon.classList.remove("fa-moon");
            icon.classList.add("fa-sun");
        } else {
            icon.classList.remove("fa-sun");
            icon.classList.add("fa-moon");
        }
    });
}

// Save name functionality
if (saveNameBtn) {
    saveNameBtn.addEventListener("click", () => {
        const name = nameInput.value.trim();
        if (name) {
            kidNameDisplay.textContent = name;
            localStorage.setItem("kidName", name);
            if (successSound) {
                successSound.play();
            }
            createConfetti();
        }
    });
}

// Play with toys functionality
if (playButtons.length > 0) {
    playButtons.forEach((button) => {
        button.addEventListener("click", function () {
            const toy = this.closest(".toy");

            if (toy.id === "bubble-toy") {
                createBubbles();
                if (bubbleSound) {
                    bubbleSound.currentTime = 0;
                    bubbleSound.play();
                }
            } else if (toy.id === "drum-toy") {
                animateDrum();
                if (drumSound) {
                    drumSound.currentTime = 0;
                    drumSound.play();
                }
            } else if (toy.id === "rocket-toy") {
                launchRocket();
                if (rocketSound) {
                    rocketSound.currentTime = 0;
                    rocketSound.play();
                }
            }
        });
    });
}

// Drawing functionality
function setupDrawing() {
    drawingCanvas.addEventListener("mousedown", startDrawing);
    drawingCanvas.addEventListener("mousemove", draw);
    drawingCanvas.addEventListener("mouseup", stopDrawing);
    drawingCanvas.addEventListener("mouseout", stopDrawing);

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
    const rect = drawingCanvas.getBoundingClientRect();
    
    if (e.type.includes("touch")) {
        const touch = e.touches[0] || e.changedTouches[0];

        x = touch.clientX - rect.left;
        y = touch.clientY - rect.top;
    } else {
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
    }
    
    x = Math.max(0, Math.min(x, rect.width));
    y = Math.max(0, Math.min(y, rect.height));
    
    return [x, y];
}

function drawLine(x1, y1, x2, y2) {
    const rect = drawingCanvas.getBoundingClientRect();
    if (x1 < 0 || x1 > rect.width || y1 < 0 || y1 > rect.height ||
        x2 < 0 || x2 > rect.width || y2 < 0 || y2 > rect.height) {
        return;
    }

    const line = document.createElement("div");
    line.style.position = "absolute";
    line.style.left = `${x1}px`;
    line.style.top = `${y1}px`;
    line.style.width = `${Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))}px`;
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
if (colorButtons.length > 0) {
    colorButtons.forEach((button) => {
        button.addEventListener("click", function () {
            currentColor = this.dataset.color;
        });
    });
}

// Clear drawing functionality
if (clearDrawingBtn) {
    clearDrawingBtn.addEventListener("click", () => {
        drawingCanvas.innerHTML = "";
    });
}

// Toy animations
// Bubble functions
function createBubbles() {
    if (!bubbleContainer) return;
    
    clearBubbles();
    
    bubbleToy.classList.add('bubble-active');
    
    bubbleInterval = setInterval(() => {
        const bubble = document.createElement('div');
        const size = 20 + Math.random() * 50;
        const startPos = 5 + Math.random() * 90;
        
        bubble.className = 'bubble';
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${startPos}%`;
        bubble.style.bottom = '0';
        bubble.style.backgroundColor = `hsla(${Math.random() * 360}, 80%, 70%, 0.7)`;
        bubble.style.animation = `bubble-rise ${3 + Math.random() * 4}s linear forwards`;
        
        bubble.addEventListener('click', () => popBubble(bubble));
        bubbleContainer.appendChild(bubble);
    }, 300);
    
    if (bubbleSound) {
        bubbleSound.currentTime = 0;
        bubbleSound.play();
    }
}

function popBubble(bubble) {
    bubble.style.transform = 'scale(1.3)';
    bubble.style.opacity = '0';
    
    if (bubbleSound) {
        const popSound = bubbleSound.cloneNode();
        popSound.currentTime = 0;
        popSound.play();
    }
    
    setTimeout(() => {
        bubble.remove();
    }, 200);
}

function clearBubbles() {
    if (!bubbleContainer) return;
    
    bubbleContainer.innerHTML = '';
    clearInterval(bubbleInterval);
    bubbleToy.classList.remove('bubble-active');
}

// Event listeners for bubble buttons
if (document.getElementById('bubble-btn')) {
    document.getElementById('bubble-btn').addEventListener('click', createBubbles);
    document.getElementById('stop-bubbles').addEventListener('click', clearBubbles);
}

// Drum functions
function setupDrumKit() {
    let isRecording = false;
    let recordingStartTime;
    let drumRecording = [];
    let savedBeats = [];
    const drumPads = document.querySelectorAll('.drum-pad');
    const recordBtn = document.getElementById('record-drum');
    const playBtn = document.getElementById('play-drum');
    const saveBtn = document.getElementById('save-drum');
    const clearBtn = document.getElementById('clear-drum');
    const savedBeatsContainer = document.querySelector('.saved-beats');
    const drumSounds = {
        kick: kickSound,
        snare: snareSound,
        hihat: hihatSound,
        cymbal: cymbalSound
    };

    function playDrumSound(soundType) {
        const sound = drumSounds[soundType];
        if (sound) {
            sound.currentTime = 0;
            sound.play();
            
            if (isRecording) {
                const time = Date.now() - recordingStartTime;
                drumRecording.push({ sound: soundType, time });
            }
        }
    }

    function startRecording() {
        isRecording = true;
        recordingStartTime = Date.now();
        drumRecording = [];
        recordBtn.textContent = 'Recording...';
        recordBtn.style.backgroundColor = '#ff4757';
        playBtn.disabled = true;
        saveBtn.disabled = true;
    }

    function stopRecording() {
        isRecording = false;
        recordBtn.textContent = 'Record';
        recordBtn.style.backgroundColor = '#ff4757';
        playBtn.disabled = false;
        saveBtn.disabled = false;
    }

    function playRecording() {
        if (drumRecording.length === 0) return;
        
        playBtn.disabled = true;
        recordBtn.disabled = true;
        
        drumRecording.forEach((note, index) => {
            setTimeout(() => {
                playDrumSound(note.sound);
                
                const pad = document.querySelector(`.drum-pad[data-sound="${note.sound}"]`);
                pad.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    pad.style.transform = '';
                }, 100);
                
                if (index === drumRecording.length - 1) {
                    setTimeout(() => {
                        playBtn.disabled = false;
                        recordBtn.disabled = false;
                    }, 500);
                }
            }, note.time);
        });
    }

    function saveRecording() {
        if (drumRecording.length === 0) return;
        
        const beatName = `Beat ${savedBeats.length + 1}`;
        savedBeats.push({ name: beatName, recording: [...drumRecording] });
        renderSavedBeats();
        clearBtn.disabled = false;
    }

    function clearRecording() {
        drumRecording = [];
        playBtn.disabled = true;
        saveBtn.disabled = true;
    }

    function renderSavedBeats() {
        savedBeatsContainer.innerHTML = '';
        savedBeats.forEach((beat, index) => {
            const beatElement = document.createElement('div');
            beatElement.className = 'saved-beat';
            beatElement.innerHTML = `
                <span>${beat.name}</span>
                <div>
                    <button class="play-saved" data-index="${index}">▶️</button>
                    <button class="delete-beat" data-index="${index}">🗑️</button>
                </div>
            `;
            savedBeatsContainer.appendChild(beatElement);
        });
    }

    function playSavedBeat(index) {
        drumRecording = [...savedBeats[index].recording];
        playRecording();
    }

    function deleteSavedBeat(index) {
        savedBeats.splice(index, 1);
        renderSavedBeats();
        if (savedBeats.length === 0) {
            clearBtn.disabled = true;
        }
    }

    // Drum event listeners
    drumPads.forEach(pad => {
        pad.addEventListener('click', () => {
            const soundType = pad.dataset.sound;
            playDrumSound(soundType);
        });
    });

    recordBtn.addEventListener('click', () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    });

    playBtn.addEventListener('click', playRecording);
    saveBtn.addEventListener('click', saveRecording);
    clearBtn.addEventListener('click', clearRecording);

    document.addEventListener('keydown', (e) => {
        const keyMap = {
            'q': 'kick',
            'w': 'snare',
            'e': 'hihat',
            'r': 'cymbal'
        };
        
        if (keyMap[e.key] && !isRecording) {
            playDrumSound(keyMap[e.key]);
            const pad = document.querySelector(`.drum-pad[data-sound="${keyMap[e.key]}"]`);
            pad.style.transform = 'scale(0.95)';
            setTimeout(() => {
                pad.style.transform = '';
            }, 100);
        }
    });

    savedBeatsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('play-saved')) {
            playSavedBeat(parseInt(e.target.dataset.index));
        } else if (e.target.classList.contains('delete-beat')) {
            deleteSavedBeat(parseInt(e.target.dataset.index));
        }
    });
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

// Contact form functionality
function setupContactForm() {
    contactForm.addEventListener("submit", function(e) {
        e.preventDefault();
        
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const subject = document.getElementById("subject").value.trim();
        const message = document.getElementById("message").value.trim();
        
        if (!name || !email || !subject || !message) {
            showFormMessage("Please fill in all fields", "error");
            return;
        }
        
        if (!validateEmail(email)) {
            showFormMessage("Please enter a valid email address", "error");
            return;
        }
        
        showFormMessage("Thank you for your message! We'll get back to you soon.", "success");
        contactForm.reset();
    });
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showFormMessage(text, type) {
    formMessage.textContent = text;
    formMessage.className = type;
    formMessage.style.display = "block";
    
    setTimeout(() => {
        formMessage.style.display = "none";
    }, 5000);
}