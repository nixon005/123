// -----------------------------
// 1) Typing effect on intro
// -----------------------------
const introText = "Warning ⚠️ A Drama Queen Is Turning 16 Today";
const typingTarget = document.getElementById("typing-target");
const continueBtn = document.getElementById("continue-btn");
const music = document.getElementById("bg-music");

let typeIndex = 0;

function typeWriter() {
  if (typeIndex < introText.length) {
    typingTarget.textContent += introText.charAt(typeIndex);
    typeIndex += 1;
    setTimeout(typeWriter, 70);
  }
}

// -----------------------------
// 2) Reveal elements on scroll
// -----------------------------
const faders = document.querySelectorAll(".fade-in");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  {
    threshold: 0.2,
  }
);

faders.forEach((item) => revealObserver.observe(item));

// -----------------------------
// 3) Continue button behavior
// -----------------------------
continueBtn.addEventListener("click", () => {
  document.getElementById("memories").scrollIntoView({ behavior: "smooth" });

  // Optional soft music: keep muted initially (autoplay policy-safe),
  // then unmute on user interaction so it becomes audible.
  music
    .play()
    .then(() => {
      music.muted = false;
      music.volume = 0.25;
    })
    .catch(() => {
      // If audio fails (missing file or browser policy), silently continue.
    });
});

// -----------------------------
// 4) Simple slideshow
// -----------------------------
const slides = document.querySelectorAll(".slide");
let currentSlide = 0;

setInterval(() => {
  slides[currentSlide].classList.remove("active");
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add("active");
}, 3200);

// -----------------------------
// 5) Floating particles canvas
// -----------------------------
const particlesCanvas = document.getElementById("particles-canvas");
const pCtx = particlesCanvas.getContext("2d");
let particles = [];

function resizeParticlesCanvas() {
  particlesCanvas.width = window.innerWidth;
  particlesCanvas.height = window.innerHeight;
}

class Particle {
  constructor() {
    this.reset();
    this.y = Math.random() * particlesCanvas.height;
  }

  reset() {
    this.x = Math.random() * particlesCanvas.width;
    this.y = particlesCanvas.height + Math.random() * 120;
    this.size = Math.random() * 2 + 0.5;
    this.speed = Math.random() * 0.4 + 0.2;
    this.alpha = Math.random() * 0.5 + 0.2;
  }

  update() {
    this.y -= this.speed;
    if (this.y < -10) this.reset();
  }

  draw() {
    pCtx.beginPath();
    pCtx.fillStyle = `rgba(255, 185, 240, ${this.alpha})`;
    pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    pCtx.fill();
  }
}

function initParticles() {
  particles = Array.from({ length: 85 }, () => new Particle());
}

function animateParticles() {
  pCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
  particles.forEach((particle) => {
    particle.update();
    particle.draw();
  });
  requestAnimationFrame(animateParticles);
}

// -----------------------------
// 6) Confetti on final section
// -----------------------------
const confettiCanvas = document.getElementById("confetti-canvas");
const cCtx = confettiCanvas.getContext("2d");
const finalSection = document.getElementById("final");
let confettiPieces = [];
let confettiRunning = false;

function resizeConfettiCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}

class Confetti {
  constructor() {
    this.x = Math.random() * confettiCanvas.width;
    this.y = -20;
    this.size = Math.random() * 8 + 4;
    this.speedY = Math.random() * 2.2 + 1.2;
    this.speedX = Math.random() * 1.2 - 0.6;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = Math.random() * 10 - 5;
    this.color = ["#ff7bc9", "#b98bff", "#ffd7f1", "#ffe681"][
      Math.floor(Math.random() * 4)
    ];
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.rotation += this.rotationSpeed;
  }

  draw() {
    cCtx.save();
    cCtx.translate(this.x, this.y);
    cCtx.rotate((this.rotation * Math.PI) / 180);
    cCtx.fillStyle = this.color;
    cCtx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
    cCtx.restore();
  }
}

function animateConfetti() {
  if (!confettiRunning) return;

  cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  confettiPieces.forEach((piece) => {
    piece.update();
    piece.draw();
  });

  confettiPieces = confettiPieces.filter((piece) => piece.y < confettiCanvas.height + 40);

  if (confettiPieces.length < 180) {
    confettiPieces.push(new Confetti());
  }

  requestAnimationFrame(animateConfetti);
}

const finalObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !confettiRunning) {
        confettiRunning = true;
        confettiPieces = Array.from({ length: 120 }, () => new Confetti());
        animateConfetti();
      }
    });
  },
  { threshold: 0.45 }
);

finalObserver.observe(finalSection);

// -----------------------------
// 7) Initial setup
// -----------------------------
window.addEventListener("resize", () => {
  resizeParticlesCanvas();
  resizeConfettiCanvas();
});

resizeParticlesCanvas();
resizeConfettiCanvas();
initParticles();
animateParticles();
typeWriter();
