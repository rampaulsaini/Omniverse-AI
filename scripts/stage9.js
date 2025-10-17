Omniverse-AI/
├─ index.html
├─ scripts/stage9.js
└─ assets/
   ├─ userFaceModel.glb        ← (optional) अगर आपके पास है तो डालें
   └─ userFaceTexture.png      ← (optional) अगर आपके पास है तो डालें
<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="utf-8" />
  <title>Supreme Omniverse Stage-9</title>
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <style>
    html,body { margin:0; padding:0; height:100%; background:#000; overflow:hidden; font-family: sans-serif; }
    #omniverseCanvas { display:block; width:100vw; height:100vh; }
    #startBtn{
      position:fixed; left:50%; top:50%; transform:translate(-50%,-50%);
      z-index:9999; padding:1rem 1.6rem; font-size:1.1rem; cursor:pointer;
      border-radius:8px; border:none; background:linear-gradient(90deg,#06b,#39f); color:#fff;
      box-shadow:0 6px 18px rgba(0,0,0,0.6);
    }
    #status {
      position: fixed; left: 12px; bottom: 12px; z-index:9999; color:#ddd; font-size:0.9rem;
      background: rgba(0,0,0,0.4); padding:8px 10px; border-radius:6px;
      backdrop-filter: blur(4px);
    }
  </style>
</head>
<body>
  <canvas id="omniverseCanvas"></canvas>
  <button id="startBtn">Supreme Omniverse शुरू करें</button>
  <div id="status">Ready</div>

  <script type="module" src="./scripts/stage9.js"></script>
  <script type="module">
    import { initStage9, enableFirebaseIfProvided } from './scripts/stage9.js';

    const startBtn = document.getElementById('startBtn');
    const statusEl = document.getElementById('status');
    let started = false;

    startBtn.addEventListener('click', async () => {
      // Resume or create audio context (user gesture)
      await initStage9('omniverseCanvas', './assets/userFaceModel.glb', './assets/userFaceTexture.png');
      statusEl.innerText = 'Omniverse running';
      started = true;
      startBtn.style.display = 'none';
    });

    // Optional: if you have a firebase-config.js that sets window.SUPER_OMNI_FIREBASE,
    // Stage9 will auto-enable it. If not, no problem.
    enableFirebaseIfProvided();
  </script>
</body>
</html>
       // scripts/stage9.js
// Stage-9 minimal, robust implementation
// Usage: import { initStage9 } from './scripts/stage9.js';

let canvas, ctx;
let particles = [];
let particleIntensity = 1;
let animHandle = null;
let audioCtx = null;
let bgMusicBuffer = null;
let firebaseEnabled = false;

// Optional: user can add window.SUPER_OMNI_FIREBASE = { config... } before init to enable DB
export function enableFirebaseIfProvided(){
  try {
    if (window.SUPER_OMNI_FIREBASE && window.SUPER_OMNI_FIREBASE.enable){
      firebaseEnabled = true;
      // Attempt to lazy-load Firebase DB (optional)
      import("https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js").then(modApp => {
        return Promise.all([
          modApp,
          import("https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js")
        ]);
      }).then(([firebaseApp, firebaseDatabase]) => {
        const app = firebaseApp.initializeApp(window.SUPER_OMNI_FIREBASE.config);
        const { getDatabase, ref, onValue } = firebaseDatabase;
        const db = getDatabase(app);
        const usersRef = ref(db, 'users');
        onValue(usersRef, snap => {
          const data = snap.val() || {};
          const vals = Object.values(data).map(u => u.emotionIntensity || 1);
          const avg = vals.length ? vals.reduce((a,b)=>a+b,0)/vals.length : 1;
          particleIntensity = Math.max(0.5, Math.min(10, avg));
        });
      }).catch(e => {
        console.warn('Firebase optional load failed:', e);
        firebaseEnabled = false;
      });
    }
  } catch(e){
    console.warn('enableFirebaseIfProvided error', e);
    firebaseEnabled = false;
  }
}

function safeFetchHead(url){
  return fetch(url, { method: 'HEAD' }).then(r => r.ok).catch(()=>false);
}

