window.loadAnimations = function() {

  initPlugins();

  $(document).on('click', '.js-diag-button-save', function () {});

  var mainSliderTop = $('.js-main-slider');

  mainSliderTop.on('init', function (event, slick, currentSlide) {
    var thumb = $('.m-slider__slide').eq(0).data('thumb');
    $('.js-background-main').css('background-image', 'url(' + thumb + ')');
  });

  mainSliderTop.slick({
    vertical: true,
    verticalSwiping: true,
    dots: true,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 2000,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1
  });

  mainSliderTop.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
    var thumb = $('.m-slider__slide').eq(nextSlide).data('thumb');
    var $background = $('.js-background-main');
    $background.animate({opacity: 0}, 100, function () {
      $background
        .css('background-image', 'url(' + thumb + ')')
        .animate({opacity: 1}, 200);
    });
  });

  $('.js-events-slider').slick({
    dots: true,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 2000,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1
  });

  $('.js-items-top-slider').slick({
    arrows: true,
    autoplay: true,
    autoplaySpeed: 4500,
    speed: 1000,
    slidesToShow: 2,
    slidesToScroll: 2,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          dots: true,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          dots: true,
          arrows: false
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
          arrows: false
        }
      }
    ]
  });

  $('.js-items-bottom-slider').slick({
    arrows: true,
    autoplay: true,
    autoplaySpeed: 4500,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          dots: true,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          dots: true,
          arrows: false
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
          arrows: false
        }
      }
    ]
  });

  $('.js-detail-slider').owlCarousel({
    items: 1,
    dotsEach: true,
    onInitialized: customPagerDetail
  });

  function customPagerDetail() {
    var $parent = $(this.$element);
    this._items.forEach(function (item, i) {
      var thumb = $parent.find('.owl-item:not(.cloned) .detail-slider__item').eq(i).data('thumb');
      var $dot = $parent.find('.owl-dot').eq(i);
      $dot.css({
        'backgroundImage': 'url(' + thumb + ')'
      });
    })
  }

  $('.js-garden-top-slider').slick({
    dots: true,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToScroll: 1,
    slidesToShow: 1,
    adaptiveHeight: true
  });

  $('.js-garden-filters-slider').owlCarousel({
    margin: 7,
    items: 7,
    responsive: {
      0: {
        items: 2,
        dots: true,
        mouseDrag: true,
        touchDrag: true
      },
      450: {
        items: 3,
        dots: true,
        mouseDrag: true,
        touchDrag: true
      },
      600: {
        items: 4,
        dots: true,
        mouseDrag: true,
        touchDrag: true
      },
      768: {
        items: 5,
        dots: true,
        mouseDrag: true,
        touchDrag: true
      },
      992: {
        items: 7,
        mouseDrag: false,
        touchDrag: false
      }
    }
  });

  $('.js-garden-brands-slider').owlCarousel({
    margin: 10,
    items: 7,
    loop: true,
    nav: true,
    responsive: {
      0: {
        items: 2,
        dots: true,
        mouseDrag: true,
        touchDrag: true,
        nav: false,
      },
      450: {
        items: 3,
        dots: true,
        mouseDrag: true,
        touchDrag: true,
        nav: false,
      },
      600: {
        items: 4,
        dots: true,
        mouseDrag: true,
        touchDrag: true,
        nav: false,
      },
      768: {
        items: 5,
        dots: true,
        mouseDrag: true,
        touchDrag: true,
        nav: false,
      },
      992: {
        items: 7,
        mouseDrag: false,
        touchDrag: false
      }
    }
  });

  $('.js-garden-season-slider').slick({
    arrows: true,
    autoplay: true,
    autoplaySpeed: 2000,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          dots: true,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          dots: true,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
          arrows: false
        }
      }
    ]
  });
  $(".js-ajax-ad-filter").on("change", function () {
    var $this = $(this),
      val = $this.val();
    $.ajax({
      url: location.href,
      dataType: 'html',
      type: 'POST',
      data: {
        "CODE": val,
      },
      error: function (data) {
        console.log('ERROR SENDAJAX');
      }
    }).done(function (data) {
      console.log(data);
      $(".js-ajax").html($(data).find(".js-ajax").html());
      $(".js-fancy").fancybox();
    });

  });
  $(".js-fancy").fancybox();

  $(document).on('click', '.js-show-form', function (e) {
    e.preventDefault();
    var $this = $(this);

    var data = {
      "template": $this.attr("data-template"),
    };
    SendAjax('SHOW_FORM', data, function (data) {
      $modal = $("#Modal");
      $modal.html(data.html);
      $modal.modal();
    });
  });
  $("body").on("submit", ".js-adve-form-submit", function (e) {
    e.preventDefault();
    var $this = $(this);
    if (!myValidateForm($this)) {
      return false;
    }
    var $data = $this.serializeObject();

    SendAjax("SEND_ADVE_FORM", $data, function (data) {
      console.log(data);
      $this.closest("#Modal").find(".b-modal__text").html(data.html);
      $this.remove();
    });
  });

  $("body").on("submit", ".js-diag-form-submit", function (e) {
    e.preventDefault();
    var $this = $(this);
    if (!diagnosticAccessValidateForm($this)) {
      return false;
    }
    var $data = $this.serializeObject();
    SendAjax("SEND_DIAG_FORM", $data, function (data) {
      $this.closest("#Modal").find(".b-modal__text").html(data.html);
      $this.remove();
    });
  });
};

