<? require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
$APPLICATION->SetPageProperty("title", "Раскрой листов онлайн. Калькулятор раскроя листов");
$APPLICATION->SetPageProperty("keywords", "калькулятор раскроя листов");
$APPLICATION->SetPageProperty("description", "Раскрой листа онлайн (поликарбонат, оргстекло). Калькулятор резки листовых материалов");
$APPLICATION->SetTitle("Калькулятор раскроя листов");

use Bitrix\Main\Page\Asset;
Asset::getInstance()->addCss("/cutting-calculator/style.css", true);


?>

<

<script
  src="/cutting-calculator/packery.js"
></script>
<script
  src="/cutting-calculator/draggabilly.pkgd.min.js"
></script>

<script
  src="/cutting-calculator/FileSaver.min.js"
></script>
<script
  src="/cutting-calculator/jszip.min.js"
></script>
<script
  src="/cutting-calculator/html2canvas.js"
></script>
<script src="/cutting-calculator/jspdf.js"></script>
<script
  src="/local/templates/polymax_copy/assets/img/cutting-calculator/pdf/Panton-normal.js"
></script>
<script
  src="/local/templates/polymax_copy/assets/img/cutting-calculator/pdf/Panton-400-normal.js"
></script>
<script
  src="/cutting-calculator/script.js"
></script>

