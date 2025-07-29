$(function () {
  function Map(options) {
    this.code = options.code;
    this.type = options.type;
    this.place = options.place;
    this.typeChange = options.typeChange;
    this.markIcon = '/_img/map/mark.png';
    this.markIconActive = '/_img/map/mark-active.png';
    this.mCusterOption = {
      preset: 'islands#greenClusterIcons',
      gridSize: 60,
    };
    this.zoom = 10;
    this.placemarks = {};
    this.map = null;
    this.clusterer = null;
    this.activePlacemarkId = null;
    this.init();
  }

  Map.prototype = {
    init: function () {
      this.render();
    },

    render: function () {
      this.getObjects();
    },

    initMap: function () {
      var self = this;
      // Уничтожаем предыдущую карту, если она есть
      if (this.map) {
        this.map.destroy();
        $('.buy__map ymaps').remove(); // Удаляем элемент карты из DOM
        console.log('destroy map');

        this.map = null;
      }

      $('.buy__map ymaps').remove(); // Удаляем элемент карты из DOM

      console.log('init map');

      var zoom = 0;
      if (typeof this.place == 'undefined' || this.place === 'country' || this.typeChange === 'memberName') {
        zoom = 3;
      } else if (this.typeChange === 'member') {
        zoom = 9;
      } else {
        zoom = 5;
      }

      this.map = new ymaps.Map('map', {
        center: [this.objects.center.lat, this.objects.center.lng],
        zoom: zoom,
      });
    },

    getObjects: function () {
      var self = this;
      // Удаляем старые объекты перед новым запросом
      delete self.objects;

      SendAjax('GET_BUY_INFO', { code: this.code, type: this.type, place: this.place, typeChange: this.typeChange }, function (data) {
        self.objects = data;
        // Инициализируем карту только после получения данных
        ymaps.ready(function () {
          self.initMap();
          self.setPlacemarks();
          self.bindChange();
        });
      });
    },

    setPlacemarks: function () {
      var self = this;
      var placemarks = [];

      // Удаляем предыдущие метки
      if (this.clusterer) {
        this.clusterer.removeAll();
      }
      this.placemarks = {};

      this.objects.addresses.forEach(function (item) {
        var placemark = new ymaps.Placemark(
          [item.coordinates.lat, item.coordinates.lng],
          {
            balloonContentHeader: item.name,
            balloonContentBody:
              '<div class="contacts-balloon__title">' +
              item.name +
              '</div>' +
              '<table class="contacts-balloon__table">' +
              '<tr><td><img src="/_img/contacts/c-mark.svg" alt=""></td><td>' +
              item.address +
              '</td></tr>' +
              '<tr><td><img src="/_img/contacts/c-phone.svg" alt=""></td><td><a href="tel:' +
              item.phone +
              '">' +
              item.phone +
              '</a></td></tr>' +
              '<tr><td><img src="/_img/contacts/c-message.svg" alt=""></td><td><a href="mailto:' +
              item.email +
              '">' +
              item.email +
              '</a></td></tr>' +
              '</table>',
          },
          {
            iconLayout: 'default#image',
            iconImageHref: self.markIcon,
            iconImageSize: [38, 57],
            iconImageOffset: [-19, -57],
          }
        );

        placemarks.push(placemark);
        self.placemarks[item.id] = placemark;
      });

      this.clusterer = new ymaps.Clusterer(this.mCusterOption);
      this.clusterer.add(placemarks);
      this.map.geoObjects.add(this.clusterer);

      if (placemarks.length > 1) {
        this.map.setBounds(this.clusterer.getBounds(), {
          checkZoomRange: true,
        });
      }
    },

    bindChange: function () {
      var self = this;

      Object.keys(this.placemarks).forEach(function (id) {
        self.placemarks[id].events.add('click', function (e) {
          e.preventDefault(); // чтобы карта не центрировалась на балуне автоматически
          self.infoChange(id, 10);
        });
      });

      //закрытия балуна
      this.map.events.add('click', function () {
        if (self.activePlacemarkId) {
          self.infoClose(self.activePlacemarkId);
        }
      });

      // Для закрытия балуна при клике на крестик
      Object.keys(this.placemarks).forEach(function (id) {
        self.placemarks[id].balloon.events.add('close', function () {
          self.infoClose(id);
        });
      });

      $('.buy-city__top').on('click', '.js-mark-show', function () {
        var id = $(this).data('id');
        self.infoChange(id, self.zoom);
      });
    },

    infoChange: function (id, zoom) {
      if (id == this.activePlacemarkId && $('.js-mark-show[data-id=' + id + ']').is('.is-active')) {
        this.infoClose(this.activePlacemarkId);
      } else {
        if ($('.js-mark-show').is('.is-active')) {
          this.infoClose(this.activePlacemarkId);
        }
        this.infoOpen(id, zoom);
      }
    },

    infoClose: function (id) {
      if (!this.placemarks[id]) return;

      this.placemarks[id].options.set('iconImageHref', this.markIcon);
      this.placemarks[id].balloon.close();

      $('.js-mark-show[data-id=' + id + ']').removeClass('is-active');
      this.activePlacemarkId = null;

      var top = $('.buy__map').offset().top - 200;
      if ($(window).scrollTop() > top) {
        $('html, body').animate({ scrollTop: top }, 0);
      }
    },

    infoOpen: function (id, zoom) {
      var placemark = this.placemarks[id];
      var placemarkCoords = placemark.geometry.getCoordinates();

      if (zoom && this.map.getZoom() <= this.zoom) {
        this.map.setCenter(placemarkCoords, zoom);
      }

      placemark.options.set('iconImageHref', this.markIconActive);
      placemark.balloon.open();
      $('.js-mark-show[data-id=' + id + ']').addClass('is-active');
      this.activePlacemarkId = id;
      this.scrollTo();
    },
    scrollTo: function () {
      var top = $('.buy__map').offset().top - 200;
      if ($(window).scrollTop() > top) {
        $('html, body').animate({ scrollTop: top }, 500);
      }
    },
  };

  // Остальной код остается без изменений, так как он управляет логикой
  // пользовательского интерфейса, а не картой напрямую.

  $(document).ready(function () {
    var nameCounty = $(this).val();
    var type = $('.js-buy').data('type');
    if (nameCounty == '') {
      nameCounty = 'all';
    }
    new Map({ code: nameCounty, type: type });
  });

  $('select.js-select-country').change(function () {
    var nameCountry = $(this).val();
    var type = $('.js-buy').data('type');

    if (nameCountry == 'all') {
      $('#city').attr('style', 'display: none');
      $('#member').attr('style', 'display: none');
    }

    SendAjax('GET_INFO_COUNTRY', nameCountry, function (data) {
      new Map({ code: nameCountry, type: type, place: 'country' });
      if (nameCountry != 'all') {
        $('#city').attr('style', 'display: flex; display: -webkit-flex;');
        //$("#member").attr("style", "display: flex; display: -webkit-flex;");
        $('#member').attr('data-type-change', 'memberName');
      }

      setSelectOptions(data, 'all');

      $('.buy-city').detach();
      var p = 0;

      for (var items of Object.keys(data)) {
        var itemRes = data[items];

        $('.js-info-container').append(contentHeading(itemRes[0]['SECTION_NAME'], p));

        $('.js-info-map-' + p).append(content(itemRes));
        p++;
      }
    });
  });

  $('select.js-select-city').on('change', function () {
    if ($('.js-buy').length) {
      var CodeCountry = $('select.js-select-country option:selected').val(),
        codeRegion = $('select.js-select-city option:selected').val(),
        nameRegion = $('select.js-select-city option:selected').text(),
        type = $('.js-buy').data('type'),
        nameCountry = $('.js-select-country option:selected').val();
      $('#member').attr('data-type-change', 'member');

      if ($(this).val() == 'all') {
        SendAjax('GET_INFO_COUNTRY', nameCountry, function (data) {
          new Map({ code: nameCountry, type: type, place: 'country' });
          setSelectOptions(data, 'city');
          setSelectOptions(data, 'member');
          $('.buy-city').detach();
          var p = 0;
          for (var items of Object.keys(data)) {
            var itemRes = data[items];

            $('.js-info-container').prepend(contentHeading(itemRes[0]['SECTION_NAME'], p));
            $('.js-info-map-' + p).prepend(content(itemRes));

            p++;
          }
        });
      } else {
        SendAjax('GET_INFO_CITY', { code: CodeCountry, type: type, place: codeRegion }, function (data) {
          new Map({ code: codeRegion, type: type, place: CodeCountry });
          setSelectOptions(data, 'member');

          $('.buy-city').detach();

          $('.js-info-container').prepend(contentHeading(nameRegion));

          $('.js-info-map-').prepend(content(data));
        });
      }
    }
  });

  $('select.js-select-member').on('change', function () {
    var memberCode = $('select.js-select-member option:selected').val(),
      memberName = $('select.js-select-member option:selected').text(),
      type = $('.js-buy').data('type'),
      CodeCountry = $('select.js-select-country option:selected').val(),
      codeRegion = $('select.js-select-city option:selected').val(),
      nameRegion = $('select.js-select-city option:selected').text(),
      typeChange = $('#member').attr('data-type-change');
    if ($(this).val() == 'all') {
      SendAjax('GET_INFO_CITY', { code: CodeCountry, type: type, place: codeRegion }, function (data) {
        new Map({ code: codeRegion, type: type, place: CodeCountry });
        setSelectOptions(data, 'member');

        $('.buy-city').detach();

        $('.js-info-container').prepend(contentHeading(nameRegion));

        $('.js-info-map-').prepend(content(data));
      });
    } else {
      SendAjax('GET_INFO_MEMBER', { code: memberCode, type: type, place: 'member', map: false, memberName: memberName }, function (data) {
        new Map({ code: memberCode, type: type, place: memberName, typeChange: typeChange });
        $('.buy-city').detach();
        $('.js-info-container').prepend(contentHeading(data[0]['NAME']));

        $('.js-info-map-').prepend(content(data));
      });
    }
  });
});

