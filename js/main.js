document.addEventListener('DOMContentLoaded', function() {
  initNavigationSPA();
  initBannerViews();
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

  if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
  }

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Menüyü kapat
      if(fullscreenMenu && fullscreenMenu.classList.contains('active')) toggleMenu();

      // Aktif link stilini güncelle
      links.forEach(l => l.classList.remove('active-link'));
      link.classList.add('active-link');

      // Tıklanan bölümü bul
      const href = link.getAttribute('href') || '#home';
      const targetId = href.startsWith('#') ? href.substring(1) : href;
      
      // Bütün bölümleri gizle, sadece isteneni göster (SPA mantığı)
      sections.forEach(section => {
        section.classList.remove('active');
      });
      const targetEl = document.getElementById(targetId);
      if (targetEl) targetEl.classList.add('active');
      
      // Sayfayı en üste al
      window.scrollTo(0, 0);
    });
  });
}

/* Banner view counter
   - localStorage ile basit bir sayaç tutar
   - her sayfa yüklemede 1 artar
   - isterseniz sunucu tarafı bir endpoint ile gerçek global sayaç bağlanabilir
*/
function initBannerViews() {
  try {
    const key = 'site_view_count_v1';
    // get current count
    let count = parseInt(localStorage.getItem(key) || '0', 10);
    // increment once per page load
    count = isNaN(count) ? 1 : count + 1;
    localStorage.setItem(key, String(count));

    // animate count up in the banner
    const el = document.getElementById('view-count');
    if (!el) return;

    // basit animasyon: 0'dan count'a kadar hızlı artış
    const target = count;
    let current = 0;
    const step = Math.max(1, Math.floor(target / 20));
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = current.toLocaleString();
    }, 40);
  } catch (e) {
    console.error('Banner view counter error:', e);
  }
}
