<?php if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true)
    die();
use Bitrix\Iblock\Elements\ElementCatalogTable;
use Bitrix\Catalog\StoreProductTable;
\Bitrix\Main\Loader::includeModule('iblock');
$this->addExternalJS("/bitrix/templates/.default/components/bitrix/catalog/newoktant/bitrix/catalog.element/.default/lidbox.js");
/** @var array $arParams */
/** @var array $arResult */
/** @global CMain $APPLICATION */
/** @global CUser $USER */
/** @global CDatabase $DB */
/** @var CBitrixComponentTemplate $this */
/** @var string $templateName */
/** @var string $templateFile */
/** @var string $templateFolder */
/** @var string $componentPath */
/** @var CBitrixComponent $component */
$this->setFrameMode(true);
use RSMasterSpace\RSMTools;
//CModule::IncludeModule("iblock");
$templateLibrary = array('popup');
$currencyList = '';
if (!empty($arResult['CURRENCIES'])) {
    $templateLibrary[] = 'currency';
    $currencyList = CUtil::PhpToJSObject($arResult['CURRENCIES'], false, true, true);
}
$templateData = array(
    'TEMPLATE_THEME' => $this->GetFolder() . '/themes/' . $arParams['TEMPLATE_THEME'] . '/style.css',
    'TEMPLATE_CLASS' => 'bx_' . $arParams['TEMPLATE_THEME'],
    'TEMPLATE_LIBRARY' => $templateLibrary,
    'CURRENCIES' => $currencyList
);
unset($currencyList, $templateLibrary);

$this->addExternalCss($this->GetFolder() . '/style.css');
$this->addExternalJs($this->GetFolder() . '/script.js');


$this->addExternalCss($this->GetFolder() . '/lightbox.min.css');
$this->addExternalJs($this->GetFolder() . '/lightbox.min.js');

$strMainID = $this->GetEditAreaId($arResult['ID']);
$arItemIDs = array(
    'ID' => $strMainID,
    'PICT' => $strMainID . '_pict',
    'DISCOUNT_PICT_ID' => $strMainID . '_dsc_pict',
    'STICKER_ID' => $strMainID . '_sticker',
    'BIG_SLIDER_ID' => $strMainID . '_big_slider',
    'BIG_IMG_CONT_ID' => $strMainID . '_bigimg_cont',
    'SLIDER_CONT_ID' => $strMainID . '_slider_cont',
    'SLIDER_LIST' => $strMainID . '_slider_list',
    'SLIDER_LEFT' => $strMainID . '_slider_left',
    'SLIDER_RIGHT' => $strMainID . '_slider_right',
    'OLD_PRICE' => $strMainID . '_old_price',
    'PRICE' => $strMainID . '_price',
    'DISCOUNT_PRICE' => $strMainID . '_price_discount',
    'SLIDER_CONT_OF_ID' => $strMainID . '_slider_cont_',
    'SLIDER_LIST_OF_ID' => $strMainID . '_slider_list_',
    'SLIDER_LEFT_OF_ID' => $strMainID . '_slider_left_',
    'SLIDER_RIGHT_OF_ID' => $strMainID . '_slider_right_',
    'QUANTITY' => $strMainID . '_quantity',
    'QUANTITY_DOWN' => $strMainID . '_quant_down',
    'QUANTITY_UP' => $strMainID . '_quant_up',
    'QUANTITY_MEASURE' => $strMainID . '_quant_measure',
    'QUANTITY_LIMIT' => $strMainID . '_quant_limit',
    'BASIS_PRICE' => $strMainID . '_basis_price',
    'BUY_LINK' => $strMainID . '_buy_link',
    'ADD_BASKET_LINK' => $strMainID . '_add_basket_link',
    'BASKET_ACTIONS' => $strMainID . '_basket_actions',
    'NOT_AVAILABLE_MESS' => $strMainID . '_not_avail',
    'COMPARE_LINK' => $strMainID . '_compare_link',
    'PROP' => $strMainID . '_prop_',
    'PROP_DIV' => $strMainID . '_skudiv',
    'DISPLAY_PROP_DIV' => $strMainID . '_sku_prop',
    'OFFER_GROUP' => $strMainID . '_set_group_',
    'BASKET_PROP_DIV' => $strMainID . '_basket_prop',
);
$strObName = 'ob' . preg_replace("/[^a-zA-Z0-9_]/", "x", $strMainID);
$templateData['JS_OBJ'] = $strObName;

$strTitle = (
isset($arResult["IPROPERTY_VALUES"]["ELEMENT_DETAIL_PICTURE_FILE_TITLE"]) && $arResult["IPROPERTY_VALUES"]["ELEMENT_DETAIL_PICTURE_FILE_TITLE"] != '' ? $arResult["IPROPERTY_VALUES"]["ELEMENT_DETAIL_PICTURE_FILE_TITLE"] : $arResult['NAME']
);
$strAlt = (
isset($arResult["IPROPERTY_VALUES"]["ELEMENT_DETAIL_PICTURE_FILE_ALT"]) && $arResult["IPROPERTY_VALUES"]["ELEMENT_DETAIL_PICTURE_FILE_ALT"] != '' ? $arResult["IPROPERTY_VALUES"]["ELEMENT_DETAIL_PICTURE_FILE_ALT"] : $arResult['NAME']
);

function getDecimalsForRound(float $itemPrice)
{
    $posNew = stripos($itemPrice, '.');
    if ($posNew !== false) {
        /*        $posNew2 = stripos($itemPrice, '.0');
                if ($posNew2 !== false) {
                    $decmls = 0;
                } else {*/
        $explodeDigits = explode('.', (string)$itemPrice);
        $decmls = strlen((string)$explodeDigits[1]);
        //}
    } else {
        $decmls = 0;
    }
    return $decmls;
}

function getNoun($number, $one, $two, $five)
{
    $n = abs($number);
    $n %= 100;
    if ($n >= 5 && $n <= 20) {
        return $five;
    }
    $n %= 10;
    if ($n === 1) {
        return $one;
    }
    if ($n >= 2 && $n <= 4) {
        return $two;
    }
    return $five;
}


//имя
$name = $arResult['NAME'];

/*
//получаем бренды если их нет
if ((!isset($brandsarrayall))AND ( !isset($brandsarray))) {
    //получаем все бренды
    $brandsarray = $brandsarrayall = array();
    $rsSections = CIBlockSection::GetList(array('NAME' => 'ASC'), array('IBLOCK_ID' => 13));
    while ($arSection = $rsSections->Fetch()) {
        $brandsarray[$arSection['ID']] = $arSection['NAME'];
        $brandsarrayall[$arSection['ID']] = $arSection;
    }
}
if (!empty($arResult['PROPERTIES']['CML2_MANUFACTURER']['VALUE'])) {
    $brand = $arResult['PROPERTIES']['CML2_MANUFACTURER']['VALUE'];
    $brandid = array_search($brand, $brandsarray);
    $brandarr = $brandsarrayall[$brandid];
} else {
    $brandarr = false;
}
*/

//получаем картинку бренда
$brandarr = RSMTools::get_Brand_byName( $arResult['PROPERTIES']['CML2_MANUFACTURER']['VALUE'] );
if ($brandarr):
    $brandurl = '/brands/' . $brandarr['CODE'] . '/';
    if (!empty($brandarr['PICTURE'])) {
        $brandimg = CFile::GetPath($brandarr['PICTURE']);
    } else {
        $brandimg = SITE_TEMPLATE_PATH . '/img/nophotoimg.png';
    }
endif;

//фотографии
$fotos = array();
if (!empty($arResult['DETAIL_PICTURE'])) {
    if (isset($arResult['DETAIL_PICTURE']['SRC'])) {
        $maining = $arResult['DETAIL_PICTURE']['SRC'];
    } else {
        $maining = CFile::GetPath($arResult['DETAIL_PICTURE']);
    }
} else {
    if (!empty($arResult['PREVIEW_PICTURE']['SRC'])) {
        $maining = $arResult['PREVIEW_PICTURE']['SRC'];
    } else {
        if ((!empty($arResult['PROPERTIES']['FOTO']['VALUE']))AND ( file_exists($_SERVER["DOCUMENT_ROOT"] . $arResult['PROPERTIES']['FOTO']['VALUE']))) {
            $maining = trim($arResult['PROPERTIES']['FOTO']['VALUE']);
        } else {
            $maining = SITE_TEMPLATE_PATH . '/img/nophotoimg.png';
        }
    }
}
$fotos[] = $maining;
if (!empty($arResult['PROPERTIES']['PHOTOS']['VALUE'])) {
    foreach ($arResult['PROPERTIES']['PHOTOS']['VALUE'] as $foto):
        $fotos[] = CFile::GetPath($foto);
    endforeach;
}
//фото из свойств
if ((!empty($arResult['PROPERTIES']['FOTO_2']['VALUE']))AND ( file_exists($_SERVER["DOCUMENT_ROOT"] . $arResult['PROPERTIES']['FOTO_2']['VALUE']))) {
    $fotos[] = trim($arResult['PROPERTIES']['FOTO_2']['VALUE']);
}
if ((!empty($arResult['PROPERTIES']['FOTO_3']['VALUE']))AND ( file_exists($_SERVER["DOCUMENT_ROOT"] . $arResult['PROPERTIES']['FOTO_3']['VALUE']))) {
    $fotos[] = trim($arResult['PROPERTIES']['FOTO_3']['VALUE']);
}
if ((!empty($arResult['PROPERTIES']['FOTO_4']['VALUE']))AND ( file_exists($_SERVER["DOCUMENT_ROOT"] . $arResult['PROPERTIES']['FOTO_4']['VALUE']))) {
    $fotos[] = trim($arResult['PROPERTIES']['FOTO_4']['VALUE']);
}
if ((!empty($arResult['PROPERTIES']['FOTO_5']['VALUE']))AND ( file_exists($_SERVER["DOCUMENT_ROOT"] . $arResult['PROPERTIES']['FOTO_5']['VALUE']))) {
    $fotos[] = trim($arResult['PROPERTIES']['FOTO_5']['VALUE']);
}
if ((!empty($arResult['PROPERTIES']['FOTO_6']['VALUE']))AND ( file_exists($_SERVER["DOCUMENT_ROOT"] . $arResult['PROPERTIES']['FOTO_6']['VALUE']))) {
    $fotos[] = trim($arResult['PROPERTIES']['FOTO_6']['VALUE']);
}

//видео
$video = trim($arResult['PROPERTIES']['VIDEO']['VALUE']);
$tovcod = $arResult['PROPERTIES']['CML2_ARTICLE']['VALUE'];
//иконки
$stock = $arResult['PROPERTIES']['AKTSIYA']['VALUE'];
$hit = $arResult['PROPERTIES']['KHIT_PRODAZH']['VALUE'];
//срок выбора новик
include($_SERVER["DOCUMENT_ROOT"] . "/" . SITE_TEMPLATE_PATH . "/inc/novsparam.php");
if ((strtotime($arResult['DATE_CREATE'])) > $last7days) {
    $new = true;
} else {
    $new = false;
}
$tid = $arResult['ID'];
//цены
$newPriceId = 8;
$db_res1 = CPrice::GetList(array(), array("PRODUCT_ID" => $tid, "CATALOG_GROUP_ID" => $newPriceId));
if (!$price1 = $db_res1->Fetch()) {
    $price1 = false;
}
if($price1['PRICE']=='0.00'):
    $price1 = false;
endif;
$db_res2 = CPrice::GetList(array(), array("PRODUCT_ID" => $tid, "CATALOG_GROUP_ID" => 6));
if (!$price2 = $db_res2->Fetch()) {
    $price2 = false;
}
if($price2['PRICE']=='0.00'):
    $price2 = false;
