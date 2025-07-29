var Other = (function () {

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


  var $body = $('body'),
      $btnScroll = $('.js-scroll-to-top');

  var scrollToTop = function () {
    $(document).on('click', '.js-scroll-to-top', function () {
      $('html, body').animate({scrollTop: 0}, 1000);
    });

    function show() {
      if ($(window).scrollTop()) {
        $btnScroll.fadeIn();
      } else {
        $btnScroll.fadeOut();
      }
    }

    show();

    $(window).scroll(show);
  };

  var plugins = function () {
    var listCountries = $.masksSort($.masksLoad('/_js/plugins/inputmask/data/phone-codes.json'), ['#'], /[0-9]| /, 'mask');
    var maskOpts = {
      inputmask: {
        definitions: {
          '#': {
            validator: "[0-9]|",
          }
        },
        showMaskOnHover: true,
        autoUnmask: false,
        clearMaskOnLostFocus: false
      },
      match: /[0-9]/,
      replace: '#',
      listKey: "mask"

    };

    var maskChangeWorld = function (maskObj, determined, newtext) {
      if (determined) {
        var hint = maskObj.name_ru;
        var input = $(this).closest('form').find('[name="country"], [name="COUNTRY"]');
        var value = $('option:contains(' + hint + ')').val();

        if (value)
          $(input).val(value).trigger('refresh');
      }
    };

    $('.js-phone, [name=phone], [name=PHONE]').inputmasks($.extend(true, {}, maskOpts, {
      list: listCountries,
      onMaskChange: maskChangeWorld
    }));

    $(".js-email, [name=email], [name=EMAIL]").inputmask({
      regex: "[a-zA-Z0-9._%-]{0,32}[a-zA-Z0-9-]{0,8}(\.[a-zA-Z]{0,6})?\.[a-zA-Z]{2,4}",
      placeholder: ""
    })

    $('select, .js-styler').styler();
  };

  var userTypeChoose = function () {
    $('body').on('click', '[data-user-type]', function () {
      var userType = $(this).data('user-type');
      if (userType) {
        $(this).closest('.js-user-type-wrap').find('[name="UF_USER_TYPE"]').val($(this).data('user-type'));
        if (userType == 2) {
          $('#reg-entity input').addClass('req');
        } else {
          $('#reg-entity input').removeClass('req');
        }
      }
    });

    $('body').on('change', 'input[name="type-comp"]', function () {
      $(this).closest('.js-company-type-wrap').find('[name="UF_COMPANY_TYPE"]').val($(this).val());
      if ($(this).val() == 4) {
        $('#reg-entity input[NAME="UF_KPP"]').addClass('req').val('');
        $('.js-register-kpp').fadeIn(200);
      } else {
        $('#reg-entity input[NAME="UF_KPP"]').removeClass('req');
        $('.js-register-kpp').fadeOut(200);
      }

    });

  };


  var init = function () {
    getRegions();
    scrollToTop();
    plugins();
    userTypeChoose();

    /*        $.validate({
                modules: 'toggleDisabled',
                lang: 'ru'
            });*/

    $('.order-tabs__icon').tooltip({
      template: '<div class="tooltip order-tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>'
    });

    $('.modal').on('show.bs.modal', function () {

      if ($(this).find('.js-m-product-slider').length) {
        setTimeout(function () {
          $('.js-m-product-slider').slick({
            infinite: false,
            dots: true,
            arrows: false,
            autoplay: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            customPaging: function (slider, i) {
              var thumb = $(slider.$slides[i]).data('thumb');
              return '<div class="product-slider__dot" style="background-image: url(' + thumb + ');"></div>';
            }
          });
        }, 300);
      }

      if ($(this).find('.js-product-slider.is-active').length) {
        setTimeout(function () {
          $('.js-product-slider.is-active').slick({
            infinite: false,
            dots: true,
            arrows: false,
            autoplay: false,
            slidesToShow: 1,
            refresh: true,
            slidesToScroll: 1,
            customPaging: function (slider, i) {
              var thumb = $(slider.$slides[i]).data('thumb');
              return '<div class="product-slider__dot" style="background-image: url(' + thumb + ');"></div>';
            }
          });
        }, 300);
      }

    })
        .on('shown.bs.modal', function () {
          plugins();
          $('select, .js-styler').trigger('refresh');
        });
    /* ПАРТРЕНАМ */
    $('.js-partners-tabs a').on('show.bs.tab', function (e) {
      var itemPos = $(e.target).closest('li').position();

      $(".js-partners-selector").css({
        "left": itemPos.left + "px"
      });
    });

    /* ДЛЯ ПРЕЗЕНТАЦИИ ВЕРСТКИ: УБРАТЬ ПРИ ПРОГРАММИРОВАНИИ */
    $('.search__input').focusin(function () {
      $(this).closest('.search').find('.search__suggest').fadeIn();
    });

    $('.search__input').focusout(function () {
      $(this).closest('.search').find('.search__suggest').fadeOut();
    });
  };

  return {
    init: init,
    plugins: plugins
  };
}());
