$(document).ready(function () {
  const tabs = $('.product-tabs');
  const tabsNav = tabs.find('.product-tabs-nav');
  const tabsNavEl = tabsNav.find('li');
  const tabsContentEl = tabs.find('.product-tabs-content section[tabname]');
  const headerHeight = $('header').outerHeight() || 0; // Высота шапки для корректировки прокрутки

  // Инициализация первого таба как активного
  tabsNavEl.eq(0).addClass('current');

  // Обработчик клика для прокрутки к секции
  tabsNavEl.on('click', function (e) {
    e.preventDefault();
    const targetSection = tabsContentEl.filter(`[tabname="${$(this).attr('target')}"]`);
    if (targetSection.length) {
      $('html, body').animate(
        {
          scrollTop: targetSection.offset().top - headerHeight - 20 - 80,
        },
        500
      );
    }
  });

  // Функция для определения активного таба
  const updateActiveTab = throttle(() => {
    const scrollPosition = $(window).scrollTop() + headerHeight + 20;
    let activeTab = null;

    tabsContentEl.each(function () {
      const sectionTop = $(this).offset().top;
      const sectionHeight = $(this).outerHeight();

      // Проверяем, находится ли пользователь в пределах секции ИЛИ на расстоянии 80px до ее начала,
      // ИЛИ выше ее начала, но еще не слишком далеко.
      if (scrollPosition >= sectionTop - sectionHeight / 2 - 82 && scrollPosition <= sectionTop + sectionHeight - 82) {
        activeTab = $(this);
        return false; // Прерываем цикл, так как нашли нужный таб
      }
    });

    if (activeTab) {
      const tabName = activeTab.attr('tabname');
      tabsNavEl.removeClass('current');
      tabsNavEl.filter(`[target="${tabName}"]`).addClass('current');

      tabsContentEl.removeClass('current');
      activeTab.addClass('current');
    }
  }, 100);

  // Оптимизация скролла
  function throttle(fn, wait) {
    let timeout;
    return function () {
      if (!timeout) {
        timeout = setTimeout(() => {
          fn.apply(this, arguments);
          timeout = null;
        }, wait);
      }
    };
  }

  // Инициализация и подписка на события
  $(window).on('scroll', updateActiveTab).trigger('scroll');

  // Обработчики для специальных кнопок
  $('.product-info-more-link, .product-analog-btn').on('click', function (e) {
    e.preventDefault();
    const targetName = $(this).is('.product-info-more-link') ? 'description' : 'analogs';
    const targetSection = tabsContentEl.filter(`[tabname="${targetName}"]`);

    if (targetSection.length) {
      $('html, body').animate(
        {
          scrollTop: targetSection.offset().top - headerHeight - 20,
        },
        500
      );
    }
  });
});

