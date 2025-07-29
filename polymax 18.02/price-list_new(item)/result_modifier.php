<?
/**
 * Перехватываем все картинки перед выводом,
 * режем их, складываем в кеш
 */
use \Bas\Pict;

foreach($arResult['ITEM']['OFFERS'] as $k=>$arOfferOne){
    $arResult['ITEM']['JS_OFFERS'][$k]['QUANTITY'] = $arOfferOne['PRODUCT']['QUANTITY'];
unset($arOfferOne);
}

