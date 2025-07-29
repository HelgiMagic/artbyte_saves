function JCSmartFilter(ajaxURL, viewMode, params) {
  this.ajaxURL = ajaxURL;
  this.form = null;
  this.timer = null;
  this.cacheKey = '';
  this.cache = [];
  this.popups = [];
  this.viewMode = viewMode;
  if (params && params.SEF_SET_FILTER_URL) {
    this.bindUrlToButton('set_filter', params.SEF_SET_FILTER_URL);
    this.sef = true;
  }
  if (params && params.SEF_DEL_FILTER_URL) {
    this.bindUrlToButton('del_filter', params.SEF_DEL_FILTER_URL);
  }
}

JCSmartFilter.prototype.keyup = function (input) {
  if (!!this.timer) {
    clearTimeout(this.timer);
  }
  this.timer = setTimeout(
    BX.delegate(function () {
      this.reload(input);
    }, this),
    500
  );
};

JCSmartFilter.prototype.click = function (checkbox) {
  if (!!this.timer) {
    clearTimeout(this.timer);
  }

  this.timer = setTimeout(
    BX.delegate(function () {
      this.reload(checkbox);
    }, this),
    500
  );
};

JCSmartFilter.prototype.reload = function (input) {
  if (this.cacheKey !== '') {
    //Postprone backend query
    if (!!this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(
      BX.delegate(function () {
        this.reload(input);
      }, this),
      1000
    );
    return;
  }
  this.cacheKey = '|';

  this.position = BX.pos(input, true);
  this.form = BX.findParent(input, { tag: 'form' });
  if (this.form) {
    var values = [];
    values[0] = { name: 'ajax', value: 'y' };
    this.gatherInputsValues(values, BX.findChildren(this.form, { tag: new RegExp('^(input|select)$', 'i') }, true));

    for (var i = 0; i < values.length; i++) this.cacheKey += values[i].name + ':' + values[i].value + '|';

    if (this.cache[this.cacheKey]) {
      this.curFilterinput = input;
      this.postHandler(this.cache[this.cacheKey], true);
    } else {
      if (this.sef) {
        var set_filter = BX('set_filter');
        set_filter.disabled = true;
      }

      this.curFilterinput = input;
      BX.ajax.loadJSON(this.ajaxURL, this.values2post(values), BX.delegate(this.postHandler, this));
    }
  }
};

JCSmartFilter.prototype.updateItem = function (PID, arItem) {
  if (arItem.PROPERTY_TYPE === 'N' || arItem.PRICE) {
    var trackBar = window['trackBar' + PID];
    if (!trackBar && arItem.ENCODED_ID) trackBar = window['trackBar' + arItem.ENCODED_ID];

    if (trackBar && arItem.VALUES) {
      if (arItem.VALUES.MIN) {
        if (arItem.VALUES.MIN.FILTERED_VALUE) trackBar.setMinFilteredValue(arItem.VALUES.MIN.FILTERED_VALUE);
        else trackBar.setMinFilteredValue(arItem.VALUES.MIN.VALUE);
      }

      if (arItem.VALUES.MAX) {
        if (arItem.VALUES.MAX.FILTERED_VALUE) trackBar.setMaxFilteredValue(arItem.VALUES.MAX.FILTERED_VALUE);
        else trackBar.setMaxFilteredValue(arItem.VALUES.MAX.VALUE);
      }
    }
  } else if (arItem.VALUES) {
    for (var i in arItem.VALUES) {
      if (arItem.VALUES.hasOwnProperty(i)) {
        var value = arItem.VALUES[i];
        var control = BX(value.CONTROL_ID);

        if (!!control) {
          var label = document.querySelector('[data-role="label_' + value.CONTROL_ID + '"]');
          if (value.DISABLED) {
            if (label) BX.addClass(label, 'disabled');
            else BX.addClass(control.parentNode, 'disabled');
          } else {
            if (label) BX.removeClass(label, 'disabled');
            else BX.removeClass(control.parentNode, 'disabled');
          }

          if (value.hasOwnProperty('ELEMENT_COUNT')) {
            label = document.querySelector('[data-role="count_' + value.CONTROL_ID + '"]');
            if (label) label.innerHTML = value.ELEMENT_COUNT;
          }
        }
      }
    }
  }
};

JCSmartFilter.prototype.postHandler = function (result, fromCache) {
  var hrefFILTER, url, curProp;
  var modef = BX('modef');
  var modef_num = BX('modef_num');

  if (!!result && !!result.ITEMS) {
    for (var popupId in this.popups) {
      if (this.popups.hasOwnProperty(popupId)) {
        this.popups[popupId].destroy();
      }
    }
    this.popups = [];

    for (var PID in result.ITEMS) {
      if (result.ITEMS.hasOwnProperty(PID)) {
        this.updateItem(PID, result.ITEMS[PID]);
      }
    }

    if (!!modef && !!modef_num) {
      modef_num.innerHTML = result.ELEMENT_COUNT;
      hrefFILTER = BX.findChildren(modef, { tag: 'A' }, true);

      if (result.FILTER_URL && hrefFILTER) {
        hrefFILTER[0].href = BX.util.htmlspecialcharsback(result.FILTER_URL);
      }

      if (result.FILTER_AJAX_URL && result.COMPONENT_CONTAINER_ID) {
        BX.unbindAll(hrefFILTER[0]);
        BX.bind(hrefFILTER[0], 'click', function (e) {
          url = BX.util.htmlspecialcharsback(result.FILTER_AJAX_URL);
          BX.ajax.insertToNode(url, result.COMPONENT_CONTAINER_ID);
          return BX.PreventDefault(e);
        });
      }

      if (result.INSTANT_RELOAD && result.COMPONENT_CONTAINER_ID) {
        url = BX.util.htmlspecialcharsback(result.FILTER_AJAX_URL);
        BX.ajax.insertToNode(url, result.COMPONENT_CONTAINER_ID);
      } else {
        if (modef.style.display === 'none') {
          modef.style.display = 'inline-block';
        }

        if (this.viewMode == 'VERTICAL') {
          curProp = BX.findChild(
            BX.findParent(this.curFilterinput, { class: 'bx-filter-parameters-box' }),
            { class: 'bx-filter-container-modef' },
            true,
            false
          );
          curProp.appendChild(modef);
        }

        if (result.SEF_SET_FILTER_URL) {
          this.bindUrlToButton('set_filter', result.SEF_SET_FILTER_URL);
        }
      }
    }
  }

  if (this.sef) {
    var set_filter = BX('set_filter');
    set_filter.disabled = false;
  }

  if (!fromCache && this.cacheKey !== '') {
    this.cache[this.cacheKey] = result;
  }
  this.cacheKey = '';
};

JCSmartFilter.prototype.bindUrlToButton = function (buttonId, url) {
  var button = BX(buttonId);
  if (button) {
    var proxy = function (j, func) {
      return function () {
        return func(j);
      };
    };

    if (button.type == 'submit') button.type = 'button';

    BX.bind(
      button,
      'click',
      proxy(url, function (url) {
        window.location.href = url;
        return false;
      })
    );
  }
};

JCSmartFilter.prototype.gatherInputsValues = function (values, elements) {
  if (elements) {
    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      if (el.disabled || !el.type) continue;

      switch (el.type.toLowerCase()) {
        case 'text':
        case 'textarea':
        case 'password':
        case 'hidden':
        case 'select-one':
          if (el.value.length) values[values.length] = { name: el.name, value: el.value };
          break;
        case 'radio':
        case 'checkbox':
          if (el.checked) values[values.length] = { name: el.name, value: el.value };
          break;
        case 'select-multiple':
          for (var j = 0; j < el.options.length; j++) {
            if (el.options[j].selected) values[values.length] = { name: el.name, value: el.options[j].value };
          }
          break;
        default:
          break;
      }
    }
  }
};

