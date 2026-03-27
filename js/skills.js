document.addEventListener('DOMContentLoaded', function() {
  initNeonSkills();
});

function initNeonSkills() {
  const skillBtns = document.querySelectorAll('.skill-btn');
  
  // Sadece dokununca veya tıklayınca parlasın ama açılmasın
  skillBtns.forEach(btn => {
    // Mobil dokunuşlar için
    btn.addEventListener('touchstart', function(e) {
      // Sadece parlama efekti ver, açılma yok
      skillBtns.forEach(b => b.classList.remove('active-glow'));
      this.classList.add('active-glow');
    });

    // PC tıklar için
    btn.addEventListener('click', function(e) {
      skillBtns.forEach(b => b.classList.remove('active-glow'));
      this.classList.add('active-glow');
    });
  });

  // Başka yere tıklayınca parlamayı kapat
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.skill-btn')) {
      skillBtns.forEach(b => b.classList.remove('active-glow'));
    }
  });
}
