Omniverse-AI/
├─ analytics.html
├─ scripts-stage7.js   ✅ (no spaces!)
├─ assets/
├─ style.css
├─ index.html
<!-- Your analytics.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Omniverse AI — Analytics Portal</title>
  <link rel="stylesheet" href="./style.css">

  <!-- Firebase -->
  <script src="https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.22.1/firebase-database-compat.js"></script>
</head>
<body>
  <audio id="cosmic-music" src="./assets/music-track.mp3" loop></audio>
  <audio id="assistant-voice" src="./assets/voice.mp3"></audio>
  <img id="rampaul" src="./assets/rampaulsaini-photo.png" alt="Rampaul Saini" style="display:none;"/>

  <!-- Stage-7 Script -->
  <script src="./scripts-stage7.js"></script>
</body>
</html>
  const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXX",
  authDomain: "omniverseweb.firebaseapp.com",
  databaseURL: "https://omniverseweb-default-rtdb.firebaseio.com",
  projectId: "omniverseweb",
  storageBucket: "omniverseweb.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};
  
