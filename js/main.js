document.addEventListener('DOMContentLoaded', function() {
  initNavigationSPA();
  // Form submit artık HTML action üzerinden (FormSubmit) yönetiliyor
});

function initNavigationSPA() {
  const hamburger = document.querySelector('.hamburger');
  const fullscreenMenu = document.querySelector('.fullscreen-menu');
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.page-section');

  function toggleMenu() {
    hamburger.classList.toggle('active');
    fullscreenMenu.classList.toggle('active');
  }

  hamburger.addEventListener('click', toggleMenu);

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Menüyü kapat
      if(fullscreenMenu.classList.contains('active')) toggleMenu();

      // Aktif link stilini güncelle
      links.forEach(l => l.classList.remove('active-link'));
      link.classList.add('active-link');

      // Tıklanan bölümü bul
      const targetId = link.getAttribute('href').substring(1);
      
      // Bütün bölümleri gizle, sadece isteneni göster (SPA mantığı)
      sections.forEach(section => {
        section.classList.remove('active');
      });
      document.getElementById(targetId).classList.add('active');
      
      // Sayfayı en üste al
      window.scrollTo(0, 0);
    });
  });
}
