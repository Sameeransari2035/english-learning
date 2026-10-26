// ============================================
// LEADERBOARD LOGIC
// ============================================

function getLeaderboard() {
  try {
    return JSON.parse(localStorage.getItem('leaderboard') || '[]');
  } catch (e) {
    return [];
  }
}

function saveLeaderboard(list) {
  localStorage.setItem('leaderboard', JSON.stringify(list));
}

function addScore(name, score, maxScore) {
  const leaderboard = getLeaderboard();

  const entry = {
    name: name.trim() || 'Anonymous',
    score: score,
    maxScore: maxScore,
    date: new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }),
    timestamp: Date.now()
  };

  leaderboard.push(entry);

  // Sort: high score first, then recent
  leaderboard.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.timestamp - a.timestamp;
  });

  // Keep only top 20
  const top20 = leaderboard.slice(0, 20);
  saveLeaderboard(top20);
}

// ============================================
// RENDER LEADERBOARD
// ============================================
function renderLeaderboard() {
  const leaderboard = getLeaderboard();
  const podium = document.getElementById('podium');
  const rankingList = document.getElementById('rankingList');
  const emptyState = document.getElementById('emptyLeaderboard');

  if (leaderboard.length === 0) {
    podium.innerHTML = '';
    rankingList.innerHTML = '';
    emptyState.style.display = 'block';
    document.querySelector('.podium-section').style.display = 'none';
    document.querySelector('.ranking-section').style.display = 'none';
    return;
  }

  emptyState.style.display = 'none';
  document.querySelector('.podium-section').style.display = 'block';
  document.querySelector('.ranking-section').style.display = 'block';

  // === PODIUM (Top 3) ===
  renderPodium(leaderboard, podium);

  // === FULL RANKING LIST ===
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
      <span class="rank-date">${entry.date}</span>
    `;
    rankingList.appendChild(row);
  });
}

function renderPodium(leaderboard, container) {
  container.innerHTML = '';

  // Order: 2nd, 1st, 3rd (visual podium)
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

// ============================================
// CLEAR LEADERBOARD
// ============================================
function clearLeaderboard() {
  if (confirm('Kya aap sach mein saare leaderboard scores clear karna chahte ho? Ye wapas nahi aayenge!')) {
    localStorage.removeItem('leaderboard');
    renderLeaderboard();
    alert('Leaderboard clear ho gaya! 🗑️');
  }
}

// ============================================
// INIT
// ============================================
window.addEventListener('DOMContentLoaded', renderLeaderboard);