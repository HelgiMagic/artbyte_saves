<? require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
$APPLICATION->SetPageProperty("keywords", "контакты");
$APPLICATION->SetPageProperty("description", "Контакты интернет-магазина. Звонки принимаются до 18:30.");
$APPLICATION->SetTitle("Контакты интернет-магазина Polymax: где купить листовой пластик в СПб "); ?><div class="main-content">
	<div class="container">
		<div class="row">
			 <?$APPLICATION->IncludeComponent(
	"bitrix:breadcrumb",
	"plmx_breadcrumbs_new",
	Array(
		"PATH" => "",
		"SITE_ID" => "s1",
		"START_FROM" => "0"
	)
);?>
		</div>
	</div>
	<div itemscope="" itemtype="http://schema.org/LocalBusiness">
 <span style="display:none" itemprop="openingHours" datetime="Tu-Fr 09:00−18:00"><strong>Офис:</strong> Пн-Пт: с 9:00 до 18:00;&nbsp;Сб, Вс: ВЫХОДНОЙ</span> <br>
 <span style="display:none" itemprop="openingHours" datetime="Tu-Fr 09:30−17:30"><strong>Склад:</strong> Пн-Пт: с 9:30 до 17:30;&nbsp;Сб, Вс: ВЫХОДНОЙ</span>
		<div class="section-heading">
			<div class="container">
				<div class="row">
					<div class="col-12">
						<h1>Контакты <span itemprop="name">Полимакс</span></h1>
					</div>
				</div>
			</div>
		</div>
 <section class="stock active addres_list" data-entity="town" data-town="spb">
		<div class="container">
			<div class="row owl-carousel">
				<div class="col-6 col-sm-12 owl-item-child" itemprop="address" itemscope="" itemtype="http://schema.org/PostalAddress">
					<div class="stock-item active" data-entity="map-switch" data-first="true" data-map="spb-office">
						<h3 itemprop="name"> Санкт-Петербург</h3>
						<div class="row">
							<div class="stock-item__info">
								<div class="col-6">
									<h4>Адрес</h4>
 <span itemprop="addressLocality">192241, Санкт-Петербург</span>, <span itemprop="streetAddress">пр-т Александровской фермы, д. 29 литера С, 3 этаж, 301 офис</span>
								</div>
								<div class="col-6">
									<h4>Электронная почта</h4>
 <span itemprop="email"><a href="mailto:spb@poly-max.com">spb@poly-max.com</a> </span>
								</div>
								<div class="col-6">
									<h4>График работы</h4>
 <span><strong>Офис:</strong> Пн-Пт: с 9:00 до 18:00;&nbsp;</span>Сб c 9:00 до 16:00<br>
 <span><strong>Склад:</strong> Пн-Пт: с 9:30 до 17:30;&nbsp;</span>Сб c 9:00 до 16:00
								</div>
								<div class="col-6">
									<h4>Контактные телефоны</h4>
 <strong class="poly-max_call_phone_3" itemprop="telephone">+7 (812) 565-38-92</strong>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="col-6 col-sm-12 owl-item-child" itemprop="address" itemscope="" itemtype="http://schema.org/PostalAddress">
					<div class="stock-item" data-entity="map-switch" data-map="yar-stock">
						<h3 itemprop="name">Ярославль</h3>
						<div class="row">
							<div class="stock-item__info">
								<div class="col-6">
									<h4>Адрес</h4>
 <span itemprop="addressLocality">150042, Ярославль</span>, <span itemprop="streetAddress">Промышленная 22</span>
								</div>
								<div class="col-6">
									<h4>Электронная почта</h4>
 <span itemprop="email"><a href="mailto:yar@poly-max.com">yar@poly-max.com</a> </span>
								</div>
								<div class="col-6">
									<h4>График работы</h4>
 <span><strong>Офис:</strong> Пн-Пт: с 9:00 до 18:00;&nbsp;</span>Сб c 9:00 до 16:00<br>
 <span><strong>Склад:</strong> Пн-Пт: с 9:30 до 17:30;&nbsp;</span>Сб c 9:00 до 16:00
								</div>
								<div class="col-6">
									<h4>Контактные телефоны</h4>
 <strong class="poly-max_call_phone_4" itemprop="telephone">+7 (4852) 38-87-69</strong>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
 </section> <section class="delivery-map">
		<div class="delivery-map__map active" data-entity="town-map" data-map="spb-office" id="spb-office">
			 <script type="text/javascript" charset="utf-8" async src="https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3A2425588d283ffd2dfe446c607b9cdf87b8cec538d575378cf562738c5f0bacd9&amp;width=100%25&amp;height=600&amp;id=spb-office&amp;lang=ru_RU&amp;scroll=false">
				</script>
		</div>
		<div class="delivery-map__map" data-entity="town-map" id="yar-stock" data-map="yar-stock">
			 <script type="text/javascript" charset="utf-8" async src="https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3A7410e84098fbb8b1e15d66b1594621a2c8a538f13777f74c881f69f024d77bf3&amp;width=100%25&amp;height=600&amp;id=yar-stock&amp;lang=ru_RU&amp;scroll=false"></script>
		</div>
 </section>
		<div>
			 <script>
			$(document).ready(function () {
				var townSwitch = $('[data-entity="town-switch"]'),
					town = $('[data-entity="town"]'),
					townMap = $('[data-entity="town-map"]'),
					mapSwitch = $('[data-entity="map-switch"]');

				// Town switch listener
				townSwitch.on('click', function (e) {
					e.preventDefault();
					var selected = $(this),
						dataTown = selected.attr('data-town');
					if (selected.hasClass('active') == false) {
						// Remove "active" class from all elements
						townSwitch.removeClass('active');
						town.removeClass('active');
						// Add "active" class to a current element
						selected.addClass('active');
						$('[data-town="' + dataTown + '"]').addClass('active');
						$('[data-entity="map-switch"][data-first="true"]').click();
					}
				});

				// Map switch listener
				mapSwitch.on('click', function (e) {
					e.preventDefault();
					var selected = $(this),
						dataMap = selected.attr('data-map');
					if (selected.hasClass('active') == false) {
						// Remove "active" class from all elements
						mapSwitch.removeClass('active');
						townMap.removeClass('active');
						// Add "active" class to a current element
						selected.addClass('active');
						$('[data-map="' + dataMap + '"]').addClass('active');
					}
				});

			});
		</script>
		</div>
	</div>
</div>
 <br><? require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php"); ?>