JCSmartFilter.prototype.values2post = function (values) {
  var post = [];
  var current = post;
  var i = 0;

  while (i < values.length) {
    var p = values[i].name.indexOf('[');
    if (p == -1) {
      current[values[i].name] = values[i].value;
      current = post;
      i++;
    } else {
      var name = values[i].name.substring(0, p);
      var rest = values[i].name.substring(p + 1);
      if (!current[name]) current[name] = [];

      var pp = rest.indexOf(']');
      if (pp == -1) {
        //Error - not balanced brackets
        current = post;
        i++;
      } else if (pp == 0) {
        //No index specified - so take the next integer
        current = current[name];
        values[i].name = '' + current.length;
      } else {
        //Now index name becomes and name and we go deeper into the array
        current = current[name];
        values[i].name = rest.substring(0, pp) + rest.substring(pp + 1);
      }
    }
  }
  return post;
};

JCSmartFilter.prototype.hideFilterProps = function (element) {
  var obj = element.parentNode,
    filterBlock = obj.querySelector("[data-role='bx_filter_block']"),
    propAngle = obj.querySelector("[data-role='prop_angle']");

  if (BX.hasClass(obj, 'bx-active')) {
    new BX.easing({
      duration: 300,
      start: { opacity: 1, height: filterBlock.offsetHeight },
      finish: { opacity: 0, height: 0 },
      transition: BX.easing.transitions.quart,
      step: function (state) {
        filterBlock.style.opacity = state.opacity;
        filterBlock.style.height = state.height + 'px';
      },
      complete: function () {
        filterBlock.setAttribute('style', '');
        BX.removeClass(obj, 'bx-active');
      },
    }).animate();

    BX.addClass(propAngle, 'fa-angle-down');
    BX.removeClass(propAngle, 'fa-angle-up');
  } else {
    filterBlock.style.display = 'block';
    filterBlock.style.opacity = 0;
    filterBlock.style.height = 'auto';

    var obj_children_height = filterBlock.offsetHeight;
    filterBlock.style.height = 0;

    new BX.easing({
      duration: 300,
      start: { opacity: 0, height: 0 },
      finish: { opacity: 1, height: obj_children_height },
      transition: BX.easing.transitions.quart,
      step: function (state) {
        filterBlock.style.opacity = state.opacity;
        filterBlock.style.height = state.height + 'px';
      },
      complete: function () {},
    }).animate();

    BX.addClass(obj, 'bx-active');
    BX.removeClass(propAngle, 'fa-angle-down');
    BX.addClass(propAngle, 'fa-angle-up');
  }
};

