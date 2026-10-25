// ============================================
// DARK MODE TOGGLE
// ============================================

(function() {
  // Page load hote hi theme apply karo (flash se bachne ke liye)
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    document.documentElement.classList.add('dark-mode');
  } else {
    document.documentElement.classList.remove('dark-mode');
  }
})();

// Toggle button add karo jab DOM ready ho
window.addEventListener('DOMContentLoaded', () => {
  addToggleButton();
});

function addToggleButton() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  // Button banao
  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'theme-toggle';
  toggleBtn.setAttribute('aria-label', 'Toggle dark mode');
  toggleBtn.innerHTML = getIcon();

  // Click handler
  toggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    toggleBtn.innerHTML = getIcon();

    // Button animation
    toggleBtn.style.transform = 'rotate(360deg) scale(1.2)';
    setTimeout(() => {
      toggleBtn.style.transform = '';
    }, 300);
  });

  // Navbar mein add karo
  navbar.appendChild(toggleBtn);
}

function getIcon() {
  const isDark = document.documentElement.classList.contains('dark-mode');
  return isDark ? '☀️' : '🌙';
}

// ============================================
// MOBILE MENU TOGGLE
// ============================================
window.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');

       // Body scroll lock
  if (navLinks.classList.contains('active')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
    });

    // Link click par menu close karo (mobile par)
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }
});