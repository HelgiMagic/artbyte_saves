// работа header и geo

document.addEventListener('DOMContentLoaded', () => {
  // --- Элементы DOM ---
  const hamburgerBtn = document.querySelector('.hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileMenuCloseBtn = document.getElementById('mobileMenuClose');
  const geoTrigger = document.querySelector('.locale');
  const geoModal = document.getElementById('geoModal');
  const overlay = document.querySelector('.overlay');
  const selectedCitySpan = geoTrigger.querySelector('span');
  const cityList = geoModal.querySelector('.geo-modal__list');
  const searchInput = geoModal.querySelector('.geo-modal__search input');

  // --- Функции управления ---
  const closeAllPopups = () => {
    mobileMenu.classList.remove('open');
    geoModal.classList.add('hidden');
    overlay.classList.add('hidden');
  };

  // --- Обработчики событий ---

  // Открытие мобильного меню
  hamburgerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isMenuOpen = mobileMenu.classList.contains('open');
    closeAllPopups();
    if (!isMenuOpen) {
      mobileMenu.classList.add('open');
      overlay.classList.remove('hidden');
    }
  });

  // Открытие гео-окошка
  geoTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isGeoModalOpen = !geoModal.classList.contains('hidden');
    closeAllPopups();
    if (!isGeoModalOpen) {
      geoModal.classList.remove('hidden');
    }
  });

  // Закрытие по кнопке, оверлею или клавише Escape
  mobileMenuCloseBtn.addEventListener('click', closeAllPopups);
  overlay.addEventListener('click', closeAllPopups);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllPopups();
    }
  });

  // Выбор города
  cityList.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      const newCity = e.target.textContent.trim();
      if (selectedCitySpan) {
        selectedCitySpan.textContent = newCity;
      }
      closeAllPopups();
    }
  });

  // Фильтр-поиск городов
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    cityList.querySelectorAll('li').forEach((li) => {
      const cityName = li.textContent.toLowerCase().trim();
      // Используем атрибут `hidden` для семантичности и доступности
      li.hidden = !cityName.includes(query);
    });
  });

  // Предотвращение закрытия при клике внутри открытых окон
  mobileMenu.addEventListener('click', (e) => e.stopPropagation());
  geoModal.addEventListener('click', (e) => e.stopPropagation());
});

// работа sort в blog
document.addEventListener('DOMContentLoaded', function () {
  const wrapper = document.querySelector('.sort-wrapper');
  if (!wrapper) return;
  const dropdown = wrapper.querySelector('.sort-dropdown');
  const valueDisplay = wrapper.querySelector('.sort-value');
  const options = wrapper.querySelectorAll('.sort-option');

  // Функция переключения видимости
  function toggleDropdown() {
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
  }

  // Открыть/закрыть дропдаун по клику на wrapper
  wrapper.addEventListener('click', function (event) {
    event.stopPropagation(); // чтобы клик на wrapper не всплывал на документ
    toggleDropdown();
  });

  // При выборе опции
  options.forEach((option) => {
    option.addEventListener('click', function (event) {
      event.stopPropagation();
      valueDisplay.textContent = this.textContent;
      dropdown.style.display = 'none';
      // здесь можно добавить вызов сортировки, e.g. sortItems(this.dataset.value);
    });
  });

  // Закрыть при клике вне
  document.addEventListener('click', function () {
    dropdown.style.display = 'none';
  });
});

// открытие всех форм попапов
document.addEventListener('DOMContentLoaded', function () {
  addDynamicEventListener(document.body, 'click', 'button[data-form]', async function (e) {
    const response = await fetch(e.target.dataset.form);
    const result = await response.text();

    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    document.body.appendChild(overlay);

    const formPopup = document.createElement('div');
    formPopup.classList.add('form-popup');
    formPopup.innerHTML = result;
    document.body.appendChild(formPopup);

    const closeButton = document.createElement('button');
    closeButton.classList.add('close');
    closeButton.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 19L12 12M12 12L5 5M12 12L19 5M12 12L5 19" stroke="#1D2124" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    `;
    formPopup.appendChild(closeButton);

    const closeFormPopup = () => {
      overlay.remove();
      formPopup.remove();
    };

    closeButton.addEventListener('click', closeFormPopup);
    overlay.addEventListener('click', closeFormPopup);
  });
});

document.addEventListener('DOMContentLoaded', function () {
  addDynamicEventListener(document.body, 'click', '.input-dropdown .value-row', async function (e) {
    const dropdownElement = e.target.closest('.input-dropdown');

    dropdownElement.querySelector('.content').classList.toggle('active');
  });

  addDynamicEventListener(document.body, 'click', '.input-dropdown .option', async function (e) {
    const dropdownElement = e.target.closest('.input-dropdown');

    dropdownElement.querySelector('.value').textContent = e.target.textContent;
    dropdownElement.querySelector('input[type="hidden"]').value = e.target.dataset.value;
    dropdownElement.querySelector('.content').classList.remove('active');
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const scrollToTopBtn = document.getElementById('scrollToTopBtn');

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 100 || document.documentElement.scrollTop > 100) {
      scrollToTopBtn.classList.add('show');
    } else {
      scrollToTopBtn.classList.remove('show');
    }
  });

  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
});

// footer stick to bottom
document.addEventListener('DOMContentLoaded', () => {
  function stickFooterToBottom() {
    const footer = document.querySelector('.footer');
    if (!footer) return;

    const pusherId = 'footer-pusher';
    let pusher = document.getElementById(pusherId);

    // Если элемент-"распорка" еще не существует, создаем его
    if (!pusher) {
      pusher = document.createElement('div');
      pusher.id = pusherId;
      // Вставляем распорку прямо перед футером
      footer.parentNode.insertBefore(pusher, footer);
    }

    // Сбрасываем высоту распорки перед каждым вычислением
    pusher.style.height = '0px';

    const windowHeight = window.innerHeight;
    const footerOffsetTop = footer.offsetTop; // Расстояние от верха документа до верха футера
    const footerHeight = footer.offsetHeight; // Высота самого футера

    // Общая высота контента с футером
    const totalContentHeight = footerOffsetTop + footerHeight;

    // Если высота контента меньше высоты окна, добавляем отступ
    // через изменение высоты нашего элемента-распорки
    if (totalContentHeight < windowHeight) {
      const margin = windowHeight - totalContentHeight;
      pusher.style.height = `${margin}px`;
    }
  }

  // Вызываем функцию при загрузке страницы
  window.addEventListener('load', stickFooterToBottom);

  // И при изменении размера окна
  window.addEventListener('resize', stickFooterToBottom);
});
