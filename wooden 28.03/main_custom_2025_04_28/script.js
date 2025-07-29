var ItemObj = {};

$(document).ready(function () {
  //if (BX.message("TYPE_SKU") != "TYPE_1" || BX.message("HAS_SKU_PROPS") != "Y") setNewHeader();
  setTimeout(function () {
    setNewHeader();
  }, 10);

  //change fixed header
  if (arMaxOptions['THEME']['SHOW_HEADER_GOODS'] == 'Y') $('#headerfixed .logo-row').addClass('wproducts');

  //set fixed tabs
  if ($('.ordered-block.js-store-scroll .tabs > ul.nav.nav-tabs').length) {
    $(
      '<div class="product-item-detail-tabs-container-fixed">' +
        '<div class="wrapper_inner">' +
        '<div class="product-item-detail-tabs-wrapper arrow_scroll">' +
        '<ul class="product-item-detail-tabs-list nav nav-tabs">' +
        $('.ordered-block.js-store-scroll ul.nav.nav-tabs').html() +
        //'<li class="last"></li>'+
        '</ul>' +
        '</div>' +
        '</div>' +
        '</div>'
    ).insertAfter($('#headerfixed'));
  }

  var options = {
    arrows_css: { 'background-color': '#fafafa' },
    linked_tabs: $('.ordered-block .tabs.arrow_scroll.arrow_scroll_init'),
  };
  //   $('.product-item-detail-tabs-wrapper').scrollTab(options);

  SetActiveTab($('.product-container').find('.tabs > .nav-tabs > li'));

  var options = {};
  //   $('.tabs.arrow_scroll:not(.arrow_scroll_init)').scrollTab(options);
  InitStickySideBar('.sticky-sidebar-custom', '.product-container.catalog_detail');

  $('.opener').click(function () {
    $(this).find('.opener_icon').toggleClass('opened');
    var showBlock = $(this).parents('tr').toggleClass('nb').next('.offer_stores').find('.stores_block_wrap');
    showBlock.slideToggle(200);
  });

  tabsHistory();

  function moveBuyBlock() {
    var bSticky = $('.wrapper1.sticky_menu:not(.sm)').length;
    var media = bSticky ? 992 + 340 : 992;

    if (window.matchMedia('(min-width: ' + media + 'px)').matches) {
      if (!$('.left_block .buy_block .counter_wrapp').length && $('.product-info .right_info .js-prices-in-item .counter_wrapp').length) {
        $('.product-info .right_info .js-prices-in-item .buy_block').appendTo($('.left_block .js-prices-in-side'));
      }

      //services block in left_block
      if (!$('.left_block .buy_services_wrap ').length && $('.product-info .right_info .js-services-in-item .buy_services_wrap').length) {
        $('.product-info .right_info .js-services-in-item .buy_services_wrap').appendTo($('.left_block .js-services-in-side'));
      }
    } else {
      if ($('.left_block .buy_block .counter_wrapp').length && !$('.product-info .right_info .js-prices-in-item .counter_wrapp').length) {
        $('.left_block .buy_block').appendTo($('.product-info .right_info .js-prices-in-item'));
      }

      //services block in adaptive block
      if ($('.left_block .buy_services_wrap').length && !$('.product-info .right_info .js-services-in-item .buy_services_wrap').length) {
        $('.left_block .js-services-in-side .buy_services_wrap').appendTo($('.product-info .right_info .js-services-in-item'));
      }
    }
  }

  BX.addCustomEvent('onWindowResize', function (eventdata) {
    try {
      ignoreResize.push(true);
      moveBuyBlock();
    } catch (e) {
    } finally {
      ignoreResize.pop();
    }
  });
  moveBuyBlock();

  if (typeof window.frameCacheVars !== 'undefined') {
    BX.addCustomEvent('onFrameDataReceived', function (json) {
      try {
        moveBuyBlock();
      } catch (e) {}
    });
  }

  // добавление кастомного поп-апа
  const additionalColoring = document.querySelector("[data-param-form_id='fast_view_services']");
  const basketButton = document.querySelector('.buy_block span.to-cart');

  // смена текста кнопки
  const quantityValue = document.querySelector('.quantity_block_wrapper .value').textContent;

  if (quantityValue === 'Разобрали: Скоро появятся, рекомендуем забронировать') {
    basketButton.textContent = 'В резерв';
  }

  const basketButtonInit = basketButton.outerHTML;

  const changeSelectColorBg = (e) => {
    e.preventDefault();

    selectColor.style.background = '#2fba5e';

    setTimeout(() => {
      selectColor.style.background = '';
    }, 2000);
  };

  if (additionalColoring) {
    additionalColoring.addEventListener('click', () => {
      setTimeout(() => {
        jqmOverlay = document.querySelector('#popup_iframe_wrapper .jqmOverlay');

        jqmOverlay.style.position = 'absolute';

        jqmOverlay.addEventListener('click', (e) => {
          changeSelectColorBg(e);
        });

        isAddedJqm = true;
      }, 200);
    });
  }

  // Получаем текущую дату в формате "7/37/2007"
  const date = new Date().toLocaleDateString();

  if (additionalColoring && basketButton && localStorage.getItem('color_popup_date') !== date) {
    // Переносим все дата-атрибуты из additionalColoring в basketButton
    for (const attr of additionalColoring.attributes) {
      if (attr.name.startsWith('data-')) {
        basketButton.setAttribute(attr.name, attr.value);
      }
    }

    basketButton.addEventListener('click', () => {
      setTimeout(() => {
        localStorage.setItem('color_popup_date', date);

        basketButton.outerHTML = basketButtonInit;
      }, 500);
    });
  }

  // окрашивание при закрытии формы
  const selectColor = document.querySelector('.ik_select_link.common_select-link');

  if (selectColor) {
    selectColor.style.transition = 'background 0.5s';

    $(document).on('click', '#fast_view_services .jqmClose', function (e) {
      changeSelectColorBg(e);
    });
  }

  $('html, body').on('mousedown', function (e) {
    if (typeof e.target.className == 'string' && e.target.className.indexOf('adm') < 0) {
      e.stopPropagation();
      var hint = $(e.target).closest('.hint');
      if (!$(e.target).closest('.hint').length) {
        $('.hint').removeClass('active').find('.tooltip').slideUp(100);
      } else {
        var pos_tmp = hint.offset().top + '' + hint.offset().left;
        $('.hint').each(function () {
          var pos_tmp2 = $(this).offset().top + '' + $(this).offset().left;
          if ($(this).text() + pos_tmp2 != hint.text() + pos_tmp) {
            $(this).removeClass('active').find('.tooltip').slideUp(100);
          }
        });
      }
    }
  });
});
$('.set_block').ready(function () {
  $('.set_block ').equalize({ children: '.item:not(".r") .cost', reset: true });
  $('.set_block').equalize({ children: '.item .item-title', reset: true });
  $('.set_block').equalize({ children: '.item .item_info', reset: false });
});

