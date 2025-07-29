/*
 * ===============================================================
 * ------------ Кастомная маска ввода Номера телефона ------------
 * ===============================================================
 */
const initCustomPhoneMask = (phoneFieldForMask) => {
  // ---------- КОНСТАНТЫ -----------
  const REG_EXP_FOR_LETTERS = /\D/g;
  const EMPTY_STRING = '';
  const FIRST_ARRAY_ELEMENT = 0;

  /*
   * ==========================================
   * ------ ОСНОВНАЯ ЛОГИКА РАБОТЫ Ф-ЦИИ ------
   * ==========================================
   */

  // *** Утилитарная ф-ция для получения Чисел из строки ***
  const getInputNumbersValue = (currentInput) => {
    return currentInput.value.replace(REG_EXP_FOR_LETTERS, '');
  };

  // *** Ф-ция для обработки события Ввода в поле Номера телефона ***
  const onPhoneInput = function (evt) {
    const input = evt.target;
    let inputNumbersValue = getInputNumbersValue(input);
    let formattedInputValue = EMPTY_STRING;

    /*
     * --- Проверка на вводимые символы:
     * ---
     * --- Если НЕ число — значением поля
     * --- вернётся пустая строка.
     */
    if (!inputNumbersValue) {
      return (input.value = EMPTY_STRING);
    }

    // --- Переменные для улучшения читабельности кода ---
    const firstInputNumberSymbol = inputNumbersValue[FIRST_ARRAY_ELEMENT];
    const validSymbolsArray = ['7', '8'];
    const isFirstSymbolValid =
      validSymbolsArray.indexOf(firstInputNumberSymbol) > -1;

    // --- Основные условия валидации ---
    if (isFirstSymbolValid) {
      if (firstInputNumberSymbol == '9') {
        inputNumbersValue = '7' + inputNumbersValue;
      }

      formattedInputValue = '+7 ';

      if (inputNumbersValue.length > 1) {
        formattedInputValue += '(' + inputNumbersValue.substring(1, 4);
      }

      if (inputNumbersValue.length > 4) {
        formattedInputValue += ') ' + inputNumbersValue.substring(4, 7);
      }

      if (inputNumbersValue.length >= 8) {
        formattedInputValue += '-' + inputNumbersValue.substring(7, 9);
      }

      if (inputNumbersValue.length >= 10) {
        formattedInputValue += '-' + inputNumbersValue.substring(9, 11);
      }
    } else {
      formattedInputValue = '+7' + inputNumbersValue.substring(0, 16);
    }

    // --- Вставка отформатированного валидного значения в Поле---
    input.value = formattedInputValue;
  };

  // === Добавление обработчиков событий ===
  phoneFieldForMask.addEventListener('input', onPhoneInput, false);
};

$(document).on('click', '.shop-cat__item .view', (event) => {
  event.stopPropagation();
  const elem = event.target;
  const controls = elem.parentElement.querySelector('.count');

  elem.classList.add('hidden');
  controls.classList.add('active');
  controls.dataset.count = 1;
});

$(document).on('click', '.shop-cat__item a.mns', async (event) => {
  event.stopPropagation();
  const elem = event.target;
  const controls = elem.parentElement;
  controls.style.pointerEvents = 'none';
  const input = controls.querySelector('input');
  const cart = controls.parentElement.querySelector('.view');

  const value = input.value;
  const id = controls.dataset.id;
  const formData = new FormData();
  formData.append('ajax_basket', 'Y');
  formData.append('quantity', 1);
  try {
    const resp = await fetch(`./?action=CART_TOVAR_MINUS&id=${id}`, {
      method: 'POST',
      body: formData,
    });
    console.log(await resp.json());
  } catch (e) {
    console.log('error when try to catch in cart minus');
  }

  changeTotalCartAmount(-1);

  if (Number(controls.dataset.count) === 1) {
    cart.classList.remove('hidden');
    controls.classList.remove('active');
  }

  if (controls.dataset.count) {
    controls.dataset.count = Number(controls.dataset.count) - 1;
  } else {
    controls.dataset.count = value;
  }
  controls.style.pointerEvents = 'unset';
});

$(document).on('click', '.shop-cat__item a.pls', async (event) => {
  event.stopPropagation();
  const elem = event.target;
  const controls = elem.parentElement;
  controls.style.pointerEvents = 'none';
  const input = controls.querySelector('input');

  const value = input.value;
  const id = controls.dataset.id;
  const formData = new FormData();
  formData.append('ajax_basket', 'Y');
  formData.append('quantity', 1);
  const resp = await fetch(`./?action=ADD2BASKET&id=${id}`, {
    method: 'POST',
    body: formData,
  });

  console.log(await resp.json());

  changeTotalCartAmount(1);
  controls.dataset.count = Number(controls.dataset.count) + 1;
  controls.style.pointerEvents = 'unset';
});

function changeTotalCartAmount(add, force = false) {
  const cartBadge = document.querySelector('.header-cart__total');
  const cartMobileBadge = document.querySelector('.footer-cart__total');

  if (force) {
    const newValue = Number(add);
    if (newValue >= 0) {
      cartBadge.textContent = newValue;
      cartMobileBadge.textContent = newValue;
    }
    return;
  }

  const newValue = Number(cartBadge.textContent) + Number(add);
  if (newValue >= 0) {
    cartBadge.textContent = newValue;
    cartMobileBadge.textContent = newValue;
  }
}

$(document).on('blur', '.count input[name="quantity"]', async function (event) {
  const elem = event.target;
  const controls = elem.parentElement;
  controls.style.pointerEvents = 'none';
  const input = controls.querySelector('input');

  const value = input.value;
  const id = controls.dataset.id;
  const formData = new FormData();
  formData.append('ajax_basket', 'Y');
  formData.append('quantity', value);
  const resp = await fetch(`./?action=NEW2BASKET&id=${id}`, {
    method: 'POST',
    body: formData,
  }).then((res) => res.json());

  const amount = resp.tot_quant;

  console.log(resp);

  changeTotalCartAmount(amount, true);
  controls.dataset.count = Number(value);
  controls.style.pointerEvents = 'unset';
});

$(document).on(
  'keypress',
  '.count input[name="quantity"]',
  async function (event) {
    if (event.key === 'Enter') {
      const elem = event.target;
      const controls = elem.parentElement;
      controls.style.pointerEvents = 'none';
      const input = controls.querySelector('input');

      const value = input.value;
      const id = controls.dataset.id;
      const formData = new FormData();
      formData.append('ajax_basket', 'Y');
      formData.append('quantity', value);
      const resp = await fetch(`./?action=NEW2BASKET&id=${id}`, {
        method: 'POST',
        body: formData,
      }).then((res) => res.json());

      const amount = resp.tot_quant;

      console.log(resp);

      changeTotalCartAmount(amount, true);
      controls.dataset.count = Number(value);
      controls.style.pointerEvents = 'unset';

      elem.blur();
    }
  }
);

let isShopCatChanged = false;

$(document).on('click', '.shop-cat__item', async (event) => {
  const elem = event.currentTarget;

  await setTradeOfferToButtonDatasetId(elem);

  isShopCatChanged = false;
});

async function setTradeOfferToButtonDatasetId(elem) {
  if (isShopCatChanged) {
    const data = [];
    const options = elem.querySelectorAll('.product-item-scu-block');

    url = `?product_id=${elem.dataset.element_id}`;

    options.forEach((option) => {
      const selected = option.querySelector(
        '.product-item-scu-item-text-container.selected'
      );
      url += `&${option.dataset.code}=${selected.dataset.id}`;
    });

    const resp = await fetch(`/ajax/get_offer_id.php${url}`).then((res) =>
      res.json()
    );
    const tradeOffer = resp.OFFER_ID;

    const cart = elem.querySelector('.view');
    const controls = elem.querySelector('.count');
    const input = controls.querySelector('input');

    controls.dataset.id = tradeOffer;
    const cartId = cart.id.split('_');
    cartId[2] = tradeOffer;
    cart.id = cartId.join('_');

    controls.dataset.count = Math.floor(resp.BASKET_COUNT);
    if (resp.BASKET_COUNT === 0) {
      cart.classList.remove('hidden');
      controls.classList.remove('active');
      input.value = 1;
    } else {
      cart.classList.add('hidden');
      controls.classList.add('active');
      input.value = Math.floor(resp.BASKET_COUNT);
    }
  }
}

$(document).on(
  'click',
  '.product-item-scu-item-text-container',
  async (event) => {
    const elem = event.currentTarget;
    if (elem.dataset.koef) {
      sizeValue = elem.title;
    } else {
      colorValue = elem.dataset.treevalue;
    }
    BX.delegate();
    isShopCatChanged = true;
  }
);

