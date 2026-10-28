let isLoginMode = true;

// Saare DOM elements pehle declare karo
const tabLogin = document.getElementById('tabLogin');
const tabSignup = document.getElementById('tabSignup');
const authForm = document.getElementById('authForm');
const authEmail = document.getElementById('authEmail');
const authPassword = document.getElementById('authPassword');
const authSubmitBtn = document.getElementById('authSubmitBtn');
const authError = document.getElementById('authError');
const nameGroup = document.getElementById('nameGroup');

// ============================================
// TAB SWITCH LOGIC (Login vs Signup)
// ============================================
if (tabLogin && tabSignup) {
  tabLogin.onclick = () => {
    isLoginMode = true;
    tabLogin.classList.add('active');
    tabSignup.classList.remove('active');
    authSubmitBtn.textContent = 'Login Karein';
    authError.style.display = 'none';
    
    // Login par naam ka box hide karo
    if (nameGroup) nameGroup.style.display = 'none';
  };

  tabSignup.onclick = () => {
    isLoginMode = false;
    tabSignup.classList.add('active');
    tabLogin.classList.remove('active');
    authSubmitBtn.textContent = 'Account Banayein';
    authError.style.display = 'none';
    
    // Signup par naam ka box show karo
    if (nameGroup) nameGroup.style.display = 'block';
  };
}

// ============================================
// FORM SUBMIT LOGIC
// ============================================
if (authForm) {
  authForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = authEmail.value.trim();
    const password = authPassword.value;

    authError.style.display = 'none';

    if (password.length < 6) {
      authError.textContent = "⚠️ Password kam se kam 6 characters ka hona chahiye!";
      authError.style.display = 'block';
      return;
    }

    authSubmitBtn.textContent = "Please wait...";
    authSubmitBtn.disabled = true;

    // Firebase ready hone ka wait karo
    function waitForFirebaseAuth() {
      if (window.firebaseAuth) {
        if (isLoginMode) {
          // ===== LOGIN =====
          window.firebaseSignIn(window.firebaseAuth, email, password)
            .then((userCredential) => {
              localStorage.setItem('currentUser', userCredential.user.email);
              window.location.href = 'dashboard.html';
            })
            .catch((error) => {
              showError(error.message);
            });
        } else {
          // ===== SIGNUP =====
          let userName = document.getElementById('authName').value.trim() || "User";

          window.firebaseCreateUser(window.firebaseAuth, email, password)
            .then((userCredential) => {
              localStorage.setItem('currentUser', userCredential.user.email);
              localStorage.setItem('userName', userName);
              window.location.href = 'dashboard.html';
            })
            .catch((error) => {
              showError(error.message);
            });
        }
      } else {
        setTimeout(waitForFirebaseAuth, 100);
      }
    }

    waitForFirebaseAuth();
  });
}

// ============================================
// ERROR HANDLER
// ============================================
function showError(msg) {
  authSubmitBtn.textContent = isLoginMode ? 'Login Karein' : 'Account Banayein';
  authSubmitBtn.disabled = false;

  if (msg.includes('auth/invalid-credential') || msg.includes('auth/user-not-found') || msg.includes('auth/wrong-password')) {
    authError.textContent = "❌ Email ya password galat hai!";
  } else if (msg.includes('auth/email-already-in-use')) {
    authError.textContent = "❌ Ye email pehle se registered hai. Login karein!";
  } else if (msg.includes('auth/weak-password')) {
    authError.textContent = "❌ Password kamzor hai (6+ characters chahiye).";
  } else {
    authError.textContent = "❌ Error: " + msg;
  }
  authError.style.display = 'block';
}

// ============================================
// CUSTOM TOAST FUNCTION
// ============================================
function showToast(message, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  let icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3000);
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
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  }
}