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
  // ===== PROFILE CARD UPDATE =====
  let userEmail = localStorage.getItem('currentUser') || 'Guest';
  let userName = localStorage.getItem('userName');

  // Agar naam save nahi hai ya default 'User' hai
  if (!userName || userName === 'User') {
    if (userEmail.includes('@')) {
      // Email ke aage wala part lo (jaise naseemahmed2035)
      let rawName = userEmail.split('@')[0]; 
      
      // Numbers aur special characters hata do
      rawName = rawName.replace(/[0-9]/g, '');
      
      // Pehla letter capital kar do
      if (rawName.length > 0) {
        userName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
      } else {
        userName = 'User'; // Agar naam sirf numbers ka tha
      }
    } else {
      userName = 'User';
    }
    localStorage.setItem('userName', userName); // Naya saaf naam save karo
  }

  const nameEl = document.getElementById('profileName');
  const emailEl = document.getElementById('profileEmail');
  const avatarEl = document.getElementById('profileAvatar');
  const dashNameEl = document.getElementById('dashUserName');

  if (nameEl) nameEl.textContent = userName;
  if (emailEl) emailEl.textContent = userEmail;
  if (avatarEl) avatarEl.textContent = userName.charAt(0).toUpperCase();
  if (dashNameEl) dashNameEl.textContent = userName;

  // ===== STATS CARDS =====
  const points = parseInt(localStorage.getItem('points') || 0);
  const badges = JSON.parse(localStorage.getItem('badgeList') || '[]');
  const streak = parseInt(localStorage.getItem('streak') || 0);
  const quizCount = parseInt(localStorage.getItem('quizCount') || 0);
  const lastPlayed = localStorage.getItem('lastPlayed');

  document.getElementById('dashPoints').textContent = points;
  document.getElementById('dashBadges').textContent = badges.length;
  document.getElementById('dashStreak').textContent = streak;
  document.getElementById('dashQuizCount').textContent = quizCount;

  // ===== LEVEL =====
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

  // ===== BADGES & ACTIVITY =====
  renderBadges(badges);
  renderActivity(lastPlayed, quizCount, points);
  renderCalendar();
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
// RESET PROGRESS (With Custom Modal)
// ============================================
function resetProgress() {
  const modal = document.getElementById('resetModal');
  const confirmBtn = document.getElementById('confirmResetBtn');
  const cancelBtn = document.getElementById('cancelResetBtn');

  modal.style.display = 'flex';

  confirmBtn.onclick = function () {
    localStorage.removeItem('points');
    localStorage.removeItem('badges');
    localStorage.removeItem('badgeList');
    localStorage.removeItem('streak');
    localStorage.removeItem('lastPlayed');
    localStorage.removeItem('quizCount');

    modal.style.display = 'none';
    loadDashboard();
  };

  cancelBtn.onclick = function () {
    modal.style.display = 'none';
  };
}

// ============================================
// LOGOUT FUNCTION
// ============================================
function logoutUser() {
  if (confirm("Kya aap sach mein logout karna chahte hain?")) {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userName');
    alert("Aap successfully logout ho gaye hain! 👋");
    window.location.href = 'index.html';
  }
}

// ============================================
// WEEKLY STREAK CALENDAR
// ============================================
function renderCalendar() {
  const calendarGrid = document.getElementById('calendarGrid');
  const monthYearEl = document.getElementById('currentMonthYear');
  const streakCountEl = document.getElementById('calStreakCount');

  if (!calendarGrid) return;

  const lastPlayed = localStorage.getItem('lastPlayed');
  const streak = parseInt(localStorage.getItem('streak') || 0);

  if (streakCountEl) streakCountEl.textContent = streak;

  const today = new Date();
  const currentMonth = today.toLocaleString('en-IN', { month: 'long', year: 'numeric' });
  if (monthYearEl) monthYearEl.textContent = currentMonth;

  calendarGrid.innerHTML = '';
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);

    const dateString = date.toDateString();
    const isToday = i === 0;

    let isPlayed = false;
    if (lastPlayed) {
      // Agar aaj khela hai, toh tick lagao
      if (i === 0 && lastPlayed === today.toDateString()) isPlayed = true;
      // Streak ke hisaab se pichhle dinon par tick lagao
      if (i <= streak && i !== 0) isPlayed = true; 
    }

    const dayBox = document.createElement('div');
    dayBox.className = `cal-day ${isToday ? 'today' : ''} ${isPlayed ? 'played' : ''}`;
    dayBox.innerHTML = `
      <span class="cal-day-name">${dayNames[date.getDay()]}</span>
      <span class="cal-date">${date.getDate()}</span>
      ${isPlayed ? '<span class="cal-check">✅</span>' : ''}
    `;
    calendarGrid.appendChild(dayBox);
  }
}

// ============================================
// START
// ============================================
document.addEventListener('DOMContentLoaded', loadDashboard);

// ============================================
// EDIT USER NAME FUNCTION
// ============================================
function editUserName() {
  // Purana naam nikaalo (ya khali string)
  const currentName = localStorage.getItem('userName') || '';
  
  // User se naya naam pucho
  let newName = prompt("Apna naya naam likhein:", currentName);
  
  // Agar user ne Cancel nahi kiya aur khali naam nahi daala
  if (newName !== null && newName.trim() !== "") {
    newName = newName.trim();
    
    // Naya naam local storage mein save karo
    localStorage.setItem('userName', newName);
    
    // Dashboard par turant update karo
    loadDashboard();
    
    // Navbar par bhi update karo (agar nav-updater.js load hai)
    if (typeof updateNavbar === 'function') {
      updateNavbar();
    }
    
    // Agar toast system hai toh notification dikhao
    if (typeof showToast === 'function') {
      showToast("Naam successfully update ho gaya!", "success");
    } else {
      alert("Naam successfully update ho gaya!");
    }
  }
}