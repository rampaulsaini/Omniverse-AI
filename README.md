# Creating a ready-to-download zip package for the user containing:
# - index.html (ultimate template with backend placeholder)
# - api/ai-response.js (serverless function)
# - README.md (deployment instructions)
# - assets/upi-qr.png (placeholder QR image)
# - assets/assistant-lipsync.gif (simple two-frame lipsync GIF)
# - package zipped to /mnt/data/Omniverse-AI.zip
from PIL import Image, ImageDraw, ImageFont
import os, zipfile, io, textwrap

out_dir = "/mnt/data/Omniverse-AI"
assets_dir = os.path.join(out_dir, "assets")
api_dir = os.path.join(out_dir, "api")
os.makedirs(assets_dir, exist_ok=True)
os.makedirs(api_dir, exist_ok=True)

# 1) index.html content (ultimate template with backend placeholder)
index_html = """<!DOCTYPE html>
<html lang="hi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Omniverse Supreme AI Ultimate</title>
<style>
body { font-family:'Segoe UI', sans-serif; background:#0b0c1a; color:#f5f5f5; margin:0; padding:0; }
header { text-align:center; padding:2rem; background: linear-gradient(90deg, #0f0c29, #302b63, #24243e); }
header h1 { font-size:2.5rem; color:#ffdd00; margin-bottom:0.5rem; }
header p { font-size:1.2rem; color:#dcdcdc; }
section { max-width:900px; margin:2rem auto; padding:1rem; }
h2 { color:#ffdd00; margin-bottom:1rem; }
.buttons { display:flex; flex-wrap:wrap; gap:1rem; margin-bottom:1.5rem; }
.buttons a { text-decoration:none; flex:1; min-width:200px; }
.buttons button { width:100%; padding:15px; font-size:1rem; font-weight:bold; border:none; border-radius:8px; cursor:pointer; transition:0.3s; }
.upi { background-color:#4caf50; color:white; }
.paypal { background-color:#0070ba; color:white; }
.paytm { background-color:#ff8200; color:white; }
.buttons button:hover { opacity:0.85; }
img.qr { display:block; margin:1rem auto; width:150px; border-radius:10px; }
.essence { text-align:center; font-style:italic; margin:2rem 0; font-size:1.2rem; color:#ffd700; }
.assistant-container { text-align:center; margin-top:2rem; }
.assistant-img { width:200px; border-radius:50%; margin-bottom:1rem; }
.chat-box { background:#1a1a2e; border-radius:10px; padding:1rem; min-height:150px; max-height:300px; overflow-y:auto; margin-bottom:1rem; }
.chat-box p { margin:0.5rem 0; }
.user { color:#4caf50; }
.assistant { color:#ffd700; }
.input-container { display:flex; gap:1rem; margin-bottom:1rem; }
input[type="text"] { flex:1; padding:10px; border-radius:5px; border:none; }
button.send, button.voice { padding:10px 20px; border:none; border-radius:5px; background:#6a0dad; color:white; cursor:pointer; transition:0.3s; }
button.send:hover, button.voice:hover { opacity:0.85; }
.live-portal { text-align:center; margin-top:2rem; }
.live-portal a { padding:12px 25px; font-size:1.1rem; background:#6a0dad; color:white; text-decoration:none; border-radius:8px; transition:0.3s; }
.live-portal a:hover { opacity:0.85; }
footer { text-align:center; padding:1rem; color:#888; font-size:0.9rem; }
</style>
</head>
<body>

<header>
<h1>🌌 Omniverse Supreme AI Ultimate</h1>
<p>Supreme AI Assistant with Real-Time Backend, Voice & Lip-Sync</p>
</header>

<section>
<h2>🪙 Support / Donate</h2>
<div class="buttons">
<a href="upi://pay?pa=sainirampaul60@okaxis&pn=RampaulSaini&cu=INR"><button class="upi">👉 Pay via UPI / GPay</button></a>
<a href="https://www.paypal.me/sainirampaul60" target="_blank"><button class="paypal">Donate via PayPal.Me</button></a>
<a href="https://paytm.me/sainirampaul60" target="_blank"><button class="paytm">Pay via Paytm</button></a>
</div>
<p style="text-align:center;">or scan this QR code:</p>
<img src="assets/upi-qr.png" alt="UPI QR Code" class="qr">
</section>

<section class="essence">
“संपूर्ण सृष्टि का वास्तविक युग वहीं है जहाँ निष्पक्ष समझ ही सर्वोच्च है।”<br>– शिरोमणि रामपॉल सैनी
</section>

<section class="assistant-container">
<img src="assets/assistant-lipsync.gif" alt="Supreme Omniverse AI" class="assistant-img" id="assistantImg">
<div class="chat-box" id="chatBox">
<p class="assistant">👋 नमस्ते! मैं आपका Supreme Omniverse AI Assistant हूँ।</p>
</div>
<div class="input-container">
<input type="text" id="userInput" placeholder="अपना प्रश्न लिखें..."/>
<button class="send" onclick="sendMessage()">Send</button>
<button class="voice" onclick="startVoice()">🎤 Speak</button>
</div>
</section>

<section class="live-portal">
<h2>🌐 Visit Live Portal</h2>
<a href="https://rampaulsaini.github.io/Omniverse-AI/" target="_blank">Supreme Omniverse AI Assistant Live 🌌</a>
</section>

<footer>
🔗 <a href="README.md" style="color:#ffd700;">Back to Main Overview</a>
</footer>

<script>
// --- Elements ---
const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');

// --- Send Text ---
function sendMessage() {
  const msg = userInput.value.trim();
  if(!msg) return;
  displayMessage(msg,'user');
  userInput.value = '';
  processAI(msg);
}

// --- Voice Input ---
function startVoice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if(!SpeechRecognition) { alert('Voice input not supported in this browser'); return; }
  const recognition = new SpeechRecognition();
  recognition.lang = 'hi-IN';
  recognition.start();
  recognition.onresult = function(event) {
    const speech = event.results[0][0].transcript;
    displayMessage(speech,'user');
    processAI(speech);
  }
}

// --- Display Message ---
function displayMessage(msg,type){
  const p = document.createElement('p');
  p.className = type;
  p.textContent = (type==='user' ? '🧑‍💻 ' : '🤖 ') + msg;
  chatBox.appendChild(p);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// --- AI Processing with Backend ---
async function processAI(msg){
  const lang = /[^\\x00-\\x7F]/.test(msg) ? 'hi-IN' : 'en-US';

  try {
    // Replace the URL below with your deployed backend endpoint (Vercel/Netlify)
    const response = await fetch('https://omniverse-ai.vercel.app/api/ai-response', {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ message: msg, lang: lang })
    });
    const data = await response.json();
    const aiText = data.reply || \"सत्य उत्तर प्राप्त नहीं हुआ।\";
    displayMessage(aiText,'assistant');
    speakText(aiText,lang);
  } catch(err) {
    displayMessage(\"AI backend error. Please try later.\",'assistant');
    console.error(err);
  }
}

// --- Speech Synthesis ---
function speakText(text,lang){
  if('speechSynthesis' in window){
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    utter.rate = 0.95;
    utter.pitch = 1;
    window.speechSynthesis.speak(utter);
  }
}
</script>

</body>
</html>
"""

