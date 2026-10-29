// Confetti Library Load karo (Internet se)
const confettiScript = document.createElement('script');
confettiScript.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js";
document.head.appendChild(confettiScript);

// ============================================
// QUIZ QUESTIONS
// ============================================
const quizQuestions = [
  { question: "Noun kya hota hai?", options: ["Kisi kaam ka naam", "Kisi vyakti, jagah ya cheez ka naam", "Kisi ki visheshta", "Kisi ka bhaav"], correct: 1, explanation: "Noun wo shabd hai jo vyakti, jagah, cheez ya bhaav ka naam batata hai." },
  { question: "Inme se 'Proper Noun' kaunsa hai?", options: ["boy", "city", "Delhi", "book"], correct: 2, explanation: "Delhi ek khaas jagah ka naam hai, isliye ye Proper Noun hai." },
  { question: "Sahi pronoun chuno: '___ is my sister.'", options: ["He", "She", "It", "They"], correct: 1, explanation: "Sister ke liye 'She' pronoun use hota hai." },
  { question: "Sahi article chuno: 'I ate ___ apple.'", options: ["a", "an", "the", "no article"], correct: 1, explanation: "'Apple' vowel sound se shuru hota hai, isliye 'an' lagega." },
  { question: "Sahi verb chuno: 'She ___ to school every day.'", options: ["go", "goes", "going", "gone"], correct: 1, explanation: "He/She/It ke saath verb mein 's' ya 'es' lagta hai — 'goes'." },
  { question: "Sahi verb chuno: 'She ___ a beautiful song.'", options: ["sing", "sings", "singing", "sang"], correct: 1, explanation: "Present tense mein He/She/It ke saath verb mein 's' lagta hai." },
  { question: "Sahi past tense chuno: 'I ___ to the market yesterday.'", options: ["go", "goes", "went", "gone"], correct: 2, explanation: "'Yesterday' past time batata hai, isliye 'went' (go ka past form) lagega." },
  { question: "Sahi preposition chuno: 'The cat is ___ the table.'", options: ["in", "on", "at", "for"], correct: 1, explanation: "Cheez ke upar hone ke liye 'on' use hota hai." },
  { question: "Inme se kaunsa adjective (visheshan) hai?", options: ["Run", "Beautiful", "Quickly", "Happiness"], correct: 1, explanation: "Beautiful ek adjective hai jo kisi vyakti ya cheez ki khoobsurti batata hai." },
  { question: "Sahi future tense chuno: 'I ___ help you tomorrow.'", options: ["will", "am", "did", "was"], correct: 0, explanation: "Aane wale samay (future) ke liye 'will' use hota hai." }
];

// ============================================
// STATE & DOM ELEMENTS
// ============================================
let currentQuestionIndex = 0;
let score = 0;
let answered = false;

const questionText = document.getElementById('questionText');
const optionsContainer = document.getElementById('optionsContainer');
const feedback = document.getElementById('feedback');
const nextBtn = document.getElementById('nextBtn');
const quizCard = document.getElementById('quizCard');
const resultCard = document.getElementById('resultCard');
const currentQSpan = document.getElementById('currentQ');
const totalQSpan = document.getElementById('totalQ');
const scoreDisplay = document.getElementById('scoreDisplay');
const progressFill = document.getElementById('progressFill');

// ============================================
// INIT & LOAD
// ============================================
function initQuiz() {
  if (!questionText || !optionsContainer) return;
  totalQSpan.textContent = quizQuestions.length;
  currentQuestionIndex = 0;
  score = 0;
  scoreDisplay.textContent = score;
  quizCard.style.display = 'block';
  resultCard.style.display = 'none';
  progressFill.style.width = '0%';
  loadQuestion();
}

function loadQuestion() {
  answered = false;
  feedback.textContent = '';
  feedback.className = 'feedback';
  nextBtn.style.display = 'none';

  const q = quizQuestions[currentQuestionIndex];
  currentQSpan.textContent = currentQuestionIndex + 1;
  questionText.textContent = q.question;

  progressFill.style.width = (currentQuestionIndex / quizQuestions.length) * 100 + '%';

  optionsContainer.innerHTML = '';
  q.options.forEach((option, index) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = option;
    btn.onclick = () => selectAnswer(index, btn);
    optionsContainer.appendChild(btn);
  });
}