<div class="cutting-calculator__wrapper">
	<div class="cutting-calculator__panel">
        <div class="cutting-calculator__panel__heading">
            Выберите тип материала
        </div>
        <div class="cutting-calculator__panel__options">        
            <div class="cutting-row" id="material">
                Материал
                <div class="cutting-dropdown">
                    <button class="dropdown-btn">Выберите материал</button>
                    <div class="dropdown-content">
                        <div class="dropdown-variant">Сотовый поликарбонат</div>
                        <div class="dropdown-variant">Монолитный поликарбонат</div>
                        <div class="dropdown-variant">Оргстекло</div>
                        <div class="dropdown-variant">Другое</div>
                    </div>
                </div>
            </div>

            <div id="size">
                <div class="cutting-row" id="size-row">
                    Размер, мм
                    <div class="cutting-dropdown">
                        <button class="dropdown-btn">Выберите размер</button>
                        <div class="dropdown-content">
                            <div class="dropdown-variant">2050x3050</div>
                            <div class="dropdown-variant">2050x1525</div>
                        </div>
                    </div>
                </div>

                <div class="cutting-inputs d-none">
                    <input class="cutting-input" type="number" value="1000">

                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.364 4.95 11.314 0l1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95L0 11.314l4.95-4.95L0 1.414 1.414 0z" fill="#999"/></svg>

                    <input class="cutting-input" type="number" value="1000">
                </div>
            </div>


            <div class="cutting-row" id="method">
                Метод раскроя
                <div class="cutting-dropdown">
                    <button class="dropdown-btn">Выберите метод</button>
                    <div class="dropdown-content">
                        <div>
                            <div class="dropdown-variant">По длине листа</div>
                            <div class="tooltip"><img src="/local/templates/polymax_copy/assets/img/cutting-calculator/po_dline.svg" alt=""></div>
                        </div>
                        <div>
                            <div class="dropdown-variant">По ширине листа</div>
                            <div class="tooltip"><img src="/local/templates/polymax_copy/assets/img/cutting-calculator/po_shirine.svg" alt=""></div>
                        </div>
                        <div>
                            <div class="dropdown-variant">Оптимально</div>
                            <div class="tooltip"><img src="/local/templates/polymax_copy/assets/img/cutting-calculator/po_optimalno.svg" alt=""></div>
                        </div>
                        <div>
                            <div class="dropdown-variant">Разрезать на 2 части</div>
                        </div>
                        <div>
                            <div class="dropdown-variant">Разрезать на 4 части</div>
                        </div>
                        <div>
                            <div class="dropdown-variant">Разрезать на 6 частей</div>
                        </div>
                        <div>
                            <div class="dropdown-variant">Разрезать на 8 частей</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="cutting-row" id="cut-width">
                Ширина пропила, мм
                
                <input disabled class="cutting-input medium" type="number" value="3" id="cut-width-input">
            </div>

            <div class="cutting-row d-none" id="thickness-row">
                Толщина листа, мм
                <div class="cutting-dropdown medium">
                    <button class="dropdown-btn">меньше 8 мм</button>
                    <div class="dropdown-content">
                        <div class="dropdown-variant">меньше 8 мм</div>
                        <div class="dropdown-variant">больше 8 мм</div>
                    </div>
                </div>
            </div>

            <div class="cutting-row" id="cut-price">
                Цена за 1 пог. м реза, ₽ 
                
                <input disabled class="cutting-input medium" type="number" id="cut-price-input">
            </div>

            <button onclick="resetState()" class="cutting-calculator__small-button" style="width: 100%; padding: 0; height: 40px; line-height: 16px; margin-top: 15px;">Очистить всё</button>
            <!-- <span class="tooltip" id="add-detail-tooltip">нажмите на кнопку "Добавить деталь", чтобы начать</span> -->
        </div>

        <div class="cutting-calculator__panel__lists-details">
        </div>

        <div class="cutting-calculator__panel__results">
            <div class="results__heading">
                Результаты расчёта
                <button type="button" class="hide-section-mobile">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="m8 10 4 4 4-4" stroke="#B3C535" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
            </div>

            <div class="results__body-wrapper">            
                <div class="results__body"></div>

                <div class="results__footer">
                    <div class="results__body__row">
                        <div class="results__body__row__name">Стоимость реза, ₽</div>
                        <div class="results__body__row__value"></div>
                    </div>
                </div>
            </div>
        </div>
	</div>

    <div class="cutting-calculator__lists-preview">
        <div class="lists-preview__heading">
            Листы
            <button type="button" class="hide-section-mobile">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="m8 10 4 4 4-4" stroke="#B3C535" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
        </div>
        <div class="lists-preview__body"></div>
    </div>

    <div class="cutting-calculator__lists-results">
        <div class="lists-results__heading">Результаты</div>
        <div class="lists-results__body">
            <div class="lists-results__body__heading">Лист 1</div>
            <div class="lists-results__body__wrapper">
                <div class="list-figure"></div>
                <div class="list-results__body__tooltips" style="margin-top: 20px; text-align: center;">
                    <p class="lists-results__body__wrapper__tooltip d-none" id="sotoviy">На рисунке указано горизонтальное расположение сот</p>
                    <p class="lists-results__body__wrapper__tooltip d-none" id="optimalno">При методе раскроя "Оптимально" резка возможна только фрезеровкой</p>
                </div>

                <div class="lists-results__body__zoom">
                    <div class="zoom-symbol zoom-minus">-</div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none"><path d="M10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14m11 4-6.05-6.05" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    <div class="zoom-symbol zoom-plus active">+</div>
                    <div class="zoom-value">100%</div>
                </div>
            </div>
        </div>
        <div class="lists-results__share">
            <button type="button" class="cutting-calculator__button width-auto" onclick="openModalForm('download')">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M7.503 13.002C7.37039 13.002 7.24321 13.0547 7.14945 13.1484C7.05568 13.2422 7.003 13.3694 7.003 13.502V16.502C7.003 16.6346 7.05568 16.7618 7.14945 16.8556C7.24321 16.9493 7.37039 17.002 7.503 17.002C7.63561 17.002 7.76279 16.9493 7.85655 16.8556C7.95032 16.7618 8.003 16.6346 8.003 16.502V16.002H8.5C8.89782 16.002 9.27936 15.844 9.56066 15.5627C9.84196 15.2814 10 14.8998 10 14.502C10 14.1042 9.84196 13.7226 9.56066 13.4413C9.27936 13.16 8.89782 13.002 8.5 13.002H7.503ZM8.5 15.002H8.003V14.002H8.5C8.63261 14.002 8.75979 14.0547 8.85355 14.1484C8.94732 14.2422 9 14.3694 9 14.502C9 14.6346 8.94732 14.7618 8.85355 14.8556C8.75979 14.9493 8.63261 15.002 8.5 15.002ZM14.998 13.502C14.998 13.3694 15.0507 13.2422 15.1444 13.1484C15.2382 13.0547 15.3654 13.002 15.498 13.002H17.003C17.1356 13.002 17.2628 13.0547 17.3566 13.1484C17.4503 13.2422 17.503 13.3694 17.503 13.502C17.503 13.6346 17.4503 13.7618 17.3566 13.8556C17.2628 13.9493 17.1356 14.002 17.003 14.002H15.997L15.996 15.004H17.003C17.1356 15.004 17.2628 15.0567 17.3566 15.1504C17.4503 15.2442 17.503 15.3714 17.503 15.504C17.503 15.6366 17.4503 15.7638 17.3566 15.8576C17.2628 15.9513 17.1356 16.004 17.003 16.004H15.996L15.998 16.501C15.9981 16.5667 15.9853 16.6317 15.9603 16.6924C15.9353 16.7531 15.8986 16.8083 15.8523 16.8548C15.7587 16.9488 15.6316 17.0017 15.499 17.002C15.3664 17.0023 15.2391 16.9498 15.1452 16.8563C15.0512 16.7627 14.9983 16.6356 14.998 16.503L14.995 15.505V15.503L14.998 13.502ZM11.5 13.002C11.3674 13.002 11.2402 13.0547 11.1464 13.1484C11.0527 13.2422 11 13.3694 11 13.502V16.502C11 16.6346 11.0527 16.7618 11.1464 16.8556C11.2402 16.9493 11.3674 17.002 11.5 17.002H11.998C12.5284 17.002 13.0371 16.7913 13.4122 16.4162C13.7873 16.0411 13.998 15.5324 13.998 15.002C13.998 14.4716 13.7873 13.9629 13.4122 13.5878C13.0371 13.2127 12.5284 13.002 11.998 13.002H11.5ZM12 16.002V14.002C12.2652 14.002 12.5196 14.1074 12.7071 14.2949C12.8946 14.4824 13 14.7368 13 15.002C13 15.2672 12.8946 15.5216 12.7071 15.7091C12.5196 15.8966 12.2652 16.002 12 16.002ZM20 20V18.836C20.591 18.555 21 17.952 21 17.254V12.75C21 12.052 20.591 11.45 20 11.168V9.828C19.9999 9.29761 19.7891 8.78899 19.414 8.414L13.585 2.586C13.5695 2.57163 13.5532 2.55827 13.536 2.546C13.5236 2.53645 13.5116 2.52644 13.5 2.516C13.4312 2.45107 13.358 2.39093 13.281 2.336C13.2554 2.31948 13.2287 2.30478 13.201 2.292L13.153 2.268L13.103 2.239C13.049 2.208 12.994 2.176 12.937 2.152C12.7379 2.07246 12.5271 2.02585 12.313 2.014C12.2932 2.01271 12.2735 2.01038 12.254 2.007C12.2269 2.00281 12.1995 2.00047 12.172 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V11.168C3.409 11.449 3 12.052 3 12.75V17.254C3 17.952 3.409 18.554 4 18.836V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20ZM18 20.5H6C5.86739 20.5 5.74021 20.4473 5.64645 20.3536C5.55268 20.2598 5.5 20.1326 5.5 20V19.004H18.5V20C18.5 20.1326 18.4473 20.2598 18.3536 20.3536C18.2598 20.4473 18.1326 20.5 18 20.5ZM18.5 10V11H5.5V4C5.5 3.86739 5.55268 3.74021 5.64645 3.64645C5.74021 3.55268 5.86739 3.5 6 3.5H12V8C12 8.53043 12.2107 9.03914 12.5858 9.41421C12.9609 9.78929 13.4696 10 14 10H18.5ZM17.378 8.5H14C13.8674 8.5 13.7402 8.44732 13.6464 8.35355C13.5527 8.25979 13.5 8.13261 13.5 8V4.621L17.378 8.5ZM4.75 12.5H19.25C19.3163 12.5 19.3799 12.5263 19.4268 12.5732C19.4737 12.6201 19.5 12.6837 19.5 12.75V17.254C19.5 17.3203 19.4737 17.3839 19.4268 17.4308C19.3799 17.4777 19.3163 17.504 19.25 17.504H4.75C4.6837 17.504 4.62011 17.4777 4.57322 17.4308C4.52634 17.3839 4.5 17.3203 4.5 17.254V12.75C4.5 12.6837 4.52634 12.6201 4.57322 12.5732C4.62011 12.5263 4.6837 12.5 4.75 12.5Z" fill="white"/>
                </svg>
                Скачать в PDF
            </button>

            <button type="button" id="pdf-email" class="cutting-calculator__button width-auto" onclick="openModalForm('email')">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M7.503 13.002C7.37039 13.002 7.24321 13.0547 7.14945 13.1484C7.05568 13.2422 7.003 13.3694 7.003 13.502V16.502C7.003 16.6346 7.05568 16.7618 7.14945 16.8556C7.24321 16.9493 7.37039 17.002 7.503 17.002C7.63561 17.002 7.76279 16.9493 7.85655 16.8556C7.95032 16.7618 8.003 16.6346 8.003 16.502V16.002H8.5C8.89782 16.002 9.27936 15.844 9.56066 15.5627C9.84196 15.2814 10 14.8998 10 14.502C10 14.1042 9.84196 13.7226 9.56066 13.4413C9.27936 13.16 8.89782 13.002 8.5 13.002H7.503ZM8.5 15.002H8.003V14.002H8.5C8.63261 14.002 8.75979 14.0547 8.85355 14.1484C8.94732 14.2422 9 14.3694 9 14.502C9 14.6346 8.94732 14.7618 8.85355 14.8556C8.75979 14.9493 8.63261 15.002 8.5 15.002ZM14.998 13.502C14.998 13.3694 15.0507 13.2422 15.1444 13.1484C15.2382 13.0547 15.3654 13.002 15.498 13.002H17.003C17.1356 13.002 17.2628 13.0547 17.3566 13.1484C17.4503 13.2422 17.503 13.3694 17.503 13.502C17.503 13.6346 17.4503 13.7618 17.3566 13.8556C17.2628 13.9493 17.1356 14.002 17.003 14.002H15.997L15.996 15.004H17.003C17.1356 15.004 17.2628 15.0567 17.3566 15.1504C17.4503 15.2442 17.503 15.3714 17.503 15.504C17.503 15.6366 17.4503 15.7638 17.3566 15.8576C17.2628 15.9513 17.1356 16.004 17.003 16.004H15.996L15.998 16.501C15.9981 16.5667 15.9853 16.6317 15.9603 16.6924C15.9353 16.7531 15.8986 16.8083 15.8523 16.8548C15.7587 16.9488 15.6316 17.0017 15.499 17.002C15.3664 17.0023 15.2391 16.9498 15.1452 16.8563C15.0512 16.7627 14.9983 16.6356 14.998 16.503L14.995 15.505V15.503L14.998 13.502ZM11.5 13.002C11.3674 13.002 11.2402 13.0547 11.1464 13.1484C11.0527 13.2422 11 13.3694 11 13.502V16.502C11 16.6346 11.0527 16.7618 11.1464 16.8556C11.2402 16.9493 11.3674 17.002 11.5 17.002H11.998C12.5284 17.002 13.0371 16.7913 13.4122 16.4162C13.7873 16.0411 13.998 15.5324 13.998 15.002C13.998 14.4716 13.7873 13.9629 13.4122 13.5878C13.0371 13.2127 12.5284 13.002 11.998 13.002H11.5ZM12 16.002V14.002C12.2652 14.002 12.5196 14.1074 12.7071 14.2949C12.8946 14.4824 13 14.7368 13 15.002C13 15.2672 12.8946 15.5216 12.7071 15.7091C12.5196 15.8966 12.2652 16.002 12 16.002ZM20 20V18.836C20.591 18.555 21 17.952 21 17.254V12.75C21 12.052 20.591 11.45 20 11.168V9.828C19.9999 9.29761 19.7891 8.78899 19.414 8.414L13.585 2.586C13.5695 2.57163 13.5532 2.55827 13.536 2.546C13.5236 2.53645 13.5116 2.52644 13.5 2.516C13.4312 2.45107 13.358 2.39093 13.281 2.336C13.2554 2.31948 13.2287 2.30478 13.201 2.292L13.153 2.268L13.103 2.239C13.049 2.208 12.994 2.176 12.937 2.152C12.7379 2.07246 12.5271 2.02585 12.313 2.014C12.2932 2.01271 12.2735 2.01038 12.254 2.007C12.2269 2.00281 12.1995 2.00047 12.172 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V11.168C3.409 11.449 3 12.052 3 12.75V17.254C3 17.952 3.409 18.554 4 18.836V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20ZM18 20.5H6C5.86739 20.5 5.74021 20.4473 5.64645 20.3536C5.55268 20.2598 5.5 20.1326 5.5 20V19.004H18.5V20C18.5 20.1326 18.4473 20.2598 18.3536 20.3536C18.2598 20.4473 18.1326 20.5 18 20.5ZM18.5 10V11H5.5V4C5.5 3.86739 5.55268 3.74021 5.64645 3.64645C5.74021 3.55268 5.86739 3.5 6 3.5H12V8C12 8.53043 12.2107 9.03914 12.5858 9.41421C12.9609 9.78929 13.4696 10 14 10H18.5ZM17.378 8.5H14C13.8674 8.5 13.7402 8.44732 13.6464 8.35355C13.5527 8.25979 13.5 8.13261 13.5 8V4.621L17.378 8.5ZM4.75 12.5H19.25C19.3163 12.5 19.3799 12.5263 19.4268 12.5732C19.4737 12.6201 19.5 12.6837 19.5 12.75V17.254C19.5 17.3203 19.4737 17.3839 19.4268 17.4308C19.3799 17.4777 19.3163 17.504 19.25 17.504H4.75C4.6837 17.504 4.62011 17.4777 4.57322 17.4308C4.52634 17.3839 4.5 17.3203 4.5 17.254V12.75C4.5 12.6837 4.52634 12.6201 4.57322 12.5732C4.62011 12.5263 4.6837 12.5 4.75 12.5Z" fill="white"/>
                </svg>
                Отправить на почту PDF
            </button>
        </div>

        <div class="lists-results__additionally">
            <p>* Возможна фрезерная резка под заказ (обращайтесь в отдел продаж)</p>
            <p>* Услуга резки в заданных параметрах возможна при приобретении целого листа</p>
            <p>* Размеры деталей при резке могут иметь погрешность до 1,5 мм</p>
        </div>
