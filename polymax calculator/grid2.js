$(function(){

    $.fn.pop = function() {
        var top = this.get(-1);
        this.splice(this.length-1,1);
        return top;
    };

    $.fn.shift = function() {
        var bottom = this.get(0);
        this.splice(0,1);
        return bottom;
    };
    function checkUpdate(input) {
        var $parent = input.parents("#item-list .group"),
            $index = $parent.index("#item-list .group"),
            $gridItemWidth = $parent.find('[name="grid-item-width"]').val(),
            $gridItemHeight = $parent.find('[name="grid-item-height"]').val(),
            $gridWidth = parseInt($('[name="grid-width"]').val()),
            $gridHeight = parseInt($('[name="grid-height"]').val());
        var num = $parent.find('.num').text();
        
        var min_element_size = parseInt( $('#cutting-setting-min-element-size').val() );
        var width_is_only_digits = $gridItemWidth.match(/^[0-9]+$/) != null;
        var height_is_only_digits = $gridItemHeight.match(/^[0-9]+$/) != null;

        $('#cutting-element-values').data('changed_field', input.attr('name'));
        $('#cutting-element-values').data('new_width', $gridItemWidth);
        $('#cutting-element-values').data('new_height', $gridItemHeight);
        $('#cutting-element-values').data('focus', input.attr('name'));
        
        var render_param = {
            gridWidth: $gridWidth,
            gridHeight: $gridHeight,
            scale: $scale,
            zoom: $zoom,
            cut_line_width: $cut_line_width
        };
        if (!width_is_only_digits || $gridItemWidth < min_element_size || $gridItemWidth > $gridWidth) {
            $('#cutting-element-values').data('invalid_field', 'width');
            
        }

        if (!height_is_only_digits || $gridItemHeight < min_element_size || $gridItemHeight > $gridHeight) {
            $('#cutting-element-values').data('invalid_field', 'height');
        }

        $('#cutting-element-values').data('render_param', render_param);



        var is_field_invalid = false;

        if ( $gridItemWidth != '' && $gridItemHeight != '' && width_is_only_digits && height_is_only_digits) {
            var rotate = false;


            if ( 
                    (      $gridItemWidth > $gridWidth 
                        && $gridItemWidth <= $gridHeight
                        && $gridItemHeight <= $gridWidth)
                    ||
                    (      $gridItemHeight > $gridHeight 
                        && $gridItemHeight <= $gridWidth
                        && $gridItemWidth <= $gridHeight)
                ) 
            {
                rotate = true;
            }

            if ( 
                       ( $gridItemWidth > $gridWidth && $gridItemWidth > $gridHeight)
                   ||  ( $gridItemHeight > $gridHeight && $gridItemHeight > $gridWidth)
                   ||  ( $gridItemWidth > $gridWidth && $gridItemWidth <= $gridHeight && $gridItemHeight > $gridWidth)
                   ||  ( $gridItemHeight > $gridHeight && $gridItemHeight <= $gridWidth && $gridWidth > $gridHeight)
                   ||  ( $gridItemWidth < min_element_size || $gridItemHeight < min_element_size )
                    
                ) 
            {
                is_field_invalid = true;
            }

            if ( rotate ) {
                var temp_width = $gridItemWidth;
                var temp_height = $gridItemHeight;
                $gridItemWidth = temp_height;
                $gridItemHeight = temp_width;

                $parent.find('[name="grid-item-width"]').val($gridItemWidth);
                $parent.find('[name="grid-item-height"]').val($gridItemHeight);
            }
        }
        else if ( $gridItemWidth != '' && $gridItemHeight != '' && (!width_is_only_digits || !height_is_only_digits) ) {
            is_field_invalid = true;
        } 

        window.console.log('is_field_invalid');
        window.console.log(is_field_invalid);

        if ( is_field_invalid && $('#cutting-element-values').data('invalid_field') != undefined ) {

            if (width_is_only_digits && height_is_only_digits) {
                if ( $gridItemWidth < min_element_size || $gridItemHeight < min_element_size )
                    $('.cutting-modal-input-error-message').html('Введенный размер не может быть меньше ' + min_element_size + ' мм.');
                
                if ( $gridItemWidth > $gridWidth || $gridItemHeight > $gridHeight )
                    $('.cutting-modal-input-error-message').html('Создаваемый элемент <span>не умещается</span> на лист!');
            }
            else {
                $('.cutting-modal-input-error-message').html('Введенный размер не может быть меньше ' + min_element_size + ' мм.');
            }

            $("#cutting-modal-input").dialog('open');
        }
        else {
            updateElement(render_param, num);
        }

    }

    function checkAddNewPlate(input) {
        var $parent = input.parents(".list-params .group"),
            $gridWidth = $parent.find('[name="grid-width"]').val(),
            $gridHeight = $parent.find('[name="grid-height"]').val();

        $('#cutting-list-values').data('width', $gridWidth);
        $('#cutting-list-values').data('height', $gridHeight);

        var min_plate_width_size = parseInt( $('#cutting-setting-min-plate-width').val() );
        var max_plate_width_size = parseInt( $('#cutting-setting-max-plate-width').val() );

        var min_plate_height_size = parseInt( $('#cutting-setting-min-plate-height').val() );
        var max_plate_height_size = parseInt( $('#cutting-setting-max-plate-height').val() );

        var input_data = $('#cutting-list-values').data();

        var width_is_only_digits = $gridWidth.match(/^[0-9]+$/) != null;
        var height_is_only_digits = $gridHeight.match(/^[0-9]+$/) != null;


        var error_message = '';
        $('#cutting-list-values').data('invalid_field', undefined);

        if ( input.attr('name') == 'grid-width') {
            if (    !width_is_only_digits 
                 || $gridWidth < min_plate_width_size
                 || $gridWidth > max_plate_width_size
               )
            {
                error_message = '<p>Введенный размер ширины не может быть меньше ' + min_plate_width_size + 'мм и больше ' + max_plate_width_size + ' мм.</p>';
                $('#cutting-list-values').data('invalid_field', 'grid-width');
            }
            else {
                $('#cutting-list-values').data('invalid_field', undefined);
            }
        }

        if ( input.attr('name') == 'grid-height') {
            if (    !height_is_only_digits 
                 || $gridHeight < min_plate_height_size
                 || $gridHeight > max_plate_height_size
               )
            {
                error_message = '<p>Введенный размер высоты не может быть меньше ' + min_plate_height_size + 'мм и больше ' + max_plate_height_size + ' мм.</p>';
                $('#cutting-list-values').data('invalid_field', 'grid-height');
            }
            else {
                $('#cutting-list-values').data('invalid_field', undefined);
            }
        }

        if ( input.val() != '' ) {
            $('.cutting-modal-plate-input-error-message').append( error_message );

            if ( $('#cutting-list-values').data('invalid_field') !== undefined && input.attr('name') == $('#cutting-list-values').data('invalid_field'))
                $("#cutting-modal-plate-input").dialog('open');
            else {
                $('.cutting-modal-plate-input-error-message').empty();
                if ( input.attr('name') == 'grid-width') {
                    $('input[name="grid-height"]').focus();
                }
            }
        }
    }

    function checkAddNew(input) {
        var $gridItemWidth = $('[name="new-grid-item-width"]').val(),
        $gridItemHeight = $('[name="new-grid-item-height"]').val(),
        $gridWidth = parseInt($('[name="grid-width"]').val()),
        $gridHeight = parseInt($('[name="grid-height"]').val());
        $('#cutting-element-values').data('new_item', true);
        $('#cutting-element-values').data('old_width', $gridItemWidth);
        $('#cutting-element-values').data('old_height', $gridItemHeight);
        $('#cutting-element-values').data('invalid_field', false);
        $('#cutting-element-values').data('changed_field', input.attr('name'));

        var min_element_size = parseInt( $('#cutting-setting-min-element-size').val() );
        var width_is_only_digits = $gridItemWidth.match(/^[0-9]+$/) != null;
        var height_is_only_digits = $gridItemHeight.match(/^[0-9]+$/) != null;
        
        var render_param = {
            gridWidth: $gridWidth,
            gridHeight: $gridHeight,
            scale: $scale,
            zoom: $zoom,
            cut_line_width: $cut_line_width
        };

        if (input.attr('name') == 'new-grid-item-width') {

            if (!width_is_only_digits || $gridItemWidth < min_element_size || $gridItemWidth > $gridWidth) {
                $('#cutting-element-values').data('invalid_field', 'width');
            }
        }

        if (input.attr('name') == 'new-grid-item-height') {
            if (!height_is_only_digits || $gridItemHeight < min_element_size || $gridItemHeight > $gridHeight) {
                    $('#cutting-element-values').data('invalid_field', 'height');
            }
        }

        //extra check for possible rotate
        if ( $gridItemWidth != '' && $gridItemHeight == '' && width_is_only_digits) {
            if ( 
                   $gridItemWidth > $gridWidth 
                && $gridItemWidth <= $gridHeight 
                ) 
            {
                $('#cutting-element-values').data('invalid_field', false);
            };
        }

        if ( $gridItemHeight != '' && $gridItemWidth == '' && height_is_only_digits) {
            if ( 
                   $gridItemHeight > $gridHeight 
                && $gridItemHeight <= $gridWidth 
                ) 
            {
                $('#cutting-element-values').data('invalid_field', false);
            };
        }

        var is_field_invalid = false;

        if ( $gridItemWidth != '' && $gridItemHeight != '' && width_is_only_digits && height_is_only_digits) {
            var rotate = false;


            if ( 
                    (      $gridItemWidth > $gridWidth 
                        && $gridItemWidth <= $gridHeight
                        && $gridItemHeight <= $gridWidth)
                    ||
                    (      $gridItemHeight > $gridHeight 
                        && $gridItemHeight <= $gridWidth
                        && $gridItemWidth <= $gridHeight)
                ) 
            {
                rotate = true;
            }

            if ( rotate ) {
                var temp_width = $gridItemWidth;
                var temp_height = $gridItemHeight;
                $gridItemWidth = temp_height;
                $gridItemHeight = temp_width;
            }

            if ( 
                       ( $gridItemWidth > $gridWidth)
                   ||  ( $gridItemHeight > $gridHeight)
                   ||  ( $gridItemWidth < min_element_size || $gridItemHeight < min_element_size )
                    
                ) 
            {
                is_field_invalid = true;
            }

            
        }
        else if ( $gridItemWidth != '' && $gridItemHeight != '' && (!width_is_only_digits || !height_is_only_digits) ) {
            is_field_invalid = true;
        }


        $('#cutting-element-values').data('render_param', render_param);

        if ( input.val() != '' ) {
            if ( is_field_invalid || ( !rotate && $('#cutting-element-values').data('changed_field').indexOf( $('#cutting-element-values').data('invalid_field') ) != -1)) {
            
                 if (width_is_only_digits || height_is_only_digits) {
                    if ( $gridItemWidth < min_element_size || $gridItemHeight < min_element_size )
                        $('.cutting-modal-input-error-message').html('Введенный размер не может быть меньше ' + min_element_size + ' мм.');
                    
                    if ( $gridItemWidth > $gridWidth || $gridItemHeight > $gridHeight )
                        $('.cutting-modal-input-error-message').html('Создаваемый элемент <span>не умещается</span> на лист!');
                }
                else {
                    $('.cutting-modal-input-error-message').html('Введенный размер не может быть меньше ' + min_element_size + ' мм.');
                }

                $("#cutting-modal-input").dialog('open');
            }
            else if ( $gridItemWidth && $gridItemHeight ) {
                addNewElement($gridItemWidth, $gridItemHeight, $gridWidth, $gridHeight);
            }
            else {
                if ( $gridItemWidth ) {
                    $('input[name="new-grid-item-height"]').focus();
                }
            }
        }

    };

    function checkAddMany() {
        var $gridWidth = parseInt($('[name="grid-width"]').val()),
            $gridHeight = parseInt($('[name="grid-height"]').val());

        var width = $('#modal-add-many-width').val();
        var height = $('#modal-add-many-height').val();
        var num = $('#modal-add-many-quantity').val();

        var width_is_only_digits = width.match(/^[0-9]+$/) != null;
        var height_is_only_digits = height.match(/^[0-9]+$/) != null;
        var num_is_only_digits = num.match(/^[0-9]+$/) != null;

        var min_element_size = parseInt( $('#cutting-setting-min-element-size').val() );

        if (    width_is_only_digits
             && height_is_only_digits
             && num_is_only_digits
             && width >= min_element_size
             && height >= min_element_size
             && (width <= $gridWidth || (width > $gridWidth && width <= $gridHeight) )
             && (height <= $gridHeight || (height > $gridHeight && height <= $gridWidth) )
             && num > 0) 
        {
            $('#cutting-modal-add-many button').prop('disabled', false);
            return true;
        }
        else {
            if ( !$('#cutting-modal-add-many button').prop('disabled') )
                $('#cutting-modal-add-many button').prop('disabled', true);
            return false;
        }



    }
    function addManualPlate($gridWidth, $gridHeight) {
        if( $(".grid").length == 1){
            $(".grid").remove();
            $("#item-list").empty();
        }
            
        var $wrapperWidth = $('.grid-wrapper')[0].getBoundingClientRect().width;
            $wrapperHeight = $('.grid-wrapper')[0].getBoundingClientRect().height;
        if($gridWidth / $gridHeight > $wrapperWidth / $wrapperHeight){
            $scale = $wrapperWidth / $gridWidth;
        }
        else{
            $scale = $wrapperHeight / $gridHeight;
        }

        addGrid($gridWidth, $gridHeight, true);

        $('.disabled-block').removeClass("disabled-block");
        $('.grid-options .name, #new-grid-item').removeClass("hidden");
        
        $init_grid_width = $gridWidth;
        $init_grid_width = $gridHeight;
        $init_scale = $scale;
        $init_zoom = $zoom;
        $(".grid").css({"width": Math.ceil($gridWidth * $scale * $zoom), "height": Math.ceil($gridHeight * $scale * $zoom)});

        $('.box-grid .items-params .actions-wrapper').css('visibility', 'visible');
        $('.box-grid .items-params .actions-wrapper').width( $('#new-grid-item').width() );
    }

    function addPlate($gridWidth, $gridHeight) {
        if( $(".grid").length == 1){
            $(".grid").remove();
            $("#item-list").empty();
        }
            
        var $wrapperWidth = $('.grid-wrapper')[0].getBoundingClientRect().width;
            $wrapperHeight = $('.grid-wrapper')[0].getBoundingClientRect().height;
        if($gridWidth / $gridHeight > $wrapperWidth / $wrapperHeight){
            $scale = $wrapperWidth / $gridWidth;
        }
        else{
            $scale = $wrapperHeight / $gridHeight;
        }
        
        addGrid($gridWidth, $gridHeight);
        $('.disabled-block').removeClass("disabled-block");
        $('.grid-options .name, #new-grid-item').removeClass("hidden");
        
        $init_grid_width = $gridWidth;
        $init_grid_width = $gridHeight;
        $init_scale = $scale;
        $init_zoom = $zoom;
        $(".grid").css({"width": Math.ceil($gridWidth * $scale * $zoom), "height": Math.ceil($gridHeight * $scale * $zoom)});

        $('.box-grid .items-params .actions-wrapper').css('visibility', 'visible');
        $('.box-grid .items-params .actions-wrapper').width( $('#new-grid-item').width() );

        setTimeout(function(){
            $('input[name="new-grid-item-width"]').focus();
        }, 1);

        //$('input[name="grid-width"]').prop("disabled", true);
        //$('input[name="grid-height"]').prop("disabled", true);
        
    }

    function addNewElement($gridItemWidth, $gridItemHeight, $gridWidth, $gridHeight) {
        window.console.log('add new item');
        $('#new-grid-item').empty();

        $('#new-grid-item').append('<div class="group">\
                                <label>A:</label> <input type="text" class="form-control" name="new-grid-item-width" value="">\
                                <label>B:</label> <input type="text" class="form-control" name="new-grid-item-height" value="">\
                            </div>');
        $('#cutting-element-values').removeData();
        //when add first elem - set disablet to grid sizes
        if ( $('#item-list .groups .group').length == 0 ) {
            $('[name="grid-width"]').prop("disabled", true);
            $('[name="grid-height"]').prop("disabled", true);
        }

        $('[name="new-grid-item-width"]').val("");
        $('[name="new-grid-item-height"]').val("");

        if ( $("#item-list .list-title").length == 0 ) {
            $("#item-list").append('<div class="list-title open active"><span class="list-title-arrow"></span>Лист 1</div><div class="groups"></div>');
        }

        var added_listItem_count = false;
        if ( $('#item-list .groups .group').length > 0 ) {
             added_listItem_count = Math.max.apply(null, $('#item-list .groups .group').find('.num').map( function() { return $(this).text()})) + 1;
        }
        else {
            added_listItem_count = 1;
        }

        $listItem = '<div class="group"><span class="num">'+( added_listItem_count )+'</span>\
                    <label>A:</label> <input type="text" class="form-control" name="grid-item-width" value="'+$gridItemWidth+'"/>\
                    <label>B:</label> <input type="text" class="form-control" name="grid-item-height" value="'+$gridItemHeight+'"/>\
                    <a href="javascript:void(0)" class="remove icon-item-remove" title="Удалить элемент"></a></div>';
                        
        var groups_auto_cals = $('#item-list .groups').filter(function( index, group ) {
                                    return $(group).data('calculate') != 'manual';
                                });

        if ( groups_auto_cals.length > 0 ) {
            groups_auto_cals.last().append($listItem);
        }
        else {
            addGrid($gridWidth, $gridHeight);
            $('#item-list .groups').last().append($listItem);
        }

        var render_param = {
            gridWidth: $gridWidth,
            gridHeight: $gridHeight,
            scale: $scale,
            zoom: $zoom,
            cut_line_width: $cut_line_width
        };

        MainRender(render_param);
        setTimeout(function(){
            $('input[name="new-grid-item-width"]').focus();
        }, 1);

    }

    function updateElement(render_param, num) {
            MainRender(render_param); 

            $('.grid-item').filter( function(n, elem) {
                return $(elem).find('span').text() == num;
            }).first().addClass('checked');

            $('#item-list .group').removeClass('active');
            $('#item-list .group').filter( function(n, elem) {
                return $(elem).find('.num').text() == num;
            }).first().addClass('active');

            var active = $('#item-list .group.active');
            var new_width = active.find('input[name="grid-item-width"]').val();
            var new_height = active.find('input[name="grid-item-height"]').val();
            window.console.log(' UPDATE ');
            $('.grid-options .element input[name="grid-item-width"]').val(new_width);
            $('.grid-options .element input[name="grid-item-height"]').val(new_height);

    }

    var $scale = 0,
        $zoom = 1,
        $zoomStep = 0.1,
        $zoomMin = 0.4;
        $zoomMax = 3;
        $cut_line_width = 0;
        $init_grid_width = 0;
        $init_grid_height = 0;
        $init_scale = 0;
        $init_zoom = 1;
        $meter_cost = 0;
        $actual_cut_line_width = null;

    //get init settings
    $(document).ready(function () {
        $cut_line_width = parseInt( $('#cutting-setting-cut-line-width').val() );
        $meter_cost = parseFloat( $('#cutting-setting-meter-cost').val() );
    });

    $(document).ready(function () {
        
        $('input[name="grid-width"]').focus(); 
        $('.box-grid .grid-wrapper').width( $('.box-grid .grid-wrapper').width() );
        $("#cutting-modal-add-many").dialog({
                        autoOpen: false,
                        draggable: false,
                        modal: true,
                        resizable: false,
                        title: "Несколько одинаковых элементов",
                        closeText: "",
                        width: 356,
                        position: { my: "center", at: "center-10 center-100", of: ".box-grid .old-col-11" },
                        close: function( event, ui ) {
                            $("#modal-add-many-width").val('');
                            $("#modal-add-many-height").val('');
                            $("#modal-add-many-quantity").val('');
                        }
                    });

        $("#cutting-modal-mode-switch-enable").dialog({
                        autoOpen: false,
                        draggable: false,
                        modal: true,
                        resizable: false,
                        title: "Переключение режима",
                        closeText: "",
                        width: 356,
                        position: { my: "center", at: "center-10 center-100", of: ".box-grid .old-col-11" },
                    });
        $("#cutting-modal-mode-switch-disable").dialog({
                        autoOpen: false,
                        draggable: false,
                        modal: true,
                        resizable: false,
                        title: "Переключение режима",
                        closeText: "",
                        width: 356,
                        position: { my: "center", at: "center-10 center-100", of: ".box-grid .old-col-11" },
                    });

        $("#cutting-modal-delete").dialog({
                        autoOpen: false,
                        draggable: false,
                        modal: true,
                        resizable: false,
                        title: "Внимание",
                        closeText: "",
                        width: 433,
                        position: { my: "center", at: "center-10 center-100", of: ".box-grid .old-col-11" },
                        open: function( event, ui ) {
                            $('#cutting-modal-delete-num').text( $('#cutting-element-to-delete-index').val() );
                        }
                    });

        $("#cutting-modal-input").dialog({
                        autoOpen: false,
                        draggable: false,
                        modal: true,
                        resizable: false,
                        title: "Ошибка габаритов элемента",
                        closeText: "",
                        width: 433,
                        position: { my: "center", at: "center-10 center-100", of: ".box-grid .old-col-11" },
                    });

        $("#cutting-modal-plate-input").dialog({
                        autoOpen: false,
                        draggable: false,
                        modal: true,
                        resizable: false,
                        title: "Ошибка габаритов листа!",
                        closeText: "",
                        width: 433,
                        position: { my: "center", at: "center-10 center-100", of: ".box-grid .old-col-11" },
                    });

    });

    $.contextMenu({
            selector: '.grid-item', 
            callback: function(key, options) {
                if (key == 'delete') {
                    $('#cutting-element-to-delete-index').val( $(options.$trigger).find('span').text() );
                    
                    if ( $('#cutting-element-delete-confirmation').val() != 0) {
                        $('#cutting-modal-delete').dialog('open');
                    }
                    else {
                        if ( !$('#cutting-manual').is(":checked") ) {
                            // todo delete by num;
                            var num = parseInt($(options.$trigger).text() );
                            $('#item-list .groups .group').filter( function(n, group) {
                                return $(group).find('.num').text() == num;
                            }).remove();
                            
                            var $gridWidth = parseInt($('[name="grid-width"]').val());
                            var $gridHeight = parseInt($('[name="grid-height"]').val());
                            var render_param = {
                                gridWidth: $gridWidth,
                                gridHeight: $gridHeight,
                                scale: $scale,
                                zoom: $zoom,
                                cut_line_width: $cut_line_width
                            };

                            MainRender(render_param); 
                        }
                        else {
                            var num_to_delete = parseInt($(options.$trigger).text() );
                            $('#item-list .groups .group').filter( function(n, group) {
                                return parseInt($(group).find('.num').text()) == num_to_delete
                            }).remove();
                            var grid_index = $(options.$trigger).parent('.grid').index();
                            $(options.$trigger).remove();
    
                            redrawManualGrigAfterDrag( grid_index );
                        }
                    }
                }
                else if (key == 'rotate') {
                    var $elem = options.$trigger;
                    rotateItem($elem);
                }
            },
            items: {
                "delete": {
                    name: "Удалить", 
                    icon: function(opt, $itemElement, itemKey, item){
                        $itemElement.html('<span class="icon-item-remove content-menu-icon-item-remove" aria-hidden="true"></span><span class="context-menu-name-custom context-menu-name-custom-delete">Удалить</span>');

                        return 'context-menu-icon-updated';
                    }
                },
                "rotate": {
                    name: "Удалить", 
                    icon: function(opt, $itemElement, itemKey, item){
                        $itemElement.html('<span class="icon-rotate" aria-hidden="true"></span><span class="context-menu-name-custom context-menu-name-custom-rotate">Повернуть</span>');

                        return 'context-menu-icon-updated';
                    },
                    disabled: function(key, options) { 
                        var $elem = options.$trigger;
                        return !$('#cutting-manual').is(":checked") || !canRotate($elem);
                    }
                }
            }
        });

    $(document).keyup(function (event) {
        if (event.keyCode == 46) {
            
            if ($('#item-list .group.active').length == 1) {
                var is_focused = 0;
                $('.group').find('input').each( function(n, input) {
                    if ( $(input).is(':focus') )
                        is_focused++;
                });

                if ( is_focused > 0 )
                    return false;

                $('#cutting-element-to-delete-index').val( $('#item-list .group.active').find('.num').text() );
                
                if ( $('#cutting-element-delete-confirmation').val() != 0) {
                    $('#cutting-modal-delete').dialog('open');
                }
                else
                {
                   $('#item-list .group.active').remove();
                    var $gridWidth = parseInt($('[name="grid-width"]').val());
                    var $gridHeight = parseInt($('[name="grid-height"]').val());

                    var render_param = {
                            gridWidth: $gridWidth,
                            gridHeight: $gridHeight,
                            scale: $scale,
                            zoom: 1,
                            cut_line_width: $cut_line_width
                        };

                    MainRender(render_param); 
                }
            }
        }
    });

    //send data to backend for pdf generation purpose

    $(document).on("click", "#cutting-get-pdf", function(event) {
        event.preventDefault();

        // THINK reset zoom before???
        // get all grid visible
        var visible_grid_index = $('.grid-wrapper .grid').filter( function(n, grid) {
            return $(grid).css('display') == 'block';
        }).index();

        $('.grid-wrapper .grid').css('display', 'block');

        var data = {};
        data.plate = {
            w: parseInt( $('[name="grid-width"]').val() ),
            h: parseInt( $('[name="grid-height"]').val() )
        };

        data.summ = {
            list_count: parseInt( $('.grid-wrapper .grid').length ),
            total_cut_lenght: parseFloat( $('#total-cut-lenght').text() ),
            cutting_meter_remains: parseFloat ( $('#cutting-meter-remains').text() )
        };

        data.elements = [];
        data.manual_elements = [];
        $('#item-list .groups').each( function(n, group) {
            var list = [];
            $(group).find('.group').each( function(m, elem) {
                var elem_width = parseInt( $(elem).find('input[name="grid-item-width"]').val() );
                var elem_height = parseInt( $(elem).find('input[name="grid-item-height"]').val() );
                var elem_num = parseInt( $(elem).find('.num').text() );
                list.push({
                    w: elem_width,
                    h: elem_height,
                    num: elem_num
                });
            });
            data.elements.push(list);

            if ( $(this).data('calculate') == 'manual' ) {
                data.manual_elements.push(list);
            }
            
        });

        data.draw = [];

        $('.grid-wrapper .grid').each( function(n, grid) {

            var grid_data = {};

            grid_data.w_px = parseInt( $(grid).width() );
            grid_data.h_px = parseInt( $(grid).height() );
            grid_data.cut_line_px = $actual_cut_line_width;
            grid_data.objects = [];

            $(grid).find('.grid-item').each( function(m, item) {

                var item_y_px = parseInt( $(item).position().left );
                var item_x_px = parseInt( $(item).position().top );
                var item_width_px = parseInt( $(item).width() );
                var item_height_px = parseInt( $(item).height() );
                var item_num = parseInt( $(item).text() );

                grid_data.objects.push({
                    item_x_px: item_x_px,
                    item_y_px: item_y_px,
                    item_width_px: item_width_px,
                    item_height_px: item_height_px,
                    item_num: item_num
                });
            });


            grid_data.lines = [];

            $(grid).find('.cut-line').each( function(m, line) {

                var line_y_px = parseInt( $(line).position().left );
                var line_x_px = parseInt( $(line).position().top );
                var line_width_px = parseInt( $(line).width() );
                var line_height_px = parseInt( $(line).height() );

                grid_data.lines.push({
                    line_x_px: line_x_px,
                    line_y_px: line_y_px,
                    line_width_px: line_width_px,
                    line_height_px: line_height_px
                });
            });

            data.draw.push(grid_data);
        });

        // return visible
        $('.grid-wrapper .grid').css('display', 'none');
        $('.grid-wrapper .grid').eq(visible_grid_index).css('display', 'block');
        //ajax
        

        $.ajax({
            type: "POST",
            data: { type: 'get_cutting_pdf', data: JSON.stringify(data) },
            beforeSend: function() { 
              $("#cutting-get-pdf").prop('disabled', true);
              $("#cutting-get-pdf").html('<i class="icon-cutting-save-pdf-icon"></i> <span id="button-save-pdf-text">Обработка</span>');
              $("#cutting-get-pdf").width(119.875);
              
            },
            success:function(data){ 
              var data = $.parseJSON(data);
              if ( data.success )
                window.open( data.path,'_blank' );
              $("#cutting-get-pdf").prop('disabled', false);
              $("#cutting-get-pdf").html('<i class="icon-cutting-save-pdf-icon"></i> <span id="button-save-pdf-text">Сохранить в PDF</span>');
              $("#cutting-get-pdf").width(119.875);
              $("#button-save-pdf-text").css('padding-left', '2px');
            }
        });

    });

    $(document).on("click", "#cutting-manual", function(event) {
        event.preventDefault();
        if ( $(this).prop( "checked" ) ) {
            $('#cutting-modal-mode-switch-enable').dialog('open');
        }
        else {
            $('#cutting-modal-mode-switch-disable').dialog('open');
        }

    });

    $(document).on("click", "#cutting-modal-delete-without-confirmation", function(event) {
        
        if ( $(this).prop( "checked" ) ) {
            $('#cutting-element-delete-confirmation').val('0');
        }
        else {
            $('#cutting-element-delete-confirmation').val('1');
        }

    });

    $(document).on("click", "#cutting-modal-delete .cutting-modal-delete-yes", function(event) {
        event.preventDefault();

        var num = $('#cutting-element-to-delete-index').val();

        $(".grid-options .element").addClass("invisible");

        if ( !$('#cutting-manual').is(":checked") ) {
            $('#item-list .groups .group').filter( function(n, group) {
                return $(group).find('.num').text() == num;
            }).remove();
           
            $("#item-list .groups").each(function() {
                if ( $(this).children().length == 0)
                    $(this).remove();
            });

            var $gridWidth = parseInt($('[name="grid-width"]').val());
            var $gridHeight = parseInt($('[name="grid-height"]').val());
            var render_param = {
                gridWidth: $gridWidth,
                gridHeight: $gridHeight,
                scale: $scale,
                zoom: $zoom,
                cut_line_width: $cut_line_width
            };

            MainRender(render_param); 
        }
        else {
            $('#item-list .groups .group').filter( function(n, group) {
                return parseInt($(group).find('.num').text()) == num
            }).remove();
            $('.grid-item').filter( function(n, group) {
                return parseInt($(group).find('span').text()) == num
            }).remove();

            $("#item-list .groups").each(function() {
                if ( $(this).children().length == 0)
                    $(this).remove();
            });
            var grid_index = $('.grid').filter( function( n, grid) {
                return $(grid).css('display') == 'block';
            }).index();
            redrawManualGrigAfterDrag( grid_index );
            
        }
        $('#cutting-modal-delete').dialog('close');
    });

    $(document).on("click", "#cutting-modal-delete .cutting-modal-delete-no", function(event) {
        event.preventDefault();

        $('#cutting-modal-delete').dialog('close');
    });


    $(document).on("click", "#cutting-modal-mode-switch-enable .cutting-modal-manual-mode-yes", function(event) {
        event.preventDefault();
        $("#cutting-manual").prop( "checked", true );
        //
        var calculate = ( $("#cutting-manual").prop( "checked" ) ) ? 'manual' : 'auto';
        var grid_index = $('.grid-wrapper .grid').filter(function( index ) {
                             return $('.grid-wrapper .grid').eq(index).attr('style').indexOf("visibility: visible") != -1;
                          }).index();

       $('.grid-wrapper .grid').eq(grid_index).data('calculate', calculate);
       $(document).trigger( "dominion:calculate-toggle", grid_index);
       //
        $('#cutting-modal-mode-switch-enable').dialog('close');

         $('[name="new-grid-item-width"]').prop('disabled', 'disabled');
        $('[name="new-grid-item-height"]').prop('disabled', 'disabled');

        $('.actions .icon-cutting-add-many').hide();
    });

     $(document).on("click", "#cutting-modal-mode-switch-disable .cutting-modal-manual-mode-yes", function(event) {
        event.preventDefault();
        $("#cutting-manual").prop( "checked", false );
        //
        var calculate = ( $("#cutting-manual").prop( "checked" ) ) ? 'manual' : 'auto';
        var grid_index = $('.grid-wrapper .grid').filter(function( index ) {
                             return $('.grid-wrapper .grid').eq(index).attr('style').indexOf("visibility: visible") != -1;
                          }).index();

       $('.grid-wrapper .grid').eq(grid_index).data('calculate', calculate);
       $(document).trigger( "dominion:calculate-toggle", grid_index);
       //
        $('#cutting-modal-mode-switch-disable').dialog('close');

        var $gridWidth = parseInt($('[name="grid-width"]').val());
        var $gridHeight = parseInt($('[name="grid-height"]').val());

        var render_param = {
                gridWidth: $gridWidth,
                gridHeight: $gridHeight,
                scale: $scale,
                zoom: 1,
                cut_line_width: $cut_line_width
            };

        MainRender(render_param); 

        $('[name="new-grid-item-width"]').prop('disabled', '');
        $('[name="new-grid-item-height"]').prop('disabled', '');

        $('.actions .icon-cutting-add-many').show();

    });

    $(document).on("click", "#cutting-modal-mode-switch-disable .cutting-modal-manual-mode-no", function(event) {
        event.preventDefault();
        $('#cutting-modal-mode-switch-disable').dialog('close');
    });

    $(document).on("click", "#cutting-modal-mode-switch-enable .cutting-modal-manual-mode-no", function(event) {
        event.preventDefault();
        $('#cutting-modal-mode-switch-enable').dialog('close');
    });

    $(document).on("click", "#cutting-modal-plate-input .cutting-modal-input-correct", function(event) {
        event.preventDefault();
        event.stopPropagation();

        var input_data = $('#cutting-list-values').data();

        var min_plate_width_size = parseInt( $('#cutting-setting-min-plate-width').val() );
        var max_plate_width_size = parseInt( $('#cutting-setting-max-plate-width').val() );

        var min_plate_height_size = parseInt( $('#cutting-setting-min-plate-height').val() );
        var max_plate_height_size = parseInt( $('#cutting-setting-max-plate-height').val() );

        var width_is_only_digits = input_data.width.match(/^[0-9]+$/) != null;
        var height_is_only_digits = input_data.height.match(/^[0-9]+$/) != null;

        var error_message = '';

        var plate_width = input_data.width;
        var plate_height = input_data.height;
        if ( width_is_only_digits )
        {
            if ( input_data.new_width < min_plate_width_size )
                plate_width = min_plate_width_size;
            if ( input_data.new_width > max_plate_width_size )
                plate_width = max_plate_width_size;
        }
        else 
        {
            plate_width = max_plate_width_size;
        }

        if ( height_is_only_digits )
        {
            if ( input_data.new_height < min_plate_height_size )
                plate_height = min_plate_height_size;
            if ( input_data.new_height > max_plate_height_size )
                plate_height = max_plate_height_size;
        }
        else
        {
            plate_height = max_plate_height_size;
        }

        if ( input_data.invalid_field == 'grid-width') {
            $('input[name="grid-width"]').val(plate_width);
            setTimeout(function(){
                $('input[name="grid-height"]').focus();
            }, 1);
        }

        if ( input_data.invalid_field == 'grid-height') {
            $('input[name="grid-height"]').val(plate_height);
        }
        
        if (input_data.width != "" && input_data.height != "")
            addPlate(plate_width, plate_height);

        $('#cutting-list-values').removeData();
        $('#cutting-modal-plate-input').dialog('close');

    });

    $(document).on("click", "#cutting-modal-plate-input .cutting-modal-delete-cancel", function(event) {
        event.preventDefault();

        $('input[name="grid-width"]').val('');
        $('input[name="grid-height"]').val('');
        
        $('.grid-options').addClass("disabled-block");
        $('.grid-wrapper').addClass("disabled-block");
        $('.items-params').addClass("disabled-block");
        $('.box-params.result').addClass("disabled-block");
        $('.grid-controls').addClass("disabled-block");
        $('#item-list').empty();
        
        $('.grid-options .name, #new-grid-item').addClass("hidden");
        $('.grid').remove();

        $('#cutting-modal-plate-input').dialog('close');
        $('.cutting-modal-plate-input-error-message').empty();
        setTimeout(function(){
            $('input[name="grid-width"]').focus();
        }, 1);


    });


    $(document).on("click", "#cutting-modal-input .cutting-modal-input-correct", function(event) {
        event.preventDefault();

        var $gridWidth = parseInt($('[name="grid-width"]').val()),
            $gridHeight = parseInt($('[name="grid-height"]').val());

        var $gridItemWidth = $('#modal-add-many-width').val(),
            $gridItemHeight = $('#modal-add-many-height').val();

        var width_is_only_digits = $gridItemWidth.match(/^[0-9]+$/) != null;
        var height_is_only_digits = $gridItemHeight.match(/^[0-9]+$/) != null;

        var min_element_size = parseInt($('#cutting-setting-min-element-size').val());

        var input_data = $('#cutting-element-values').data();
        
        window.console.log('input_data');
        window.console.log(input_data);

        var set_focus_to_new_height = false;

        if ( input_data.add_many ) {
            
            if (input_data.add_many_field == 'modal-add-many-width') {
                if ( parseInt($gridItemWidth) < parseInt(min_element_size) || !width_is_only_digits) {
                    $gridItemWidth = min_element_size;
                    $('#' + input_data.add_many_field).val($gridItemWidth);

                } else {
                    if (       $gridItemHeight != ''
                            && parseInt($gridItemWidth) >= parseInt($gridWidth) 
                            && parseInt($gridItemHeight) == parseInt($gridWidth) 
                          ) 
                    {
                        $('#' + input_data.add_many_field).val($gridHeight);
                        $gridItemWidth = $gridHeight;
                    }
                    else if (
                                   $gridItemHeight != ''
                                && parseInt($gridItemWidth) > parseInt($gridWidth)  
                                && parseInt($gridItemHeight) <= parseInt($gridHeight)
                            ) 
                    {
                        $('#' + input_data.add_many_field).val($gridWidth);
                        $gridItemWidth = $gridWidth;
                    }
                    else if (       $gridItemHeight == ''
                            && parseInt($gridItemWidth) > parseInt($gridWidth) 
                          ) 
                    {
                        $('#' + input_data.add_many_field).val($gridWidth);
                        $gridItemWidth = $gridWidth;
                    }

                };

            }
            
            if (input_data.add_many_field == 'modal-add-many-height') {
                if (parseInt($gridItemHeight) < parseInt(min_element_size) || !height_is_only_digits) {
                    $gridItemHeight = min_element_size;
                    $('#' + input_data.add_many_field).val( $gridItemHeight );

                } else {
                    if (       $gridItemWidth != ''
                            && parseInt($gridItemHeight) >= parseInt($gridHeight)  
                            && parseInt($gridItemWidth) == parseInt($gridHeight)
                          ) 
                    {
                        $('#' + input_data.add_many_field).val($gridWidth);
                        $gridItemHeight = $gridWidth;
                    }
                    else if (
                                   $gridItemWidth != ''
                                && parseInt($gridItemHeight) > parseInt($gridHeight)  
                                && parseInt($gridItemWidth) <= parseInt($gridWidth)
                            ) 
                    {
                        $('#' + input_data.add_many_field).val($gridHeight);
                        $gridItemHeight = $gridHeight;
                    }
                    else if (       $gridItemWidth == ''
                            && parseInt($gridItemHeight) > parseInt($gridHeight) 
                          ) 
                    {
                        $('#' + input_data.add_many_field).val($gridHeight);
                        $gridItemHeight = $gridHeight;
                    }

                };

                
            }

            if (    width_is_only_digits
                 && height_is_only_digits
                 && $gridItemWidth >= min_element_size
                 && $gridItemHeight >= min_element_size
                 && (  
                       (    $gridItemWidth <= $gridWidth 
                         && $gridItemHeight <= $gridHeight
                       )
                       ||
                       (    $gridItemWidth <= $gridHeight 
                         && $gridItemHeight <= $gridWidth
                       )
                    )

                ) {
                
            }
            
        }
        else if ( input_data.new_item ) {
            var $gridItemWidth = $('[name="new-grid-item-width"]').val(),
                $gridItemHeight = $('[name="new-grid-item-height"]').val();

            var width_is_only_digits = $gridItemWidth.match(/^[0-9]+$/) != null;
            var height_is_only_digits = $gridItemHeight.match(/^[0-9]+$/) != null;

            if (input_data.changed_field == 'new-grid-item-width') {
                if ( parseInt($gridItemWidth) < parseInt(min_element_size) || !width_is_only_digits) {
                    $gridItemWidth = min_element_size;
                    $('[name="new-grid-item-width"]').val( $gridItemWidth );

                } else {
                    if (       $gridItemHeight != ''
                            && parseInt($gridItemWidth) >= parseInt($gridWidth) 
                            && parseInt($gridItemHeight) == parseInt($gridWidth) 
                          ) 
                    {
                        $('[name="new-grid-item-width"]').val( $gridHeight );
                        $gridItemWidth = $gridHeight;
                    }
                    else if (
                                   $gridItemHeight != ''
                                && parseInt($gridItemWidth) > parseInt($gridWidth)  
                                && parseInt($gridItemHeight) <= parseInt($gridHeight)
                            ) 
                    {
                        $('[name="new-grid-item-width"]').val( $gridWidth );
                        $gridItemWidth = $gridWidth;
                    }
                    else if (       $gridItemHeight == ''
                            && parseInt($gridItemWidth) > parseInt($gridWidth) 
                          ) 
                    {
                        $('[name="new-grid-item-width"]').val( $gridWidth );
                        $gridItemWidth = $gridWidth;
                    }

                };

                
                
                input_data.invalid_field = undefined;
                set_focus_to_new_height = true;
                
            }
            
            if (input_data.changed_field == 'new-grid-item-height') {
                if (parseInt($gridItemHeight) < parseInt(min_element_size) || !height_is_only_digits) {
                    $gridItemHeight = min_element_size;
                    $('[name="new-grid-item-height"]').val( $gridItemHeight );

                } else {
                    if (       $gridItemWidth != ''
                            && parseInt($gridItemHeight) >= parseInt($gridHeight)  
                            && parseInt($gridItemWidth) == parseInt($gridHeight)
                          ) 
                    {
                        $('[name="new-grid-item-height"]').val( $gridWidth );
                        $gridItemHeight = $gridWidth;
                    }
                    else if (
                                   $gridItemWidth != ''
                                && parseInt($gridItemHeight) > parseInt($gridHeight)  
                                && parseInt($gridItemWidth) <= parseInt($gridWidth)
                            ) 
                    {
                        $('[name="new-grid-item-height"]').val( $gridHeight );
                        $gridItemHeight = $gridHeight;
                    }
                    else if (       $gridItemWidth == ''
                            && parseInt($gridItemHeight) > parseInt($gridHeight) 
                          ) 
                    {
                        $('[name="new-grid-item-height"]').val( $gridHeight );
                        $gridItemHeight = $gridHeight;
                    }

                };

               

                input_data.invalid_field = undefined;
                
            }


            if (    $('[name="new-grid-item-width"]').val().match(/^[0-9]+$/) != null
                 && $('[name="new-grid-item-height"]').val().match(/^[0-9]+$/) != null
                 && $gridItemWidth >= min_element_size
                 && $gridItemHeight >= min_element_size
                 && (  
                       (    $gridItemWidth <= $gridWidth 
                         && $gridItemHeight <= $gridHeight
                       )
                       ||
                       (    $gridItemWidth <= $gridHeight 
                         && $gridItemHeight <= $gridWidth
                       )
                    )

                ) 
            {
                addNewElement($gridItemWidth, $gridItemHeight, $gridWidth, $gridHeight);

                
                $('#cutting-element-values').removeData();
            }
            
        }
        else {

            $group = $("#item-list .group").filter( function(n, elem) {
                return $(elem).find('.num').text() == input_data.num;
            });

            var $element_width = $group.find('input[name="grid-item-width"]');
            var $element_height = $group.find('input[name="grid-item-height"]');
            
            var $gridItemWidth = $element_width.val();
            var $gridItemHeight = $element_height.val();


            var width_is_only_digits =  $element_width.val().match(/^[0-9]+$/) != null;
            var height_is_only_digits = $element_height.val().match(/^[0-9]+$/) != null;
            if (input_data.changed_field == 'grid-item-width') {
                if ( parseInt($gridItemWidth) < parseInt(min_element_size) || !width_is_only_digits) {
                    $gridItemWidth = min_element_size;
                    $element_width.val( $gridItemWidth );

                } else {
                    if (       $gridItemHeight != ''
                            && parseInt($gridItemWidth) >= parseInt($gridWidth) 
                            && parseInt($gridItemHeight) == parseInt($gridWidth) 
                          ) 
                    {
                        $element_width.val( $gridHeight );
                        $gridItemWidth = $gridHeight;
                    }
                    else if (
                                   $gridItemHeight != ''
                                && parseInt($gridItemWidth) > parseInt($gridWidth)  
                                && parseInt($gridItemHeight) <= parseInt($gridHeight)
                            ) 
                    {
                        $element_width.val( $gridWidth );
                        $gridItemWidth = $gridWidth;
                    }
                    else if (       $gridItemHeight == ''
                            && parseInt($gridItemWidth) > parseInt($gridWidth) 
                          ) 
                    {
                        $element_width.val( $gridWidth );
                        $gridItemWidth = $gridWidth;
                    }

                };

                
                
                input_data.invalid_field = undefined;
                
            }
            
            if (input_data.changed_field == 'grid-item-height') {
                if (parseInt($gridItemHeight) < parseInt(min_element_size) || !height_is_only_digits) {
                    $gridItemHeight = min_element_size;
                    $element_height.val( $gridItemHeight );

                } else {
                    if (       $gridItemWidth != ''
                            && parseInt($gridItemHeight) >= parseInt($gridHeight)  
                            && parseInt($gridItemWidth) == parseInt($gridHeight)
                          ) 
                    {
                        $element_height.val( $gridWidth );
                        $gridItemHeight = $gridWidth;
                    }
                    else if (
                                   $gridItemWidth != ''
                                && parseInt($gridItemHeight) > parseInt($gridHeight)  
                                && parseInt($gridItemWidth) <= parseInt($gridWidth)
                            ) 
                    {
                        $element_height.val( $gridHeight );
                        $gridItemHeight = $gridHeight;
                    }
                    else if (       $gridItemWidth == ''
                            && parseInt($gridItemHeight) > parseInt($gridHeight) 
                          ) 
                    {
                        $element_height.val( $gridHeight );
                        $gridItemHeight = $gridHeight;
                    }

                };

               

                input_data.invalid_field = undefined;
                
            }

            if (    $element_width.val().match(/^[0-9]+$/) != null
                 && $element_height.val().match(/^[0-9]+$/) != null
                 && $gridItemWidth >= min_element_size
                 && $gridItemHeight >= min_element_size
                 && (  
                       (    $gridItemWidth <= $gridWidth 
                         && $gridItemHeight <= $gridHeight
                       )
                       ||
                       (    $gridItemWidth <= $gridHeight 
                         && $gridItemHeight <= $gridWidth
                       )
                    )

                ) {
                updateElement(input_data.render_param, input_data.num);

                $('#cutting-element-values').removeData();
            }
            
        }
        /*setTimeout(function(){
            $('[name="new-grid-item-width"]').focus();
        }, 1);*/
        $('#cutting-element-values').removeData();
        $('.cutting-modal-input-error-message').html('');
        $('#cutting-modal-input').dialog('close');

        // handle focus
        $('#cutting-element-values').data('action', 'correct');
        window.console.log( $('input[name="' + input_data.changed_field + '"').val() );
        switch (input_data.changed_field) {
            case 'new-grid-item-width':
            case 'new-grid-item-height':
                if ( set_focus_to_new_height )
                    setTimeout(function(){
                        $('input[name="new-grid-item-height"').focus();
                    }, 1); 
                break;
        }
        
    
        if ( input_data.add_many ) {
            if ( input_data.add_many_field == 'modal-add-many-width' ) {
                setTimeout(function(){
                    $('#modal-add-many-height').focus();
                }, 1);
            }

            if ( input_data.add_many_field == 'modal-add-many-height' ) {
                setTimeout(function(){
                    $('#modal-add-many-quantity').focus();
                }, 1);
            }

        }

    });

    $(document).on("click", "#cutting-modal-input .cutting-modal-delete-cancel", function(event) {
        event.preventDefault();

        var input_data = $('#cutting-element-values').data();
        if ( input_data.add_many ) {
            $('#' + input_data.add_many_field).val(input_data.add_many_old_value);
            setTimeout(function(){
                $('#' + input_data.add_many_field).focus();
            }, 1);  
        }
        else if ( input_data.new_item ) {
            if ( input_data.invalid_field == 'width') {
                $('[name="new-grid-item-width"]').val('');
                setTimeout(function(){
                    $('[name="new-grid-item-width"]').focus();
                }, 1);
            }
            if ( input_data.invalid_field == 'height') {
                $('[name="new-grid-item-height"]').val('');
                setTimeout(function(){
                    $('[name="new-grid-item-height"]').focus();
                }, 1);
            }
        }
        else {
            $group = $("#item-list .group").filter( function(n, elem) {
                return $(elem).find('.num').text() == input_data.num;
            });
            $group.find('input[name="grid-item-width"]').val( input_data.old_width );
            $group.find('input[name="grid-item-height"]').val( input_data.old_height );
            $('.grid-options .element input[name="grid-item-width"]').val( input_data.old_width ),
            $('.grid-options .element input[name="grid-item-height"]').val( input_data.old_height );
        }

        $('#cutting-element-values').removeData();
        $('.cutting-modal-input-error-message').html('');
        $('#cutting-modal-input').dialog('close');

        $('#cutting-element-values').data('action', 'cancel');
    });

    $( document ).on( "dominion:calculate-toggle", function( event, grid_index) {
        var list_name = $('.grid').eq(grid_index).data('name');
        var list_calculate = $('.grid').eq(grid_index).data('calculate');
        window.console.log('list_calculate');
        window.console.log(list_calculate);

        $( "#item-list .list-title" ).each(function() {
          if ($( this ).text() == 'Лист ' + (parseInt(grid_index) + 1)) {
            if ( list_calculate == 'auto') {
                $(this).removeClass('list-manual');
                $(this).attr('data-calculate', 'auto');
                $(this).data('calculate', 'auto');
                $(this).next().attr('data-calculate', 'auto');
                $(this).next().data('calculate', 'auto');
                $(this).next().find('input').prop('disabled', false);
            }
            else {
                $(this).addClass('list-manual');
                $(this).attr('data-calculate', 'manual');
                $(this).data('calculate', 'manual');
                $(this).next().attr('data-calculate', 'manual');
                $(this).next().data('calculate', 'manual');
                $(this).next().find('input').prop('disabled', true);
            }
            
          }

        if ( list_calculate != 'manual') {
            $('.grid').eq(grid_index).find('.grid-item').each(function(index, elem) {
                removeDraggy( $(elem) );
            });
        }
        else {
            $('.grid').eq(grid_index).find('.grid-item').each(function(index, elem) {
                addDraggy( $(elem) );
            });
        }

        });


    });

    $(document).on("click", ".grid-item", function(){
        var $index = parseInt($(this).find('span').text()),
            $group = $("#item-list .group").filter( function(n, elem) {
                return $(elem).find('.num').text() == $index;
            });
        resetSelected();
        $(".grid-options .element").removeClass("invisible");
        $(".grid-options .element .num").text($group.find(".num").text());
        $('.grid-options .element [name="grid-item-width"]').val($group.find('[name="grid-item-width"]').val());
        $('.grid-options .element [name="grid-item-height"]').val($group.find('[name="grid-item-height"]').val());
        
        $(this).addClass("checked");
        $group.addClass("active");

        //rotate button availability
        if ( !$('#cutting-manual').is(":checked") || !canRotate( $(this) ) ) {
            $(".grid-options .element .rotate").hide();
        }
        else {
            $(".grid-options .element .rotate").show();
        }
    });

    $(document).on("click", ".grid-options .element .rotate", function(event) {
        event.preventDefault();
        if ( $(".grid-item.checked").length == 1 )
            rotateItem( $(".grid-item.checked").first() );
    });
    
    $(document).on("click", ".icon-cutting-plus-icon", function(event) {
        event.preventDefault();

        $("#item-list .list-title").each( function(){
            $("#item-list .list-title").addClass("open");
        });

    });

    $(document).on("click", ".icon-cutting-minus-icon", function(event) {
        event.preventDefault();
        
        $("#item-list .list-title").each( function(){
            $("#item-list .list-title").removeClass("open");
        });

    });

    $(document).on("click", ".icon-cutting-add-many", function(event) {
        event.preventDefault();
        $("#cutting-modal-add-many button").prop('disabled', true);
        $("#cutting-modal-add-many").dialog('open');
    });

    $(document).on("focusin", "#cutting-modal-add-many #modal-add-many-width, #cutting-modal-add-many #modal-add-many-height, #cutting-modal-add-many #modal-add-many-quantity", function(event) {
        $('#cutting-element-values').data('new_item', false);
        $('#cutting-element-values').data('add_many', true);
        $('#cutting-element-values').data('add_many_field', $(this).attr('id'));
        $('#cutting-element-values').data('add_many_old_value', $(this).val());
    });

    $(document).on("keypress", '#cutting-modal-add-many #modal-add-many-quantity', function(e){
        if (e.which == 13 ) {
            $(this).blur();
            if ( checkAddMany() ) {
                $("#cutting-modal-add-many button").click();
            }
        }
    });

    $(document).on("focusout", "#cutting-modal-add-many #modal-add-many-quantity", function(event) {
        checkAddMany();
    });

    $(document).on("keypress", '#cutting-modal-add-many #modal-add-many-width, #cutting-modal-add-many #modal-add-many-height', function(e){
        if (e.which == 13) {
            if ( $(this).attr('id') == 'modal-add-many-width' && $(this).val() > 0)
                setTimeout(function(){
                    $('#modal-add-many-height').focus();
                }, 1);

            if ( $(this).attr('id') == 'modal-add-many-height' && $(this).val() > 0)
                setTimeout(function(){
                    $('#modal-add-many-quantity').focus();
                }, 1);
            //$(this).blur(); 
        }
    });

    $(document).on("blur", "#cutting-modal-add-many #modal-add-many-width, #cutting-modal-add-many #modal-add-many-height", function(event) {
        $('#cutting-element-values').data('add_many_value', $(this).val());
        var $gridWidth = parseInt($('[name="grid-width"]').val()),
            $gridHeight = parseInt($('[name="grid-height"]').val());

        var min_element_size = parseInt( $('#cutting-setting-min-element-size').val() );
        if ( $(this).attr('id') == 'modal-add-many-width' )
            var max_element_size = $gridWidth;

        if ( $(this).attr('id') == 'modal-add-many-height' )
            var max_element_size = $gridHeight;

        var val_is_only_digits = $(this).val().match(/^[0-9]+$/) != null;

        if (val_is_only_digits) {
            if ( $(this).val() < min_element_size )
                $('.cutting-modal-input-error-message').html('Введенный размер не может быть меньше ' + min_element_size + ' мм.');
            
            if ( $(this).val() > max_element_size )
                $('.cutting-modal-input-error-message').html('Создаваемый элемент <span>не умещается</span> на лист!');
        }
        else {
            $('.cutting-modal-input-error-message').html('Введенный размер не может быть меньше ' + min_element_size + ' мм.');
        }

        var $gridItemWidth = $('#modal-add-many-width').val();
        var $gridItemHeight = $('#modal-add-many-height').val();
        var width_is_only_digits = $gridItemWidth.match(/^[0-9]+$/) != null;
        var height_is_only_digits = $gridItemHeight.match(/^[0-9]+$/) != null;
        
        //extra check for possible rotate
        var show_error = true;
        
        if ( $(this).val() >= min_element_size ) {
            show_error = false;
        }
        else {
            show_error = true;
        }
        if ( $(this).val() >= min_element_size ) {
            if ( $gridItemWidth != '' && $gridItemHeight == '' && width_is_only_digits) {
                if (    $gridItemWidth <= $gridWidth 
                        ||
                        (   $gridItemWidth > $gridWidth 
                        && $gridItemWidth <= $gridHeight )
                    ) 
                {
                    show_error = false;
                }
                else {
                    show_error = true;
                }
            }

            if ( $gridItemHeight != '' && $gridItemWidth == '' && height_is_only_digits) {
                if ( 
                        $gridItemHeight <= $gridHeight 
                        ||
                        (   $gridItemHeight > $gridHeight 
                        && $gridItemHeight <= $gridWidth )
                    ) 
                {
                    show_error = false;
                }
                else {
                    show_error = true;
                }
            }

            if ( $gridItemWidth != '' && $gridItemHeight != '' && width_is_only_digits && height_is_only_digits) {
                var rotate = false;

                if ( 
                        (      $gridItemWidth > $gridWidth 
                            && $gridItemWidth <= $gridHeight
                            && $gridItemHeight <= $gridWidth)
                        ||
                        (      $gridItemHeight > $gridHeight 
                            && $gridItemHeight <= $gridWidth
                            && $gridItemWidth <= $gridHeight)

                    ) 
                {
                    rotate = true;
                    show_error = false;
                }
                else if ( $gridItemWidth <= $gridWidth && $gridItemHeight <= $gridHeight ){
                    show_error = false;
                }
                else {
                    show_error = true;
                }
                

                if ( rotate ) {
                    $('.cutting-modal-input-error-message').html('');
                    $('#modal-add-many-width').val($gridItemHeight);
                    $('#modal-add-many-height').val($gridItemWidth);
                }
            }
            else if ($gridItemWidth != '' && $gridItemHeight != '' && (width_is_only_digits || height_is_only_digits) ){
                show_error = true;
            }

        }

        if ( (show_error || !val_is_only_digits) && $(this).val() != '') {
            $('#cutting-modal-input').dialog('open');
        }
        else {
            checkAddMany();
        }
        
    });
    
    $(document).on("keyup", "#cutting-modal-add-many #modal-add-many-width, #cutting-modal-add-many #modal-add-many-height, #cutting-modal-add-many #modal-add-many-quantity", function(event) {
        checkAddMany();
    });


    $(document).on("click", "#cutting-modal-add-many button", function(event) {
        event.preventDefault();

        if ( !$('[name="grid-width"]').prop("disabled") )
            $('[name="grid-width"]').prop("disabled", true);
        if ( !$('[name="grid-height"]').prop("disabled") )
            $('[name="grid-height"]').prop("disabled", true);

        $(this).prop("disabled", true);

        var quantity = $('#modal-add-many-quantity').val();
        var elem_w = $('#modal-add-many-width').val();
        var elem_h = $('#modal-add-many-height').val();

        var added_listItem_count = false;
        if ( $('#item-list .groups .group').length > 0 ) {
             added_listItem_count = Math.max.apply(null, $('#item-list .groups .group').find('.num').map( function() { return $(this).text()})) + 1;
        }
        else {
            added_listItem_count = 1;
        }

        for (var i = 0; i < quantity; i++) {

            $listItem = '<div class="group"><span class="num">'+( added_listItem_count + i )+'</span>\
                        <label>A:</label> <input type="text" class="form-control" name="grid-item-width" value="'+elem_w+'"/>\
                        <label>B:</label> <input type="text" class="form-control" name="grid-item-height" value="'+elem_h+'"/>\
                        <a href="javascript:void(0)" class="remove icon-item-remove" title="Удалить элемент"></a></div>';
                            
             $('#item-list .groups').filter( ':last' ).append($listItem);
        }

        var $gridWidth = parseInt($('[name="grid-width"]').val());
        var $gridHeight = parseInt($('[name="grid-height"]').val());

        var render_param = {
                gridWidth: $gridWidth,
                gridHeight: $gridHeight,
                scale: $scale,
                zoom: 1,
                cut_line_width: $cut_line_width
            };

        MainRender(render_param); 

        $(this).prop("disabled", false);
        $("#cutting-modal-add-many").dialog('close');
    });
    
    $(document).on("focusin", '.list-params input', function(){
        var $parent = $(this).parents(".list-params .group"),
            $gridWidth = $parent.find('[name="grid-width"]').val(),
            $gridHeight = $parent.find('[name="grid-height"]').val();

            $('#cutting-list-values').removeData();
            $('#cutting-list-values').data('invalid_field', undefined);
            $('#cutting-list-values').data('old_width', $gridWidth);
            $('#cutting-list-values').data('old_height', $gridHeight);

    });

    $(document).on("keypress", '.list-params input', function(e){
        if (e.which == 13 ) {
            $(this).blur();
        }
    });

    $(document).on("blur", '.list-params input', function(e){
           checkAddNewPlate( $(this) );
    });

    $(document).on("keypress", '#new-grid-item input', function(e){
        if (e.which == 13 ) {;
            $(this).blur();
            if ( $(this).attr('name') == 'grid-width') {
                $('#cutting-list-values').data('new_width', $gridWidth);
            }
        }
    });

    $(document).on("blur", '#new-grid-item input', function(){
        checkAddNew( $(this) );
    });

    // handle focuses
    $(document).on("focus", '#new-grid-item input', function(){

        window.console.log( 'trigger focus' );
        window.console.log( $(this) );
    });

    $(document).on("focusout", '.list-params input', function(){
        window.console.log( 'focusout focus' );
        
    });

    $(document).on("change", ".list-params input", function(){
        var $gridWidth = $('[name="grid-width"]').val(),
            $gridHeight = $('[name="grid-height"]').val();

        if ( $(this).attr('name') == 'grid-width') {
            $('#cutting-list-values').data('new_width', $gridWidth);
        }
        if ( $(this).attr('name') == 'grid-height') {
            $('#cutting-list-values').data('new_height', $gridHeight);
        }

        var min_plate_width_size = parseInt( $('#cutting-setting-min-plate-width').val() );
        var max_plate_width_size = parseInt( $('#cutting-setting-max-plate-width').val() );

        var min_plate_height_size = parseInt( $('#cutting-setting-min-plate-height').val() );
        var max_plate_height_size = parseInt( $('#cutting-setting-max-plate-height').val() );

        var width_is_only_digits = $gridWidth.match(/^[0-9]+$/) != null;
        var height_is_only_digits = $gridHeight.match(/^[0-9]+$/) != null;

        var render_param = {
            gridWidth: $gridWidth,
            gridHeight: $gridHeight,
            scale: $scale,
            zoom: $zoom,
            cut_line_width: $cut_line_width
        };

        $('.cutting-modal-plate-input-error-message').empty();

        
        if (    !width_is_only_digits 
             || !height_is_only_digits
             || $gridWidth < min_plate_width_size
             || $gridHeight < min_plate_height_size
             || $gridWidth > max_plate_width_size
             || $gridHeight > max_plate_height_size

           )
        {
            // show modal on focus out;

        }
        else {
            addPlate($gridWidth, $gridHeight);
        }
        

    });

    /*$('input[name="grid-height"]').focusout(function() {
        $('input[name="new-grid-item-width"]').focus(); 
    });

    $('input[name="new-grid-item-height"]').focusout(function() {
        $('input[name="new-grid-item-width"]').focus(); 
    });*/

    $(document).on("click", "#item-list .list-title .list-title-arrow", function(event){
        event.stopPropagation();

        $(this).parent().toggleClass("open");

    });

    $(document).on("click", "#item-list .list-title", function(){
        //set zoom icon
        $('.icon-list.list').addClass('hidden');
        $('.icon-lists.lists').removeClass('hidden');

        var list_id = $("#item-list .list-title").index( this );
        var opened = $(this).hasClass("open");
        $(".grid-wrapper").removeClass("preview");

        if ( $('.grid').eq(list_id).data('calculate') == 'auto') {
            $('#cutting-manual').prop('checked', false);
        }
        else {
            $('#cutting-manual').prop('checked', true);
        }

        $zoom = 1;
        renderZoom();

        //$("#item-list .list-title").removeClass("active").removeClass("open");
        $("#item-list .list-title").eq(list_id).addClass("active");

        $("#item-list .list-title").filter(function (i, item) {
           return i != list_id;
        }).each(function() {
            $(this).removeClass("active");
        });


        /*if (!opened) {
            $("#item-list .list-title").eq(list_id).addClass("open");
        }
        else {
            $("#item-list .list-title").eq(list_id).removeClass("open");
        }*/

        $(".grid").css('visibility', 'hidden');
        $('.grid').eq(list_id).css('visibility', 'visible');


        $(".grid-options .name .num").text((list_id + 1)); 

        /*if(!self.hasClass("active")){
            resetSelected();
            $("#item-list .list-title").removeClass("active");
            self.addClass("active");
        }
        else{
            self.toggleClass("open");
        }*/

    });
    
    $(document).on("blur", '#item-list input', function(){
        var $parent = $(this).parents("#item-list .group"),
            $index = $parent.index("#item-list .group"),
            $gridItemWidth = parseInt($parent.find('[name="grid-item-width"]').val()),
            $gridItemHeight = parseInt($parent.find('[name="grid-item-height"]').val());

        var num = $parent.find('.num').text();

        $('#cutting-element-values').data('new_item', false);
        $('#cutting-element-values').data('old_width', $gridItemWidth);
        $('#cutting-element-values').data('old_height', $gridItemHeight);
        $('#cutting-element-values').data('num', num);

        $('.grid-item').removeClass('checked');
        $('.grid-item').filter( function(n, elem) {
            return $(elem).find('span').text() == num;
        }).first().addClass('checked');

        $('#item-list .group').removeClass('active');
        $('#item-list .group').filter( function(n, elem) {
            return $(elem).find('.num').text() == num;
        }).first().addClass('active');
    });

    $(document).on("keypress", '#item-list input', function(e){
        if (e.which == 13 ) {
            $(this).blur();
        }
    });

    $(document).on("blur", '#item-list input', function(){
        checkUpdate( $(this) );
    });
    
    $(document).on("keypress", '.grid-options .element input', function(e){
        var num = $('.grid-options .element .num').text();
        if (e.which == 13 ) {
            $(this).blur();
        }
    });


    $(document).on("blur", '.grid-options .element input', function(){
        var num = $('.grid-options .element .num').text();
        $('#item-list .group.active [name="'+$(this).attr("name")+'"]').val($(this).val())
        checkUpdate( $('#item-list .group.active [name="'+$(this).attr("name")+'"]') );
    });

    $(document).on("focusin", '.grid-options .element input', function(){
        var $gridItemWidth = $('.grid-options .element input[name="grid-item-width"]').val(),
            $gridItemHeight = $('.grid-options .element input[name="grid-item-height"]').val();

        var num = $('.grid-options .element .num').text();

        $('#cutting-element-values').data('new_item', false);
        $('#cutting-element-values').data('old_width', $gridItemWidth);
        $('#cutting-element-values').data('old_height', $gridItemHeight);
        $('#cutting-element-values').data('num', num);
    });

    $(document).on("change", '#item-list input', function(){
        var $parent = $(this).parents("#item-list .group"),
            $index = $parent.index("#item-list .group"),
            $gridItemWidth = $parent.find('[name="grid-item-width"]').val(),
            $gridItemHeight = $parent.find('[name="grid-item-height"]').val(),
            $gridWidth = parseInt($('[name="grid-width"]').val()),
            $gridHeight = parseInt($('[name="grid-height"]').val());
        var num = $parent.find('.num').text();

        $('#cutting-element-values').data('new_width', $gridItemWidth);
        $('#cutting-element-values').data('new_height', $gridItemHeight);

        var min_element_size = parseInt( $('#cutting-setting-min-element-size').val() );
        var width_is_only_digits = $gridItemWidth.match(/^[0-9]+$/) != null;
        var height_is_only_digits = $gridItemHeight.match(/^[0-9]+$/) != null;

        var render_param = {
            gridWidth: $gridWidth,
            gridHeight: $gridHeight,
            scale: $scale,
            zoom: $zoom,
            cut_line_width: $cut_line_width
        };

        if (    !width_is_only_digits 
             || !height_is_only_digits
             || $gridItemWidth < min_element_size
             || $gridItemHeight < min_element_size
             || $gridItemWidth > $gridWidth
             || $gridItemHeight > $gridHeight

           ) 
        {
            $('#cutting-element-values').data('render_param', render_param);
            //oped dialog
        }
        else 
        {
            //updateElement(render_param, num);
        }
        
    });

    $(document).on("click", "#item-list .remove", function() {

        var $parent = $(this).parents("#item-list .group"),
            $index = $parent.index(".group");
        var elem_num = $parent.find('.num').text();
        $('#cutting-element-to-delete-index').val( elem_num );
        if ( $('#cutting-element-delete-confirmation').val() != 0) {
            $('#cutting-modal-delete').dialog('open');
        }
        else {

            if($(this).parent().hasClass("active")){
                $(".grid-options .element").addClass("invisible");
            }
            $parent.remove();

            //repopulate object numers;
            var count = 1;
            $("#item-list .group").each(function() {
              $( this ).find( ".num" ).text(count);
              count++;
            });

            $("#item-list .groups").each(function() {
                if ( $(this).children().length == 0)
                    $(this).remove();
            });

            //redraw start
            var $gridWidth = parseInt($('[name="grid-width"]').val());
            var $gridHeight = parseInt($('[name="grid-height"]').val());

            var render_param = {
                    gridWidth: $gridWidth,
                    gridHeight: $gridHeight,
                    scale: $scale,
                    zoom: 1,
                    cut_line_width: $cut_line_width
                };

            MainRender(render_param); 

            //redraw end
        }
    });
    

    $(document).on("change", "#new-grid-item input", function(){

        $('#cutting-element-values').removeData();

        var $gridItemWidth = $('[name="new-grid-item-width"]').val(),
            $gridItemHeight = $('[name="new-grid-item-height"]').val(),
            $gridWidth = parseInt($('[name="grid-width"]').val()),
            $gridHeight = parseInt($('[name="grid-height"]').val());


        $('#cutting-element-values').data('new_item', true);
        $('#cutting-element-values').data('old_width', $gridItemWidth);
        $('#cutting-element-values').data('old_height', $gridItemHeight);

        var min_element_size = parseInt( $('#cutting-setting-min-element-size').val() );
        var width_is_only_digits = $gridItemWidth.match(/^[0-9]+$/) != null;
        var height_is_only_digits = $gridItemHeight.match(/^[0-9]+$/) != null;

        if (    !width_is_only_digits 
             || !height_is_only_digits
             || $gridItemWidth < min_element_size
             || $gridItemHeight < min_element_size
             || $gridItemWidth > $gridWidth
             || $gridItemHeight > $gridHeight

           ) 
        {
            //dialog open
        }
        else 
        {
            //addNewElement($gridItemWidth, $gridItemHeight, $gridWidth, $gridHeight);
        }
        


    });
    
    $(document).on("change", '.grid-options .element input', function(){
        var num = $('.grid-options .element .num').text();
        
        $('#item-list .group.active [name="'+$(this).attr("name")+'"]').val($(this).val()).change();

    });
    
    $(document).on("click", '.grid-options .rotate', function(e){
        var $gridItemWidth = parseInt($('#item-list .group.active [name="grid-item-width"]').val()),
            $gridItemHeight = parseInt($('#item-list .group.active [name="grid-item-height"]').val());
        e.preventDefault();
        
        $('#item-list .group.active [name="grid-item-width"]').val($gridItemHeight);
        $('#item-list .group.active [name="grid-item-height"]').val($gridItemWidth).change();
    });

    $(document).on("click", ".grid-options .zoom a", function(e){
        e.preventDefault();
        if($(this).hasClass("plus") && ($zoom*100 + $zoomStep*100) <= $zoomMax*100){
            $zoom = ($zoom*1 + $zoomStep).toFixed(1);
            renderZoom();
        }
        else if($(this).hasClass("minus") && ($zoom*100 - $zoomStep*100) >= $zoomMin*100){
            $zoom = ($zoom*1 - $zoomStep).toFixed(1);
            renderZoom();
        }
        else if($(this).hasClass("area") && ($zoom != 1)){
            $zoom = 1;
            renderZoom();
        }
    });
    
    $(document).on("click", ".grid-options .view a", function(e){
        e.preventDefault();
        $(".grid-options .view a").toggleClass("hidden");
        $(".grid-wrapper").toggleClass("preview");
        if($(this).hasClass("lists")){
            $zoom = $zoomMin;
            renderZoom();
            $(".grid").css('visibility', 'visible');
        }
        else if($(this).hasClass("list") && ($zoom != 1)){
            $zoom = 1;
            //$("#item-list .list-title.active").removeClass("active").click();
            $(".grid-wrapper .grid:not(:first)").css('visibility', 'hidden');
            renderZoom();
        }
    });
    
    function addDraggy(element){
        var $grid = element.parents(".grid");
        /*$grid.droppable({
            tolerance: 'fit'
        });*/

        element.draggable({
            actual_cut_line_width: $actual_cut_line_width,
            containment: $grid,
            scroll: false,
            snap: '.cut-line',
            snapMode: "outer",
            revert: 'invalid',
            /*snapTolerance: 0,*/
            start: function() {
                $grid.find('.grid-item').data('rotated', false);
                removeDragItemCutLines($grid, this);

            },
            drag: function(event, ui){
                /*var self_elem = this;
                var snapped = $(this).data('ui-draggable').snapElements;
                var snappedTo = $.map(snapped, function(element) {
                    return element.snapping ? element.item : null;
                });

                window.console.log( 'snappedTo' );
                window.console.log( snappedTo );
                snappedTo.forEach(function(snap_elem){
                    if (    
                            (      parseInt($(snap_elem).position().left) == parseInt($(self_elem).position().left) 
                                && parseInt($(snap_elem).width()) == parseInt($actual_cut_line_width) 
                            )
                          ||
                            (      parseInt($(snap_elem).position().left) + parseInt($(snap_elem).width()) == parseInt($(self_elem).position().left) 
                                && parseInt($(snap_elem).height()) == parseInt($actual_cut_line_width) 
                            )
                        ) 
                    {
                        window.console.log( 'FIX LEFT' );
                        ui.position = {'left': parseInt($(self_elem).position().left) + parseInt($actual_cut_line_width)};
                        return false;
                    }
                });*/

                var $params = getParams($grid, this),
                    $valid = checkCollision($params);
                $(this).draggable({revert: $valid});
                
                

            },
            stop: function(event, ui) {

                var $position = $(this).position();
                $(this).draggable({revert: 'invalid'});
                $(this).attr('data-top', Math.ceil($position.top / ($scale * $zoom)));
                $(this).attr('data-left', Math.ceil($position.left / ($scale * $zoom)));

                autoMoveAfterDrag($grid, this);
            }
        });

        /*element.droppable({
            greedy: true,
            tolerance: 'touch',
            drop: function(event,ui){
                ui.draggable.draggable('option','revert',true);
            }
        });

        $grid.find('.cut-line').droppable({
            greedy: true,
            tolerance: 'touch',
            drop: function(event,ui){
                ui.draggable.draggable('option','revert',true);
            }
        });*/
    }

    function removeDraggy(element){
        if ( element.is('.ui-draggable') )
            element.draggable("destroy");
    }

    function addGrid($gridWidth, $gridHeight, manual){
        var $grid = $('<div class="grid" data-scale="' + $scale + '" data-zoom="' + $zoom + '">\
                        <div class="grid-span grid-span-top"></div>\
                        <div class="grid-span grid-span-right"></div>\
                        <div class="grid-span grid-span-bottom"></div>\
                        <div class="grid-span grid-span-left"></div>\
                      </div>');
        
        if(!$gridWidth || !$gridHeight){
            $gridWidth = $('[name="grid-width"]').val();
            $gridHeight = $('[name="grid-height"]').val();
        }
        
        $('.grid-wrapper').append($grid);
        $grid.attr('data-name', "Лист " + ($grid.index(".grid") + 1));

        if ( manual === true) {
            $('#cutting-manual').prop('checked', true);
            $grid.attr('data-calculate', "manual");
        }
        else {
            $('#cutting-manual').prop('checked', false);
            $grid.attr('data-calculate', "auto");
        }


        $('#item-list .list-title').removeClass("active");
        $("#item-list").append('<div class="list-title open active"><span class="list-title-arrow"></span>Лист ' + ($grid.index() + 1) + '</div><div class="groups"></div>');
        $(".grid").css('visibility', 'hidden');
        $grid.css({"width": Math.ceil($gridWidth * $scale * $zoom), "height": Math.ceil($gridHeight * $scale * $zoom)}).css('visibility', 'visible');
        $(".grid-options .name .num").text(($grid.index() + 1));
        resetSelected();

        return $grid;
    }
    
    /*function addGridItem($gridItemWidth, $gridItemHeight, $position){
        var $listItem,
            $params = {},
            $index = 0,
            $item;
        
        if($(".grid-item").length)
            $index = $(".grid-item").length;

        $item = $('<div class="grid-item"><span>'+($index + 1)+'</span></div>');
        
        if(!$gridItemWidth || !$gridItemHeight){
            $gridItemWidth = $('[name="new-grid-item-width"]').val(),
            $gridItemHeight = $('[name="new-grid-item-height"]').val();
        }
        
        $('.grid:last-child').append($item);
        
        if($position){
            $item.css({
                'position': 'absolute',
                'top': $position.top * $scale * $zoom,
                'left': $position.left * $scale * $zoom,
                'width': $gridItemWidth * $scale * $zoom,
                'height': $gridItemHeight * $scale * $zoom,
                'z-index': 1
            });
            
            $item.attr('data-top', $position.top);
            $item.attr('data-left', $position.left);
            
            $listItem = '<div class="group"><span class="num">'+($index + 1)+'</span>\
                <label>Ш:</label> <input type="text" class="form-control" name="grid-item-width" value="'+$gridItemWidth+'"/>\
                <label>В:</label> <input type="text" class="form-control" name="grid-item-height" value="'+$gridItemHeight+'"/>\
                <a href="javascript:void(0)" class="remove icon-item-remove"></a></div>';
                
            $('#item-list .groups').filter( ':last' ).append($listItem);
            addDraggy($item);
            return true;
        }

        $item.css({
            'position': 'absolute',
            'top': 0,
            'left': 0,
            'width': $gridItemWidth * $scale * $zoom,
            'height': $gridItemHeight * $scale * $zoom,
            'z-index': 1
        });
    
        $params = {
            itemPosition: $item.position(),
            itemWidth: $item.outerWidth(),
            itemHeight: $item.outerHeight(),
            gridWidth: $(".grid:last-child").outerWidth(),
            gridHeight: $(".grid:last-child").outerHeight(),
            siblings: []
        };
        $item.siblings(".grid-item").each(function(e, elm){
            $params.siblings.push({
                sibPosition: $(elm).position(),
                sibWidth: $(elm).outerWidth(),
                sibHeight: $(elm).outerHeight()
            })
        });

    //loop: 
        for(var $y = 0; $y <= $params.gridHeight - $params.itemHeight; $y++){
            for(var $x = 0; $x <= $params.gridWidth - $params.itemWidth; $x++){
                $params.itemPosition = {
                    top: $y,
                    left: $x
                }
                if(checkCollision($params) == "valid"){
                    $item.animate({
                        'top': $y,
                        'left': $x
                    }, 500, function(){
                        $item.attr('data-top', Math.ceil($y / ($scale * $zoom)));
                        $item.attr('data-left', Math.ceil($x / ($scale * $zoom)));
                        
                        $('[name="new-grid-item-width"]').val("");
                        $('[name="new-grid-item-height"]').val("");
                        $listItem = '<div class="group"><span class="num">'+($index + 1)+'</span>\
                            <label>Ш:</label> <input type="text" class="form-control" name="grid-item-width" value="'+$gridItemWidth+'"/>\
                            <label>В:</label> <input type="text" class="form-control" name="grid-item-height" value="'+$gridItemHeight+'"/>\
                            <a href="javascript:void(0)" class="remove icon-item-remove"></a></div>';
                            
                        $('#item-list .groups').filter( ':last' ).append($listItem);
                    });
                    addDraggy($item);
                    return true;
                    //break loop;
                }
            }
        }
        $item.remove();
        return false;
    }*/

    function checkCollision(params){
        var valid = 'valid',
            connect = false,
            YGridconnect = false,
            XGridconnect = false,
            Yconnect = false,
            Xconnect = false,
            XColl = false,
            YColl = false,
            element_collicion = false;
        
       if(params.itemPosition.top < 0 || params.itemPosition.left < 0 || params.itemPosition.top + params.itemHeight > params.gridHeight || params.itemPosition.left + params.itemWidth > params.gridWidth){
            valid = 'invalid';
            return valid;
        }
        if(params.itemPosition.left == 0 || params.itemPosition.left + params.itemWidth == params.gridWidth){
            XGridconnect = true;
        }
        if(params.itemPosition.top == 0 || params.itemPosition.top + params.itemHeight == params.gridHeight){
            YGridconnect = true;
        }

        for(var $i = 0; $i < params.siblings.length; $i++){

            if (
               params.itemPosition.left < params.siblings[$i].sibPosition.left + params.siblings[$i].sibWidth &&
               params.itemPosition.left + params.itemWidth > params.siblings[$i].sibPosition.left &&
               params.itemPosition.top < params.siblings[$i].sibPosition.top + params.siblings[$i].sibHeight &&
               params.itemHeight + params.itemPosition.top > params.siblings[$i].sibPosition.top
            ) 
            {   


                valid = 'invalid';
                /*window.console.log('x1 ' + params.itemPosition.left + ' ' + (params.siblings[$i].sibPosition.left + params.siblings[$i].sibWidth));
                window.console.log('x2 ' + (params.itemPosition.left + params.itemWidth) + ' ' + params.siblings[$i].sibPosition.left);
                window.console.log('y1 ' + params.itemPosition.top + ' ' + ( params.siblings[$i].sibPosition.top + params.siblings[$i].sibHeight ));
                 window.console.log('y2 ' + (params.itemHeight + params.itemPosition.top) + ' ' + params.siblings[$i].sibPosition.top);
                window.console.log('detect!');
                window.console.log(params.siblings[$i]);
                 window.console.log( params );*/

                /*if((params.itemPosition.left + params.itemWidth == params.siblings[$i].sibPosition.left) || (params.itemPosition.left == params.siblings[$i].sibPosition.left + params.siblings[$i].sibWidth))
                Xconnect = true;
                if((params.itemPosition.top + params.itemHeight == params.siblings[$i].sibPosition.top) || (params.itemPosition.top == params.siblings[$i].sibPosition.top + params.siblings[$i].sibHeight))
                Yconnect = true;
                if ( Xconnect || Yconnect)
                    valid = 'valid';
                return valid;*/
                
                
            }

            /*if((params.itemPosition.left + params.itemWidth == params.siblings[$i].sibPosition.left) || (params.itemPosition.left == params.siblings[$i].sibPosition.left + params.siblings[$i].sibWidth))
                Xconnect = true;
            if((params.itemPosition.top + params.itemHeight == params.siblings[$i].sibPosition.top) || (params.itemPosition.top == params.siblings[$i].sibPosition.top + params.siblings[$i].sibHeight))
                Yconnect = true;*/
        }

        /*if( (((!Xconnect && !XGridconnect) || (!Yconnect && !YGridconnect)) || (!Xconnect && !Yconnect) && params.siblings.length))
            valid = 'invalid';*/
        window.console.log('collision: ' + valid);
        return valid;
    }

    function getParams(grid, item){
        var self_index = $(item).index();
        var params = {
                itemPosition: $(item).position(),
                itemWidth: $(item)[0].getBoundingClientRect().width,
                itemHeight: $(item)[0].getBoundingClientRect().height,
                gridWidth: $(grid)[0].getBoundingClientRect().width,
                gridHeight: $(grid)[0].getBoundingClientRect().height,
                siblings: []
            },
            valid = 'valid';
        $(item).siblings(".grid-item").each(function(n, sibling){
            params.siblings.push({
                sibPosition: $(sibling).position(),
                sibWidth: $(sibling)[0].getBoundingClientRect().width,
                sibHeight: $(sibling)[0].getBoundingClientRect().height,
            });
        });

        grid.find(".cut-line").each(function(n, line){
            params.siblings.push({
                sibPosition: $(line).position(),
                sibWidth: $(line)[0].getBoundingClientRect().width,
                sibHeight: $(line)[0].getBoundingClientRect().height,
            });
        });

        return params;
    }

    function MainRender(param) {
        //fix for delete last object 
        if ( $('#item-list .group').length == 0 ) {

            $('.grid').remove();
            $('#item-list .list-title').remove();

            addGrid(param.gridWidth, param.gridHeight);

            $('#total-grid-count').text( $('.grid-wrapper .grid').length );
            $('#total-cut-lenght').text(0);
            $('#cutting-meter-remains').text(0);
            $('#cutting-meter-cost').text($meter_cost);
            $('#cutting-cost').text( '0 ₽');

            return true;
        }
        else {

            var elements = [];
            var total_cut_lenght = 0;
            var total_area_populate = 0;
            var manual_elements_nums = [];
            $('#item-list .group').each(function( index ) {
                var i = parseInt($( this ).find('.num').text());
                if ( $(this).parent().data('calculate') != 'manual') {
                    
                    var w = parseInt($( this ).find('[name="grid-item-width"]').val());
                    var h = parseInt($( this ).find('[name="grid-item-height"]').val());
                    elements.push({w:w, h:h, num: i});
                }
                if ( $(this).parent().data('calculate') == 'manual') {
                    manual_elements_nums.push(i);
                }
            });

            //selected element;
            var active_group = $('#item-list .group.active');
            var selected_num = false;
            if ( active_group.length == 1) {
                selected_num = active_group.find('.num').text();
            }
            /*$('.grid').remove();
             $('#item-list .list-title').remove();
             $('#item-list .groups').remove();*/

            var list_object_count = 1;
            var total_auto_grid = $('.grid-wrapper .grid').filter(function( index, grid ) {
                             return $(grid).data('calculate') != 'manual';
                          });

            var total_groups = $('#item-list .groups').filter(function( index, grid ) {
                             return $(grid).data('calculate') != 'manual';
                          });
            

            window.console.log('elements !!!!');
            window.console.log(elements);

             window.console.log('manual_elements_nums !!!!');
            window.console.log(manual_elements_nums);

            var populate_iteration_count = 1;
            var last_plate_max_element_number = 0;
            while (elements.length != 0){
                window.console.log('param');
                window.console.log(param);
                var state = DOMINION.init(param.gridWidth, param.gridHeight, elements, param.cut_line_width, manual_elements_nums, populate_iteration_count, last_plate_max_element_number);
                last_plate_max_element_number = state.last_plate_max_element_number;
                populate_iteration_count++;
                var draw_param = {
                    scale: param.scale,
                    zoom: param.zoom,
                    cut_line_width: param.cut_line_width,
                    grid_width: param.gridWidth,
                    grid_height:  param.gridHeight,
                    selected_num: selected_num
                };

                if ( total_auto_grid.length == 0 && total_groups.length == 0 ) {
                    addGrid(param.gridWidth, param.gridHeight);
                    draw_grid = $('.grid').last();
                    groups = $('#item-list .groups').filter( ':last' );
                }

                if ( total_auto_grid.length > 0 ) {
                    draw_grid = $(total_auto_grid.shift());
                    draw_grid.find('.grid-item').remove();
                    draw_grid.find('.cut-line').remove();
                }

                if ( total_groups.length > 0 ) {
                    groups = $(total_groups.shift());
                    groups.empty();
                }
                
                var draw_data = DOMINION.draw2( draw_grid, draw_param, state);
                $actual_cut_line_width = draw_data.actual_cut_line_width;
    

                var list_elements = [];
                for (i in draw_data.state.list_sets) {
                    for (j in draw_data.state.list_sets[i]) {
                        list_elements.push( draw_data.state.list_sets[i][j] );
                    };
                };

                list_elements.sort( function(a, b) {
                    return parseInt(a.num) - parseInt(b.num);
                });
                for (i in list_elements){
                    $listItem = '<div class="group ' + ( (selected_num == list_elements[i].num) ? 'active':'' ) +'"><span class="num">'+(  list_elements[i].num )+'</span>\
                                <label>A:</label> <input type="text" class="form-control" name="grid-item-width" value="'+list_elements[i].w+'"/>\
                                <label>B:</label> <input type="text" class="form-control" name="grid-item-height" value="'+list_elements[i].h+'"/>\
                                <a href="javascript:void(0)" class="remove icon-item-remove" title="Удалить элемент"></a></div>';
                    groups.append($listItem);
                    list_object_count++;
                    
                }

                

                window.console.log(draw_data.new_grid_sizes.h);
                if (draw_data.new_grid_sizes.w != null)
                    draw_grid.css('width', draw_data.new_grid_sizes.w + 'px');
                if (draw_data.new_grid_sizes.h != null)
                    draw_grid.css('height', draw_data.new_grid_sizes.h + 'px');

                total_cut_lenght += draw_data.total_cut_line_length;
                total_area_populate += draw_data.area_populate;
                elements = state.objects;

                

            }

            //remove not pupulate auto grid and group;
            if ( total_auto_grid.length > 0 ) {
                while( total_auto_grid.length > 0) {
                    draw_grid = $(total_auto_grid.shift());
                    draw_grid.remove();
                    draw_grid.remove();
                }
            }

            if ( total_groups.length > 0 ) {
                while( total_groups.length > 0) {
                    groups = $(total_groups.shift());
                    groups.empty();
                }
            }

            $('#item-list .groups').filter(function( index, groups ) {
                    return $(groups).children().length == 0;
             }).remove();

            if ($('#item-list .list-title').length > 0 ) {
                $('#item-list .list-title').each(function() {
                    if ($(this).next('.groups').length == 0)
                        $(this).remove();
                });
            }

            // set new active if prev active was deleted;

            var flag_display_grid = $('.grid-wrapper .grid').filter( function() {
                return $(this).css('display') == 'block';
            }).length;

            if ( flag_display_grid == 0 ) {
                $('.grid-wrapper .grid').first().show();
                $('#item-list .list-title').first().addClass('active');
            };

            $('#cutting-meter-cost').text($meter_cost);

            if ( param.zoom > 0.4 )
                recalculateCutLinesMetrics();
        }
        return true;
    }

    function ManualListRender(param) {
        $('.grid-wrapper .grid').filter( function() {
            return $(this).data('calculate') == 'manual';
        }).each(function(n, elem) {
            var init_scale = $(elem).data('scale');
            var current_scale = param.scale;

            var init_zoom = $(elem).data('zoom');
            var current_zoom = param.zoom;

            //save init param
            if ( param.zoom != 1 ) {
                $(elem).find('.grid-item, .cut-line').each(function(n, item) {
                    if ( !$(item).data('init-setted') || $(item).data('init-setted') !== true ) {
                        $(item).data('init-top', parseInt($(item).position().top));
                        $(item).data('init-left', parseInt($(item).position().left));

                        $(item).data('init-width', parseInt($(item)[0].offsetWidth));
                        $(item).data('init-height', parseInt($(item)[0].offsetHeight));
                        $(item).data('init-setted', true);
                    }
                });
            }

            $(elem).find('.grid-item, .cut-line').each(function(n, item) {
                var new_top = 0;
                var new_left = 0;
                var new_width = 0;
                var new_height = 0;

                if ( param.zoom != 1 ) {
                    new_top = Math.ceil(parseInt($(item).data('init-top')) * $zoom);
                    new_left = Math.ceil(parseInt($(item).data('init-left')) * $zoom);
                    new_width = Math.ceil(parseInt($(item).data('init-width')) * $zoom);
                    new_height = Math.ceil(parseInt($(item).data('init-height')) * $zoom);

                    new_top = new_top > 0 ? new_top : 1;
                    new_left = new_left > 0 ? new_left : 1;
                    new_width = new_width > 0 ? new_width : 1;
                    new_height = new_height > 0 ? new_height : 1;
                }
                else {
                    new_top = parseInt($(item).data('init-top'));
                    new_left = parseInt($(item).data('init-left'));
                    new_width = parseInt($(item).data('init-width'));
                    new_height = parseInt($(item).data('init-height'));
                }

                $(item).css({
                    "top": new_top,
                    "left": new_left,
                    "width": new_width,
                    "height": new_height
                });

            });
            

            window.console.log(init_scale + ' ' + current_scale);
            window.console.log(init_zoom + ' ' + current_zoom);
        });
        
    }

    /*function doRender(params){
        // sort functions
        var sorting = {
            'none'  : function (a,b) { return  0 },
            'width' : function (a,b) { return a.w - b.w },
            'height': function (a,b) { return a.h - b.h },
            'area'  : function (a,b) { return a.w*a.h - b.w*b.h },
            'magic' : function (a,b) { return Math.max(a.w,a.h) - Math.max(b.w,b.h) }
        }

        var blocks = [];
        $('#item-list .group').each(function(n, elm){
            blocks[n] = { 
                w: parseInt($(elm).find('[name="grid-item-width"]').val()),
                h: parseInt($(elm).find('[name="grid-item-height"]').val()),
                n: n
            };
        });
        blocks.sort( sorting[ params.sort ] );
        blocks.reverse();
        $("#item-list").html("");
        $(".grid-wrapper").html("");
        
        packItems(params, blocks);
        renderIndex();
    }
    
    function packItems(params, blocks){
        var packer = new NETXUS.RectanglePacker( params.canvasWidth, params.canvasHeight ),
            errorBlocks = [],
            n = 0;
        addGrid(params.canvasWidth, params.canvasHeight);
        
        for (var i=0; i<blocks.length; i++) {
            // obtain the coordinates for the current block
            coords = packer.findCoords( blocks[i].w, blocks[i].h );
            if (coords) {
                addGridItem(blocks[i].w, blocks[i].h, {'left': coords.x, 'top': coords.y});
                //$('.grid .grid-item:eq('+blocks[i].n+')').animate({'left': coords.x, 'top': coords.y, 'position': 'absolute'});
            } else {
                errorBlocks[n++] = blocks[i];
                //$('.grid .grid-item:eq('+blocks[i].n+')').css({'display': 'none'});
            }
        }
        if(errorBlocks.length){
            packItems(params, errorBlocks);
        }
    }

    function renderIndex(){
        $(".grid-item").each(function(n, elm){
            $(elm).find("span").text(n+1);
        });
        $("#item-list .group").each(function(n, elm){
            $(elm).find(".num").text(n+1);
        });
    }
    */

    function resetSelected(){
        $(".grid-item").removeClass("checked");
        $("#item-list .group").removeClass("active");
        $(".grid-options .element").addClass("invisible");
    }
    
    function renderZoom(){
        var $gridWidth = $('[name="grid-width"]').val(),
            $gridHeight = $('[name="grid-height"]').val();
        $(".grid-options .scale").text(Math.round($zoom * 100) + "%");
        $(".grid").each(function(n, elm){
            $(elm).css({
                "width": Math.ceil($gridWidth * $scale * $zoom),
                "height": Math.ceil($gridHeight * $scale * $zoom)
            });
        });
        var render_param = {
            gridWidth: $gridWidth,
            gridHeight: $gridHeight,
            scale: $scale,
            zoom: $zoom,
            cut_line_width: $cut_line_width
        };

        MainRender(render_param);

        ManualListRender(render_param);
    }

    function redrawManualGrigAfterDrag(grid_index) {
        var a = performance.now();
        var gridHeight = $('.grid').eq(grid_index).height();
        var gridWidth = $('.grid').eq(grid_index).width();
        
        var vertical_main_lines = [];
        var horizontal_main_line_offset = [];
        var grid_cut_line_width = $actual_cut_line_width;

        var $grid = $('.grid').eq(grid_index);

        var cut_lines = [];
        $grid.find('.cut-line').each( function(n, line) {
            var line_height = $(line)[0].getBoundingClientRect().height;
            var line_width = $(line)[0].getBoundingClientRect().width;
            var line_top = $(line).position().top;
            var line_left = $(line).position().left;
            var line_index = $(line).index();
            var line = {
                left: line_left,
                top: line_top,
                width: line_width,
                height: line_height,
                index: line_index,
                jquery: $(line)
            };

            cut_lines.push(line);
        });

        var grid_items = [];
        $grid.find('.grid-item').each( function(n, elem) {
            var elem_height = $(elem)[0].getBoundingClientRect().height;
            var elem_width = $(elem)[0].getBoundingClientRect().width;
            var elem_top = $(elem).position().top;
            var elem_left = $(elem).position().left;
            var elem_index = $(elem).index();
            var elem = {
                left: elem_left,
                top: elem_top,
                width: elem_width,
                height: elem_height,
                index: elem_index
            };

            grid_items.push(elem);
        });

        if ( grid_items.length == 0) {
            $grid.find('.cut-line').remove();
            return true;
        }

         // if element below last main cut line exist - find elem with max left + width
        // draw new horisontal if there is only one set on plate

        var vertical_main_line_count = cut_lines.filter(function(line){
            line_width = line.width;
            line_height = line.height;
            return grid_cut_line_width == line_width && line_height == gridHeight;
        }).length;

        //check if main horizontal line next to any element exist, if not - draw
        // check on element in first row - they have max width;
        grid_items.filter(function(elem) {
            var item_top = elem.top;
            return item_top == 0;
        }).forEach(function( elem ) {
                var item_left = elem.left;
                var item_top = elem.top;
                var item_width = elem.width;
                var item_height = elem.height;

                // line on right
                var check_main_horizontal = cut_lines.filter(function(line){
                    line_left = line.left;
                    line_width = line.width;
                    line_height = line.height;
                    return (item_left+item_width) == line_left && line_height == gridHeight;
                }).length;

                if ( check_main_horizontal == 0 && vertical_main_line_count > 1) {

                    // check if line dosent exist
                    var check_exist = cut_lines.filter( function(line) {
                        return      line.height == gridHeight
                                 && line.width == grid_cut_line_width
                                 && line.left == (item_left+item_width)
                                 && line.top == 0
                    }).length;

                    if ( check_exist == 0) {
                        var $item = $('<div class="cut-line"></div>');
                        $('.grid').eq(grid_index).append($item);

                        $item.css({
                            'position': 'absolute',
                            'top': 0,
                            'left': item_left+item_width,
                            'width': grid_cut_line_width,
                            'height': gridHeight,
                            'z-index': 1
                        });
                        var cut_line_obj = {
                            left: item_left+item_width,
                            top: 0,
                            width: grid_cut_line_width,
                            height: gridHeight,
                            index: $item.index(),
                            jquery: $item
                        }
                        cut_lines.push(cut_line_obj);
                    }
                }
                //cut lines for first elem in last set
                /*else if ( check_main_horizontal == 0) {
                    var $item = $('<div class="cut-line"></div>');
                    $('.grid').eq(grid_index).append($item);

                    $item.css({
                        'position': 'absolute',
                        'top': item_top + item_height,
                        'left': item_left,
                        'width': gridWidth - item_left,
                        'height': grid_cut_line_width,
                        'z-index': 1
                    });

                    $item = $('<div class="cut-line"></div>');
                    $('.grid').eq(grid_index).append($item);

                    $item.css({
                        'position': 'absolute',
                        'top': item_top,
                        'left': item_left + item_width,
                        'width': grid_cut_line_width,
                        'height': item_height,
                        'z-index': 1
                    });
                }*/



        });


        cut_lines.forEach(function(line){
            line_left = line.left;
            line_width = line.width;
            line_height = line.height;
            line_width_rounded = line_width;

            if ( grid_cut_line_width == line_width_rounded && line_height == gridHeight) {
                vertical_main_lines.push( line );
                var left_summ = line_left + grid_cut_line_width;
                horizontal_main_line_offset.push( left_summ );
            }
        });

        //UPDATE
        // draw new horisotal if it needed
        var last_horizontal_main_line_offset = Math.max.apply(null, horizontal_main_line_offset);
        

        // find element that has max left + width
        var elements_over_last_main_line = grid_items.filter( function(elem) {
            var item_left = elem.left;
            var item_width = elem.width ;
            var item_left_summ = item_left + item_width;
            return ( item_left_summ > last_horizontal_main_line_offset );
        });

       

        

        if (elements_over_last_main_line.length > 0 && vertical_main_line_count > 1) {
            var items_offsets_below_line = [];
            elements_over_last_main_line.forEach( function(elem) {
                var item_left = elem.left;
                var item_width = elem.width;
                var item_summ = item_left + item_width;
                items_offsets_below_line.push(item_summ);
            });

            if ( Math.max.apply(null, items_offsets_below_line) <= gridHeight) {

                // check if line dosent exist
                var check_exist = cut_lines.filter( function(line) {
                    return      line.height == gridHeight
                             && line.width == grid_cut_line_width
                             && line.left == Math.max.apply(null, items_offsets_below_line)
                             && line.top == 0
                }).length;

                if ( check_exist == 0 ) {  
                    var $item = $('<div class="cut-line"></div>');
                    $('.grid').eq(grid_index).append($item);

                    $item.css({
                        'position': 'absolute',
                        'top': 0,
                        'left': Math.max.apply(null, items_offsets_below_line),
                        'width': grid_cut_line_width,
                        'height': gridHeight,
                        'z-index': 1
                    });

                    var cut_line_obj = {
                        left: Math.max.apply(null, items_offsets_below_line),
                        top: 0,
                        width: grid_cut_line_width,
                        height: gridHeight,
                        index: $item.index(),
                        jquery: $item
                    }
                    cut_lines.push(cut_line_obj);

                    vertical_main_lines.push( cut_line_obj );
                }
            }
        }

        //delete all non main vertical
        /*$('.grid').eq(grid_index).find('.cut-line').filter(function( n, line ) {
                             return vertical_main_lines.indexOf( $(line).index() ) == -1;
        }).remove();*/
        
        /*for (i in vertical_main_lines) {
            vertical_main_lines[i].jquery.remove();
            var index_to_delete = cut_lines.findIndex( function(line) {
                return line.index == vertical_main_lines[i].index;
            });
            if ( index_to_delete )
                cut_lines.splice(index_to_delete, 1);
        }*/

        //draw sets horizontal lines;

        var manual_sets = [];
        var sets_width = [];
        var vertical_main_lines_left_offsets = [];
        cut_lines.filter(function(line) {
                return line.width == grid_cut_line_width && line.height == gridHeight;
                                                 }).forEach(function(line){
            vertical_main_lines_left_offsets.push( line.left );
        });

        vertical_main_lines_left_offsets.sort(function(a, b) {
            return a - b;
        });

        // add grid right border as it cut line
        vertical_main_lines_left_offsets.push(gridWidth);

        var cut_line_width = $actual_cut_line_width;
        
        // set elem to top corner
        /*for (i in vertical_main_lines_left_offsets) {
            var line_offset = vertical_main_lines_left_offsets[i];
            var set_elements = [];

            grid_items.each(function( elem ) {
                var item_left = elem.left;
                var item_top = elem.top;
                var item_width = elem.width;
                var item_height = elem.height;
                var item_summ = item_left + item_width;
                var left_offset = 0;
                if ( i == 0 ) {
                    left_offset = 0;
                }
                else {
                    left_offset = vertical_main_lines_left_offsets[i-1] + cut_line_width;
                }

                if ( left_offset <= item_left && item_summ <= line_offset) {
                    set_elements.push( elem.index );
                }
                
            });

            set_elements.sort(function(a, b) {
                return  $('.grid').eq(grid_index).children().eq(a).position().top  - $('.grid').eq(grid_index).children().eq(b).position().top ;
            });
            
            var top_offset = 0;
            for (j in set_elements) {
                if ( $('.grid').eq(grid_index).children().eq(set_elements[j]).position().top == 0) {
                    top_offset += parseFloat($('.grid').eq(grid_index).children().eq(set_elements[j])[0].getBoundingClientRect().height) + cut_line_width;
                }
                else {
                    $('.grid').eq(grid_index).children().eq(set_elements[j]).css('top', top_offset + 'px');
                    $('.grid').eq(grid_index).children().eq(set_elements[j]).css('left', left_offset + 'px');
                    top_offset += parseFloat($('.grid').eq(grid_index).children().eq(set_elements[j])[0].getBoundingClientRect().height) + cut_line_width;
                }
            }
        }*/

        // set horizontal lines
        

        for (i in vertical_main_lines_left_offsets) {
            var line_offset = vertical_main_lines_left_offsets[i];

            var left_offset = 0;
            if ( i > 0 ) {
                left_offset = vertical_main_lines_left_offsets[i-1] + cut_line_width;
            }

            // remove exist lines that dosen have connections
            var cut_lines_to_delete = cut_lines.filter(function(line) {
                var line_left = line.left;
                var line_top = line.top;
                var line_width = line.width;
                var line_height = line.height;

                var connection_count = grid_items.filter(function(elem) {
                    var item_left = elem.left;
                    var item_top = elem.top;
                    var item_width = elem.width;
                    var item_height = elem.height;

                    return   (line_top == (item_top + item_height) || (line_top + cut_line_width) == item_top)
                           && line_height == cut_line_width
                           && line_left == item_left

                }).length;

                return connection_count == 0 && line_height == cut_line_width;
            });

            if ( cut_lines_to_delete.length > 0 ) {
                cut_lines_to_delete.forEach( function(line_to_delete) {
                    line_to_delete.jquery.remove();
                    var index_to_delete = cut_lines.findIndex( function(line) {
                        return line_to_delete.index == line.index;
                    });
                    if ( index_to_delete )
                        cut_lines.splice(index_to_delete, 1);

                });
            }
            

            grid_items.forEach(function( elem ) {
                var item_left = elem.left;
                var item_top = elem.top;
                var item_width = elem.width;
                var item_height = elem.height;
                var item_summ = item_left + item_width;

                

                if ( left_offset <= item_left && item_summ <= line_offset) {

                    // draw horizontal;
                   
                    var item_height_check = item_top + item_height + cut_line_width;
                    var sub_left_offset = left_offset;
                    
                   

                    if ( item_height_check <= gridHeight) {
                        // if it sub elem, find new left offest
                        if ( left_offset < item_left) {
                            var left_element = grid_items.filter(function( l_elem ) {
                                var l_item_left = l_elem.left;
                                var l_item_top = l_elem.top;
                                var l_item_width = l_elem.width;
                                var l_item_height = l_elem.height;

                                return l_item_top == item_top && (l_item_left + l_item_width + cut_line_width) == item_left;
                            });
                            
                            if ( left_element.length == 1) {
                                var l_item_left = left_element[0].left;
                                var l_item_width = left_element[0].width;


                                

                                sub_left_offset = l_item_left + l_item_width + cut_line_width;
                            }
                        }
                        
                        // check if line dosent exist
                        var check_exist = cut_lines.filter( function(line) {
                            return      line.height == cut_line_width
                                     && ( line.width + line.left == line_offset)
                                     && line.top == (item_top + item_height)
                        }).length;

                        if ( check_exist == 0 ) {  
                            var $item = $('<div class="cut-line"></div>');
                            $('.grid').eq(grid_index).append($item);
                            
                            $item.css({
                                'position': 'absolute',
                                'top': item_top + item_height,
                                'left': sub_left_offset,
                                'width': line_offset - sub_left_offset,
                                'height': cut_line_width,
                                'z-index': 1
                            });

                            var cut_line_obj = {
                                left: sub_left_offset,
                                top: item_top + item_height,
                                width: line_offset - sub_left_offset,
                                height: cut_line_width,
                                index: $item.index(),
                                jquery: $item
                            }
                            cut_lines.push(cut_line_obj);
                        }
                        
                    }
                }

                //remove subhorizontal and subvertical
                var sub_cut_lines_to_remove = cut_lines.filter(function(line) {
                    var line_left = line.left;
                    var line_top = line.top;
                    var line_width = line.width;
                    var line_height = line.height;

                    var connection_count = grid_items.filter(function(elem) {
                        var elem_left = elem.left;
                        var elem_top = elem.top;
                        var elem_width = elem.width;
                        var elem_height = elem.height;

                        return   (line_left == (elem_left + elem_width) || (line_left + cut_line_width) == elem_left)
                               && line_top <= elem_top
                               && (line_top + line_height) >= (elem_top + elem_height)
                               && line_width == cut_line_width

                    });

                   

                    return     (line_left + cut_line_width) == item_left
                            && line_width == cut_line_width
                            && line_top == item_top
                            && line_height != gridHeight
                            && connection_count.length == 1

                });

                //subvertical
                var sub_cut_veritcal_lines_to_remove = cut_lines.filter(function(line) {
                    var line_left = line.left;
                    var line_top = line.top;
                    var line_width = line.width;
                    var line_height = line.height;

                    var connection_count = grid_items.filter(function(elem) {
                        var elem_left = elem.left;
                        var elem_top = elem.top;
                        var elem_width = elem.width;
                        var elem_height = elem.height;

                        return   (line_left == (elem_left + elem_width) || (line_left - cut_line_width) == elem_left)
                               && line_top == elem_top
                               && (line_top + line_height) == (elem_top + elem_height)
                               && line_width == cut_line_width

                    });

                    return     line_width == cut_line_width
                            && line_height != gridHeight
                            && connection_count.length == 0

                });

                var sub_cut_lines_to_removes = [];
                if (sub_cut_lines_to_remove.length > 0 && sub_cut_veritcal_lines_to_remove.length > 0 ) {
                    sub_cut_lines_to_removes = sub_cut_lines_to_remove.concat(sub_cut_veritcal_lines_to_remove);
                }
                else if ( sub_cut_lines_to_remove.length > 0 ) {
                    sub_cut_lines_to_removes = sub_cut_lines_to_remove;
                }
                else if ( sub_cut_veritcal_lines_to_remove.length > 0 ) {
                    sub_cut_lines_to_removes = sub_cut_veritcal_lines_to_remove;
                }

                if ( sub_cut_lines_to_removes.length > 0) {
                    sub_cut_lines_to_removes.forEach( function(line_to_delete) {
                        line_to_delete.jquery.remove();
                        var index_to_delete = cut_lines.findIndex( function(line) {
                            return line_to_delete.index == line.index;
                        });
                        if ( index_to_delete )
                            cut_lines.splice(index_to_delete, 1);

                    });
                }
                
                // add left subvertical if it needed
                if ( item_left - cut_line_width > 0 && sub_left_offset < item_left) {
                    // check if line dosent exist
                    var check_exist = cut_lines.filter( function(line) {
                        return      line.height == (item_height)
                                 && line.width == cut_line_width
                                 && line.left == (item_left - cut_line_width)
                                 && line.top == item_top
                    }).length;

                    if ( check_exist == 0 ) { 
                        var $item = $('<div class="cut-line"></div>');
                        $('.grid').eq(grid_index).append($item);
                        $item.css({
                            'position': 'absolute',
                            'top': item_top,
                            'left': item_left - cut_line_width,
                            'width': cut_line_width,
                            'height': item_height,
                            'z-index': 1
                        });

                        var cut_line_obj = {
                            left: item_left - cut_line_width,
                            top: item_top,
                            width: cut_line_width,
                            height: item_height + cut_line_width,
                            index: $item.index(),
                            jquery: $item
                        }
                        cut_lines.push(cut_line_obj);
                    }
                }

                if ( sub_left_offset <= item_left && item_summ < line_offset && (sub_left_offset + item_width) == (item_left + item_width) ) {
                    // draw sub vertical;
                    // check if line dosent exist
                    
                    var check_exist = cut_lines.slice(0).filter( function(line) {
                        return      line.height >= item_height
                                 && line.width == cut_line_width
                                 && line.left == (sub_left_offset + item_width)
                                 && line.top <= item_top
                                 && (line.top + line.height) >= (item_top + item_height)
                    });

                    if ( check_exist.length == 0 ) { 
                        var $item = $('<div class="cut-line"></div>');
                        $('.grid').eq(grid_index).append($item);
                        $item.css({
                            'position': 'absolute',
                            'top': item_top,
                            'left': sub_left_offset + item_width,
                            'width': cut_line_width,
                            'height': item_height,
                            'z-index': 1
                        });

                        var cut_line_obj = {
                            left: sub_left_offset + item_width,
                            top: item_top,
                            width: cut_line_width,
                            height: item_height,
                            index: $item.index(),
                            iquery: $item
                        }
                        cut_lines.push(cut_line_obj);
                    }

                    // check if line dosent exist
                    var check_exist = cut_lines.filter( function(line) {
                        return      line.height >= item_height
                                 && line.width == cut_line_width
                                 && line.left == (sub_left_offset - cut_line_width)
                                 && line.top <= item_top
                                 && (line.top + line.height) >= (item_top + item_height)
                    }).length;

                    if ( check_exist == 0 && sub_left_offset != 0) { 
                        $item = $('<div class="cut-line"></div>');
                        $('.grid').eq(grid_index).append($item);
                        $item.css({
                            'position': 'absolute',
                            'top': item_top,
                            'left': sub_left_offset - cut_line_width,
                            'width': cut_line_width,
                            'height': item_height,
                            'z-index': 1
                        });

                        var cut_line_obj = {
                            left: sub_left_offset - cut_line_width,
                            top: item_top,
                            width: cut_line_width,
                            height: item_height,
                            index: $item.index(),
                            jquery: $item
                        }
                        cut_lines.push(cut_line_obj);
                    }
                }
                
            });
            
        }

        
        // remove main vertical lines that not related to any elem

        cut_lines.filter(function(line) {
                var line_left = line.left;
                var line_top = line.top;
                var line_width = line.width;
                var line_height = line.height;

                return line_width == cut_line_width && line_height == gridHeight;
        }).forEach( function(line) {

            var line_left = line.left;
            var line_top = line.top;
            var line_width = line.width;
            var line_height = line.height;

            // if any elem have not any connection to line then delete
            var element_count = grid_items.length;
            var related_count = 0;
            grid_items.forEach(function( elem ) {
                var item_left = elem.left;
                var item_top = elem.top;
                var item_width = elem.width;
                var item_height = elem.height;

                if (
                           item_left == (line_left + line_width)
                        || (item_left + item_width) == line_left
                   ) 
                {
                    related_count++;
                }
            });

            if ( related_count == 0 ) {
                line.jquery.remove();
                var index_to_delete = cut_lines.findIndex( function(line_) {
                        return line_.index == line.index;
                    });
                if ( index_to_delete )
                    cut_lines.splice(index_to_delete, 1);
            }
        });

         // remove  horizontal lines that not related to any elem

        cut_lines.filter(function(line) {
                var line_height = line.height;
                var line_width = line.width;

                return    line_height == cut_line_width;
        }).forEach( function(line) {

            var line_left = line.left;
            var line_top = line.top;
            var line_width = line.width;
            var line_height = line.height;

            // if any elem have not any connection to line then delete
            var element_count = grid_items.length;
            var related_count = 0;
            grid_items.forEach(function( elem ) {
                var item_left = elem.left;
                var item_top = elem.top;
                var item_width = elem.width;
                var item_height = elem.height;

                if (
                        
                                (       item_top >= (line_top + line_height)
                                    || 
                                        (item_top + item_height) <= line_top
                                )
                            &&
                                (       item_left <= line_left 
                                    ||
                                        (item_left + item_width) <= (line_left + line_width)
                                )
                        
                   ) 
                {
                    related_count++;
                }
            });

            if ( related_count == 0 ) {
                line.jquery.remove();
                var index_to_delete = cut_lines.findIndex( function(line_) {
                        return line_.index == line.index;
                    });
                if ( index_to_delete )
                    cut_lines.splice(index_to_delete, 1);
            }
        });

        // fix for situation when item below last main horizontal but not have top = 0;
        var last_horizontal_main_line_offset_arr = [];
        cut_lines.filter(function(line){
                    line_top = line.top;
                    line_height = line.height;
                    return line_top == 0 && line_height == gridHeight;
                }).forEach(function(line){
                    line_left = line.left;

                    last_horizontal_main_line_offset_arr.push( line_left);
                    
                });

        var last_horizontal_main_line_offset_fix_value = Math.max.apply(null, last_horizontal_main_line_offset_arr);
        var last_item_without_right_main_line = grid_items.filter(function(elem) {
            var item_top = elem.top;
            var item_left = elem.left;
            return item_top > 0 && item_left > last_horizontal_main_line_offset_fix_value;


        })
        
        if ( last_item_without_right_main_line.length > 0 && vertical_main_line_count > 1) {

            var max_width = [];

            last_item_without_right_main_line.forEach( function(elem) {
                var item_left = elem.left;
                var item_top = elem.top;
                var item_width = elem.width;
                var item_height = elem.height;

                max_width.push( item_left + item_width );

            });

            var max_width_offset = Math.max.apply(null, max_width);
            item_left = last_item_without_right_main_line.left;
            item_width = last_item_without_right_main_line[0].width;

            // check if line dosent exist
            var check_exist = cut_lines.filter( function(line) {
                return      line.height == gridHeight
                         && line.width == cut_line_width
                         && line.left == max_width_offset
                         && line.top == 0
            }).length;

            if ( check_exist == 0 ) { 
                var $item = $('<div class="cut-line"></div>');
                $grid.append($item);

                $item.css({
                    'position': 'absolute',
                    'top': 0,
                    'left': max_width_offset,
                    'width': cut_line_width,
                    'height': gridHeight,
                    'z-index': 1
                });

                var cut_line_obj = {
                    left: max_width_offset,
                    top: 0,
                    width: cut_line_width,
                    height: gridHeight,
                    index: $item.index(),
                    jquery: $item
                }
                cut_lines.push(cut_line_obj);
            }

            //fix bottom cut lines
            cut_lines_to_fix = cut_lines.filter(function(line){
                var line_left = line.left;
                var line_top = line.top;
                var line_width = line.width;
                var line_height = line.height;
                
                return line_left > last_horizontal_main_line_offset_fix_value && line_height == cut_line_width;
            });
            if ( cut_lines_to_fix.length > 0) {
                cut_lines_to_fix.forEach( function(line) {
                    line.jquery.css('width', (max_width_offset - last_horizontal_main_line_offset_fix_value) + 'px');
                });
            }
            
        }

        // remove  horizontal lines that not related to any elem
        if ( last_item_without_right_main_line.length == 0 ) {
            var cut_lines_to_delete = cut_lines.filter(function(line) {
                    var line_left = line.left;
                    var line_height = line.height;

                    return line_left > (last_horizontal_main_line_offset_fix_value + cut_line_width) && line_height == cut_line_width;
            });
            if ( cut_lines_to_delete.length > 0) {
                cut_lines_to_delete.forEach( function(line_to_delete) {
                    line_to_delete.jquery.remove();
                    var index_to_delete = cut_lines.findIndex( function(line) {
                        return line_to_delete.index == line.index;
                    });
                    if ( index_to_delete )
                        cut_lines.splice(index_to_delete,1);

                });
            };

        }

        

        //remove possible doubles of sub horizontal 

        var cut_lines_ = [];
        $grid.find('.cut-line').each( function(n, line) {
            var line_height = $(line)[0].getBoundingClientRect().height;
            var line_width = $(line)[0].getBoundingClientRect().width;
            var line_top = $(line).position().top;
            var line_left = $(line).position().left;
            var line_index = $(line).index();
            var line = {
                left: line_left,
                top: line_top,
                width: line_width,
                height: line_height,
                index: line_index,
                jquery: $(line)
            };

            cut_lines_.push(line);
        });

        var sub_horizontal_cut_lines = cut_lines_.filter(function(line) {
                var line_width = line.width;
                var line_height = line.height;

                return line_height < gridHeight && line_width == cut_line_width;
        });

        if ( sub_horizontal_cut_lines.length > 0 ) {
            var cut_lines_to_delete = sub_horizontal_cut_lines.filter(function(line) {
                var line_width = line.width;
                var line_height = line.height;
                var line_left = line.left;

                var find_index = cut_lines_.findIndex( function(line_) {
                    var line_width_ = line_.width;
                    var line_height_ = line_.height;
                    var line_left_ = line_.left;

                    return line_height_ == gridHeight && line_left_ == line_left && line_width_ == cut_line_width;
                });

                return find_index > 0;
            });

            if ( cut_lines_to_delete.length > 0) {
                cut_lines_to_delete.forEach( function(line_to_delete) {
                    line_to_delete.jquery.remove();
                    var index_to_delete = cut_lines_.findIndex( function(line) {
                        return line_to_delete.index == line.index;
                    });
                    if ( index_to_delete )
                        cut_lines_.splice(index_to_delete,1);

                });
            };
        }

        /*$('.grid').eq(grid_index).find('.cut-line').droppable({
            greedy: true,
            tolerance: 'touch',
            drop: function(event,ui){
                ui.draggable.draggable('option','revert',true);
            }
        });*/

        var b = performance.now();
        window.console.log('execution time ' + (b - a) + ' ms.');

        recalculateCutLinesMetrics();
        

    }

    function removeDragItemCutLines($grid, elem) {
        var grid_cut_line_width = $actual_cut_line_width;
        var elem_height = $(elem)[0].getBoundingClientRect().height;
        var elem_width = $(elem)[0].getBoundingClientRect().width
        var elem_top = $(elem).position().top;
        var elem_left = $(elem).position().left;
        var elem_index = $(elem).index();
       

        //find left and right verital lines;

        var closest_vertical_left = [];
        var closest_vertical_right = [];

        //find left or right vertical line if exist
        $grid.find('.cut-line').each( function(n, line) {
            var line_height = $(line)[0].getBoundingClientRect().height;
            var line_width = $(line)[0].getBoundingClientRect().width;
            var line_top = $(line).position().top;
            var line_left = $(line).position().left;

            var connection_count = $grid.find('.grid-item').filter(function(n, elem) {
                    var item_left = $(elem).position().left;
                    var item_top = $(elem).position().top;
                    var item_width = $(elem)[0].getBoundingClientRect().width;
                    var item_height = $(elem)[0].getBoundingClientRect().height;

                    return    ( (line_left + line_width) == item_left || (line_left) == (item_left + item_width))
                           && line_top <= item_top
                           && (line_top + line_height) >= (item_top + item_height)
                           && line_width == grid_cut_line_width
                           && elem_index != $(elem).index();

                }).length;

            if (   connection_count == 0 
                && line_top == elem_top 
                && line_height == elem_height
                && (    line_left == (elem_left + elem_width) 
                     || (line_left + grid_cut_line_width) == elem_left
                    )
                )
                $(line).remove();
        });

        var cut_lines = $grid.find('.cut-line');

        cut_lines.each( function(n, line) {

            var line_height = $(line)[0].getBoundingClientRect().height;
            var line_width = $(line)[0].getBoundingClientRect().width;
            var line_top = $(line).position().top;
            var line_left = $(line).position().left;
            
            // cut line can intersect element a little because some issue, so extra check for line cut line_left+width > elem_left
            if (  ( ((line_left + line_width) <= elem_left) || ( (line_left + line_width) > elem_left && (line_left < elem_left) ) )
                 && line_width == grid_cut_line_width
                 && line_height == $grid[0].getBoundingClientRect().height
               ) {
                closest_vertical_left.push(line);
            }
            //window.console.log(line_left + ' ' + (elem_left+elem_width));

            if (  ( line_left >= (elem_left+elem_width))
                 && line_width == grid_cut_line_width
                 && line_height == $grid[0].getBoundingClientRect().height
               ) {
                closest_vertical_right.push(line);
            }
            
        });

        //find closest left horisontal cut line
        var left_offset = 0;

        if (closest_vertical_left.length > 0) {
            left_offset = Math.max.apply(null, closest_vertical_left.map(function(line) {
                                    return $(line).position().left;
                                })
                           );
            left_offset += grid_cut_line_width;
        }

        //find closest right horisontal cut line
        var right_offset = $grid.outerWidth();

        if (closest_vertical_right.length > 0) {
             right_offset = Math.min.apply(null, closest_vertical_right.map(function(line) {
                                    return $(line).position().left;
                                })
                             );
        }

        //find cut lines inside set and closest to elem;

        var closest_horizontal_top = [];
        var closest_horizontal_bottom = [];

        cut_lines.each( function(n, line) {

            var line_height = $(line)[0].getBoundingClientRect().height;
            var line_width = $(line)[0].getBoundingClientRect().width;
            var line_top = $(line).position().top;
            var line_left = $(line).position().left;
            
            // cut line can intersect element a little because some issue
            if ( ( (line_top + line_height) == elem_top || ( (line_top + line_height) > elem_top && (line_top + line_height) < (elem_top + elem_height) ) )
                 && line_height == grid_cut_line_width
                 && (line_left >= left_offset)
                 && (line_left + line_width <= right_offset)
               ) {
                closest_horizontal_top.push(line);
            }

            if ( ( line_top == (elem_top + elem_height) || ( line_top < (elem_top + elem_height) && (line_top + line_height) > (elem_top + elem_height) ) )
                 && line_height == grid_cut_line_width
                 && (line_left >= left_offset)
                 && (line_left + line_width <= right_offset)
               ) {
                closest_horizontal_bottom.push(line);
            }
            
        });

        var closest_horizontal_top_offset = [];
        for (i in closest_horizontal_top) {
            closest_horizontal_top_offset.push($(closest_horizontal_top[i]).position().top);
        }
        var closest_horizontal_top_offset_value = Math.max.apply(null, closest_horizontal_top_offset);
        
        var closest_horizontal_top_elem = null;

        for (i in closest_horizontal_top) {
            if ( $(closest_horizontal_top[i]).position().top == closest_horizontal_top_offset_value) {
                closest_horizontal_top_elem = closest_horizontal_top[i];
                break;
            }
        }

        var closest_horizontal_bottom_offset = [];
        for (i in closest_horizontal_bottom) {
            closest_horizontal_bottom_offset.push($(closest_horizontal_bottom[i]).position().top);
        }
        var closest_horizontal_bottom_offset_value = Math.min.apply(null, closest_horizontal_bottom_offset);

        var closest_horizontal_bottom_elem = null;
        for (i in closest_horizontal_bottom) {
            if ( $(closest_horizontal_bottom[i]).position().top == closest_horizontal_bottom_offset_value) {
                closest_horizontal_bottom_elem = closest_horizontal_bottom[i];
                break;
            }
        }

        // need to know that closest horisontal have intersect with other elements in section


        if ( closest_horizontal_top_elem != null) {
            var top_border_element_found = false;
            $grid.find('.grid-item').filter( function(n, e) {
                return !$(e).hasClass('ui-draggable-dragging');
        }   ).each( function(n, other_elem) {
                var other_elem_height = $(other_elem)[0].getBoundingClientRect().height;
                var other_elem_width = $(other_elem)[0].getBoundingClientRect().width;
                var other_elem_top = $(other_elem).position().top;
                var other_elem_left = $(other_elem).position().left;

                if (       left_offset <= other_elem_left 
                        && (other_elem_left + elem_width <= right_offset)
                        && ( (other_elem_top + other_elem_height) == $(closest_horizontal_top_elem).position().top
                                ||
                            other_elem_top == ( $(closest_horizontal_top_elem).position().top  + grid_cut_line_width)
                            )
                   ) 
                {
                    top_border_element_found = true;
                }
               
            });

            if ( !top_border_element_found )
                $(closest_horizontal_top_elem).remove();
        }

        if ( closest_horizontal_bottom_elem != null ) {
            var bottom_border_element_found = false;
            $grid.find('.grid-item').filter( function(n, e) {
                return !$(e).hasClass('ui-draggable-dragging');
            }).each( function(n, other_elem) {
                var other_elem_height = $(other_elem)[0].getBoundingClientRect().height;
                var other_elem_width = $(other_elem)[0].getBoundingClientRect().width;
                var other_elem_top = $(other_elem).position().top;
                var other_elem_left = $(other_elem).position().left;

                if (       left_offset <= other_elem_left 
                        && (other_elem_left + elem_width <= right_offset)
                        && (  (other_elem_top == ( $(closest_horizontal_bottom_elem).position().top + grid_cut_line_width) )
                                ||
                              ( (other_elem_top + other_elem_height) == $(closest_horizontal_bottom_elem).position().top )
                            )
                   ) 
                {   
                    bottom_border_element_found = true;
                }
                
            });
            window.console.log('closest_horizontal_top_elem');
            window.console.log($(closest_horizontal_top_elem));

             window.console.log('closest_horizontal_bottom_elem');
             window.console.log($(closest_horizontal_bottom_elem));
            if ( !bottom_border_element_found && $(closest_horizontal_top_elem).index() != $(closest_horizontal_bottom_elem).index()

               )
                $(closest_horizontal_bottom_elem).remove();
        }
    
        /*$(closest_horizontal_top_elem).remove();
        $(closest_horizontal_bottom_elem).remove();*/
    }

    function autoMoveAfterDrag($grid, elem) {
        var params = getParams($grid, elem);
        var elem_top = $(elem).position().top;
        var elem_left = $(elem).position().left;

        //first more to top left
        //init
        var element_new_top = elem_top;
        var element_new_left = elem_left;
        params.itemPosition = {
            top: element_new_top,
            left: element_new_left
        };
        
        var can_move_top = true;
        do {
            var temp_params = params;
            temp_params.itemPosition.top = element_new_top;
            if (checkCollision(temp_params) == "valid") {
                params.itemPosition.top = temp_params.itemPosition.top;
                element_new_top -= 1;
            }
            else {
                can_move_top = false;
            }

        } while ( can_move_top );

        //workaround
        params.itemPosition.top += 1;

        var can_move_left = true;
        do {
            var temp_params = params;
            temp_params.itemPosition.left = element_new_left;

            if (checkCollision(temp_params) == "valid") {
                params.itemPosition.left = temp_params.itemPosition.left;
                element_new_left -= 1;
            }
            else {
                can_move_left = false;
            }

        } while ( can_move_left );
        
        //workaround
        params.itemPosition.left +=1;


        params.itemPosition.top = params.itemPosition.top == 1 ? params.itemPosition.top = 0 : params.itemPosition.top;
        params.itemPosition.left = params.itemPosition.left == 1? params.itemPosition.left = 0 : params.itemPosition.left;

        window.console.log('move after drag left ' + params.itemPosition.left);
        window.console.log('move after drag top ' + params.itemPosition.top);
        $(elem).animate({
                        'top': params.itemPosition.top,
                        'left': params.itemPosition.left
                    }, 
                    500,
                    function() {
                        //workaround
                        redrawManualGrigAfterDrag($grid.index());
                        }
                    );   
    }

    function canRotate($elem) {
        var $grid = $elem.parents(".grid").first();
        var gridWidth = $grid.width();
        var gridHeight = $grid.height();
        var left_offset = 0;
        var right_offset = 0;

        /*
         *  FIRST STEP FIND LEFT AND RIGHT OFFSETS 
         */

        if ( $elem.width() == $elem.height() ) {
            return false;
        }

        left_offset = $elem.position().left;

        // find right offset

        // find closest right main vertical cut line.

        var right_vertical_main_lines = $grid.find('.cut-line').filter( function(n, line) {
            return    $(line).height() == gridHeight
                   && $(line).position().left >= ( $elem.position().left + $elem.width() )
        });

        window.console.log('right_vertical_main_lines');
        window.console.log(right_vertical_main_lines);

        // add grid width as last vertical cut line
        var right_vertical_main_lines_offsets = [];
        if ( right_vertical_main_lines.length > 0) {
            right_vertical_main_lines_offsets = right_vertical_main_lines.map( 
                function( n, line ) {
                    return $(line).position().left;
                }
            );
        }

        right_vertical_main_lines_offsets.push(gridWidth);

        right_offset = Math.min.apply(null, right_vertical_main_lines_offsets);
        
        if ( ($elem.position().left + $elem.width()) == gridWidth)
            right_offset = gridWidth;

        var right_main_cut_line_offset = right_offset;

        // check if exist sub-element on right side, if they do - redefine right offset

        var sub_elements_on_right = $grid.find('.grid-item').filter( function(n, elem) {
            return    $(elem).index() != $elem.index()
                   && $(elem).position().left >= ($elem.position().left + $elem.width())
                   && ($(elem).position().left + $(elem).width()) <= right_offset
                   && $(elem).position().top <= $(elem).position().top
                   && ($(elem).position().top + $(elem).height()) <= ($elem.position().top + $elem.height());
        });

        if ( sub_elements_on_right.length > 0 ) {
            right_offset = Math.min.apply(null, sub_elements_on_right.map( 
                    function( n, elem ) {
                        return $(elem).position().left;
                    }
                )
            );
            right_offset -= $actual_cut_line_width;
        }
        
        // check if element in last set, if so redefine right offset
        // find closest main right cut line;
        var count_main_cut_line_on_right_side = $grid.find('.cut-line').filter( function(n, line) {
            return    $(line).height() == gridHeight
                   && $(line).position().left >= right_main_cut_line_offset
        }).length;

        var element_after_right_main_cut_line = $grid.find('.grid-item').filter( function(n, elem) {
            return    $(elem).position().left >= right_main_cut_line_offset
        }).length;

        // if it last set and elem dosent have elem on right
        if (     sub_elements_on_right.length == 0
             && (count_main_cut_line_on_right_side == 0)
             && element_after_right_main_cut_line == 0
            ) {
            right_offset = gridWidth;
        }

        window.console.log('right_offset');
        window.console.log(right_offset);

        // check if element can rotate within offsets
        // $elem.height is new $elem.width
        if ( ( $elem.position().left + $elem.height() ) > right_offset )
            return false;

        /*
         *  SECOND STEP FIND TOTAL SET HEIGHT AFTER ROTATION
         */

        // find elements in set below element

        var elements_below = $grid.find('.grid-item').filter( function(n, elem) {
            return    $(elem).index() != $elem.index()
                   && $(elem).position().left >= left_offset
                   && ($(elem).position().left + $(elem).width()) <= right_offset
                   && ($(elem).position().top + $(elem).height()) > ($elem.position().top + $elem.height());
        });

        var height_offset_after_rotate = 0;

        if ( $elem.width() > $elem.height() )
            height_offset_after_rotate = $elem.position().top + ( $elem.width() );
        if ( $elem.width() < $elem.height() )
            height_offset_after_rotate = $elem.position().top + ( $elem.height() );
        
        //find bottom most
        var max_height_offset = 0;
        if ( height_offset_after_rotate > 0 && elements_below.length > 0) {
            max_height_offset = Math.min.apply(null, elements_below.map( 
                    function( n, elem ) {
                        return $(elem).position().top + $(elem).height();
                    }
                )
            );
        }

        //check if new offsets for bottom most
        if ( (height_offset_after_rotate + max_height_offset) > gridHeight)
            return false;

        $elem.data('left_offset', left_offset);
        $elem.data('right_offset', right_offset);
        $elem.data('right_main_cut_line_offset', right_main_cut_line_offset);
        window.console.log('height_offset_after_rotate ' + height_offset_after_rotate);
        window.console.log('max_height_offset ' + max_height_offset);
        window.console.log('gridHeight ' + gridHeight);

        return true;
    }

    function rotateItem($elem) {
        var $grid = $elem.parents(".grid").first();
        var left_offset = $elem.data('left_offset');
        //var right_offset = $elem.data('right_offset');
        var right_offset = $elem.data('right_main_cut_line_offset');
        
        var rotate_offset = ( $elem.width() > $elem.height() ) ? $elem.width() - $elem.height() : 0;

        // remove main vertical cut line if it last set
        /*var main_cut_lines = false;

        if ( right_offset == $grid.width() ) {
            main_cut_lines = $grid.find('.cut-line').filter( function(n, line) {
                    return    $(line)[0].getBoundingClientRect().width == $actual_cut_line_width
                           && $(line)[0].getBoundingClientRect().height == $grid[0].getBoundingClientRect().height
            });

            //find max left offset
            max_left_offset = Math.max.apply(null, main_cut_lines.map( function(n, line) {
                return $(line).position().left;
            }));

            window.console.log('max_left_offset');
            window.console.log(max_left_offset);

            if ( max_left_offset >= ($elem.position().left + $elem[0].getBoundingClientRect().width) ) {
                main_cut_lines.each(function(n, line) {
                    if ( $(line).position().left == max_left_offset)
                        $(line).remove();
                });
            }
        }*/
        // remove right cut line
         $grid.find('.cut-line').filter( function(n, line) {
                    return    $(line)[0].getBoundingClientRect().width == $actual_cut_line_width
                           && $(line)[0].getBoundingClientRect().height == $elem[0].getBoundingClientRect().height
                           && $(line).position().top == $elem.position().top
                           && $(line).position().left == ( $elem.position().left + $elem[0].getBoundingClientRect().width)
            }).remove();

        //find element below including cut line
        if ( rotate_offset > 0 && $elem.data('rotated') != true ) {
            $grid.find('.grid-item')
                .filter( function(n, elem) {
                    return    $(elem).index() != $elem.index()
                           && $(elem).position().left >= left_offset
                           && ($(elem).position().left + $(elem).width()) <= right_offset
                           && ($(elem).position().top + $(elem).height()) > ($elem.position().top + $elem.height());
                })
                .each( function(n, elem) {
                    var temp_top = $(elem).position().top;
                    var new_top = temp_top + rotate_offset;
                    $(elem).css('top', new_top + 'px');
                });

                $grid.find('.cut-line')
                .filter( function(n, line) {
                    return    $(line).height() != $grid.height()
                           && $(line).position().left >= left_offset
                           && ($(line).position().left + $(line).width()) <= right_offset
                           && $(line).position().top > ($elem.position().top + $elem.height());
                })
                .each( function(n, line) {
                    var temp_top = $(line).position().top;
                    var new_top = temp_top + rotate_offset;
                    $(line).css('top', new_top + 'px');
                });
        }

        //before rotate - delete s

        //rotate item
        var elem_temp_width = $elem[0].getBoundingClientRect().width;
        var elem_temp_height = $elem[0].getBoundingClientRect().height;
        $elem.data('rotated', true);

        /*$elem.animate({
                        'width': elem_temp_height,
                        'height': elem_temp_width,
                    }, 
                    500,
                    function() {
                         autoMoveAfterDrag($grid, $elem[0]);
                        }
                    ); */ 
        
        $elem.css({
                        'width': elem_temp_height,
                        'height': elem_temp_width,
                    });

        // change values on list

        var elem_num = parseInt($elem.find('span').text());

        var $group = $('#item-list .group').filter( function(n, group) {
            
            var group_num = parseInt($(group).find('.num').text());
            return elem_num == group_num;

        }).first();

        var list_temp_w = $group.find('input[name="grid-item-width"]').first()[0].value;
        var list_temp_h = $group.find('input[name="grid-item-height"]').first()[0].value;

        $group.find('input[name="grid-item-width"]').first()[0].value = list_temp_h;
        $group.find('input[name="grid-item-height"]').first()[0].value = list_temp_w;

        $('.grid-options input[name="grid-item-width"]').first()[0].value = list_temp_h;
        $('.grid-options input[name="grid-item-height"]').first()[0].value = list_temp_w;

        // remove line that causes collision
        //bottom
        $grid.find('.cut-line').filter( function(n, line) {

            return    $(line)[0].getBoundingClientRect().height == $actual_cut_line_width
                   && $(line).position().top < ($elem.position().top + $elem[0].getBoundingClientRect().height)
                   && $(line).position().top > $elem.position().top
                   && $(line).position().left >= left_offset
                   && ($(line).position().left + $(line)[0].getBoundingClientRect().width) <= right_offset
                   && $(line).position().left ==  $elem.position().left;

        }).remove();
        //right
        $grid.find('.cut-line').filter( function(n, line) {
            return    $(line)[0].getBoundingClientRect().width == $actual_cut_line_width
                   && $(line)[0].getBoundingClientRect().height !== $grid[0].getBoundingClientRect().height
                   && $(line).position().top == $elem.position().top
                   && $(line).position().left > $elem.position().left
                   && $(line).position().left < ($elem.position().left + $elem[0].getBoundingClientRect().width)

        }).remove();

        //add new cut line if it needed
        var bottom_cut_line_for_rotated_elem = $grid.find('.cut-line').filter( function(n, line) {
            return    $(line)[0].getBoundingClientRect().height == $actual_cut_line_width
                   && $(line).position().top == ($elem.position().top + $elem[0].getBoundingClientRect().height)
                   && $(line).position().left == $elem.position().left;
        })

        window.console.log('bottom_cut_line_for_rotated_elem');
        window.console.log(bottom_cut_line_for_rotated_elem);

        if ( bottom_cut_line_for_rotated_elem.length == 0) {

            var right_main_cut_line_offset = $grid.width();

            var right_vertical_main_lines = $grid.find('.cut-line').filter( function(n, line) {
            return    $(line).height() == $grid.height()
                   && $(line).position().left >= ( $elem.position().left + $elem.width() )
            });

            if ( right_vertical_main_lines.length > 0) {
                right_main_cut_line_offset = Math.min.apply(null, right_vertical_main_lines.map( 
                        function( n, line ) {
                            return $(line).position().left;
                        }
                    )
                );
            }

            var $item = $('<div class="cut-line"></div>');
            $grid.append($item);
            var line_width = right_main_cut_line_offset - left_offset
            $item.css({
                'position': 'absolute',
                'top': $elem.position().top + $elem[0].getBoundingClientRect().height,
                'left': left_offset,
                'width': line_width,
                'height': $actual_cut_line_width,
                'z-index': 1
            });
        }

        var right_cut_line_for_rotated_elem = $grid.find('.cut-line').filter( function(n, line) {
            return    $(line)[0].getBoundingClientRect().width == $actual_cut_line_width
                   && $(line)[0].getBoundingClientRect().height != $grid[0].getBoundingClientRect().height
                   && $(line).position().left == ($elem.position().left + $elem[0].getBoundingClientRect().width)
                   && $(line).position().top == $elem.position().top;
        })

        if ( right_cut_line_for_rotated_elem.length == 0) {

            var right_main_cut_line_offset = $grid.width();

            var right_vertical_main_lines = $grid.find('.cut-line').filter( function(n, line) {
            return    $(line).height() == $grid.height()
                   && $(line).position().left >= ( $elem.position().left + $elem.width() )
            });

            if ( right_vertical_main_lines.length > 0) {
                var right_vertical_main_lines_arr = [];
                right_vertical_main_lines_arr = right_vertical_main_lines.map( 
                    function( n, line ) {
                        return $(line).position().left;
                    }
                );
                // add grid right offset as cut line offset
                right_vertical_main_lines_arr.push( $grid.width() );

                right_main_cut_line_offset = Math.min.apply(null, right_vertical_main_lines_arr);
            }

            var line_left = $elem.position().left + $elem[0].getBoundingClientRect().width;
            if ( right_main_cut_line_offset <= $grid.width() && line_left < right_main_cut_line_offset) {
                var $item = $('<div class="cut-line"></div>');
                $grid.append($item);
                $item.css({
                    'position': 'absolute',
                    'top': $elem.position().top,
                    'left': line_left,
                    'width': $actual_cut_line_width,
                    'height': $elem[0].getBoundingClientRect().height,
                    'z-index': 1
                });
            }
        }
        // remove horicontal cut line that does not belong to any element
        $grid.find('.cut-line').filter( function(n, line) {
            var line_top = $(line).position().top;
            var belong_count = 0;
            $grid.find('.grid-item').each( function(n, elem) {
                    var elem_top = $(elem).position().top;
                    var elem_height = $(elem)[0].getBoundingClientRect().height

                    if ( ( line_top == (elem_top+elem_height) || (line_top + $actual_cut_line_width) == elem_top) ) {
                        belong_count++;
                    }
                });


            return    $(line)[0].getBoundingClientRect().height == $actual_cut_line_width
                   && belong_count == 0

        }).remove();

        recalculateCutLinesMetrics();
        
        
    }

    function recalculateCutLinesMetrics() {
        var total_cut_line_length = 0;
        var populate_area = 0;
    
        $('.grid-wrapper .cut-line').each( function(n, line) {
            if ( $(line).width() == $actual_cut_line_width ) {
                length_mm = Math.round( $(line).height() / ($scale * $zoom) );
                
                total_cut_line_length += length_mm;
                populate_area  += (length_mm * $cut_line_width);
            }
            else if ( $(line).height() == $actual_cut_line_width ) {
                length_mm = Math.round( $(line).width() / ($scale * $zoom) );

                total_cut_line_length += length_mm;
                populate_area  += (length_mm * $cut_line_width);
            }
        });

        $('#item-list .group').each( function(n, item) {
            width_mm = parseInt( $(item).find('input[name="grid-item-width"]').val() );
            height_mm = parseInt( $(item).find('input[name="grid-item-height"]').val() );
            populate_area += (width_mm * height_mm);
        });

        var gridWidth = parseInt( $('[name="grid-width"]').val() ),
            gridHeight = parseInt( $('[name="grid-height"]').val() );
        var grids_areas = ( gridWidth * gridHeight ) * parseInt( $('.grid-wrapper .grid').length );
        
        $('#total-grid-count').text( $('.grid-wrapper .grid').length );
        $('#total-cut-lenght').text( (total_cut_line_length / 1000).toFixed(1) );
        $('#cutting-cost').text( (((total_cut_line_length / 1000).toFixed(1) * $meter_cost)).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1 ') + ' ₽');

        // fix possible negative area remaing (bacause of rounding)
        var populate_diff = grids_areas - populate_area;
        populate_diff = populate_diff < 0 ? 0 : populate_diff;

        $('#cutting-meter-remains').text(  Math.floor( ( (populate_diff) / (1000*1000) ) *10 ) / 10 );

    }

    // START ADD EQUALS
    $(document).ready(function () {
        $("#cutting-modal-cutting-equals").dialog({
            autoOpen: false,
            draggable: false,
            modal: true,
            resizable: false,
            title: "Кратный раскрой листа",
            closeText: "",
            width: 420,
            position: { my: "center", at: "center-10 center-100", of: ".box-grid .old-col-11" },
            open: function( event, ui ) {
            }
        });


        //init and redraw previews
        function populateCuttingEqualsModal(grid, cut_lines, result) {
            $('.cutting-equals-preview-action-horizontal-value').val(cut_lines.horizontal_count);
            $('.cutting-equals-preview-action-vertical-value').val(cut_lines.vertical_count);
            if ( cut_lines.horizontal_count == 0) {
                $('.cutting-equals-preview-action-horizontal-minus').attr('disabled', 'disabled');
            }
            else {
                $('.cutting-equals-preview-action-horizontal-minus').removeAttr("disabled");
            }
            if ( cut_lines.vertical_count == 0) {
                $('.cutting-equals-preview-action-vertical-minus').attr('disabled', 'disabled');
            }
            else {
                $('.cutting-equals-preview-action-vertical-minus').removeAttr("disabled");
            }

            
            $('#cutting-equals-result-element-width').text( result.width);
            $('#cutting-equals-result-element-height').text( result.height);

            DOMINION.equalparts.drawPreview($('.cutting-equals-preview-wrapper'), grid, cut_lines, result);

            var elements_count = (cut_lines.vertical_count + 1) * (cut_lines.horizontal_count + 1);
            $('#cutting-equals-result-elements-count').text(elements_count);
        };

        // premaded inits
        $('.icon-cutting-equals').click( function(event) {
            event.preventDefault();

            var grid = {
                width: parseInt($('[name="grid-width"]').val()),
                height: parseInt($('[name="grid-height"]').val()),
                min_element_size: parseInt($('#cutting-setting-min-element-size').val()),
                scale: $scale,
                zoom: $zoom
            };

            var cut_lines = {
                vertical_count: parseInt($(this).data('cut-lines-vertical-count')),
                horizontal_count: parseInt($(this).data('cut-lines-horizontal-count')),
                size_mm: parseInt($('#cutting-setting-cut-line-width').val())
            };

            var result = DOMINION.equalparts.init(grid, cut_lines);

            console.log('grid');
            console.log(grid);
            console.log('cut_lines');
            console.log(cut_lines);
            console.log('element');
            console.log(result);

            populateCuttingEqualsModal(grid, cut_lines, result);

            $("#cutting-modal-cutting-equals").dialog('open');

        });
        
        // + and - buttons
        $('.cutting-equals-preview-action-vertical-plus').click( function(event) {
            event.preventDefault();
            var current_val = parseInt( $('.cutting-equals-preview-action-vertical-value').val() );
            $('.cutting-equals-preview-action-vertical-value').val(current_val + 1);

            var grid = {
                width: parseInt($('[name="grid-width"]').val()),
                height: parseInt($('[name="grid-height"]').val()),
                min_element_size: parseInt($('#cutting-setting-min-element-size').val()),
                scale: $scale,
                zoom: $zoom
            };

            var cut_lines = {
                vertical_count: parseInt( $('.cutting-equals-preview-action-vertical-value').val() ),
                horizontal_count: parseInt( $('.cutting-equals-preview-action-horizontal-value').val() ),
                size_mm: parseInt($('#cutting-setting-cut-line-width').val())
            };

            var result = DOMINION.equalparts.init(grid, cut_lines);
            
            //redraw
            populateCuttingEqualsModal(grid, cut_lines, result);

            //disable button if needed
            var check_cutlines = {
                vertical_count: cut_lines.vertical_count+1,
                horizontal_count : cut_lines.horizontal_count,
                size_mm: cut_lines.size_mm
            }
            var check_result = DOMINION.equalparts.calculateElementSize('width', grid, check_cutlines);
            if ( check_result == -1) {
                $(this).attr('disabled', 'disabled');
            }
            else {
                $(this).removeAttr("disabled");
            }

        });

        $('.cutting-equals-preview-action-vertical-minus').click( function(event) {
            event.preventDefault();
            var current_val = parseInt( $('.cutting-equals-preview-action-vertical-value').val() );
            $('.cutting-equals-preview-action-vertical-value').val(current_val - 1);

            var grid = {
                width: parseInt($('[name="grid-width"]').val()),
                height: parseInt($('[name="grid-height"]').val()),
                min_element_size: parseInt($('#cutting-setting-min-element-size').val()),
                scale: $scale,
                zoom: $zoom
            };

            var cut_lines = {
                vertical_count: parseInt( $('.cutting-equals-preview-action-vertical-value').val() ),
                horizontal_count: parseInt( $('.cutting-equals-preview-action-horizontal-value').val() ),
                size_mm: parseInt($('#cutting-setting-cut-line-width').val())
            };

            var result = DOMINION.equalparts.init(grid, cut_lines);
            
            //redraw
            $('.cutting-equals-preview-action-vertical-plus').removeAttr("disabled");
            populateCuttingEqualsModal(grid, cut_lines, result);

        });

        $('.cutting-equals-preview-action-horizontal-plus').click( function(event) {
            event.preventDefault();
            var current_val = parseInt( $('.cutting-equals-preview-action-horizontal-value').val() );
            $('.cutting-equals-preview-action-horizontal-value').val(current_val + 1);

            var grid = {
                width: parseInt($('[name="grid-width"]').val()),
                height: parseInt($('[name="grid-height"]').val()),
                min_element_size: parseInt($('#cutting-setting-min-element-size').val()),
                scale: $scale,
                zoom: $zoom
            };

            var cut_lines = {
                vertical_count: parseInt( $('.cutting-equals-preview-action-vertical-value').val() ),
                horizontal_count: parseInt( $('.cutting-equals-preview-action-horizontal-value').val() ),
                size_mm: parseInt($('#cutting-setting-cut-line-width').val())
            };

            var result = DOMINION.equalparts.init(grid, cut_lines);
            
            //redraw
            populateCuttingEqualsModal(grid, cut_lines, result);

            //disable button if needed
            var check_cutlines = {
                vertical_count: cut_lines.vertical_count,
                horizontal_count : cut_lines.horizontal_count+1,
                size_mm: cut_lines.size_mm
            }
            var check_result = DOMINION.equalparts.calculateElementSize('height', grid, check_cutlines);
            if ( check_result == -1) {
                $(this).attr('disabled', 'disabled');
            }
            else {
                $(this).removeAttr("disabled");
            }

        });

        $('.cutting-equals-preview-action-horizontal-minus').click( function(event) {
            event.preventDefault();
            var current_val = parseInt( $('.cutting-equals-preview-action-horizontal-value').val() );
            $('.cutting-equals-preview-action-horizontal-value').val(current_val - 1);

            var grid = {
                width: parseInt($('[name="grid-width"]').val()),
                height: parseInt($('[name="grid-height"]').val()),
                min_element_size: parseInt($('#cutting-setting-min-element-size').val()),
                scale: $scale,
                zoom: $zoom
            };

            var cut_lines = {
                vertical_count: parseInt( $('.cutting-equals-preview-action-vertical-value').val() ),
                horizontal_count: parseInt( $('.cutting-equals-preview-action-horizontal-value').val() ),
                size_mm: parseInt($('#cutting-setting-cut-line-width').val())
            };

            var result = DOMINION.equalparts.init(grid, cut_lines);
            
            //redraw
            $('.cutting-equals-preview-action-horizontal-plus').removeAttr("disabled");
            populateCuttingEqualsModal(grid, cut_lines, result);

        });

        //draw on plate
        $('#cutting-equals-apply').click( function(event) {
            event.preventDefault();

            var last_item_number = $('#item-list .group').length > 0 ? (parseInt($('#item-list .group').last().find('.num').text()) + 1) : 1;
            var list_count_to_add = parseInt($('#cutting-equals-plates-count').val());
            $gridWidth = parseInt($('[name="grid-width"]').val()),
            $gridHeight = parseInt($('[name="grid-height"]').val());

            var grid = {
                width: parseInt($('[name="grid-width"]').val()),
                height: parseInt($('[name="grid-height"]').val()),
                min_element_size: parseInt($('#cutting-setting-min-element-size').val()),
                scale: $scale,
                zoom: $zoom
            };

            var cut_lines = {
                vertical_count: parseInt($('.cutting-equals-preview-action-vertical-value').val()),
                horizontal_count: parseInt($('.cutting-equals-preview-action-horizontal-value').val()),
                size_mm: parseInt($('#cutting-setting-cut-line-width').val())
            };

            var result = DOMINION.equalparts.init(grid, cut_lines);
            var param = {
                scale: $scale,
                zoom: $zoom,

            };

            var obj = {
                w: result.width,
                h: result.height,
                num: last_item_number,
            };

            var $item = $('<div class="test-cut-line"></div>');
            $('.grid').last().append($item);
            actual_cut_line_width = Math.ceil(cut_lines.size_mm * param.scale * param.zoom);
            $('.test-cut-line').remove();

            for (var i = 0; i < list_count_to_add; i++) {
                if ( $('.grid').last().find('.grid-item').length != 0) {
                     addGrid($gridWidth, $gridHeight, true);
                }
                if ( $('.grid').length == 1 && $('.grid').last().find('.grid-item').length == 0) {
                    $('.grid').last().data('calculate', 'manual');
                } 

                 var current_list_num = $('.grid').last().index() + 1;
                 var groups = $('#item-list .groups').filter( ':last' );
                 var groups_last_num = $('#item-list .groups').filter( ':last' ).prev().text().replace('Лист ', '');

                if ( groups_last_num != current_list_num ) {
                     $('#item-list .list-title').removeClass("active");
                     $("#item-list").append('<div class="list-title open active"><span class="list-title-arrow"></span>Лист ' + current_list_num + '</div><div class="groups"></div>');
                     groups = $('#item-list .groups').filter( ':last' );
                }
                
                groups.data('calculate', 'manual');
                groups.prev().data('calculate', 'manual');
                groups.prev().addClass('list-manual');

                 var height_offset = 0;
                 for (var j = 0; j < cut_lines.horizontal_count + 1; j++) {
                    var width_offset = 0;

                    for (var k = 0; k < cut_lines.vertical_count + 1; k++) {
                        var draw_data = DOMINION.drawObj($('.grid').last(), param, obj, width_offset, height_offset, actual_cut_line_width, 0, false, 0);
                        
                        $listItem = '<div class="group"><span class="num">'+ obj.num +'</span>\
                                <label>A:</label> <input type="text" class="form-control" name="grid-item-width" value="'+obj.w+'" disabled/>\
                                <label>B:</label> <input type="text" class="form-control" name="grid-item-height" value="'+obj.h+'" disabled/>\
                                <a href="javascript:void(0)" class="remove icon-item-remove" title="Удалить элемент"></a></div>';
                        groups.append($listItem);

                        //horizontal cut line
                        if ( j < cut_lines.horizontal_count ) { 
                            var $item = $('<div class="cut-line"></div>');
                            $('.grid').last().append($item);
                            $item.css({
                                'position': 'absolute',
                                'top': height_offset + Math.ceil(obj.h * param.scale * param.zoom),
                                'left': width_offset,
                                'width': Math.ceil(obj.w * param.scale * param.zoom),
                                'height': actual_cut_line_width,
                                'z-index': 1
                             });
                        }

                        obj.num++;
                        width_offset = draw_data.w + actual_cut_line_width;

                    };
                    height_offset += (Math.ceil(obj.h * param.scale * param.zoom) + actual_cut_line_width);
                }

                //vertical main cut line
                var main_vertical_cut_line_left_offset = Math.ceil(obj.w * param.scale * param.zoom);

                for (var k = 0; k < cut_lines.vertical_count; k++) {
                    var $item = $('<div class="cut-line"></div>');
                    $('.grid').last().append($item);
                    $item.css({
                        'position': 'absolute',
                        'top': 0,
                        'left': main_vertical_cut_line_left_offset,
                        'width': actual_cut_line_width,
                        'height': Math.ceil(grid.height * param.scale * param.zoom),
                        'z-index': 1
                     });
                    main_vertical_cut_line_left_offset += Math.ceil(obj.w * param.scale * param.zoom) + actual_cut_line_width;
                }

            };

            $('#cutting-manual').prop('checked', true);
            $actual_cut_line_width = actual_cut_line_width;
            $meter_cost = parseFloat( $('#cutting-setting-meter-cost').val() );
            $('#cutting-meter-cost').text($meter_cost);

            recalculateCutLinesMetrics();

            $("#cutting-modal-cutting-equals").dialog('close');
        });

    });
    // END ADD EQUALS    

});