(function (window) {
  if (!window.JCCatalogOnlyElement) {
    window.JCCatalogOnlyElement = function (arParams) {
      if (typeof arParams === 'object') {
        this.params = arParams;

        this.obProduct = null;
        this.obProductItem = null;
        this.set_quantity = 1;

        this.currentPriceMode = '';
        this.currentPrices = [];
        this.currentPriceSelected = 0;
        this.currentQuantityRanges = [];
        this.currentQuantityRangeSelected = 0;

        if (this.params.MESS) {
          this.mess = this.params.MESS;
        }

        this.init();
      }
    };
    window.JCCatalogOnlyElement.prototype = {
      init: function () {
        var i = 0,
          j = 0,
          treeItems = null;
        // this.obProduct = $("#" + this.params.ID).closest(".product-container")[0];
        this.obProduct = $('#' + this.params.ID)
          .closest('.product-container')
          .find('.js-offers-calc');
        this.obProductItem = BX(this.params.ID);

        if (!!this.obProduct) {
          $(this.obProduct)
            .find('.counter_wrapp .counter_block input')
            .data('product', 'ob' + this.obProductItem.id + 'el');
          this.currentPriceMode = this.params.ITEM_PRICE_MODE;
          this.currentPrices = this.params.ITEM_PRICES;
          this.currentQuantityRanges = this.params.ITEM_QUANTITY_RANGES;
        }
      },

      setPriceAction: function () {
        this.set_quantity = this.params.MIN_QUANTITY_BUY;
        if ($(this.obProduct).find('input[name=quantity]').length) this.set_quantity = $(this.obProduct).find('input[name=quantity]').val();

        this.checkPriceRange(this.set_quantity);

        $(this.obProduct).find('.not_matrix').hide();

        $(this.obProduct)
          .find('.with_matrix .price_value_block')
          .html(
            getCurrentPrice(
              this.currentPrices[this.currentPriceSelected].PRICE,
              this.currentPrices[this.currentPriceSelected].CURRENCY,
              this.currentPrices[this.currentPriceSelected].PRINT_PRICE
            )
          );

        if ($(this.obProduct).find('.with_matrix .discount')) {
          $(this.obProduct)
            .find('.with_matrix .discount')
            .html(
              getCurrentPrice(
                this.currentPrices[this.currentPriceSelected].BASE_PRICE,
                this.currentPrices[this.currentPriceSelected].CURRENCY,
                this.currentPrices[this.currentPriceSelected].PRINT_BASE_PRICE
              )
            );
        }

        if (this.params.SHOW_DISCOUNT_PERCENT_NUMBER == 'Y') {
          if (this.currentPrices[this.currentPriceSelected].PERCENT > 0 && this.currentPrices[this.currentPriceSelected].PERCENT < 100) {
            if (!$(this.obProduct).find('.with_matrix .sale_block .sale_wrapper .value').length)
              $('<div class="value"></div>').insertBefore($(this.obProduct).find('.with_matrix .sale_block .sale_wrapper .text'));

            $(this.obProduct)
              .find('.with_matrix .sale_block .sale_wrapper .value')
              .html('-<span>' + this.currentPrices[this.currentPriceSelected].PERCENT + '</span>%');
          } else {
            if ($(this.obProduct).find('.with_matrix .sale_block .sale_wrapper .value').length)
              $(this.obProduct).find('.with_matrix .sale_block .sale_wrapper .value').remove();
          }
        }

        $(this.obProduct)
          .find('.with_matrix .sale_block .text .values_wrapper')
          .html(
            getCurrentPrice(
              this.currentPrices[this.currentPriceSelected].DISCOUNT,
              this.currentPrices[this.currentPriceSelected].CURRENCY,
              this.currentPrices[this.currentPriceSelected].PRINT_DISCOUNT
            )
          );

        if ('NOT_SHOW' in this.params && this.params.NOT_SHOW != 'Y') $(this.obProduct).find('.with_matrix').show();

        if (arMaxOptions['THEME']['SHOW_TOTAL_SUMM'] == 'Y') {
          if (typeof this.currentPrices[this.currentPriceSelected] !== 'undefined')
            setPriceItem($(this.obProduct), this.set_quantity, this.currentPrices[this.currentPriceSelected].PRICE);
        }
      },

      checkPriceRange: function (quantity) {
        if (typeof quantity === 'undefined' || this.currentPriceMode != 'Q') return;

        var range,
          found = false;

        for (var i in this.currentQuantityRanges) {
          if (this.currentQuantityRanges.hasOwnProperty(i)) {
            range = this.currentQuantityRanges[i];

            if (
              parseInt(quantity) >= parseInt(range.SORT_FROM) &&
              (range.SORT_TO == 'INF' || parseInt(quantity) <= parseInt(range.SORT_TO))
            ) {
              found = true;
              this.currentQuantityRangeSelected = range.HASH;
              break;
            }
          }
        }

        if (!found && (range = this.getMinPriceRange())) {
          this.currentQuantityRangeSelected = range.HASH;
        }

        for (var k in this.currentPrices) {
          if (this.currentPrices.hasOwnProperty(k)) {
            if (this.currentPrices[k].QUANTITY_HASH == this.currentQuantityRangeSelected) {
              this.currentPriceSelected = k;
              break;
            }
          }
        }
      },

      getMinPriceRange: function () {
        var range;

        for (var i in this.currentQuantityRanges) {
          if (this.currentQuantityRanges.hasOwnProperty(i)) {
            if (!range || parseInt(this.currentQuantityRanges[i].SORT_FROM) < parseInt(range.SORT_FROM)) {
              range = this.currentQuantityRanges[i];
            }
          }
        }

        return range;
      },
    };
  }

  if (!!window.JCCatalogElement) {
    return;
  }

  var BasketButton = function (params) {
    BasketButton.superclass.constructor.apply(this, arguments);
    this.nameNode = BX.create('span', {
      props: { className: 'bx_medium bx_bt_button', id: this.id },
      style: typeof params.style === 'object' ? params.style : {},
      text: params.text,
    });
    this.buttonNode = BX.create('span', {
      attrs: { className: params.ownerClass },
      children: [this.nameNode],
      events: this.contextEvents,
    });
    if (BX.browser.IsIE()) {
      this.buttonNode.setAttribute('hideFocus', 'hidefocus');
    }
  };
  BX.extend(BasketButton, BX.PopupWindowButton);
})(window);