<div class="col-12 is_desc text">
	<h1>Калькулятор раскроя листов</h1>
			<p>Эта специализированная услуга востребована в различных отраслях — в строительстве, рекламе, производстве мебели и прочих сферах, где требуется высокоточная резка и обработка листовых материалов. Компания Полимакс выполняет раскрой листа с последующей фрезерной резкой или без нее, детали услуги можно уточнить в отделе продаж.</p>
				<p>К услугам покупателей — удобный калькулятор раскроя, позволяющий выполнить эту высокоточную процедуру в режиме онлайн. Пользователю необходимо выбрать:</p>
<ul>
<li>материал (оргстекло, сотовый или монолитный поликарбонат, ПЭТ-лист и пр.);</li>
<li>размер листа и метод раскроя (по длине или по ширине);</li>
	  <li>размеры и количество деталей.</li>
</ul>
	<p>Сервис предоставит оптимальную схему раскроя (формируется в формате PDF), автоматически рассчитает площадь остатка и стоимость резки.</p>
		<p>Это означает, что у нас можно не только купить необходимые материалы, но также получить при необходимости заготовки, что обеспечивает при дальнейшей работе с приобретенными материалами существенное снижение финансовых затрат.</p>
			<h2>Резка по размерам заказчика</h2>
				<p>Помимо раскроя, в нашей компании вы можете заказать услуги по резке поликарбоната и оргстекла в СПб. Мы используем в работе современное высокотехнологичное оборудование — станок форматно-раскроечный вертикальный, который обладает целым рядом значительных преимуществ:</p>
