<?
use RSMasterSpace\RSMTools;

$item = $arItem;

$brandarr = RSMTools::get_Brand_byName( $item['PROPERTIES']['CML2_MANUFACTURER']['VALUE'] );
//PR($brandarr);



//var_dump($brandarr);
$tid = $item['ID'];
$name = $item['NAME'];
$tovurl = $item['DETAIL_PAGE_URL'];
$tovcod = $item['PROPERTIES']['CML2_ARTICLE']['VALUE'];
//фотографии
$fotos = array();
if (!empty($item['PREVIEW_PICTURE_SRC'])) {
    $maining = $item['PREVIEW_PICTURE_SRC'];
} else {
    if ((!empty($item['PROPERTIES']['FOTO']['VALUE']))AND(file_exists($_SERVER["DOCUMENT_ROOT"].$item['PROPERTIES']['FOTO']['VALUE']))) {
            $maining = trim($item['PROPERTIES']['FOTO']['VALUE']);
    }
    else {
            $maining =  SITE_TEMPLATE_PATH.'/img/nophotoimg.png';
    } 
} 
$fotos[] = $maining;
if (!empty($item['PROPERTIES']['PHOTOS']['VALUE'])) {
	foreach ($item['PROPERTIES']['PHOTOS']['VALUE'] as $foto):
		$fotos[] = CFile::GetPath($foto);
	endforeach;
}
//фото из свойств
if ((!empty($item['PROPERTIES']['FOTO_2']['VALUE']))AND(file_exists($_SERVER["DOCUMENT_ROOT"].$item['PROPERTIES']['FOTO_2']['VALUE']))) {
	$fotos[] = trim($item['PROPERTIES']['FOTO_2']['VALUE']);
}
if ((!empty($item['PROPERTIES']['FOTO_3']['VALUE']))AND(file_exists($_SERVER["DOCUMENT_ROOT"].$item['PROPERTIES']['FOTO_3']['VALUE']))) {
	$fotos[] = trim($item['PROPERTIES']['FOTO_3']['VALUE']); 
}




//видео
$video = trim($item['PROPERTIES']['VIDEO']['VALUE']);

//флажки акция, хит, новинка
$stock = $item['PROPERTIES']['AKTSIYA']['VALUE'];
$hit = $item['PROPERTIES']['KHIT_PRODAZH']['VALUE'];
//срок выбора новик
include($_SERVER["DOCUMENT_ROOT"]."/".SITE_TEMPLATE_PATH."/inc/novsparam.php");	
if ((strtotime($item['DATE_CREATE']))>$last7days) {
	$new = true;
}
else {
	$new = false;
}


//цены
$currentprice = $item['PRICE'];
$oldprice = $item['PRICE_OLD'];
$skidka = $item['SKIDKA'];


//склады
$stores = $item['STORES'];


//Отзывы и Вопросы-ответы
$arReviews = RSMTools::get_Voprosy_and_Otzivy($tid);


//ед.измерения и кратность
$edenica = $item['MEASURE_TEXT'];
$kratnost = $item['MEASURE_RATIO'];
?>



