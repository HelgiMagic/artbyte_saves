<?
require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/header.php");
$APPLICATION->SetPageProperty("TITLE", "Где купить | «Буйский химический завод»");
$APPLICATION->SetPageProperty("keywords", "Где купить буйские удобрения, где купить продукцию буйского химзавода, где продается бхз");
$APPLICATION->SetPageProperty("description", "Где купить продукцию предприятия «Буйский химический завод»? Список торговых точек и представительств БХЗ на карте");
$APPLICATION->SetTitle("Где купить");
//$APPLICATION->AddHeadScript('/_js/plugins/markerclusterer.js');
$APPLICATION->AddHeadScript('https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/markerclusterer.js');
$APPLICATION->AddHeadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyD8rH_VwCLnLH04Ro6L1c77Xlnt9AiuC9Y');
$APPLICATION->AddHeadScript('https://api-maps.yandex.ru/2.1/?apikey=0d1567bd-1ba8-4430-a283-ee828a177196&lang=ru_RU');
$APPLICATION->AddHeadScript('/_js/buy.js');
if (!$_REQUEST['SECTION_CODE']) {
    $_REQUEST['SECTION_CODE'] = 'all';
}
?>

    <style>
        .link_big_map {
            color: #009f8b;
            top: 30px;
            background-color: #ffffff;
            display: block;
            padding: 5px 15px;
            left: 30px;
            position: absolute;
            z-index: 1;
            border: 1px solid #84c09c;
        }
    </style>
    <div class="buy js-buy" data-type="<?= $_REQUEST['type'] ?>">
        <div class="row js-buy-container">
            <div class="col-xs-12 buy__top-wrap js-buy-scroll" style="padding: 20px 0;">
                <div class="row buy__top-container container">
                    <div class="col-sm-7 buy__top">
                        <div class="buy__text">
                            Региональные представители продукции

                        </div>
                    </div>

                        <?
                        $APPLICATION->IncludeComponent("bitrix:catalog.section.list", "buy_countries", Array(
                                "VIEW_MODE" => "TEXT",
                                "SHOW_PARENT_NAME" => "Y",
                                "IBLOCK_TYPE" => "content",
                                "IBLOCK_ID" => IBLOCK_BUY,
                                "SECTION_ID" => "",
                                "SECTION_CODE" => "",
                                "SECTION_URL" => "",
                                "COUNT_ELEMENTS" => "Y",
                                "TOP_DEPTH" => "1",
                                "SECTION_FIELDS" => "",
                                "ADD_SECTIONS_CHAIN" => "Y",
                                "CACHE_TYPE" => "N",
                                "CACHE_TIME" => "3600",
                                "CACHE_NOTES" => "",
                                "CACHE_GROUPS" => "Y",
                                "SECTION_USER_FIELDS" => array('UF_*')
                            )
                        );
                        ?>

                </div>
            </div>
        </div>
        <div class="row js-buy-row">
            <div class="col-xs-12">
                <a href="/map" target="_blank" class="link_big_map">Увеличить карту</a>
                <div id="map" class="buy__map"></div>
            </div>

            <?
            if($_REQUEST['SECTION_CODE'] == 'all'){
                $code = "";
            }else {
                $code = $_REQUEST['SECTION_CODE'];
            }
            $APPLICATION->IncludeComponent("bitrix:catalog.section.list", "buy_list_cities", Array(
                    "VIEW_MODE" => "TEXT",
                    "SHOW_PARENT_NAME" => "Y",
                    "IBLOCK_TYPE" => "content",
                    "IBLOCK_ID" => IBLOCK_BUY,
                    "SECTION_ID" => "",
                    "SECTION_CODE" => $code,
                    "SECTION_URL" => "",
                    "COUNT_ELEMENTS" => "Y",
                    "TOP_DEPTH" => "2",
                    "SECTION_FIELDS" => "",
                    "ADD_SECTIONS_CHAIN" => "N",
                    "CACHE_TYPE" => "N",
                    "CACHE_TIME" => "3600",
                    "CACHE_NOTES" => "",
                    "CACHE_GROUPS" => "Y",
                    "SECTION_USER_FIELDS" => array('UF_*')
                )
            );
            ?>
            <div class="js-info-container"></div>
        </div>
    </div>

<? require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/footer.php"); ?>