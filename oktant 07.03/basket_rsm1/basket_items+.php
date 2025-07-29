<?
use RSMasterSpace\RSMTools;
//минимальная сумма заказа
$mininalsumm = intval($_SESSION['props'][162811]['props']['val']['VALUE']);
?>
<input type="hidden" name="mininalsumm" id="mininalsumm" value="<?=$mininalsumm;?>">
<table class="basket-table" id="basket_items">
    <thead>
        <tr>
            <td>Товар</td>
            <td style="text-align: center;">Цена</td>
            <td style="text-align: center;">Количество</td>
            <td style="text-align: center;">Сумма</td>
            <td></td>
        </tr>
    </thead>
    <tbody>
        <? if ($normalCount >= 0): ?>
            <? foreach ($arResult["GRID"]["ROWS"] as $k => $arItem): ?>
                <? if ($arItem["DELAY"] == "N"):  // && $arItem["CAN_BUY"] == "Y"?>

                <?
                    $img = RSMTools::get_tovar_image( $arItem['PRODUCT_ID'] );
                ?>
                 <?
                $allcount = 0;
                $stores = array();
                $resStore = CCatalogStore::GetList(
                   array('PRODUCT_ID'=>'ASC','ID' => 'ASC'),
                   array('ACTIVE' => 'Y','PRODUCT_ID'=>array($arItem['PRODUCT_ID'])),
                   false,
                   false,
                   array()
                );
                while($sklad = $resStore->Fetch()){
                    unset($AMOUNT);
                    $arFilter_store = array("PRODUCT_ID"=>$arItem['PRODUCT_ID'],"STORE_ID"=>$sklad['ID']);
                    $res_store = CCatalogStoreProduct::GetList(array(),$arFilter_store,false,false,array());
                    $arRes_store = $res_store->GetNext();								
                    $AMOUNT = $arRes_store['AMOUNT'];	
                    $allcount = $allcount + intval($AMOUNT);	
                    if ($AMOUNT=='') { $AMOUNT = '-';}	
                    $sklad['AMOUNT'] = $AMOUNT;	
                    if ($sklad['ID']!=4) {
                        $stores[] = $sklad;
                    }
                }
                ?>

                    <?php $newPriceFormatted =  number_format (round ($arItem["FULL_PRICE"],2) , 2, '.', " ");
                    $arNewPriceFormatted = explode(".",$newPriceFormatted);
                    $arItem["PRICE_FORMATED"] = $arNewPriceFormatted[0].' <sup>'.$arNewPriceFormatted[1].'</sup>'; ?>

                <tr class="js_basket_item"
                    id="<?= $arItem["ID"] ?>"
                    data-item-name="<?= $arItem["NAME"] ?>"
                    data-item-quantity="<?= $arItem["QUANTITY"] ?>"
                    data-item-price="<?= $arItem["PRICE"] ?>"
                    data-item-currency="<?= $arItem["CURRENCY"] ?>"
                    >
                    <td>
                        <div class="basket-item">
                            <a href="<?=$arItem['DETAIL_PAGE_URL'];?>" class="basket-item-img">
                                <img src="<?=$img;?>" alt="<?=$arItem["NAME"]?>" title="<?=$arItem["NAME"]?>">
                            </a>
                            <div class="basket-item-body">
                                <div class="item-title">
                                    <a href="<?=$arItem['DETAIL_PAGE_URL'];?>"><?= $arItem["NAME"] ?></a>
                                </div>
                                <? //PR($arItem); ?>

                                <div class="item-code"> <?= $arItem['PROPERTY_CML2_ARTICLE_VALUE'];?> </div>

                                <?if($allcount>0):?>
                                <div class="item-state item-state-available">
                                    <div class="item-state-title">Доступно: <?=number_format($allcount,0,'',' ');?> <?=$edenica;?> <?=$arItem['MEASURE_TEXT'];?>.
                                    <!-- <? if(!empty($arItem["PROPERTIES"]["SROK_POSTAVKI"]["VALUE"])): ?>
                                        , остальные <?=$arItem["PROPERTIES"]["SROK_POSTAVKI"]["VALUE"]?>
                                    <? endif; ?> -->
                                    </div>
                                    
                                </div>
                                <?elseif(!empty($arItem["PROPERTIES"]["SROK_POSTAVKI"]["VALUE"])):?>
                                <div class="item-state item-state-available">
                                    <div class="item-state-title">Срок поставки <?=$arItem["PROPERTIES"]["SROK_POSTAVKI"]["VALUE"]?></div>
                                </div>
                                <?endif;?>

                            </div>
                        </div>
                    </td>
                    <td data-title="Цена" class="price_column">
                        <div class="item-price-current" >
                            <span id="current_price_<?=$arItem['ID'];?>"> <?=$arItem['PRICE_FORMATED'];?></span> <span class="rouble">q</span>
                        </div>
						<? if ($arItem['PRICE_FORMATED'] < $arItem['PRICE_OLD_FORMATED'])  {
						?>
                        <div class="item-price-old">
							<span id="old_price_<?=$arItem['ID'];?> "><?=$arItem['PRICE_OLD_FORMATED'];?></span> <span class="rouble">o</span>
                        </div>

                            <? if ($arItem['PRICE_OLD']): ?>
                                <div class="item-price-discount item-price-stok-info">
                                    Скида <?=$arItem['SKIDKA'];?>%
                                </div>
						<? endif;}?>
                    </td>



                    <td data-title="Количество" style="text-align: center;">
                        <input type="hidden" id="QUANTITY_<?= $arItem['ID'] ?>" name="QUANTITY_<?= $arItem['ID'] ?>" value="<?= $arItem["QUANTITY"] ?>" />
                        <div class="select-number" style="display: inline-block;">
                            <div class="select-number-btn select-number-btn-minus in_basket"></div>
                            <input type="text"
                                   id="QUANTITY_INPUT_<?=$arItem['ID'];?>"
                                   class="select-number-input in_basket"
                                   data-min="1"
                                   data-max="100"
                                   data-desc=" <?=$arItem['MEASURE_TEXT'];?>."
                                   value="<?=$arItem['QUANTITY'];?> <?=$arItem['MEASURE_TEXT'];?>."
                                   
                                   >
                            <div  class="select-number-btn select-number-btn-plus in_basket"></div>
                                <?
                                if(!empty($arItem["PROPERTIES"]["KRATNOST_PRODAZHI"]["VALUE"]))
                                {
                                    if($arItem["PROPERTIES"]["OTGRUZHAT_UPAKOVKAMI"]["VALUE_XML_ID"] == "true")
                                    { 
                                    ?>
                                    <label class="label-multiplicity multiplicity-wrap"><input class="multiplicity" disabled checked data-id="<?=$arItem["ID"]?>" multiplicity="<?=$arItem["PROPERTIES"]["KRATNOST_PRODAZHI"]["VALUE"]?>" type="checkbox"/> Упаковка: <?=$arItem["PROPERTIES"]["KRATNOST_PRODAZHI"]["VALUE"]?> <?=$arItem['MEASURE_TEXT'];?></label>
                                    <?
                                    }
                                    else
                                    {
                                    ?>
                                        <label class="label-multiplicity multiplicity-wrap"><input class="multiplicity" data-id="<?=$arItem["ID"]?>" multiplicity="<?=$arItem["PROPERTIES"]["KRATNOST_PRODAZHI"]["VALUE"]?>" type="checkbox"/> Упаковка: <?=$arItem["PROPERTIES"]["KRATNOST_PRODAZHI"]["VALUE"]?> <?=$arItem['MEASURE_TEXT'];?></label>
                                    <?
                                    }
                                }
                                else
                                {
                                    ?>
                                    <label style="display: none;" class="label-multiplicity multiplicity-wrap"><input class="multiplicity" data-id="<?=$arItem["ID"]?>" multiplicity="1" type="checkbox"/></label>
                                    <?
                                }
                                ?>
                        </div>    
                    </td>



                    <td data-title="Сумма" class="sum_column">
                        <div class="basket-sum">
                            <div class="item-price-current" >
                                <span id="sum_<?=$arItem['ID'];?>"> <?= RSMTools::price_format($arItem['SUM_VALUE']);?> </span> <span class="rouble">q</span>
                            </div>
                        </div>
                    </td>

                    <td data-title="" class="actions_column">
                            <div class="basket-links-wrapp">
                                <ul class="basket-links">
                                    <li>
                                        <a href="<?=str_replace("#ID#", $arItem["ID"], $arUrls["delete"])?>" class="basket-link basket-link-del">
                                            <i><svg width="10" height="13"><use xlink:href="#icon-del"></use></svg></i>
                                            <span>Удалить</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" class="basket-link basket-link-compare js_togle_compare" data-id="<?=$arItem['PRODUCT_ID'];?>" >
                                            <i><svg width="14" height="11"><use xlink:href="#icon-compare"></use></svg></i>
                                            <span>Сравнить</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="<?=str_replace("#ID#", $arItem["ID"], $arUrls["delay"])?>" class="basket-link basket-link-postpone">
                                            <i><svg width="12" height="12"><use xlink:href="#icon-clock"></use></svg></i>
                                            <span>Отложить</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" class="basket-link basket-link-favorites js_togle_favorite" data-id="<?=$arItem['PRODUCT_ID'];?>" data-title="Товар добавлен в избранное">
                                            <i><svg width="13" height="12"><use xlink:href="#icon-favorites"></use></svg></i>
                                            <span>Избранное</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                    </td>

                </tr>
                <? endif; ?>
            <? endforeach; ?>
        <? endif; ?>
    </tbody>

    <tfoot>
        <tr>
            <td colspan="3">
                <a href="/catalog/" class="back-link">
                    <svg width="10" height="6"><use xlink:href="#icon-arrow-small"></use></svg>
                    <span>Продолжить покупки</span>
                </a>
            </td>
            <td colspan="2">
                <div class="basket-total-wrapp">
                    <div class="basket-total-body">
                        <div class="basket-total">
                            <div class="basket-total-line basket-total-sum">
                                <div class="basket-total-title">Итого с НДС</div>
                                <div class="basket-total-divider"></div>
                                <div class="basket-total-data">
                                    <div class="item-price-current"> <span id="allSum"> <?= RSMTools::price_format($arResult["allSum"]);?></span> <span class="rouble">q</span></div>
                                </div>
                            </div>
                        </div>
                        <ul class="basket-btns">
                            <!--<li><a href="javascript:void(0)" onclick="basket_one_click();"  class="btn btn-block btn-alt basket-fast-buy">Отправить заказ</a></li>-->
                            <li>
								<?
								$showoformbtn = (round($arResult["allSum"])>=$mininalsumm)?(true):(false);							
								?>
								<a href="/personal/order/make/" id="cartbtnorder" class="btn btn-block basket-submit<?if(!$showoformbtn):?> hidecartbtn<?endif;?>">Оформить заказ</a>
								<a href="/catalog/" id="cartbtncatalog" class="btn minimalsummbtn<?if($showoformbtn):?> hidecartbtn<?endif;?>">Минимальная сумма заказа <?=$mininalsumm;?> &#8381;</a>
							</li>
                        </ul>
                    </div>
                </div>
            </td>

        </tr>
    </tfoot>


