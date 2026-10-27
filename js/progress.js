window.addEventListener('DOMContentLoaded', () => {
  const points = localStorage.getItem('points') || 0;
  const badges = localStorage.getItem('badges') || 0;
  const streak = localStorage.getItem('streak') || 0;

  const pEl = document.getElementById('pointsDisplay');
  const bEl = document.getElementById('badgesDisplay');
  const sEl = document.getElementById('streakDisplay');

  if (pEl) pEl.textContent = points;
  if (bEl) bEl.textContent = badges;
  if (sEl) sEl.textContent = streak;
});

// ============================================
// WORD OF THE DAY LOGIC
// ============================================
const dailyWords = [
  { word: "Serendipity", meaning: "Koi achhi cheez galti se mil jana." },
  { word: "Ephemeral", meaning: "Jo bahut kam samay tak rahe." },
  { word: "Resilience", meaning: "Mushkil waqt se wapas ubharne ki taqat." },
  { word: "Euphoria", meaning: "Bahut zyada khushi ka ehsaas." },
  { word: "Meticulous", meaning: "Bahut dhyan aur detail ke saath kaam karna." },
  { word: "Wanderlust", meaning: "Ghoomne-Phirne ka shauk." },
  { word: "Nostalgia", meaning: "Purani yaadon mein khona." }
];

function loadWordOfDay() {
  const wordEl = document.getElementById('wodWord');
  const meaningEl = document.getElementById('wodMeaning');
  const dateEl = document.getElementById('wodDate');

  if (!wordEl) return; // Agar home page nahi hai toh return karo

  // Aaj ki date ke hisaab se word chuno (taaki din bhar same rahe)
  const today = new Date();
  const dayIndex = today.getDate() % dailyWords.length;
  const todaysWord = dailyWords[dayIndex];

  wordEl.textContent = todaysWord.word;
  meaningEl.textContent = todaysWord.meaning;
  
  if (dateEl) {
    dateEl.textContent = today.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  }
}

function speakWordOfDay() {
  const word = document.getElementById('wodWord').textContent;
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }
}

// Start
document.addEventListener('DOMContentLoaded', loadWordOfDay);