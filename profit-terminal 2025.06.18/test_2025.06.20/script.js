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
