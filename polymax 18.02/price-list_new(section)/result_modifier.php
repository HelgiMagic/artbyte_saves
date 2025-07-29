<?
if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) {
	die();
}

/**
 * @var CBitrixComponentTemplate $this
 * @var CatalogSectionComponent $component
 */
if ($_REQUEST["new"] == "Y") {
	$arNewResult = $arResult;
	unset($arNewResult["ITEMS"]);
}
if ($arResult["UF_PRICE_TITLE"]) {
	$GLOBALS["META"]["TITLE"] = $arResult["UF_PRICE_TITLE"];
}

foreach ($arResult['ITEMS'] as $key => $item) {
	$arResult['ITEMS'][$key]["TOTAL_CATALOG_QUANTITY"] = $arResult["CATALOG_QUANTITY"];
	foreach ($item['OFFERS'] as &$arOneOffer) {
		$arResult['ITEMS'][$key]["TOTAL_CATALOG_QUANTITY"] += $arOneOffer["CATALOG_QUANTITY"];
        $arResult['ITEMS'][$key]['QUANTITY'] = $arOneOffer['PRODUCT']["QUANTITY"];
	}
}

$component = $this->getComponent();
$arParams = $component->applyTemplateModifications();


foreach($arResult['ITEMS'] as $key=>$item){
 $arResult['ITEMS'][$key]['SORT_PRICE'] = null;
 $arResult['ITEMS'][$key]['SORT_TOLSHCHINA'] = null; 

 if(!empty($item['PROPERTIES']['MINIMUM_PRICE']['VALUE'])){
	 $arResult['ITEMS'][$key]['SORT_PRICE'] = $item['PROPERTIES']['MINIMUM_PRICE']['VALUE'];
 }

 if(!empty($item['PROPERTIES']['TOLSHCHINA_DLYA_SOTOVOGO']['VALUE'])){
	 $arResult['ITEMS'][$key]['SORT_TOLSHCHINA'] = $item['PROPERTIES']['TOLSHCHINA_DLYA_SOTOVOGO']['VALUE'];
 }
 else if(!empty($item['PROPERTIES']['TOLSHCHINA_DLYA_MONOLITNOGO']['VALUE'])){
	 $arResult['ITEMS'][$key]['SORT_TOLSHCHINA'] = $item['PROPERTIES']['TOLSHCHINA_DLYA_MONOLITNOGO']['VALUE'];
 }
 else if(!empty($item['PROPERTIES']['TOLSHCHINA_DLYA_KROVELNOGO']['VALUE'])){
	 $arResult['ITEMS'][$key]['SORT_TOLSHCHINA'] = $item['PROPERTIES']['TOLSHCHINA_DLYA_KROVELNOGO']['VALUE'];
 }
 else if(!empty($item['PROPERTIES']['TOLSHCHINA_DLYA_ORGSTEKLA']['VALUE'])){
	 $arResult['ITEMS'][$key]['SORT_TOLSHCHINA'] = $item['PROPERTIES']['TOLSHCHINA_DLYA_ORGSTEKLA']['VALUE'];
 }
 else if(!empty($item['PROPERTIES']['TOLSHCHINA_DLYA_PVKH']['VALUE'])){
	 $arResult['ITEMS'][$key]['SORT_TOLSHCHINA'] = $item['PROPERTIES']['TOLSHCHINA_DLYA_PVKH']['VALUE'];
 }

 if(!is_null($arResult['ITEMS'][$key]['SORT_TOLSHCHINA']) or !empty($arResult['ITEMS'][$key]['SORT_TOLSHCHINA'])){
	 $arResult['ITEMS'][$key]['SORT_TOLSHCHINA'] = preg_replace("/[a-zA-Zа-яА-Я]/", "", $arResult['ITEMS'][$key]['SORT_TOLSHCHINA']);
	 $arResult['ITEMS'][$key]['SORT_TOLSHCHINA'] = str_replace(',','.',$arResult['ITEMS'][$key]['SORT_TOLSHCHINA']); 
	 $arResult['ITEMS'][$key]['SORT_TOLSHCHINA'] = (float)$arResult['ITEMS'][$key]['SORT_TOLSHCHINA'];
 }
}


$args = array($_REQUEST['field'] => $_REQUEST['n']);
if($_REQUEST['field'] === 'SORT_TOLSHCHINA') {
	usort( $arResult['ITEMS'], function( $a, $b ) use ( $args ) {
		$res = 0;
	   
		$a = (object) $a;
		$b = (object) $b;
	   
		foreach( $args as $k => $v ){
			if( $a->$k == $b->$k ) continue;
	   
			$res = ( $a->$k < $b->$k ) ? -1 : 1;
			if( $v=='desc' ) $res= -$res;
			break;
		}
	   
		return $res;
	});
}
