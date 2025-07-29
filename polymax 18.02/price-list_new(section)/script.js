(function () {
  'use strict';

  if (!!window.JCCatalogSectionComponent) return;

  window.JCCatalogSectionComponent = function (params) {
    console.log('test 23');

    this.formPosting = false;
    this.siteId = params.siteId || '';
    this.ajaxId = params.ajaxId || '';
    this.template = params.template || '';
    this.componentPath = params.componentPath || '';
    this.parameters = params.parameters || '';

    if (params.navParams) {
      this.navParams = {
        NavNum: params.navParams.NavNum || 1,
        NavPageNomer: parseInt(params.navParams.NavPageNomer) || 1,
        NavPageCount: parseInt(params.navParams.NavPageCount) || 1,
      };
    }

    this.bigData = params.bigData || {
      enabled: false,
    };
    this.container = document.querySelector('[data-entity="' + params.container + '"]');
    this.showMoreButton = null;
    this.showMoreButtonMessage = null;

    if (this.bigData.enabled && BX.util.object_keys(this.bigData.rows).length > 0) {
      BX.cookie_prefix = this.bigData.js.cookiePrefix || '';
      BX.cookie_domain = this.bigData.js.cookieDomain || '';
      BX.current_server_time = this.bigData.js.serverTime;

      BX.ready(BX.delegate(this.bigDataLoad, this));
    }

    if (params.initiallyShowHeader) {
      BX.ready(BX.delegate(this.showHeader, this));
    }

    if (params.deferredLoad) {
      BX.ready(BX.delegate(this.deferredLoad, this));
    }

    if (params.lazyLoad) {
      this.showMoreButton = document.querySelector('[data-use="show-more-' + this.navParams.NavNum + '"]');
      this.showMoreButtonMessage = this.showMoreButton.innerHTML;
      BX.bind(this.showMoreButton, 'click', BX.proxy(this.showMore, this));
    }

    if (params.loadOnScroll) {
      BX.bind(window, 'scroll', BX.proxy(this.loadOnScroll, this));
    }
  };

  window.JCCatalogSectionComponent.prototype = {
    checkButton: function () {
      if (this.showMoreButton) {
        if (this.navParams.NavPageNomer == this.navParams.NavPageCount) {
          BX.remove(this.showMoreButton);
        } else {
          this.container.appendChild(this.showMoreButton);
        }
      }
    },

    enableButton: function () {
      if (this.showMoreButton) {
        BX.removeClass(this.showMoreButton, 'disabled');
        this.showMoreButton.innerHTML = this.showMoreButtonMessage;
      }
    },

    disableButton: function () {
      if (this.showMoreButton) {
        BX.addClass(this.showMoreButton, 'disabled');
        this.showMoreButton.innerHTML = BX.message('BTN_MESSAGE_LAZY_LOAD_WAITER');
      }
    },

    loadOnScroll: function () {
      var scrollTop = BX.GetWindowScrollPos().scrollTop,
        containerBottom = BX.pos(this.container).bottom;

      if (scrollTop + window.innerHeight > containerBottom) {
        this.showMore();
      }
    },

    showMore: function () {
      if (this.navParams.NavPageNomer < this.navParams.NavPageCount) {
        var data = {};
        data['action'] = 'showMore';
        data['PAGEN_' + this.navParams.NavNum] = this.navParams.NavPageNomer + 1;

        if (!this.formPosting) {
          this.formPosting = true;
          this.disableButton();
          this.sendRequest(data);
        }
      }
    },

    bigDataLoad: function () {
      var url = 'https://analytics.bitrix.info/crecoms/v1_0/recoms.php',
        data = BX.ajax.prepareData(this.bigData.params);

      if (data) {
        url += (url.indexOf('?') !== -1 ? '&' : '?') + data;
      }

      var onReady = BX.delegate(function (result) {
        this.sendRequest({
          action: 'deferredLoad',
          bigData: 'Y',
          items: (result && result.items) || [],
          rid: result && result.id,
          count: this.bigData.count,
          rowsRange: this.bigData.rowsRange,
          shownIds: this.bigData.shownIds,
        });
      }, this);

      BX.ajax({
        method: 'GET',
        dataType: 'json',
        url: url,
        timeout: 3,
        onsuccess: onReady,
        onfailure: onReady,
      });
    },

    deferredLoad: function () {
      this.sendRequest({
        action: 'deferredLoad',
      });
    },

    sendRequest: function (data) {
      var defaultData = {
        siteId: this.siteId,
        template: this.template,
        parameters: this.parameters,
      };

      if (this.ajaxId) {
        defaultData.AJAX_ID = this.ajaxId;
      }

      BX.ajax({
        url: this.componentPath + '/ajax.php' + (document.location.href.indexOf('clear_cache=Y') !== -1 ? '?clear_cache=Y' : ''),
        method: 'POST',
        dataType: 'json',
        timeout: 60,
        data: BX.merge(defaultData, data),
        onsuccess: BX.delegate(function (result) {
          if (!result || !result.JS) return;

          BX.ajax.processScripts(
            BX.processHTML(result.JS).SCRIPT,
            false,
            BX.delegate(function () {
              this.showAction(result, data);
            }, this)
          );
        }, this),
      });
    },

    showAction: function (result, data) {
      if (!data) return;

      switch (data.action) {
        case 'showMore':
          this.processShowMoreAction(result);
          break;
        case 'deferredLoad':
          this.processDeferredLoadAction(result, data.bigData === 'Y');
          break;
      }
    },

    processShowMoreAction: function (result) {
      this.formPosting = false;
      this.enableButton();

      if (result) {
        this.navParams.NavPageNomer++;
        this.processItems(result.items);
        this.processPagination(result.pagination);
        this.checkButton();
      }
    },

    processDeferredLoadAction: function (result, bigData) {
      if (!result) return;

      var position = bigData ? this.bigData.rows : {};

      this.processItems(result.items, BX.util.array_keys(position));
    },

    processItems: function (itemsHtml, position) {
      if (!itemsHtml) return;

      var processed = BX.processHTML(itemsHtml, false),
        temporaryNode = BX.create('DIV');

      var items, k, origRows;

      temporaryNode.innerHTML = processed.HTML;
      items = temporaryNode.querySelectorAll('[data-entity="items-row"]');

      if (items.length) {
        this.showHeader(true);

        for (k in items) {
          if (items.hasOwnProperty(k)) {
            origRows = position ? this.container.querySelectorAll('[data-entity="items-row"]') : false;
            items[k].style.opacity = 0;

            if (origRows && BX.type.isDomNode(origRows[position[k]])) {
              origRows[position[k]].parentNode.insertBefore(items[k], origRows[position[k]]);
            } else {
              this.container.appendChild(items[k]);
            }
          }
        }

        new BX.easing({
          duration: 2000,
          start: {
            opacity: 0,
          },
          finish: {
            opacity: 100,
          },
          transition: BX.easing.makeEaseOut(BX.easing.transitions.quad),
          step: function (state) {
            for (var k in items) {
              if (items.hasOwnProperty(k)) {
                items[k].style.opacity = state.opacity / 100;
              }
            }
          },
          complete: function () {
            for (var k in items) {
              if (items.hasOwnProperty(k)) {
                items[k].removeAttribute('style');
              }
            }
          },
        }).animate();
      }

      BX.ajax.processScripts(processed.SCRIPT);
    },

    processPagination: function (paginationHtml) {
      if (!paginationHtml) return;

      var pagination = document.querySelectorAll('[data-pagination-num="' + this.navParams.NavNum + '"]');
      for (var k in pagination) {
        if (pagination.hasOwnProperty(k)) {
          pagination[k].innerHTML = paginationHtml;
        }
      }
    },

    showHeader: function (animate) {
      var parentNode = BX.findParent(this.container, {
          attr: {
            'data-entity': 'parent-container',
          },
        }),
        header;

      if (parentNode && BX.type.isDomNode(parentNode)) {
        header = parentNode.querySelector('[data-entity="header"]');

        if (header && header.getAttribute('data-showed') != 'true') {
          header.style.display = '';

          if (animate) {
            new BX.easing({
              duration: 2000,
              start: {
                opacity: 0,
              },
              finish: {
                opacity: 100,
              },
              transition: BX.easing.makeEaseOut(BX.easing.transitions.quad),
              step: function (state) {
                header.style.opacity = state.opacity / 100;
              },
              complete: function () {
                header.removeAttribute('style');
                header.setAttribute('data-showed', 'true');
              },
            }).animate();
          } else {
            header.style.opacity = 100;
          }
        }
      }
    },
  };
})();

