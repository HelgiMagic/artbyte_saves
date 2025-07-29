var DiagnosticForm = (function () {

    var $tabs = $('.js-diagnostic-form-tab');
    var $steps = $('.diagnostic-form__step');

    var validateInputs = function ($inputs) {
        $inputs.removeClass("-error");
        $(".js-styler").removeClass("-error");
        var valid = true;
        $inputs.each(function (index, el) {
            var $input = $(el);
            if ($input.is("select") && ($input.find('option').filter(':selected').val() === "" || $input.find('option').filter(':selected').val() === "-")) {
                $(el).addClass('-error');
                $(el).parent().addClass('-error');
                valid = false;
            } else if (!$input.is("select") && !$input.is("div") && $input.hasClass('number')) {
                if($input.val() === "" || !isInt(+$input.val()) && !isFloat(+$input.val())) {
                    $(el).addClass('-error');
                    valid = false;
                }
            } else if ($input.val() === "" && !$input.is("select") && !$input.is("div")) {
                $(el).addClass('-error');
                valid = false;
            }
            if ($input.attr("type") === "checkbox" && $input.prop("checked") === false) {
                $(el).addClass('-error');
                valid = false;
            }
            if ($input.attr("name") === "EMAIL" && $input.val() === "") {
            } else if ($input.attr("name") === "EMAIL" && !isValidEmailAddress($input.val())) {
                $(el).addClass('-error');
                valid = false;
            }
        });
        return valid;
    };

    var googleMap = function () {
        var markers = [];
        var mapOptions = {
            zoom: 4,
            center: new google.maps.LatLng(63.47805638524355, 89.35147045203976)
        };
        var map = new google.maps.Map(document.getElementById("diagnostic-map"), mapOptions);

        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        map.addListener('bounds_changed', function() {
            searchBox.setBounds(map.getBounds());
        });

        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
            var places = searchBox.getPlaces();

            if (places.length == 0) {
                return;
            }

            // Clear out the old markers.
            markers.forEach(function(marker) {
                marker.setMap(null);
            });
            markers = [];

            // For each place, get the icon, name and location.
            var bounds = new google.maps.LatLngBounds();
            places.forEach(function(place) {
                if (!place.geometry) {
                    console.log("Returned place contains no geometry");
                    return;
                }

                markers.push(new google.maps.Marker({
                    map: map,
                    icon: "/_img/map/mark.png",
                    position: place.geometry.location
                }));

                $('input[name=FIELD_COORDINATES]').val(place.geometry.location.lat().toFixed(5) + " " + place.geometry.location.lng().toFixed(5));

                if (place.geometry.viewport) {
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);
                }
            });
            map.fitBounds(bounds);
        });

        map.addListener('dblclick', function (event) {
            markers.forEach(function(marker) {
                marker.setMap(null);
            });
            markers = [];

            markers.push(new google.maps.Marker({
                position: new google.maps.LatLng(event.latLng.lat(), event.latLng.lng()),
                map: map,
                icon: "/_img/map/mark.png",
            }));

            $('input[name=FIELD_COORDINATES]').val(event.latLng.lat().toFixed(5) + " " + event.latLng.lng().toFixed(5));
        });


    };

    var replaceComma = function ($element, string) {
        var re = /,/;

        if(re.test(string)) {
            $element.val(string.replace(re, "."));
        }
    };

    var floating = function(num) {
        return isFinite(num) ? Math.round(parseFloat(num) * 100) / 100 : 0;
    };

    var inputNumber = function(value) {
        return !isNaN(parseFloat(value)) && isFinite(value) ? value : 0;
    };

    function isInt(n){
        return Number(n) === n && n % 1 === 0;
    }

    function isFloat(n){
        return Number(n) === n && n % 1 !== 0;
    }

    var animate = function () {
        var stepActiveIndex = $('.diagnostic-form__step.is-active').data('index'),
            stepLastIndex = $('.diagnostic-form__step').last().data('index');

        $('.diagnostic-form__bar').width(stepActiveIndex / stepLastIndex * 100 + "%");

        $("html, body").animate({scrollTop: $('.js-diagnostic-form').offset().top - 110}, 300, function () {
        });
    };

    var init = function () {
        googleMap();

        $('.js-diagnostic-date').datetimepicker({
            format: "DD.MM.YYYY"
        });

        $(document).on("keyup paste", '.js-number', function () {
            replaceComma($(this), $(this).val());
        });

        $(document).on('keyup paste', 'input[name=FIELD_VOLUME], input[name=FIELD_SOLUTION_RATE]', function () {
            var $this = $(this),
                value = $this.val();
            replaceComma($(this), value);

            var volume = $('input[name=FIELD_VOLUME]').val();
            var rate = $('input[name=FIELD_SOLUTION_RATE]').val();

            $('input[name=FIELD_MACHINING_AREA]').val(floating(volume / rate * 1000));
        });

        $(document).on('keyup paste', '.js-integer', function () {
            var $this = $(this),
                value = parseInt($this.val());
            $this.val(inputNumber(value));
        });

        $(document).on('change', '.js-diagnostic-form-tumbler', function () {
            var $this = $(this);
            if($this.is(':checked')) {
                $this.closest('.diagnostic-form-table__row').find('.diagnostic-form-table__sign').text("-");
            } else {
                $this.closest('.diagnostic-form-table__row').find('.diagnostic-form-table__sign').text("+");
            }
        });

        $(document).on('click', '.js-diagnostic-form-tab:not(.is-disabled):not(.is-active)', function () {
            var $this = $(this),
                $stepActive = $('.diagnostic-form__step.is-active'),
                stepActiveIndex = $stepActive.data('index'),
                thisIndex = $this.data('index'),
                $stepTabActive = $tabs.filter('[data-index=' + stepActiveIndex + ']');
            if (validateInputs($stepActive.find('.req'))) {
                $stepActive.removeClass('is-active');
                $steps.filter('[data-index=' + thisIndex + ']').addClass('is-active');

                $this.removeClass('is-complete').addClass('is-active');
                $stepTabActive.addClass('is-complete').removeClass('is-active');
                $('.js-styler').trigger('refresh');
                animate();
            }
        });

        $(document).on('click', '.js-diagnostic-form-prev, .js-diagnostic-form-next', function () {
            var $this = $(this),
                $stepActive = $('.diagnostic-form__step.is-active'),
                stepActiveIndex = $stepActive.data('index'),
                $stepTabActive = $tabs.filter('[data-index=' + stepActiveIndex + ']'),
                type = $this.hasClass('js-diagnostic-form-next') ? "next" : "prev";
            if (validateInputs($stepActive.find('.req'))) {
                $stepActive.removeClass('is-active');
                if(type === "next") {
                    $this.closest('.diagnostic-form__step').next().addClass('is-active');
                    $stepTabActive.removeClass('is-active').addClass('is-complete').next().removeClass('is-disabled').addClass('is-active');
                } else {
                    $this.closest('.diagnostic-form__step').prev().addClass('is-active');
                    $stepTabActive.removeClass('is-active').addClass('is-complete').prev().removeClass('is-disabled').addClass('is-active');
                }

                $('.js-styler').trigger('refresh');
                animate();
            }
        });

        $(document).on('change', ".diagnostic-form__select", function (e) {
            var $this = $(this),
                name = $this.val(),
                selectName = $this.attr('name');
            if(name === "") return false;
            if(name === "other") {
                $this.removeClass('req');
                $this.closest(".diagnostic-form__item-input").append('<div class="diagnostic-form__other"><input class="diagnostic-form__input diagnostic-form__input--w320 req" type="text" name="'+ selectName +'"/></div>');
            } else {
                $this.addClass('req');
                $this.closest(".diagnostic-form__item-input").find('.diagnostic-form__other').remove();
            }
        });

        $('input').keypress(function(e) {
            if(e.which == 13) {
                e.preventDefault();
            }
        });

        $(document).on('submit', '.js-diagnostic-form', function (e) {
            e.preventDefault();
            var $this = $(this),
                data = $this.serializeObject();

            SendAjax("DIAGNOSTIC_SUBMIT", data, function (data) {
                location.href = data["redirect_url"];
            });
        });
    };

    return {
        init: init
    }
})();
$(function () {
    if($('.js-diagnostic-form').length) {
        DiagnosticForm.init();
    }
});

var DiagnosticResult = (function () {

    var scrollConsultation = function () {
        var windowWidth = window.innerWidth;
        if (windowWidth >= 768) {
            $(".js-diagnostic-result-right").css({"height": $(".js-diagnostic-result-left").height() + "px"});
            $(".js-diagnostic-result-cons").stick_in_parent({offset_top: $(".header").height() + 20});
        } else {
            $(".js-diagnostic-result-right").css({"height": "auto"});
            $(".js-diagnostic-result-cons").trigger("sticky_kit:detach");
        }
    };

    var init = function () {
        scrollConsultation();
        $(window).on('scroll, resize', function () {
            scrollConsultation();
        })
    };

    return {
        init: init
    }
})();
$(function () {
    if($('.js-diagnostic-result').length) {
        DiagnosticResult.init();
    }
});