$(document).ready(function () {
  var $footer_container = $('.footer .container');
  var $footer = $('.footer');
  let footer_show_counter = 0;

  if ($(window).width() < 768) {
    $footer.show();
    footer_show_counter = 1;
    console.log('hide show auto');
  }

  /*
  if ($(window).width() > 767){
    $footer.hide();
    console.log('hide footer on PC');
  }
*/
  $(window).scroll(function () {
    var scroll = $(window).scrollTop() + $(window).height();
    //Если скролл до конца елемента
    //var offset = $element.offset().top + $element.height();
    //Если скролл до начала елемента
    var offset = $('html')[0].offsetHeight;
    //		console.log($('html'));
    //		console.log(scroll+' > '+offset);
    if (scroll >= offset && footer_show_counter == 0) {
      $footer.show();
      footer_show_counter = 1;
    }
  });

  $('.about-us').find('table').wrapAll('<div class="table_wrap">');

  $('.show_more').click(function () {
    var button = $(this);
    var totp = $(this).data('totalp');
    var thisp = $(this).data('thisp');
    var folder = $(this).data('folder');
    nextp = thisp + 1;
    var iblock = $(this).data('iblock_id');
    var navnum = $(this).data('navnum');
    var limit = $(this).data('limit');
    if (nextp <= totp) {
      $(this).data('thisp', nextp);
      if (navnum) {
        var url = new URL(location).search;
        if (!url) var url = '?';
        console.log(url);
        $.get(
          folder +
            '' +
            url +
            '&AJAX=Y&PAGEN_' +
            navnum +
            '=' +
            nextp +
            '&navnum=' +
            navnum +
            '&limit=' +
            limit,
          function (data) {
            var res = data.split('<!--SPLIT-->');
            console.log(res);
            button.parent().parent().parent().find('.load_here').append(res[0]);
            button
              .parent()
              .parent()
              .parent()
              .find('.pagination_update_block')
              .html(res[2]);
          }
        );
      } else {
        $.get(folder + '?AJAX=Y&p=' + nextp, function (data) {
          button.parent().parent().parent().find('.load_here').append(data);
        });
      }
      if (thisp === totp - 1) {
        //				console.log(thisp);
        button.addClass('inactive');
      }
    }
  });

  $('.footer_btn').on('click', function () {
    if ($(this).hasClass('hide')) {
      $('.footer_btn').html('Скрыть информацию');
    } else {
      $('.footer_btn').html('Показать информацию');
    }
    $(this).toggleClass('hide');
  });
  $('.mobile-search-call').on('click', function () {
    $('.header__search .form--search').addClass('active');
    $('.header__search .form--search input').focus();
  });
  $('.mobile-search-hide').on('click', function () {
    $('.header__search .form--search').removeClass('active');
    $('.js-search-result').slideUp();
  });
  $(".phone-mask , [autocomplete='tel']").each(function () {
    initCustomPhoneMask(this);
  });

  $('.anchor-link').click(function (e) {
    e.preventDefault();
    var hash = this.hash;
    $('html, body').animate(
      {
        scrollTop: $(hash).offset().top,
      },
      1000,
      function () {
        window.location.hash = hash;
      }
    );
  });
  $('.form_email').inputmask({
    mask: '*{1,20}[.*{1,20}][.*{1,20}][.*{1,20}]@*{1,20}[.*{2,6}][.*{1,2}]',
    greedy: false,
    onBeforePaste: function (pastedValue, opts) {
      pastedValue = pastedValue.toLowerCase();
      return pastedValue.replace('mailto:', '');
    },
    definitions: {
      '*': {
        validator: "[0-9A-Za-z!#$%&'*+/=?^_`{|}~-]",
        casing: 'lower',
      },
    },
  });
  tippy('.tooltip-trigger', {
    delay: 100,
    arrow: true,
    arrowType: 'sharp',
    size: 'small',
    duration: 300,
    animation: 'fade',
    theme: 'plmx',
  });

  tippy('.tooltip-right-trigger', {
    delay: 100,
    arrow: true,
    arrowType: 'sharp',
    placement: 'right',
    size: 'small',
    duration: 300,
    animation: 'fade',
    theme: 'plmx-right',
  });
  $('.image-mfp').magnificPopup({
    type: 'image',
    gallery: {
      enabled: true,
    },
  });
  var mobileNav = $('#main-menu-mobile');
  if ($(window).width() < 768) {
    $('#main-menu-mobile > .has-sub > a').on('click', function (e) {
      e.preventDefault();
    });
    $('#main-menu-mobile > .has-sub').on('click', function () {
      var selected = $(this),
        selectedSubMenu = selected.find('.sub');
      if (mobileNav.hasClass('lvl-2')) {
        /*selectedSubMenu.toggleClass('lvl-active');
        mobileNav.removeClass('lvl-2').toggleClass('lvl-3');*/
      } else {
        $('#mobile-menu-back').toggleClass('active');
        mobileNav.toggleClass('lvl-2');
        selectedSubMenu.toggleClass('lvl-active');
      }
    });
  }
  $('#mobile-menu-back').on('click', function (e) {
    e.preventDefault();
    mobileNav.removeClass('lvl-2');
    $('#mobile-menu-back').removeClass('active');
    setTimeout(function () {
      mobileNav.find('.sub').removeClass('lvl-active');
      /*itemProps.css({
        display: "flex"
      });*/
      /*itemProps.stop().slideDown({
       start: function () {
       }
       });*/
    }, 200);
  });

  $('.category-item')
    .on('mouseenter', function () {
      var selected = $(this),
        itemProps = selected.find('.category-item__props');
      selected.addClass('active');
      setTimeout(function () {
        itemProps.css({
          display: 'flex',
        });
        /*itemProps.stop().slideDown({
          start: function () {
          }
        });*/
      }, 200);
    })
    .on('mouseleave', function () {
      var selected = $(this),
        itemProps = selected.find('.category-item__props');
      selected.removeClass('active');
      setTimeout(function () {
        itemProps.css({
          display: 'none',
        });
      }, 300);
    });
  if ($(document).width() < 768) {
    $('.addres_list > div > .row').owlCarousel({
      loop: true,
      items: 1,
      nav: true,
      autoplay: true,
      autoplayTimeout: 5000,
      autoplayHoverPause: true,
    });
  }
  /*  $(".home-cats__carousel").owlCarousel({
    loop:false,
    nav:true,
    items:1
  });*/
  $('.home-sale__carousel:not(.main) .home-sale__item-wrap').owlCarousel({
    loop: false,
    items: 4,
    nav: false,
    dots: false,
    // autoplay: true,
    lazyLoad: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    responsive: {
      0: {
        items: 2,
        autoWidth: true,
      },
      480: {
        items: 3,
        autoWidth: false,
      },
      600: {
        items: 3,
      },
      900: {
        items: 5,
      },
      1200: {
        items: 6,
      },
    },
  });
  $('.home-sale__carousel.main .home-sale__item-wrap').owlCarousel({
    loop: false,
    items: 4,
    nav: false,
    lazyLoad: true,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    responsive: {
      0: {
        items: 2,
      },
      600: {
        items: 3,
      },
      900: {
        items: 4,
      },
      1600: {
        items: 4,
      },
    },
  });
  $('.home-offers__carousel').owlCarousel({
    loop: true,
    items: 4,
    nav: false,
    lazyLoad: true,
    margin: 10,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    responsive: {
      0: {
        items: 2,
      },
      600: {
        items: 3,
      },
      900: {
        items: 4,
      },
      1600: {
        items: 4,
      },
    },
  });
  $('.home-poly-select__carousel').owlCarousel({
    loop: false,
    items: 1,
    nav: true,
  });
  $('.our-work__carousel').owlCarousel({
    loop: false,
    items: 1,
    nav: true,
  });
  $('a.filter__hide').click(function (e) {
    e.preventDefault();
    filter_hide();
  });
  $('.popup_filter .modal__close').click(function (e) {
    e.preventDefault();
    filter_hide();
  });
  function filter_hide() {
    var filterViewTrigger = $('.filter__hide');
    if (filterViewTrigger.is('.active')) {
      filterViewTrigger.text('Открыть фильтр');
      filterViewTrigger.removeClass('active');
      $('.filter_overlay').removeClass('active');
      $('.popup_filter').removeClass('active');
      $('body').attr('style', '');
      //	  $('.filter__wrap').stop().slideUp(500);
    } else {
      filterViewTrigger.addClass('active');
      /*$('body').attr('style','overflow:hidden');*/
      $('body').attr('style', 'overflow:hidden;');
      $('.filter_overlay').addClass('active');
      $('.popup_filter').addClass('active');
      //	  $('.filter__wrap').stop().slideDown(500);
      //	  $('.filter__wrap').stop().slideDown(500);
    }
  }

  var timeout,
    menuSubs = $('#horizontal-multilevel-menu li.has-sub');
  menuSubs
    .mouseenter(function () {
      clearTimeout(timeout);
      var selectedLi = $(this),
        subMenu = selectedLi.find('.sub');
      subMenu.addClass('active');
    })
    .mouseleave(function () {
      var selectedLi = $(this),
        subMenu = selectedLi.find('.sub');
      timeout = setTimeout(function () {
        subMenu.removeClass('active');
      }, 120);
    });
  /*	  $(document).ready(function() {
    $('select.pd').prettyDropdown({
      selectedMarker:'',
      classic:true
    });
  });*/
  /*  $('#tabs-nav-dropdown').on('change', function(){
    var dataTab = $('.prettydropdown ul').find('li.selected').attr('data-value');
    plmxTabsNavTrigger.removeClass('active');
    plmxTabsItems.find('.tabs__item').removeClass('active');
    plmxTabsItems.find('.tabs__item[data-tab="' + dataTab + '"]').addClass('active');
  });
*/
  var calcTrigger = {
    calcSwitcher: $('.poly-calc__trigger input').click(function () {
      if ($(this).is(':checked')) {
        calcTrigger.calcContent.stop().slideDown(300);
      } else {
        calcTrigger.calcContent.stop().slideUp(300);
      }
    }),
    calcContent: $('.poly-calc__hidden'),
  };

  /****
   *
   * ==================================================================
   * ------------------ Логика работы Мобильного меню -----------------
   * ==================================================================
   *
   ****/
  window.mobileMenu = (() => {
    const body = document.querySelector('body');
    const burger = body.querySelector('.header__burger');
    const navMenu = body.querySelector('.header__nav--mobile');

    if (!burger || !navMenu) {
      return;
    }

    const navMenuList = navMenu.querySelector('.nav-menu-list');
    const listItemLinks = navMenu.querySelectorAll('.list-item-link');

    /*
     * =======================================================================
     * --------------------------- ОСНОВНАЯ ЛОГИКА ---------------------------
     * =======================================================================
     */

    // --- Пересчёт дефолтных единиц Высоты вьюпорта на кастомные (хак для Safati Mobile) ---
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    // *** Утилитарные методы ***
    const Util = {
      // --- Метод для скрытия всех списков с классом '.list-is-loaded' ---
      hideAllLoadedLists: () => {
        const allLoadedLists = document.querySelectorAll('.list-is-loaded');
        if (allLoadedLists.length !== 0) {
          Array.from(allLoadedLists).forEach((element) => {
            element.classList.remove('list-is-loaded');
          });
        }
      },

      // --- Метод для "открутки" элемента к его начальному положению скролла ---
      scrollToInitialPosition: (element) => {
        element?.scrollTo(0, 0);
      },
    };

    // *** Методы работы Навигационного меню ***
    const NavMenuMethod = {
      // --- ОТКРЫТЬ меню ---
      open: () => {
        if (!$(burger).hasClass('loaded')) {
          $('#mobile_menu_load_here').load(
            '/local/templates/polymax_copy/generate_mobile_menu.php',
            function () {
              const listItemLinks = document.querySelectorAll(
                '#mobile_menu_load_here .list-item-link'
              );
              const navMenuList = document.querySelector(
                '#mobile_menu_load_here .nav-menu-list'
              );
              //					console.log(listItemLinks);
              for (let listItemlink of listItemLinks) {
                listItemlink.addEventListener('click', SublistMethod.open);
              }
            }
          );
          $(burger).addClass('loaded');
        }

        burger.classList.add('active');
        navMenu.classList.add('active');
        Util.scrollToInitialPosition(navMenu);
        body.classList.add('body-scroll-locked');
        $('.header').addClass('is-nav-open');
      },

      // --- ЗАКРЫТЬ меню ---
      close: () => {
        burger.classList.remove('active');
        navMenu.classList.remove('active');
        Util.hideAllLoadedLists();
        body.classList.remove('body-scroll-locked');
        $('.header').removeClass('is-nav-open');
      },
    };

    // *** Методы работы Саб-списков ***
    const SublistMethod = {
      // --- ОТКРЫТЬ Саб-список ---
      open: (evt) => {
        evt.stopPropagation();
        const currentLinkParent = evt.currentTarget.parentElement;
        const currentSublist = currentLinkParent.querySelector(
          '.js-navigation-list'
        );
        const currentHandler =
          currentLinkParent.querySelector('.list-item-link');

        if (currentSublist) {
          Util.scrollToInitialPosition(currentSublist);
          currentHandler.classList.toggle('active');
          currentSublist.classList.toggle('list-is-loaded');
        }
      },

      // --- ЗАКРЫТЬ Саб-список ---
      backToPrevious: (evt) => {
        evt.preventDefault();

        const allLoadedSublists = document.querySelectorAll('.list-is-loaded');
        const lastLoadedSublist = Array.from(allLoadedSublists).pop();
        const navMenuList = document.querySelector(
          '#mobile_menu_load_here .nav-menu-list'
        );

        if (lastLoadedSublist) {
          const lastLoadedSublistListParent = lastLoadedSublist.parentElement;
          const previousSublist = lastLoadedSublistListParent.parentElement;

          lastLoadedSublist.classList.remove('list-is-loaded');
          Util.scrollToInitialPosition(previousSublist);

          if (previousSublist !== navMenuList) {
            previousSublist.classList.add('list-is-loaded');
          } else {
            burger.classList.remove('arrow_back');
          }
        }
      },
    };

    // *** Ф-ция для обработки события клика по Бургеру ***
    const onBurgerClick = (evt) => {
      evt.preventDefault();
      evt.stopPropagation();

      const isBackToPreviousList = burger.classList.contains('arrow_back');
      const isCloseNavMenu = burger.classList.contains('active');

      switch (true) {
        case isBackToPreviousList:
          SublistMethod.backToPrevious(evt);
          //			toggleWindowScroll(1);
          break;

        case isCloseNavMenu:
          NavMenuMethod.close();
          toggleWindowScroll(1);
          break;

        default:
          NavMenuMethod.open();
          toggleWindowScroll(0);
      }
    };

    function toggleWindowScroll(state) {
      document.querySelector('html').style.overflowY = state
        ? 'auto'
        : 'hidden';
    }

    // === Добавление обработчиков событий ===
    burger.addEventListener('click', onBurgerClick);

    for (let listItemlink of listItemLinks) {
      listItemlink.addEventListener('click', SublistMethod.open);
    }

    // --- Обработчик события ресайза экрана по высоте ---
    window.addEventListener('resize', () => {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
  })();

  if ($('#switch-catalog-view').length) {
    var tileView = $('#switch-tile'),
      listView = $('#switch-line');
    tileView.click(function () {
      event.preventDefault();
      setCookie('BX_VIEW', 'TILE', 1);
      location.reload(true);
    });
    listView.click(function () {
      event.preventDefault();
      setCookie('BX_VIEW', 'LINE', 1);
      location.reload(true);
    });
  }
  var plmxTabs = $('.tabs'),
    plmxTabsNavTrigger = plmxTabs.find('.tabs__nav li'),
    plmxTabsItems = plmxTabs.find('.tabs__items');
  plmxTabsNavTrigger.click(function (e) {
    console.log('clicked');
    e.preventDefault();
    var dataTab = $(this).attr('data-tab');
    plmxTabsNavTrigger.removeClass('active');
    $(this).addClass('active');
    plmxTabsItems.find('.tabs__item').removeClass('active');
    plmxTabsItems
      .find('.tabs__item[data-tab="' + dataTab + '"]')
      .addClass('active');
  });
  var plmxSteps = $('.steps'),
    plmxStepsNavTrigger = plmxSteps.find('.steps__nav li'),
    plmxStepsItems = plmxSteps.find('.steps__items');
  plmxStepsNavTrigger.click(function (e) {
    console.log('clicked');
    e.preventDefault();
    var dataStep = $(this).attr('data-step');
    plmxStepsNavTrigger.removeClass('active');
    $(this).addClass('active');
    plmxStepsItems.find('.steps__item').removeClass('active');
    plmxStepsItems
      .find('.steps__item[data-step="' + dataStep + '"]')
      .addClass('active');
  });
  var plmxmethods = $('.methods'),
    plmxmethodsNavTrigger = plmxmethods.find('.methods__nav li'),
    plmxmethodsItems = plmxmethods.find('.methods__items');
  plmxmethodsNavTrigger.click(function (e) {
    console.log('clicked');
    e.preventDefault();
    var dataStep = $(this).attr('data-method');
    plmxmethodsNavTrigger.removeClass('active');
    $(this).addClass('active');
    plmxmethodsItems.find('.methods__item').removeClass('active');
    plmxmethodsItems
      .find('.methods__item[data-method="' + dataStep + '"]')
      .addClass('active');
  });
  var plmxcity = $('.city-tabs'),
    plmxcityNavTrigger = plmxcity.find('.city-tabs__nav li'),
    plmxcityItems = plmxcity.find('.city-tabs__items');
  plmxcityNavTrigger.click(function (e) {
    console.log('clicked');
    e.preventDefault();
    var dataCity = $(this).attr('data-city');
    plmxcityNavTrigger.removeClass('active');
    $(this).addClass('active');
    plmxcityItems.find('.city-tabs__item').removeClass('active');
    plmxcityItems
      .find('.city-tabs__item[data-city="' + dataCity + '"]')
      .addClass('active');
  });
  //	  var ps = new PerfectScrollbar('.main-nav');
  // show hide subnav depending on scroll direction
  var position = $(window).scrollTop();
  if ($('.header-js .header__info').length == 0) {
    var h_height = $('.header-js .header__container').height() + 50;
  } else {
    var h_height =
      $('.header-js .header__container').height() +
      $('.header-js .header__info').height() +
      50;
  }

  if (
    $('.short-product').length == 0 &&
    window.location.pathname !== '/cutting-calculator/'
  ) {
    let hHeight = $('.header-js').height();
    console.log(hHeight);
    $(window).scroll(function () {
      var scroll = $(window).scrollTop();

      if ($(window).width() > 767) {
        if (scroll > 210) {
          $('.header-js').addClass('fixed');
          // $('html').css({
          //   'padding-top': 278 + 'px'
          // })
          window.dispatchEvent(new Event('resize'));
        } else {
          $('.header-js').removeClass('fixed');
          // $('html').css({
          //   'padding-top': '0px'
          // })
          // $('body').css({
          //   'padding-top': hHeight + 'px !important'
          // })
          window.dispatchEvent(new Event('resize'));
        }
      } else {
        h_height = $('.header-js .header__container').height() + 26;
        $('.header-js').addClass('fixed', true);
        // $('html').css({
        //   'padding-top': '0px'
        // })
        window.dispatchEvent(new Event('resize'));
      }
    });
  }

  $('.view_btn_js').on('click', 'button:not(.active)', function () {
    if ($(this).hasClass('view_row')) {
      setCookie('view_category', 'row');
    } else {
      setCookie('view_category', 'table');
    }
    $('.view_btn_js > button').toggleClass('active');
    $('.shop-cat-tile').toggleClass('product_row_view');

    // $('.shop-cat-tile:not(.product_row_view) .shop-cat-tile__item').matchHeight(
    //   {
    //     byRow: true,
    //       property: 'height',
    //       // target: $('.shop-cat-tile__tools'),
    //       remove: false
    //   }
    // );
  });
  var deliveryItems = $('.cart-delivery__table .item');
  deliveryItems.each(function () {
    var selected = $(this);
    selected.click(function () {
      deliveryItems.removeClass('active');
      if (selected.hasClass('active')) {
        selected.removeClass('active');
      } else {
        selected.addClass('active');
      }
    });
  });
  var paymentMethods = $('.payment-method .payment-method__item');
  paymentMethods.each(function () {
    var selected = $(this);
    selected.click(function () {
      paymentMethods.removeClass('active');
      if (selected.hasClass('active')) {
        selected.removeClass('active');
      } else {
        selected.addClass('active');
      }
    });
  });
  if ($('.news__content').length) {
    var $grid = $('.news__content').isotope({
      // main isotope options
      itemSelector: '.news__item',
      // set layoutMode
      layoutMode: 'masonry',
      masonry: {
        columnWidth: 260,
        gutter: 20 /*,
         horizontalOrder: false,
         verticalOrder: true,
         fitWidth: true*/,
      },
      cellsByRow: {
        columnWidth: 540,
        rowHeight: 540,
      },
      masonryHorizontal: {
        rowHeight: 260,
      },
      cellsByColumn: {
        columnWidth: 540,
        rowHeight: 540,
      },
    });
  }
  $('.header_info_close').click(function () {
    $(this).parent().addClass('hidden');
    $('.plus_info').removeClass('plus_info');
    $('.is-info-header-show').removeClass('is-info-header-show');
    setCookie('header_info_new_last', 't');
  });
  $('.tonw_choose_js').click(function () {
    $('.town_choose').addClass('active');
  });
  $('.town_choose_another_js').click(function () {
    $('.town_choose_another').addClass('active');
  });
  $('.town_choose_ok_js').click(function () {
    $('.town_choose').removeClass('active');
  });
  $('.town_choose_another_list_js li').click(async function (el) {
    $('.town_choose').removeClass('active');
    setCookie('plmx_city_name', $(this).html());
    setCookie('plmx_city', $(this).attr('data-city'));
    setCookie('plmx_city_real', $(this).attr('data-city'));
    setCookie('plmx_reset_CFO', 'Y');

    //		const data = await fetch("/bitrix/php_interface/geoip/cities.json");
    //		const json = await data.json();

    //		console.log(json);

    location.reload();
  });
  /* Accordion */
  $('.accordion-item .accordion-item__trigger').click(function (event) {
    event.preventDefault();
    var trigger = $(this),
      content = trigger.next('.accordion-item__content');
    if (trigger.hasClass('active')) {
      trigger.removeClass('active');
      content.removeClass('active');
      content.stop().slideUp();
    } else {
      trigger.addClass('active');
      content.addClass('active');
      content.stop().slideDown();
    }
  });
  /**
   * Modal
   */
  $('[data-button="modal"]').click(function (e) {
    e.preventDefault();
    var selected = $(this),
      modalName = selected.attr('data-modal'),
      modalTrigger = selected.attr('data-trigger'),
      modal = $('.modal[data-modal="' + modalName + '"]');
    modal.addClass('modal--active');
    modal.find('input[data-entity="data-trigger"]').val(modalTrigger);
    setTimeout(function () {
      $(".phone-mask , [autocomplete='tel']").each(function () {
        initCustomPhoneMask(this);
      });
    }, 500);

    var town = 'Ярославль или регионы',
      region = 76;
    if (getCookie('plmx_city') == 'Ярославль') {
      town = 'Ярославль или регионы [ЯР]';
      region = 76;
    } else {
      town = 'Санкт-Петербург [СПБ]';
      region = 78;
    }
    $('.modal[data-modal="' + modalName + '"]')
      .find('input[name="form_text_49"]')
      .val(town);
    $('.modal[data-modal="' + modalName + '"]')
      .find('input[name="form_text_44"]')
      .val(town);
    $('.modal[data-modal="' + modalName + '"]')
      .find('input[name="form_text_40"]')
      .val(town);
    $('.modal[data-modal="' + modalName + '"]')
      .find('input[name="form_text_89"]')
      .val(region);
  });
  $('.modal__close, .modal__overlay').click(function (e) {
    e.preventDefault();
    var selected = $(this),
      modalName = selected.attr('data-modal');
    $('.modal[data-modal="' + modalName + '"]').removeClass('modal--active');
  });
  $('#filter-clear-all').on('click', function (e) {
    e.preventDefault();
    $('#del_filter').click();
  });
  $('#del_filter-second').on('click', function (e) {
    e.preventDefault();
    $('#del_filter').click();
  });

  $(document).on(
    'click',
    '.main-nav__cats .has-child .drop-trigger',
    function (e) {
      /*	$('.main-nav__cats .has-child .drop-trigger').on('click', function(e){*/
      var selected = $(this).parent(),
        subMenu = selected.find('.sub');
      if (subMenu.hasClass('active')) {
        subMenu.stop().slideUp(300);
        subMenu.removeClass('active');
        selected.removeClass('active');
      } else {
        subMenu.stop().slideDown(300);
        subMenu.addClass('active');
        selected.addClass('active');
      }
    }
  );
  $('#price-list-nav__close').on('click', function (e) {
    $('#price-list-menu').removeClass('active');
    $('#price-list-nav__open').removeClass('active');
  });
  $('#price-list-nav__open').on('click', function (e) {
    e.preventDefault();
    var selected = $(this);
    if (selected.hasClass('active')) {
      $(this).removeClass('active');
      $('#price-list-menu').removeClass('active');
    } else {
      $(this).addClass('active');
      $('#price-list-menu').addClass('active');
    }
  });
  $('#price-list-menu a').on('click', function () {
    $('#price-list-menu').removeClass('active');
  });
  $('[data-entity="expand-trigger"]').on('click', function (e) {
    e.preventDefault();
    var expandArea = $('[data-entity="expand-area"]');
    if (expandArea.hasClass('active') == false) {
      expandArea.addClass('active');
      expandArea.stop().slideDown(300);
    } else {
      expandArea.removeClass('active');
      expandArea.stop().slideUp(300);
    }
  });

  /*
   * ================================================
   * --------- Логика работы меню "Каталог" ---------
   * ================================================
   */
  $('.catalog-btn').on('click', () => {
    /*	$(document).on("click", ".catalog-btn", function (e) {*/

    // --- Значение брейкпоинта для отслеживания изменений ширины вьюпорта ---
    /*
     * --- Когда ширирна вьюпорта МЕНЬШЕ, чем 768px,
     * --- будет происходить закрытие меню "Каталог".
     */

    const MOBILE_BREAKPOINT = window.matchMedia('(min-width: 768px)');

    // *** Методы ОТКРЫТИЯ и ЗАКРЫТИЯ меню "Каталог" ***
    const CatalogDesktopMenu = {
      // --- ОТКРЫТИЕ меню "Каталог" ---
      open: () => {
        $('.menu_overlay').addClass('active');
        $('.catalog-btn').addClass('active');
        $('.catalog_modal').addClass('active');

        let hw =
          $('header').height() -
          $('#horizontal-multilevel-menu').height() -
          $(document).scrollTop();
        if ($('.header-js').hasClass('fixed')) {
          hw =
            $('.header-js').height() -
            $('#horizontal-multilevel-menu').height();
        }

        let mh = 'max-height: calc(100vh - ' + hw + 'px); top:' + hw + 'px;';
        $('.catalog_modal').attr('style', mh);

        if ($(window).width() > 767) {
          $('body').attr('style', 'overflow: hidden;');
          $('html').addClass('body-scroll-locked');
          $('body').addClass('body-scroll-locked');
        } else {
          $('body').attr('style', 'overflow: hidden; padding-top: 57px');
          $('html').addClass('body-scroll-locked');
          $('body').addClass('body-scroll-locked');
        }

        // --- ДОБАВЛЕНИЕ обработки события изменения ширины вьюпорта ---
        MOBILE_BREAKPOINT.addEventListener('change', CatalogDesktopMenu.close);
      },

      // --- ЗАКРЫТИЕ меню "Каталог" ---
      close: () => {
        $('.menu_overlay').removeClass('active');
        $('.catalog-btn').removeClass('active');
        $('.catalog_modal').removeClass('active');
        $('body').attr('style', '');

        $('html').removeClass('body-scroll-locked');
        $('body').removeClass('body-scroll-locked');

        // --- УДАЛЕНИЕ обработки события изменения ширины вьюпорта ---
        MOBILE_BREAKPOINT.removeEventListener(
          'change',
          CatalogDesktopMenu.close
        );
      },
    };

    /*
     * --- ЕСЛИ кнопка "Каталог" имеет CSS-класс ".active",
     * --- ТО открываем меню.
     * --- ИНАЧЕ — закрываем.
     */

    var btn = $('.load_catalog_menu');

    if (!btn.hasClass('loaded')) {
      btn.addClass('loaded');
      $('#load_catalog_menu_here').load(
        '/local/templates/polymax_copy/generate_catalog_menu.php',
        function () {
          //		   		console.log('load menu');
          if ($('.catalog-btn').hasClass('active')) {
            CatalogDesktopMenu.close();
          } else {
            CatalogDesktopMenu.open();
          }
        }
      );
    } else {
      //		  		console.log('menu already loaded');
      if ($('.catalog-btn').hasClass('active')) {
        CatalogDesktopMenu.close();
      } else {
        CatalogDesktopMenu.open();
      }
    }
  });

  //	$('.filter_overlay,.menu_overlay').on('click', function(e){
  $(document).on('click', '.filter_overlay,.menu_overlay', function (e) {
    if ($('.catalog-btn').hasClass('active')) {
      $('.filter_overlay,.menu_overlay').removeClass('body-scroll-locked');
      $('body').attr('style', '').removeClass('body-scroll-locked');
      $('.catalog-btn').removeClass('active');
      $('.catalog_modal').removeClass('active');
      $('html').removeClass('body-scroll-locked');
    }
    if ($('.popup_filter').hasClass('active')) {
      $('body').attr('style', '').removeClass('body-scroll-locked');
      $('.filter_overlay,.menu_overlay').removeClass('active');
      $('.popup_filter').removeClass('active');
    }
    if ($('.popup_filter').hasClass('active')) {
      $('body').attr('style', '').removeClass('body-scroll-locked');
      $('.filter_overlay,.menu_overlay').removeClass('active');
      $('.popup_filter').removeClass('active');
    }
    if ($('.sort_popup').hasClass('active')) {
      $('.filter_overlay,.menu_overlay').removeClass('active');
      $('.sort_popup').removeClass('active');
    }
  });
  $('a[data-modal="fast-buy"]').on('click', function (e) {
    var item, link, name, data_color, size, price;
    if ($(this).parent().hasClass('catalog-item__one-click')) {
      item = $('.catalog-item');
      link = window.location.pathname;
      name = $(item).find('.catalog-item__name').html();
      data_color = $(item)
        .find(
          '.catalog-item__prop--color .product-item-scu-item-text-container.selected'
        )
        .attr('data-tippy-content');
      size = $(item)
        .find(
          '.catalog-item__prop--size .product-item-scu-item-text-container.selected'
        )
        .attr('title');
      //	 price = $(item).find('.catalog-item__price .new mark').html().replace(/&nbsp;/gi,'');
    } else {
      if ($(this).parent().hasClass('shop-cat-tile__fast_buy')) {
        item = $(this).parent().parent().parent().parent().parent();
        name = $(item).find('.shop-cat-tile__name a').html();
        link = $(item).find('.shop-cat-tile__name a').attr('href');
        data_color = $(item)
          .find(
            '.shop-cat__prop--color .product-item-scu-item-text-container.selected'
          )
          .attr('data-tippy-content');
        size = $(item)
          .find(
            '.shop-cat__prop--default .product-item-scu-item-text-container.selected'
          )
          .attr('title');
        price = $(item)
          .find('.new mark')
          .html()
          .replace(/&nbsp;/gi, '');
      } else {
        item = $(this).parent().parent().parent().parent();
        link = $(item).find('.category-item__name').attr('href');
        name = $(item).find('.category-item__name').html();
        data_color = $(item)
          .find(
            '.category-item__prop--color .product-item-scu-item-text-container.selected'
          )
          .attr('data-tippy-content');
        size = $(item)
          .find(
            '.category-item__prop--size .product-item-scu-item-text-container.selected'
          )
          .attr('title');
        //	   price = $(item).find('.shop-cat-tile__price .new mark').html().replace(/&nbsp;/gi,'');
      }
    }
    var town = 'Ярославль или регионы',
      region = 76;
    if (getCookie('plmx_city') == 'Ярославль') {
      town = 'Ярославль или регионы [ЯР]';
      region = 76;
    } else {
      town = 'Санкт-Петербург [СПБ]';
      region = 78;
    }
    $("form[name='SIMPLE_FORM_11'] input[name='form_text_47']").val(town);
    $("form[name='SIMPLE_FORM_11'] input[name='form_text_34']").val(link);
    $("form[name='SIMPLE_FORM_11'] input[name='form_text_32']").val(price);
    $("form[name='SIMPLE_FORM_11'] input[name='form_text_83']").val(region);
    $("form[name='SIMPLE_FORM_11'] input[name='form_text_33']").val(
      name + ' ' + data_color + ' ' + size
    );
  });
  /*var reviewsRating = $('#review-form-rating'),
    ratingText = $('[data-entity="rating-text"]'),
    ratingStars = reviewsRating.find('li');
  reviewsRating
  .on('mouseleave', function(){
    var newText = reviewsRating.find('.active > span').attr('data-text');
    ratingText.html(newText);
  });
  $('[data-entity="rating-star"]')
    .on('mouseenter', function(){
      var rating = $(this).attr('data-rating'),
        text = $(this).attr('data-text');
      ratingText.html(text);
    })
    .on('click', function(){
      var rating = $(this).attr('data-rating'),
        text = $(this).attr('data-text');
      ratingText.html(text);
      ratingStars.removeClass('active');
      $(this).parents('li').addClass('active');
      reviewsRating.find('[type="hidden"]').val(rating);
    });*/
  $('.tonw_choodse_js').on('click', function (e) {
    e.preventDefault();
  });
  $('.catalog-mobile-btn').on('click', function () {
    $('.catalog-mobile-btn').addClass('active');
    $('.header__burger').addClass('active');
    $('.header__nav--mobile').addClass('active');
    $('.mobile_menu_container .catalog-parent')
      .siblings('ul')
      .addClass('loaded');
  });
  $(document).on('click', '.mobile_menu_container .parent', function (e) {
    e.preventDefault(), $(this).siblings('ul').addClass('loaded');
    $('.header__nav--mobile').animate(
      {
        scrollTop: 0,
      },
      2000
    );
    $('.header__burger').addClass('arrow_back');
  }),
    $(document).on('click', '.mobile_menu', function (e) {
      e.preventDefault(), $('.mobile_menu_container').addClass('loaded');
      /*$(".mobile_menu_overlay").fadeIn()*/
    });

  $(document).on('click', '.mobile_menu_container a.parent', function (e) {
    if ($('.mobile_menu_container.loaded').is(':not(.loaded)')) {
      $('.header__tools').css('z-index', '999');
    } else {
      $('.header__tools').css('z-index', '1');
    }
  });

  $(document).on('click', '.header__burger', function (e) {
    //			console.log($(this));
    if (!$(this).hasClass('loaded')) {
      $(this).addClass('loaded');
      $('#mobile_menu_load_here').load(
        '/local/templates/polymax_copy/generate_mobile_menu.php',
        function () {
          window.mobileMenu();
        }
      );
    }
    if ($(this).is(':not(.active)')) {
      //	  setTimeout(function(){ $(".header__tools").css('z-index','1');},2000);
    } else {
      $('.header__tools').css('z-index', '999');
    }
  });

  $(document).on('click', function (e) {
    //		console.log('1020');
    if (
      !$('.mobile-search-call').is(e.target) &&
      !$('.header__search').is(e.target) &&
      $('.header__search').has(e.target).length === 0 &&
      !$('.js-popup-categories').is(e.target) &&
      $('.js-popup-categories').has(e.target).length === 0
    ) {
      $('.header__search .form--search').removeClass('active');
    }

    if (
      !$('#js-header-search').is(e.target) &&
      $('#js-header-search').has(e.target).length === 0
    ) {
      $('.js-search-result').slideUp();
      $('.header-js .header__phones').removeClass('hide'); //В fixed шапке уменьшаем поисковую строку и показываем телефоны
    }

    if ($('.js-popup-categories .popup-shadow').is(e.target)) {
      close_where();
    }

    //		if ( !$(".catalog-btn").is(e.target) && !$(".catalog_modal").is(e.target) && $(".catalog_modal").has(e.target).length === 0) {
    if (
      !$('.catalog-btn').is(e.target) &&
      !$('.catalog_modal').is(e.target) &&
      $('.catalog_modal').has(e.target).length === 0 &&
      $(window).width() > 767
    ) {
      $('.menu_overlay').removeClass('active');
      $('.catalog-btn').removeClass('active');
      $('.catalog_modal').removeClass('active');
      $('body').attr('style', '').removeClass('body-scroll-locked');
      $('html').removeClass('body-scroll-locked');
    }
  });

  /*
   * =====================================================
   * --- Логика выбора эл-тов в списке меню "Каталога" ---
   * =====================================================
   */
  /*	$('.catalog_first_level li').hover(function () {*/
  $(document).on('mouseover', '.catalog_first_level li', function (e) {
    const SWITCH_DELAY = 300;

    // *** Таймаут для небольшой задержки выбора эл-та списка ***
    /*
     * --- Нужен для устранения "мелькания" контента
     * --- при быстром перемещении по списку.
     */
    const catalogItemSwitch = setTimeout(() => {
      const dataImgID = $(this).attr('data_img');
      const dataSrcID = $(this).attr('data_src');

      // --- Добавление "активных" классов скрытм эл-там ---
      $('.catalog_brands > div').each(function () {
        $(this).removeClass('active');
      });

      $('.catalog_modal .second > ul').removeClass('active');

      // --- Добавление "активных" классов скрытым спискам ---
      if (dataImgID) {
        $('#' + dataImgID).addClass('active');
      }

      if (dataSrcID) {
        $('#' + dataSrcID).addClass('active');
      }
    }, SWITCH_DELAY);

    // --- Настройка для устранения "мелькания" ---
    $('.catalog_first_level li').mouseleave(() => {
      clearTimeout(catalogItemSwitch);
      $('.catalog_first_level li').off('mouseleave');
    });
  });

  $('.sort_btn_js').on('click', function () {
    $('.sort_popup').toggleClass('active');
    $('.filter_overlay').addClass('active');
  });

  $('#header_mobile_js').swipe({
    //Generic swipe handler for all directions
    swipeRight: function (
      event,
      direction,
      distance,
      duration,
      fingerCount,
      fingerData
    ) {
      console.log('You swiped ' + direction);
      menu_back();
    },
  });

  $('.js-search-input').on('input', function () {
    if ($(this).val() != '' && $(this).val().length >= 3) {
      search_ajax($(this).val(), '.js-search-result');
      $('.js-search-result').slideDown();
    } else {
      $('.js-search-result').slideUp();
    }
  });
  var slinky = $('.js-search-menu').slinky({
    title: false,
  });

  /*
//	$(document).on("click", ".js-search-menu .js-link", function (e) {
  $(".js-search-menu .js-link__").click(function(){
    //console.log($(this));

      $(".js-where-input").val($(this).attr("data-section"));

      $(".js-where-label").text($(this).text());
      close_where();

  })
*/
  $('#js-header-search input').focus(function () {
    $('.header-js .header__phones').addClass('hide');
  });
}); /*END READY*/

function call_where() {
  if (!$('.where-button').hasClass('loaded')) {
    $('.where-button').addClass('loaded');
    $('#search_where_load_here').load(
      '/local/templates/polymax_copy/generate_search_where.php',
      function () {
        $('.js-search-menu .js-link').click(function () {
          console.log('click');

          $('.js-where-input').val($(this).attr('data-section'));

          $('.js-where-label').text($(this).text());
          close_where();
        });

        var slinky = $('.js-search-menu').slinky({
          title: false,
        });
      }
    );
  }

  $('.js-popup-categories').fadeIn();
  $('body').addClass('overhide');
  $('.js-search-result').slideUp();
}
function close_where() {
  $('.js-popup-categories').fadeOut();
  $('body').removeClass('overhide');
}
function search_ajax(request, result_block) {
  data = {
    section: $('.js-where-input').val(),
    request: request,
  };
  $.ajax({
    type: 'POST',
    url: '/local/ajax/header-search.php',
    data: data,
    success: function (data) {
      //console.log(data);
      result = JSON.parse(data);
      $('#js-result-blog').html(result['blog']['html']);
      $('#js-result-product').html(result['products']['html']);
      $('#js-result-category').html(result['categories']['html']);
    },
    error: function (error) {
      console.log(error);
    },
  });
}
function menu_back() {
  if ($('ul.loaded').length > 0) {
    $('ul.loaded').last().removeClass('loaded');
    if ($('ul.loaded').length == 0) {
      $('.header__burger').removeClass('arrow_back');
    }
  } else {
    $('.header__burger').click();
  }
}
function getCookie(name) {
  var matches = document.cookie.match(
    new RegExp(
      '(?:^|; )' +
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
        '=([^;]*)'
    )
  );
  return matches ? decodeURIComponent(matches[1]) : null;
}
function setCookie(name, value, options = {}) {
  options = {
    path: '/',
    // при необходимости добавьте другие значения по умолчанию
    ...options,
  };
  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString();
  }
  let updatedCookie =
    encodeURIComponent(name) + '=' + encodeURIComponent(value);
  for (let optionKey in options) {
    updatedCookie += '; ' + optionKey;
    let optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += '=' + optionValue;
    }
  }
  document.cookie = updatedCookie;
}
function checkdays() {
  if (getCookie('checkdays') != 't') {
    $('.week.modal').addClass(' modal--active');
    setCookie('checkdays', 't');
  }
}
/*
// Starts listening for changes in the root HTML element of the page.
mutationObserver.observe(document.documentElement, {
  attributes: true,
  characterData: true,
  childList: true,
  subtree: true,
  attributeOldValue: true,
  characterDataOldValue: true
});
*/
var top_show = 150;
var delay = 1000;
$(document).ready(function () {
  checkdays();
  $('header').on('mouseenter', '.header__phones span', function () {
    $('.week.modal').addClass(' modal--active');
  });
  if ($(document).width() <= 767) {
    $(
      '.shop-cat__prop--default li:not(:first-child):not(.mobile_count_container):not(.mobile_count_container_)'
    ).each(function () {
      $(this).hide();
    });
  }

  /* if($(".popup_filter").length>0 && $(document).width()<=767){
    $(".popup_filter").scroll(function () {
      console.log("scroll");
      $('.bx-filter-popup-result').css("bottom","initial");
      $('.bx-filter-popup-result').css("top",window.innerHeight-52+"px");


    });
  }
  $(window).resize(function () {
    if($(".popup_filter").length>0 && $(document).width()<=767){

        $('.bx-filter-popup-result').css("bottom","initial");
        $('.bx-filter-popup-result').css("top",window.innerHeight-52+"px");


    }
  });*/
  $(window).scroll(function () {
    if ($(this).scrollTop() > top_show && $(window).width() > 1400)
      $('.scroll-top').fadeIn();
    else $('.scroll-top').fadeOut();
  });
  $('.scroll-top').click(function () {
    $('body, html').animate(
      {
        scrollTop: 0,
      },
      delay
    );
  });
});
function getPriceList() {
  if ($('.modal[data-modal="price"]').length == 1) {
    $('.modal[data-modal="price"]').addClass('modal--active');
  } else {
    $.ajax({
      url: '/local/ajax/forms/getpricelist.php',
      dataType: 'html',
    }).done(function (data) {
      $('body').prepend(data);
      $(".phone-mask , [autocomplete='tel']").each(function () {
        initCustomPhoneMask(this);
      });

      var town = 'Ярославль или регионы',
        region = 76;

      if (getCookie('plmx_city') == 'Ярославль') {
        town = 'Ярославль или регионы [ЯР]';
        region = 76;
      } else {
        town = 'Санкт-Петербург [СПБ]';
        region = 78;
      }
      $("input[name='form_text_49']").val(town);
    });
  }
}
function getOneClick() {
  if ($('.modal[data-modal="fast-buy"]').length == 1) {
    $('.modal[data-modal="fast-buy"]').addClass('modal--active');
  } else {
    $.ajax({
      url: '/local/ajax/forms/getoneclick.php',
      dataType: 'html',
    }).done(function (data) {
      $('body').prepend(data);
      $(".phone-mask , [autocomplete='tel']").each(function () {
        initCustomPhoneMask(this);
      });
      setTimeout(function () {
        reinitCaptcha();
      }, 1000);
      var town = 'Ярославль или регионы',
        region = 76;

      if (getCookie('plmx_city') == 'Ярославль') {
        town = 'Ярославль или регионы [ЯР]';
        region = 76;
      } else {
        town = 'Санкт-Петербург [СПБ]';
        region = 78;
      }
      $("input[name='form_text_42']").val(town);
      $("input[name='form_text_90']").val(region);
      $("input[name='form_text_32']").val($('.catalog-item__name').html());
      $("input[name='form_text_33']").val(
        parseFloat(
          $('.product-item-detail-price-current span')
            .html()
            .replace(/&nbsp;/gi, '')
        )
      );
      $("input[name='form_text_34']").val(window.location.href);
      $("input[name='form_text_86']").val(getCookie('en_cp'));
    });
  }
}
function getMontaz() {
  if ($('.modal[data-modal="intall"]').length == 1) {
    $('.modal[data-modal="intall"]').addClass('modal--active');
  } else {
    $.ajax({
      url: '/local/ajax/forms/getmontaz.php',
      dataType: 'html',
    }).done(function (data) {
      $('body').prepend(data);
      $(".phone-mask , [autocomplete='tel']").each(function () {
        initCustomPhoneMask(this);
      });

      var town = 'Ярославль или регионы',
        region = 76;

      if (getCookie('plmx_city') == 'Ярославль') {
        town = 'Ярославль или регионы [ЯР]';
        region = 76;
      } else {
        town = 'Санкт-Петербург [СПБ]';
        region = 78;
      }
      $("input[name='form_text_46']").val(town);
    });
  }
}
function getCallack() {
  if ($('.modal[data-modal="main"]').length == 1) {
    $('.modal[data-modal="main"]').addClass('modal--active');
  } else {
    $.ajax({
      url: '/local/ajax/forms/getmain.php',
      dataType: 'html',
    }).done(function (data) {
      $('body').prepend(data);
      $(".phone-mask , [autocomplete='tel']").each(function () {
        initCustomPhoneMask(this);
      });
      setTimeout(function () {
        $('input[name="captcha_word"]').prop('required', false);
        reinitCaptcha();
      }, 1000);

      var town = 'Ярославль или регионы',
        region = 76;

      if (getCookie('plmx_city') == 'Ярославль') {
        town = 'Ярославль или регионы [ЯР]';
        region = 76;
      } else {
        town = 'Санкт-Петербург [СПБ]';
        region = 78;
      }
      let page_link = window.location.pathname;
      $("input[name='form_text_44']").val(town);
      $("input[name='form_text_88']").val(region);
      $("input[name='form_text_84']").val(page_link);
      $("input[name='form_text_85']").val(getCookie('en_cp'));
    });
  }
}

