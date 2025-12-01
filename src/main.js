document.addEventListener('DOMContentLoaded', () => {

  // 1. Инициализация иконок
  if (typeof lucide !== 'undefined') lucide.createIcons();

  // 2. Плавный скролл
  if (typeof Lenis !== 'undefined') {
      const lenis = new Lenis({ duration: 1.2, smooth: true });
      function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
  }

  // 3. Мобильное меню (код из предыдущего этапа)
  initMobileMenu();

  // 4. ЗАПУСК HERO АНИМАЦИИ
  initHeroCanvas();

  console.log('Oscilon-Vix: Systems Operational.');
});

/* =========================================
 ФУНКЦИИ
 ========================================= */

function initMobileMenu() {
  const burger = document.querySelector('.header__burger');
  const closeBtn = document.querySelector('.mobile-menu__close');
  const mobileMenu = document.querySelector('.mobile-menu');
  const menuLinks = document.querySelectorAll('.mobile-menu__link, .mobile-menu__btn');

  if (burger && mobileMenu) {
      function toggleMenu() {
          mobileMenu.classList.toggle('is-open');
          document.body.style.overflow = mobileMenu.classList.contains('is-open') ? 'hidden' : '';
      }
      burger.addEventListener('click', toggleMenu);
      if (closeBtn) closeBtn.addEventListener('click', toggleMenu);
      menuLinks.forEach(link => link.addEventListener('click', toggleMenu));
  }
}

/* =========================================
 HERO CANVAS ANIMATION (Интерактивный градиент)
 ========================================= */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  // Цвета палитры
  const colors = [
      {r: 255, g: 0, b: 127}, // Hot Magenta
      {r: 157, g: 0, b: 255}, // Electric Purple
      {r: 5, g: 5, b: 5}      // Deep Void (Background)
  ];

  // Частицы-"блобы"
  let blobs = [];

  class Blob {
      constructor() {
          this.init();
      }
      init() {
          this.x = Math.random() * width;
          this.y = Math.random() * height;
          this.vx = (Math.random() - 0.5) * 0.5; // Очень медленная скорость
          this.vy = (Math.random() - 0.5) * 0.5;
          this.radius = Math.random() * 300 + 200; // Большие радиусы
          this.colorIndex = Math.floor(Math.random() * (colors.length - 1));
          this.alpha = Math.random() * 0.5 + 0.2;
          this.t = Math.random() * Math.PI * 2;
      }
      update() {
          this.t += 0.005;
          // Броуновское движение + синус для плавности
          this.x += this.vx + Math.sin(this.t) * 0.5;
          this.y += this.vy + Math.cos(this.t) * 0.5;

          // Реакция на мышь (плавное отталкивание)
          const dx = mouseX - this.x;
          const dy = mouseY - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 400) {
              const force = (400 - dist) / 400;
              this.vx -= dx * force * 0.001;
              this.vy -= dy * force * 0.001;
          }

          // Границы холста (отскакивание)
          if (this.x < -this.radius) this.x = width + this.radius;
          if (this.x > width + this.radius) this.x = -this.radius;
          if (this.y < -this.radius) this.y = height + this.radius;
          if (this.y > height + this.radius) this.y = -this.radius;
      }
      draw(ctx) {
          // Рисуем радиальный градиент для каждого "блоба"
          const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
          const c = colors[this.colorIndex];
          gradient.addColorStop(0, `rgba(${c.r}, ${c.g}, ${c.b}, ${this.alpha})`);
          gradient.addColorStop(1, `rgba(5, 5, 5, 0)`); // Растворяется в фоне

          ctx.globalCompositeOperation = 'lighter'; // Эффект свечения при наложении
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalCompositeOperation = 'source-over';
      }
  }

  function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      // Пересоздаем блобы при ресайзе
      blobs = [];
      for(let i = 0; i < 5; i++) { // 5 больших светящихся областей
          blobs.push(new Blob());
      }
  }

  function animate() {
      ctx.clearRect(0, 0, width, height);
      // Заливаем фон базовым цветом
      ctx.fillStyle = 'rgba(5, 5, 5, 1)';
      ctx.fillRect(0, 0, width, height);

      blobs.forEach(blob => {
          blob.update();
          blob.draw(ctx);
      });
      requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => {
      // Плавное следование за мышью
      mouseX += (e.clientX - mouseX) * 0.1;
      mouseY += (e.clientY - mouseY) * 0.1;
  });

  resize();
  animate();
}
// 5. Инициализация остальных секций
initStats();
initAccordion();
initForm();
initCookies();

/* --- НИЖЕ ВСТАВИТЬ САМИ ФУНКЦИИ (ВНЕ addEventListener) --- */

function initStats() {
const stats = document.querySelectorAll('.stat-num');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = +entry.target.getAttribute('data-target');
            const duration = 2000;
            const start = performance.now();

            const step = (currentTime) => {
                const progress = Math.min((currentTime - start) / duration, 1);
                // Easing func
                const ease = 1 - Math.pow(1 - progress, 3);
                entry.target.innerText = Math.floor(ease * target);
                if (progress < 1) requestAnimationFrame(step);
                else entry.target.innerText = target;
            };
            requestAnimationFrame(step);
            observer.unobserve(entry.target);
        }
    });
});
stats.forEach(s => observer.observe(s));
}

function initAccordion() {
const headers = document.querySelectorAll('.accordion-header');
headers.forEach(header => {
    header.addEventListener('click', () => {
        const isActive = header.classList.contains('active');

        // Close all
        headers.forEach(h => {
            h.classList.remove('active');
            h.nextElementSibling.style.maxHeight = null;
        });

        // Open clicked
        if (!isActive) {
            header.classList.add('active');
            header.nextElementSibling.style.maxHeight = header.nextElementSibling.scrollHeight + "px";
        }
    });
});
}

function initForm() {
const form = document.getElementById('lead-form');
const msg = document.getElementById('form-message');
if(!form) return;

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const captcha = document.getElementById('captcha').value;

    if(parseInt(captcha) !== 9) {
        msg.textContent = 'Ошибка: Неверный ответ (5 + 4 = 9)';
        msg.className = 'form-msg error';
        return;
    }

    const btn = form.querySelector('button');
    const oldText = btn.textContent;
    btn.textContent = 'Отправка...';
    btn.disabled = true;

    setTimeout(() => {
        msg.textContent = 'Заявка принята! Мы свяжемся с вами.';
        msg.className = 'form-msg success';
        form.reset();
        btn.textContent = oldText;
        btn.disabled = false;
    }, 1500);
});
}

function initCookies() {
const popup = document.getElementById('cookie-popup');
const btn = document.getElementById('accept-cookies');
if(!popup) return;

if(!localStorage.getItem('oscilon_cookies')) {
    setTimeout(() => popup.classList.add('show'), 2000);
}

btn.addEventListener('click', () => {
    localStorage.setItem('oscilon_cookies', 'true');
    popup.classList.remove('show');
});
}