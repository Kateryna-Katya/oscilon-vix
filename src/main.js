document.addEventListener('DOMContentLoaded', () => {

  // 1. Инициализация иконок
  if (typeof lucide !== 'undefined') {
      lucide.createIcons();
  }

  // 2. Плавный скролл
  if (typeof Lenis !== 'undefined') {
      const lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smooth: true,
      });
      function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
  }

  // 3. Мобильное меню
  const burger = document.querySelector('.header__burger');
  const closeBtn = document.querySelector('.mobile-menu__close');
  const mobileMenu = document.querySelector('.mobile-menu');
  const menuLinks = document.querySelectorAll('.mobile-menu__link, .mobile-menu__btn');

  if (burger && mobileMenu) {
      function toggleMenu() {
          mobileMenu.classList.toggle('is-open');
          if (mobileMenu.classList.contains('is-open')) {
              document.body.style.overflow = 'hidden'; // Блок скролла
          } else {
              document.body.style.overflow = '';
          }
      }

      burger.addEventListener('click', toggleMenu);

      if (closeBtn) {
          closeBtn.addEventListener('click', toggleMenu);
      }

      // Закрываем при клике на ссылку
      menuLinks.forEach(link => {
          link.addEventListener('click', toggleMenu);
      });
  }

  console.log('Oscilon-Vix: Systems Operational.');
});