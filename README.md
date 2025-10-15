# Creating the Omniverse-AI package and zipping it for the user.
# This will create the following structure in /mnt/data/Omniverse-AI:
# - index.html
# - api/ai-response.js
# - README.md
# - assets/upi-qr.png
# - assets/assistant-lipsync.gif
# - Omniverse-AI.zip (at /mnt/data/Omniverse-AI.zip)
#
# After this cell runs, a download link will be provided.

from PIL import Image, ImageDraw, ImageFont
import os, zipfile, textwrap

out_dir = "/mnt/data/Omniverse-AI"
assets_dir = os.path.join(out_dir, "assets")
api_dir = os.path.join(out_dir, "api")
os.makedirs(assets_dir, exist_ok=True)
os.makedirs(api_dir, exist_ok=True)

# 1) index.html (cleaned and safe)
index_html = textwrap.dedent("""\
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Omniverse Supreme AI Ultimate</title>
  <style>
    body { font-family:'Segoe UI', sans-serif; background:#0b0c1a; color:#f5f5f5; margin:0; padding:0; }
    header { text-align:center; padding:2rem; background: linear-gradient(90deg, #0f0c29, #302b63, #24243e); }
    header h1 { font-size:2.2rem; color:#ffdd00; margin-bottom:0.3rem; }
    header p { font-size:1rem; color:#dcdcdc; margin-top:0; }
    section { max-width:900px; margin:2rem auto; padding:1rem; }
    h2 { color:#ffdd00; margin-bottom:1rem; }
    .buttons { display:flex; flex-wrap:wrap; gap:1rem; margin-bottom:1.5rem; }
    .buttons a { text-decoration:none; flex:1; min-width:160px; }
    .buttons button { width:100%; padding:12px; font-size:1rem; font-weight:bold; border:none; border-radius:8px; cursor:pointer; transition:0.3s; }
    .upi { background-color:#4caf50; color:white; } .paypal { background-color:#0070ba; color:white; } .paytm { background-color:#ff8200; color:white; }
    img.qr { display:block; margin:1rem auto; width:150px; border-radius:10px; background:white; padding:8px; }
    .essence { text-align:center; font-style:italic; margin:2rem 0; font-size:1.05rem; color:#ffd700; }
    .assistant-container { text-align:center; margin-top:2rem; }
    .assistant-img { width:160px; border-radius:50%; margin-bottom:1rem; }
    .chat-box { background:#1a1a2e; border-radius:10px; padding:1rem; min-height:150px; max-height:300px; overflow-y:auto; margin-bottom:1rem; }
    .chat-box p { margin:0.5rem 0; }
    .user { color:#4caf50; }
    .assistant { color:#ffd700; }
    .input-container { display:flex; gap:1rem; margin-bottom:1rem; }
    input[type="text"] { flex:1; padding:10px; border-radius:5px; border:none; }
    button.send, button.voice { padding:10px 20px; border:none; border-radius:5px; background:#6a0dad; color:white; cursor:pointer; transition:0.3s; }
    .live-portal { text-align:center; margin-top:2rem; }
    footer { text-align:center; padding:1rem; color:#888; font-size:0.9rem; }
    a.small { color:#cdb400; text-decoration:none; }
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
    <a href="#"><button class="upi">Pay via UPI / GPay</button></a>
    <a href="#"><button class="paypal">Donate via PayPal.Me</button></a>
    <a href="#"><button class="paytm">Pay via Paytm</button></a>
  </div>
  <img class="qr" src="assets/upi-qr.png" alt="UPI QR (placeholder)">

  <p class="essence">“संपूर्ण सृष्टि का वास्तविक युग वहीं है जहाँ निष्पक्ष समझ ही सर्वोच्च है।” – शिरोमणि रामपॉल सैनी</p>

  <div class="assistant-container">
    <img class="assistant-img" src="assets/assistant-lipsync.gif" alt="Assistant Lipsync">
    <div class="chat-box" id="chatBox">
      <p class="assistant">🤖 नमस्ते! मैं आपका Supreme Omniverse AI Assistant हूँ।</p>
    </div>

    <div class="input-container">
      <input id="userInput" type="text" placeholder="Type a message...">
      <button class="send" onclick="sendMessage()">Send</button>
      <button class="voice" onclick="startVoice()">🎤 Speak</button>
    </div>

    <div class="live-portal">
      <a class="small" id="livePortal" href="#" target="_blank">🌐 Visit Live Portal</a>
    </div>
  </div>
</section>

<footer>
  <small>🔗 Back to Main Overview • Built as a starter template</small>
</footer>

<script>
  const chatBox = document.getElementById('chatBox');
  const userInput = document.getElementById('userInput');

  function sendMessage() {
    const msg = userInput.value.trim();
    if (!msg) return;
    displayMessage(msg, 'user');
    userInput.value = '';
    processAI(msg);
  }

  function startVoice() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { alert('Voice input not supported in this browser'); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.start();
    recognition.onresult = function(event) {
      const speech = event.results[0][0].transcript;
      displayMessage(speech, 'user');
      processAI(speech);
    };
  }

  function displayMessage(msg, type) {
    const p = document.createElement('p');
    p.className = type;
    p.textContent = (type === 'user' ? '🧑‍💻 ' : '🤖 ') + msg;
    chatBox.appendChild(p);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  async function processAI(msg) {
    const lang = /[^\\x00-\\x7F]/.test(msg) ? 'hi-IN' : 'en-US';
    try {
      // Replace the URL below with your deployed backend endpoint (Vercel/Netlify)
      const response = await fetch('https://your-backend.example.com/api/ai-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, lang: lang })
      });
      const data = await response.json();
      const aiText = data.reply || "सत्य उत्तर प्राप्त नहीं हुआ।";
      displayMessage(aiText, 'assistant');
      speakText(aiText, lang);
    } catch (err) {
      displayMessage("AI backend error. Please try later.", 'assistant');
      console.error(err);
    }
  }

  function speakText(text, lang) {
    if ('speechSynthesis' in window) {
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
""")