const afterPriceListFetch = () => {
  $('.shop-cat__prop').each(function () {
    const allowedOptions = $(this).find('li:not(.notallowed)');
    if (allowedOptions.length <= 1) {
      $(this).addClass('anb');
    }
  });
};

$(document).ready(function () {
  var ctnl = 0;
  var indx;
  $('.shop-cat__content').each(function () {
    if (ctnl < $(this).find('.shop-cat__prop--heading span').length) {
      ctnl = $(this).find('.shop-cat__prop--heading span').length;
      indx = $(this);
    }
  });

  const codes = new Set();
  $('.shop-cat__props .product-item-scu-block').each(function () {
    codes.add($(this).attr('code'));
  });

  let categoryNames = [];
  const titleCodes = [];
  $(indx)
    .find('.shop-cat__prop--heading span')
    .each(function () {
      if (!categoryNames.includes($(this).html())) {
        categoryNames.push($(this).html());
      }
    });

  for (const code of codes) {
    const headingHtml = $(`.product-item-scu-block[code="${code}"]`).parent().find('.shop-cat__prop--heading span').html();
    if (categoryNames.length < codes.size) {
      if (!categoryNames.includes(headingHtml)) {
        categoryNames.push(headingHtml);
      }
    }
    const index = categoryNames.indexOf(headingHtml);
    titleCodes[index] = (titleCodes[index] || new Set()).add(code);
  }

  categoryNames.forEach((categoryName, i) => {
    const codes = titleCodes[i];
    if (categoryName === 'размер') {
      categoryName = 'Размер';
    }

    const titleHtml = `<div class="opt_head" data-type="${categoryName}" data-code="${[...codes].join(',')}">${
      categoryName.split(' для')[0]
    }</div>`;

    $('.price-head__params').before(titleHtml);
  });

  $('.shop-cat__content .shop-cat__props').each(function () {
    categoryNames.forEach((categoryName, i) => {
      const productItems = $(this).children('.shop-cat__prop.product-item-hidden');

      const itemForCategory = productItems.eq(i);
      const prevItemForCategory = productItems.eq(i - 1);

      const heading = itemForCategory.find('.shop-cat__prop--heading span').html();

      if (heading === categoryName) {
        return;
      }

      if (heading) {
        itemForCategory.before('<div class="shop-cat__prop product-item-hidden">-</div>');
      } else {
        prevItemForCategory.after('<div class="shop-cat__prop product-item-hidden">-</div>');
      }
    });
  });

  $('.shop-cat__content:not(:has(.shop-cat__props))').each(function () {
    var html = '';
    categoryNames.forEach(() => {
      html += '<div class="shop-cat__prop product-item-hidden">-</div>';
    });
    $(this)
      .find('.shop-cat__name')
      .after("<div class='shop-cat__props'>" + html + '</div>');
  });

  var ctnl = 0;
  var cntl_pre = 0;
  var indx;
  var indx_pre;
  $('.shop-cat__content').each(function () {
    if (ctnl < $(this).find('.product-item-properties dt').length) {
      ctnl = $(this).find('.product-item-properties dt').length;
      indx = $(this);
    }
    if (cntl_pre < $(this).find('.product-item-pre-properties dt').length) {
      cntl_pre = $(this).find('.product-item-pre-properties dt').length;
      indx_pre = $(this);
    }
  });
  categoryNames = [];
  sorts = [];
  cats_pre = [];
  $(indx)
    .find('.product-item-properties dt')
    .each(function () {
      if (!categoryNames.includes($(this).attr('tmpid'))) {
        categoryNames.push($(this).attr('tmpid'));
        sorts.push({ tmpid: $(this).attr('tmpid'), code: $(this).data().code });
      }
    });

  $(indx_pre)
    .find('.product-item-pre-properties dt')
    .each(function () {
      if (!cats_pre.includes($(this).attr('tmpid'))) {
        cats_pre.push($(this).attr('tmpid'));
      }
    });

  const sortHandler = (prop) => `<div class="opt-head-sort__wrapper">
        <button class="opt-head-sort__button">
            <svg width="16" height="16" fill="black" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.66663 13.3333H5.99996V5.33334H7.99996L5.33329 2.66667L2.66663 5.33334H4.66663V13.3333ZM13.3333 10.6667H11.3333V2.66667H9.99996V10.6667H7.99996L10.6666 13.3333L13.3333 10.6667Z" fill="inherit"></path>
            </svg>
        </button>
        <ul class="opt-head-sort__popup">
            <li class="opt-head-sort__popup-item"><a href="./?field=${prop}&n=asc">По увеличению</a></li>
            <li class="opt-head-sort__popup-item"><a href="./?field=${prop}&n=desc">По уменьшению</a></li>
        </ul>
    </div>`;

  sorts.forEach((element) => {
    let sortCol = 'UNSET';

    if (element.tmpid === 'dt_PRICE_FOR_METER') {
      $('.price-head__price').before('<div class="prop_head ' + element.tmpid + '" data-head >' + 'Цена/м²' + '</div>');
      return;
    }

    if (element.tmpid === 'dt_SHIRINA_PLENKI') {
      $('.price-head__price').before(
        '<div class="prop_head ' +
          element.tmpid +
          '">' +
          $('.product-item-properties dt[tmpid="' + element.tmpid + '"]')
            .html()
            .split(' для')[0] +
          '</div>'
      );
      return;
    }

    if (element.tmpid === 'dt402') sortCol = 'PLOTNOST';
    if (element.tmpid === 'dt_CML2_BASE_UNIT') sortCol = 'CML2_BASE_UNIT';
    if (element.tmpid === 'dt99999999') sortCol = 'NAL';

    $('.price-head__price').before(
      '<div class="prop_head ' +
        element.tmpid +
        '">' +
        $('.product-item-properties dt[tmpid="' + element.tmpid + '"]')
          .html()
          .split(' для')[0] +
        sortHandler(sortCol) +
        '</div>'
    );
  });

  cats_pre.forEach((element) => {
    $('.price-head__name').after(
      '<div class="prop_head">' +
        $('.product-item-pre-properties dt[tmpid="' + element + '"]')
          .html()
          .split(' для')[0] +
        sortHandler('PRICE_FOR_METER') +
        '</div>'
    );
  });

  $('.shop-cat__actions').each(function () {
    /*
		if ($(this).find('.shop-cat__quantity').length==0){
			$(this).append('<div class="shop-cat__quantity"></div>')
		}
*/
    if ($(this).find('.shop-cat__add-to-cart').length == 0) {
      $(this).append('<div class="shop-cat__add-to-cart_empty"></div>');
    }
  });

  // Заполенние таблицы при первой прогрузке
  $('.shop-cat__content').each(function () {
    let count = 0;
    if ($(this).find('.product-item-properties').length == 0) {
      //			$(this).find('.shop-cat__props').after('<div class="product-item-info-container product-item-hidden" data-entity="props-block" data-line="js-455"><dl class="product-item-properties"></dl></div>')
    }

    const dtsCount = $(this).find('.product-item-properties dt').length;

    categoryNames.forEach((categoryName) => {
      const toInsert = `<div class="dt-cont"><dt tmpid="${categoryName}"></dt><dd>-</dd></div>`;

      if (dtsCount.length === 0) {
        $(this).find('.product-item-properties').append(toInsert);
        return;
      }

      if ($(this).find('.product-item-properties dt').eq(count).attr('tmpid') !== categoryName) {
        const isEmpty = $(this).find('.product-item-properties dt').eq(count).attr('tmpid') == undefined;

        const parent = $(this)
          .find('.product-item-properties dd')
          .eq(isEmpty ? count - 1 : count)
          .parents('.dt-cont')
          .last();

        parent[isEmpty ? 'after' : 'before'](toInsert);
      }

      count += 1;
    });

    count = 0;
    if ($(this).find('.product-item-pre-properties').length == 0) {
      //			$(this).find('.shop-cat__name').after('<div class="product-item-info-container product-item-hidden" data-entity="props-block" data-line="js-478"><dl class="product-item-pre-properties"></dl></div>')
    }
    if ($(this).find('.product-item-pre-properties dt').length == 0) {
      cats_pre.forEach((element) => {
        $(this)
          .find('.product-item-pre-properties')
          .append('<div class="dt-cont"><dt tmpid="' + element + '"></dt><dd>-</dd></div>');
      });
    } else {
      cats_pre.forEach((element) => {
        if ($(this).find('.product-item-pre-properties dt').eq(count).attr('tmpid') == element) {
          count += 1;
        } else {
          if ($(this).find('.product-item-pre-properties dt').eq(count).attr('tmpid') == undefined) {
            $(this)
              .find('.product-item-pre-properties dd')
              .eq(count - 1)
              .parent()
              .after('<div class="dt-cont"><dt tmpid="' + element + '"></dt><dd>-</dd></div>');
          } else {
            $(this)
              .find('.product-item-pre-properties dd')
              .eq(count)
              .parent()
              .before('<div class="dt-cont"><dt tmpid="' + element + '"></dt><dd>-</dd></div>');
          }
          count += 1;
        }
      });
    }
  });
  $('.shop_min_carret').click(function () {
    $(this).parent().parent().parent().toggleClass('active');
  });
  $('.shop-cat__more').click(function () {
    $(this).parent().parent().parent().toggleClass('active');
  });
  $('.shop-cat__item').each(function () {
    var item = this;
    $(this)
      .find('.product-item-scu-block')
      .each(function () {
        var attr = $(this).attr('code');
        $(item)
          .find('span[code="' + attr + '"]')
          .html($(this).find('.product-item-scu-item-list li').length);
      });
  });

  afterPriceListFetch();

  if ($(window).width() > 1024) {
    let wdt =
      $('.shop-cat__item').width() +
      $('.shop-cat__item').offset().left -
      $('.shop-cat__add-to-cart').offset().left -
      $('.shop-cat__add-to-cart').width();
    if (wdt > 100) {
      wdt = wdt + 240 - 40;
      $('.price-head__name').attr('style', 'width:' + wdt + 'px;min-width:' + wdt + 'px');
      $('.shop-cat__name').each(function () {
        $(this).attr('style', 'width:' + wdt + 'px;min-width:' + wdt + 'px');
      });
    }
  }
  // При клике меню начинают работать как ссылки
  $('section.tabs .tabs__nav .dragscroll li').click(function () {
    var hres = $('.tabs__items .tabs__item[data-tab="' + $(this).attr('data-tab') + '"]')
      .find('a')
      .eq(1)
      .attr('href');
    if (hres != undefined) {
      window.location.href = hres;
    } else {
      window.location.href = $('.tabs__items .tabs__item[data-tab="' + $(this).attr('data-tab') + '"]')
        .find('a')
        .eq(0)
        .attr('href');
    }
  });
  // $('section.tabs .tabs__nav .dragscroll').scrollLeft($('section.tabs .tabs__nav ul li.active').offset().left-$('section.tabs .tabs__nav ul li:first-child()').offset().left);
});

