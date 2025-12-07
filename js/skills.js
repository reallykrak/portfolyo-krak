//zyp
document.addEventListener('DOMContentLoaded', function() {
  initSkillBars();
});

function initSkillBars() {
  const skills = document.querySelectorAll('.skill');
  
  skills.forEach(skill => {
    const bar = skill.querySelector('.skill-bar');
    const percentage = bar.getAttribute('data-percentage');
    bar.style.setProperty('--fill-percentage', `${percentage}%`);
    skill.addEventListener('mouseenter', function() {
      animateSkillBar(bar, percentage);
    });
    
    skill.addEventListener('mouseleave', function() {
      bar.style.width = '0';
      bar.classList.remove('fill-animation');
    });
    skill.addEventListener('touchstart', function(e) {
      e.preventDefault();
      animateSkillBar(bar, percentage);
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const skill = entry.target;
        const bar = skill.querySelector('.skill-bar');
        const percentage = bar.getAttribute('data-percentage');
        animateSkillBar(bar, percentage);
        observer.unobserve(skill);
        setTimeout(() => {
          bar.style.width = '0';
          bar.classList.remove('fill-animation');
          observer.observe(skill);
        }, 2000);
      }
    });
  }, {
    threshold: 0.1
  });
  
  skills.forEach(skill => {
    observer.observe(skill);
  });
}

function animateSkillBar(bar, percentage) {
  bar.classList.add('fill-animation');
  bar.style.width = `${percentage}%`;
}

function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}
document.addEventListener('DOMContentLoaded', function() {
  if (isTouchDevice()) {
    document.body.classList.add('touch-device');
    const skillNames = document.querySelectorAll('.skill-name');
    
    skillNames.forEach(skillName => {
      skillName.addEventListener('click', function() {
        const skill = this.parentElement;
        const wasActive = skill.classList.contains('active');
        document.querySelectorAll('.skill').forEach(s => {
          s.classList.remove('active');
        });
        if (!wasActive) {
          skill.classList.add('active');
        }
      });
    });
    const touchStyle = document.createElement('style');
    touchStyle.textContent = `
      .touch-device .skill-bar-container {
        height: 0;
        transition: height 0.3s ease;
      }
      
      .touch-device .skill.active .skill-bar-container {
        height: 15px;
      }
      
      .touch-device .skill.active .skill-percentage {
        opacity: 1;
      }
      
      .touch-device .skill.active .skill-bar {
        animation: fill 1s ease-out forwards;
      }
      
      .touch-device .skill-name {
        position: relative;
      }
      
      .touch-device .skill-name::after {
        content: '▼';
        position: absolute;
        right: 10px;
        transition: transform 0.3s ease;
      }
      
      .touch-device .skill.active .skill-name::after {
        transform: rotate(180deg);
      }
    `;
    
    document.head.appendChild(touchStyle);
  }
});