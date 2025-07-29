$(document).ready(function () {



    function refresh_compare_flags() {
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: '/ajax/catalog.php',
            data: {action: 'refresh_topline_data'},
            success: function (data) {
                var elm;
                var tov_id;
                console.log(data, data.IS_OK);
                if (data.IS_OK == "Y") {
                    //обновить метки на товарах из избранного
                    $('.js_togle_favorite').removeClass('active');
                    $('.js_togle_favorite').each(function (i, e) {
                        tov_id = $(this).data('id');
                        if (data.arFavoritesList.indexOf(tov_id) != -1)
                            $(this).addClass('active');
                    });
                    //обновить метки в шапке
                    if (data.arFavoritesList.length > 0) {
                        $('#js_top_favorites').text(data.arFavoritesList.length);
                    }
                    
                    
                    //обновить метки на товарах из сравнения
                    $('.js_togle_compare').removeClass('active');
                    $('.js_togle_compare').each(function (i, e) {
                        tov_id = $(this).data('id');
                        if (data.arCompareList.indexOf(tov_id) != -1)
                            $(this).addClass('active');
                    });
                    //обновить метки в шапке
                    if (data.arCompareList.length > 0) {
                        $('#js_top_compare').text(data.arCompareList.length);
                    }
                    
                    
                    /*
                    $('.basket_area .ico3').empty();
                    if (data.arBasket.length > 0) {
                        $('.basket_area .ico3').append('<span>' + data.arBasket.length + '</span>');
                    }
                    
                    //карточка товара
                    if ($('.tovar-cart').length>0) {
                        $('.bottom-t').removeClass('active');
                        var tov_id = $('.tovar-cart').data('tov_id');
                        if (data.arFavoritesList.indexOf(tov_id) != -1) {
                            $('.bottom-t-left').addClass('active');
                            $('.bottom-t-left span').text('В отложенном');
                        } else {
                            $('.bottom-t-left span').text('Отложить');
                        }
                        if (data.arCompareList.indexOf(tov_id) != -1) {
                            $('.bottom-t-right').addClass('active');
                            $('.bottom-t-right span').text('В сравнении');
                        } else {
                            $('.bottom-t-right span').text('Сравнить');
                        }
                        //console.log(tov_id);
                        if (data.arBasket.indexOf(tov_id) != -1) {
                            //console.log('incart');
                            $('#btn_add2cart').text('В корзине');
                        } else {
                            $('#btn_add2cart').text('В корзину');
                        }
                    }
                    */


                } else {
                    alert('Error when ajax :: refresh_compare_flags');
                }
            }
        });
    }

    refresh_compare_flags();


    //добавить/удалить в сравнение
    $('.js_togle_compare').click(function (e) {
        e.preventDefault();
        var t = $(this);
        var action = (!t.hasClass('active')) ? 'ADD_TO_COMPARE_LIST' : 'DELETE_FROM_COMPARE_LIST';
        var tov_id = t.data('id');
        if (t.hasClass('active')) {
            if (t.hasClass("tooltipstered")) 
                t.tooltipster('destroy')
        } else {
					
						console.log('comparison_click_button');
						window.dataLayer = window.dataLayer || [];
						dataLayer.push({  
							'event' : 'comparison_click_button'
						});

            t.tooltipster({
                theme: 'tooltipster-light',
                animationDuration: 300,
                delay: 100,
                interactive: false,
                maxWidth: 250,
                trigger: 'click',
                side: 'bottom',
                timer: 1000,
                content: t.data('title')
            });
            t.tooltipster('open')
        }
        t.toggleClass('active');
        console.log(tov_id, action);
        $.ajax({
            type: 'POST',
            url: '/ajax/compare.php',
            data: {id: tov_id, action: action},
            success: function (arRes) {
                refresh_compare_flags();
            }
        });
        return false;        
    });
    
    



    //добавить/удалить в избранное
    $('.js_togle_favorite').on('click', function (e) {
        e.preventDefault();
        var t = $(this);
        var action = (!$(this).hasClass('active')) ? 'add' : 'del';
        var tov_id = $(this).data('id');
        if (t.hasClass('active')) {
            if (t.hasClass("tooltipstered")) 
                t.tooltipster('destroy')
        } else {
            t.tooltipster({
                theme: 'tooltipster-light',
                animationDuration: 300,
                delay: 100,
                interactive: false,
                maxWidth: 250,
                trigger: 'click',
                side: 'bottom',
                timer: 1000,
                content: t.data('title')
            });
            t.tooltipster('open')
        }
        t.toggleClass('active');
        console.log(tov_id, action);
        $.ajax({
            type: 'POST',
            url: '/ajax/catalog.php',
            data: {action: 'update_favorites_list', fav_action: action, id: tov_id},
            success: function (arRes) {
                refresh_compare_flags();
            }
        });
        return false;
    });        
    
    
    //удалить из избранного (в разделе /favorites/ )
    $('.js_del_favorite').click(function (e) {
        e.preventDefault();
        var $this = $(this);
        var action = 'del';
        var tov_id = $this.data('id');
        console.log(tov_id, action);
        $.ajax({
            type: 'POST',
            url: '/ajax/catalog.php',
            data: {action: 'update_favorites_list', fav_action: action, id: tov_id},
            success: function (arRes) {
                var elms = $('.items-col[data-tovid="'+tov_id+'"]')
                elms.addClass('del');
                setTimeout(function () {
                    elms.remove();
                    var num = $('#favorites-tab-all .items-col').length;
                    //удалить опустевшие разделы
                    $('#favorites-tabs .tab-block').each(function(i,e){
                        var n = $(this).find('.items-col').length;
                        if (n<=0) {
                            $(this).remove();
                            $('#favorites-tabs-nav li').eq(i).remove();
                            $('#favorites-tabs-nav li').eq(0).find('a').click();
                        }
                    });
                    if (num < 1)
                        window.location.reload(true);
                    refresh_compare_flags();
                }, 400);
                return false;
            }
        });
    });