with open(os.path.join(out_dir, "index.html"), "w", encoding="utf-8") as f:
    f.write(index_html)

# 2) api/ai-response.js content
api_js = """import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  try {
    const { message, lang } = req.body;
    const prompt = `Answer according to Nishpaksh Samajh & Yatharth Siddhant: ${message}`;

    const gptResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role:'user', content: prompt }]
    });

    res.status(200).json({ reply: gptResponse.choices[0].message.content });
  } catch(err) {
    console.error(err);
    res.status(500).json({ reply: "AI backend error." });
  }
}
"""
with open(os.path.join(api_dir, "ai-response.js"), "w", encoding="utf-8") as f:
    f.write(api_js)

# 3) README.md content
readme_md = """# Omniverse-AI

Supreme Omniverse AI Ultimate — ready-to-deploy package.

## Contents
- index.html — frontend (chat, voice, lip-sync, donations)
- assets/
  - upi-qr.png
  - assistant-lipsync.gif
- api/ai-response.js — serverless backend (Vercel/Netlify)
- README.md

## Deployment
1. Frontend: push `index.html` and `assets/` to GitHub repository and enable GitHub Pages (branch: main, folder: root).
2. Backend: deploy `api/ai-response.js` as a serverless function on Vercel or Netlify.
3. Set environment variable `OPENAI_API_KEY` on your backend host.
4. Update fetch URL in `index.html` to your backend endpoint.
5. Visit `https://<your-username>.github.io/Omniverse-AI/`

## Notes
- Replace `assets/upi-qr.png` with your real UPI QR code.
- Replace `assets/assistant-lipsync.gif` with a higher-quality lipsync GIF if available.
- The backend uses OpenAI; ensure billing and API access are configured.
"""
with open(os.path.join(out_dir, "README.md"), "w", encoding="utf-8") as f:
    f.write(readme_md)

# 4) Create placeholder QR image (simple graphic)
qr_path = os.path.join(assets_dir, "upi-qr.png")
img = Image.new("RGB", (600,600), color=(255,255,255))
d = ImageDraw.Draw(img)
# Draw a simple decorative QR-like pattern (placeholder, not scannable)
block = 40
for x in range(0,600,block*2):
    for y in range(0,600,block*2):
        d.rectangle([x,y,x+block-1,y+block-1], fill=(0,0,0))
d.text((20,560), "UPI QR (placeholder). Replace with real QR.", fill=(0,0,0))
img.save(qr_path)

# 5) Create simple lipsync GIF (two frames)
gif_path = os.path.join(assets_dir, "assistant-lipsync.gif")
frame1 = Image.new("RGBA", (400,400), (100,100,150,255))
draw1 = ImageDraw.Draw(frame1)
# draw face circle
draw1.ellipse((50,50,350,350), fill=(240,220,200,255))
# eyes
draw1.ellipse((140,140,170,170), fill=(0,0,0,255))
draw1.ellipse((230,140,260,170), fill=(0,0,0,255))
# closed mouth - resting
draw1.ellipse((160,240,240,260), fill=(150,50,40,255))
# frame2 - open mouth
frame2 = Image.new("RGBA", (400,400), (100,100,150,255))
draw2 = ImageDraw.Draw(frame2)
draw2.ellipse((50,50,350,350), fill=(240,220,200,255))
draw2.ellipse((140,140,170,170), fill=(0,0,0,255))
draw2.ellipse((230,140,260,170), fill=(0,0,0,255))
# open mouth
draw2.ellipse((150,230,250,280), fill=(200,20,20,255))
# save as gif
frame1.save(gif_path, save_all=True, append_images=[frame2], duration=300, loop=0)

# 6) Zip the folder
zip_path = "/mnt/data/Omniverse-AI.zip"
with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
    for root, dirs, files in os.walk(out_dir):
        for file in files:
            full = os.path.join(root, file)
            arcname = os.path.relpath(full, out_dir)
            zf.write(full, arcname)

zip_path