$(document).on('click', '.shop-cat__props ul', function () {
  if ($(this).parents('.shop-cat__prop.anb').length > 0) {
    return;
  }

  if ($(this).hasClass('active')) {
    $('.shop-cat__props ul').removeClass('active');
  } else {
    $('.shop-cat__props ul').removeClass('active');
    if ($(this).find('li').length > 1) {
      $(this).addClass('active');
    }
  }
});

$(document).on('click', 'button.opt-head-sort__button', function () {
  const dropdown = $(this).siblings('ul.opt-head-sort__popup');
  dropdown.toggleClass('active');
  let formUrl = $('form.smartfilter').data().url;
  const a = $(this).siblings('ul.opt-head-sort__popup').find('a');
  a.each(function () {
    const sortHref = $(this).attr('href');
    formUrl = formUrl.replaceAll(/field=[A-Z0-9_a-z]*&n=asc&|field=[A-Z0-9_a-z]*&n=desc&/g, '');
    let newUrl = '';
    if (formUrl[0] === '&') newUrl = sortHref + formUrl;
    else newUrl = sortHref + '&' + formUrl;
    $(this).attr('href', newUrl);
  });
});

// table scroll handlers

$(document).on('click', 'button.price-list__scroll-controll', function (event) {
  const handlerElement = event.target;

  const scrollElement = handlerElement.parentElement.parentElement.parentElement.querySelector('.scrollable.dragscroll');
  const scrollValue = scrollElement.scrollLeft;
  const isScrollEnded = scrollElement.scrollWidth === scrollElement.clientWidth + scrollValue;

  if (isScrollEnded) {
    handlerElement.classList.add('hide');
  }

  scrollElement.scroll({ left: scrollValue + 100, behavior: 'smooth' });
});