endif;
if ((!empty($price1['PRICE']))AND(!empty($price2['PRICE']))) {
    if ($price1['CURRENCY'] == $price2['CURRENCY']) {
        $skidka = round(100 - ($price1['PRICE'] / ($price2['PRICE'] / 100)));
    } else {
        $skidka = false;
    }
} else {
    $skidka = false;
}
$currentprice = $oldprice = false;
if (!empty($price1)) {
    if ($price1['CURRENCY'] == 'RUB') {
        $currentprice = $price1['PRICE'];
    } else {
        $currentprice = CCurrencyRates::ConvertCurrency($price1['PRICE'], $price1['CURRENCY'], "RUB");
        $currentprice = number_format($currentprice, 2, '.', '');
    }
    //$currentprice = round($currentprice);
}
if (!empty($price2)) {
    if ($price2['CURRENCY'] == 'RUB') {
        $oldprice = $price2['PRICE'];
    } else {
        $oldprice = CCurrencyRates::ConvertCurrency($price2['PRICE'], $price2['CURRENCY'], "RUB");
        $oldprice = number_format($oldprice, 2, '.', '');
    }
    //$oldprice = round($oldprice);
}
//характеристики
$showprps = array();
foreach ($arResult['DISPLAY_PROPERTIES'] as $p) {
    $pval = (is_array($p['DISPLAY_VALUE']) ? implode(' / ', $p['DISPLAY_VALUE']) : $p['DISPLAY_VALUE']);
    if (!empty($pval)):
        if($p['ID'] == '475' && !empty($p['VALUE'])){
            $showprps[$p['NAME']]['URL']['SRC'] = $p['URL'];
            $showprps[$p['NAME']]['URL']['NAME'] = $p['VALUE'];
        }else{
            $showprps[$p['NAME']] = $pval;
        }
    endif;
}
//описание 
if (!empty($arResult['DETAIL_TEXT'])) {
    $opisanie = $arResult['DETAIL_TEXT'];
} else {
    if (!empty($arResult['PREVIEW_TEXT'])) {
        $opisanie = $arResult['PREVIEW_TEXT'];
    } else {
        $opisanie = false;
    }
}
//аналоги
$array_analogs = $analogscl = array();
$analog = trim($arResult['PROPERTIES']['ANALOGS']['VALUE']);
if (!empty($analog)) {
    $analogs = explode(",", $analog);
    foreach ($analogs as $a):
        $analogscl[] = trim($a);
    endforeach;
    $arFilter_analogs = array("IBLOCK_ID" => 9, "ACTIVE" => "Y", "PROPERTY_CML2_TRAITS" => $analogscl);
    //$arFilter_analogs = array("IBLOCK_ID"=>9,"ACTIVE"=>"Y","PROPERTY_CML2_ARTICLE"=>$analogscl);
    $res_analogs = CIBlockElement::GetList(array("ID" => "DESC"), $arFilter_analogs);
    while ($ob_analogs = $res_analogs->GetNextElement()) {
        $arFields_analogs = $ob_analogs->GetFields();
        $arFields_analogs['PROPERTIES'] = $ob_analogs->GetProperties();
        $array_analogs[] = $arFields_analogs;
    }
}
//Комплектующие
$array_complects = $complectscl = array();
$complect = trim($arResult['PROPERTIES']['COMPONENTS']['VALUE']);
if (!empty($complect)) {
    $complects = explode(",", $complect);
    foreach ($complects as $c):
        $complectscl[] = trim($c);
    endforeach;
    //$arFilter_complects = array("IBLOCK_ID"=>9,"ACTIVE"=>"Y","PROPERTY_CML2_ARTICLE"=>$complectscl);
    $arFilter_complects = array("IBLOCK_ID" => 9, "ACTIVE" => "Y", "PROPERTY_CML2_TRAITS" => $complectscl);
    $res_complects = CIBlockElement::GetList(array("ID" => "DESC"), $arFilter_complects);
    $contComlects = "";
    while ($ob_complects = $res_complects->GetNextElement()) {
        $arFields_complects = $ob_complects->GetFields();
        $arFields_complects['PROPERTIES'] = $ob_complects->GetProperties();
        if ($arFields_complects['IBLOCK_SECTION_ID'] > 0):
            $array_complects[$arFields_complects['IBLOCK_SECTION_ID']][] = $arFields_complects;
        endif;
        $contComlects++;
    }
}

//Отзывы
$array_otzivs = $list_otzivs = array();
$ratingres = $rating = false;
$arFilter_otzivs = array("IBLOCK_ID" => 16, "ACTIVE" => "Y", "PROPERTY_tovarid" => $tid);
$res_otzivs = CIBlockElement::GetList(array("DATE_CREATE" => "DESC"), $arFilter_otzivs);
while ($ob_otzivs = $res_otzivs->GetNextElement()) {
    $arFields_otzivs = $ob_otzivs->GetFields();
    $arFields_otzivs['PROPERTIES'] = $ob_otzivs->GetProperties();
    $array_otzivs[] = $list_otzivs[] = $arFields_otzivs;
    $ratingres = $ratingres + intval($arFields_otzivs['PROPERTIES']['rating']['VALUE']);
}

if( is_array($array_otzivs) && count($array_otzivs) > 0 ) {
    $countotzivs = $countotzivs2 = count($array_otzivs);
    $rating = $rating2 = round($ratingres / $countotzivs);
}


//$countotzivs = $countotzivs2 = count($array_otzivs);
//$rating = $rating2 = round($ratingres / $countotzivs);

if (in_array($countotzivs, array(2, 3, 4))) {
    $otztext = 'отзыва';
} elseif ($countotzivs == 1) {
    $otztext = 'отзыв';
} else {
    $otztext = 'отзывов';
}
$otztext2 = $otztext;
//Вопросы-ответы
$otvetsnavopros = 0;
$array_voproses = $list_voproses = array();
$arFilter_voproses = array("IBLOCK_ID" => 15, "ACTIVE" => "Y", "PROPERTY_tovarid" => $tid);
$res_voproses = CIBlockElement::GetList(array("DATE_CREATE" => "DESC"), $arFilter_voproses);
while ($ob_voproses = $res_voproses->GetNextElement()) {
    $arFields_voproses = $ob_voproses->GetFields();
    $arFields_voproses['PROPERTIES'] = $ob_voproses->GetProperties();
    if (!empty($arFields_voproses['PROPERTIES']['otvet']['VALUE']['TEXT'])) {
        $otvetsnavopros++;
    }
    $array_voproses[] = $list_voproses[] = $arFields_voproses;
}
$countvoproses = $countvoproses2 = count($array_voproses);
if (in_array($countvoproses, array(2, 3, 4))) {
    $voptext = 'вопрос-ответа';
    $voptextqw = 'вопроса';
} elseif ($countvoproses == 1) {
    $voptext = 'вопрос-ответ';
    $voptextqw = 'вопрос';
} else {
    $voptext = 'вопрос-ответов';
    $voptextqw = 'вопросов';
}
$voptext2 = $voptext;
if (in_array($otvetsnavopros, array(2, 3, 4))) {
    $otvnatext = 'ответа';
} elseif ($otvetsnavopros == 1) {
    $otvnatext = 'ответ';
} else {
    $otvnatext = 'ответов';
}