document.addEventListener('DOMContentLoaded', () => {
  // изначально другой текст в выборе цвета при загрузке
  // только на мобилках
  if (window.innerWidth <= 720) {
    const dropdownLink = document.querySelector('.ik_select_link_text');
    if (dropdownLink) {
      dropdownLink.textContent = 'ВЫБРАТЬ ЦВЕТ ОКРАШИВАНИЯ';
    }
  }

  // EDOST
  function initEdost() {
    const observer = new MutationObserver(() => {
      const linesWrappers = document.querySelectorAll('.edost_C2_preview_normal');

      linesWrappers.forEach((wrapper) => {
        const edostLines = wrapper.querySelectorAll('.edost_C2_line');
        const hiddenLines = [];

        for (let i = 4; i < edostLines.length; i++) {
          hiddenLines.push(edostLines[i]);
          edostLines[i].classList.add('d-none');
        }

        const expandButton = document.createElement('button');
        expandButton.textContent = 'Показать все варианты';
        expandButton.className = 'edost-expand-button';
        expandButton.addEventListener('click', () => {
          hiddenLines.forEach((line) => line.classList.remove('d-none'));
          expandButton.remove();
        });

        wrapper.appendChild(expandButton);
      });
    });

    observer.observe(document.querySelector('.edost_C2_preview_city'), {
      childList: true,
    });
  }

  initEdost();

  // color picker
  function formatRub(amountStr) {
    // Преобразуем строку в число
    const amount = Number(amountStr);

    // Форматируем число согласно русским стандартам (разделитель тысяч - пробел)
    const formattedNumber = amount.toLocaleString('ru-RU');

    // Возвращаем строку с символом рубля в конце
    return `${formattedNumber} ₽`;
  }

  function initColorPicker() {
    // Изначальные значения выбора
    const select = document.querySelector('select[name=type_pokraska]');

    // нет селекта;
    if (!select) {
      $('.color-row').hide();
      return;
    }

    const selectedOption = {
      color: 'Без окрашивания',
      price: '0',
    };

    // Функция обновления блока с информацией
    function updateSelectionInfo() {
      console.log(selectedOption, 'selectedOptions');
      document.querySelector('.color-picker-container .color_value').textContent = selectedOption?.color;
      document.querySelector('.color-picker-container .price_value').textContent = formatRub(selectedOption?.price);

      try {
        select.value = selectedOption.color;
        $("select[name='type_pokraska']").trigger('change');
      } catch {}

      // Обновляем блок под price_matrix_wrapper
      updatePriceMatrix();
    }

    // Новая функция для обновления информации под блоком price_matrix_wrapper
    function updatePriceMatrix() {
      let displayElement = document.querySelector('.price_matrix_display');
      let containerToInsert;

      // Определяем, мобильное устройство или ПК по ширине окна
      if (window.innerWidth <= 991) {
        // На мобильном: ищем контейнер, куда нужно вставить элемент с ценой под color-row
        containerToInsert = document.querySelector('.color-row');
      } else {
        // На ПК: вставляем элемент после .price_matrix_wrapper
        containerToInsert = document.querySelector('.left_block .product-main .price_matrix_wrapper');
      }

      if (!containerToInsert) {
        console.log('Не найден контейнер для вставки price_matrix_display');
        return;
      }

      // Если элемент для отображения цены еще не создан, создаем его
      if (!displayElement) {
        displayElement = document.createElement('div');
        displayElement.className = 'price_matrix_display';
        containerToInsert.insertAdjacentElement('afterend', displayElement);
      }

      console.log('тут вставляем под матрицу, displayElement', displayElement);

      // Обновляем содержимое блока
      displayElement.innerHTML = `
          <div style="display: flex; align-items: center; gap: 4px;">
            Доп. окрашивание: <span class="js-selected-color js-open-color-picker">${selectedOption.color}</span>
            <div class="explanation-element">
              <div class="icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x=".5" y=".5" width="15" height="15" rx="7.5" stroke="#E5E5E5"/><path d="M7.871 5.059q-.726 0-1.419.374l-.286-.792a3.9 3.9 0 0 1 1.837-.44q.628 0 1.023.176.407.165.65.429.24.264.33.594.098.32.098.616 0 .374-.143.671-.143.285-.352.539-.21.253-.462.484a5 5 0 0 0-.462.484q-.21.242-.352.539-.143.285-.143.649v.121q0 .066.011.121h-.858q-.045-.22-.044-.462 0-.352.121-.638.132-.286.33-.528.198-.254.418-.462.22-.22.418-.44t.32-.462q.13-.242.131-.528 0-.462-.297-.748-.297-.297-.869-.297m.693 6.347q0 .297-.198.517t-.539.22-.539-.22a.75.75 0 0 1-.198-.517q0-.297.198-.517t.54-.22q.34 0 .538.22a.75.75 0 0 1 .198.517" fill="#555"/></svg>
              </div>
              <div class="content">
                Выберите нужный цвет, если хотите заказать окрашивание мебели. 
                Если мебель нужна без покраски - оставьте вариант «Без окрашивания».
              </div>
            </div>
          </div>
          <p>Стоимость доп. окрашивания: ${formatRub(selectedOption.price)}</p>
        `;
    }

    // Обработчик изменения размера окна
    window.addEventListener('resize', () => {
      // Можно сначала удалить существующий блок price_matrix_display,
      // чтобы при следующем вызове updatePriceMatrix он воссоздался в нужном месте
      const displayElement = document.querySelector('.price_matrix_display');
      if (displayElement) {
        displayElement.parentNode.removeChild(displayElement);
      }
      // Пересоздаем элемент в соответствии с текущим разрешением
      updatePriceMatrix();
    });

    // при смене варианта товара обновляем эту штуку тоже
    $(document).on('click', '.cnt_item', function () {
      setTimeout(() => {
        updatePriceMatrix();
      }, 1000);
    });

    // Загрузка цветов из select
    console.log('select', select);

    const options = select.querySelectorAll('option');

    options.forEach((option, i) => {
      const dataImg = option.getAttribute('data-img');
      const dataPrice = option.getAttribute('data-price');
      const dataName = option.getAttribute('value');

      const item = document.createElement('div');
      item.className = 'color-picker-item';
      item.style.backgroundImage = `url(${dataImg})`;
      item.dataset.name = dataName;
      item.dataset.price = dataPrice;

      if (i === 0) {
        item.classList.add('active');
      }

      document.querySelector('.color-picker-grid').appendChild(item);
    });

    const openButtons = document.querySelectorAll('.js-open-color-picker');
    const modalContainer = document.querySelector('.color-picker-container');

    console.log('test');

    // Если контейнер не находится в body, переносим его туда
    if (modalContainer.parentNode !== document.body) {
      document.body.appendChild(modalContainer);
    }

    // Создаем и настраиваем overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    Object.assign(overlay.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'none',
      zIndex: '3000',
    });
    document.body.appendChild(overlay);

    // Функция открытия модального окна
    function openModal() {
      modalContainer.style.display = 'block';
      overlay.style.display = 'block';
    }

    // Функция закрытия модального окна
    function closeModal() {
      modalContainer.style.display = 'none';
      overlay.style.display = 'none';
    }

    // Обработчики событий для открытия/закрытия модального окна
    $(document).on('click', '.js-open-color-picker', openModal);
    overlay.addEventListener('click', closeModal);
    const buttons = modalContainer.querySelectorAll('.js-close-picker');
    buttons.forEach((button) => {
      button.addEventListener('click', closeModal);
    });

    // Обработчик клика по элементу выбора цвета
    const colorPickerItems = document.querySelectorAll('.color-picker-item');
    colorPickerItems.forEach((item) => {
      item.addEventListener('click', (e) => {
        // Снимаем активное состояние со всех элементов и устанавливаем для выбранного
        colorPickerItems.forEach((el) => el.classList.remove('active'));
        item.classList.add('active');

        // При выборе обновляем наблюдаемый объект
        selectedOption.color = item.getAttribute('data-name');
        selectedOption.price = item.getAttribute('data-price');
        updateSelectionInfo();
      });
    });

    // Обновим начальное отображение выбора
    updateSelectionInfo();
  }

  initColorPicker();

  // оборот в обёртку
  function wrapPricesBlock() {
    // Находим начальный и конечный элементы цен и тд
    const startElement = document.querySelector('.left_block .product-main .cost.prices.detail.prices_block');
    let endElement = document.querySelector('.js-services-in-side');
    if (!endElement) {
      endElement = document.querySelector('.left_block .product-main .char-side');
    }

    console.log(startElement, endElement);

    // Проверяем, найдены ли оба элемента
    if (startElement && endElement) {
      // Создаем новый div-обертку
      const wrapper = document.createElement('div');
      // Можно добавить класс для обертки, если нужно для стилизации или дальнейших манипуляций
      wrapper.className = 'prices-services-wrapper'; // Пример имени класса

      console.log('startElement', startElement);

      // Вставляем обертку перед начальным элементом

      startElement.parentNode.insertBefore(wrapper, startElement);

      // Перемещаем элементы внутрь обертки
      let currentElement = startElement;
      while (currentElement) {
        // Запоминаем следующий элемент перед перемещением текущего
        const nextElement = currentElement.nextElementSibling;

        // Перемещаем текущий элемент внутрь обертки
        wrapper.appendChild(currentElement);

        // Если текущий элемент - это конечный элемент, останавливаем цикл
        if (currentElement === endElement) {
          break;
        }

        // Переходим к следующему элементу
        currentElement = nextElement;
      }

      console.log('Элементы успешно обернуты.');
      console.log(wrapper);
    } else {
      // Выводим сообщение об ошибке, если один из элементов не найден
      if (!startElement) {
        console.error('Не найден начальный элемент с классами "cost prices detail prices_block".');
      }
      if (!endElement) {
        console.error('Не найден конечный элемент с классом "js-services-in-side".');
      }
    }
  }

  wrapPricesBlock();

  // Сохраняем исходное местоположение элемента .info-column

  const infoColumn = document.querySelector('.info-column');
  const priceMatrixWrapper = document.querySelector('.cost.prices .price_matrix_wrapper');

  if (!infoColumn || !priceMatrixWrapper) {
    console.log('Не найден один из необходимых элементов: .info-column или .price_matrix_wrapper. Скрипт не будет работать.');
    console.log(infoColumn, priceMatrixWrapper);
  }

  // --- Ключевое исправление ---
  // Сохраняем исходного родителя и следующего соседа ОДИН РАЗ ЗДЕСЬ,
  // до того, как элемент мог быть перемещен.
  const originalParent = infoColumn.parentNode;
  const originalNextSibling = infoColumn.nextSibling;
  // --------------------------

  // Создаем объект MediaQueryList для отслеживания ширины экрана
  const media = window.matchMedia('(max-width: 991px)');

  // Функция для перемещения элемента
  function moveInfoColumnBasedOnScreen() {
    // Еще раз убедимся, что элементы на месте (на случай динамических изменений DOM)
    if (!infoColumn || !priceMatrixWrapper || !originalParent) {
      console.log('чего то не хватает close');
      console.log(infoColumn, priceMatrixWrapper, originalParent);
      return;
    }

    console.log('тут infocl');

    if (media.matches) {
      // Экран меньше или равен 991px:
      // Перемещаем info-column так, чтобы он оказался сразу ПОСЛЕ priceMatrixWrapper.
      // Используем insertAdjacentElement для большей ясности и точности позиционирования.
      priceMatrixWrapper.insertAdjacentElement('afterend', infoColumn);
    } else {
      // Экран больше 991px:
      // Возвращаем info-column на его ИСХОДНОЕ место,
      // используя сохраненные originalParent и originalNextSibling.
      originalParent.insertBefore(infoColumn, originalNextSibling);
    }
  }

  // Добавляем слушатель события изменения размера окна
  // При изменении размера будет вызываться наша функция
  window.addEventListener('resize', moveInfoColumnBasedOnScreen);

  // Вызываем функцию один раз при загрузке страницы,
  // чтобы установить правильное начальное положение элемента
  moveInfoColumnBasedOnScreen();

  function cloneCharacteristics() {
    const characteristicsWrapper = document.querySelector('.characteristics-wrapper');
    const adaptiveBlock = document.querySelector('.adaptive-block');

    console.log('Клонирование characteristics', characteristicsWrapper, adaptiveBlock);

    if (!characteristicsWrapper || !adaptiveBlock) {
      return;
    }

    // Создаём глубокую копию узла (true означает, что копируются все вложенные элементы)
    const clone = characteristicsWrapper.cloneNode(true);

    // Получаем список дочерних элементов adaptiveBlock
    const children = adaptiveBlock.children;

    // Если в adaptiveBlock есть хотя бы один дочерний элемент, вставляем перед последним.
    // Если нет, просто добавляем в конец.
    if (children.length > 0) {
      // Вставляем clone перед последним элементом
      adaptiveBlock.insertBefore(clone, children[children.length - 1]);
    } else {
      adaptiveBlock.appendChild(clone);
    }
  }

  // Вызываем функцию при загрузке страницы и при изменении размера окна
  cloneCharacteristics();

  function addInstalmentsInfo() {
    // Находим родительский элемент по комбинированному селектору
    var parent = document.querySelector('.wrapp-one-click');

    if (parent) {
      // HTML-разметка, которую требуется добавить
      var html = `
        <div class="instalments-buy"> 
          Доступна рассрочка от партнера  
          <div class="explanation-element">
            <div class="icon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x=".5" y=".5" width="15" height="15" rx="7.5" stroke="#E5E5E5"/><path d="M7.871 5.059q-.726 0-1.419.374l-.286-.792a3.9 3.9 0 0 1 1.837-.44q.628 0 1.023.176.407.165.65.429.24.264.33.594.098.32.098.616 0 .374-.143.671-.143.285-.352.539-.21.253-.462.484a5 5 0 0 0-.462.484q-.21.242-.352.539-.143.285-.143.649v.121q0 .066.011.121h-.858q-.045-.22-.044-.462 0-.352.121-.638.132-.286.33-.528.198-.254.418-.462.22-.22.418-.44t.32-.462q.13-.242.131-.528 0-.462-.297-.748-.297-.297-.869-.297m.693 6.347q0 .297-.198.517t-.539.22-.539-.22a.75.75 0 0 1-.198-.517q0-.297.198-.517t.54-.22q.34 0 .538.22a.75.75 0 0 1 .198.517" fill="#555"/></svg>
            </div>
            <div class="content">
              Добавьте все интересующие вас товары в корзину и при оформлении заказа выберите способ оплаты «Рассрочка на 6 мес.» Заполните онлайн заявку банка и дождитесь ответа.
            </div>
          </div>
        </div>
      `;

      // Добавляем HTML-блок в конец родительского элемента
      parent.insertAdjacentHTML('beforeend', html);
    } else {
      console.error('Элемент с классами "js-prices-in-side wrapp-one-click" не найден.');
    }
  }

  // Вызов функции для добавления элемента
  addInstalmentsInfo();

  function jsOpenCallUsPopup() {
    // Находим элементы попапа, кнопки открытия (несколько) и кнопку закрытия
    const openBtns = document.querySelectorAll('.js-open-call-us-popup');
    let popup = document.querySelector('.call-us-popup');
    const closeBtn = document.querySelector('.js-close-call');

    console.log('WORKED blabla1');

    // Если попап не находится в body, перемещаем его туда
    if (popup.parentElement !== document.body) {
      document.body.appendChild(popup);
      console.log('popup перемещен в body');
    }

    // Создаем элемент-оверлей
    const overlay1 = document.createElement('div');
    overlay1.className = 'popup-overlay';
    overlay1.style.position = 'fixed';
    overlay1.style.top = 0;
    overlay1.style.left = 0;
    overlay1.style.width = '100%';
    overlay1.style.height = '100%';
    overlay1.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay1.style.display = 'none';
    overlay1.style.zIndex = 999; // ниже, чем у попапа
    document.body.appendChild(overlay1);

    console.log('WORKED blabla2');

    // Функция для открытия попапа
    function openPopup() {
      console.log('open popup');
      // При каждом открытии убеждаемся, что попап находится в body
      if (popup.parentElement !== document.body) {
        document.body.appendChild(popup);
        console.log('popup перемещен в body при открытии');
      }
      overlay1.style.display = 'block';
      popup.style.display = 'block';
      popup.style.position = 'fixed';
      popup.style.top = '50%';
      popup.style.left = '50%';
      popup.style.transform = 'translate(-50%, -50%)';
      popup.style.zIndex = 1000; // выше, чем у оверлея
    }

    // Функция для закрытия попапа
    function closePopup() {
      overlay1.style.display = 'none';
      popup.style.display = 'none';
    }

    // Обработчик клика на каждую кнопку открытия
    console.log('openBtns', openBtns);
    openBtns.forEach((btn) => {
      btn.addEventListener('click', openPopup);
    });

    // Обработчики клика на кнопку закрытия и на оверлей
    closeBtn.addEventListener('click', closePopup);
    overlay1.addEventListener('click', closePopup);

    console.log('worked blabla3');
  }

  jsOpenCallUsPopup();
});

