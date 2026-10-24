// ============================================
// BADGE INFO
// ============================================
const badgeInfo = {
  first_quiz: { icon: '🎯', name: 'First Quiz', desc: 'Pehli baar quiz khela' },
  fifty_points: { icon: '⭐', name: '50 Points', desc: 'Total 50 points kamaye' },
  hundred_points: { icon: '💯', name: '100 Points', desc: 'Total 100 points kamaye' },
  perfect: { icon: '🏆', name: 'Perfect Score', desc: 'Saare jawab sahi' },
  streak3: { icon: '🔥', name: '3-Day Streak', desc: '3 din lagatar khela' }
};

// ============================================
// LEVEL SYSTEM
// ============================================
const levels = [
  { name: 'Beginner', min: 0, max: 50 },
  { name: 'Learner', min: 50, max: 150 },
  { name: 'Intermediate', min: 150, max: 300 },
  { name: 'Advanced', min: 300, max: 500 },
  { name: 'Master', min: 500, max: 1000 }
];

function getLevel(points) {
  for (let i = levels.length - 1; i >= 0; i--) {
    if (points >= levels[i].min) {
      return levels[i];
    }
  }
  return levels[0];
}

// ============================================
// LOAD DASHBOARD
// ============================================
function loadDashboard() {
  const points = parseInt(localStorage.getItem('points') || 0);
  const badges = JSON.parse(localStorage.getItem('badgeList') || '[]');
  const streak = parseInt(localStorage.getItem('streak') || 0);
  const quizCount = parseInt(localStorage.getItem('quizCount') || 0);
  const lastPlayed = localStorage.getItem('lastPlayed');

  // Stats cards
  document.getElementById('dashPoints').textContent = points;
  document.getElementById('dashBadges').textContent = badges.length;
  document.getElementById('dashStreak').textContent = streak;
  document.getElementById('dashQuizCount').textContent = quizCount;

  // Level
  const currentLevel = getLevel(points);
  document.getElementById('levelName').textContent = currentLevel.name;
  document.getElementById('levelPoints').textContent =
    points + ' / ' + currentLevel.max + ' points';

  const levelProgress = ((points - currentLevel.min) / (currentLevel.max - currentLevel.min)) * 100;
  document.getElementById('levelFill').style.width = Math.min(levelProgress, 100) + '%';

  const remaining = currentLevel.max - points;
  if (remaining > 0) {
    document.getElementById('levelHint').textContent =
      'Agle level tak ' + remaining + ' points aur chahiye!';
  } else {
    document.getElementById('levelHint').textContent = 'Tum top level par ho! 🎉';
  }

  // Badges
  renderBadges(badges);

  // Activity
  renderActivity(lastPlayed, quizCount, points);
}

// ============================================
// RENDER BADGES
// ============================================
function renderBadges(earnedBadges) {
  const grid = document.getElementById('badgesGrid');
  grid.innerHTML = '';

  Object.keys(badgeInfo).forEach(key => {
    const info = badgeInfo[key];
    const isEarned = earnedBadges.includes(key);

    const card = document.createElement('div');
    card.className = 'badge-card' + (isEarned ? ' earned' : ' locked');
    card.innerHTML = `
      <div class="badge-card-icon">${isEarned ? info.icon : '🔒'}</div>
      <div class="badge-card-name">${info.name}</div>
      <div class="badge-card-desc">${info.desc}</div>
    `;
    grid.appendChild(card);
  });
}

// ============================================
// RENDER ACTIVITY
// ============================================
function renderActivity(lastPlayed, quizCount, points) {
  const box = document.getElementById('activityBox');

  if (quizCount === 0) {
    box.innerHTML = '<p>Abhi tak koi activity nahi. <a href="quiz.html">Quiz khelo</a> aur shuru karo!</p>';
    return;
  }

  box.innerHTML = `
    <div class="activity-item">
      <span class="activity-icon">🎯</span>
      <div>
        <strong>Total ${quizCount} quiz attempt${quizCount > 1 ? 's' : ''}</strong>
        <p>Tumne abhi tak ${quizCount} baar quiz khela hai</p>
      </div>
    </div>
    <div class="activity-item">
      <span class="activity-icon">⭐</span>
      <div>
        <strong>${points} points kamaye</strong>
        <p>Har sahi jawab par 10 points milte hain</p>
      </div>
    </div>
    ${lastPlayed ? `
    <div class="activity-item">
      <span class="activity-icon">📅</span>
      <div>
        <strong>Last played: ${lastPlayed}</strong>
        <p>Aaj bhi khelo aur streak badhao!</p>
      </div>
    </div>` : ''}
  `;
}

// ============================================
// RESET PROGRESS
// ============================================
function resetProgress() {
  if (confirm('Kya aap sach mein apni saari progress reset karna chahte ho? Ye wapas nahi aayegi!')) {
    localStorage.removeItem('points');
    localStorage.removeItem('badges');
    localStorage.removeItem('badgeList');
    localStorage.removeItem('streak');
    localStorage.removeItem('lastPlayed');
    localStorage.removeItem('quizCount');
    alert('Progress reset ho gayi! 🔄');
    loadDashboard();
  }
}

// ============================================
// START
// ============================================
loadDashboard();