<div class="items-col flex-row-item">
    <div class="item js_delayed_item"  
        id="<?= $item["ID"] ?>"
        data-item-name="<?= $item["NAME"] ?>"
        data-item-quantity="<?= $item["QUANTITY"] ?>"
        data-item-price="<?= $item["PRICE"] ?>"
        data-item-currency="<?= $item["CURRENCY"] ?>" >
        <div class="item-img-body">
            <div class="item-img-slider" <? if ($video): ?>data-item-video="<?= $video; ?>"<? endif; ?>>
                <?
                foreach ($fotos as $f):
                    $cn = 1;
                    ?>
                    <div class="item-img-slide">
                        <a href="<?= $tovurl; ?>" class="item-img">
                            <img src="<?= $f; ?>" alt="<?= $name; ?> фото <?= $cn; ?>">
                        </a>
                    </div>
                    <?
                    $cn++;
                endforeach;
                ?>
            </div>
            <ul class="item-grid-links">
                <li>
                    <a href="#" class="item-compare-link js_togle_compare" data-id="<?= $item['PRODUCT_ID']; ?>" data-title="Товар добавлен к сравнению">
                        <i><svg width="14" height="11"><use xlink:href="#icon-compare"></use></svg></i>
                    </a>
                </li>
                <li>
                    <a href="#" class="item-favorites-link js_togle_favorite" data-id="<?= $item['PRODUCT_ID']; ?>" data-title="Товар добавлен в избранное">
                        <i><svg width="13" height="12"><use xlink:href="#icon-favorites"></use></svg></i>
                    </a>
                </li>
            </ul>
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
            <? if ($skidka): ?>
                <div class="item-stock">–<?= $skidka; ?>%</div>
            <? endif; ?>
            <?
            if ($brandarr):
                $brandurl = '/brands/' . $brandarr['ID'] . '/';
                if (!empty($brandarr['PICTURE'])) {
                    $brandimg = CFile::GetPath($brandarr['PICTURE']);
                } else {
                    $brandimg = SITE_TEMPLATE_PATH . '/img/nophotoimg.png';
                }
                ?>		
                <a href="<?= $brandurl; ?>" class="item-brand">
                    <img src="<?= $brandimg; ?>" alt="<?= $brandarr['NAME']; ?>">
                </a>
            <? endif; ?>
        </div>
        <div class="item-info-body">
            <div class="item-title">
                <a href="<?= $tovurl; ?>"><?= $name; ?></a>
            </div>
            <div class="item-info">
                <div class="item-code"><?= $tovcod; ?></div>
                <a href="<?= $tovurl; ?>#product-reviews">
                    <div class="item-rating">					
                        <div class="rating" data-rating="<?= $arReviews['otzivy']['rating']; ?>">
                            <div class="rating-state"></div>
                        </div>					
                        <div class="item-rating-desc">
                            <a href="<?= $tovurl; ?>#product-reviews"><?= $arReviews['otzivy']['count']; ?> <?= $arReviews['otzivy']['text']; ?></a> 
                            &nbsp;|&nbsp; 
                            <a href="<?= $tovurl; ?>#product-questions"><?= $arReviews['otvety']['count']; ?> <?= $arReviews['otvety']['text']; ?></a>
                        </div>
                    </div>
                </a>

                <? if (count($stores) > 0): ?>
                    <div class="item-state item-state-available">
                        <div class="item-state-title">На складе <?=$arItem['AVAILABLE_QUANTITY'];?> <?= $edenica; ?>.</div>
                        <div class="item-state-info">
                            <div class="item-state-info-link">?</div>
                            <div class="item-state-info-tooltip">
                                <div class="item-state-tooltip-body">
                                    <table class="item-state-table">
                                        <thead>
                                            <tr>
                                                <td>Склад</td>
                                                <td>Кол-во</td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <?
                                            foreach ($stores as $store):
                                                ?>
                                                <tr>
                                                    <td><?= $store['TITLE']; ?></td>
                                                    <td><?= $store['AMOUNT']; ?> <?= $edenica; ?></td>
                                                </tr>
                                            <? endforeach; ?>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                <? else: ?>
                    <div class="item-state item-state-expected">
                        <div class="item-state-title">Ожидается поступление</div>
                        <div class="item-state-info">
                            <div class="item-state-info-link tooltipstered">?</div>
                            <div class="item-state-info-tooltip">
                                <div class="item-state-tooltip-body">
                                    Ожидается поступление товара						
                                </div>
                            </div>
                        </div>
                    </div>
                <? endif; ?>

            </div>
        </div>
        <div class="item-form-body">		
            <div class="item-prices">
                <div class="item-price-current"> <?= RSMTools::price_format($currentprice);?> <span class="rouble">q</span></div>
                <? if ((!empty($oldprice))AND($currentprice != $oldprice)): ?> 
                    <div class="item-price-old"> <?= RSMTools::price_format($oldprice);?> <span class="rouble">o</span></div>
                <? elseif (!empty($currentprice)): ?>
                    <a href="#modal-descount" data-id="<?= $tid; ?>" class="item-stock-btn btn modal-open-btn">Узнать скидку</a>
                <? endif; ?>
            </div>
            <div class="item-form">
                <input type="hidden" id="QUANTITY_<?= $item['ID'] ?>" name="QUANTITY_<?= $item['ID'] ?>" value="<?= $item["QUANTITY"] ?>" />
                <div style="display:none;">
                    <? if ((!empty($currentprice))OR ( !empty($oldprice))): ?>
                        <div class="select-number">
                            <div class="select-number-btn select-number-btn-minus in_basket"
                                 onclick="setQuantity(<?= $item["ID"] ?>, <?= $item["MEASURE_RATIO"] ?>, 'down');"
                                 ></div>
                            <input type="text" 
                                   id="QUANTITY_INPUT_<?=$item['ID'];?>"
                                   class="select-number-input in_basket" 
                                   data-min="1" 
                                   data-max="1000" 
                                   data-desc=" <?= $edenica; ?>." 
                                   value="<?=$item['QUANTITY'];?> <?= $edenica; ?>."
                                   onchange="updateQuantity('QUANTITY_INPUT_<?= $item["ID"] ?>', '<?= $item["ID"] ?>', <?= $ratio ?>)"
                                   >
                            <div  class="select-number-btn select-number-btn-plus in_basket"
                                  onclick="setQuantity(<?= $item["ID"] ?>, <?= $item["MEASURE_RATIO"] ?>, 'up');"
                                  ></div>
                        </div>
                    <? else: ?>
                        <div class="notovars">
                            Нет в наличии
                        </div>
                    <? endif; ?>
                </div>
                <a href="<?=str_replace("#ID#", $arItem["ID"], $arUrls["delete"])?>" class="item-basket-btn in_basket btn_delete" style="margin-right: 10px;">
                    <i><svg width="10" height="13"><use xlink:href="#icon-del"></use></svg></i>
                    <span>Удалить</span>
                </a>                
                
                <a href="<?=str_replace("#ID#", $item["ID"], $arUrls["add"])?>" class="item-basket-btn in_basket">
                    <svg width="16" height="15"><use xlink:href="#icon-basket"></use></svg>
                    <span>Вернуть в корзину</span>
                </a>
                
            </div>
            <ul class="item-list-links">
                <li>
                    <a href="#" class="item-compare-link" data-id="<?= $item['ID']; ?>" data-title="Товар добавлен к сравнению">
                        <i><svg width="14" height="11"><use xlink:href="#icon-compare"></use></svg></i>
                        <span>Сравнить</span>
                    </a>
                </li>
                <li>
                    <a href="#" class="item-favorites-link" data-id="<?= $item['ID']; ?>" data-title="Товар добавлен в избранное">
                        <i><svg width="13" height="12"><use xlink:href="#icon-favorites"></use></svg></i>
                        <span>В избранное</span>
                    </a>
                </li>
            </ul>
        </div>
    </div>
    
</div>    