// ------------- JavaScript -------------
console.log('test');
document.addEventListener('DOMContentLoaded', () => {
  (function () {
    console.log('сработало');
    const leftBlock = document.querySelector('.left_block');
    const tabs = document.querySelector('.tabs.arrow_scroll');
    const container = leftBlock.parentElement;
    const mql = window.matchMedia('(min-width: 991px)');

    function updatePosition() {
      // Если ширина меньше 991px — сбрасываем стили
      if (!mql.matches) {
        leftBlock.style.position = '';
        leftBlock.style.top = '';
        return;
      }

      const scrollY = window.pageYOffset;
      // Абсолютная позиция начала .tabs относительно документа
      const triggerY = tabs.getBoundingClientRect().top + scrollY;
      // Абсолютная позиция начала контейнера
      const containerY = container.getBoundingClientRect().top + scrollY;

      if (scrollY + 20 >= triggerY) {
        // За триггером — абсолютная фиксация внутри контейнера
        leftBlock.style.position = 'absolute';
        // Сдвигаем от верхушки контейнера так, чтобы блок оказался ровно у триггера
        leftBlock.style.top = triggerY - containerY + 'px';
        leftBlock.style.right = '0';
      } else {
        // До триггера — остаёмся «липкими»
        leftBlock.style.right = '';
        leftBlock.style.position = 'sticky';
        leftBlock.style.top = '20px';
      }
    }

    // Навешиваем обработчики
    window.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);
    // Инициализировать сразу
    updatePosition();
  })();
});