</table>

        <input type="hidden" id="action_var" value="<?= htmlspecialcharsbx($arParams["ACTION_VARIABLE"]) ?>" />

		<input type="hidden" id="column_headers" value="<?= htmlspecialcharsbx(implode(",", $arHeaders ?? [])) ?><?/*= htmlspecialcharsbx(implode($arHeaders, ",")) */?>" />
		<input type="hidden" id="offers_props" value="<?= htmlspecialcharsbx(implode(",", $arParams["OFFERS_PROPS"])) ?><?/*= htmlspecialcharsbx(implode($arParams["OFFERS_PROPS"], ",")) */?>" />
        <input type="hidden" id="quantity_float" value="<?= ($arParams["QUANTITY_FLOAT"] == "Y") ? "Y" : "N" ?>" />
        <input type="hidden" id="price_vat_show_value" value="<?= ($arParams["PRICE_VAT_SHOW_VALUE"] == "Y") ? "Y" : "N" ?>" />
        <input type="hidden" id="hide_coupon" value="<?= ($arParams["HIDE_COUPON"] == "Y") ? "Y" : "N" ?>" />
        <input type="hidden" id="use_prepayment" value="<?= ($arParams["USE_PREPAYMENT"] == "Y") ? "Y" : "N" ?>" />
        <input type="hidden" id="auto_calculation" value="<?= ($arParams["AUTO_CALCULATION"] == "N") ? "N" : "Y" ?>" />