$(document).ready(function () {
  window.loadAnimations();
});


var Common = (function () {
  var scrollToElement = function () {
    $(document).on("click", ".js-scroll-to-element", function (e) {
      var $this = $(this),
          id = $this.attr("href"),
          $el = $(id),
          top = $el.offset().top - 110;
      $("html, body").animate({scrollTop: top}, 500, function () {
        location.hash = $el.attr("id");
      });
      e.preventDefault();
    });
  };

  var showPassword = function () {
    $(document).on("click", ".js-show-password", function () {
      var $this = $(this),
          $input = $this.parent().find("input");
      if (!$this.hasClass("is-open")) {
        $input.attr("type", "text");
      } else {
        $input.attr("type", "password");
      }
      $this.toggleClass("is-open");
    });
  };

  var getRegions = function () {
    $(document).on('change', '.js-country', function () {
      var $this = $(this);
      var countryId = $this.val();
      if (!countryId) {
        return false;
      }

      var $region = $('#region');
      SendAjax("GET_REGIONS", {countryId: countryId}, function (data) {
        var regions = data;
        $region.children().remove();
        if (regions.length) {
          $region.append('<option value="">' + "Выберите регион" + '</option>');
          $.each(regions, function (index, el) {
            $region.append('<option value="' + el.ID + '">' + el.NAME + '</option>');
          });
          $region.removeClass('hide').trigger('refresh');
        } else {
          $region.append('<option value="">' + "Выберите регион" + '</option>');
          $region.removeClass('hide').trigger('refresh');
        }
      });
    });
  };

  var sendGoal = function () {
    $(document).on('click', '[data-goal]', function () {
      var target = $(this).data('goal');
      sendYandexGoal(target);
    });
  };

  var init = function () {
    scrollToElement();
    showPassword();
    getRegions();
    sendGoal();
  };

  return {
    init: init
  }
}());
$(function () {
  Common.init();
});

var Header = (function () {
  var scrolled = function () {
    if ($(window).scrollTop() > 0) {
      $('.js-header').addClass('is-scroll');
    } else {
      $('.js-header').removeClass('is-scroll');
    }
  };

  var init = function () {
    scrolled();
    $(window).scroll(function () {
      scrolled();
    });
    $(window).resize(function () {
      scrolled();
    });
  };

  return {
    init: init
  }
})();
$(function () {
  Header.init();
});