<ul>
<li>универсальность — работает со всеми видами материалов, что делает станок надежным инструментом для различных задач;</li>
<li>высокую точность реза, что особенно важно для проектов, требующих максимальной аккуратности;</li>
<li>возможность работы с тонкими (менее 60 мм) материалами без потери качества резки;</li>
	  <li>эффективное использование ресурсов за счет минимальных потерь материала.</li>
</ul>
	<p>Материал при такой обработке сохраняет свои технические и эксплуатационные характеристики, края после резки выглядят ровными и аккуратными. К тому же, по сравнению с другими методами, обеспечивается лучший баланс соотношения параметров цена/качество.</p>
		<p>Работы выполняют квалифицированные сотрудники, имеющие необходимые знания и навыки для выполнения задач любой сложности. При этом необходимо обратить внимание на следующие важные моменты:</p>
<ul>
<li>резка листового материала в заданных параметрах возможна исключительно при условии приобретения целого листа;</li>
	  <li>допустимая погрешность размеров деталей не превышает 1,5 мм.</li>
</ul>
	<p>Готовые отрезки аккуратно пакуются для безопасной транспортировки.</p>
		<h2>Целесообразность сотрудничества с нашей компанией</h2>
			<p>Использование современного оборудования позволяет нам предлагать действительно качественную резку:  гарантированное качество заготовок, минимальные потери материала, значительно сокращенный срок выполнения заказов.</p>
				<p>Работа с нами предоставляет множество практических преимуществ, в числе которых:</p>
