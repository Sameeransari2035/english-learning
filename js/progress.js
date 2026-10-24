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