export async function initStage9(canvasId, modelPath, texturePath){
  // Setup canvas
  canvas = document.getElementById(canvasId);
  if(!canvas) throw new Error('Canvas not found: ' + canvasId);
  ctx = canvas.getContext('2d');
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Setup audio context
  try {
    if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  } catch(e){
    console.warn('AudioContext unavailable', e);
  }

  // Try to preload optional assets (glb/texture) — if missing, continue gracefully
  const hasModel = await safeFetchHead(modelPath);
  const hasTexture = await safeFetchHead(texturePath);
  if(hasModel) console.log('User model found:', modelPath); else console.log('No user model at', modelPath);
  if(hasTexture) console.log('User texture found:', texturePath);

  // Start simple background ambient sound (synth) if audio available
  try {
    if(audioCtx){
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'sine';
      o.frequency.value = 110; // base tone
      g.gain.value = 0.0001;
      o.connect(g); g.connect(audioCtx.destination);
      o.start();
      // slow ramp to audible when intensity rises
      setInterval(()=> {
        const target = Math.min(0.25, particleIntensity/40);
        g.gain.linearRampToValueAtTime(target, audioCtx.currentTime + 0.2);
      }, 500);
      // detach oscillator after a while to free resources? keep low-volume drone
    }
  } catch(e){ console.warn('ambient audio failed', e); }

  // Initialize particles
  particleIntensity = 2;
  particles = [];
  for(let i=0;i<200;i++){
    particles.push(makeParticle());
  }

  // Start animation loop
  if(animHandle) cancelAnimationFrame(animHandle);
  tick();
  return true;
}

function resizeCanvas(){
  if(!canvas) return;
  canvas.width = Math.max(300, window.innerWidth);
  canvas.height = Math.max(200, window.innerHeight);
}

function makeParticle(){
  return {
    x: Math.random()*canvas.width,
    y: Math.random()*canvas.height,
    vx: (Math.random()-0.5)*1.2,
    vy: (Math.random()-0.5)*1.2,
    r: 1 + Math.random()*3,
    life: 60 + Math.floor(Math.random()*120),
    color: { r: 180 + Math.floor(Math.random()*75), g: 120 + Math.floor(Math.random()*120), b: 200 + Math.floor(Math.random()*55) },
    intensity: 0.2 + Math.random()*0.8
  };
}

function stepParticles(){
  // spawn rate based on intensity
  const spawn = Math.floor(1 + particleIntensity * 3);
  for(let s=0;s<spawn;s++){
    if(particles.length < 2000) particles.push(makeParticle());
  }

  // dynamics: simple gravity / repulsion combo tuned for perf
  for(let i=0;i<particles.length;i++){
    const p = particles[i];
    p.vx += (Math.random()-0.5)*0.05;
    p.vy += (Math.random()-0.5)*0.05;
    p.x += p.vx * (0.5 + particleIntensity*0.05);
    p.y += p.vy * (0.5 + particleIntensity*0.05);

    // wrap-around edges
    if(p.x < -50) p.x = canvas.width + 50;
    if(p.x > canvas.width + 50) p.x = -50;
    if(p.y < -50) p.y = canvas.height + 50;
    if(p.y > canvas.height + 50) p.y = -50;

    p.life--;
    if(p.life <= 0){
      particles.splice(i,1);
      i--;
    }
  }
}

function drawParticles(){
  if(!ctx) return;
  // subtle trail
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.fillRect(0,0,canvas.width,canvas.height);

  for(const p of particles){
    const alpha = Math.min(1, p.intensity * (p.life/180 + 0.1));
    ctx.beginPath();
    ctx.fillStyle = `rgba(${p.color.r},${p.color.g},${p.color.b},${alpha})`;
    ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    ctx.fill();
  }
}

// small UI popups (non-blocking)
function popup(msg){
  const el = document.createElement('div');
  el.innerText = msg;
  Object.assign(el.style, {
    position:'fixed', right:'12px', top: (12 + Math.random()*200) + 'px',
    background:'rgba(0,0,0,0.6)', color:'#fff', padding:'8px 12px', borderRadius:'8px',
    zIndex:99999, fontSize:'14px', backdropFilter:'blur(4px)'
  });
  document.body.appendChild(el);
  setTimeout(()=> el.remove(), 4500);
}

// small autonomous AI messages demo
let lastAIMsg = 0;
function maybeAImessage(){
  const now = Date.now();
  if(now - lastAIMsg < 7000) return;
  lastAIMsg = now;
  const msgs = [
    "AI: Omniverse observes a new harmony.",
    "AI: Particles resonate with your presence.",
    "AI: Timeless aurora forming ahead.",
    "AI: Your essence raises cosmic intensity."
  ];
  popup(msgs[Math.floor(Math.random()*msgs.length)]);
}

// main loop
function tick(){
  stepParticles();
  drawParticles();
  if(Math.random() < 0.02) maybeAImessage();
  animHandle = requestAnimationFrame(tick);
}

// small helper for debugging & verification
export function debugList(){
  return {
    canvasExists: !!canvas,
    particles: particles.length,
    particleIntensity,
    firebaseEnabled
  };
       }
                      