JCSmartFilter.prototype.showDropDownPopup = function (element, popupId) {
  var contentNode = element.querySelector('[data-role="dropdownContent"]');
  this.popups['smartFilterDropDown' + popupId] = BX.PopupWindowManager.create('smartFilterDropDown' + popupId, element, {
    autoHide: true,
    offsetLeft: 0,
    offsetTop: 3,
    overlay: false,
    draggable: { restrict: true },
    closeByEsc: true,
    content: BX.clone(contentNode),
  });
  this.popups['smartFilterDropDown' + popupId].show();
};

JCSmartFilter.prototype.selectDropDownItem = function (element, controlId) {
  this.keyup(BX(controlId));

  var wrapContainer = BX.findParent(BX(controlId), { className: 'bx-filter-select-container' }, false);

  var currentOption = wrapContainer.querySelector('[data-role="currentOption"]');
  currentOption.innerHTML = element.innerHTML;
  BX.PopupWindowManager.getCurrentPopup().close();
};

// кастомная реализация ajax
$(document).on('submit', '.smartfilter', function (event) {
  event.preventDefault();
  const form = document.querySelector('.smartfilter');
  // 2. Считываем все поля формы
  const formData = new FormData(form);

  // 3. Преобразуем в удобный для логирования вид
  const entries = Array.from(formData.entries())
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  // 4. Выводим в консоль
  console.log('Данные формы:', entries);

  fetch(form.action + '?' + entries + '&set_filter=Подобрать', {
    method: form.method.toUpperCase(),
    headers: {
      Accept: 'text/html',
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Ошибка сети: ${response.status}`);
      }
      return response.text();
    })
    .then((htmlString) => {
      // 1. Парсим строку с HTML в документ
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, 'text/html');

      // 2. Находим в новом документе нужные элементы
      const newItemsRow = doc.querySelector('.items-row.flex-row');
      const newSidebar = doc.querySelector('.products-sidebar-filter-body');
      const newPagination = doc.querySelector('.read-more-btn-wrapp');

      // 3. Находим текущие элементы на странице
      const currentItemsRow = document.querySelector('.items-row.flex-row');
      const currentSidebar = document.querySelector('.products-sidebar-filter-body');
      const currentPagination = document.querySelector('.read-more-btn-wrapp');

      // 4. Если всё нашлось — заменяем
      if (newItemsRow && currentItemsRow) {
        currentItemsRow.replaceWith(newItemsRow);
      } else {
        console.warn('Не удалось заменить .items-row.flex-row');
      }

      if (newSidebar && currentSidebar) {
        currentSidebar.replaceWith(newSidebar);
      } else {
        console.warn('Не удалось заменить .products-sidebar-filter-body');
      }

      if (newPagination && currentPagination) {
        currentPagination.replaceWith(newPagination);
        console.log('заменили пагинацию');
      } else {
        console.warn('Не удалось заменить пагинацию');
      }

      console.log('Обновление фильтра выполнено');
    })
    .catch((err) => console.error('Fetch Error:', err));
});

BX.namespace('BX.Iblock.SmartFilter');
BX.Iblock.SmartFilter = (function () {
  /** @param {{
                leftSlider: string,
                rightSlider: string,
                tracker: string,
                trackerWrap: string,
                minInputId: string,
                maxInputId: string,
                minPrice: float|int|string,
                maxPrice: float|int|string,
                curMinPrice: float|int|string,
                curMaxPrice: float|int|string,
                fltMinPrice: float|int|string|null,
                fltMaxPrice: float|int|string|null,
                precision: int|null,
                colorUnavailableActive: string,
                colorAvailableActive: string,
                colorAvailableInactive: string
            }} arParams
         */
  var SmartFilter = function (arParams) {
    if (typeof arParams === 'object') {
      this.leftSlider = BX(arParams.leftSlider);
      this.rightSlider = BX(arParams.rightSlider);
      this.tracker = BX(arParams.tracker);
      this.trackerWrap = BX(arParams.trackerWrap);

      this.minInput = BX(arParams.minInputId);
      this.maxInput = BX(arParams.maxInputId);

      this.minPrice = parseFloat(arParams.minPrice);
      this.maxPrice = parseFloat(arParams.maxPrice);

      this.curMinPrice = parseFloat(arParams.curMinPrice);
      this.curMaxPrice = parseFloat(arParams.curMaxPrice);

      this.fltMinPrice = arParams.fltMinPrice ? parseFloat(arParams.fltMinPrice) : parseFloat(arParams.curMinPrice);
      this.fltMaxPrice = arParams.fltMaxPrice ? parseFloat(arParams.fltMaxPrice) : parseFloat(arParams.curMaxPrice);

      this.precision = arParams.precision || 0;

      this.priceDiff = this.maxPrice - this.minPrice;

      this.leftPercent = 0;
      this.rightPercent = 0;

      this.fltMinPercent = 0;
      this.fltMaxPercent = 0;

      this.colorUnavailableActive = BX(arParams.colorUnavailableActive); //gray
      this.colorAvailableActive = BX(arParams.colorAvailableActive); //blue
      this.colorAvailableInactive = BX(arParams.colorAvailableInactive); //light blue

      this.isTouch = false;

      this.init();

      if ('ontouchstart' in document.documentElement) {
        this.isTouch = true;

        BX.bind(
          this.leftSlider,
          'touchstart',
          BX.proxy(function (event) {
            this.onMoveLeftSlider(event);
          }, this)
        );

        BX.bind(
          this.rightSlider,
          'touchstart',
          BX.proxy(function (event) {
            this.onMoveRightSlider(event);
          }, this)
        );
      } else {
        BX.bind(
          this.leftSlider,
          'mousedown',
          BX.proxy(function (event) {
            this.onMoveLeftSlider(event);
          }, this)
        );

        BX.bind(
          this.rightSlider,
          'mousedown',
          BX.proxy(function (event) {
            this.onMoveRightSlider(event);
          }, this)
        );
      }

      BX.bind(
        this.minInput,
        'keyup',
        BX.proxy(function (event) {
          this.onInputChange();
        }, this)
      );

      BX.bind(
        this.maxInput,
        'keyup',
        BX.proxy(function (event) {
          this.onInputChange();
        }, this)
      );
    }
  };

  SmartFilter.prototype.init = function () {
    var priceDiff;

    if (this.curMinPrice > this.minPrice) {
      priceDiff = this.curMinPrice - this.minPrice;
      this.leftPercent = (priceDiff * 100) / this.priceDiff;

      this.leftSlider.style.left = this.leftPercent + '%';
      this.colorUnavailableActive.style.left = this.leftPercent + '%';
    }

    this.setMinFilteredValue(this.fltMinPrice);

    if (this.curMaxPrice < this.maxPrice) {
      priceDiff = this.maxPrice - this.curMaxPrice;
      this.rightPercent = (priceDiff * 100) / this.priceDiff;

      this.rightSlider.style.right = this.rightPercent + '%';
      this.colorUnavailableActive.style.right = this.rightPercent + '%';
    }

    this.setMaxFilteredValue(this.fltMaxPrice);
  };

  SmartFilter.prototype.setMinFilteredValue = function (fltMinPrice) {
    this.fltMinPrice = parseFloat(fltMinPrice);
    if (this.fltMinPrice >= this.minPrice) {
      var priceDiff = this.fltMinPrice - this.minPrice;
      this.fltMinPercent = (priceDiff * 100) / this.priceDiff;

      if (this.leftPercent > this.fltMinPercent) this.colorAvailableActive.style.left = this.leftPercent + '%';
      else this.colorAvailableActive.style.left = this.fltMinPercent + '%';

      this.colorAvailableInactive.style.left = this.fltMinPercent + '%';
    } else {
      this.colorAvailableActive.style.left = '0%';
      this.colorAvailableInactive.style.left = '0%';
    }
  };

  SmartFilter.prototype.setMaxFilteredValue = function (fltMaxPrice) {
    this.fltMaxPrice = parseFloat(fltMaxPrice);
    if (this.fltMaxPrice <= this.maxPrice) {
      var priceDiff = this.maxPrice - this.fltMaxPrice;
      this.fltMaxPercent = (priceDiff * 100) / this.priceDiff;

      if (this.rightPercent > this.fltMaxPercent) this.colorAvailableActive.style.right = this.rightPercent + '%';
      else this.colorAvailableActive.style.right = this.fltMaxPercent + '%';

      this.colorAvailableInactive.style.right = this.fltMaxPercent + '%';
    } else {
      this.colorAvailableActive.style.right = '0%';
      this.colorAvailableInactive.style.right = '0%';
    }
  };

  SmartFilter.prototype.getXCoord = function (elem) {
    var box = elem.getBoundingClientRect();
    var body = document.body;
    var docElem = document.documentElement;

    var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
    var clientLeft = docElem.clientLeft || body.clientLeft || 0;
    var left = box.left + scrollLeft - clientLeft;

    return Math.round(left);
  };

  SmartFilter.prototype.getPageX = function (e) {
    e = e || window.event;
    var pageX = null;

    if (this.isTouch && event.targetTouches[0] != null) {
      pageX = e.targetTouches[0].pageX;
    } else if (e.pageX != null) {
      pageX = e.pageX;
    } else if (e.clientX != null) {
      var html = document.documentElement;
      var body = document.body;

      pageX = e.clientX + (html.scrollLeft || (body && body.scrollLeft) || 0);
      pageX -= html.clientLeft || 0;
    }

    return pageX;
  };

  SmartFilter.prototype.recountMinPrice = function () {
    var newMinPrice = (this.priceDiff * this.leftPercent) / 100;
    newMinPrice = (this.minPrice + newMinPrice).toFixed(this.precision);

    if (newMinPrice != this.minPrice) this.minInput.value = newMinPrice;
    else this.minInput.value = '';
    /** @global JCSmartFilter smartFilter */
    smartFilter.keyup(this.minInput);
  };

  SmartFilter.prototype.recountMaxPrice = function () {
    var newMaxPrice = (this.priceDiff * this.rightPercent) / 100;
    newMaxPrice = (this.maxPrice - newMaxPrice).toFixed(this.precision);

    if (newMaxPrice != this.maxPrice) this.maxInput.value = newMaxPrice;
    else this.maxInput.value = '';
    /** @global JCSmartFilter smartFilter */
    smartFilter.keyup(this.maxInput);
  };

  SmartFilter.prototype.onInputChange = function () {
    var priceDiff;
    if (this.minInput.value) {
      var leftInputValue = this.minInput.value;
      if (leftInputValue < this.minPrice) leftInputValue = this.minPrice;

      if (leftInputValue > this.maxPrice) leftInputValue = this.maxPrice;

      priceDiff = leftInputValue - this.minPrice;
      this.leftPercent = (priceDiff * 100) / this.priceDiff;

      this.makeLeftSliderMove(false);
    }

    if (this.maxInput.value) {
      var rightInputValue = this.maxInput.value;
      if (rightInputValue < this.minPrice) rightInputValue = this.minPrice;

      if (rightInputValue > this.maxPrice) rightInputValue = this.maxPrice;

      priceDiff = this.maxPrice - rightInputValue;
      this.rightPercent = (priceDiff * 100) / this.priceDiff;

      this.makeRightSliderMove(false);
    }
  };

  SmartFilter.prototype.makeLeftSliderMove = function (recountPrice) {
    recountPrice = recountPrice !== false;

    this.leftSlider.style.left = this.leftPercent + '%';
    this.colorUnavailableActive.style.left = this.leftPercent + '%';

    var areBothSlidersMoving = false;
    if (this.leftPercent + this.rightPercent >= 100) {
      areBothSlidersMoving = true;
      this.rightPercent = 100 - this.leftPercent;
      this.rightSlider.style.right = this.rightPercent + '%';
      this.colorUnavailableActive.style.right = this.rightPercent + '%';
    }

    if (this.leftPercent >= this.fltMinPercent && this.leftPercent <= 100 - this.fltMaxPercent) {
      this.colorAvailableActive.style.left = this.leftPercent + '%';
      if (areBothSlidersMoving) {
        this.colorAvailableActive.style.right = 100 - this.leftPercent + '%';
      }
    } else if (this.leftPercent <= this.fltMinPercent) {
      this.colorAvailableActive.style.left = this.fltMinPercent + '%';
      if (areBothSlidersMoving) {
        this.colorAvailableActive.style.right = 100 - this.fltMinPercent + '%';
      }
    } else if (this.leftPercent >= this.fltMaxPercent) {
      this.colorAvailableActive.style.left = 100 - this.fltMaxPercent + '%';
      if (areBothSlidersMoving) {
        this.colorAvailableActive.style.right = this.fltMaxPercent + '%';
      }
    }

    if (recountPrice) {
      this.recountMinPrice();
      if (areBothSlidersMoving) this.recountMaxPrice();
    }
  };

  SmartFilter.prototype.countNewLeft = function (event) {
    var pageX = this.getPageX(event);

    var trackerXCoord = this.getXCoord(this.trackerWrap);
    var rightEdge = this.trackerWrap.offsetWidth;

    var newLeft = pageX - trackerXCoord;

    if (newLeft < 0) newLeft = 0;
    else if (newLeft > rightEdge) newLeft = rightEdge;

    return newLeft;
  };

  SmartFilter.prototype.onMoveLeftSlider = function (e) {
    if (!this.isTouch) {
      this.leftSlider.ondragstart = function () {
        return false;
      };
    }

    if (!this.isTouch) {
      document.onmousemove = BX.proxy(function (event) {
        this.leftPercent = (this.countNewLeft(event) * 100) / this.trackerWrap.offsetWidth;
        this.makeLeftSliderMove();
      }, this);

      document.onmouseup = function () {
        document.onmousemove = document.onmouseup = null;
      };
    } else {
      document.ontouchmove = BX.proxy(function (event) {
        this.leftPercent = (this.countNewLeft(event) * 100) / this.trackerWrap.offsetWidth;
        this.makeLeftSliderMove();
      }, this);

      document.ontouchend = function () {
        document.ontouchmove = document.touchend = null;
      };
    }

    return false;
  };

  SmartFilter.prototype.makeRightSliderMove = function (recountPrice) {
    recountPrice = recountPrice !== false;

    this.rightSlider.style.right = this.rightPercent + '%';
    this.colorUnavailableActive.style.right = this.rightPercent + '%';

    var areBothSlidersMoving = false;
    if (this.leftPercent + this.rightPercent >= 100) {
      areBothSlidersMoving = true;
      this.leftPercent = 100 - this.rightPercent;
      this.leftSlider.style.left = this.leftPercent + '%';
      this.colorUnavailableActive.style.left = this.leftPercent + '%';
    }

    if (100 - this.rightPercent >= this.fltMinPercent && this.rightPercent >= this.fltMaxPercent) {
      this.colorAvailableActive.style.right = this.rightPercent + '%';
      if (areBothSlidersMoving) {
        this.colorAvailableActive.style.left = 100 - this.rightPercent + '%';
      }
    } else if (this.rightPercent <= this.fltMaxPercent) {
      this.colorAvailableActive.style.right = this.fltMaxPercent + '%';
      if (areBothSlidersMoving) {
        this.colorAvailableActive.style.left = 100 - this.fltMaxPercent + '%';
      }
    } else if (100 - this.rightPercent <= this.fltMinPercent) {
      this.colorAvailableActive.style.right = 100 - this.fltMinPercent + '%';
      if (areBothSlidersMoving) {
        this.colorAvailableActive.style.left = this.fltMinPercent + '%';
      }
    }

    if (recountPrice) {
      this.recountMaxPrice();
      if (areBothSlidersMoving) this.recountMinPrice();
    }
  };

  SmartFilter.prototype.onMoveRightSlider = function (e) {
    if (!this.isTouch) {
      this.rightSlider.ondragstart = function () {
        return false;
      };
    }

    if (!this.isTouch) {
      document.onmousemove = BX.proxy(function (event) {
        this.rightPercent = 100 - (this.countNewLeft(event) * 100) / this.trackerWrap.offsetWidth;
        this.makeRightSliderMove();
      }, this);

      document.onmouseup = function () {
        document.onmousemove = document.onmouseup = null;
      };
    } else {
      document.ontouchmove = BX.proxy(function (event) {
        this.rightPercent = 100 - (this.countNewLeft(event) * 100) / this.trackerWrap.offsetWidth;
        this.makeRightSliderMove();
      }, this);

      document.ontouchend = function () {
        document.ontouchmove = document.ontouchend = null;
      };
    }

    return false;
  };

  return SmartFilter;
})();

document.addEventListener('DOMContentLoaded', () => {
  $(document).on('click', '.toggle-list-button', function () {
    const btn = $(this);
    const container = btn.closest('.products-sidebar-item');
    const list = container.find('ul.ul-filter-listnew');
    const items = list.find('li');
    const idx = parseInt(list.data('listIndex'), 10);

    if (!list.length) return; // Если список не найден, выходим

    // Определяем максимальное количество видимых элементов (можно задать глобально)
    const maxVisible = 6;

    // Функция обновления списка и cookie
    function updateList(expanded) {
      items.each(function (i) {
        if (i >= maxVisible) {
          $(this).css('display', expanded ? '' : 'none');
        }
      });
      btn.find('span').text(expanded ? 'Скрыть' : 'Показать все');
      // Добавьте логику для смены иконки, если необходимо
      if (expanded) {
        btn.find('svg').css('transform', 'rotate(180deg)');
      } else {
        btn.find('svg').css('transform', '');
      }

      // Обновляем состояние в JS и в cookie
      window.hideULStates = window.hideULStates || {};
      window.hideULStates[idx] = expanded;
      console.log(idx, expanded);
      document.cookie = 'hideULStates=' + encodeURIComponent(JSON.stringify(window.hideULStates)) + '; path=/';
      console.log(window.hideULStates);
    }

    // Переключаем состояние и вызываем обновление списка
    const isExpanded = btn.data('expanded') === true;
    btn.data('expanded', !isExpanded);
    updateList(!isExpanded);
  });

  // Глобальный объект для хранения состояний поиска (инициализируется из PHP)
  window.searchFilterStates = window.searchFilterStates || [];

  // Функция для сохранения состояния поиска в session cookie
  // (Cookie без 'expires' удаляется при закрытии браузера)
  function setSearchCookie() {
    // Используем encodeURIComponent для корректной обработки спецсимволов
    console.log(window.searchFilterStates, JSON.stringify(window.searchFilterStates));
    document.cookie = 'searchFilterStates=' + encodeURIComponent(JSON.stringify(window.searchFilterStates)) + '; path=/; SameSite=Lax';
    console.log(document.cookie);
    // console.log('Search state cookie updated:', document.cookie); // Для отладки
  }

  // Обработчик ввода текста в поле поиска
  $(document).on('input', '.product-sidebar-search', function () {
    const input = $(this);
    const searchTerm = input.val().toLowerCase().trim(); // Текст поиска в нижнем регистре
    const listIndex = input.data('listIndex'); // Идентификатор списка (из data-атрибута)
    const wrapper = input.closest('.products-sidebar-item'); // Родительский элемент свойства
    // Находим конкретный список ul по data-атрибуту
    const list = wrapper.find('ul.ul-filter-listnew[data-list-index="' + listIndex + '"]');
    const items = list.find('li'); // Все элементы списка (чекбоксы)
    const clearIcon = input.siblings('.clear-icon'); // Иконка очистки рядом с input

    // Фильтрация элементов списка
    items.each(function () {
      const item = $(this);
      // Ищем текст внутри элемента (предполагаем, что он в .products-filter-checkbox-title)
      const label = item.find('.products-filter-checkbox-title');
      const itemText = label.text().toLowerCase(); // Текст элемента в нижнем регистре

      // Показываем/скрываем элемент в зависимости от совпадения с поисковым запросом
      if (itemText.includes(searchTerm)) {
        item.show(); // Показать, если текст содержит поисковый запрос
      } else {
        item.hide(); // Скрыть, если не содержит
      }
    });

    // Показать/скрыть иконку очистки
    if (searchTerm) {
      clearIcon.show();
    } else {
      clearIcon.hide();
    }

    // Обновляем состояние в глобальном объекте JS
    if (searchTerm) {
      window.searchFilterStates[listIndex] = input.val(); // Сохраняем оригинальное значение
    } else {
      // Удаляем ключ из объекта, если поле поиска очищено
      delete window.searchFilterStates[listIndex];
    }
    // Сохраняем обновленное состояние в cookie
    setSearchCookie();
  });

  // Обработчик клика по иконке очистки
  $(document).on('click', '.clear-icon', function () {
    const clearIcon = $(this);
    const input = clearIcon.siblings('.product-sidebar-search'); // Находим связанное поле ввода

    if (input.length) {
      input.val(''); // Очищаем поле ввода
      // Генерируем событие 'input', чтобы запустить логику фильтрации и обновления cookie
      input.trigger('input');
    }
  });

  // Применить фильтрацию при загрузке страницы, если поля поиска были заполнены из cookie
  $('.product-sidebar-search').each(function () {
    if ($(this).val()) {
      // Запускаем обработчик 'input', чтобы отфильтровать список согласно значению из cookie
      $(this).trigger('input');
    }
  });

  // --- КОНЕЦ: Добавленный код для поиска и сохранения состояния ---
  $(document).on('click', '.reset-filter-button', function () {
    // 1. Находим ближайшего родителя с классом 'products-sidebar-item-list'
    //    относительно нажатой кнопки 'this'
    const $parentList = $(this).closest('.products-sidebar-item-list-wrapp');

    // 2. Внутри найденного родителя ($parentList) находим все чекбоксы
    //    и снимаем с них галочки
    console.log($parentList);
    $parentList.find('input[type="checkbox"]').prop('checked', false);

    // 3. Внутри того же родителя ($parentList) находим кнопку '.submitstart'
    //    и вызываем на ней событие click
    $('.submitstart').click();

    // Альтернативный вариант для клика:
    // $parentList.find('.submitstart').trigger('click');
  });
});

document.addEventListener('DOMContentLoaded', () => {
  let sidebar = document.querySelector('.products-sidebar-filter');
  let sidebarHeight = sidebar.offsetHeight;
  if (!sidebar) {
    console.error('Элемент сайдбара ".products-sidebar-filter" не найден!');
    return;
  }

  const maxTop = 120;
  let minTop = calculateMinTop();
  let lastKnownScrollY = window.pageYOffset;
  let ticking = false; // Флаг, чтобы избежать множественных запросов RAF

  function calculateMinTop() {
    sidebar = document.querySelector('.products-sidebar-filter');
    // Убедимся, что высота сайдбара актуальна (может меняться)
    const sidebarHeight = sidebar.offsetHeight;
    // Важно: Учитываем начальный отступ maxTop при расчете нижней границы
    // Когда top = minTop, низ сайдбара должен быть у низа окна.
    // window.innerHeight = sidebar.offsetTop + sidebarHeight
    // sidebar.offsetTop в нашем случае это minTop
    // minTop = window.innerHeight - sidebarHeight
    // Но также minTop не должен быть больше maxTop
    return Math.min(maxTop, window.innerHeight - sidebarHeight);
  }

  // Устанавливаем начальную позицию
  sidebar.style.top = maxTop + 'px';

  function updateSidebarPosition() {
    sidebar = document.querySelector('.products-sidebar-filter');

    if (sidebarHeight !== sidebar.offsetHeight) {
      sidebarHeight = sidebar.offsetHeight;
      minTop = calculateMinTop();
    }
    // Получаем текущее значение top
    const currentTop = parseFloat(sidebar.style.top);
    if (isNaN(currentTop)) {
      // Если что-то пошло не так, просто сбросим
      sidebar.style.top = maxTop + 'px';
      lastKnownScrollY = window.pageYOffset; // Обновим lastKnownScrollY
      return; // Выходим из обновления
    }

    // Получаем текущую прокрутку (из RAF, а не прямо из события)
    const currentY = lastKnownScrollY; // Используем сохраненное значение
    // Вычисляем изменение прокрутки (можно было бы и без prevY, но оставим для ясности)
    // Важно: нужно хранить предыдущее значение top ИЛИ предыдущее значение Y
    // Давайте хранить предыдущее Y (уже есть в lastKnownScrollY) и вычислять дельту
    // Для расчета дельты нужен `prevY` из предыдущего вызова *этой* функции, а не глобальный
    // Проще пересчитать top на основе *текущей* прокрутки без дельты:

    // Логика немного меняется: мы не двигаем относительно *предыдущего* top,
    // а вычисляем *абсолютный* top для *текущего* скролла.
    // Это сложнее с текущей логикой min/max top.

    // --- Вернемся к логике с дельтой, но внутри RAF ---
    // Нужно где-то хранить prevY, который обновляется только *после* расчета в RAF
    // Добавим переменную для этого:
    // let framePrevY = window.pageYOffset; // Инициализируем в начале

    // --- Или проще: оставим оригинальную логику с дельтой, но вызов делаем через RAF ---
    // Значение prevY будет обновляться только когда RAF выполнится

    const scrollDelta = currentY - prevY; // prevY обновляется в конце этой функции

    let newTop = currentTop - scrollDelta;
    newTop = Math.max(minTop, Math.min(maxTop, newTop));
    sidebar.style.top = newTop + 'px';

    prevY = currentY; // Обновляем prevY для следующего вызова RAF

    // Сбрасываем флаг после выполнения
    ticking = false;
  }

  // Обработчик события scroll
  function onScroll() {
    sidebar = document.querySelector('.products-sidebar-filter');

    lastKnownScrollY = window.pageYOffset; // Обновляем последнее известное значение Y

    if (!ticking) {
      window.requestAnimationFrame(() => {
        // Вычисляем minTop здесь, т.к. высота могла измениться (хотя лучше на resize)
        // minTop = calculateMinTop(); // Можно пересчитывать, если нужно
        updateSidebarPosition(); // Вызываем основную логику обновления
        ticking = false; // Сбрасываем флаг здесь, внутри RAF callback
      });
      ticking = true; // Устанавливаем флаг, что RAF запланирован
    }
  }

  // Обработчик ресайза
  function handleResize() {
    sidebar = document.querySelector('.products-sidebar-filter');

    minTop = calculateMinTop(); // Пересчитываем minTop

    // Принудительно обновляем позицию, так как границы изменились
    // Можно вызвать напрямую или через RAF для консистентности
    lastKnownScrollY = window.pageYOffset; // Обновим Y на всякий случай
    prevY = lastKnownScrollY; // Синхронизируем prevY
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateSidebarPosition();
        ticking = false;
      });
      ticking = true;
    }
    // Или просто вызвать напрямую, т.к. resize редкое событие:
    // updateSidebarPosition();
  }

  // --- Инициализация ---
  minTop = calculateMinTop(); // Начальный расчет minTop
  let prevY = window.pageYOffset; // Инициализация prevY
  sidebar.style.top = maxTop + 'px'; // Начальная позиция

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', handleResize);

  // Вызываем один раз при загрузке
  prevY = window.pageYOffset; // Убедимся, что prevY актуален
  updateSidebarPosition();
});

/**
 * Устанавливает ширину всех элементов .tooltip-content-wrapp равной
 * ширине элемента .products-sidebar-filter-body.
 */
function syncTooltipWidths() {
  // Находим элемент-источник, чью ширину мы будем использовать
  const sourceElement = document.querySelector('.products-sidebar-filter-body');

  // Находим все элементы-цели, которым нужно установить ширину
  const targetElements = document.querySelectorAll('.tooltip-content-wrapp');

  // Проверяем, найдены ли оба типа элементов
  if (!sourceElement) {
    console.warn("Элемент с классом 'products-sidebar-filter-body' не найден.");
    return; // Выходим, если источник не найден
  }

  if (targetElements.length === 0) {
    // Это может быть нормально, если на странице нет тултипов,
    // но можно вывести предупреждение для отладки
    // console.warn("Элементы с классом 'tooltip-content-wrapp' не найдены.");
    return; // Выходим, если цели не найдены
  }

  // Получаем актуальную ширину элемента-источника
  // offsetWidth включает padding и border, что обычно нужно для визуальной синхронизации
  const sourceWidth = sourceElement.offsetWidth;

  // Устанавливаем полученную ширину каждому элементу-цели
  targetElements.forEach((target) => {
    target.style.width = `${sourceWidth}px`;

    if (window.innerWidth <= 1024) {
      target.style.width = `${sourceWidth - 35}px`;
    }
  });
}

/**
 * Функция-обертка для задержки выполнения (Debounce).
 * Позволяет вызывать переданную функцию только один раз
 * через `wait` миллисекунд после последнего вызова обертки.
 * Это предотвращает слишком частые вызовы функции при ресайзе.
 *
 * @param {function} func Функция, которую нужно вызывать с задержкой.
 * @param {number} wait Время ожидания в миллисекундах.
 * @returns {function} Обернутая функция с задержкой.
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func.apply(this, args); // Вызываем оригинальную функцию
    };
    clearTimeout(timeout); // Сбрасываем предыдущий таймер, если он был
    timeout = setTimeout(later, wait); // Устанавливаем новый таймер
  };
}

// --- Инициализация ---

// 1. Вызываем функцию сразу при загрузке DOM (обычно этого достаточно)
document.addEventListener('DOMContentLoaded', syncTooltipWidths);

// ИЛИ, если ширина 'products-sidebar-filter-body' зависит от загрузки
// изображений или стилей, можно использовать 'load':
// window.addEventListener('load', syncTooltipWidths);

// 2. Создаем "задержанную" версию нашей функции для ресайза
//    Задержка в 250 мс - хорошее значение по умолчанию
const debouncedSyncTooltipWidths = debounce(syncTooltipWidths, 250);

// 3. Добавляем слушатель события ресайза окна,
//    который будет вызывать задержанную функцию
window.addEventListener('resize', debouncedSyncTooltipWidths);

// --- Пример использования ---
// Просто подключите этот скрипт к вашей HTML странице.
// Убедитесь, что элементы с классами '.products-sidebar-filter-body'
// и '.tooltip-content-wrapp' существуют на странице к моменту
// выполнения скрипта (обычно это так, если скрипт подключен в конце body
// или используется DOMContentLoaded).

document.addEventListener('DOMContentLoaded', function () {
  // Находим первый элемент нужного фильтра (здесь по селектору .tooltip)
  const firstFilter = document.querySelector('.tooltip');
  // Находим элемент, для которого требуется изменить z-index
  const sidebarFilter = document.querySelector('.products-sidebar-filter');

  if (firstFilter && sidebarFilter) {
    firstFilter.addEventListener('mouseenter', function () {
      // При наведении задаём нужный z-index
      sidebarFilter.style.zIndex = '666';
    });

    firstFilter.addEventListener('mouseleave', function () {
      // При уходе мыши сбрасываем z-index до исходного значения
      sidebarFilter.style.zIndex = '';
    });
  }
});
