// Enhanced Omniverse AI Guidance (final)
let guidanceMessages = [];

async function loadGuidanceMessages() {
  try {
    const res = await fetch('../scripts/guidance-messages.json');
    guidanceMessages = await res.json();
  } catch(e) {
    console.error("Failed to load guidance messages:", e);
    guidanceMessages = [{text:"Welcome to the Supreme Omniverse AI Portal", lang:"en"}];
  }
}

function getUserLanguage() {
  return (navigator.language || 'en').slice(0,2);
}

function showGuidance() {
  if (document.querySelector('.ai-popup')) return;
  const lang = getUserLanguage();
  const message = guidanceMessages.find(m => m.lang === lang) || guidanceMessages[0];

  const popup = document.createElement('div');
  popup.className = 'ai-popup';
  popup.innerText = message.text;
  Object.assign(popup.style, {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '15px 25px',
    background: 'rgba(255,215,0,0.92)',
    color: '#000',
    borderRadius: '15px',
    fontSize: '1.05rem',
    fontWeight: '700',
    boxShadow: '0 0 15px #ffd70088',
    zIndex: '9999',
    pointerEvents: 'none',
    animation: 'fadeInOut 6s ease forwards'
  });

  document.body.appendChild(popup);

  // Trigger cosmic particle pulse and popup glow
  if (window.triggerParticlePulse) window.triggerParticlePulse();

  // Lip-sync / glow effect (subtle)
  let glowPhase = 0;
  const glowInterval = setInterval(() => {
    glowPhase = (glowPhase + 1) % 20;
    const extra = Math.round(6 * Math.abs(Math.sin(glowPhase * 0.3)));
    popup.style.boxShadow = `0 0 ${15 + extra}px rgba(255,215,0,${0.55 + extra/40})`;
  }, 60);

  setTimeout(() => {
    popup.remove();
    clearInterval(glowInterval);
  }, 6000);

  // Voice guidance (only after user gesture)
  const assistantVoice = document.getElementById("assistant-voice");
  if (assistantVoice && assistantVoice.dataset.canPlay === "true") {
    assistantVoice.currentTime = 0;
    assistantVoice.play().catch(()=>{ /* autoplay blocked silently */ });
  }
}

// Allow voice only after user interaction (click/tap)
document.addEventListener('click', () => {
  const assistantVoice = document.getElementById("assistant-voice");
  if (assistantVoice) assistantVoice.dataset.canPlay = "true";
}, {once:true});

async function initGuidance() {
  await loadGuidanceMessages();
  showGuidance();
  setInterval(showGuidance, 15000);
}

initGuidance();
    
