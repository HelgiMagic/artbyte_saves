<?
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true)
    die();
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
/** @var CBitrixBasketComponent $component */
$templateData = array(
    'TEMPLATE_THEME' => $this->GetFolder() . '/themes/' . $arParams['TEMPLATE_THEME'] . '/style.css',
    'TEMPLATE_CLASS' => 'bx_' . $arParams['TEMPLATE_THEME'],
);
//$this->addExternalCss($templateData['TEMPLATE_THEME']);

$curPage = $APPLICATION->GetCurPage() . '?' . $arParams["ACTION_VARIABLE"] . '=';
$arUrls = array(
    "delete" => $curPage . "delete&id=#ID#",
    "delay" => $curPage . "delay&id=#ID#",
    "add" => $curPage . "add&id=#ID#",
);
unset($curPage);

$arParams['USE_ENHANCED_ECOMMERCE'] = isset($arParams['USE_ENHANCED_ECOMMERCE']) && $arParams['USE_ENHANCED_ECOMMERCE'] === 'Y' ? 'Y' : 'N';
$arParams['DATA_LAYER_NAME'] = isset($arParams['DATA_LAYER_NAME']) ? trim($arParams['DATA_LAYER_NAME']) : 'dataLayer';
$arParams['BRAND_PROPERTY'] = isset($arParams['BRAND_PROPERTY']) ? trim($arParams['BRAND_PROPERTY']) : '';

$arBasketJSParams = array(
    'SALE_DELETE' => GetMessage("SALE_DELETE"),
    'SALE_DELAY' => GetMessage("SALE_DELAY"),
    'SALE_TYPE' => GetMessage("SALE_TYPE"),
    'TEMPLATE_FOLDER' => $templateFolder,
    'DELETE_URL' => $arUrls["delete"],
    'DELAY_URL' => $arUrls["delay"],
    'ADD_URL' => $arUrls["add"],
    'EVENT_ONCHANGE_ON_START' => (!empty($arResult['EVENT_ONCHANGE_ON_START']) && $arResult['EVENT_ONCHANGE_ON_START'] === 'Y') ? 'Y' : 'N',
    'USE_ENHANCED_ECOMMERCE' => $arParams['USE_ENHANCED_ECOMMERCE'],
    'DATA_LAYER_NAME' => $arParams['DATA_LAYER_NAME'],
    'BRAND_PROPERTY' => $arParams['BRAND_PROPERTY']
);

//PR($arBasketJSParams);
?>
<script type="text/javascript">
    var basketJSParams = <?= CUtil::PhpToJSObject($arBasketJSParams); ?>;
</script>
<?
$APPLICATION->AddHeadScript($templateFolder . "/script.js");


include 'functions.php';
?>

<? if (strlen($arResult["ERROR_MESSAGE"]) <= 0): ?>

    <div id="warning_message">
        <?
        if (!empty($arResult["WARNING_MESSAGE"]) && is_array($arResult["WARNING_MESSAGE"])) {
            foreach ($arResult["WARNING_MESSAGE"] as $v)
                ShowError($v);
        }
        ?>
    </div>
    <?
    $normalCount = count($arResult["ITEMS"]["AnDelCanBuy"]);
    $normalHidden = ($normalCount == 0) ? 'hidden' : '';

    $delayCount = count($arResult["ITEMS"]["DelDelCanBuy"]);
    $delayHidden = ($delayCount <= 0) ? 'hidden' : '';
    
    

    $subscribeCount = count($arResult["ITEMS"]["ProdSubscribe"]);
    $subscribeHidden = ($subscribeCount == 0) ? 'hidden' : '';

    $naCount = count($arResult["ITEMS"]["nAnCanBuy"]);
    $naHidden = ($naCount == 0) ? 'hidden' : '';

    foreach (array_keys($arResult['GRID']['HEADERS']) as $id) {
        $data = $arResult['GRID']['HEADERS'][$id];
        $headerName = (isset($data['name']) ? (string) $data['name'] : '');
        if ($headerName == '')
            $arResult['GRID']['HEADERS'][$id]['name'] = GetMessage('SALE_' . $data['id']);
        unset($headerName, $data);
    }
    unset($id);


    // onclick="showBasketItemsList()" 
    // onclick="showBasketItemsList(2)"
    $normalActive = ($normalCount>0) ? 'active' : '';
    $delayActive =  ($delayCount>0 && $normalCount<=0) ? 'active' : '';
    ?>


    <? if (($normalCount > 0) || ($delayCount > 0)): ?>

        <ul class="tabs-nav " data-tabs="#basket-tabs">
        <? if ($normalCount > 0): ?>
                <li class="<?=$normalActive;?> <?= $normalHidden; ?>"><a href="#basket-tab-1" >Готовые к заказу товары  <span id="normal_count" class="flat" style="display:none;" >&nbsp;(<?= $normalCount ?>)</span> </a></li>
            <? endif; ?>
            <? if ($delayCount > 0): ?>
                <li class="<?=$delayActive;?> <?= $delayHidden ?>" ><a href="#basket-tab-2" >Отложенные товары <span id="delay_count" class="flat" style="display:none;">&nbsp;(<?= $delayCount ?>)</span> </a></li>
            <? endif; ?>
            <? //subscribed and not_available not use in this template  ?> 
        </ul>


        <div id="basket-tabs" class="tabs-wrapp">
            <?if ($normalCount>0): ?>
                <div id="basket-tab-1" class="tab-block <?=$normalActive;?>">
                    <? include($_SERVER["DOCUMENT_ROOT"] . $templateFolder . "/basket_items.php"); ?>
                </div>
            <?endif;?>
            <? if ($delayCount > 0): ?>
                <div id="basket-tab-2" class="tab-block <?=$delayActive;?>">
                    <? include($_SERVER["DOCUMENT_ROOT"] . $templateFolder . "/basket_items_delayed.php"); ?>
                </div>
            <? endif; ?>
       </div>


    <? else: ?>
        <p>невозможная ситуация</p>

    <? endif; ?>

<? else: ?>
    

        <div class="empty-block">
            <div class="empty-block-icon">
                <img src="<?=SITE_TEMPLATE_PATH.'/img/empty-icon.svg';?>" alt="img-empty-basket">
            </div>
            <div class="empty-block-info">
                <div class="empty-block-desc">
                    <p><? ShowError($arResult["ERROR_MESSAGE"]); ?></p>
                    <p>Добавьте первые товары, перейдя в наш каталог</p>
                </div>
                <a href="/catalog/" class="btn btn-small">Перейти в каталог</a>
            </div>
        </div>
    
<? endif; ?>