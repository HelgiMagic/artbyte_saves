<?if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true)die();
/** @var array $arParams */
/** @var array $arResult */
/** @var array $arUrls */
/** @var array $arHeaders */
?>


<? if ($normalCount >= 0): ?>
    <div class="items-row items-row-full flex-row" id="delayed_items">
        <? foreach ($arResult["GRID"]["ROWS"] as $k => $arItem): ?>
            <? if ($arItem["DELAY"] == "Y" ): // || $arItem["CAN_BUY"] != "Y" ?>
                <? include($_SERVER["DOCUMENT_ROOT"].$templateFolder."/basket_one_item_delayed.php"); ?> 
            <? endif; ?>
        <? endforeach; ?>
    </div>
<? endif; ?>
