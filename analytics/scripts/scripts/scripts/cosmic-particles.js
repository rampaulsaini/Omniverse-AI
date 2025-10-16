// Floating cosmic particles background + pulse reaction
const canvas = document.createElement('canvas');
canvas.id = 'cosmic-canvas';
document.body.appendChild(canvas);
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.zIndex = '-1';
canvas.style.pointerEvents = 'none';

const ctx = canvas.getContext('2d');
let particles = [];
const numParticles = 80;
let pulseFactor = 1;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function createParticles() {
  particles = [];
  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      glow: Math.random() * 0.5 + 0.5
    });
  }
}
createParticles();

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius * pulseFactor, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(255,215,255,${p.glow})`;
    ctx.shadowBlur = 8 * pulseFactor;
    ctx.shadowColor = '#ffdfff';
    ctx.fill();
    p.x += p.speedX;
    p.y += p.speedY;

    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();

// Trigger pulse reaction from outside
function triggerPulse(duration = 600) {
  let start = performance.now();
  function animate(time) {
    let progress = (time - start) / duration;
    if (progress > 1) { pulseFactor = 1; return; }
    // simple ease-out pulse
    pulseFactor = 1 + 0.5 * Math.sin(progress * Math.PI);
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}
window.triggerParticlePulse = triggerPulse;
    