var HeaderSearch = (function () {
  var $wrapper = $('.js-search'),
      $input = $('.js-search-input'),
      $btnSearch = $('.js-search-loupe'),
      $header = $('.js-header');

  var click = function () {
    $(document).on('click', '.js-search-loupe, .js-search-close', function () {
      $wrapper.is('.is-open') ? close() : open();
    });
  };

  var open = function () {
    Menu.close();

    $wrapper.addClass('is-open');
    $btnSearch.addClass('is-active');
    $header.addClass('menu-is-open');
    $wrapper.slideDown();
    $input.focus();
  };

  var close = function () {
    if ($wrapper.is('.is-open')) {
      $wrapper.removeClass('is-open');
      $btnSearch.removeClass('is-active');
      $header.removeClass('menu-is-open');
      $wrapper.slideUp();
    }
  };

  var init = function () {
    click();
  };

  return {
    init: init,
    close: close
  }
})();
$(function () {
  HeaderSearch.init();
});

var Menu = (function () {
  var $menu = $('.js-menu'),
      $header = $('.js-header'),
      $btnMenu = $('.js-menu-btn'),
      $container = $('.js-masonry'),
      $window = $(window);


  var click = function () {
    $(document).on('click', '.js-menu-btn, .js-menu-close', function () {
      $menu.is('.is-open') ? close() : open();
    });
  };

  var open = function () {
    HeaderSearch.close();

    $menu.addClass('is-open');
    $btnMenu.addClass('is-active');
    $header.addClass('menu-is-open');
    $menu.fadeIn();
    if ($window.width() >= 992) {
      $container.masonry({
        columnWidth: '.item-masonry',
        itemSelector: '.item-masonry'
      });
    }
  };

  var close = function () {
    if ($menu.is('.is-open')) {
      $menu.removeClass('is-open');
      $btnMenu.removeClass('is-active');
      $header.removeClass('menu-is-open');
      $menu.fadeOut();
    }
  };

  var init = function () {
    click();
  };

  return {
    init: init,
    close: close
  }
})();
$(function () {
  Menu.init();
});

var History = (function () {
  var $items = $('.history__item'),
      $button = $('.js-history-btn');
  var scrollBtn = function () {
    var window_width = window.innerWidth;
    if (window_width >= 768) {
      $(".js-history-left").css({"height": $(".js-history-items").height() + "px"});
      $(".js-history-btn").stick_in_parent({offset_top: $(".header").height() + 20});
    } else {
      $(".js-history-left").css({"height": "auto"});
      $(".js-history-btn").trigger("sticky_kit:detach");
    }
  };

  var scrollToItem = function () {
    $(document).on('click', '.js-history-btn', function () {
      var $element = null;
      $items.each(function () {
        var $this = $(this),
            offsetTop = $this.offset().top,
            offsetBottom = offsetTop + $this.height() + parseInt($this.css('margin-bottom')),
            btnPositionTop = $button.offset().top + $button.height() / 2;
        if (btnPositionTop >= offsetTop && btnPositionTop <= offsetBottom) {
          $element = $this;
        }
      });
      if ($element.next().length) {
        $("html, body").animate({scrollTop: $element.next().offset().top - $('.js-header').height() - $button.height() / 2}, 700, function () {
        });
      }
    });
  };

  var init = function () {
    scrollToItem();
    $(window).on('load scroll resize', function () {
      scrollBtn();
    })
  };

  return {
    init: init
  }
})();
$(function () {
  History.init();
});

var OrderList = (function () {
  var init = function () {
    $(document).on('click', '.js-order-list-toggle', function () {
      var $this = $(this),
          $element = $this.closest('.js-order-list'),
          $body = $this.closest('.js-order-list').find('.js-order-list-body');
      $element.toggleClass('is-open');
      $body.slideToggle();
    });
  };

  return {
    init: init
  }
})();
$(function () {
  OrderList.init();
});

