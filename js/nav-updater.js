// ============================================
// NAVBAR UPDATE (Login/Logout Status)
// ============================================
function updateNavbar() {
  const navArea = document.getElementById('navUserArea');
  const navLinks = document.getElementById('navLinks');
  if (!navArea || !navLinks) return;

  const currentUser = localStorage.getItem('currentUser');
  const userName = localStorage.getItem('userName') || 'User';

  // Purane mobile buttons ko pehle hatao (taaki duplicate na banein)
  const existingMobileLogout = document.getElementById('mobileLogoutLi');
  const existingMobileTheme = document.getElementById('mobileThemeLi');
  if (existingMobileLogout) existingMobileLogout.remove();
  if (existingMobileTheme) existingMobileTheme.remove();

  if (currentUser) {
    // 1. Navbar ke upar wala hissa (Desktop par dikhega)
    navArea.innerHTML = `
      <span style="font-weight: 600; color: var(--primary-dark); font-size: 0.95rem;">
        👤 ${userName.split(' ')[0]}
      </span>
      <button onclick="logoutUser(event)" class="btn btn-secondary" style="padding: 0.4rem 0.8rem; font-size: 0.85rem; border: 1px solid var(--danger); color: var(--danger); box-shadow: none; border-radius: 6px;">
        Logout
      </button>
    `;

    // 2. Hamburger Menu ke andar ka hissa (Mobile par dikhega)
    // Dark Mode
    const themeLi = document.createElement('li');
    themeLi.id = 'mobileThemeLi';
    themeLi.innerHTML = `
      <a href="#" onclick="toggleDarkMode(event)" style="display: flex; align-items: center; justify-content: space-between;">
        <span>🌙 Dark Mode</span>
        <span id="mobileThemeStatus" style="font-weight: bold; color: var(--primary);">Off</span>
      </a>
    `;
    navLinks.appendChild(themeLi);

    // Logout
    const logoutLi = document.createElement('li');
    logoutLi.id = 'mobileLogoutLi';
    logoutLi.style.borderTop = "1px solid rgba(0,0,0,0.05)";
    logoutLi.innerHTML = `<a href="#" onclick="logoutUser(event)" style="color: var(--danger); font-weight: 600;">🚪 Logout</a>`;
    navLinks.appendChild(logoutLi);

    updateMobileThemeStatus();

  } else {
    // Agar user logged in nahi hai
    navArea.innerHTML = `
      <a href="login.html" class="btn btn-primary" style="padding: 0.4rem 0.8rem; font-size: 0.85rem; border-radius: 8px;">
        Login
      </a>
    `;

    const themeLi = document.createElement('li');
    themeLi.id = 'mobileThemeLi';
    themeLi.innerHTML = `
      <a href="#" onclick="toggleDarkMode(event)" style="display: flex; align-items: center; justify-content: space-between;">
        <span>🌙 Dark Mode</span>
        <span id="mobileThemeStatus" style="font-weight: bold; color: var(--primary);">Off</span>
      </a>
    `;
    navLinks.appendChild(themeLi);
    updateMobileThemeStatus();
  }
}

// ============================================
// LOGOUT FUNCTION
// ============================================
function logoutUser(e) {
  if (e) e.preventDefault();
  if (confirm("Kya aap sach mein logout karna chahte hain?")) {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userName');
    showToast("Successfully logout ho gaye! 👋", "success");
    setTimeout(() => window.location.href = 'index.html', 1000); // 1 sec baad redirect
  }
}

// ============================================
// DARK MODE TOGGLE (Menu ke andar se)
// ============================================
function toggleDarkMode(e) {
  if (e) e.preventDefault();
  const isDark = document.documentElement.classList.toggle('dark-mode');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  
  const mainToggle = document.querySelector('.theme-toggle');
  if (mainToggle) {
    mainToggle.innerHTML = isDark ? '☀️' : '🌙';
  }
  
  updateMobileThemeStatus();
  closeMobileMenu();
}

function updateMobileThemeStatus() {
  const statusEl = document.getElementById('mobileThemeStatus');
  if (statusEl) {
    const isDark = document.documentElement.classList.contains('dark-mode');
    statusEl.textContent = isDark ? 'On' : 'Off';
  }
}

function closeMobileMenu() {
  const navLinks = document.getElementById('navLinks');
  const menuToggle = document.getElementById('menuToggle');
  if (navLinks) navLinks.classList.remove('active');
  if (menuToggle) menuToggle.classList.remove('active');
  document.body.style.overflow = '';
}

// Start
document.addEventListener('DOMContentLoaded', updateNavbar);