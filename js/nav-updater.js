// ============================================
// NAVBAR UPDATE (Login/Logout Status)
// ============================================
function updateNavbar() {
  const navArea = document.getElementById('navUserArea');
  if (!navArea) return;

  const currentUser = localStorage.getItem('currentUser');
  const userName = localStorage.getItem('userName') || 'User';

  if (currentUser) {
    // User logged in hai
    navArea.innerHTML = `
      <span style="font-weight: 600; color: var(--primary-dark); font-size: 0.9rem;">
        👤 ${userName.split(' ')[0]}
      </span>
      <button onclick="logoutUser()" class="btn btn-secondary" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; border: 1px solid var(--danger); color: var(--danger); box-shadow: none;">
        Logout
      </button>
    `;
  } else {
    // User logged out hai
    navArea.innerHTML = `
      <a href="login.html" class="btn btn-primary" style="padding: 0.4rem 0.8rem; font-size: 0.85rem;">
        Login
      </a>
    `;
  }
}

// Har page load par chalao
document.addEventListener('DOMContentLoaded', updateNavbar);