const voiceAudio = document.getElementById('voiceAudio');
const playBtn = document.getElementById('playBtn');
const lipsync = document.getElementById('lipsync');
const languageSelect = document.getElementById('languageSelect');
const modeBtn = document.getElementById('modeBtn');

let languages = {};
let languageKeys = [];
let currentIndex = 0;

fetch('languages.json')
  .then(res => res.json())
  .then(data => {
    languages = data;
    languageKeys = Object.keys(languages);
    for (const lang of languageKeys) {
      const option = document.createElement('option');
      option.value = lang;
      option.textContent = lang;
      languageSelect.appendChild(option);
    }
  });

playBtn.addEventListener('click', () => {
  const selectedLang = languageSelect.value || languageKeys[currentIndex];
  languageSelect.value = selectedLang;
  playLanguage(selectedLang);
});

voiceAudio.addEventListener('ended', () => {
  lipsync.style.display = 'none';
  currentIndex = (currentIndex + 1) % languageKeys.length;
  playLanguage(languageKeys[currentIndex]);
});

function playLanguage(lang) {
  console.log(`Message in ${lang}: ${languages[lang]}`);
  lipsync.style.display = 'block';
  voiceAudio.play();
}

modeBtn.addEventListener('click', () => {
  document.body.classList.toggle('light');
});