$(document).ready(function () {
  $('.price-list__wrapper .scrollable.dragscroll').scroll(function (event) {
    const scrollElement = event.target;
    const scrollValue = scrollElement.scrollLeft;
    const isScrollEnded = scrollElement.scrollWidth === scrollElement.clientWidth + scrollValue;

    const handlerElement = scrollElement.parentElement.querySelector('button.price-list__scroll-controll');

    if (isScrollEnded) {
      handlerElement.classList.add('hide');
    } else {
      handlerElement.classList.remove('hide');
    }
  });
});

// navigation scroll handlers

// create width values of items
const PriceListScrollItemsWidth = [];
$('section.tabs div.dragscroll .col-12 li[data-tab]').each(function (element) {
  const elementWidth = this.getBoundingClientRect().width;
  PriceListScrollItemsWidth.push(elementWidth);
});

let PriceListScrollIndex = 0;

$(document).on('click', 'section.tabs .tabs__scroll', function (event) {
  const handlerElement = event.target;

  const scrollElement = handlerElement.parentElement.querySelector('div.dragscroll');
  const scrollValue = scrollElement.scrollLeft;

  const scrollWidth = getPixelsToScroll(scrollValue);

  scrollElement.scroll({ left: scrollWidth - 30, behavior: 'smooth' });
});

