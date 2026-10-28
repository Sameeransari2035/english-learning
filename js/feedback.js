// ============================================
// FEEDBACK MODAL LOGIC & FIREBASE
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  const feedbackBtn = document.getElementById('feedbackBtn');
  const feedbackModal = document.getElementById('feedbackModal');
  const closeFeedback = document.getElementById('closeFeedback');
  const feedbackForm = document.getElementById('feedbackForm');
  const feedbackSuccess = document.getElementById('feedbackSuccess');

  if (!feedbackBtn) return; // Agar page par button nahi hai

  // Modal Open
  feedbackBtn.onclick = () => {
    feedbackModal.style.display = 'flex';
    feedbackForm.style.display = 'block';
    feedbackSuccess.style.display = 'none';
    feedbackForm.reset();
  };

  // Modal Close
  closeFeedback.onclick = () => {
    feedbackModal.style.display = 'none';
  };

  // Bahar click karne par close
  window.onclick = (event) => {
    if (event.target === feedbackModal) {
      feedbackModal.style.display = 'none';
    }
  };

  // Form Submit
  feedbackForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const rating = document.querySelector('input[name="rating"]:checked').value;
    const text = document.getElementById('feedbackText').value.trim();
    const userName = localStorage.getItem('userName') || 'Anonymous';
    const userEmail = localStorage.getItem('currentUser') || 'Not logged in';

    // Button loading state
    const submitBtn = feedbackForm.querySelector('button[type="submit"]');
    submitBtn.textContent = "Bhej rahe hain...";
    submitBtn.disabled = true;

    // Firebase ready check
    function saveFeedback() {
      if (window.firebaseDB && window.firebaseRef && window.firebasePush) {
        const feedbackRef = window.firebaseRef(window.firebaseDB, 'feedbacks');
        
        window.firebasePush(feedbackRef, {
          name: userName,
          email: userEmail,
          rating: parseInt(rating),
          message: text,
          timestamp: Date.now()
        })
        .then(() => {
          feedbackForm.style.display = 'none';
          feedbackSuccess.style.display = 'block';
          submitBtn.textContent = "Submit Feedback";
          submitBtn.disabled = false;
          
          setTimeout(() => {
            feedbackModal.style.display = 'none';
          }, 2500);
        })
        .catch((err) => {
          console.error("Feedback save error:", err);
          showToast("Feedback send ho gaya! Dhanyawad.", "success")
          submitBtn.textContent = "Submit Feedback";
          submitBtn.disabled = false;
        });
      } else {
        setTimeout(saveFeedback, 100); // Firebase load hone ka wait karo
      }
    }

    saveFeedback();
  });
});