function setSelectOptions(data, nameCountry) {
  var member = '#select_member',
    city = '#select_city';
  if (nameCountry === 'member') {
    setSettingsOptions(member, data);
  } else if (nameCountry === 'all') {
    setSettingsOptions(city, data);
    setSettingsOptionsAll(member, data);
  } else {
    setSettingsOptions(city, data);
  }
}

function setSettingsOptions(place, data) {
  $(place + ' option').remove();
  $(place).prepend('<option value="all">Все</option>');
  var keys = Object.keys(data);
  if (keys == 0 || keys[0] == 0) {
    for (var region of Object.keys(data)) {
      var capital = data[region];
      $(place).append('<option value="' + capital['CODE'] + '">' + capital['NAME'] + '</option>');
    }
  } else {
    for (var region of Object.keys(data)) {
      var capital = data[region];
      $(place).append('<option value="' + region + '">' + capital[0]['SECTION_NAME'] + '</option>');
    }
  }

  $(place).trigger('refresh');
}

function setSettingsOptionsAll(place, data) {
  var array = [],
    i = 0,
    capital;
  $(place + ' option').remove();
  $(place).prepend('<option value="all">Все</option>');
  for (var region of Object.keys(data)) {
    capital = data[region];
    for (var item of capital) {
      array[i] = item['NAME'];
      i++;
    }
  }
  var uniqueSet = new Set(array),
    backToArray = [...uniqueSet];
  for (var item of backToArray) {
    $(place).append('<option value="' + capital[0]['SECTION_CODE_COUNTRY'] + '">' + item + '</option>');
  }
  $(place).trigger('refresh');
}