$(document).on('click', 'section.tabs .tabs__scroll__pre', function (event) {
  const handlerElement = event.target;

  const scrollElement = handlerElement.parentElement.querySelector('div.dragscroll');
  const scrollValue = scrollElement.scrollLeft;

  let scrolledItemsWidth = 0;
  for (item in PriceListScrollItemsWidth) {
    if (scrollValue <= scrolledItemsWidth + PriceListScrollItemsWidth[item]) break;
    scrolledItemsWidth += PriceListScrollItemsWidth[item];
  }

  scrollElement.scroll({ left: scrolledItemsWidth - 30, behavior: 'smooth' });
});

function getPixelsToScroll(scrollValue) {
  let scrolledItemsWidth = 0;
  let widthToScroll = 0;
  for (item in PriceListScrollItemsWidth) {
    if (scrollValue + 50 <= scrolledItemsWidth + PriceListScrollItemsWidth[item]) {
      widthToScroll = PriceListScrollItemsWidth[item];
      return widthToScroll + scrolledItemsWidth;
    }
    scrolledItemsWidth += PriceListScrollItemsWidth[item];
  }
}

$(document).ready(function () {
  const scrollLeftOnloadPage =
    $('section.tabs .tabs__nav ul li.active').offset().left - $('section.tabs .tabs__nav ul li:first-child()').offset().left - 30;

  $('section.tabs .tabs__nav .dragscroll')[0].scroll({
    left: scrollLeftOnloadPage,
    behavior: 'smooth',
  });

  $('section.tabs .tabs__nav .dragscroll').scroll(function (event) {
    const scrollElement = event.target;
    const scrollValue = scrollElement.scrollLeft;
    const isScrollEnded = scrollElement.scrollWidth === scrollElement.clientWidth + scrollValue;
    const isScrollBegin = scrollValue <= 0;

    const handlerElementPrev = scrollElement.parentElement.querySelector('div.tabs__scroll__pre');
    const handlerElementNext = scrollElement.parentElement.querySelector('div.tabs__scroll');

    if (isScrollEnded) {
      handlerElementNext.classList.remove('active');
    } else {
      handlerElementNext.classList.add('active');
    }

    if (isScrollBegin) {
      handlerElementPrev.classList.remove('active');
    } else {
      handlerElementPrev.classList.add('active');
    }
  });
});

