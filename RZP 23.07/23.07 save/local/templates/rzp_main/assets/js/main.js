document.addEventListener('DOMContentLoaded', () => {
  function initMainpageFirst() {
    if (!document.querySelector('.mainpage-first')) return;

    const navigation = document.querySelector('.mainpage-first .swiper-navigation');
    const currentEl = navigation.querySelector('.slide-counter .current');
    const totalEl = navigation.querySelector('.slide-counter .total');

    const swiper = new Swiper('.mainpage-first .swiper', {
      loop: true,
      navigation: {
        nextEl: '.swiper-next',
        prevEl: '.swiper-prev',
      },
      on: {
        init: function () {
          // — посчитаем реальные (не копии) слайды:
          const realSlides = this.slides.filter((slide) => !slide.classList.contains('swiper-slide-duplicate')).length;
          // — запишем общее количество:
          totalEl.textContent = String(realSlides).padStart(2, '0');
          // — обновим текущий (на старте):
          updateCounter.call(this);
        },
        slideChange: updateCounter, // при смене слайда
        transitionEnd: updateCounter, // когда анимация закончилась (на всякий случай)
      },
    });

    function updateCounter() {
      // realIndex — индекс в массиве «реальных» слайдов, начиная с 0
      const current = this.realIndex + 1;
      this.navigation.$el; // нет, нам не нужна внутренняя навигация Swiper, мы обновляем свой счетчик
      currentEl.textContent = String(current).padStart(2, '0');
    }
  }

  initMainpageFirst();

  function initMobileMenu() {
    const opener = document.querySelector('.mobile-menu-opener');
    const menu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.overlay');
    const close = menu.querySelector('.close');

    const openMobileMenu = () => {
      menu.classList.add('active');
      overlay.classList.add('active');
    };

    const closeMobileMenu = () => {
      menu.classList.remove('active');
      overlay.classList.remove('active');
    };

    close.addEventListener('click', closeMobileMenu);
    overlay.addEventListener('click', closeMobileMenu);
    opener.addEventListener('click', openMobileMenu);
  }

  initMobileMenu();

  function initMainpagePortfolio() {
    if (!document.querySelector('.our-portfolio-section')) return;

    const swiper = new Swiper('.our-portfolio-section .swiper', {
      loop: true,
      navigation: {
        nextEl: '.swiper-next',
        prevEl: '.swiper-prev',
      },
      autoplay: {
        delay: 3000,
        disableOnInteraction: true,
      },

      slidesPerView: 'auto',
      spaceBetween: 8,

      breakpoints: {
        // при ширине экрана от 769px и выше
        769: {
          slidesPerView: 3,
          spaceBetween: 16,
        },
      },
    });
  }

  initMainpagePortfolio();

  function initMainpagePartners() {
    if (!document.querySelector('.our-partners-section')) return;

    const swiper = new Swiper('.our-partners-section.swiper', {
      loop: true,

      // Навигация
      navigation: {
        nextEl: '.swiper-next',
        prevEl: '.swiper-prev',
      },

      // Плавное свободное пролистывание
      freeMode: {
        enabled: true, // включить свободный режим
        momentum: true, // без отскока
        sticky: false, // без «прилипания» к слайду
      },

      // Автоплей для непрерывного движения
      autoplay: {
        delay: 0, // без пауз между перезапусками
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },

      // Скорость прокрутки (миллисекунды)
      speed: 3000,

      slidesPerView: 'auto',
      spaceBetween: 40,

      breakpoints: {
        // при ширине экрана от 769px и выше
        769: {
          spaceBetween: 80,
        },
      },
    });
  }

  initMainpagePartners();

  function initAboutpageCompetencies() {
    const container = document.querySelector('.about-our-competencies');
    if (!container) return;

    const leftElems = Array.from(container.querySelectorAll('.left-elem'));
    const rightElems = Array.from(container.querySelectorAll('.right-elem'));

    function closeAllMobile() {
      const panels = container.querySelectorAll('.mobile-panel');

      panels.forEach((panel) => {
        panel.style.maxHeight = '0'; // убираем высоту
        panel.classList.remove('in');
        setTimeout(() => {
          panel.remove();
        }, 400);
      });
    }

    function doActiveThing(left) {
      leftElems.forEach((l) => l.classList.remove('active'));
      rightElems.forEach((r) => r.classList.remove('active'));
      left.classList.add('active');
      const type = Array.from(left.classList).find((c) => !['left-elem', 'active'].includes(c));
      const match = container.querySelector(`.right-elem.${type}`);
      if (match) match.classList.add('active');
    }

    leftElems.forEach((left) => {
      // hover‑поведение для десктопа
      left.addEventListener('mouseenter', () => {
        if (window.innerWidth <= 950) return;
        doActiveThing(left);
      });

      // click для мобилки — вставляем панель сразу после left-elem
      left.addEventListener('click', () => {
        if (left.classList.contains('active')) return; // если уже активен, ничего не делаем

        doActiveThing(left);
        if (window.innerWidth > 950) return;

        // ищем уже существующую панель сразу после текущего left
        closeAllMobile();

        const type = Array.from(left.classList).find((c) => !['left-elem', 'active'].includes(c));
        const match = container.querySelector(`.right-elem.${type}`);
        if (!match) return;

        // клонируем и упаковываем в wrapper
        const panel = match.cloneNode(true);
        const wrapper = document.createElement('div');
        wrapper.classList.add('mobile-panel');
        wrapper.append(panel);

        // вставляем сразу после left
        left.insertAdjacentElement('afterend', wrapper);

        // после вставки: сначала рефлоу, потом замеряем содержимое и запускаем анимацию
        requestAnimationFrame(() => {
          const fullHeight = panel.scrollHeight; // реальная высота контента
          wrapper.style.maxHeight = fullHeight + 'px';
          wrapper.classList.add('in');
        });
      });
    });

    // init active elem
    leftElems[0].click();
  }

  initAboutpageCompetencies();
});
