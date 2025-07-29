$( document ).ready(function() {
	let tabs = $('.product-tabs');
	let tabsNav = tabs.find('.product-tabs-nav');
	let tabsNavEl = tabsNav.find('li');

	tabsNavEl.each(function(index) {
    //console.log($(this).attr('target') + ' ' + index);
	});

	tabsNavEl.eq(0).addClass('current');


	let tabsContent = tabs.find('.product-tabs-content');
	let tabsContentEl = tabsContent.find('section');
	tabsContentEl.each(function(index) {
    //console.log($(this).attr('tabname') + ' ' + index);
	});

	tabsContentEl.eq(0).addClass('current');


	tabsNavEl.on('click', function() {
		if(!$(this).hasClass('current')){
			tabsNavEl.removeClass('current');
			$(this).addClass('current');
			tabsContentEl.removeClass('current');
			var target = $(this).attr('target');
			tabsContentEl.filter('[tabname="' + target + '"]').addClass('current');
			//$(window).trigger('resize');
			//$('.items-slider').slick('refresh');
			setTimeout(function() { 
			//$('.slick-slider').slick('refresh');
			//$(window).trigger('resize');
			}, 512);
		}
	});

let tabsContentTrigger = tabs.find('.product-tabs-content .tab-trigger button');

let moreLink = $('.product-info-more-link');

let analogs = $('.product-analog-btn');

		tabsContentTrigger.on('click', function() {
		if(!$(this).closest('section').hasClass('current')){
			$('.product-tabs-content section').removeClass('current');
			$(this).closest('section').addClass('current');
			tabsNavEl.removeClass('current');


			var tabname = $(this).closest('section').attr('tabname');
			tabsNavEl.filter('[target="' + tabname + '"]').addClass('current');
				$('.items-slider').slick('refresh');
			setTimeout(function() { 
			//$('.slick-slider').slick('refresh');
			//$(window).trigger('resize');
			}, 512);
			var offset = $(this).offset();
				if ($(window).width() < 768) {
				$('html, body').animate({
				scrollTop: offset.top - 160,
				});
				}
		}
	});

		moreLink.on('click', function() {
				tabsNavEl.removeClass('current');
				tabsContentEl.removeClass('current');
				tabsNavEl.filter('[target="description"]').addClass('current');
				tabsContentEl.filter('[tabname="description"]').addClass('current');

				var offset = $('#product-specifications').offset()
				console.log(offset)
				if ($(window).width() < 768) {
				$('html, body').animate({
				scrollTop: offset.top - 80,
				});
				}
				else{$('html, body').animate({
				scrollTop: offset.top - 160,
				});}

		});


		analogs.on('click', function() {
				tabsNavEl.removeClass('current');
				tabsContentEl.removeClass('current');
				tabsNavEl.filter('[target="analogs"]').addClass('current');
				tabsContentEl.filter('[tabname="analogs"]').addClass('current');

				var offset = $('#analogs').offset()
				console.log(offset)
				if ($(window).width() < 768) {
				$('html, body').animate({
				scrollTop: offset.top - 180,
				});
				}
				else{$('html, body').animate({
				scrollTop: offset.top - 240,
				});}
				$('.items-slider').slick('refresh');
			setTimeout(function() { 
			//$('.slick-slider').slick('refresh');
			//$(window).trigger('resize');
			}, 512);


		});

});


                    	$(document).ready(function(){
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
					      	appendDots: $('.techvideosmain').find('.items-slider-dots')
					      }
					    }
				    ]
	    });
	    
	    $('.techphotos').slick({
					arrows: false,
					responsive: [
			    		{
				            breakpoint: 9999,
				            settings: "unslick"
				        },
					    {
					      breakpoint: 768,
					      settings: {
					      	slidesToShow: 2,
    						slidesToScroll: 1,
					      	arrows: false,
					      	dots: true,
					      	appendDots: $('.techphotosmain').find('.items-slider-dots')
					      }
					    },
					    {
					      breakpoint: 550,
					      settings: {
					      	slidesToShow: 1,
    						slidesToScroll: 1,
					      	arrows: false,
					      	dots: true,
					      	appendDots: $('.techphotosmain').find('.items-slider-dots')
					      }
					    }
				    ]
			  	});
	    
	    		if ($(window).width() <= 768) {
	    			//console.log($('.opisanieblocks .avText').height());
					
					//var lineHeight = (($('.opisanieblocks .descmore').height())/$(document).width())*100;
					//console.log(((lineHeight*6)*$(document).width())/100);
					
					/*if($('.opisanieblocks .avText').height() > ((lineHeight*6)*$(document).width())/100){
						$('.opisanieblocks .descmore').show();
					}*/
					$('.opisanieblocks .avText').css({'overflow':'hidden', 'max-height': '100px'});
					
					$('.opisanieblocks .descmore').click(function(){
						if($(this).text() == 'Показать всё'){
							$('.opisanieblocks .avText').css({'overflow':'unset', 'max-height': '100%'});
							$(this).text('Свернуть');
						}else if($(this).text() == 'Свернуть'){
							$('.opisanieblocks .avText').css({'overflow':'hidden', 'max-height': '100px'});
							$(this).text('Показать всё');
						}
						
					});
				}
				
				
                    	})