const openTradePriceRequestModal = (itemId, afterFormLoaded = false) => {
  const modal = $('.modal[data-modal="trace-price-request"]');

  if (modal.length > 0) {
    modal.addClass('modal--active');

    if (!afterFormLoaded) {
      return;
    }

    $(".phone-mask , [autocomplete='tel']").each(function () {
      initCustomPhoneMask(this);
    });

    modal.find('form').on('submit', async (event) => {
      event.preventDefault();

      let phoneField = modal.find('form .phone-mask');
      var phone = phoneField.val();
      if (!validatePhone(phone)) {
        phoneField.addClass('error-field');
        return false;
      }
      phoneField.removeClass('error-field');

      const formData = new FormData(event.target);
      formData.append('item_id', itemId);
      console.log(formData);

      modal.find('.form__error').text('');
      modal.find('input[type="submit"]').addClass('loading_btn');

      const response = await fetch(
        '/local/ajax/forms/trade_price_handler.php',
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      if (data?.status) {
        // modal.removeClass('modal--active');

        $('.section-form-item').hide();
        $('.section-form-thanks').show();
        setTimeout(() => {
          $('.section-form-item').show();
          $('.section-form-thanks').hide();
          modal.removeClass('modal--active');
        }, 3500);

        return;
      }

      modal
        .find('.form__error')
        .text(data.msg[0]?.text || 'Произошла неизвестная ошибка');
      modal.find('input[type="submit"]').removeClass('loading_btn');
    });
  } else {
    $.ajax({
      url: '/local/ajax/forms/trade_price_modal.php',
      dataType: 'html',
    }).done(function (data) {
      $('body').prepend(data);

      setTimeout(() => openTradePriceRequestModal(itemId, true), 0);
    });
  }
};

function getCOMM() {
  $('body, html').addClass('is-no-scroll');
  if ($('.modal[data-modal="main"]').length == 1) {
    $('.modal[data-modal="main"]').addClass('modal--active');
  } else {
    $.ajax({
      url: '/local/ajax/forms/getcomm.php',
      dataType: 'html',
    }).done(function (data) {
      $('body').prepend(data);
      $(".phone-mask , [autocomplete='tel']").each(function () {
        initCustomPhoneMask(this);
      });

      var town = 'Ярославль или регионы',
        region = 76;
      if (getCookie('plmx_city') == 'Ярославль') {
        town = 'Ярославль или регионы [ЯР]';
        region = 76;
      } else {
        town = 'Санкт-Петербург [СПБ]';
        region = 78;
      }

      $('select[multiple]').multiselect({
        columns: 1,
        texts: {
          placeholder: 'Выберите материалы',
          selectedOptions: ':Выбрано',
        },
        maxPlaceholderOpts: 1,
        maxHeight: 250,
      });

      console.log('line 1483');
      $("input[name='form_text_71']").val(town);
      $("input[name='form_text_91']").val(region);
    });
  }
}

function getDirector() {
  if ($('.modal[data-modal="director"]').length == 1) {
    $('.modal[data-modal="director"]').addClass('modal--active');
  } else {
    $.ajax({
      url: '/local/ajax/forms/getdir.php',
      dataType: 'html',
    }).done(function (data) {
      $('body').prepend(data);
      setTimeout(function () {
        $('.form_email').inputmask({
          mask: '*{1,20}[.*{1,20}][.*{1,20}][.*{1,20}]@*{1,20}[.*{2,6}][.*{1,2}]',
          greedy: false,
          onBeforePaste: function (pastedValue, opts) {
            pastedValue = pastedValue.toLowerCase();
            return pastedValue.replace('mailto:', '');
          },
          definitions: {
            '*': {
              validator: "[0-9A-Za-z!#$%&'*+/=?^_`{|}~-]",
              casing: 'lower',
            },
          },
        });
        reinitCaptcha();
      }, 1000);
      var town = 'Ярославль или регионы',
        region = 76;
      if (getCookie('plmx_city') == 'Ярославль') {
        town = 'Ярославль или регионы [ЯР]';
        region = 76;
      } else {
        town = 'Санкт-Петербург [СПБ]';
        region = 78;
      }
      $("input[name='form_text_55']").val(town);
      $("input[name='form_text_82']").val(region);
      $("input[name='form_text_79']").val(getCookie('en_cp'));
    });
  }
}

$(document).on('mouseover', '.phone-mask[inputmode="email"]', function () {
  $(this).inputmask({
    mask: '*{1,20}[.*{1,20}][.*{1,20}][.*{1,20}]@*{1,20}[.*{2,6}][.*{1,2}]',
    greedy: false,
    onBeforePaste: function (pastedValue, opts) {
      pastedValue = pastedValue.toLowerCase();
      return pastedValue.replace('mailto:', '');
    },
    definitions: {
      '*': {
        validator: "[0-9A-Za-z!#$%&'*+/=?^_`{|}~-]",
        casing: 'lower',
      },
    },
  });
});

function popup_picure_js(block) {
  console.log(block);
  $(block).closest('.modal').removeClass('modal--active');
  setCookie('header_picture', 'shown');
}
/*
let touchstartX = 0
let touchendX = 0

const slider = document.getElementById('header_mobile_js')

function handleGesture() {
// if (touchendX < touchstartX) alert('swiped left!')
  if (touchendX > touchstartX) {menu_back();}
}

slider.addEventListener('touchstart', e => {
  touchstartX = e.changedTouches[0].screenX
})

slider.addEventListener('touchend', e => {
  console.log('swipe');
  touchendX = e.changedTouches[0].screenX;
  handleGesture()
})*/

/*
 * ==================================================================================================
 * --------- Полифилл "focus-visible": для платформ, не поддерживающих :focus-visible (CSS) ---------
 * ---------- Источник и автор данного полифилла: https://github.com/WICG/focus-visible -------------
 * ==================================================================================================
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? factory()
    : typeof define === 'function' && define.amd
    ? define(factory)
    : factory();
})(this, function () {
  'use strict';

  /**
   * Applies the :focus-visible polyfill at the given scope.
   * A scope in this case is either the top-level Document or a Shadow Root.
   *
   * @param {(Document|ShadowRoot)} scope
   * @see https://github.com/WICG/focus-visible
   */
  function applyFocusVisiblePolyfill(scope) {
    var hadKeyboardEvent = true;
    var hadFocusVisibleRecently = false;
    var hadFocusVisibleRecentlyTimeout = null;

    var inputTypesAllowlist = {
      text: true,
      search: true,
      url: true,
      tel: true,
      email: true,
      password: true,
      number: true,
      date: true,
      month: true,
      week: true,
      time: true,
      datetime: true,
      'datetime-local': true,
    };

    /**
     * Helper function for legacy browsers and iframes which sometimes focus
     * elements like document, body, and non-interactive SVG.
     * @param {Element} el
     */
    function isValidFocusTarget(el) {
      if (
        el &&
        el !== document &&
        el.nodeName !== 'HTML' &&
        el.nodeName !== 'BODY' &&
        'classList' in el &&
        'contains' in el.classList
      ) {
        return true;
      }
      return false;
    }

    /**
     * Computes whether the given element should automatically trigger the
     * `focus-visible` class being added, i.e. whether it should always match
     * `:focus-visible` when focused.
     * @param {Element} el
     * @return {boolean}
     */
    function focusTriggersKeyboardModality(el) {
      var type = el.type;
      var tagName = el.tagName;

      if (tagName === 'INPUT' && inputTypesAllowlist[type] && !el.readOnly) {
        return true;
      }

      if (tagName === 'TEXTAREA' && !el.readOnly) {
        return true;
      }

      if (el.isContentEditable) {
        return true;
      }

      return false;
    }

    /**
     * Add the `focus-visible` class to the given element if it was not added by
     * the author.
     * @param {Element} el
     */
    function addFocusVisibleClass(el) {
      if (el.classList.contains('focus-visible')) {
        return;
      }
      el.classList.add('focus-visible');
      el.setAttribute('data-focus-visible-added', '');
    }

    /**
     * Remove the `focus-visible` class from the given element if it was not
     * originally added by the author.
     * @param {Element} el
     */
    function removeFocusVisibleClass(el) {
      if (!el.hasAttribute('data-focus-visible-added')) {
        return;
      }
      el.classList.remove('focus-visible');
      el.removeAttribute('data-focus-visible-added');
    }

    /**
     * If the most recent user interaction was via the keyboard;
     * and the key press did not include a meta, alt/option, or control key;
     * then the modality is keyboard. Otherwise, the modality is not keyboard.
     * Apply `focus-visible` to any current active element and keep track
     * of our keyboard modality state with `hadKeyboardEvent`.
     * @param {KeyboardEvent} e
     */
    function onKeyDown(e) {
      if (e.metaKey || e.altKey || e.ctrlKey) {
        return;
      }

      if (isValidFocusTarget(scope.activeElement)) {
        addFocusVisibleClass(scope.activeElement);
      }

      hadKeyboardEvent = true;
    }

    /**
     * If at any point a user clicks with a pointing device, ensure that we change
     * the modality away from keyboard.
     * This avoids the situation where a user presses a key on an already focused
     * element, and then clicks on a different element, focusing it with a
     * pointing device, while we still think we're in keyboard modality.
     * @param {Event} e
     */
    function onPointerDown(e) {
      hadKeyboardEvent = false;
    }

    /**
     * On `focus`, add the `focus-visible` class to the target if:
     * - the target received focus as a result of keyboard navigation, or
     * - the event target is an element that will likely require interaction
     *	 via the keyboard (e.g. a text box)
     * @param {Event} e
     */
    function onFocus(e) {
      // Prevent IE from focusing the document or HTML element.
      if (!isValidFocusTarget(e.target)) {
        return;
      }

      if (hadKeyboardEvent || focusTriggersKeyboardModality(e.target)) {
        addFocusVisibleClass(e.target);
      }
    }

    /**
     * On `blur`, remove the `focus-visible` class from the target.
     * @param {Event} e
     */
    function onBlur(e) {
      if (!isValidFocusTarget(e.target)) {
        return;
      }

      if (
        e.target.classList.contains('focus-visible') ||
        e.target.hasAttribute('data-focus-visible-added')
      ) {
        // To detect a tab/window switch, we look for a blur event followed
        // rapidly by a visibility change.
        // If we don't see a visibility change within 100ms, it's probably a
        // regular focus change.
        hadFocusVisibleRecently = true;
        window.clearTimeout(hadFocusVisibleRecentlyTimeout);
        hadFocusVisibleRecentlyTimeout = window.setTimeout(function () {
          hadFocusVisibleRecently = false;
        }, 100);
        removeFocusVisibleClass(e.target);
      }
    }

    /**
     * If the user changes tabs, keep track of whether or not the previously
     * focused element had .focus-visible.
     * @param {Event} e
     */
    function onVisibilityChange(e) {
      if (document.visibilityState === 'hidden') {
        // If the tab becomes active again, the browser will handle calling focus
        // on the element (Safari actually calls it twice).
        // If this tab change caused a blur on an element with focus-visible,
        // re-apply the class when the user switches back to the tab.
        if (hadFocusVisibleRecently) {
          hadKeyboardEvent = true;
        }
        addInitialPointerMoveListeners();
      }
    }

    /**
     * Add a group of listeners to detect usage of any pointing devices.
     * These listeners will be added when the polyfill first loads, and anytime
     * the window is blurred, so that they are active when the window regains
     * focus.
     */
    function addInitialPointerMoveListeners() {
      document.addEventListener('mousemove', onInitialPointerMove);
      document.addEventListener('mousedown', onInitialPointerMove);
      document.addEventListener('mouseup', onInitialPointerMove);
      document.addEventListener('pointermove', onInitialPointerMove);
      document.addEventListener('pointerdown', onInitialPointerMove);
      document.addEventListener('pointerup', onInitialPointerMove);
      document.addEventListener('touchmove', onInitialPointerMove);
      document.addEventListener('touchstart', onInitialPointerMove);
      document.addEventListener('touchend', onInitialPointerMove);
    }

    function removeInitialPointerMoveListeners() {
      document.removeEventListener('mousemove', onInitialPointerMove);
      document.removeEventListener('mousedown', onInitialPointerMove);
      document.removeEventListener('mouseup', onInitialPointerMove);
      document.removeEventListener('pointermove', onInitialPointerMove);
      document.removeEventListener('pointerdown', onInitialPointerMove);
      document.removeEventListener('pointerup', onInitialPointerMove);
      document.removeEventListener('touchmove', onInitialPointerMove);
      document.removeEventListener('touchstart', onInitialPointerMove);
      document.removeEventListener('touchend', onInitialPointerMove);
    }

    /**
     * When the polfyill first loads, assume the user is in keyboard modality.
     * If any event is received from a pointing device (e.g. mouse, pointer,
     * touch), turn off keyboard modality.
     * This accounts for situations where focus enters the page from the URL bar.
     * @param {Event} e
     */
    function onInitialPointerMove(e) {
      // Work around a Safari quirk that fires a mousemove on <html> whenever the
      // window blurs, even if you're tabbing out of the page. ¯\_(ツ)_/¯
      if (e.target.nodeName && e.target.nodeName.toLowerCase() === 'html') {
        return;
      }

      hadKeyboardEvent = false;
      removeInitialPointerMoveListeners();
    }

    // For some kinds of state, we are interested in changes at the global scope
    // only. For example, global pointer input, global key presses and global
    // visibility change should affect the state at every scope:
    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('mousedown', onPointerDown, true);
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('touchstart', onPointerDown, true);
    document.addEventListener('visibilitychange', onVisibilityChange, true);

    addInitialPointerMoveListeners();

    // For focus and blur, we specifically care about state changes in the local
    // scope. This is because focus / blur events that originate from within a
    // shadow root are not re-dispatched from the host element if it was already
    // the active element in its own scope:
    scope.addEventListener('focus', onFocus, true);
    scope.addEventListener('blur', onBlur, true);

    // We detect that a node is a ShadowRoot by ensuring that it is a
    // DocumentFragment and also has a host property. This check covers native
    // implementation and polyfill implementation transparently. If we only cared
    // about the native implementation, we could just check if the scope was
    // an instance of a ShadowRoot.
    if (scope.nodeType === Node.DOCUMENT_FRAGMENT_NODE && scope.host) {
      // Since a ShadowRoot is a special kind of DocumentFragment, it does not
      // have a root element to add a class to. So, we add this attribute to the
      // host element instead:
      scope.host.setAttribute('data-js-focus-visible', '');
    } else if (scope.nodeType === Node.DOCUMENT_NODE) {
      document.documentElement.classList.add('js-focus-visible');
      document.documentElement.setAttribute('data-js-focus-visible', '');
    }
  }

  // It is important to wrap all references to global window and document in
  // these checks to support server-side rendering use cases
  // @see https://github.com/WICG/focus-visible/issues/199
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    // Make the polyfill helper globally available. This can be used as a signal
    // to interested libraries that wish to coordinate with the polyfill for e.g.,
    // applying the polyfill to a shadow root:
    window.applyFocusVisiblePolyfill = applyFocusVisiblePolyfill;

    // Notify interested libraries of the polyfill's presence, in case the
    // polyfill was loaded lazily:
    var event;

    try {
      event = new CustomEvent('focus-visible-polyfill-ready');
    } catch (error) {
      // IE11 does not support using CustomEvent as a constructor directly:
      event = document.createEvent('CustomEvent');
      event.initCustomEvent('focus-visible-polyfill-ready', false, false, {});
    }

    window.dispatchEvent(event);
  }

  if (typeof document !== 'undefined') {
    // Apply the polyfill to the global document, so that no JavaScript
    // coordination is required to use the polyfill in the top-level document:
    applyFocusVisiblePolyfill(document);
  }
});

