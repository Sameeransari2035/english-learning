// ============================================
// QUIZ QUESTIONS
// ============================================
const quizQuestions = [
  {
    question: "Noun kya hota hai?",
    options: [
      "Kisi kaam ka naam",
      "Kisi vyakti, jagah ya cheez ka naam",
      "Kisi ki visheshta",
      "Kisi ka bhaav"
    ],
    correct: 1,
    explanation: "Noun wo shabd hai jo vyakti, jagah, cheez ya bhaav ka naam batata hai."
  },
  {
    question: "Inme se 'Proper Noun' kaunsa hai?",
    options: ["boy", "city", "Delhi", "book"],
    correct: 2,
    explanation: "Delhi ek khaas jagah ka naam hai, isliye ye Proper Noun hai."
  },
  {
    question: "Sahi pronoun chuno: '___ is my sister.'",
    options: ["He", "She", "It", "They"],
    correct: 1,
    explanation: "Sister ke liye 'She' pronoun use hota hai."
  },
  {
    question: "Sahi article chuno: 'I ate ___ apple.'",
    options: ["a", "an", "the", "no article"],
    correct: 1,
    explanation: "'Apple' vowel sound se shuru hota hai, isliye 'an' lagega."
  },
  {
    question: "Sahi verb chuno: 'She ___ to school every day.'",
    options: ["go", "goes", "going", "gone"],
    correct: 1,
    explanation: "He/She/It ke saath verb mein 's' ya 'es' lagta hai — 'goes'."
  }
];

// ============================================
// STATE
// ============================================
let currentQuestionIndex = 0;
let score = 0;
let answered = false;

// ============================================
// DOM ELEMENTS
// ============================================
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
// INIT
// ============================================
function initQuiz() {
  if (!questionText || !optionsContainer) {
    console.error('❌ Quiz DOM elements missing!');
    return;
  }
  totalQSpan.textContent = quizQuestions.length;
  currentQuestionIndex = 0;
  score = 0;
  scoreDisplay.textContent = score;
  quizCard.style.display = 'block';
  resultCard.style.display = 'none';
  progressFill.style.width = '0%';
  loadQuestion();
}

// ============================================
// LOAD QUESTION
// ============================================
function loadQuestion() {
  answered = false;
  feedback.textContent = '';
  feedback.className = 'feedback';
  nextBtn.style.display = 'none';

  const q = quizQuestions[currentQuestionIndex];
  currentQSpan.textContent = currentQuestionIndex + 1;
  questionText.textContent = q.question;

  const progressPercent = (currentQuestionIndex / quizQuestions.length) * 100;
  progressFill.style.width = progressPercent + '%';

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
// SELECT ANSWER
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
  if (currentQuestionIndex === quizQuestions.length - 1) {
    nextBtn.textContent = 'Results Dekho →';
  } else {
    nextBtn.textContent = 'Next Question →';
  }
}

// ============================================
// NEXT BUTTON
// ============================================
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
  let message = '';
  if (percentage === 100) {
    message = '🌟 Perfect! Tum toh genius ho!';
  } else if (percentage >= 80) {
    message = '🎉 Bahut badhiya! Thodi si aur practice!';
  } else if (percentage >= 50) {
    message = '👍 Achha kiya! Grammar dobara padho!';
  } else {
    message = '💪 Koi baat nahi! Lessons padhkar dobara try karo!';
  }
  document.getElementById('resultMessage').textContent = message;

  saveProgress(score);
  displayBadges();
  askNameAndSaveToLeaderboard();
}