/*
// item-del 
$(document).on('click', '.item-del', function () {
  var col = $(this).closest('.items-col');
  col.addClass('del');
  setTimeout(function () {
    col.remove();
  }, 400);
  return false;
});
*/




    /* compare */
    setCompareHeight();
    $('.compare-slider').each(function () {
        var t_slider = $(this);
        t_slider.slick({
            accessibility: false,
            prevArrow: prevSliderArrow,
            nextArrow: nextSliderArrow,
            speed: 400,
            slidesToShow: 5,
            appendArrows: t_slider.closest('.compare-slider-wrapp'),
            infinite: false,
            swipeToSlide: true,
            responsive: [{
                    breakpoint: 1199,
                    settings: {
                        slidesToShow: 4
                    }
                }, {
                    breakpoint: 1023,
                    settings: {
                        slidesToShow: 3
                    }
                }, {
                    breakpoint: 767,
                    settings: {
                        slidesToShow: 2
                    }
                }, {
                    breakpoint: 479,
                    settings: {
                        slidesToShow: 1
                    }
                }]
        });
    });        
    
    
        //удалить из сравнения (в разделе /compare/ )
        $(document).on('click', '.compare-item-del', function (e) {
            e.preventDefault();
            var tov_id = $(this).data('id');
            $.ajax({
                type: 'POST',
                url: '/ajax/compare.php',
                data: {action: 'DELETE_FROM_COMPARE_LIST', id: tov_id},
                success: function (arRes) {
                    var elms = $('.compare-item[data-tovid="'+tov_id+'"]')
                    //запуск анимации удаленя слайда
                    elms.each(function(i,e){
                        var slide = $(this).closest('.compare-slide');
                        slide.addClass('del');
                    });
                    
                    setTimeout(function () {
                        //удаление товара из всех вкладок
                        elms.each(function(i,e){
                            var prn = $(this).closest('.tab-block');
                            var slide = $(this).closest('.compare-slide');
                            var slider = $(this).closest('.compare-slider');
                            slider.slick('slickRemove', slide.data('slick-index'));
                            
                            var n = prn.find('.compare-slide').length;
                            if (n<=0) {
                                var secid = prn.data('secid');
                                $('.tab-block[data-secid="'+secid+'"]').remove();
                                $('#compare-tabs-nav li[data-secid="'+secid+'"]').remove();
                                $('#compare-tabs-nav li').eq(0).find('a').click();
                            }
                            
                        });
                        setCompareHeight();
                        
                        var num = $('.compare-slide').length;
                        if (num < 1)
                            window.location.reload(true);
                        refresh_compare_flags();
                    }, 400);
                    return false;
                }
            });            
            
            return false;
        });
        


    $(document).on('click', '.compare-del-all', function () {
        $.ajax({
            type: 'POST',
            url: '/ajax/catalog.php',
            data: {action: 'delete_all_compare'},
            success: function (arRes) {
                location.reload();
            }
        });
        return false;
    });


        
        
        
        

    /*
     $(document).on('change', '.compare-radio', function () {
     var t = $(this);
     var value = t.val();
     
     if (value === 'all') {
     t.closest('.compare').find('.compare-list>li').removeClass('hidden');
     setCompareHeight();
     return;
     }
     
     var props = {};
     t.closest('.compare').find('.compare-sidebar .compare-list>li:not(:first-child)').each(function () {
     props[$(this).text().trim()] = [];
     });
     t.closest('.compare').find('.compare-body .compare-list>li:not(:first-child)').each(function () {
     var li = $(this);
     var index = li.index() + 1;
     var name = t.closest('.compare').find('.compare-sidebar .compare-list>li:nth-child(' + index + ')').text().trim();
     props[name].push(li.text().trim());
     });
     Object.keys(props).forEach(function (el, index) {
     var array = props[el];
     var value = array[0];
     isSame = array.every(function (elem) {
     return elem == value;
     });
     
     if (isSame) {
     t.closest('.compare').find('.compare-list>li:nth-child(' + (index + 2) + ')').addClass('hidden');
     }
     });
     });
     */

    $(window).on('resize', setCompareHeight);

    function setCompareHeight() {
        $('.compare').removeClass('load');
        $('.compare-list>li').css('height', 'auto');
        $('.compare').each(function () {
            var t = $(this);

            for (var i = 1; i < t.find('.compare-list>li').length; i++) {
                var height = 0;
                t.find('.compare-list>li:nth-child(' + i + ')').each(function () {
                    var liHeight = $(this).innerHeight();
                    if (liHeight > height)
                        height = liHeight;
                });
                t.find('.compare-list>li:nth-child(' + i + ')').css('height', height + 'px');
            }
        });
        $('.compare').addClass('load');
    }
    ;






});