var CatalogFilter = (function () {
  var toggle = function () {
    $('.js-filter-toggle').on('click', function () {
      var $list = $(this).next('.filter-list');
      $(this).closest('.filter__item').toggleClass('is-open');
      $list.slideToggle();
    });
  };

  var tooltip = function () {
    $(document).click(function (event) {
      if (!$(event.target).is('.filter-tooltip') && !$(event.target).closest('.js-filter-check').length) {
        $('.filter-tooltip').fadeOut().remove();
      }
    });
    $(document).on('click', '.js-filter-check', function () {
      var $this = $(this),
          $form = $this.closest("form"),
          data = $form.serializeObject(),
          action = $form.attr("action"),
          method = $form.attr("method");
      data["IS_AJAX"] = "Y";
      data["set_filter"] = "Y";
      $.ajax({
        url: action,
        dataType: 'json',
        type: method,
        data: data,
      }).done(function (data) {
		$form.attr("action", 'data.filter_url')
        $('.filter-tooltip').fadeOut().remove();
        $this.closest('.filter-list__item').prepend('<div class="filter-tooltip">найдено: ' + data.count + ' <button type="submit" class="filter-tooltip__btn js-submit-filter">Показать</button></div>');
        $('.filter-tooltip').fadeIn();

        $form.find('.js-filter-count').html(data.count);
      });
    });
  };

  var submit = function () {
    $(document).on("click", ".js-submit-filter", function (e) {
      e.preventDefault();
      $("#set_filter").click();
    });
    $('.js-filter-form button[type=submit]').on('click', function (e) {
      e.preventDefault();
      $('#set_filter').click();
    });
  };

  var init = function () {
    toggle();
    tooltip();
    submit();
  };

  return {
    init: init
  }
})();
$(function () {
  if ($('.filter').length) {
    CatalogFilter.init();
  }
});

var InfoDetail = (function () {
  var scrollShare = function () {
    var windowWidth = window.innerWidth;
    var infoHeight = $('.js-info-detail-right').height();
    if (windowWidth >= 768 && infoHeight < 465) {
      $(".js-info-detail-share").addClass('-hide');
      $(".js-info-detail-share-bottom").addClass('-show');
    } else if (windowWidth >= 768 && infoHeight >= 465) {
      $(".js-info-detail-left").css({"height": $(".js-info-detail-right").height() + "px"});
      $(".js-info-detail-share").stick_in_parent({offset_top: $(".header").height() + 20});
    } else {
      $(".js-info-detail-left").css({"height": "auto"});
      $(".js-info-detail-share").trigger("sticky_kit:detach");
    }
  };

  var init = function () {
    scrollShare();
    $(window).on('scroll, resize', function () {
      scrollShare();
    })
  }

  return {
    init: init
  }
})();

$(function () {
  if ($('.info-detail').length) {
    InfoDetail.init();
  }
});

var SliderMobile = (function () {
  var min = 768,
      isInit = false,
      slider = null,
      _scrollListener = function () {
        $(window).resize(function () {
          if ($(window).width() <= min) {
            if (!isInit) {
              $.each(slider, function (index, val) {
                _initSlider(val);
              });
            } else {
              $.each(slider, function (index, val) {
                val.slick('setPosition');
              });
            }

          } else {
            if (isInit) {
              $.each(slider, function (index, val) {
                val.slick('unslick');
              });
            }
            isInit = false;
          }
        });
      },
      _initSlider = function (_obj) {
        _obj.slick({
          dots: true,
          infinite: true,
          arrows: false,
          autoplay: true,
          autoplaySpeed: 2000
        });
        isInit = true;
      };
  return {
    init: function (arSliders) {
      slider = arSliders;
      $.each(slider, function (index, val) {
        if ($(window).width() < min)
          _initSlider(val);
        _scrollListener();
      });

    }
  }
}());
$(function () {
  var sliders = [$('.js-info-detail-slider')];
  SliderMobile.init(sliders);
});