<ul>
<li>экономия времени и средств — заказывая услуги раскроя, вы экономите время и средства на последующую обработку материалов;</li>
<li>качество и точность — использование современного оборудования и профессионализм наших сотрудников гарантируют высокое качество и точность выполняемых работ;</li>
	  <li>гибкость и индивидуальный подход — мы готовы выполнить резку по вашим индивидуальным размерам и требованиям, обеспечивая наилучшие результаты для ваших проектов.</li>
</ul>
<p>Компания Полимакс — проверенный временем поставщик, находящийся в партнерских отношениях с крупнейшими мировыми заводами. Сотрудничество с нами — это надежный и эффективный способ получить готовые заготовки, соответствующие вашим требованиям и ожиданиям, существенно сэкономив при этом на закупке и доставке.</p>
</div>

    </div>
</div>

<div class="overlay"></div>
<div class="cutting-calculator__modal" style="z-index: 1001;">
    <div class="modal__heading">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M21.4323 18.1289H26.5709V31.3382H21.4323V18.1289ZM21.4297 33.9801H26.5683V39.2638H21.4297V33.9801Z" fill="#272727"/>
            <path d="M28.5418 2.80566C27.6477 1.07524 25.9057 0 23.9993 0C22.0929 0 20.3509 1.07524 19.4568 2.80831L0.603194 39.4325C0.184829 40.2368 -0.02241 41.1393 0.00192019 42.051C0.0262503 42.9628 0.281309 43.8522 0.741936 44.6317C1.19593 45.4147 1.84067 46.0624 2.61252 46.5109C3.38436 46.9594 4.25661 47.1931 5.14316 47.189H42.8554C44.6745 47.189 46.3214 46.2327 47.2592 44.6317C47.7191 43.852 47.9737 42.9626 47.9981 42.051C48.0224 41.1394 47.8156 40.237 47.398 39.4325L28.5418 2.80566ZM5.14316 41.9053L23.9993 5.28109L42.8683 41.9053H5.14316Z" fill="#272727"/>
        </svg>

        Внимание!
    </div>

    <div class="modal__body">
        Количество введенных деталей превышает один лист.
        Раскрой будет пересмотрен с учетом добавления нового листа
    </div>

    <img src="/local/templates/polymax_copy/assets/img/cutting-calculator/loading.gif" alt="loading" class="modal__loading d-none">

    <div class="modal__ask-again">
        <label class="marking-label">
            <input type="checkbox" name="marking-cashless" id="ask-again-check" class="marking-input">
            <div class="marking-checkbox"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" color="#fff" class="a4228-a3"><path fill="currentColor" d="M12.707 5.293a1 1 0 0 1 0 1.414l-5 5a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 1.414-1.414L7 9.586l4.293-4.293a1 1 0 0 1 1.414 0"></path></svg></div>
            Больше не спрашивать
        </label>
    </div>

    <div class="modal__footer">
        <button type="button" class="cutting-calculator__button" onclick="closeModal()" id="modal-ok">ОК</button>
        <button type="button" class="cutting-calculator__button light" id="modal-cancel" onclick="closeModal()">Отменить</button>
    </div>
</div>

<div class="cutting-calculator__modal cutting-calculator__modal-form">
    <div class="modal-form__heading">
        Заполните форму

        <button type="button" style="height: 14px; cursor: pointer;" onclick="closeModalForm()">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M13 1L1 13" stroke="#999999" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M1 1L13 13" stroke="#999999" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
    </div>

    <div class="modal-form__text">
        Прежде чем скачать файл с результатом раскроя, заполните небольшую форму: 
    </div>

    <form class="modal-form__form">
        <input required oninput="checkName(this)" type="text" id="modal-form__name" class="modal-form__form__input" placeholder="Ваше имя">
        <input required type="text" id="modal-form__phone" class="modal-form__form__input phone-mask" placeholder="Ваш телефон">
        <input type="text" id="modal-form__email" class="modal-form__form__input d-none" placeholder="Ваш email">

        <button type="submit" class="cutting-calculator__button width-auto">Отправить</button>
    </form>

    <div class="modal-form__small-text">
        Нажимая на кнопку «Отправить», вы <a href="/politika-obrabotki-personalnykh-dannykh">соглашаетесь на обработку ПД </a>
    </div>
</div>

<? require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php"); ?>