function reinitCaptcha() {
  grecaptcha.ready(function () {
    grecaptcha
      .execute(PUBLIC_CAPTCHA_KEY, { action: 'homepage' })
      .then(function (token) {
        $('input[name=g-recaptcha-response]').val(token);
      });
  });
}

function validateCaptchaNew(token) {
  //$('.preloader-new').show();
  return new Promise((resolve, reject) => {
    jQuery.ajax({
      url: '/local/ajax/validateCaptcha.php',
      type: 'GET',
      data: { token: token },
      success: function (data) {
        /*setTimeout(function(){
        $('.preloader-new').hide();
      }, 1000)*/

        resolve(data);
      },
    });
  });
}
$(function () {
  BX.addCustomEvent('onAjaxSuccess', function () {
    setTimeout(function () {
      reinitCaptcha();
      $(".phone-mask , [autocomplete='tel']").each(function () {
        initCustomPhoneMask(this);
      });
      if ($('select[multiple]').length) {
        $('select[multiple]').multiselect({
          columns: 1,
          texts: {
            placeholder: 'Выберите материалы',
            selectedOptions: ':Выбрано',
          },
          maxPlaceholderOpts: 1,
          maxHeight: 250,
        });
      }
    }, 100);
  });
});

function validatePhone(phone) {
  phone = phone.replace(/[^0-9.]/g, '');
  if (phone.length < 11) {
    return false;
  }
  return true;
}