$(document).ready(function () {
  const table = document.querySelector('#load_price_here');
  const amountOfItems = table.querySelectorAll('.shop-cat__item').length;
  if (amountOfItems < 9) table.parentElement.classList.add('small');
  else table.parentElement.classList.remove('small');
});

// Заполнение пустого места при первой загрузке страницы
$(document).ready(function () {
  const table = document.querySelector('#load_price_here');
  const items = table.querySelectorAll('.shop-cat__item');

  if (window.screen.availWidth > 767) {
    items.forEach((element) => {
      const properties = element.querySelector('.product-item-properties');

      if (!properties) {
        const props = element.querySelector('.shop-cat__props');
        if (props) {
          const div1 = document.createElement('div');
          div1.classList.add('product-item-info-container');
          div1.classList.add('product-item-properties');
          div1.dataset.entity = 'props-block';
          div1.dataset.line = '592';

          const div3 = document.createElement('div');
          div3.classList.add('product-item-info-container');
          div3.append(div1);

          const dl = document.createElement('dl');
          dl.classList.add('product-item-properties');

          const head = document.querySelector('.price-head');
          const count = head.querySelectorAll('.prop_head');
          count.forEach(() => {
            const dtCont = document.createElement('div');
            dtCont.classList.add('dt-cont');

            const dd = document.createElement('dd');
            dd.textContent = '-';
            dtCont.append(dd);

            dl.append(dtCont);
          });

          div1.append(dl);
          props.after(div3);
        }
      }

      const button = element.querySelector('.count');
      if (button && button.dataset.id === '0') {
        setTradeOfferToButtonDatasetId(element);
      }
    });
  }
});