$(document).ready(function () {
  $('.opisanieblocks.techvideos').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: '<div class="nextarrtech"><img src="/local/templates/oktant/img/nextv.svg"/></div>',
    prevArrow: '<div class="prevarrtech"><img src="/local/templates/oktant/img/prevv.svg"/></div>',
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          dots: true,
          appendDots: $('.techvideosmain').find('.items-slider-dots'),
        },
      },
    ],
  });

  $('.techphotos').slick({
    arrows: false,
    responsive: [
      {
        breakpoint: 9999,
        settings: 'unslick',
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: false,
          dots: true,
          appendDots: $('.techphotosmain').find('.items-slider-dots'),
        },
      },
      {
        breakpoint: 550,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          dots: true,
          appendDots: $('.techphotosmain').find('.items-slider-dots'),
        },
      },
    ],
  });

  if ($(window).width() <= 768) {
    //console.log($('.opisanieblocks .avText').height());

    //var lineHeight = (($('.opisanieblocks .descmore').height())/$(document).width())*100;
    //console.log(((lineHeight*6)*$(document).width())/100);

    /*if($('.opisanieblocks .avText').height() > ((lineHeight*6)*$(document).width())/100){
						$('.opisanieblocks .descmore').show();
					}*/
    $('.opisanieblocks .avText').css({ overflow: 'hidden', 'max-height': '100px' });

    $('.opisanieblocks .descmore').click(function () {
      if ($(this).text() == 'Показать всё') {
        $('.opisanieblocks .avText').css({ overflow: 'unset', 'max-height': '100%' });
        $(this).text('Свернуть');
      } else if ($(this).text() == 'Свернуть') {
        $('.opisanieblocks .avText').css({ overflow: 'hidden', 'max-height': '100px' });
        $(this).text('Показать всё');
      }
    });
  }

  /**
   * ***************************************
   */

  var offsetHeight = $('.items-slider-komplect-more-wrapp .items-slide').height();
  var offsetHeight2 = $('.items-slider-analog-more .items-slide').height();
  console.log(offsetHeight);

  //if ($(window).width() <= 619) {

  if ($(window).width() <= 1023) {
    $('.items-slider-komplect-more-wrapp').css({ overflow: 'hidden', 'max-height': offsetHeight + 80 });


    $('.descmore2').click(function () {
      if ($(this).text() == 'Показать все') {
        $('.items-slider-komplect-more-wrapp').css({ overflow: 'unset', 'max-height': '100%' });
        $(this).text('Свернуть');
      } else if ($(this).text() == 'Свернуть') {
        $('.items-slider-komplect-more-wrapp').css({ overflow: 'hidden', 'max-height': offsetHeight + 80 });
        $(this).text('Показать все');
      }
    });
  } else {
    $('.items-slider-komplect-more-wrapp').css({ overflow: 'hidden', 'max-height': offsetHeight + 10 });

    $('.descmore2').click(function () {
      if ($(this).text() == 'Показать все') {
        $('.items-slider-komplect-more-wrapp').css({ overflow: 'unset', 'max-height': '100%' });
        $(this).text('Свернуть');
      } else if ($(this).text() == 'Свернуть') {
        $('.items-slider-komplect-more-wrapp').css({ overflow: 'hidden', 'max-height': offsetHeight + 10 });
        $(this).text('Показать все');
      }
    });
  }
  //}else if ($(window).width() <= 1023) {

  /*$('.items-slider-komplect-more-wrapp').css({'overflow':'hidden', 'max-height': '430px'});
					
					$('.descmore2').click(function(){
						if($(this).text() == 'Показать все'){
							$('.items-slider-komplect-more-wrapp').css({'overflow':'unset', 'max-height': '100%'});
							$(this).text('Свернуть');
						}else if($(this).text() == 'Свернуть'){
							$('.items-slider-komplect-more-wrapp').css({'overflow':'hidden', 'max-height': '430px'});
							$(this).text('Показать все');
						}
						
					});*/

  /*} else {
			

					$('.items-slider-komplect-more-wrapp').css({'overflow':'hidden', 'max-height': '385px'});
					
					$('.descmore2').click(function(){
						if($(this).text() == 'Показать все'){
							$('.items-slider-komplect-more-wrapp').css({'overflow':'unset', 'max-height': '100%'});
							$(this).text('Свернуть');
						}else if($(this).text() == 'Свернуть'){
							$('.items-slider-komplect-more-wrapp').css({'overflow':'hidden', 'max-height': '385px'});
							$(this).text('Показать все');
						}
						
					});
				}	*/

  if ($(window).width() <= 1023) {
    $(document).on('click', '.descmore4', function () {
      if ($(this).text() == 'Показать все') {
        $('.items-slider-komplect-more-wrapp').css({ overflow: 'unset', 'max-height': '100%' });
        $(this).text('Свернуть');
      } else if ($(this).text() == 'Свернуть') {
        $('.items-slider-komplect-more-wrapp').css({ overflow: 'hidden', 'max-height': offsetHeight + 90 });
        $(this).text('Показать все');
      }
    });
  } else {
    $(document).on('click', '.descmore4', function () {
      if ($(this).text() == 'Показать все') {
        $('.items-slider-komplect-more-wrapp').css({ overflow: 'unset', 'max-height': '100%' });
        $(this).text('Свернуть');
      } else if ($(this).text() == 'Свернуть') {
        console.log('offset');
        $('.items-slider-komplect-more-wrapp').css({ overflow: 'hidden', 'max-height': offsetHeight + 10 });
        $(this).text('Показать все');
      }
    });
  }

  /**
   * ***************************************
   */

  $('.items-slider-analog-more').css({ overflow: 'hidden', 'max-height': offsetHeight2 });

  $('.descmore3').click(function () {
    if ($(this).text() == 'Показать все') {
      $('.items-slider-analog-more').css({ overflow: 'unset', 'max-height': '100%' });
      $(this).text('Свернуть');
    } else if ($(this).text() == 'Свернуть') {
      $('.items-slider-analog-more').css({ overflow: 'hidden', 'max-height': offsetHeight2 });
      $(this).text('Показать все');
    }
  });
});