//ед.измерения
$arMeasure = \Bitrix\Catalog\ProductTable::getCurrentRatioWithMeasure($arResult['ID']);
$edenica = $arMeasure[$arResult['ID']]['MEASURE']['SYMBOL_RUS'];
//кол-во
//$allcount = intval($arResult['PRODUCT']['QUANTITY']);
//файлы паспорт и каталог и т.д.
$instruction = $arResult['PROPERTIES']['INSTRUKTSIYA']['VALUE'];
$sertificate = $arResult['PROPERTIES']['SERTIFIKAT']['VALUE'];
$passport = $arResult['PROPERTIES']['PASPORT']['VALUE'];
$catfile = $arResult['PROPERTIES']['KATALOG']['VALUE'];
//отзывы и вопросы по группе
$grupa = trim($arResult['PROPERTIES']['GRUPPA_OTZYVOV']['VALUE']);
$array_bygroup = false;
if (!empty($grupa)) {
    $arFilter_bygroup = array("IBLOCK_ID" => 9, "ACTIVE" => "Y", "!ID" => $arResult['ID'], "PROPERTY_GRUPPA_OTZYVOV" => $grupa);
    $res_bygroup = CIBlockElement::GetList(array("ID" => "DESC"), $arFilter_bygroup);
    while ($ob_bygroup = $res_bygroup->GetNextElement()) {
        $arFields_bygroup = $ob_bygroup->GetFields();
        $arFields_bygroup['PROPERTIES'] = $ob_bygroup->GetProperties();
        $array_bygroup[] = $arFields_bygroup;
    }
}
//var_dump($arResult);
?>
<div itemscope itemtype="https://schema.org/Product">
    <div class="section-title mobile-only"><?= $arResult["NAME"]; ?></div>
    <div class="product" data-id="<?= $arResult['ID']; ?>">

        <?if (!empty($arResult['PROPERTIES']['CML2_MANUFACTURER']['VALUE'])):?>
            <meta itemprop="brand" content="<?=$arResult['PROPERTIES']['CML2_MANUFACTURER']['VALUE']?>" />
        <?endif?>

        <div class="product-gallery">
            <div class="product-main-slider">
                <?
                foreach ($fotos as $f):
                    $cn = 1;
                    ?>
                    <div class="product-main-slide">
                        <div class="product-main-img">
                            <a href="<?= $f; ?>" class="glightbox"><img itemprop="image" src="<?= $f; ?>" alt="<?= $name; ?> фото <?= $cn; ?>" title="<?= $name; ?> фото <?= $cn; ?>"></a>
                        </div>
                    </div>
                    <?
                    $cn++;
                endforeach;
                ?>
                <?
                if ($video):
                    preg_match("/youtu\.be\/(.*)/i", $video, $videocod2);
                    $videocod2 = $videocod2[1];
                    if (!empty($videocod2)) {
                        $video = 'https://www.youtube.com/embed/' . $videocod2;
                    }
                    ?>
                    <div class="product-main-slide">
                        <div class="product-main-img">
                            <iframe width="1280" height="720" src="<?= $video; ?>" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                        </div>
                    </div>
                <? endif; ?>
            </div>
            <div class="product-nav-slider-wrapp">
                <div class="product-nav-slider-body">
                    <div class="product-nav-slider">
                        <?
                        foreach ($fotos as $f):
                            $cn = 1;
                            ?>
                            <div class="product-nav-slide">
                                <div class="product-nav-slide-img">
                                    <img src="<?= $f; ?>" alt="<?= $name; ?> фото <?= $cn; ?>" title="<?= $name; ?> фото <?= $cn; ?>">
                                </div>
                            </div>
                            <?
                            $cn++;
                        endforeach;
                        ?>
                        <?
                        if ($video):
                            preg_match("/embed\/(.*)/i", $video, $videocod);
                            $videocod = $videocod[1];
                            if (empty($videocod)):
                                preg_match("/youtu\.be\/(.*)/i", $video, $videocod);
                                $videocod = $videocod[1];
                            endif;
                            ?>
                            <div class="product-nav-slide">
                                <div class="product-nav-slide-img" style="background-image:url(https://img.youtube.com/vi/<?= $videocod; ?>/mqdefault.jpg);">
                                    <svg width="28" height="21"><use xlink:href="#icon-video"></use></svg>
                                </div>
                            </div>
                        <? endif; ?>
                    </div>
                </div>
            </div>
        </div>
        <div class="product-body">
            <h1 class="section-title desktop-only" itemprop="name"><?= $arResult["NAME"]; ?></h1>


            <div class="product-links-row flex-row" style="display: none;">
                <div class="product-links-col flex-row-item">
                    <div class="item-rating">
                        <div class="rating" data-rating="<?= $rating; ?>">
                            <div class="rating-state"></div>
                        </div>
                        <div class="item-rating-desc"><a href="#product-reviews" class="scroll-to-btn"><?= $countotzivs; ?> <?= $otztext; ?></a> &nbsp;|&nbsp; <a href="#product-questions" class="scroll-to-btn"><?= $countvoproses; ?> <?= $voptext; ?></a></div>

                    </div>
                </div>

            </div>
            <div class="product-content">
                <div class="product-content-row flex-row">
                    <div class="product-content-col flex-row-item">

                        <div class="item-details">
                            <? if ($tovcod): ?>
                                <div class="product-code" itemprop="model">Артикул: <?= $tovcod; ?></div>
                            <? endif; ?>
                            <? if ($brandarr): ?>
                                <?/*<div class="item-brand-logo"><img src="https://dev.oktant.ru/upload/iblock/edb/4hygcdabvltuxdkvu00u4qrmrxb704v0.png" alt="Наименование бренда"></div>*/?>
                                <div class="item-brand-logo"><a href="<?= $brandurl; ?>"><img src="<?= $brandimg; ?>" alt="<?= $brandarr['NAME']; ?>"></a></div>
                            <? endif; ?>
                        </div>
                        <?
                        if (!empty($arResult['DISPLAY_PROPERTIES'])):
                            ?>
                            <div class="product-info">
                                <!-- <div class="product-info-title">Характеристики</div>-->
                                <table class="product-info-table">

                                    <?php $elemId = $arResult["ID"];
                                    $arSmartFilterProps = [];
                                    $arSmartFilterPropsTypes = [];
                                    if ($arResult["ORIGINAL_PARAMETERS"]["IBLOCK_ID"]) {
                                        $iblockId = $arResult["ORIGINAL_PARAMETERS"]["IBLOCK_ID"];
                                    } else {
                                        $iblockId = 9;
                                    }

                                    $casheTime = 604800;

                                    if ($arResult["IBLOCK_SECTION_ID"]) {
                                        $sectionId = $arResult["IBLOCK_SECTION_ID"];
                                    } else {
                                        $elem2 = ElementCatalogTable::getList([
                                            'select' => ['IBLOCK_SECTION_ID'],
                                            'filter' => ['=ACTIVE' => 'Y', '=ID' => $elemId]
                                        ])->fetch();
                                        $sectionId = $elem2["IBLOCK_SECTION_ID"];
                                    }

                                    $query = new \Bitrix\Main\Entity\Query(\Bitrix\Iblock\Model\Section::compileEntityByIblock($iblockId));
                                    $query
                                        ->setOrder(["ID" => "ASC"])
                                        ->setFilter(
                                            [
                                                "IBLOCK_ID" => $iblockId,
                                                "ID" => $sectionId,
                                            ]
                                        )
                                        ->setSelect(
                                            ["UF_NORELINK"]
                                        );

                                    $result = $query->exec();
                                    $sec_arr = $result->fetch();

                                    if (is_array($sec_arr) && $sec_arr["UF_NORELINK"] != 1) {

                                        $arSmartFilterPropsExclude = [];
                                        $rsSectionPropertyExclude = \Bitrix\Iblock\SectionPropertyTable::getList([
                                            'order' => ['PROPERTY.SORT' => 'ASC'],
                                            'filter' => [
                                                'IBLOCK_ID' => $iblockId,
                                                '=SMART_FILTER' => null,
                                                '=SECTION_ID' => $sectionId
                                            ],
                                            'select' => [
                                                'PROPERTY_NAME'=>'PROPERTY.NAME',
                                                'PROPERTY_CODE'=>'PROPERTY.CODE',
                                                'SECTION_NAME'=>'SECTION.NAME'
                                            ],
                                        ]);
                                        while($sectionPropertyExclude = $rsSectionPropertyExclude->fetch()) {
                                            $arSmartFilterPropsExclude[$sectionPropertyExclude["PROPERTY_NAME"]] = $sectionPropertyExclude["PROPERTY_CODE"];
                                        }

                                        $arSections = [];
                                        $sectionId2 = $sectionId;
                                        while($sectionId2) {
                                            if ($arSection = \Bitrix\Iblock\SectionTable::getList([
                                                'filter' => ['IBLOCK_ID' => $iblockId, 'ID' => $sectionId2],
                                                'select' => ['ID', 'IBLOCK_SECTION_ID']
                                            ])->fetch()) {
                                                $arSections[] = $arSection['ID'];
                                            }
                                            $sectionId2 = $arSection['IBLOCK_SECTION_ID'];
                                        }

                                        if (count($arSections) > 0) {

                                            $rsSectionProperty = \Bitrix\Iblock\SectionPropertyTable::getList([
                                                'order' => ['PROPERTY.SORT' => 'ASC'],
                                                'filter' => [
                                                    'IBLOCK_ID' => $iblockId,
                                                    '=SMART_FILTER' => 'Y',
                                                    '=SECTION_ID' => $arSections
                                                ],
                                                'select' => [
                                                    'PROPERTY_NAME'=>'PROPERTY.NAME',
                                                    'PROPERTY_CODE'=>'PROPERTY.CODE',
                                                    'PROPERTY_TYPE'=>'PROPERTY.PROPERTY_TYPE',
                                                    'SECTION_NAME'=>'SECTION.NAME',
                                                    'ACTIVE'=>'PROPERTY.ACTIVE'
                                                ]
                                            ]);
                                            $sectionProperty = $rsSectionProperty->fetchAll();
                                            if (is_array($sectionProperty) && count($sectionProperty) > 0) {
                                                foreach ($sectionProperty as $item) {

                                                    if ($item["ACTIVE"] != "N") {

                                                        if (array_key_exists($item["PROPERTY_NAME"], $arSmartFilterPropsExclude)) {
                                                            continue;
                                                        }
                                                        $arSmartFilterProps[$item["PROPERTY_NAME"]] = $item["PROPERTY_CODE"];
                                                        $arSmartFilterPropsTypes[$item["PROPERTY_CODE"]] = $item["PROPERTY_TYPE"];

                                                    }

                                                }
                                            }
                                        }

                                        if (is_array($arSmartFilterProps) && count($arSmartFilterProps) > 0) {

                                            $arElemSelect = [];
                                            $arElemFilter = [];

                                            $arElemSelect["PERELINKOVKA_VALUE"] = 'PERELINKOVKA.VALUE';
                                            $arElemFilter['=IBLOCK_SECTION.ID'] = $sectionId;
                                            $arElemFilter['=ID'] = $elemId;
                                            foreach ($arSmartFilterProps as $arSmartFilterProp) {

                                                if ($arSmartFilterPropsTypes[$arSmartFilterProp] == 'L') {
                                                    $arElemSelect[$arSmartFilterProp.'_VALUE'] =   $arSmartFilterProp.'.ITEM.VALUE';
                                                } else {
                                                    $arElemSelect[$arSmartFilterProp."_VALUE"] = $arSmartFilterProp.".VALUE";
                                                }
                                            }

                                            $needDefaultProps = true;
                                            $propsString = '';

                                            $elem = ElementCatalogTable::getList([
                                                'select' => $arElemSelect,
                                                'filter' => $arElemFilter
                                            ])->fetch();

                                            foreach ($arSmartFilterProps as $key => $value) {

                                                if ($value) {

                                                    $propCode = $value;

                                                    if ($arSmartFilterPropsTypes[$value] == 'L') {
                                                        $typeCode = $value.'.ITEM.VALUE';
                                                        $propCodeValue = $value.'.ITEM.SORT';
                                                    } else {
                                                        $typeCode = $value.'.VALUE';
                                                        $propCodeValue = $value.'.VALUE';
                                                    }

                                                    $arSmartFilterPropsCopy = $arSmartFilterProps;

                                                    unset($arSmartFilterPropsCopy[array_search($value,$arSmartFilterPropsCopy)]);

                                                    $arSelect = ['ID', 'NAME', 'CODE', 'IBLOCK_SECTION_ID'];
                                                    $arSelect["DETAIL_PAGE_URL"] = "IBLOCK.DETAIL_PAGE_URL";
                                                    $arSelect["PERELINKOVKA_VALUE"] = 'PERELINKOVKA.VALUE';
                                                    $arFilter['=ACTIVE'] = 'Y';
                                                    $arFilter['=PERELINKOVKA.VALUE'] = $elem["PERELINKOVKA_VALUE"];
                                                    $arFilter['=IBLOCK_SECTION.ID'] = $sectionId;

                                                    if (is_array($arSmartFilterPropsCopy) && count($arSmartFilterPropsCopy) > 0) {

                                                        foreach ($arSmartFilterPropsCopy as $arSmartFilterPropCopy) {

                                                            if ($arSmartFilterPropsTypes[$arSmartFilterPropCopy] == 'L') {
                                                                $arSelect[$arSmartFilterPropCopy . '_VALUE'] = $arSmartFilterPropCopy . '.ITEM.VALUE';
                                                                $arFilter["=" . $arSmartFilterPropCopy . ".ITEM.VALUE"] = $elem[$arSmartFilterPropCopy . '_VALUE'];
                                                            } else {
                                                                $arSelect[$arSmartFilterPropCopy . "_VALUE"] = $arSmartFilterPropCopy . ".VALUE";
                                                                $arFilter["=" . $arSmartFilterPropCopy . ".VALUE"] = $elem[$arSmartFilterPropCopy . '_VALUE'];
                                                            }

                                                        }

                                                    }

                                                    if ($arSmartFilterPropsTypes[$value] == 'L') {
                                                        $arSelect[$value.'_VALUE'] = $value.".ITEM.VALUE";
                                                        $arFilter["!".$value.".ITEM.VALUE"] = $elem[$value.'_VALUE'];
                                                    } else {
                                                        $arSelect[$value."_VALUE"] = $value.".VALUE";
                                                        $arFilter["!".$value.".VALUE"] = $elem[$value.'_VALUE'];
                                                    }

                                                    $elemsNew = ElementCatalogTable::getList([
                                                        'order' => [$propCodeValue => 'ASC'],
                                                        'select' => $arSelect,
                                                        'filter' => $arFilter
                                                    ])->fetchAll();

                                                    $arSelectedProps = [];

                                                    $propName = array_search ($value, $arSmartFilterProps);
                                                    if ($propName) {

                                                        $val = $elem[$value.'_VALUE'];

                                                        if (!$val) continue;

                                                        if ($arSmartFilterPropsTypes[$value] == 'N') {
                                                            $decmls = getDecimalsForRound ((float)$val);
                                                            $val = round ((float)$val, $decmls);
                                                        }

														$propsString .= '<tr><td><div class="product-info-table-title"><span>'.$propName.'</span></div></td><td><span>'.$val.'</span>';

                                                        $arSelectedProps[$propName][] = $val;

                                                    }

                                                    if (is_array($elemsNew) && count($elemsNew) > 0) {

                                                        $propsString .= '</td></tr><tr><td colspan="2" class="extralinks">';

                                                        $arPropsString = [];

                                                        foreach ($elemsNew as $elemNew) {

                                                            if (array_key_exists($propName, $arSelectedProps) && array_search($elemNew[$value.'_VALUE'], $arSelectedProps[$propName])) {//&& $arSelectedProps[$propName][$elem[$value.'_VALUE']]

                                                            } else {
                                                                $loopProp = $elemNew[$value.'_VALUE'];

                                                                if ($arSmartFilterPropsTypes[$value] == 'N') {
                                                                    $decmls = getDecimalsForRound ((float)$loopProp);
                                                                    $loopProp = round ((float)$loopProp, $decmls);
                                                                }

                                                                $elemNew['DETAIL_PAGE_URL'] = CIBlock::ReplaceDetailUrl($elemNew ['DETAIL_PAGE_URL'], $elemNew, false, 'E');
                                                                // $propsString .= '<a href="'.$elemNew['DETAIL_PAGE_URL'].'">'.$loopProp.'</a>';
                                                                $arPropsString[$loopProp] = '<a href="'.$elemNew['DETAIL_PAGE_URL'].'">'.$loopProp.'</a>';
                                                                $arSelectedProps[$propName][] = $elemNew[$value.'_VALUE'];
                                                                $needDefaultProps = false;
                                                            }

                                                        }

                                                        if (count($arPropsString) > 0) {

                                                            if($arSmartFilterPropsTypes[$value] == 'S'){
                                                                ksort($arPropsString);
                                                            }

                                                            foreach ($arPropsString as $value) {
                                                                $propsString .= $value;
                                                            }

                                                        }

                                                    }

                                                    $propsString .= '</td></tr>';

                                                }

                                                unset($arFilter);
                                                unset($arSelect);

                                            }

                                            if ($needDefaultProps) {

                                                $hari = 0;
                                                foreach ($arResult['DISPLAY_PROPERTIES'] as &$arOneProp) {
                                                    $pval = (is_array($arOneProp['DISPLAY_VALUE']) ? implode(' / ', $arOneProp['DISPLAY_VALUE']) : $arOneProp['DISPLAY_VALUE']);
                                                    if ((!empty($pval))AND ( $hari < 7)) {
                                                        ?>
                                                        <tr>
                                                            <td>
                                                                <div class="product-info-table-title"><span><?= $arOneProp['NAME']; ?></span></div>
                                                            </td>
                                                            <td>
                                                                <?if(!empty($arOneProp["URL"])):?>
                                                                    <a href="<?=$arOneProp["URL"]?>" target="_blank"><?=$pval;?></a>
                                                                <?else:?>
                                                                    <span><?= $pval; ?></span>
                                                                <?endif;?>
                                                            </td>
                                                        </tr>
                                                        <?php
                                                        $hari++;
                                                    }
                                                }

                                                unset($arOneProp);

                                            } else {

                                                echo $propsString;

                                            }

                                        }

                                    } else {

                                        $hari = 0;
                                        foreach ($arResult['DISPLAY_PROPERTIES'] as &$arOneProp) {
                                            $pval = (is_array($arOneProp['DISPLAY_VALUE']) ? implode(' / ', $arOneProp['DISPLAY_VALUE']) : $arOneProp['DISPLAY_VALUE']);
                                            if ((!empty($pval))AND ( $hari < 7)) {
                                                ?>
                                                <tr>
                                                    <td>
                                                        <div class="product-info-table-title"><span><?= $arOneProp['NAME']; ?></span></div>
                                                    </td>
                                                    <td>
                                                        <?if(!empty($arOneProp["URL"])):?>
                                                            <a href="<?=$arOneProp["URL"]?>" target="_blank"><?=$pval;?></a>
                                                        <?else:?>
														<span><?= $pval; ?></span>
                                                        <?endif;?>
                                                    </td>
                                                </tr>
                                                <?php
                                                $hari++;
                                            }
                                        }
                                        unset($arOneProp);

                                    }?>

                                    <?php /*
                                $hari = 0;
                                foreach ($arResult['DISPLAY_PROPERTIES'] as &$arOneProp) {
                                    $pval = (is_array($arOneProp['DISPLAY_VALUE']) ? implode(' / ', $arOneProp['DISPLAY_VALUE']) : $arOneProp['DISPLAY_VALUE']);
                                    if ((!empty($pval))AND ( $hari < 7)) {
                                        ?>
                                        <tr>
                                            <td>
                                                <div class="product-info-table-title"><span><?= $arOneProp['NAME']; ?></span></div>
                                            </td>
                                            <td>
                                                <?if(!empty($arOneProp["URL"])):?>
                                                    <a href="<?=$arOneProp["URL"]?>" target="_blank"><?=$pval;?></a>
                                                <?else:?>
                                                    <span><?= $pval; ?></span>
                                                <?endif;?>
                                            </td>
                                        </tr>
                                        <?
                                        $hari++;
                                    }
                                }
                                unset($arOneProp);*/
                                    ?>
                                </table>
                                <!--<a href="#product-specifications" class="product-info-more-link">Показать все характеристики</a>-->


                                <?
                                $allcount = 0;
                                /*$stores = array();
                                $resStore = CCatalogStore::GetList(
                                    array('PRODUCT_ID'=>'ASC','ID' => 'ASC'),
                                    array('ACTIVE' => 'Y','PRODUCT_ID'=>array($tid)),
                                    false,
                                    false,
                                    array()
                                );
                                while($sklad = $resStore->Fetch()){
                                    unset($AMOUNT);
                                    if($sklad['ID'] != 5 && $sklad['ID'] != 7):
                                        $arFilter_store = array("PRODUCT_ID"=>$tid,"STORE_ID"=>$sklad['ID']);
                                        $res_store = CCatalogStoreProduct::GetList(array(),$arFilter_store,false,false,array());
                                        $arRes_store = $res_store->GetNext();
                                        $AMOUNT = $arRes_store['AMOUNT'];
                                        $allcount = $allcount + intval($AMOUNT);
                                        if ($AMOUNT=='') { $AMOUNT = '-';}
                                        $sklad['AMOUNT'] = $AMOUNT;
                                        if ($sklad['ID'] != 4) {
                                            $stores[] = $sklad;
                                        }
                                    endif;
                                }*/
                                $storeId = 2;//Основной склад
                                $rsStore = StoreProductTable::getList(array(
                                    'filter' => array('=PRODUCT_ID'=>$arResult['ID'], 'STORE_ID' => $storeId),
                                    'select' => array('AMOUNT'),
                                ));
                                if ($arStore = $rsStore->Fetch()){
                                    $allcount = (int)$arStore['AMOUNT'];
                                }
                                ?>


                                <?if($allcount>0):?>
                                    <div class="item-state item-state-available" style="display:none;">
                                        <div class="item-state-title">В наличии: <?=$allcount;?> <?=$edenica;?>.
                                            <? if(!empty($arResult["PROPERTIES"]["SROK_POSTAVKI"]["VALUE"])): ?>
                                                , остальные <?=$arResult["PROPERTIES"]["SROK_POSTAVKI"]["VALUE"]?>
                                            <? endif; ?>
                                        </div>

                                    </div>

                                <?elseif(!empty($arResult["PROPERTIES"]["SROK_POSTAVKI"]["VALUE"])):?>

                                    <div class="item-state item-state-available" style="display:none;">
                                        <div class="item-state-title">Срок поставки <?=$arResult["PROPERTIES"]["SROK_POSTAVKI"]["VALUE"]?></div>
                                    </div>
                                <?endif;?>

                            </div>

                        <? endif; ?>


                    </div>
                    <div class="product-content-col flex-row-item">
                        <div class="product-form">
                            <div class="product-links-col flex-row-item">
                                <ul class="item-list-links">
                                    <li>
                                        <a href="#" class="item-compare-link js_togle_compare" data-title="Товар добавлен к сравнению" data-id="<?= $arResult['ID']; ?>">
                                            <i><svg width="14" height="11"><use xlink:href="#icon-compare"></use></svg></i>
                                            <span>Сравнить</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" class="item-favorites-link js_togle_favorite" data-title="Товар добавлен в избранное" data-id="<?= $arResult['ID']; ?>">
                                            <i><svg width="13" height="12"><use xlink:href="#icon-favorites"></use></svg></i>
                                            <span>Избранное</span>
                                        </a>
                                    </li>
                                    <li>
                                        <div class="share-tooltip">
                                            <div class="share-tooltip-content">
                                                <script src="https://yastatic.net/es5-shims/0.0.2/es5-shims.min.js"></script>
                                                <script src="https://yastatic.net/share2/share.js"></script>
                                                <div class="ya-share2" data-services="vkontakte,facebook,odnoklassniki,twitter,lj,viber,whatsapp,telegram" data-limit="5"></div>
                                            </div>
                                            <a href="#" class="share-tooltip-link">
                                                <i><svg width="14" height="14"><use xlink:href="#icon-yes"></use></svg></i>
                                                <span>Поделиться</span>
                                            </a>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <?/*
            <div class="product-links-col flex-row-item">
                <ul class="item-list-links">
                    <li>
                        <a href="#" class="product-save-link">
                            <svg width="15" height="15"><use xlink:href="#icon-save"></use></svg>
                        </a>
                    </li>
                    <li>
                        <a href="#" class="product-print-link">
                            <svg width="18" height="17"><use xlink:href="#icon-print"></use></svg>
                        </a>
                    </li>
                </ul>
</div> */;?>
                            <div class="product-form-body">
                                <div class="item-stikers">
                                    <? if ($stock == 'Да'): ?>
                                        <div class="stiker stiker-stock"></div>
                                    <? endif; ?>
                                    <? if ($hit == 'Да'): ?>
                                        <div class="stiker stiker-hit"></div>
                                    <? endif; ?>
                                    <? if ($new): ?>
                                        <div class="stiker stiker-new"></div>
                                    <? endif; ?>
                                </div>
                                <div class="item-prices" itemprop="offers" itemscope="itemscope" itemtype="https://schema.org/Offer">
                                    <?if($allcount>0):?>
                                        <link itemprop="availability" href="https://schema.org/InStock">
                                        <meta temprop="sku" content="<?=$allcount?>" />
                                    <?endif;?>

                                    <?
                                    if ((!empty($oldprice))AND ( $currentprice != $oldprice)):
                                        $oldpriceround = $oldpricecop = $arrpriceold = $oldpricef = false;
                                        $oldpricef = number_format($oldprice, 2, '.', ' ');
                                        $arrpriceold = explode('.', $oldpricef);
                                        $oldpriceround = $arrpriceold[0];
                                        $oldpricecop = $arrpriceold[1];
                                        ?>
                                        <div class="item-price-old"><?= $oldpriceround; ?><? if (!empty($oldpricecop)): ?> <sup><?= $oldpricecop; ?></sup> <? endif; ?><span class="rouble">o</span></div>
                                    <? endif; ?>
                                    <? if ($skidka): ?>
                                        <div class="item-price-stok-info">-<?= $skidka; ?>%</div>
                                    <? else: ?>
                                    <? endif; ?>

                                    <?
                                    if (!empty($currentprice)):
                                        $curpriceround = $curpricecop = $arrpricecur = $currentpricef = false;
                                        $currentpricef = number_format($currentprice, 2, '.', ' ');
                                        $arrpricecur = explode('.', $currentpricef);
                                        $curpriceround = $arrpricecur[0];
                                        $curpricecop = $arrpricecur[1];
                                        ?>
                                        <div class="item-price-current"><?= $curpriceround; ?><? if (!empty($curpricecop)): ?> <sup><?= $curpricecop; ?></sup> <? endif; ?><span class="rouble">q</span></div>
                                        <meta itemprop="price" content="<?= $currentprice ?>">
                                        <meta itemprop="priceCurrency" content="RUB">
                                    <? endif; ?>


                                </div>
                                <div class="item-form">
                                    <?
                                    $showpricecheck = false;
                                    ?>
                                    <?if(((!empty($currentprice))OR(!empty($oldprice)))AND(($currentprice!='0.01')OR($oldprice!='0.01'))):?>

                                        <?
                                        $showpricecheck = true;
                                        ?>
                                        <div class="select-number" style="display: none;">
                                            <?
                                            if(!empty($arResult["PROPERTIES"]["KRATNOST_PRODAZHI"]["VALUE"]))
                                            {
                                                if($arResult["PROPERTIES"]["OTGRUZHAT_UPAKOVKAMI"]["VALUE_XML_ID"] == "true")
                                                {
                                                    ?>
                                                    <a href="#" class="select-number-btn select-number-btn-minus"></a>
                                                    <input type="text"  class="select-number-input" data-id="<?=$arResult['ID'];?>" data-unit="<?=$edenica;?>" data-value="<?=($isBasket ? $basketQuantity : $arResult["PROPERTIES"]["KRATNOST_PRODAZHI"]["VALUE"])?>" data-step="<?=$arResult["PROPERTIES"]["KRATNOST_PRODAZHI"]["VALUE"]?>" data-min="<?=$arResult["PROPERTIES"]["KRATNOST_PRODAZHI"]["VALUE"]?>" data-max="1000" data-desc="<?=$edenica;?>." value="<?=($isBasket ? $basketQuantity : $arResult["PROPERTIES"]["KRATNOST_PRODAZHI"]["VALUE"])?> <?=$edenica;?>.">
                                                    <a href="#" class="select-number-btn select-number-btn-plus"></a>
                                                    <label class="multiplicity-wrap"><input type="checkbox" class="multiplicity" multiplicity="<?=$arResult["PROPERTIES"]["KRATNOST_PRODAZHI"]["VALUE"]?>" disabled checked/> Упаковка: <?=$arResult["PROPERTIES"]["KRATNOST_PRODAZHI"]["VALUE"]?> <?=$edenica;?></label>
                                                    <?
                                                }
                                                else
                                                {
                                                    ?>
                                                    <a href="#" class="select-number-btn select-number-btn-minus"></a>
                                                    <input type="text" class="select-number-input" data-id="<?=$arResult['ID'];?>" data-unit="<?=$edenica;?>" data-value="<?=($isBasket ? $basketQuantity : 1)?>" data-step="1" data-min="1" data-max="1000" data-desc="<?=$edenica;?>." value="<?=($isBasket ? $basketQuantity : 1)?> <?=$edenica;?>.">
                                                    <a href="#" class="select-number-btn select-number-btn-plus"></a>
                                                    <label class="multiplicity-wrap"><input class="multiplicity" multiplicity="<?=$arResult["PROPERTIES"]["KRATNOST_PRODAZHI"]["VALUE"]?>" type="checkbox"/> Упаковка: <?=$arResult["PROPERTIES"]["KRATNOST_PRODAZHI"]["VALUE"]?> <?=$edenica;?></label>
                                                    <?
                                                }
                                            }
                                            else
                                            {
                                                ?>
                                                <a href="#" class="select-number-btn select-number-btn-minus"></a>
                                                <input  type="text" class="select-number-input" data-id="<?=$arResult['ID'];?>" data-unit="<?=$edenica;?>" data-value="<?=($isBasket ? $basketQuantity : 1)?>" data-step="1" data-min="1" data-max="1000" data-desc="<?=$edenica;?>." value="<?=($isBasket ? $basketQuantity : 1)?> <?=$edenica;?>.">
                                                <a href="#" class="select-number-btn select-number-btn-plus"></a>

                                                <?
                                            }
                                            ?>
                                        </div>

                                        <a href="#" class="item-basket-btn" data-id="<?=$arResult['ID'];?>">
                                            <svg width="16" height="15"><use xlink:href="#icon-basket"></use></svg>
                                            <span>В корзину</span>
                                        </a>

                                    <?else:?>
                                        <a href="#modal-zaprosprice" data-id="<?=$item['ID'];?>" class="modal-open-btn notovarsin zaprosprice">Запросить цену</a>
                                        <!--
                                        <div class="notovarsin">
                                            Нет в наличии
                                        </div>
                                        -->
                                    <? endif; ?>
                                </div>

                                <ul class="product-form-links">
                                    <? if ((!empty($currentprice))OR ( !empty($oldprice))): ?>
                                        <li><a href="#" data-id="<?= $arResult['ID']; ?>" class="fast-buy modal-fast-buy-open">Быстрый заказ</a></li>
                                    <? endif; ?>

                                    <?if($showpricecheck):?>
                                        <?/*<li><a href="#modal-manager" data-id="<?= $arResult['ID']; ?>" class="link svyazmanager modal-open-btn">Связаться с менеджером</a></li>*/;?>
                                    <?endif;?>

                                </ul>
                            </div>

                            <?php
                            //данные о наличии
                            $srok_postavki = $arResult["PROPERTIES"]["SROK_POSTAVKI"]["VALUE"];
                            $ekspress_dost = $arResult["PROPERTIES"]["EKSPRESS_DOSTAVKA"]["VALUE"];
                            $standartnaya_dost = $arResult["PROPERTIES"]["STANDARTNAYA_DOSTAVKA"]["VALUE"];

                            //данные из апи поставщика
                            /*$filebdprops = fopen($_SERVER["DOCUMENT_ROOT"]."/upload/bdprops.txt","r");
                            while (!feof($filebdprops)):
                                $strfile = fgets($filebdprops);
                                $strarray = explode('::',$strfile);
                                if($strarray[0]==$tid):
                                    $count_post = trim($strarray[1]);
                                    $dost_postavshik = trim($strarray[2]);
                                    break;
                                endif;
                            endwhile;
                            fclose($filebdprops);*/
                            ?>

                            <? if (!empty($array_analogs) && empty($allcount) && empty($count_post) && empty($dost_postavshik)): ?>
                                <a href="#analogs" class="product-analog-btn btn btn-block btn-small">У этого товара есть аналоги</a>
                            <? endif; ?>


                            <div class="avail">
                                <div class="avail-instock">

                                    <section>
                                        <p class="area-title">Наличие</p>
                                        <p class="area-title">Количество</p>
                                    </section>

                                    <?php if ($arResult['PROPERTIES']['CML2_MANUFACTURER']['VALUE'] == 'IEK') {
                                        $iekapiData = \Bitrix\Main\Config\Configuration::getValue("iekapiData");
                                        $storeId = false;
                                        if (is_array($iekapiData) && count($iekapiData) > 0) {
                                            if (array_key_exists('storeid', $iekapiData)) {
                                                $storeId = $iekapiData['storeid'];

                                                $rsStore = StoreProductTable::getList(array(
                                                    'filter' => array('=PRODUCT_ID'=>$arResult['ID'], 'STORE_ID' => $storeId),
                                                    'select' => array('AMOUNT'),
                                                ));
                                                if ($arStore = $rsStore->Fetch()){

                                                    if ((int)$arStore['AMOUNT'] > 0) {
                                                        $count_post = (int)$arStore['AMOUNT'];
                                                    }

                                                }

                                            }
                                        }
                                    }?>

                                    <?php if ($arResult['PROPERTIES']['CML2_MANUFACTURER']['VALUE'] == 'CHINT') {
                                        $storeId = 5;
                                        $rsStore = StoreProductTable::getList(array(
                                            'filter' => array('=PRODUCT_ID'=>$arResult['ID'], 'STORE_ID' => $storeId),
                                            'select' => array('AMOUNT'),
                                        ));
                                        if ($arStore = $rsStore->Fetch()){

                                            if ((int)$arStore['AMOUNT'] > 0) {
                                                $count_post = (int)$arStore['AMOUNT'];
                                            }
                                        }
                                    }?>

                                    <?php if ($arResult['PROPERTIES']['CML2_MANUFACTURER']['VALUE'] == 'ПРОВЕНТО') {
                                        $storeId = 8;
                                        $rsStore = StoreProductTable::getList(array(
                                            'filter' => array('=PRODUCT_ID'=>$arResult['ID'], 'STORE_ID' => $storeId),
                                            'select' => array('AMOUNT'),
                                        ));
                                        if ($arStore = $rsStore->Fetch()){

                                            if ((int)$arStore['AMOUNT'] > 0) {
                                                $count_post = (int)$arStore['AMOUNT'];
                                            }
                                        }
                                    }?>

                                    <?if(empty($allcount) && empty($count_post) && empty($dost_postavshik)):?>
                                        <section>
                                            <p>Товар отсутствует</p><p>Под заказ</p>
                                        </section>
                                    <?endif;?>

                                    <?if(!empty($allcount)):?>
                                        <section>
                                            <p style="color:#38761d;">Сегодня</p><p style="color:#38761d;"><?=number_format($allcount,0,'',' ');?> <?=$edenica;?></p>
                                        </section>
                                    <?endif;?>

                                    <?if(!empty($count_post)):
                                        //Перемещение ?>
                                        <section>
                                            <p><?if(!empty($srok_postavki)):?>
                                                    <?php $now = time();
                                                    $deliveryTime = $now + (int)$srok_postavki*24*60*60;
                                                    $deliveryDate = date('d.m.y', $deliveryTime);?>
                                                    <?=$deliveryDate;?> (<?=$srok_postavki;?> <?= getNoun((int)$srok_postavki, 'день', 'дня', 'дней');?>)
                                                <?endif;?></p>
                                            <p><?if(!empty($count_post)):?><?=number_format($count_post,0,'',' ');?> <?=$edenica;?><?endif;?></p>
                                        </section>
                                    <?endif;?>

                                    <?php if ($arResult['PROPERTIES']['CML2_MANUFACTURER']['VALUE'] == "IEK" && strlen($arResult['PROPERTIES']['FORECASTAMOUNT']['~VALUE']) > 0) {

                                        $arForecastAmount = json_decode($arResult['PROPERTIES']['FORECASTAMOUNT']['~VALUE'], true);

                                        if (is_array($arForecastAmount) && count($arForecastAmount[$arResult['PROPERTIES']['CML2_ARTICLE']['VALUE']]['detail']) > 0) {

                                            foreach ($arForecastAmount[$arResult['PROPERTIES']['CML2_ARTICLE']['VALUE']]['detail'] as $k => $v) {
                                                if ($v['unixtime'] >= time() && $k >= 0) {?>

                                                    <section>
                                                        <p>
                                                            <?php if ($v["unixtime"]):?>
                                                                <?=date('d.m.y', $v["unixtime"]);?>
                                                            <?php endif;?>
                                                            (<?=$k." ".getNoun((int)$k, 'день', 'дня', 'дней');?>)</p><p><?=number_format($v["amount"],0,'',' ');?> <?=$edenica;?></p>
                                                    </section>

                                                <?php }

                                            }

                                        }

                                    }
                                    ?>

                                    <?php if ($arResult['PROPERTIES']['CML2_MANUFACTURER']['VALUE'] == "CHINT" && strlen($arResult['PROPERTIES']['FORECASTAMOUNT']['~VALUE']) > 0) {

                                        $arChintForecastAmount = json_decode($arResult['PROPERTIES']['FORECASTAMOUNT']['~VALUE'], true);

                                        if (is_array($arChintForecastAmount) && count($arChintForecastAmount[$arResult['ID']]['detail']) > 0) {

                                            foreach ($arChintForecastAmount[$arResult['ID']]['detail'] as $k => $v) {
                                                if ($v['unixtime'] >= time()) {?>

                                                    <section>
                                                        <p>
                                                            <?php if ($v["unixtime"]):?>
                                                                <?=date('d.m.y', $v["unixtime"]);?>
                                                            <?php endif;?>
                                                            (<?=$k." ".getNoun($k, 'день', 'дня', 'дней');?>)</p><p><?=number_format($v["amount"],0,'',' ');?> <?=$v["measure"];?></p>
                                                    </section>

                                                <?php }

                                            }

                                        }

                                    }
                                    ?>

                                    <?/*if(!empty($dost_postavshik)):?>

                                        <?php $now = time();
                                        $dost_arr = explode('<br>', $dost_postavshik);
                                        $dost_arr = array_filter($dost_arr);

                                        foreach($dost_arr as $dost_elem) {

                                            $dost_dataCount = explode(' ', $dost_elem);
                                            $dost_data = strtotime($dost_dataCount[0]);
                                            $dost_Count = $dost_dataCount[1];

                                            if ($now < $dost_data) {
                                                $dost_end = $dost_data - $now;
                                                $days_end = round($dost_end/(60*60*24)); ?>

                                                <section>
                                                    <p>Ожидается через <?=$days_end." ".getNoun((int)$days_end, 'день', 'дня', 'дней');?></p><p><?=number_format($dost_Count,0,'',' ');?> шт</p>
                                                </section>

                                                <?
                                            }
                                        }
                                        ?>
                                    <?endif;*/?>

                                    <?if(!empty($ekspress_dost)):?>
                                        <section>
                                            <?php $now2 = time();
                                            $deliveryTime2 = $now2 + (int)$ekspress_dost*24*60*60;
                                            $deliveryDate2 = date('d.m.y', $deliveryTime2);?>
                                            <p style="max-width: 60%;"><?=$deliveryDate2;?> (<?if($arResult["PROPERTIES"]["STRANA_PROIZVODSTVA"]["VALUE"]):?><!--(<?=$arResult["PROPERTIES"]["STRANA_PROIZVODSTVA"]["VALUE"];?>)--><?endif?><?=$ekspress_dost;?> <?= getNoun((int)$ekspress_dost, 'день', 'дня', 'дней');?>)</p><p><span class="link"><a href="#modal-manager" data-id="<?= $arResult['ID']; ?>" class="link svyazmanager modal-open-btn">Запросить</a></span></p>
                                        </section>
                                    <?endif;?>

                                    <?if(!empty($standartnaya_dost)):?>
                                        <section>
                                            <?php $now3 = time();
                                            $deliveryTime3 = $now3 + (int)$standartnaya_dost*24*60*60;
                                            $deliveryDate3 = date('d.m.y', $deliveryTime3);?>
                                            <p style="max-width: 60%;"><?=$deliveryDate3;?> (<?if($arResult["PROPERTIES"]["STRANA_PROIZVODSTVA"]["VALUE"]):?><!--(<?=$arResult["PROPERTIES"]["STRANA_PROIZVODSTVA"]["VALUE"];?>)--><?endif?><?=$standartnaya_dost;?> <?= getNoun((int)$standartnaya_dost, 'день', 'дня', 'дней');?>)</p><p><span class="link"><a href="#modal-manager" data-id="<?= $arResult['ID']; ?>" class="link svyazmanager modal-open-btn">Запросить</a></span></p>
                                        </section>
                                    <?endif;?>

                                </div>

                                <?if(!empty($allcount) || !empty($count_post) || !empty($dost_postavshik)):?>
                                    <?
                                    $APPLICATION->IncludeFile(
                                        $APPLICATION->GetTemplatePath("/include/delivery.php"),
                                        Array(),
                                        Array(
                                            "MODE"      => "html",
                                            "NAME" => "Блок доставки"
                                        ));
                                    ?>
                                <?endif;?>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>


    <!-- TABS -->

    <div class="product-tabs">
        <ol class="product-tabs-nav">
            <li target="description"><button><span>Описание</span></button></li>
            <li target="components"><button <?if(!$contComlects):?>disabled<?endif?>><span>Комплектующие <i><?if( $contComlects && $contComlects > 0 ):?><?=$contComlects?><?else:?>0<?endif?></i></span></button></li>
            <li target="analogs"><button <?if(empty($array_analogs)):?>disabled<?endif?>><span>Аналоги <i><?if( is_array($array_analogs) && count($array_analogs) > 0 ):?><?=count($array_analogs)?><?else:?>0<?endif?></i></span></button></li>
            <li target="documents"><button <?if (!$instruction && !$sertificate && !$passport && !$catfile):?> disabled<?endif?>><span>Документация</span></button></li>
            <li target="reviews"><button><span>Отзывы <i><?if($countotzivs):?><?=$countotzivs?><?else:?>0<?endif?></i></span></button></li>
            <li target="questions"><button><span>Вопросы <i><?if($otvetsnavopros):?><?=$otvetsnavopros?><?else:?>0<?endif?></i></span></button></li>
        </ol>
        <div class="product-tabs-content">
            <section tabname="description">
                <div class="tab-trigger"><button><span>Описание</span></button></div>
                <div class="tab-content">
                    <? //opisanie i harakteristiki ;?>
                    <section>
                        <? if ($opisanie): ?>
                            <div class="content-text product-desc" itemprop="description">
                                <p><?= $opisanie; ?>
                            </div>
                        <? endif; ?>
                    </section>

                    <?
                    if (!empty($showprps)):
                        $countprps = count($showprps);
                        if ($countprps > 1) {
                            $cntable = ceil($countprps / 2);
                            $proptable1 = array_slice($showprps, 0, $cntable);
                            $proptable2 = array_slice($showprps, $cntable, $cntable);
                        } else {
                            $proptable1 = $showprps;
                            $proptable2 = false;
                        }
                        ?>
                        <section id="product-specifications" class="product-section">
                            <h2 class="product-info-title">Характеристики</h2>
                            <div class="product-specifications-row flex-row">
                                <div class="product-specifications-col flex-row-item">
                                    <table class="product-info-table product-specifications-table">
                                        <? foreach ($proptable1 as $n => $p) { ?>
                                            <tr itemprop="additionalProperty" itemscope="itemscope" itemtype="https://schema.org/PropertyValue">
                                                <td>
                                                    <div class="product-info-table-title"><span itemprop="name"><?= $n; ?></span></div>
                                                </td>
                                                <td>
                                                    <?if(!empty($p["URL"])):?>
                                                        <a href="<?=$p["URL"]["SRC"]?>" target="_blank"><span itemprop="value"><?=$p["URL"]["NAME"]?></span></a>
                                                    <?else:?>
                                                        <span itemprop="value"><?=$p;?></span>
                                                    <?endif;?>
                                                </td>
                                            </tr>
                                        <? } ?>
                                    </table>
                                </div>
                                <? if ($proptable2): ?>
                                    <div class="product-specifications-col flex-row-item">
                                        <table class="product-info-table product-specifications-table">
                                            <? foreach ($proptable2 as $n => $p) { ?>
                                                <tr itemprop="additionalProperty" itemscope="itemscope" itemtype="https://schema.org/PropertyValue">
                                                    <td>
                                                        <div class="product-info-table-title"><span itemprop="name"><?= $n; ?></span></div>
                                                    </td>
                                                    <td>
                                                        <?if(!empty($p["URL"])):?>
                                                            <a href="<?=$p["URL"]["SRC"]?>" target="_blank"><span itemprop="value"><?=$p["URL"]["NAME"]?></span></a>
                                                        <?else:?>
                                                            <span itemprop="value"><?=$p;?></span>
                                                        <?endif;?>
                                                    </td>
                                                </tr>
                                            <? } ?>
                                        </table>
                                    </div>
                                <? endif; ?>
                            </div>
                        </section>
                    <?endif;?>
                </div>
            </section>

            <section tabname="components">
                <div class="tab-trigger"><button <?if(!$contComlects):?>disabled<?endif?>><span>Комплектующие <i><?if( $contComlects && $contComlects > 0 ):?><?=$contComlects?><?else:?>0<?endif?></i></span></button></div>
                <div class="tab-content">

                    <!--Комплектующие-->
                    <?
                    if (!empty($array_complects)):
                        ?>
                        <section>
                            <ul class="tabs-nav" data-tabs="#accessories-tabs">
                                <?
                                $s = 1;
                                foreach ($array_complects as $sect_id => $comps):
                                    $sect_arr = CIBlockSection::GetByID($sect_id)->GetNext();
                                    ?>
                                    <li <? if ($s == 1): ?>class="active"<? endif; ?>><a href="#accessories-tab-<?= $sect_id; ?>"><?= $sect_arr['NAME']; ?></a></li>
                                    <?
                                    $s++;
                                endforeach;
                                ?>
                            </ul>

                            <div id="accessories-tabs" class="tabs-wrapp accessories-tabs">
                                <?
                                $s = 1;
                                foreach ($array_complects as $sect_id => $comps):
                                    ?>
                                    <div id="accessories-tab-<?= $sect_id; ?>" class="tab-block<? if ($s == 1): ?> active<? endif; ?>">
                                        <div class="items-section">
                                            <div class="items-slider-wrapp slider-wrapp">
                                                <div class="items-slider-body slider-body">
                                                    <div class="items-slider">
                                                        <?
                                                        foreach ($comps as $comp):
                                                            $item = $comp;
                                                            ?>

                                                            <div class="items-slide">
                                                                <? include($_SERVER["DOCUMENT_ROOT"] . "/" . SITE_TEMPLATE_PATH . "/inc/tovar.php"); ?>
                                                            </div>
                                                        <? endforeach; ?>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="items-slider-dots slider-dots"></div>
                                        </div>
                                    </div>
                                    <?
                                    $s++;
                                endforeach;
                                ?>
                            </div>
                        </section>
                    <? endif; ?>
                    <!--Конец-->

                </div>
            </section>

            <section tabname="analogs">
                <div class="tab-trigger"><button <?if(empty($array_analogs)):?>disabled<?endif?>><span>Аналоги <i><?if( is_array($array_analogs) && count($array_analogs) > 0 ):?><?=count($array_analogs)?><?else:?>0<?endif?></i></span></button></div>
                <div class="tab-content">

                    <!--Аналоги-->
                    <?
                    if (!empty($array_analogs)):
                        ?>
                        <section id="analogs">
                            <div class="items-section">
                                <div class="items-slider-wrapp slider-wrapp">
                                    <div class="items-slider-body slider-body">
                                        <div class="items-slider">
                                            <?
                                            foreach ($array_analogs as $anl):
                                                $item = $anl;
                                                ?>
                                                <div class="items-slide">
                                                    <? include($_SERVER["DOCUMENT_ROOT"] . "/" . SITE_TEMPLATE_PATH . "/inc/tovar.php"); ?>
                                                </div>
                                            <? endforeach; ?>
                                        </div>
                                    </div>
                                </div>
                                <div class="items-slider-dots slider-dots"></div>
                            </div>
                        </section>
                    <? endif; ?>



                </div>
            </section>

            <section tabname="documents">
                <div class="tab-trigger"><button <?if (!$instruction && !$sertificate && !$passport && !$catfile):?> disabled<?endif?>><span>Документация</span></button></div>
                <div class="tab-content">
                    <?
                    if ((!empty($instruction))OR ( !empty($sertificate))OR ( !empty($passport))OR ( !empty($catfile))):
                        ?>
                        <div id="product-docs">
                            <ul class="downloads-list">
                                <? if ($instruction): ?>
                                    <li>
                                        <a href="<?= $instruction; ?>" class="download-link" target="_blank">
                            <span class="download-link-icon">
                                <svg width="19" height="25"><use xlink:href="#icon-instruction"></use></svg>
                            </span>
                                            <span class="download-link-info">
                                <span class="download-link-title">Инструкция по монтажу</span>
                                <span class="download-link-desc">PDF</span>
                            </span>
                                        </a>
                                    </li>
                                <? endif; ?>
                                <? if ($sertificate): ?>
                                    <li>
                                        <a href="<?= $sertificate; ?>" class="download-link" target="_blank">
                            <span class="download-link-icon">
                                <svg width="20" height="23"><use xlink:href="#icon-doc"></use></svg>
                            </span>
                                            <span class="download-link-info">
                                <span class="download-link-title">Сертификат соответствия</span>
                                <span class="download-link-desc">DOC</span>
                            </span>
                                        </a>
                                    </li>
                                <? endif; ?>
                                <? if ($passport): ?>
                                    <li>
                                        <a href="<?= $passport; ?>" class="download-link" target="_blank">
                            <span class="download-link-icon">
                                <svg width="19" height="25"><use xlink:href="#icon-instruction"></use></svg>
                            </span>
                                            <span class="download-link-info">
                                <span class="download-link-title">Паспорт</span>
                                <span class="download-link-desc">PDF</span>
                            </span>
                                        </a>
                                    </li>
                                <? endif; ?>
                                <? if ($catfile): ?>
                                    <li>
                                        <a href="<?= $catfile; ?>" class="download-link" target="_blank">
                            <span class="download-link-icon">
                                <svg width="19" height="25"><use xlink:href="#icon-instruction"></use></svg>
                            </span>
                                            <span class="download-link-info">
                                <span class="download-link-title">Каталог</span>
                                <span class="download-link-desc">PDF</span>
                            </span>
                                        </a>
                                    </li>
                                <? endif; ?>
                            </ul>
                        </div>
                    <? endif; ?>
                </div>
            </section>

            <section tabname="reviews">
                <div class="tab-trigger"><button><span>Отзывы <i><?if($countotzivs):?><?=$countotzivs?><?else:?>0<?endif?></i></span></button></div>
                <div class="tab-content">

                    <section id="product-reviews">
                        <div class="reviews-head">
                            <div class="reviews-head-body">
                                <div class="reviews-head-rating">
                                    <div class="rating" data-rating="<?= $rating2; ?>">
                                        <div class="rating-state"></div>
                                    </div>
                                    <div class="reviews-rating-desc"><?= $countotzivs2; ?> <?= $otztext2; ?></div>
                                </div>
                                <!--
                                <div class="select reviews-select">
                                        <i><svg><use xlink:href="#icon-arrow-small"></use></svg></i>
                                        <div class="select-title">Сначала полезные</div>
                                        <div class="select-list-wrapp">
                                                <div class="select-list-body" data-simplebar data-simplebar-auto-hide="false">
                                                        <ul class="select-list">
                                                                <li class="active"><a href="#">Сначала полезные</a></li>
                                                                <li><a href="#">Сначала бесполезные</a></li>
                                                                <li><a href="#">Сначала смешные :-)</a></li>
                                                        </ul>
                                                </div>
                                        </div>
                                </div>
                                -->
                            </div>
                            <a href="#modal-addotziv" data-id="<?= $arResult['ID']; ?>" class="reviews-add-btn btn modal-open-btn">Оставить отзыв</a>
                        </div>
                        <? if (!empty($list_otzivs)): ?>
                            <div class="reviews">
                                <?
                                foreach ($list_otzivs as $otziv_item):
                                    //var_dump($otziv);
                                    $o_rating = intval($otziv_item['PROPERTIES']['rating']['VALUE']);
                                    //$o_data = FormatDate(array("tommorow" => "tommorow в H:i","today" => "today в H:i","yesterday" => "yesterday в H:i","d" => 'j F',"" => 'j F Y',), MakeTimeStamp());
                                    //$o_data = date("",strtotime($otziv['DATE_CREATE']));
                                    $o_data = FormatDate(array("d" => 'j F', "" => 'j F Y'), strtotime($otziv_item['DATE_CREATE'])) . ' в ' . date("H:i", strtotime($otziv_item['DATE_CREATE']));