// ============================================
// SELECT ANSWER & NEXT
// ============================================
function selectAnswer(selectedIndex, btnElement) {
  if (answered) return;
  answered = true;

  const q = quizQuestions[currentQuestionIndex];
  const allOptions = optionsContainer.querySelectorAll('.option-btn');
  allOptions[q.correct].classList.add('correct');

  if (selectedIndex === q.correct) {
    score += 10;
    scoreDisplay.textContent = score;
    feedback.textContent = '✅ Sahi jawab! +10 points';
    feedback.className = 'feedback feedback-correct';
  } else {
    btnElement.classList.add('wrong');
    feedback.textContent = '❌ Galat! ' + q.explanation;
    feedback.className = 'feedback feedback-wrong';
  }

  allOptions.forEach(opt => opt.disabled = true);
  nextBtn.style.display = 'inline-block';
  nextBtn.textContent = (currentQuestionIndex === quizQuestions.length - 1) ? 'Results Dekho →' : 'Next Question →';
}

nextBtn.onclick = () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < quizQuestions.length) {
    loadQuestion();
  } else {
    showResults();
  }
};

// ============================================
// SHOW RESULTS
// ============================================
function showResults() {
  quizCard.style.display = 'none';
  resultCard.style.display = 'block';
  progressFill.style.width = '100%';

  const maxScore = quizQuestions.length * 10;
  document.getElementById('finalScore').textContent = score;
  document.getElementById('maxScore').textContent = maxScore;

  const percentage = (score / maxScore) * 100;
  let message = percentage === 100 ? '🌟 Perfect! Tum toh genius ho!' :
                percentage >= 80 ? '🎉 Bahut badhiya! Thodi si aur practice!' :
                percentage >= 50 ? '👍 Achha kiya! Grammar dobara padho!' :
                '💪 Koi baat nahi! Lessons padhkar dobara try karo!';
  document.getElementById('resultMessage').textContent = message;

  saveProgress(score);
  displayBadges();
  
  if (checkLoginBeforeScore()) {
    askNameAndSaveToLeaderboard();
  }

  if (percentage >= 80) {
    setTimeout(() => {
      if (typeof confetti === 'function') {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#6366f1', '#a855f7', '#fbbf24', '#10b981'] });
        setTimeout(() => {
          confetti({ particleCount: 100, angle: 60, spread: 55, origin: { x: 0 } });
          confetti({ particleCount: 100, angle: 120, spread: 55, origin: { x: 1 } });
        }, 400);
      }
    }, 300);
  }
}