var CatalogDetail = (function () {

  var $filling = $('.js-detail-filling'),
      $packing = $('.js-detail-packing'),
      $quantity = $('.js-detail-quantity'),
      $offer = $('.js-detail-offer'),
      $tab = $('.js-detail-offer-tab'),
      $applicationTab = $('.js-detail-application-tab'),
      $modal = $("#Modal");


  var changeOffers = function () {
    $(document).on('click', '.js-detail-offer', function () {
      var $this = $(this),
          offer = $this.data('offer');

      clearQuantity();

      $offer.removeClass('is-active');
      $this.addClass('is-active');

      $tab.removeClass('is-active');
      $tab.filter('[data-offer=' + offer + ']').addClass('is-active');

      $filling.removeClass('is-active');
      $filling.filter('[data-offer=' + offer + ']').addClass('is-active');

      $packing.removeClass('is-active');
      $filling.filter('[data-offer=' + offer + ']').find('.js-detail-packing').eq(0).addClass('is-active');

      EdostCalcDetail.changeData({
        RATIO: $filling.filter('[data-offer=' + offer + ']').find('.js-detail-packing').data('value'),
        WEIGHT: $filling.filter('[data-offer=' + offer + ']').find('.js-detail-packing').data('weight'),
        PRICE: $filling.filter('[data-offer=' + offer + ']').find('.js-detail-price').text(),
        COUNT: 1,
        WIDTH: $filling.filter('[data-offer=' + offer + ']').find('.js-detail-packing').data('width'),
        HEIGHT: $filling.filter('[data-offer=' + offer + ']').find('.js-detail-packing').data('height'),
        LENGTH: $filling.filter('[data-offer=' + offer + ']').find('.js-detail-packing').data('length'),
      });
    })
  };

  var changePacking = function () {
    $(document).on('click', '.js-detail-packing', function () {
      var $this = $(this);

      clearQuantity();
      $packing.removeClass('is-active');
      $this.addClass('is-active');

      EdostCalcDetail.changeData({
        RATIO: $this.data('value'),
        WEIGHT: $this.data('weight'),
        PRICE: $this.find('.js-detail-price').text(),
        COUNT: 1,
        WIDTH: $this.data('width'),
        HEIGHT: $this.data('height'),
        LENGTH: $this.data('length'),
      });
    })
  };

  var changeQuantity = function () {
    $(document).on('click', '.js-detail-quantity-up', function () {
      var value = $quantity.val(),
          newValue = +value + 1;
      if (value < 99999) {
        $quantity.val(newValue);
        changeInfo(newValue);
      }
    });

    $(document).on('click', '.js-detail-quantity-down', function () {
      var value = $quantity.val(),
          newValue = +value - 1;
      if (value > 1) {
        $quantity.val(newValue);
        changeInfo(newValue);
      }
    });
    $(document).on('change', '.js-detail-quantity', function () {
      var value = parseInt($quantity.val());
      if (value < 1 || value === '' || value === 'undefined' || value === 'NULL' || !value || (value ^ 0) !== value || value > 99999) {
        clearQuantity();
      } else {
        changeInfo(value);
      }
    });
  };

  var clearQuantity = function () {
    $quantity.val(1);
    changeInfo(1);
  };

  var changeInfo = function (quantity) {
    var $this = $(".js-detail-packing.is-active"),
        packing = $this.data('value'),
        weight = $this.data('weight'),
        price = $this.data('price');

    var newWeight = floating(packing * weight * quantity);
    var newPrice = floating(price * quantity);
    var newCount = floating(packing * quantity);

    $this.find('.js-detail-weight').text(newWeight);
    $this.find('.js-detail-price').text(newPrice);
    $this.find('.js-detail-count').text(newCount);

    EdostCalcDetail.changeData({
      RATIO: $this.data('value'),
      WEIGHT: $this.data('weight'),
      PRICE: $this.find('.js-detail-price').text(),
      COUNT: quantity,
      WIDTH: $this.data('width'),
      HEIGHT: $this.data('height'),
      LENGTH: $this.data('length'),
    });
  };

  var add2Basket = function () {
    $(document).on('click', '.js-add-basket', function () {
      var offer = $offer.filter('.is-active').data('offer'),
          packingValue = $packing.filter('.is-active').data('value'),
          quantity = $quantity.val();

      var data = {
        offer: offer,
        quantity: packingValue * quantity
      };

      SendAjax('ADD2BASKET', data, function (data) {
        BasketCount();
        $modal.html(data.html);
        $modal.modal();
      });
    });
  };

  var add2Delay = function () {
    $(document).on('click', '.js-add-delay', function () {
      var offer = $offer.filter('.is-active').data('offer'),
          packingValue = $packing.filter('.is-active').data('value'),
          quantity = $quantity.val();

      var data = {
        offer: offer,
        quantity: packingValue * quantity
      };

      SendAjax('ADD2DELAY', data, function (data) {
        DelayCount();
        $modal.html(data.html);
        $modal.modal();
      });
    });
  };

  var BasketCount = function () {
    SendAjax('RECOUNT_BASKET', {}, function (data) {
      $('.js-basket-count').html(data)
    });
  };
  var DelayCount = function () {
    SendAjax('RECOUNT_DELAY', {}, function (data) {
      $('.js-delay-count').html(data)
    });
  };

  var changeApplication = function () {
    $(document).on('change', '.js-detail-application', function () {
      var $this = $(this),
          id = $this.val();
      if (id) {//срабатывает два раза из-за формстайлера
        $applicationTab.removeClass('is-active');
        $applicationTab.filter('[data-id=' + id + ']').addClass('is-active');
      }
    })
  };

  var floating = function (num) {
    return Math.round(parseFloat(num) * 100) / 100;
  };

  var init = function () {
    changeOffers();
    changePacking();
    changeQuantity();
    add2Basket();
    add2Delay();
    changeApplication();
  };

  return {
    init: init
  }
})();
$(function () {
  CatalogDetail.init();
});

