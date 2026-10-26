// ============================================
// GLOBAL LEADERBOARD (Firebase with polling)
// ============================================

let db, ref, push, onValue, query, orderByChild, limitToLast;

// Firebase ready hone ka wait karo
function waitForFirebase() {
  if (window.firebaseDB) {
    db = window.firebaseDB;
    ref = window.firebaseRef;
    push = window.firebasePush;
    onValue = window.firebaseOnValue;
    query = window.firebaseQuery;
    orderByChild = window.firebaseOrderByChild;
    limitToLast = window.firebaseLimitToLast;

    console.log('✅ Firebase ready for leaderboard');
    renderLeaderboard();
  } else {
    setTimeout(waitForFirebase, 100);
  }
}

// ============================================
// RENDER LEADERBOARD
// ============================================
function renderLeaderboard() {
  const podium = document.getElementById('podium');
  const rankingList = document.getElementById('rankingList');
  const emptyState = document.getElementById('emptyLeaderboard');

  if (!podium || !rankingList) return;

  const scoresRef = ref(db, 'leaderboard');
  const topScoresQuery = query(scoresRef, orderByChild('score'), limitToLast(20));

  onValue(topScoresQuery, (snapshot) => {
    const data = snapshot.val();

    if (!data) {
      podium.innerHTML = '';
      rankingList.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      document.querySelector('.podium-section').style.display = 'none';
      document.querySelector('.ranking-section').style.display = 'none';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    document.querySelector('.podium-section').style.display = 'block';
    document.querySelector('.ranking-section').style.display = 'block';

    const leaderboard = Object.values(data).sort((a, b) => {
  if (b.score !== a.score) return b.score - a.score;
  return a.timestamp - b.timestamp; // Pehle wala upar
});

    renderPodium(leaderboard, podium);

    rankingList.innerHTML = '';
    leaderboard.forEach((entry, index) => {
      const rank = index + 1;
      const medal = getMedal(rank);
      const row = document.createElement('div');
      row.className = 'ranking-row' + (rank <= 3 ? ' top-' + rank : '');
      row.innerHTML = `
        <span class="rank-number">${medal || rank}</span>
        <span class="rank-name">${escapeHtml(entry.name)}</span>
        <span class="rank-score">${entry.score}/${entry.maxScore}</span>
        <span class="rank-date">${formatDate(entry.timestamp)}</span>
      `;
      rankingList.appendChild(row);
    });
  });
}

// ============================================
// SAVE SCORE TO FIREBASE (quiz.js se call hoga)
// ============================================
function saveScoreToFirebase(name, score, maxScore) {
  if (!window.firebaseDB) {
    console.error('Firebase ready nahi hai');
    return;
  }

  const scoresRef = window.firebaseRef(window.firebaseDB, 'leaderboard');
  window.firebasePush(scoresRef, {
    name: name.trim() || 'Anonymous',
    score: score,
    maxScore: maxScore,
    timestamp: Date.now()
  })
  .then(() => console.log('✅ Score saved to Firebase'))
  .catch((err) => {
    console.error('❌ Save error:', err);
    alert('Score save nahi ho paya. Internet check karo.');
  });
}

// ============================================
// PODIUM RENDER
// ============================================
function renderPodium(leaderboard, container) {
  container.innerHTML = '';
  const order = [1, 0, 2];
  const heights = ['small', 'big', 'medium'];

  order.forEach((pos, visualIndex) => {
    const entry = leaderboard[pos];
    const rank = pos + 1;
    const heightClass = heights[visualIndex];

    const el = document.createElement('div');
    el.className = `podium-item podium-${heightClass}`;

    if (entry) {
      const medal = getMedal(rank);
      el.innerHTML = `
        <div class="podium-medal">${medal}</div>
        <div class="podium-name">${escapeHtml(entry.name)}</div>
        <div class="podium-score">${entry.score}/${entry.maxScore}</div>
        <div class="podium-stand podium-stand-${rank}">
          <span class="podium-rank">${rank}</span>
        </div>
      `;
    } else {
      el.innerHTML = `
        <div class="podium-medal">${getMedal(rank)}</div>
        <div class="podium-name" style="opacity:0.4;">—</div>
        <div class="podium-score" style="opacity:0.4;">—</div>
        <div class="podium-stand podium-stand-${rank}">
          <span class="podium-rank">${rank}</span>
        </div>
      `;
    }

    container.appendChild(el);
  });
}

// ============================================
// HELPERS
// ============================================
function getMedal(rank) {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return '';
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function formatDate(timestamp) {
  if (!timestamp) return '';
  const d = new Date(timestamp);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

// ============================================
// START
// ============================================
waitForFirebase();