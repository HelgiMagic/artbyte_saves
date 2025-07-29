$.fn.serializeObject = function () {
  var self = this,
          json = {},
          push_counters = {},
          patterns = {
            "validate": /^[a-zA-Z][a-zA-Z0-9_]*(?:\[(?:\d*|[a-zA-Z0-9_]+)\])*$/,
            "key": /[a-zA-Z0-9_]+|(?=\[\])/g,
            "push": /^$/,
            "fixed": /^\d+$/,
            "named": /^[a-zA-Z0-9_]+$/
          };
  this.build = function (base, key, value) {
    base[key] = value;
    return base;
  };
  this.push_counter = function (key) {
    if (push_counters[key] === undefined) {
      push_counters[key] = 0;
    }
    return push_counters[key]++;
  };
  $.each($(this).serializeArray(), function () {
    // skip invalid keys
    if (!patterns.validate.test(this.name)) {
      return;
    }
    var k,
            keys = this.name.match(patterns.key),
            merge = this.value,
            reverse_key = this.name;
    while ((k = keys.pop()) !== undefined) {
      // adjust reverse_key
      reverse_key = reverse_key.replace(new RegExp("\\[" + k + "\\]$"), '');
      // push
      if (k.match(patterns.push)) {
        merge = self.build([], self.push_counter(reverse_key), merge);
      }
      // fixed
      else if (k.match(patterns.fixed)) {
        merge = self.build([], k, merge);
      }
      // named
      else if (k.match(patterns.named)) {
        merge = self.build({}, k, merge);
      }
    }
    json = $.extend(true, json, merge);
  });
  return json;
};

$.fn.imagesLoaded = function () {

  // get all the images (excluding those with no src attribute)
  var $imgs = this.find('img[src!=""]');
  // if there's no images, just return an already resolved promise
  if (!$imgs.length) {
    return $.Deferred().resolve().promise();
  }

  // for each image, add a deferred object to the array which resolves when the image is loaded (or if loading fails)
  var dfds = [];
  $imgs.each(function () {

    var dfd = $.Deferred();
    dfds.push(dfd);
    var img = new Image();
    img.onload = function () {
      dfd.resolve();
    };
    img.onerror = function () {
      dfd.resolve();
    };
    img.src = this.src;

  });

  // return a master promise object which will resolve when all the deferred objects have resolved
  // IE - when all the images are loaded
  return $.when.apply($, dfds);
};

function SendAjax(action, data, callBack) {
  callBack = callBack || function () {
  };

  $.ajax({
    url: '/ajax.php',
    dataType: 'json',
    type: 'POST',
    data: {
      'action': action,
      'data': data
    }
  })
  .done(function(data, status) {
    callBack(data, status);
  })
  .fail(function(data, status) {
    console.log(status, data);
  });
}

function initPlugins() {
  $('.js-styler').styler({
    selectSmartPositioning: false
  });

  Other.init();
  //$('.phone-input').mask('+7 (999) 999-99-99');
}

function isValidEmailAddress(emailAddress) {
  var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
  return pattern.test(emailAddress);
}

function isValidPhone($input) {
  return $input.inputmask('isComplete');
}

function myValidateForm($form) {
  $form.find(".req, select.req-select").removeClass("-error");
  $form.find(".js-styler").removeClass("-error");
  var valid = true;
  $form.find('.req, select.req-select').each(function (index, el) {
    var $input = $(el);
    if ($input.val() == "") {
      $(el).addClass('-error');
      valid = false;
    }
    if ($input.attr("type") == "checkbox" && $input.prop("checked") == false) {
      $(el).addClass('-error');
      valid = false;
    }
    /*if($input.is("select") && $input.find('option').filter(':selected').val() == "") {
     $(el).addClass('-error');
     }*/
    if (($input.attr("name") === "EMAIL" || $input.data('role') === 'email') && $input.val() === "") {
      $input.attr("data-content", "Обязательное поле");
    } else if (($input.attr("name") === "EMAIL" || $input.data('role') === 'email') && !isValidEmailAddress($input.val())) {
      $input.attr("data-content", "Поле заполнено не верно");
      $(el).addClass('-error');
      valid = false;
    }

    if (($input.attr("name") === "PHONE" || $input.data('role') === 'phone') && $input.val() === "") {
      $input.attr("data-content", "Обязательное поле");
    } else if (($input.attr("name") === "PHONE" || $input.data('role') === 'phone') && !isValidPhone($input)) {
      $input.attr("data-content", "Поле заполнено некорректно");
      $(el).addClass('-error');
      valid = false;
    }

    if ($input.attr("name") === "PASSWORD") {
      var haspassword_error = false;
      if ($input.val() === "") {
        $input.attr("data-content", "Обязательное поле");
      } else if ($input.val().length < 6) {
        $input.attr("data-content", "Поле заполнено не верно");
        haspassword_error = true;
      }
      if (haspassword_error) {
        $(el).addClass('-error');
        valid = false;
      }
    }
    if ($input.attr("name") === "CONFIRMpassword") {
      var haspassword_confirm_error = false;
      var password = $form.find(".req[name=PASSWORD]");
      if ($input.val() === "") {
        $input.attr("data-content", "Обязательное поле");
      } else if ($input.val() !== password.val()) {
        $input.attr("data-content", "Пароли должны совпадать");
        haspassword_confirm_error = true;
      }
      if (haspassword_confirm_error) {
        $(el).addClass('-error');
        valid = false;
      }
    }
  });
  return valid;
}

function diagnosticAccessValidateForm($form) { // Валидация формы отправки заявки на доступ к исследованиям
  $form.find(".req").removeClass("-error");

  var valid = true;
  $form.find('.req[data-required="true"]').each(function (index, el) {
    var $input = $(el);

    if ($input.val() == "") {
      $input.addClass('-error');
      valid = false;
    }
  });
  return valid;
}

function sendYandexGoal(_target) {
  if (typeof yaCounter42935374 !== 'undefined')
    yaCounter42935374.reachGoal(_target);
  if (typeof ga !== 'undefined')
    ga('send', 'pageview', '/' + _target + '.html');
}
