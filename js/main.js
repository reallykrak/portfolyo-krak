document.addEventListener('DOMContentLoaded', function() {
  initNavigation();
  initScrollEffects();
  initContactForm();
  initSnowflakes();
  initLanyard();
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
    document.body.classList.toggle('no-scroll');
  }

  hamburger.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', toggleMenu);

  links.forEach(link => {
    link.addEventListener('click', () => {
      if(nav.classList.contains('active')) toggleMenu();
    });
  });

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
      alert("Mesajın krak'a iletildi (Simülasyon)");
      form.reset();
    });
  }
}

/* --- KAR EFEKTİ --- */
function initSnowflakes() {
  const container = document.getElementById('snow-container');
  const characters = ['❅', '❆', '❄', '*'];
  
  setInterval(() => {
    const flake = document.createElement('div');
    flake.classList.add('snowflake');
    flake.innerText = characters[Math.floor(Math.random() * characters.length)];
    flake.style.left = Math.random() * 100 + 'vw';
    flake.style.animationDuration = Math.random() * 5 + 5 + 's'; // 5-10 saniye arası düşüş
    flake.style.opacity = Math.random() * 0.8 + 0.2;
    flake.style.fontSize = Math.random() * 10 + 10 + 'px'; // 10px-20px arası
    
    container.appendChild(flake);

    setTimeout(() => {
      flake.remove();
    }, 10000); // animasyon bitince temizle
  }, 250); // her 250ms'de bir kar tanesi üret
}

/* --- DISCORD LANYARD API --- */
async function initLanyard() {
  const userId = "999406459106373722";
  try {
    const res = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
    const data = await res.json();
    
    if(data.success) {
      const user = data.data.discord_user;
      const status = data.data.discord_status;
      const activities = data.data.activities;
      
      // Update Avatar
      const avatarUrl = user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : 'image/pode.png';
      document.getElementById('lanyard-avatar').src = avatarUrl;
      
      // Update Username
      document.getElementById('lanyard-username').textContent = user.username;
      
      // Update Status Dot
      const statusDot = document.getElementById('lanyard-status');
      statusDot.className = 'discord-status'; // Reset classes
      statusDot.classList.add(`status-${status}`);
      
      // Update Presence text
      let presenceText = "last seen unknown";
      if(status !== "offline") {
        if(activities.length > 0) {
          presenceText = `Playing ${activities[0].name}`;
        } else {
          presenceText = "Online";
        }
      }
      document.getElementById('lanyard-presence').textContent = presenceText;
    }
  } catch(e) {
    console.error("Lanyard error:", e);
  }
}