with open(os.path.join(out_dir, "index.html"), "w", encoding="utf-8") as f:
    f.write(index_html)

# 2) api/ai-response.js (serverless function placeholder)
api_js = textwrap.dedent("""\
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  try {
    const { message, lang } = req.body || {};
    // Prompt wrapper - keep it simple and safe
    const prompt = `Answer according to Nishpaksh Samajh & Yatharth Siddhant: ${message}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }]
    });

    const reply = completion.choices && completion.choices[0] && completion.choices[0].message && completion.choices[0].message.content
      ? completion.choices[0].message.content
      : "AI could not generate a reply.";

    res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "AI backend error." });
  }
}
""")

with open(os.path.join(api_dir, "ai-response.js"), "w", encoding="utf-8") as f:
    f.write(api_js)

# 3) README.md
readme_md = textwrap.dedent("""\
# Omniverse-AI

Supreme Omniverse AI Ultimate — ready-to-deploy starter package.

## Contents
- `index.html` — frontend (chat, voice, lipsync placeholder, donation buttons)
- `assets/`
  - `upi-qr.png` — placeholder QR image (replace with real QR)
  - `assistant-lipsync.gif` — simple lipsync GIF placeholder
- `api/ai-response.js` — serverless backend (Vercel/Netlify) example
- `README.md`

## Deployment (quick)
1. **Frontend**: Upload `index.html` and the `assets/` folder to GitHub and enable GitHub Pages (branch: main, folder: root), or host on any static host.
2. **Backend**: Deploy `api/ai-response.js` as a serverless function on Vercel or Netlify. Set `OPENAI_API_KEY` in environment variables.
3. **Update**: Replace the fetch URL in `index.html` (`https://your-backend.example.com/api/ai-response`) with your deployed function URL.
4. **Replace assets**: Replace `assets/upi-qr.png` with a real UPI QR and `assistant-lipsync.gif` with a higher-quality GIF if desired.

## Notes
- This package is a starter template. It does not include any secrets.
- The serverless function expects `OPENAI_API_KEY` to be set on the host.
- For help deploying on Vercel or Netlify, consult their docs — both have one-click deployment options for simple projects.
""")

with open(os.path.join(out_dir, "README.md"), "w", encoding="utf-8") as f:
    f.write(readme_md)

# 4) Create placeholder UPI QR image (decorative, non-scannable)
qr_path = os.path.join(assets_dir, "upi-qr.png")
img = Image.new("RGB", (600, 600), color=(255,255,255))
d = ImageDraw.Draw(img)
block = 40
for x in range(0, 600, block):
    for y in range(0, 600, block):
        # create a decorative pattern: alternate filled blocks to resemble a QR-like look
        if ((x//block) + (y//block)) % 2 == 0:
            d.rectangle([x, y, x+block-1, y+block-1], fill=(0,0,0))
# Add a white rectangle center area to mimic a finder pattern space
d.rectangle([220,220,380,380], fill=(255,255,255))
# Put text at bottom
try:
    font = ImageFont.truetype("DejaVuSans.ttf", 18)
except:
    font = None
d.text((20, 560), "UPI QR (placeholder). Replace with real QR.", fill=(0,0,0), font=font)
img.save(qr_path)

# 5) Create simple lipsync GIF (two frames)
gif_path = os.path.join(assets_dir, "assistant-lipsync.gif")
w,h = 400,400

# Frame 1 - closed mouth
frame1 = Image.new("RGBA", (w,h), (100,100,150,255))
draw1 = ImageDraw.Draw(frame1)
draw1.ellipse((50,50,350,350), fill=(240,220,200,255))  # face
draw1.ellipse((140,140,170,170), fill=(0,0,0,255))  # left eye
draw1.ellipse((230,140,260,170), fill=(0,0,0,255))  # right eye
draw1.ellipse((160,240,240,260), fill=(150,50,40,255))  # closed mouth

# Frame 2 - open mouth
frame2 = Image.new("RGBA", (w,h), (100,100,150,255))
draw2 = ImageDraw.Draw(frame2)
draw2.ellipse((50,50,350,350), fill=(240,220,200,255))  # face
draw2.ellipse((140,140,170,170), fill=(0,0,0,255))  # left eye
draw2.ellipse((230,140,260,170), fill=(0,0,0,255))  # right eye
draw2.ellipse((150,230,250,280), fill=(200,20,20,255))  # open mouth

frame1.save(gif_path, save_all=True, append_images=[frame2], duration=350, loop=0)

# 6) Zip the folder
zip_path = "/mnt/data/Omniverse-AI.zip"
with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
    for root, dirs, files in os.walk(out_dir):
        for file in files:
            full = os.path.join(root, file)
            arcname = os.path.relpath(full, out_dir)
            zf.write(full, arcname)

zip_path