// ============================================
// PROGRESS & BADGES
// ============================================
function checkLoginBeforeScore() {
  if (!localStorage.getItem('currentUser')) {
    alert("⚠️ Score save karne ke liye pehle Login karein!");
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

function saveProgress(earnedPoints) {
  let totalPoints = parseInt(localStorage.getItem('points') || 0) + earnedPoints;
  localStorage.setItem('points', totalPoints);

  const today = new Date().toDateString();
  const lastPlayed = localStorage.getItem('lastPlayed');
  let streak = parseInt(localStorage.getItem('streak') || 0);

  if (lastPlayed !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    streak = (lastPlayed === yesterday.toDateString()) ? streak + 1 : 1;
    localStorage.setItem('streak', streak);
    localStorage.setItem('lastPlayed', today);
  }

  let quizCount = parseInt(localStorage.getItem('quizCount') || 0) + 1;
  localStorage.setItem('quizCount', quizCount);

  let badges = JSON.parse(localStorage.getItem('badgeList') || '[]');
  if (quizCount >= 1 && !badges.includes('first_quiz')) badges.push('first_quiz');
  if (totalPoints >= 50 && !badges.includes('fifty_points')) badges.push('fifty_points');
  if (totalPoints >= 100 && !badges.includes('hundred_points')) badges.push('hundred_points');
  if (score === quizQuestions.length * 10 && !badges.includes('perfect')) badges.push('perfect');
  if (streak >= 3 && !badges.includes('streak3')) badges.push('streak3');

  localStorage.setItem('badgeList', JSON.stringify(badges));
  localStorage.setItem('badges', badges.length);
}

const badgeInfo = {
  first_quiz: { icon: '🎯', name: 'First Quiz' },
  fifty_points: { icon: '⭐', name: '50 Points' },
  hundred_points: { icon: '💯', name: '100 Points' },
  perfect: { icon: '🏆', name: 'Perfect Score' },
  streak3: { icon: '🔥', name: '3-Day Streak' }
};

function displayBadges() {
  const badges = JSON.parse(localStorage.getItem('badgeList') || '[]');
  const container = document.getElementById('resultBadges');
  if (badges.length === 0) { container.innerHTML = ''; return; }
  
  container.innerHTML = '<h3>Tumhare Badges:</h3><div class="badge-list"></div>';
  const badgeList = container.querySelector('.badge-list');
  
  badges.forEach(key => {
    const info = badgeInfo[key];
    if (info) {
      const el = document.createElement('div');
      el.className = 'badge-item';
      el.innerHTML = `<span class="badge-icon">${info.icon}</span><span>${info.name}</span>`;
      badgeList.appendChild(el);
    }
  });
}

function restartQuiz() {
  resultCard.style.display = 'none';
  quizCard.style.display = 'block';
  initQuiz();
}

// ============================================
// LEADERBOARD INTEGRATION
// ============================================
function askNameAndSaveToLeaderboard() {
  const maxScore = quizQuestions.length * 10;
  if (score === 0) return;

  const currentUser = localStorage.getItem('currentUser');
  const savedName = localStorage.getItem('userName');

  // Agar user login hai aur naam saved hai, toh direct save karo
  if (currentUser && savedName) {
    waitForFirebaseAndSave(savedName, score, maxScore);
    showLeaderboardLink();
    return;
  }

  // Warna popup dikhao (agar naam nahi hai)
  const modal = document.getElementById('nameModal');
  const input = document.getElementById('playerNameInput');
  const saveBtn = document.getElementById('saveNameBtn');
  const cancelBtn = document.getElementById('cancelNameBtn');
  const scoreText = document.getElementById('modalScoreText');

  scoreText.textContent = `Tumne ${score}/${maxScore} points kamaye!`;
  input.value = savedName || '';
  modal.style.display = 'flex';
  input.focus();

  saveBtn.onclick = function () {
    let playerName = input.value.trim() || 'Anonymous';
    localStorage.setItem('userName', playerName);
    waitForFirebaseAndSave(playerName, score, maxScore);
    modal.style.display = 'none';
    showLeaderboardLink();
  };

  cancelBtn.onclick = function () { modal.style.display = 'none'; };

  input.onkeypress = function (e) {
    if (e.key === 'Enter') saveBtn.click();
  };
}

function showLeaderboardLink() {
  const badgesContainer = document.getElementById('resultBadges');
  if (badgesContainer && !document.getElementById('leaderboardLinkBtn')) {
    const linkDiv = document.createElement('div');
    linkDiv.id = 'leaderboardLinkBtn';
    linkDiv.style.marginTop = '1.5rem';
    linkDiv.innerHTML = `<a href="leaderboard.html" class="btn btn-primary">🏆 Global Leaderboard Dekho</a>`;
    badgesContainer.appendChild(linkDiv);
  }
}

function waitForFirebaseAndSave(name, score, maxScore) {
  let firebaseAttempts = 0;
  const MAX_ATTEMPTS = 50;

  function trySave() {
    if (window.firebaseDB) {
      const scoresRef = window.firebaseRef(window.firebaseDB, 'leaderboard');
      window.firebasePush(scoresRef, {
        name: name, score: score, maxScore: maxScore, timestamp: Date.now()
      })
      .then(() => showToast("Score Leaderboard par save ho gaya!", "success"))
      .catch(err => console.error('❌ Save error:', err));
    } else if (firebaseAttempts < MAX_ATTEMPTS) {
      firebaseAttempts++;
      setTimeout(trySave, 100);
    } else {
      console.error('❌ Firebase load nahi hua');
    }
  }
  trySave();
}

// ============================================
// START
// ============================================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initQuiz);
} else {
  initQuiz();
}