// ============================================
// SAVE PROGRESS
// ============================================
function saveProgress(earnedPoints) {
  let totalPoints = parseInt(localStorage.getItem('points') || 0);
  totalPoints += earnedPoints;
  localStorage.setItem('points', totalPoints);

  const today = new Date().toDateString();
  const lastPlayed = localStorage.getItem('lastPlayed');
  let streak = parseInt(localStorage.getItem('streak') || 0);

  if (lastPlayed !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (lastPlayed === yesterday.toDateString()) {
      streak += 1;
    } else {
      streak = 1;
    }
    localStorage.setItem('streak', streak);
    localStorage.setItem('lastPlayed', today);
  }

  let quizCount = parseInt(localStorage.getItem('quizCount') || 0);
  quizCount += 1;
  localStorage.setItem('quizCount', quizCount);

  // BADGES
  let badges = JSON.parse(localStorage.getItem('badgeList') || '[]');

  if (quizCount >= 1 && !badges.includes('first_quiz')) badges.push('first_quiz');
  if (totalPoints >= 50 && !badges.includes('fifty_points')) badges.push('fifty_points');
  if (totalPoints >= 100 && !badges.includes('hundred_points')) badges.push('hundred_points');
  if (score === quizQuestions.length * 10 && !badges.includes('perfect')) badges.push('perfect');
  if (streak >= 3 && !badges.includes('streak3')) badges.push('streak3');

  localStorage.setItem('badgeList', JSON.stringify(badges));
  localStorage.setItem('badges', badges.length);
}

// ============================================
// BADGES DISPLAY
// ============================================
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

  if (badges.length === 0) {
    container.innerHTML = '';
    return;
  }

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

// ============================================
// RESTART
// ============================================
function restartQuiz() {
  resultCard.style.display = 'none';
  quizCard.style.display = 'block';
  initQuiz();
}

// ============================================
// CUSTOM MODAL LEADERBOARD INTEGRATION
// ============================================
function askNameAndSaveToLeaderboard() {
  const maxScore = quizQuestions.length * 10;
  if (score === 0) return;

  const modal = document.getElementById('nameModal');
  const input = document.getElementById('playerNameInput');
  const saveBtn = document.getElementById('saveNameBtn');
  const cancelBtn = document.getElementById('cancelNameBtn');
  const scoreText = document.getElementById('modalScoreText');

  // Popup mein score dikhao
  scoreText.textContent = `Tumne ${score}/${maxScore} points kamaye!`;
  
  // Purana naam input mein daal do (agar tha toh)
  input.value = localStorage.getItem('lastPlayerName') || '';
  
  // Modal ko show karo
  modal.style.display = 'flex';
  input.focus();

  // Save Button ka kaam
  saveBtn.onclick = function() {
    let playerName = input.value.trim() || 'Anonymous';
    localStorage.setItem('lastPlayerName', playerName);

    // Firebase mein save karo
    waitForFirebaseAndSave(playerName, score, maxScore);
    
    // Modal band karo
    modal.style.display = 'none';

    // Leaderboard link dikhao
    const badgesContainer = document.getElementById('resultBadges');
    if (badgesContainer) {
      const linkDiv = document.createElement('div');
      linkDiv.style.marginTop = '1.5rem';
      linkDiv.innerHTML = `
        <a href="leaderboard.html" class="btn btn-primary">
          🏆 Global Leaderboard Dekho
        </a>
      `;
      badgesContainer.appendChild(linkDiv);
    }
  };

  // Cancel Button ka kaam
  cancelBtn.onclick = function() {
    modal.style.display = 'none';
  };

  // Enter dabane par bhi save ho jaye
  input.onkeypress = function(e) {
    if (e.key === 'Enter') {
      saveBtn.click();
    }
  };
}
// ============================================
// SAVE SCORE TO FIREBASE
// ============================================
let firebaseAttempts = 0;
const MAX_ATTEMPTS = 50;

function waitForFirebaseAndSave(name, score, maxScore) {
  if (window.firebaseDB) {
    const scoresRef = window.firebaseRef(window.firebaseDB, 'leaderboard');
    window.firebasePush(scoresRef, {
      name: name,
      score: score,
      maxScore: maxScore,
      timestamp: Date.now()
    })
      .then(() => console.log('✅ Score saved'))
      .catch(err => console.error('❌ Save error:', err));
  } else if (firebaseAttempts < MAX_ATTEMPTS) {
    firebaseAttempts++;
    setTimeout(() => waitForFirebaseAndSave(name, score, maxScore), 100);
  } else {
    console.error('❌ Firebase load nahi hua');
  }
}

// ============================================
// START — sab functions ke BAAD, alag se
// ============================================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initQuiz);
} else {
  initQuiz();
}