/**
 * Корректирует позицию элемента (попапа), чтобы он не выходил за пределы видимой области окна (viewport).
 * Работает с горизонтальным позиционированием (left/right).
 *
 * @param {HTMLElement} element - Элемент, позицию которого нужно скорректировать.
 * @param {number} [gap=5] - Минимальный отступ от краев видимой области (в пикселях).
 */
function adjustPopupPosition(element, gap = 5) {
  console.log('Adjusting popup position for:', element);
  if (!element) {
    console.warn('adjustPopupPosition: Element not provided.');
    return; // Если элемента нет, выходим
  }

  // Получаем размеры и позицию элемента относительно видимой области (viewport)
  const rect = element.getBoundingClientRect();

  // Если элемент не виден (например, display: none), его размеры будут 0.
  // В этом случае корректировка не имеет смысла или может привести к ошибкам.
  if (rect.width === 0 || rect.height === 0) {
    console.warn('adjustPopupPosition: Element has zero dimensions, possibly hidden. Skipping adjustment.');
    return;
  }

  // Находим ближайшего позиционированного предка (offsetParent)
  const offsetParent = element.offsetParent || document.body;
  const parentRect = offsetParent.getBoundingClientRect();

  // Используем clientWidth/clientHeight, чтобы исключить полосы прокрутки
  const viewportWidth = document.documentElement.clientWidth;
  // const viewportHeight = document.documentElement.clientHeight; // Если нужна вертикальная корректировка

  // Проверяем, не шире ли сам элемент, чем видимая область
  if (rect.width > viewportWidth - 2 * gap) {
    console.warn(
      `adjustPopupPosition: Element (${rect.width}px) is wider than available viewport width (${
        viewportWidth - 2 * gap
      }px). Positioning might be imperfect.`
    );
    // В этом случае просто выравниваем по левому краю с отступом
    element.style.left = `${gap - parentRect.left}px`;
    element.style.right = 'auto';
    console.log(`Applied wide element style.left: ${element.style.left}`);
    return; // Дальнейшая корректировка не нужна или невозможна
  }

  // --- Горизонтальная Корректировка ---

  let currentVisualLeft = rect.left; // Текущая ВИЗУАЛЬНАЯ позиция левого края
  let needsAdjustment = false;
  let targetVisualLeft = currentVisualLeft; // Целевая ВИЗУАЛЬНАЯ позиция левого края

  // Проверяем, вылезает ли элемент СЛЕВА (с учетом отступа)
  if (currentVisualLeft < gap) {
    targetVisualLeft = gap; // Целевая позиция левого края = отступ от края вьюпорта
    needsAdjustment = true;
    console.log(`Popup adjusting: Too far left. Target visual left: ${targetVisualLeft}`);
  }
  // Проверяем, вылезает ли элемент СПРАВА (с учетом отступа)
  // rect.right = currentVisualLeft + rect.width
  else if (currentVisualLeft + rect.width > viewportWidth - gap) {
    // Целевая позиция ПРАВОГО края = viewportWidth - gap
    // Значит, целевая позиция ЛЕВОГО края = (viewportWidth - gap) - rect.width
    targetVisualLeft = viewportWidth - gap - rect.width;
    needsAdjustment = true;
    console.log(
      `Popup adjusting: Too far right. Target visual right edge: ${viewportWidth - gap}. Target visual left: ${targetVisualLeft}`
    );
  }

  // Применяем вычисленные стили, только если была необходимость
  if (needsAdjustment) {
    // Вычисляем CSS 'left' относительно offsetParent:
    // style.left = target_visual_left - parent_visual_left
    const targetStyleLeft = targetVisualLeft - parentRect.left;

    element.style.left = `${targetStyleLeft}px`;
    element.style.right = 'auto'; // Сбрасываем 'right', чтобы он не мешал 'left'
    console.log(`Applied style.left: ${element.style.left}`);
  } else {
    console.log('Popup position requires no horizontal adjustment.');
  }
}

const triggerElement = document.getElementById('hover-trigger');
const popup = document.querySelector('.explanation-element');

$(document).on('mouseover', '.explanation-element', function () {
  const popup = this.querySelector('.content');
  adjustPopupPosition(popup);
});
