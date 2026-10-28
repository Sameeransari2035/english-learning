// ============================================
// TOAST NOTIFICATION SYSTEM (Fixed Flash)
// ============================================
function showToast(message, type = 'info') {
  // Container banao agar nahi hai
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  // Toast Element banao
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  // Icon set karo
  let icon = 'ℹ️';
  if (type === 'success') icon = '✅';
  if (type === 'error') icon = '❌';
  if (type === 'warning') icon = '⚠️';

  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  
  // Sabse pehle toast ko invisible (chhupa hua) rakho
  toast.style.opacity = '0';
  container.appendChild(toast);

  // Browser ko thoda sa time do taaki wo toast ko DOM mein daal de
  // Uske baad animation trigger karo taaki flash na ho
  requestAnimationFrame(() => {
    setTimeout(() => {
      toast.classList.add('show');
      toast.style.opacity = '1'; // Wapas visible karo
    }, 10);
  });

  // 3 second baad hatao
  setTimeout(() => {
    toast.classList.remove('show');
    toast.style.opacity = '0';
    
    // Animation complete hone ke baad DOM se remove karo
    setTimeout(() => {
      toast.remove();
    }, 400); // 400ms transition ke liye
  }, 3000);
}