<?/*


<div class="bx_ordercart_order_pay_left" id="coupons_block">
    <? if ($arParams["HIDE_COUPON"] != "Y") { ?>
        <div class="bx_ordercart_coupon">
            <span><?= GetMessage("STB_COUPON_PROMT") ?></span>
            <input type="text" id="coupon" name="COUPON" value="" onchange="enterCoupon();">
            &nbsp;
            <a class="bx_bt_button bx_big" href="javascript:void(0)" onclick="enterCoupon();" title="<?= GetMessage('SALE_COUPON_APPLY_TITLE'); ?>"><?= GetMessage('SALE_COUPON_APPLY'); ?></a>
        </div><?
        if (!empty($arResult['COUPON_LIST'])) {
            foreach ($arResult['COUPON_LIST'] as $oneCoupon) {
                $couponClass = 'disabled';
                switch ($oneCoupon['STATUS']) {
                    case DiscountCouponsManager::STATUS_NOT_FOUND:
                    case DiscountCouponsManager::STATUS_FREEZE:
                        $couponClass = 'bad';
                        break;
                    case DiscountCouponsManager::STATUS_APPLYED:
                        $couponClass = 'good';
                        break;
                }
                ?>
                <div class="bx_ordercart_coupon">
                    <input disabled readonly type="text"
                           name="OLD_COUPON[]"
                           value="<?= htmlspecialcharsbx($oneCoupon['COUPON']); ?>"
                           class="<? echo $couponClass; ?>">
                    <span class="<? echo $couponClass; ?>"
                          data-coupon="<? echo htmlspecialcharsbx($oneCoupon['COUPON']); ?>">
                    </span>
                    <div class="bx_ordercart_coupon_notes"><?
                        if (isset($oneCoupon['CHECK_CODE_TEXT'])) {
                            echo (is_array($oneCoupon['CHECK_CODE_TEXT']) ? implode('<br>', $oneCoupon['CHECK_CODE_TEXT']) : $oneCoupon['CHECK_CODE_TEXT']);
                        }
                        ?>
                    </div>
                </div>
            <?
            }
            unset($couponClass, $oneCoupon);
        }
    } else {
        ?>
        &nbsp;
    <?
    }
    ?>
</div>
*/?>