async function setTradeOfferToButtonDatasetId(elem) {
  const data = [];
  const options = elem.querySelectorAll('.product-item-scu-block');

  url = `?product_id=${elem.dataset.element_id}`;

  options.forEach((option) => {
    const selected = option.querySelector('.product-item-scu-item-text-container.selected');
    url += `&${option.dataset.code}=${selected.dataset.id}`;
  });

  const resp = await fetch(`/ajax/get_offer_id.php${url}`).then((res) => res.json());
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

/* Scroll to top button */
$(document).ready(() => {
  const scrollTarget = $('.main-content');
  const filters = $('.bx_filter');
  const scrollToTopButton = $('.scroll-to-top');

  if (!scrollTarget.length || !filters.length || !scrollToTopButton.length) {
    return;
  }

  scrollToTopButton[0].addEventListener('click', () => {
    scrollTarget[0].scrollIntoView({ behavior: 'smooth' });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      const filter = entries[0];
      if (!filter) {
        return;
      }

      const showScrollToTopButton = !filter.isIntersecting;

      if (showScrollToTopButton) {
        delete scrollToTopButton[0].dataset.hidden;
      } else {
        scrollToTopButton[0].dataset.hidden = '';
      }
    },
    {
      threshold: 1,
    }
  );

  observer.observe(filters[0]);
});
