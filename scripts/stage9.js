Stage9_Omniverse/
├─ index.html               ← Stage‑9 main HTML (canvas + start button)
├─ scripts/
│   └─ stage9.js            ← Stage‑9 JavaScript (particles, AI, music, Firebase)
└─ assets/
    ├─ userFaceModel.glb    ← Original 3D face model
    └─ userFaceTexture.png  ← Face texture
  <!DOCTYPE html>
<html lang="hi">
<head>
    <meta charset="UTF-8">
    <title>Supreme Omniverse Stage-9</title>
    <style>
        html, body { margin:0; padding:0; overflow:hidden; height:100%; background:#000; }
        canvas { display:block; }
        #startBtn { position:fixed; left:50%; top:50%; transform:translate(-50%, -50%);
                    z-index:9999; padding:1rem 2rem; font-size:1.5rem; cursor:pointer; }
    </style>
</head>
<body>
    <canvas id="omniverseCanvas"></canvas>
    <button id="startBtn">Supreme Omniverse शुरू करें</button>

    <script type="module" src="./scripts/stage9.js"></script>

    <script type="module">
        import { initStage9 } from './scripts/stage9.js';

        const startBtn = document.getElementById('startBtn');
        let stageStarted = false;

        startBtn.addEventListener('click', async () => {
            if (window.audioContext) await window.audioContext.resume();
            if (!stageStarted) {
                initStage9(
                    'omniverseCanvas',
                    './assets/userFaceModel.glb',
                    './assets/userFaceTexture.png'
                );
                stageStarted = true;
            }
            startBtn.style.display = 'none';
        });
    </script>
</body>
</html>
      