var Profile = (function () {

  var changeLogin = function () {
    $(document).on('change keydown keypress keyup', '.js-profile-login', function () {
      var $this = $(this),
          value = $this.val();
      $('.js-profile-email').val(value)
    });
  };

  var init = function () {
    changeLogin();
  };

  return {
    init: init
  }
})();
$(function () {
  Profile.init();
});

var Order = (function () {
  var $stepTab = $('.js-step-tab'),
      $nextStep = $('.js-next-step'),
      $country = $('.js-country-order');

  var validateInputs = function ($inputs) {
    $inputs.removeClass("-error");
    $(".js-styler").removeClass("-error");
    var valid = true;
    $inputs.each(function (index, el) {
      var $input = $(el);
      if ($input.is("select") && $input.find('option').filter(':selected').val() == "") {
        $(el).addClass('-error');
        $(el).parent().addClass('-error');
        valid = false;
      } else if ($input.val() == "" && !$input.is("select") && !$input.is("div")) {
        $(el).addClass('-error');
        valid = false;
      }
      if ($input.attr("type") == "checkbox" && $input.prop("checked") == false) {
        $(el).addClass('-error');
        valid = false;
      }
      if ($input.attr("name") === "EMAIL" && $input.val() === "") {
        $input.attr("data-content", "Обязательное поле");
      } else if ($input.attr("name") === "EMAIL" && !isValidEmailAddress($input.val())) {
        $input.attr("data-content", "Поле заполнено не верно");
        $(el).addClass('-error');
        valid = false;
      }
    });
    return valid;
  };

  var init = function () {
    $(document).on('click', '.js-step-tab', function () {
      var $this = $(this);
      var $stepOpened = $('.order__step.is-open');
      var nameStep = $stepOpened.data('name');
      if (validateInputs($stepOpened.find('.req')) && !$this.closest('.order__step').hasClass('is-disabled')) {
        $stepOpened.addClass('is-complete').removeClass('is-open');
        $this.closest('.order__step').removeClass('is-complete').addClass('is-open');
        $('.js-styler').trigger('refresh');
        $('input[name=' + nameStep + ']').val("Y");
        $('input[name=step_current]').val($('.order__step.is-open').data('name'));
      }
    });
    $(document).on('click', '.js-next-step', function () {
      var $this = $(this);
      var $stepOpened = $('.order__step.is-open');
      var nameStep = $stepOpened.data('name');
      if (validateInputs($stepOpened.find('.req'))) {
        $stepOpened.addClass('is-complete').removeClass('is-open');
        $this.closest('.order__step').next().removeClass('is-complete').removeClass('is-disabled').addClass('is-open');
        $('.js-styler').trigger('refresh');

        var goal = $this.data('order-goal');
        sendYandexGoal(goal);
        $('input[name=' + nameStep + ']').val("Y");
        $('input[name=step_current]').val($('.order__step.is-open').data('name'));
      }
    });
    $(document).on('change', '.js-country-order', function () {
      var $this = $(this);
      var countryName = $this.val();
      if (!countryName) {
        return false;
      }

      var $region = $('#region');
      SendAjax("GET_REGIONS_ORDER", {countryName: countryName}, function (data) {
        var regions = data;
        $region.children().remove();
        if (regions.length) {
          $region.append('<option value="">' + "Выберите регион" + '</option>');
          $.each(regions, function (index, el) {
            $region.append('<option value="' + el.NAME + '">' + el.NAME + '</option>');
          });
          $region.removeClass('hide').trigger('refresh');
        } else {
          $region.append('<option value="">' + "Выберите регион" + '</option>');
          $region.removeClass('hide').trigger('refresh');
        }
      });
    });
  };

  return {
    init: init
  }
})();
$(function () {
  if ($('.order').length) {
    Order.init();
  }
});