//$o_dost = trim($otziv_item['PROPERTIES']['dost']['VALUE']['TEXT']);
//$o_nedost = trim($otziv_item['PROPERTIES']['nedost']['VALUE']['TEXT']);
//$o_comment = trim($otziv_item['PROPERTIES']['comment']['VALUE']['TEXT']);
                                    if (isset($otziv_item['PROPERTIES']['dost']['VALUE']['TEXT'])) {
                                        $o_dost = trim($otziv_item['PROPERTIES']['dost']['VALUE']['TEXT']);
                                    }
                                    if (isset($otziv_item['PROPERTIES']['nedost']['VALUE']['TEXT'])) {
                                        $o_nedost = trim($otziv_item['PROPERTIES']['nedost']['VALUE']['TEXT']);
                                    }
                                    if (isset($otziv_item['PROPERTIES']['comment']['VALUE']['TEXT'])) {
                                        $o_comment = trim($otziv_item['PROPERTIES']['comment']['VALUE']['TEXT']);
                                    }
                                    ?>
                                    <div class="review">
                                        <div class="review-info">
                                            <div class="review-user"><?= $otziv_item['NAME']; ?></div>
                                            <div class="review-date"><?= $o_data; ?></div>
                                        </div>
                                        <div class="review-body">
                                            <div class="rating" data-rating="<?= $o_rating; ?>">
                                                <div class="rating-state"></div>
                                            </div>
                                            <? if ($o_dost): ?>
                                                <div class="review-block">
                                                    <div class="review-block-title">Достоинства</div>
                                                    <div class="review-block-desc"><?= $o_dost; ?></div>
                                                </div>
                                            <? endif; ?>
                                            <? if ($o_nedost): ?>
                                                <div class="review-block">
                                                    <div class="review-block-title">Недостатки</div>
                                                    <div class="review-block-desc"><?= $o_nedost; ?></div>
                                                </div>
                                            <? endif; ?>
                                            <? if ($o_comment): ?>
                                                <div class="review-block">
                                                    <div class="review-block-title">Комментарий</div>
                                                    <div class="review-block-desc"><?= $o_comment; ?></div>
                                                </div>
                                            <? endif; ?>
                                            <ul class="voting-list">
                                                <?
                                                //получаем колличество
                                                $cn_plus = 0;
                                                $res_plus = CIBlockElement::GetList(array(), array("IBLOCK_ID" => 17, "PROPERTY_id" => $otziv_item['ID'], "PROPERTY_tip" => 1, "PROPERTY_znak" => 'plus'));
                                                $cn_plus = $res_plus->SelectedRowsCount();
                                                ?>
                                                <li>
                                                    <a href="#" class="startgolos voting-link voting-link-yes" data-id="<?= $otziv_item['ID']; ?>" data-tip="1" data-znak="plus">
                                                        <svg width="14" height="14"><use xlink:href="#icon-yes"></use></svg>
                                                        <span><?= $cn_plus; ?></span>
                                                    </a>
                                                </li>
                                                <?
                                                //получаем колличество
                                                $cn_minus = 0;
                                                $res_minus = CIBlockElement::GetList(array(), array("IBLOCK_ID" => 17, "PROPERTY_id" => $otziv_item['ID'], "PROPERTY_tip" => 1, "PROPERTY_znak" => 'minus'));
                                                $cn_minus = $res_minus->SelectedRowsCount();
                                                ?>
                                                <li>
                                                    <a href="#" class="startgolos voting-link voting-link-no" data-id="<?= $otziv_item['ID']; ?>" data-tip="1" data-znak="minus">
                                                        <svg width="14" height="14"><use xlink:href="#icon-yes"></use></svg>
                                                        <span><?= $cn_minus; ?></span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                <? endforeach; ?>
                            </div>
                        <? endif; ?>
                        <?
                        if (!empty($array_bygroup)):
                            ?>
                            <div class="reviews-more">
                                <a href="#" class="reviews-series-btn btn btn-small">Посмотреть отзывы на товары этой серии</a>
                            </div>
                            <div class="reviews-series tab-block">
                                <?
                                foreach ($array_bygroup as $tovarbyotz):
                                    //var_dump($tovarbyotz);
                                    if (!empty($tovarbyotz['DETAIL_PICTURE'])) {
                                        $tovarbyotzimg = CFile::GetPath($tovarbyotz['DETAIL_PICTURE']);
                                    } else {
                                        if (!empty($tovarbyotz['PREVIEW_PICTURE'])) {
                                            $tovarbyotzimg = CFile::GetPath($tovarbyotz['PREVIEW_PICTURE']);
                                        } else {
                                            if (!empty($tovarbyotz['PROPERTIES']['FOTO']['VALUE'])) {
                                                $tovarbyotzimg = trim($tovarbyotz['PROPERTIES']['FOTO']['VALUE']);
                                            } else {
                                                $tovarbyotzimg = SITE_TEMPLATE_PATH . '/img/nophotoimg.png';
                                            }
                                        }
                                    }
                                    //отзывы и рейтинг
                                    $array_otzivs_byotz = array();
                                    $ratingres_byotz = $rating_byotz = false;
                                    $arFilter_otzivs_byotz = array("IBLOCK_ID" => 16, "ACTIVE" => "Y", "PROPERTY_tovarid" => $tovarbyotz['ID']);
                                    $res_otzivs_byotz = CIBlockElement::GetList(array("DATE_CREATE" => "DESC"), $arFilter_otzivs_byotz);
                                    while ($ob_otzivs_byotz = $res_otzivs_byotz->GetNextElement()) {
                                        $arFields_otzivs_byotz = $ob_otzivs_byotz->GetFields();
                                        $arFields_otzivs_byotz['PROPERTIES'] = $ob_otzivs_byotz->GetProperties();
                                        $array_otzivs_byotz[] = $arFields_otzivs_byotz;
                                        $ratingres_byotz = $ratingres_byotz + intval($arFields_otzivs_byotz['PROPERTIES']['rating']['VALUE']);
                                    }
                                    $countotzivs_byotz = count($array_otzivs_byotz);
                                    if ($countotzivs_byotz && $ratingres_byotz) {
                                        $rating_byotz = round($ratingres_byotz / $countotzivs_byotz);
                                    }
                                    if (in_array($countotzivs_byotz, array(2, 3, 4))) {
                                        $otztext_byotz = 'отзыва';
                                    } elseif ($countotzivs_byotz == 1) {
                                        $otztext_byotz = 'отзыв';
                                    } else {
                                        $otztext_byotz = 'отзывов';
                                    }
                                    ?>
                                    <div class="reviews-series-head">
                                        <div class="reviews-series-item">
                                            <a href="<?= $tovarbyotz['DETAIL_PAGE_URL']; ?>" class="reviews-series-item-link"></a>
                                            <div class="reviews-series-item-img">
                                                <img src="<?= $tovarbyotzimg; ?>" alt="<?= $tovarbyotz['NAME']; ?>" title="<?= $tovarbyotz['NAME']; ?>">
                                            </div>
                                            <div class="reviews-series-item-title"><?= $tovarbyotz['NAME']; ?></div>
                                        </div>
                                        <div class="item-rating">
                                            <div class="rating" data-rating="<?= $rating_byotz; ?>">
                                                <div class="rating-state"></div>
                                            </div>
                                            <div class="item-rating-desc"><a href="<?= $tovarbyotz['DETAIL_PAGE_URL']; ?>#product-reviews"><?= $countotzivs_byotz; ?> <?= $otztext_byotz; ?></a></div>
                                        </div>
                                    </div>
                                    <? if (!empty($array_otzivs_byotz)): ?>
                                    <div class="reviews">
                                        <?
                                        foreach ($array_otzivs_byotz as $otziv_item):
                                            //var_dump($otziv);
                                            $o_rating = intval($otziv_item['PROPERTIES']['rating']['VALUE']);
                                            //$o_data = FormatDate(array("tommorow" => "tommorow в H:i","today" => "today в H:i","yesterday" => "yesterday в H:i","d" => 'j F',"" => 'j F Y',), MakeTimeStamp());
                                            //$o_data = date("",strtotime($otziv['DATE_CREATE']));
                                            $o_data = FormatDate(array("d" => 'j F', "" => 'j F Y'), strtotime($otziv_item['DATE_CREATE'])) . ' в ' . date("H:i", strtotime($otziv_item['DATE_CREATE']));
                                            $o_dost = trim($otziv_item['PROPERTIES']['dost']['VALUE']['TEXT']);
                                            $o_nedost = trim($otziv_item['PROPERTIES']['nedost']['VALUE']['TEXT']);
                                            $o_comment = trim($otziv_item['PROPERTIES']['comment']['VALUE']['TEXT']);
                                            ?>
                                            <div class="review">
                                                <div class="review-info">
                                                    <div class="review-user"><?= $otziv_item['NAME']; ?></div>
                                                    <div class="review-date"><?= $o_data; ?></div>
                                                </div>
                                                <div class="review-body">
                                                    <div class="rating" data-rating="<?= $o_rating; ?>">
                                                        <div class="rating-state"></div>
                                                    </div>
                                                    <? if ($o_dost): ?>
                                                        <div class="review-block">
                                                            <div class="review-block-title">Достоинства</div>
                                                            <div class="review-block-desc"><?= $o_dost; ?></div>
                                                        </div>
                                                    <? endif; ?>
                                                    <? if ($o_nedost): ?>
                                                        <div class="review-block">
                                                            <div class="review-block-title">Недостатки</div>
                                                            <div class="review-block-desc"><?= $o_nedost; ?></div>
                                                        </div>
                                                    <? endif; ?>
                                                    <? if ($o_comment): ?>
                                                        <div class="review-block">
                                                            <div class="review-block-title">Комментарий</div>
                                                            <div class="review-block-desc"><?= $o_comment; ?></div>
                                                        </div>
                                                    <? endif; ?>
                                                    <ul class="voting-list">
                                                        <?
                                                        //получаем колличество
                                                        $cn_plus = 0;
                                                        $res_plus = CIBlockElement::GetList(array(), array("IBLOCK_ID" => 17, "PROPERTY_id" => $otziv_item['ID'], "PROPERTY_tip" => 1, "PROPERTY_znak" => 'plus'));
                                                        $cn_plus = $res_plus->SelectedRowsCount();
                                                        ?>
                                                        <li>
                                                            <a href="#" class="startgolos voting-link voting-link-yes" data-id="<?= $otziv_item['ID']; ?>" data-tip="1" data-znak="plus">
                                                                <svg width="14" height="14"><use xlink:href="#icon-yes"></use></svg>
                                                                <span><?= $cn_plus; ?></span>
                                                            </a>
                                                        </li>
                                                        <?
                                                        //получаем колличество
                                                        $cn_minus = 0;
                                                        $res_minus = CIBlockElement::GetList(array(), array("IBLOCK_ID" => 17, "PROPERTY_id" => $otziv_item['ID'], "PROPERTY_tip" => 1, "PROPERTY_znak" => 'minus'));
                                                        $cn_minus = $res_minus->SelectedRowsCount();
                                                        ?>
                                                        <li>
                                                            <a href="#" class="startgolos voting-link voting-link-no" data-id="<?= $otziv_item['ID']; ?>" data-tip="1" data-znak="minus">
                                                                <svg width="14" height="14"><use xlink:href="#icon-yes"></use></svg>
                                                                <span><?= $cn_minus; ?></span>
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        <? endforeach; ?>
                                    </div>
                                <? endif; ?>
                                    <br>
                                    <br>
                                <? endforeach; ?>
                                <!--
                                <div class="reviews-more">
                                        <a href="#" class="read-more-btn btn btn-small">
                                                <span>
                                                        <svg width="16" height="16"><use xlink:href="#icon-read-more"></use></svg>
                                                        <span>еще отзывы</span>
                                                </span>
                                        </a>
                                </div>
                                -->
                            </div>
                        <? endif; ?>
                    </section>

                </div>
            </section>

            <section tabname="questions">
                <div class="tab-trigger"><button><span>Вопросы <i><?if($otvetsnavopros):?><?=$otvetsnavopros?><?else:?>0<?endif?></i></span></button></div>
                <div class="tab-content">
                    <section id="product-questions">
                        <div class="reviews-head">
                            <div class="reviews-head-body">
                                <div class="reviews-head-rating">
                                    <div class="reviews-rating-desc"><?= $countvoproses2; ?> <?= $voptextqw; ?> &nbsp;|&nbsp; <?= $otvetsnavopros; ?> <?= $otvnatext; ?></div>
                                </div>
                                <!--
                                <div class="select reviews-select">
                                        <i><svg><use xlink:href="#icon-arrow-small"></use></svg></i>
                                        <div class="select-title">Сначала полезные</div>
                                        <div class="select-list-wrapp">
                                                <div class="select-list-body" data-simplebar data-simplebar-auto-hide="false">
                                                        <ul class="select-list">
                                                                <li class="active"><a href="#">Сначала полезные</a></li>
                                                                <li><a href="#">Сначала бесполезные</a></li>
                                                                <li><a href="#">Сначала смешные :-)</a></li>
                                                        </ul>
                                                </div>
                                        </div>
                                </div>
                                -->
                            </div>
                            <a href="#modal-addvopros" data-id="<?= $arResult['ID']; ?>" class="reviews-add-btn2 btn modal-open-btn">Задать вопрос</a>
                        </div>
                        <? if (!empty($list_voproses)): ?>
                            <div class="reviews">
                                <?
                                foreach ($list_voproses as $voproses_item):
                                    $o_data = FormatDate(array("d" => 'j F', "" => 'j F Y'), strtotime($voproses_item['DATE_CREATE'])) . ' в ' . date("H:i", strtotime($voproses_item['DATE_CREATE']));
                                    $o_comment = trim($voproses_item['PROPERTIES']['comment']['VALUE']['TEXT']);
                                    $o_nameotv = trim($voproses_item['PROPERTIES']['nameotv']['VALUE']);
                                    $o_otvet = trim($voproses_item['PROPERTIES']['otvet']['VALUE']['TEXT']);
                                    $o_otvdata = FormatDate(array("d" => 'j F', "" => 'j F Y'), strtotime($voproses_item['TIMESTAMP_X'])) . ' в ' . date("H:i", strtotime($voproses_item['TIMESTAMP_X']));
                                    //var_dump($voproses_item);
                                    ?>
                                    <div class="review">
                                        <div class="review-info">
                                            <div class="review-user"><?= $voproses_item['NAME']; ?></div>
                                            <div class="review-date"><?= $o_data; ?></div>
                                        </div>
                                        <div class="review-body">
                                            <div class="review-question"><?= $o_comment; ?></div>
                                            <? if ((!empty($o_nameotv))AND ( !empty($o_otvet))): ?>
                                                <div class="review-answer">
                                                    <div class="review">
                                                        <div class="review-info">
                                                            <div class="review-user"><?= $o_nameotv; ?></div>
                                                            <div class="review-date"><?= $o_otvdata; ?></div>
                                                        </div>
                                                        <div class="review-body">
                                                            <div class="review-block">
                                                                <div class="review-block-desc">
                                                                    <?= $o_otvet; ?>
                                                                </div>
                                                            </div>
                                                            <ul class="voting-list">
                                                                <?
                                                                //получаем колличество
                                                                $cn_plus = 0;
                                                                $res_plus = CIBlockElement::GetList(array(), array("IBLOCK_ID" => 17, "PROPERTY_id" => $voproses_item['ID'], "PROPERTY_tip" => 2, "PROPERTY_znak" => 'plus'));
                                                                $cn_plus = $res_plus->SelectedRowsCount();
                                                                ?>
                                                                <li>
                                                                    <a href="#" class="startgolos voting-link voting-link-yes" data-id="<?= $voproses_item['ID']; ?>" data-tip="2" data-znak="plus">
                                                                        <svg width="14" height="14"><use xlink:href="#icon-yes"></use></svg>
                                                                        <span><?= $cn_plus; ?></span>
                                                                    </a>
                                                                </li>
                                                                <?
                                                                //получаем колличество
                                                                $cn_minus = 0;
                                                                $res_minus = CIBlockElement::GetList(array(), array("IBLOCK_ID" => 17, "PROPERTY_id" => $voproses_item['ID'], "PROPERTY_tip" => 2, "PROPERTY_znak" => 'minus'));
                                                                $cn_minus = $res_minus->SelectedRowsCount();
                                                                ?>
                                                                <li>
                                                                    <a href="#" class="startgolos voting-link voting-link-no" data-id="<?= $voproses_item['ID']; ?>" data-tip="2" data-znak="minus">
                                                                        <svg width="14" height="14"><use xlink:href="#icon-yes"></use></svg>
                                                                        <span><?= $cn_minus; ?></span>
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            <? endif; ?>
                                        </div>
                                    </div>
                                <? endforeach; ?>
                            </div>
                        <? endif; ?>
                        <?
                        if (!empty($array_bygroup)):
                            ?>
                            <div class="reviews-more">
                                <a href="#" class="reviews-series-btn btn btn-small">Посмотреть ответы на вопросы на товары этой серии</a>
                            </div>
                            <div class="reviews-series tab-block">
                                <?
                                foreach ($array_bygroup as $tovarbyotz):
                                    //var_dump($tovarbyotz);
                                    if (!empty($tovarbyotz['DETAIL_PICTURE'])) {
                                        $tovarbyotzimg = CFile::GetPath($tovarbyotz['DETAIL_PICTURE']);
                                    } else {
                                        if (!empty($tovarbyotz['PREVIEW_PICTURE'])) {
                                            $tovarbyotzimg = CFile::GetPath($tovarbyotz['PREVIEW_PICTURE']);
                                        } else {
                                            if (!empty($tovarbyotz['PROPERTIES']['FOTO']['VALUE'])) {
                                                $tovarbyotzimg = trim($tovarbyotz['PROPERTIES']['FOTO']['VALUE']);
                                            } else {
                                                $tovarbyotzimg = SITE_TEMPLATE_PATH . '/img/nophotoimg.png';
                                            }
                                        }
                                    }
                                    $otvetsnavopros_byotz = 0;
                                    $array_voproses_byotz = array();
                                    $arFilter_voproses_byotz = array("IBLOCK_ID" => 15, "ACTIVE" => "Y", "PROPERTY_tovarid" => $tovarbyotz['ID']);
                                    $res_voproses_byotz = CIBlockElement::GetList(array("DATE_CREATE" => "DESC"), $arFilter_voproses_byotz);
                                    while ($ob_voproses_byotz = $res_voproses_byotz->GetNextElement()) {
                                        $arFields_voproses_byotz = $ob_voproses_byotz->GetFields();
                                        $arFields_voproses_byotz['PROPERTIES'] = $ob_voproses_byotz->GetProperties();
                                        if (!empty($arFields_voproses_byotz['PROPERTIES']['otvet']['VALUE']['TEXT'])) {
                                            $otvetsnavopros_byotz++;
                                        }
                                        $array_voproses_byotz[] = $arFields_voproses_byotz;
                                    }
                                    $countvoproses_byotz = count($array_voproses_byotz);
                                    if (in_array($countvoproses_byotz, array(2, 3, 4))) {
                                        $voptextqw_byotz = 'вопроса';
                                    } elseif ($countvoproses_byotz == 1) {
                                        $voptextqw_byotz = 'вопрос';
                                    } else {
                                        $voptextqw_byotz = 'вопросов';
                                    }
                                    if (in_array($otvetsnavopros_byotz, array(2, 3, 4))) {
                                        $otvnatext_byotz = 'ответа';
                                    } elseif ($otvetsnavopros_byotz == 1) {
                                        $otvnatext_byotz = 'ответ';
                                    } else {
                                        $otvnatext_byotz = 'ответов';
                                    }
                                    ?>
                                    <div class="reviews-series-head">
                                        <div class="reviews-series-item">
                                            <a href="<?= $tovarbyotz['DETAIL_PAGE_URL']; ?>" class="reviews-series-item-link"></a>
                                            <div class="reviews-series-item-img">
                                                <img src="<?= $tovarbyotzimg; ?>" alt="<?= $tovarbyotz['NAME']; ?>" title="<?= $tovarbyotz['NAME']; ?>">
                                            </div>
                                            <div class="reviews-series-item-title"><?= $tovarbyotz['NAME']; ?></div>
                                        </div>
                                        <div class="item-rating">
                                            <div class="item-rating-desc"><a href="<?= $tovarbyotz['DETAIL_PAGE_URL']; ?>#product-questions"><?= $countvoproses_byotz; ?> <?= $voptextqw_byotz; ?> | <?= $otvetsnavopros_byotz; ?> <?= $otvnatext_byotz; ?></a></div>
                                        </div>
                                    </div>
                                    <? if (!empty($array_voproses_byotz)): ?>
                                    <div class="reviews">
                                        <?
                                        foreach ($array_voproses_byotz as $voproses_item):
                                            $o_data = FormatDate(array("d" => 'j F', "" => 'j F Y'), strtotime($voproses_item['DATE_CREATE'])) . ' в ' . date("H:i", strtotime($voproses_item['DATE_CREATE']));
                                            $o_comment = trim($voproses_item['PROPERTIES']['comment']['VALUE']['TEXT']);
                                            $o_nameotv = trim($voproses_item['PROPERTIES']['nameotv']['VALUE']);
                                            $o_otvet = trim($voproses_item['PROPERTIES']['otvet']['VALUE']['TEXT']);
                                            $o_otvdata = FormatDate(array("d" => 'j F', "" => 'j F Y'), strtotime($voproses_item['TIMESTAMP_X'])) . ' в ' . date("H:i", strtotime($voproses_item['TIMESTAMP_X']));
                                            //var_dump($voproses_item);
                                            ?>
                                            <div class="review">
                                                <div class="review-info">
                                                    <div class="review-user"><?= $voproses_item['NAME']; ?></div>
                                                    <div class="review-date"><?= $o_data; ?></div>
                                                </div>
                                                <div class="review-body">
                                                    <div class="review-question"><?= $o_comment; ?></div>
                                                    <? if ((!empty($o_nameotv))AND ( !empty($o_otvet))): ?>
                                                        <div class="review-answer">
                                                            <div class="review">
                                                                <div class="review-info">
                                                                    <div class="review-user"><?= $o_nameotv; ?></div>
                                                                    <div class="review-date"><?= $o_otvdata; ?></div>
                                                                </div>
                                                                <div class="review-body">
                                                                    <div class="review-block">
                                                                        <div class="review-block-desc">
                                                                            <?= $o_otvet; ?>
                                                                        </div>
                                                                    </div>
                                                                    <ul class="voting-list">
                                                                        <?
                                                                        //получаем колличество
                                                                        $cn_plus = 0;
                                                                        $res_plus = CIBlockElement::GetList(array(), array("IBLOCK_ID" => 17, "PROPERTY_id" => $voproses_item['ID'], "PROPERTY_tip" => 2, "PROPERTY_znak" => 'plus'));
                                                                        $cn_plus = $res_plus->SelectedRowsCount();
                                                                        ?>
                                                                        <li>
                                                                            <a href="#" class="startgolos voting-link voting-link-yes" data-id="<?= $voproses_item['ID']; ?>" data-tip="2" data-znak="plus">
                                                                                <svg width="14" height="14"><use xlink:href="#icon-yes"></use></svg>
                                                                                <span><?= $cn_plus; ?></span>
                                                                            </a>
                                                                        </li>
                                                                        <?
                                                                        //получаем колличество
                                                                        $cn_minus = 0;
                                                                        $res_minus = CIBlockElement::GetList(array(), array("IBLOCK_ID" => 17, "PROPERTY_id" => $voproses_item['ID'], "PROPERTY_tip" => 2, "PROPERTY_znak" => 'minus'));
                                                                        $cn_minus = $res_minus->SelectedRowsCount();
                                                                        ?>
                                                                        <li>
                                                                            <a href="#" class="startgolos voting-link voting-link-no" data-id="<?= $voproses_item['ID']; ?>" data-tip="2" data-znak="minus">
                                                                                <svg width="14" height="14"><use xlink:href="#icon-yes"></use></svg>
                                                                                <span><?= $cn_minus; ?></span>
                                                                            </a>
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    <? endif; ?>
                                                </div>
                                            </div>
                                        <? endforeach; ?>
                                    </div>
                                <? endif; ?>
                                    <br>
                                    <br>
                                <? endforeach; ?>
                                <!--
                                <div class="reviews-more">
                                        <a href="#" class="read-more-btn btn btn-small">
                                                <span>
                                                        <svg width="16" height="16"><use xlink:href="#icon-read-more"></use></svg>
                                                        <span>еще ответы на вопросы</span>
                                                </span>
                                        </a>
                                </div>
                                -->
                            </div>
                        <? endif; ?>
                    </section>
                </div>
            </section>
        </div>

    </div>

    <!-- //TABS -->

    <div class="product-footnote">
        Вся информация на сайте о товарах и ценах носит справочный характер и не является публичной офертой. Производитель оставляет за собой право изменять характеристики товара, его внешний вид и комплектность без предварительного уведомления продавца
    </div>

