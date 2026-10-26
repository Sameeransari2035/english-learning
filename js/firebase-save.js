function askNameAndSaveToLeaderboard() {
  const maxScore = quizQuestions.length * 10;
  
  if (score === 0) return;
  
  let playerName = prompt(
    `🎉 Tumne ${score}/${maxScore} points kamaye!\n\nLeaderboard par apna naam daalo:`,
    localStorage.getItem('lastPlayerName') || ''
  );
  
  if (playerName !== null) {
    playerName = playerName.trim() || 'Anonymous';
    localStorage.setItem('lastPlayerName', playerName);
    
    // Firebase mein save karo (agar function available hai)
    if (typeof saveScoreToFirebase === 'function') {
      saveScoreToFirebase(playerName, score, maxScore);
    }
    
    // Result card mein link dikhao
    const badgesContainer = document.getElementById('resultBadges');
    if (badgesContainer) {
      const linkDiv = document.createElement('div');
      linkDiv.style.marginTop = '1.5rem';
      linkDiv.innerHTML = `
        <a href="leaderboard.html" class="btn btn-primary" style="margin-top: 0.5rem;">
          🏆 Global Leaderboard Dekho
        </a>
      `;
      badgesContainer.appendChild(linkDiv);
    }
  }
}