$(document).ready(function () {
  $(function () {
    if ($('.shop-cat-tile__tools').length) {
      // setTimeout(() => {
      //   $('.shop-cat-tile:not(.product_row_view) .shop-cat-tile__item').matchHeight(
      //     {
      //       byRow: true,
      //         property: 'height',
      //         // target: $('.shop-cat-tile__tools'),
      //         remove: false
      //     }
      //   );
      // }, 1200);
    }
  });
  $(document).ready(function () {
    var timeoutId;

    $(window).resize(function () {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(function () {
        resize();
      }, 250);
    });

    function resize() {
      if ($('body').width() < 761) {
        setTimeout(() => {
          $.each(
            $('.main-block .shop-cat-tile__price .old'),
            function (indexInArray, valueOfElement) {
              let elWidth = $(this).find('> span + span').width();
              let text = $(this).find('> span + span').text();
              let $parrent = $(this).closest('.shop-cat-tile__tools-row-info');
              let $tooltip = $parrent.find(
                '.shop-cat-tile__properties-toggler'
              );
              if ($tooltip.length) {
                if ($(this).width() > 47.5) {
                  $(this).find('> span + span').text('');
                  $(this)
                    .find('> span + span')
                    .text(text.substring(0, text.length - 2));
                }
              }
            }
          );
        }, 250);
      }
    }
    const mediaQuery = window.matchMedia('(max-width: 760px)');
    // Check if the media query is true
    if (mediaQuery.matches) {
      // Then trigger an alert
      setTimeout(() => {
        $.each(
          $('.main-block .shop-cat-tile__price .old'),
          function (indexInArray, valueOfElement) {
            let elWidth = $(this).find('> span + span').width();
            let text = $(this).find('> span + span').text();
            let $parrent = $(this).closest('.shop-cat-tile__tools-row-info');
            let $tooltip = $parrent.find('.shop-cat-tile__properties-toggler');
            if ($tooltip.length) {
              if ($(this).width() > 47.5) {
                $(this).find('> span + span').text('');
                $(this)
                  .find('> span + span')
                  .text(text.substring(0, text.length - 2));
              }
            }
          }
        );
      }, 250);

      $(document).on('click', '.show_more', function () {
        setTimeout(() => {
          $.each(
            $('.main-block .shop-cat-tile__price .old'),
            function (indexInArray, valueOfElement) {
              let elWidth = $(this).find('> span + span').width();
              let text = $(this).find('> span + span').text();
              let $parrent = $(this).closest('.shop-cat-tile__tools-row-info');
              let $tooltip = $parrent.find(
                '.shop-cat-tile__properties-toggler'
              );
              if ($tooltip.length) {
                if ($(this).width() > 47.5) {
                  $(this).find('> span + span').text('');
                  $(this)
                    .find('> span + span')
                    .text(text.substring(0, text.length - 2));
                }
              }
            }
          );
        }, 250);
      });
    }
  });
});
