document.addEventListener('DOMContentLoaded', function() {
  initNavigation();
  initScrollEffects();
  initContactForm();
});

function initNavigation() {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('nav');
  const overlay = document.querySelector('.menu-overlay');
  const links = document.querySelectorAll('nav ul li a');

  function toggleMenu() {
    hamburger.classList.toggle('active');
    nav.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.classList.toggle('no-scroll'); // Menü açıkken sayfa kaymasın
  }

  hamburger.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', toggleMenu);

  links.forEach(link => {
    link.addEventListener('click', () => {
      // Tıklayınca menüyü kapat
      if(nav.classList.contains('active')) toggleMenu();
    });
  });

  // Header Scroll Effect
  window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

function initScrollEffects() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // Skill bar animasyonu
        if (entry.target.classList.contains('skill-bar')) {
          const width = entry.target.getAttribute('data-percentage');
          entry.target.style.width = width + '%';
        }
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.skill-bar').forEach(bar => observer.observe(bar));
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  if(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert("Mesajın Kayra'ya iletildi (Simülasyon)");
      form.reset();
    });
  }
}