var BuyFixed = (function () {
  var scrollCitySelect = function () {
    var top = $('.js-buy-container').position().top;
    $('.js-buy-scroll').affix({
      offset: top
    })
  };

  var heightContainer = function () {
    $('.js-buy-container').height($('.js-buy-scroll').height());
  };

  var init = function () {
    heightContainer();
    scrollCitySelect();
    $(window).on('scroll, resize', function () {
      heightContainer();
      scrollCitySelect();
    })
  };

  return {
    init: init
  }
})();
$(function () {
  if ($('.buy').length) {
    BuyFixed.init();
  }
});

var AdvertisingDownload = (function () {

  var init = function () {
    $(".js-adv-download").on('click', function () {
      var data = {
        FILE_NAME: $(this).attr('download'),
        ID: $(this).attr("data-id"),
      };
      SendAjax("ADVERTISING_DOWNLOAD", data, function (data) {
      });

    });
  };

  return {
    init: init
  }
})();
$(function () {
  AdvertisingDownload.init();
});

var EdostCalcDetail = (function () {

  var $form = $('.js-delivery-form'),
      $content = $('.js-delivery-content'),
      $ajaxContent = $('.js-delivery-ajax'),
      objectManager, map;

  var init = function () {
    $(document).on('click', '.js-delivery-toggle', function (e) {
      if (!$content.hasClass('is-active')) {
        sendEdost();
        plugins();
      }

      $content.toggleClass('is-active');
    });

    $(document).on("change", ".js-delivery-region", function (e) {
      var value = $(this).val();
      if (value) {
        getCities();
      }
    });

    $(document).on("change", ".js-delivery-city", function (e) {
      var value = $(this).val();
      if (value) {
        $form.find('input[name=CITY]').val($(this).val());
        sendEdost();
      }
    });

    $(document).on("change", ".js-delivery-type", function (e) {
      var value = $(this).val();
      if (value) {
        sendEdost();
      }
    });

    $(document).on("click", ".js-delivery-close", function (e) {
      $content.toggleClass('is-active');
    });

    $(document).on("change", ".js-select-pickup", function (e) {
      var value = $(this).val();
      if (value) {
        map.setZoom(14);
        objectManager.objects.balloon.open(value);
      }
    });
  };

  var getCities = function () {
    var data = $form.serializeObject();
    SendAjax("LOAD_CITIES", data, function (data) {
      $('select.js-delivery-city').html(data.html);
      $form.find('input[name=CITY]').val($('select.js-delivery-city option:selected').val());
      plugins();
      sendEdost();
    });
  };

  var sendEdost = function () {
    var data = $form.serializeObject();
    SendAjax("GET_EDOST_DATA", data, function (data) {
      $ajaxContent.html(data.html);
      if ($form.find('select[name=TYPE]').val() == 'pickup' && data.offices.features.length) {
        initMap(data.offices);
      }
      plugins();
    });
  };

  var plugins = function () {
    setTimeout(function () {
      initPlugins();
      $('.js-styler').trigger('refresh');
    }, 150);
  };

  var initMap = function (offices) {
    map = new ymaps.Map('delivery-map', {
      center: offices.features[0].geometry.coordinates,
      zoom: 10,
      controls: ["fullscreenControl", "zoomControl"]
    });

    objectManager = new ymaps.ObjectManager({
      clusterize: true
    });

    objectManager.objects.options.set({
      iconContentLayout: ymaps.templateLayoutFactory.createClass('<div class="price">$[properties.iconContent]</div>')
    });

    objectManager.objects.events.add('click', function (e) {
      var objectId = e.get('objectId');

      $('.js-select-pickup select').val(objectId);
      plugins();
    });

    objectManager.add(offices);
    map.geoObjects.add(objectManager);
  };

  var changeData = function (data) {
    for (var prop in data) {
      if (Object.prototype.hasOwnProperty.call(data, prop)) {
        $form.find('input[name=' + prop + ']').val(data[prop]);
      }
    }
    if ($('.js-delivery-content').hasClass('is-active')) {
      sendEdost();
    }
  };

  return {
    init: init,
    changeData: changeData
  };
})();
$(function () {
  EdostCalcDetail.init();
});

