//zyp

document.addEventListener('DOMContentLoaded', function() {
  initNavigation();
  initScrollEffects();
  initContactForm();
  document.title = 'Zypdev Portfolio';
});
function initNavigation() {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('nav');
  const menuItems = document.querySelectorAll('nav ul li a');
  const body = document.body;
  const overlay = document.createElement('div');
  overlay.classList.add('menu-overlay');
  body.appendChild(overlay);
  hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('active');
    nav.classList.toggle('active');
    overlay.classList.toggle('active');
    body.classList.toggle('no-scroll');
  });
  overlay.addEventListener('click', function() {
    hamburger.classList.remove('active');
    nav.classList.remove('active');
    overlay.classList.remove('active');
    body.classList.remove('no-scroll');
  });
  menuItems.forEach(item => {
    item.addEventListener('click', function() {
      hamburger.classList.remove('active');
      nav.classList.remove('active');
      overlay.classList.remove('active');
      body.classList.remove('no-scroll');
    });
  });
  window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY;
    
    document.querySelectorAll('section').forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        document.querySelectorAll('nav ul li a').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
    const header = document.querySelector('header');
    if (scrollPosition > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}
function initScrollEffects() {
  document.querySelectorAll('section').forEach(section => {
    section.classList.add('reveal');
  });
  
  function revealSections() {
    const windowHeight = window.innerHeight;
    const revealPoint = 150;
    
    document.querySelectorAll('.reveal').forEach(section => {
      const sectionTop = section.getBoundingClientRect().top;
      
      if (sectionTop < windowHeight - revealPoint) {
        section.classList.add('active');
      }
    });
  }

  revealSections();
  window.addEventListener('scroll', revealSections);
}
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;
      if (!name || !email || !message) {
        showNotification('tüm herşeyi doldursana Eksik kalanlar vahi yoluylamı gelecek bana', 'error');
        return;
      }
      
      // çakma bir başarılı mesajı sunuyoruz gerçekten yollamaz
      contactForm.reset();
      showNotification('Mesajını zypherise iletiyorumm', 'success');
    });
  }
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = message;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
  .notification {
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 4px;
    background-color: #333;
    color: white;
    font-size: 14px;
    z-index: 1000;
    transform: translateY(100px);
    opacity: 0;
    transition: all 0.3s ease;
  }
  
  .notification.show {
    transform: translateY(0);
    opacity: 1;
  }
  
  .notification.success {
    background-color: #4CAF50;
  }
  
  .notification.error {
    background-color: #F44336;
  }
  
  .notification.info {
    background-color: #2196F3;
  }
`;

document.head.appendChild(notificationStyle);