<?/*
        <div class="bx_ordercart_order_pay">

            <div class="bx_ordercart_order_pay_left" id="coupons_block">
                <?
                if ($arParams["HIDE_COUPON"] != "Y") {
                    ?>
                    <div class="bx_ordercart_coupon">
                        <span><?= GetMessage("STB_COUPON_PROMT") ?></span><input type="text" id="coupon" name="COUPON" value="" onchange="enterCoupon();">&nbsp;<a class="bx_bt_button bx_big" href="javascript:void(0)" onclick="enterCoupon();" title="<?= GetMessage('SALE_COUPON_APPLY_TITLE'); ?>"><?= GetMessage('SALE_COUPON_APPLY'); ?></a>
                    </div><?
                    if (!empty($arResult['COUPON_LIST'])) {
                        foreach ($arResult['COUPON_LIST'] as $oneCoupon) {
                            $couponClass = 'disabled';
                            switch ($oneCoupon['STATUS']) {
                                case DiscountCouponsManager::STATUS_NOT_FOUND:
                                case DiscountCouponsManager::STATUS_FREEZE:
                                    $couponClass = 'bad';
                                    break;
                                case DiscountCouponsManager::STATUS_APPLYED:
                                    $couponClass = 'good';
                                    break;
                            }
                            ?><div class="bx_ordercart_coupon"><input disabled readonly type="text" name="OLD_COUPON[]" value="<?= htmlspecialcharsbx($oneCoupon['COUPON']); ?>" class="<? echo $couponClass; ?>"><span class="<? echo $couponClass; ?>" data-coupon="<? echo htmlspecialcharsbx($oneCoupon['COUPON']); ?>"></span><div class="bx_ordercart_coupon_notes"><?
                            if (isset($oneCoupon['CHECK_CODE_TEXT'])) {
                                echo (is_array($oneCoupon['CHECK_CODE_TEXT']) ? implode('<br>', $oneCoupon['CHECK_CODE_TEXT']) : $oneCoupon['CHECK_CODE_TEXT']);
                            }
                            ?></div></div><?
                        }
                        unset($couponClass, $oneCoupon);
                    }
                } else {
                    ?>&nbsp;<?
                        }
                        ?>
            </div>
            <div class="bx_ordercart_order_pay_right">
                <table class="bx_ordercart_order_sum">
                    <? if ($bWeightColumn && floatval($arResult['allWeight']) > 0): ?>
                        <tr>
                            <td class="custom_t1"><?= GetMessage("SALE_TOTAL_WEIGHT") ?></td>
                            <td class="custom_t2" id="allWeight_FORMATED"><?= $arResult["allWeight_FORMATED"] ?>
                            </td>
                        </tr>
                    <? endif; ?>
                    <? if ($arParams["PRICE_VAT_SHOW_VALUE"] == "Y"): ?>
                        <tr>
                            <td><? echo GetMessage('SALE_VAT_EXCLUDED') ?></td>
                            <td id="allSum_wVAT_FORMATED"><?= $arResult["allSum_wVAT_FORMATED"] ?></td>
                        </tr>
                        <?
                        $showTotalPrice = (float) $arResult["DISCOUNT_PRICE_ALL"] > 0;
                        ?>
                        <tr style="display: <?= ($showTotalPrice ? 'table-row' : 'none'); ?>;">
                            <td class="custom_t1"></td>
                            <td class="custom_t2" style="text-decoration:line-through; color:#828282;" id="PRICE_WITHOUT_DISCOUNT">
                                <?= ($showTotalPrice ? $arResult["PRICE_WITHOUT_DISCOUNT"] : ''); ?>
                            </td>
                        </tr>
                        <?
                        if (floatval($arResult['allVATSum']) > 0):
                            ?>
                            <tr>
                                <td><? echo GetMessage('SALE_VAT') ?></td>
                                <td id="allVATSum_FORMATED"><?= $arResult["allVATSum_FORMATED"] ?></td>
                            </tr>
                            <?
                        endif;
                        ?>
                    <? endif; ?>
                    <tr>
                        <td class="fwb"><?= GetMessage("SALE_TOTAL") ?></td>
                        <td class="fwb" id="allSum_FORMATED"><?= str_replace(" ", "&nbsp;", $arResult["allSum_FORMATED"]) ?></td>
                    </tr>


                </table>
                <div style="clear:both;"></div>
            </div>
            <div style="clear:both;"></div>
            <div class="bx_ordercart_order_pay_center">

                <? if ($arParams["USE_PREPAYMENT"] == "Y" && strlen($arResult["PREPAY_BUTTON"]) > 0): ?>
                    <?= $arResult["PREPAY_BUTTON"] ?>
                    <span><?= GetMessage("SALE_OR") ?></span>
                <? endif; ?>
                <?
                if ($arParams["AUTO_CALCULATION"] != "Y") {
                    ?>
                    <a href="javascript:void(0)" onclick="updateBasket();" class="checkout refresh"><?= GetMessage("SALE_REFRESH") ?></a>
                    <?
                }
                ?>
                <a href="javascript:void(0)" onclick="checkOut();" class="checkout"><?= GetMessage("SALE_ORDER") ?></a>
            </div>
        </div>
 *
 *
 */ ?>