</div><!--для микроразметки-->





<script type="text/javascript">
    /*
     var <? echo $strObName; ?> = new JCCatalogElement(<? echo CUtil::PhpToJSObject($arJSParams, false, true); ?>);
     BX.message({
     ECONOMY_INFO_MESSAGE: '<? echo GetMessageJS('CT_BCE_CATALOG_ECONOMY_INFO'); ?>',
     BASIS_PRICE_MESSAGE: '<? echo GetMessageJS('CT_BCE_CATALOG_MESS_BASIS_PRICE') ?>',
     TITLE_ERROR: '<? echo GetMessageJS('CT_BCE_CATALOG_TITLE_ERROR') ?>',
     TITLE_BASKET_PROPS: '<? echo GetMessageJS('CT_BCE_CATALOG_TITLE_BASKET_PROPS') ?>',
     BASKET_UNKNOWN_ERROR: '<? echo GetMessageJS('CT_BCE_CATALOG_BASKET_UNKNOWN_ERROR') ?>',
     BTN_SEND_PROPS: '<? echo GetMessageJS('CT_BCE_CATALOG_BTN_SEND_PROPS'); ?>',
     BTN_MESSAGE_BASKET_REDIRECT: '<? echo GetMessageJS('CT_BCE_CATALOG_BTN_MESSAGE_BASKET_REDIRECT') ?>',
     BTN_MESSAGE_CLOSE: '<? echo GetMessageJS('CT_BCE_CATALOG_BTN_MESSAGE_CLOSE'); ?>',
     BTN_MESSAGE_CLOSE_POPUP: '<? echo GetMessageJS('CT_BCE_CATALOG_BTN_MESSAGE_CLOSE_POPUP'); ?>',
     TITLE_SUCCESSFUL: '<? echo GetMessageJS('CT_BCE_CATALOG_ADD_TO_BASKET_OK'); ?>',
     COMPARE_MESSAGE_OK: '<? echo GetMessageJS('CT_BCE_CATALOG_MESS_COMPARE_OK') ?>',
     COMPARE_UNKNOWN_ERROR: '<? echo GetMessageJS('CT_BCE_CATALOG_MESS_COMPARE_UNKNOWN_ERROR') ?>',
     COMPARE_TITLE: '<? echo GetMessageJS('CT_BCE_CATALOG_MESS_COMPARE_TITLE') ?>',
     BTN_MESSAGE_COMPARE_REDIRECT: '<? echo GetMessageJS('CT_BCE_CATALOG_BTN_MESSAGE_COMPARE_REDIRECT') ?>',
     SITE_ID: '<? echo SITE_ID; ?>'
     });
     */
</script>

<script>const lightbox = GLightbox({
        touchNavigation: true,
        loop: true,
        autoplayVideos: true
    });</script>

<script>
    $( document ).ready(function() {
        let basket;
        $.ajax({
            url: '/ajax/getbasket.php',
            method: 'post',
            dataType: 'html',
            data: {text: 'Текст'},
            success: function(data){
                basket = data;
                console.log(basket);
                $('.item-form').each(function(i, obj) {
                    item = $(this);
                    console.log(item.children('a').attr('data-id'));
                    $.each(JSON.parse(basket), function (index, value) {
                        if(item.children('a').attr('data-id') == value.PRODUCT_ID)
                        {
                            desc = item.children('.select-number').children('.select-number-input').attr("data-desc");
                            item.children('a').css('display','none');
                            item.children('.select-number').css('display','block');
                            item.children('.select-number').children('.select-number-input').val(parseInt(value.QUANTITY) + " " + desc);
                            item.children('.select-number').children('.select-number-input').attr('value' , parseInt(value.QUANTITY) + " " + desc);
                            //item.children('.select-number').children('.select-number-input').attr('data-value' , parseInt(value.QUANTITY));
                        }
                    });
                });
            }
        });

    });

</script>