var registerModal = (function () {

  var init = function () {
    $('body')
        .on('change', 'select.js-user-type', function () {
          var $ulWrap = $('.js-ul-show-only');
          if ($ulWrap.length) {
            if ($(this).val() == 2) {
              $ulWrap.slideDown(300);
              $ulWrap.find('select').addClass('req-select').trigger('refresh');
              $ulWrap.find('input').addClass('req');
            } else {
              $ulWrap.slideUp(300);
              $ulWrap.find('select').removeClass('req-select');
              $ulWrap.find('input').removeClass('req');
            }
          }
        })
        .on('change', 'select.js-company-type', function () {
          var $compWrap = $('.js-ul-company-show-only');
          if ($compWrap.length) {
            if ($(this).val() == 4) {
              $compWrap.slideDown(300);
              $compWrap.find('input[name="UF_KPP"]').addClass('req');
            } else {
              $compWrap.slideUp(300);
              $compWrap.find('input[name="UF_KPP"]').removeClass('req');
            }
          }
        });
  };

  return {
    init: init
  }
}());
$(function () {
  registerModal.init();
});


window.blockSlider = {
    currentPage: 1,
    currentPageClass: 'block-slider__current',
    wrapperClass: '.block-slider__wrapper',
    pageClass: '.block-slider__page',
    init: function() {
        var wrapper = $(this.wrapperClass);
        if (!wrapper.length) return;

        this.addHandlers();
        this.switchPage(1);
        $(wrapper).css('height', $(blockSlider.getCurrentPage()).css('width'));
    },
    switchPage: function(num) {
      blockSlider.currentPage = num;

      $(blockSlider.getCurrentPage()).css({
        'position': 'static',
        'transform': 'none',
      });
      $(blockSlider.getOtherPages()).each(function (i, e) {
        var diff = $(e).attr('data-num') - blockSlider.currentPage;
        $(e).css({
          'transform': 'translateX(' + diff * 100 + '%)',
          'position': 'absolute',
        });
      });

      $('[data-bs-visible]').each(function(i, e) {
        var page = $(e).attr('data-bs-visible');
        if (page != num) {
          $(e).css('display', 'none');
        } else {
          $(e).css('display', 'block');
        }
      });
    },
    addHandlers: function() {
      $('[data-bs-page]').click(function(event) {
        var num = $(event.target).attr('data-bs-page');
        var page = $(window.blockSlider.pageClass + '[data-num=' + num + ']');

        window.blockSlider.switchPage(num);
      });
    },
    getCurrentPage: function() {
      return $(this.pageClass + '[data-num=' + blockSlider.currentPage + ']');
    },
    getOtherPages: function() {
      return $(this.pageClass + ':not([data-num=' + blockSlider.currentPage + '])');
    }
};

$(function() {
  $('body').on('keyup', '[data-filter="text"]', function(event) {
    $(event.target).inputmask({ regex: "[а-яА-ЯёЁ]{2,24}" });
  });
});