function contentHeading(heading, p) {
  if (p == undefined) {
    p = '';
  }
  var listR =
    '<div class="col-xs-12 buy-city">' +
    '        <h2 class="buy-city__title">' +
    heading +
    '</h2>' +
    '        <div class="row js-info-map-' +
    p +
    '">' +
    '        </div>\n' +
    '    </div>';
  return listR;
}

function content(data) {
  var list = '';
  for (var item of data) {
    list += '    <div class="buy-city__item clearfix">' + '        <div class="col-sm-1">';
    if (item['PROPERTY']['TYPE']['VALUE_XML_ID']) {
      list += ' <div class="buy-city-type ';

      if (item['PROPERTY']['TYPE']['VALUE_XML_ID'].length === 1) {
        list += ' -single';
      }
      list += '">';

      for (var type of item['PROPERTY']['TYPE']['VALUE_XML_ID']) {
        list += '<svg class="buy-city-type__svg -farm">' + '            <use xlink:href="#' + type + '"></use>' + '         </svg>';
      }
      list += '</div>';
    }
    list +=
      '</div>\n' +
      '        <div class="col-sm-10">\n' +
      '            <div class="buy-city__top">\n' +
      '                <span class="buy-city__main"><strong>' +
      item['NAME'] +
      '</strong>;' +
      item['PROPERTY']['ADDRESS']['VALUE'] +
      '</span><span\n' +
      '                        class="buy-city__show js-mark-show" data-id="' +
      item['ID'] +
      '"><nobr>Показать на карте</nobr></span>\n' +
      '            </div>';

    if (item['PROPERTY']['REGION']['VALUE']) {
      list +=
        '<div class="buy-city__region">' +
        '                    <svg class="buy-city__svg -region">' +
        '                        <use xlink:href="#c-mark"/>' +
        '                    </svg>' +
        '                    <div class="buy-city-info__wrap">' +
        item['PROPERTY']['REGION']['VALUE'] +
        '</div>' +
        '                </div>';
    }

    if (item['PROPERTY']['PERSON']['VALUE']) {
      list +=
        '<div class="buy-city__person">' +
        '                    <svg class="buy-city__svg -person">' +
        '                        <use xlink:href="#person"/>' +
        '                    </svg>' +
        '                    <div class="buy-city-info__wrap">' +
        item['PROPERTY']['PERSON']['VALUE'] +
        '                    </div>' +
        '                </div>';
    }

    list += '<div class="buy-city-info row">';
    if (item['PROPERTY']['PHONE']['VALUE']) {
      list += '<div class="col-xs-12 col-sm-6 col-md-4">';
      for (var key in item['PROPERTY']['PHONE']['VALUE']) {
        list +=
          '<div class="buy-city-info__item">\n' +
          '                                <svg class="buy-city__svg -phone">\n' +
          '                                    <use xlink:href="#phone"/>\n' +
          '                                </svg>\n' +
          '                                <div class="buy-city-info__wrap">\n' +
          '                                    <nobr><a href="tel:' +
          item['PROPERTY']['PHONE']['VALUE'][key] +
          '" rel="nofollow">' +
          item['PROPERTY']['PHONE']['VALUE'][key] +
          '</a></nobr>';
        if (item['PROPERTY']['PHONE']['DESCRIPTION'][key]) {
          list += ' - ' + item['PROPERTY']['PHONE']['DESCRIPTION'][key];
        }
        list += '</div>\n' + '         </div>';
      }
      list += '</div>';
    }
    if (item['PROPERTY']['FAX']['VALUE']) {
      list += '<div class="col-xs-12 col-sm-6 col-md-3">';
      for (fax of item['PROPERTY']['FAX']['VALUE']) {
        list +=
          '<div class="buy-city-info__item">\n' +
          '                                <svg class="buy-city__svg -fax">\n' +
          '                                    <use xlink:href="#fax"/>\n' +
          '                                </svg>\n' +
          '                                <div class="buy-city-info__wrap">\n' +
          '                                    <nobr><a href="fax:<?= $fax ?>" rel="nofollow">' +
          fax +
          '</a></nobr>\n' +
          '                                </div>\n' +
          '                            </div>';
      }
      list += '</div>';
    }

    if (item['PROPERTY']['EMAIL']['VALUE']) {
      list += '<div class="col-xs-12 col-sm-6 col-md-3">';
      for (email of item['PROPERTY']['EMAIL']['VALUE']) {
        list +=
          '<div class="buy-city-info__item">\n' +
          '                                <svg class="buy-city__svg -message">\n' +
          '                                    <use xlink:href="#message"/>\n' +
          '                                </svg>\n' +
          '                                <div class="buy-city-info__wrap">\n' +
          '                                    <nobr><a href="mailto:' +
          email +
          '" rel="nofollow">' +
          email +
          '</a></nobr>\n' +
          '                                </div>\n' +
          '                            </div>';
      }
      list += '</div>';
    }

    if (item['PROPERTY']['SITE']['VALUE']) {
      list +=
        '<div class="col-xs-12 col-sm-6 col-md-2 buy-city-info__item">\n' +
        '                        <svg class="buy-city__svg -site">\n' +
        '                            <use xlink:href="#site"/>\n' +
        '                        </svg>\n' +
        '                        <div class="buy-city-info__wrap">\n' +
        '                            <nobr><a href="http://' +
        item['PROPERTY']['SITE']['VALUE'] +
        '"\n' +
        '                                     target="_blank" rel="nofollow">' +
        item['PROPERTY']['SITE']['VALUE'] +
        '</a>' +
        '                            </nobr>\n' +
        '                        </div>\n' +
        '                    </div>';
    }
    list += '</div>';

    if (item['PROPERTY']['INFORMATION']['VALUE']) {
      list +=
        '<div class="buy-city__extra">\n' +
        '                    <svg class="buy-city__svg -info">\n' +
        '                        <use xlink:href="#info"/>\n' +
        '                    </svg>\n' +
        '                    <div class="buy-city-info__wrap">\n' +
        item['PROPERTY']['INFORMATION']['~VALUE']['TEXT'] +
        '                    </div>\n' +
        '                </div>';
    }
    list += '        </div>\n' + '    </div>';
  }
  return list;
}
