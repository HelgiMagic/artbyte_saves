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

  const instalmentsBuy = document.querySelector('.instalments-buy');
  const instalmentsContent = document.querySelector('.instalments-buy-content');

  instalmentsBuy.querySelector('.instalments-btn').addEventListener('click', () => {
    instalmentsContent.classList.toggle('d-none');
  });

  // Добавляем обработчик кликов на весь документ
  document.addEventListener('click', (e) => {
    // Проверяем, был ли клик вне окна
    if (!instalmentsBuy.contains(e.target)) {
      instalmentsContent.classList.add('d-none');
    }
  });

  // EDOST
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
      expandButton.className = 'edost-expand-button btn btn-transparent';
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
});
