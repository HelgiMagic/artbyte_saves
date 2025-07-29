<? if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) die();

/**
 * @var array $arParams
 * @var array $templateData
 * @var string $templateFolder
 * @var CatalogSectionComponent $component
 */

global $APPLICATION;

if (isset($templateData['TEMPLATE_THEME']))
{
	$APPLICATION->SetAdditionalCSS($templateFolder.'/themes/'.$templateData['TEMPLATE_THEME'].'/style.css');
	$APPLICATION->SetAdditionalCSS('/bitrix/css/main/themes/'.$templateData['TEMPLATE_THEME'].'/style.css', true);
}

if (!empty($templateData['TEMPLATE_LIBRARY']))
{
	$loadCurrency = false;
	if (!empty($templateData['CURRENCIES']))
	{
		$loadCurrency = \Bitrix\Main\Loader::includeModule('currency');
	}

	CJSCore::Init($templateData['TEMPLATE_LIBRARY']);

	if ($loadCurrency)
	{
		?>
		<script>
			BX.Currency.setCurrencies(<?=$templateData['CURRENCIES']?>);
		</script>
		<?
	}
}

//	lazy load and big data json answers
$request = \Bitrix\Main\Context::getCurrent()->getRequest();
if ($request->isAjaxRequest() && ($request->get('action') === 'showMore' || $request->get('action') === 'deferredLoad'))
{
	$content = ob_get_contents();
	ob_end_clean();

	list(, $itemsContainer) = explode('<!-- items-container -->', $content);
	list(, $paginationContainer) = explode('<!-- pagination-container -->', $content);

	if ($arParams['AJAX_MODE'] === 'Y')
	{
		$component->prepareLinks($paginationContainer);
	}

	$component::sendJsonAnswer(array(
		'items' => $itemsContainer,
		'pagination' => $paginationContainer
	));
}

#pprint_r($arResult);

/*
if($arResult["UF_H1_PRICE"]){
	$APPLICATION->SetTitle($arResult["UF_H1_PRICE"]);
}elseif($arResult["IPROPERTY_VALUES"]["SECTION_PAGE_TITLE"]){
	$APPLICATION->SetTitle($arResult["IPROPERTY_VALUES"]["SECTION_PAGE_TITLE"]);
}else{
	$APPLICATION->SetTitle($arResult["NAME"]);
}
*/

#echo $arResult["UF_PRICE_TITLE"];
#pprint_r($arResult);

if($GLOBALS["META"]["TITLE"]) $arResult["UF_PRICE_TITLE"]=$GLOBALS["META"]["TITLE"];

#echo $arResult["UF_PRICE_TITLE"];

if($arResult["UF_PRICE_TITLE"]){
	$APPLICATION->SetPageProperty("title", $arResult["UF_PRICE_TITLE"].' | Компания Полимакс');
}elseif($arResult["IPROPERTY_VALUES"]["SECTION_META_TITLE"]){
	$APPLICATION->SetPageProperty("title", "Прайс-лист на ".$arResult["IPROPERTY_VALUES"]["SECTION_META_TITLE"].' | Компания Полимакс');
}else{
	$APPLICATION->SetPageProperty("title", "Прайс-лист на ".$arResult["NAME"].' | Компания Полимакс');
}

?>