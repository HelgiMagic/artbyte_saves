<?if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true)die();
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

// сколько элементов изначально показываем
$maxVisible    = 6;

// Восстановление состояний «показать всё/скрыть» из cookie
$toggleStates  = [];
if (isset($_COOKIE['toggleStates'])) {
    $decoded = json_decode($_COOKIE['toggleStates'], true);
    if (is_array($decoded)) {
        $toggleStates = $decoded;
    }
}

// Восстановление текстов поиска из cookie
$searchStates  = [];
if (isset($_COOKIE['searchStates'])) {
    $decoded = json_decode($_COOKIE['searchStates'], true);
    if (is_array($decoded)) {
        $searchStates = $decoded;
    }
}

//var_dump($arResult);
?>

<script>
  // Передаём на клиент начальные состояния
  window.maxVisible    = <?= (int)$maxVisible ?>;
  window.toggleStates  = <?= json_encode($toggleStates, JSON_UNESCAPED_UNICODE) ?>;
  window.searchStates  = <?= json_encode($searchStates, JSON_UNESCAPED_UNICODE) ?>;
</script>
				<div class="products-col products-col-sidebar products-col-sidebar-filter flex-row-item">
					<div class="products-sidebar-filter">
						<a href="#" class="products-sidebar-filter-close"></a>
						<div class="products-sidebar-filter-body">
							<form name="<?echo $arParams["FILTER_NAME"]."_form"?>" action="<?echo $arResult["FORM_ACTION"]?>" method="get" class="smartfilter">								
								<?
								foreach($arResult["HIDDEN"] as $arItem):
								if ($arItem["CONTROL_NAME"]!='HIDE_NOT_AVAILABLE') {
								?>
								<input type="hidden" name="<?echo $arItem["CONTROL_NAME"]?>" id="<?echo $arItem["CONTROL_ID"]?>" value="<?echo $arItem["HTML_VALUE"]?>" />
								<?
								}
								endforeach;?>
								<?
								//prices
								foreach($arResult["ITEMS"] as $key=>$arItem)	{
									$key = $arItem["ENCODED_ID"];
									//выпиливаем ползунок с ценами!!!
									/*if(isset($arItem["PRICE"])):
										if ($arItem["VALUES"]["MAX"]["VALUE"] - $arItem["VALUES"]["MIN"]["VALUE"] <= 0)
											continue;

										$step_num = 4;
										$step = ($arItem["VALUES"]["MAX"]["VALUE"] - $arItem["VALUES"]["MIN"]["VALUE"]) / $step_num;
										$prices = array();
										if (Bitrix\Main\Loader::includeModule("currency"))
										{
											for ($i = 0; $i < $step_num; $i++)
											{
												$prices[$i] = CCurrencyLang::CurrencyFormat($arItem["VALUES"]["MIN"]["VALUE"] + $step*$i, $arItem["VALUES"]["MIN"]["CURRENCY"], false);
											}
											$prices[$step_num] = CCurrencyLang::CurrencyFormat($arItem["VALUES"]["MAX"]["VALUE"], $arItem["VALUES"]["MAX"]["CURRENCY"], false);
										}
										else
										{
											$precision = $arItem["DECIMALS"]? $arItem["DECIMALS"]: 0;
											for ($i = 0; $i < $step_num; $i++)
											{
												$prices[$i] = number_format($arItem["VALUES"]["MIN"]["VALUE"] + $step*$i, $precision, ".", "");
											}
											$prices[$step_num] = number_format($arItem["VALUES"]["MAX"]["VALUE"], $precision, ".", "");
										}										
										$pmin = floor($arItem["VALUES"]["MIN"]["VALUE"]);										
										$pmax = round($arItem["VALUES"]["MAX"]["VALUE"]);
										$selectmin = $pmin;
										$selectmax = $pmax;
										if (!empty($arItem["VALUES"]["MIN"]["HTML_VALUE"])):
											$selectmin = $arItem["VALUES"]["MIN"]["HTML_VALUE"];
										endif;
										if (!empty($arItem["VALUES"]["MAX"]["HTML_VALUE"])):
											$selectmax = $arItem["VALUES"]["MAX"]["HTML_VALUE"];
										endif; 
										?> 
										<div class="products-filter-col products-filter-col-price range-slider-wrapp flex-row-item">
											<div class="products-filter-price">
												<div class="products-filter-price-title"><?=$arItem["NAME"]?></div>
												<div class="products-filter-price-slider range-slider" data-min="<?=$pmin;?>" data-max="<?=$pmax;?>" data-step="1" data-value-from="<?=$selectmin;?>" data-value-to="<?=$selectmax;?>"></div>
											</div>
											<input class="min-price startfiltersearch" type="hidden" name="<?echo $arItem["VALUES"]["MIN"]["CONTROL_NAME"]?>" id="<?echo $arItem["VALUES"]["MIN"]["CONTROL_ID"]?>" value="<?=$selectmin;?>"/>
											<input class="max-price startfiltersearch" type="hidden" name="<?echo $arItem["VALUES"]["MAX"]["CONTROL_NAME"]?>" id="<?echo $arItem["VALUES"]["MAX"]["CONTROL_ID"]?>" value="<?=$selectmax;?>"/>
										</div>																												
								<?endif;*/
//выпиливаем ползунок с ценами конец!!!
								}
								?>
								
								<div class="products-sidebar-item">
									<label class="checkbox-label <?if($_REQUEST['HIDE_NOT_AVAILABLE']=='Y'):?>active<?endif;?>">
										<input type="checkbox" name="HIDE_NOT_AVAILABLE" class="checkbox startfiltersearch" value="Y" <?if($_REQUEST['HIDE_NOT_AVAILABLE']=='Y'):?>checked="checked"<?endif;?>>Товары в наличии
									</label>
								</div>	
								
								<?
								//not prices
								foreach($arResult["ITEMS"] as $key=>$arItem)
								{
									if(
										empty($arItem["VALUES"])
										|| isset($arItem["PRICE"])
									)
										continue;

									if (
										$arItem["DISPLAY_TYPE"] == "A"
										&& (
											$arItem["VALUES"]["MAX"]["VALUE"] - $arItem["VALUES"]["MIN"]["VALUE"] <= 0
										)
									)
										continue;
									?>
									<?$propname = $arItem["NAME"];
                                        $last_comma_pos = strrpos($propname, ',');
                                        if ($last_comma_pos !== false) {
                                            $propname = substr($propname, 0, $last_comma_pos);  // обрезаем строку до последней запятой
                                        }

                                        $encodedId = $arItem["ENCODED_ID"];
                                        // индекс для этого списка
                                        $idx = hexdec(substr(md5($encodedId), 0, 8)) % 10000;
                                        // предыдущее текстовое значение поиска (или пустая строка)
                                        $q = isset($searchStates[$idx]) ? $searchStates[$idx] : '';
                                        // expanded-флаг из cookie
                                        $expanded = !empty($toggleStates[$idx]);
                                    ?>
									<div class="products-sidebar-item">
										<div class="products-sidebar-item-title <?if ($arItem["DISPLAY_EXPANDED"]== "Y"):?>active<?endif;?>">
											<div class="products-sidebar-item-title-text"><?=$propname?></div>
											<?
											if (!empty($arItem['FILTER_HINT'])):
											?>
											<div class="tooltip">
												<div class="tooltip-link-custom">?</div>
												<div class="tooltip-content-wrapp">
													<div class="tooltip-content-body">														
														<div class="tooltip-desc"><?=$arItem['FILTER_HINT'];?></div>
													</div>

                                                    <div class="tooltip-arrow">
                                                        <svg width="13" height="13" viewBox="0 0 13 13" xmlns="http://www.w3.org/2000/svg">
                                                            <polygon points="6.5,13 13,0 0,0" fill="#F0F0F0"/>
                                                        </svg>
                                                    </div>
												</div>
											</div>
											<?endif;?>
											<i><svg><use xlink:href="#icon-arrow-small"></use></svg></i>
										</div>

                                        <div class="product-sidebar-search-wrapper">
                                                <input
                                                type="text"
                                                class="product-sidebar-search"
                                                placeholder="Поиск"
                                                value="<?= htmlspecialchars($q, ENT_QUOTES) ?>"
                                                />
                                                <span class="clear-icon" style="<?= $q!=='' ? '' : 'display:none;' ?>">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <line x1="4" y1="12" x2="20" y2="12" stroke="#888d96b2" stroke-width="1.3" transform="rotate(45 12 12)" />
                                                    <line x1="4" y1="12" x2="20" y2="12" stroke="#888d96b2" stroke-width="1.3" transform="rotate(-45 12 12)" />
                                                </svg>
                                                </span>
                                            </div>
										
										<div class="products-sidebar-item-list-wrapp" <?if ($arItem["DISPLAY_EXPANDED"]== "Y"):?>style="display:block;"<?endif;?>>
											
												<?	
												//var_dump($arItem["DISPLAY_TYPE"]);		
												$arCur = current($arItem["VALUES"]);
												switch ($arItem["DISPLAY_TYPE"])
												{
													case "A"://NUMBERS_WITH_SLIDER
														?>
														<div class="filter-inputs-wrapp">
														<div class="col-xs-6 bx-filter-parameters-box-container-block bx-left">
															<i class="bx-ft-sub"><?=GetMessage("CT_BCSF_FILTER_FROM")?></i>
															<div class="bx-filter-input-container">
																<input
																	class="min-price startfiltersearch"
																	type="text"
																	name="<?echo $arItem["VALUES"]["MIN"]["CONTROL_NAME"]?>"
																	id="<?echo $arItem["VALUES"]["MIN"]["CONTROL_ID"]?>"
																	value="<?echo $arItem["VALUES"]["MIN"]["HTML_VALUE"]?>"
																	size="5"
																	onkeyup="smartFilter.keyup(this)"
																	/>
															</div>
														</div>
														<div class="col-xs-6 bx-filter-parameters-box-container-block bx-right">
															<i class="bx-ft-sub"><?=GetMessage("CT_BCSF_FILTER_TO")?></i>
															<div class="bx-filter-input-container">
																<input
																	class="max-price startfiltersearch"
																	type="text"
																	name="<?echo $arItem["VALUES"]["MAX"]["CONTROL_NAME"]?>"
																	id="<?echo $arItem["VALUES"]["MAX"]["CONTROL_ID"]?>"
																	value="<?echo $arItem["VALUES"]["MAX"]["HTML_VALUE"]?>"
																	size="5"
																	onkeyup="smartFilter.keyup(this)"
																	/>
															</div>
														</div>
														</div>
														<!--
														<div class="col-xs-6 bx-filter-parameters-box-container-block bx-left">
															<i class="bx-ft-sub"><?=GetMessage("CT_BCSF_FILTER_FROM")?></i>
															<div class="bx-filter-input-container">
																<input
																	class="min-price startfiltersearch"
																	type="text"
																	name="<?echo $arItem["VALUES"]["MIN"]["CONTROL_NAME"]?>"
																	id="<?echo $arItem["VALUES"]["MIN"]["CONTROL_ID"]?>"
																	value="<?echo $arItem["VALUES"]["MIN"]["HTML_VALUE"]?>"
																	size="5"
																	onkeyup="smartFilter.keyup(this)"
																/>
															</div>
														</div>
														<div class="col-xs-6 bx-filter-parameters-box-container-block bx-right">
															<i class="bx-ft-sub"><?=GetMessage("CT_BCSF_FILTER_TO")?></i>
															<div class="bx-filter-input-container">
																<input
																	class="max-price startfiltersearch"
																	type="text"
																	name="<?echo $arItem["VALUES"]["MAX"]["CONTROL_NAME"]?>"
																	id="<?echo $arItem["VALUES"]["MAX"]["CONTROL_ID"]?>"
																	value="<?echo $arItem["VALUES"]["MAX"]["HTML_VALUE"]?>"
																	size="5"
																	onkeyup="smartFilter.keyup(this)"
																/>
															</div>
														</div>

														<div class="col-xs-10 col-xs-offset-1 bx-ui-slider-track-container">
															<div class="bx-ui-slider-track" id="drag_track_<?=$key?>">
																<?
																$precision = $arItem["DECIMALS"]? $arItem["DECIMALS"]: 0;
																$step = ($arItem["VALUES"]["MAX"]["VALUE"] - $arItem["VALUES"]["MIN"]["VALUE"]) / 4;
																$value1 = number_format($arItem["VALUES"]["MIN"]["VALUE"], $precision, ".", "");
																$value2 = number_format($arItem["VALUES"]["MIN"]["VALUE"] + $step, $precision, ".", "");
																$value3 = number_format($arItem["VALUES"]["MIN"]["VALUE"] + $step * 2, $precision, ".", "");
																$value4 = number_format($arItem["VALUES"]["MIN"]["VALUE"] + $step * 3, $precision, ".", "");
																$value5 = number_format($arItem["VALUES"]["MAX"]["VALUE"], $precision, ".", "");
																?>
																<div class="bx-ui-slider-part p1"><span><?=$value1?></span></div>
																<div class="bx-ui-slider-part p2"><span><?=$value2?></span></div>
																<div class="bx-ui-slider-part p3"><span><?=$value3?></span></div>
																<div class="bx-ui-slider-part p4"><span><?=$value4?></span></div>
																<div class="bx-ui-slider-part p5"><span><?=$value5?></span></div>

																<div class="bx-ui-slider-pricebar-vd" style="left: 0;right: 0;" id="colorUnavailableActive_<?=$key?>"></div>
																<div class="bx-ui-slider-pricebar-vn" style="left: 0;right: 0;" id="colorAvailableInactive_<?=$key?>"></div>
																<div class="bx-ui-slider-pricebar-v"  style="left: 0;right: 0;" id="colorAvailableActive_<?=$key?>"></div>
																<div class="bx-ui-slider-range" 	id="drag_tracker_<?=$key?>"  style="left: 0;right: 0;">
																	<a class="bx-ui-slider-handle left"  style="left:0;" href="javascript:void(0)" id="left_slider_<?=$key?>"></a>
																	<a class="bx-ui-slider-handle right" style="right:0;" href="javascript:void(0)" id="right_slider_<?=$key?>"></a>
																</div>
															</div>
														</div>
														-->
														<?
														/*
														$arJsParams = array(
															"leftSlider" => 'left_slider_'.$key,
															"rightSlider" => 'right_slider_'.$key,
															"tracker" => "drag_tracker_".$key,
															"trackerWrap" => "drag_track_".$key,
															"minInputId" => $arItem["VALUES"]["MIN"]["CONTROL_ID"],
															"maxInputId" => $arItem["VALUES"]["MAX"]["CONTROL_ID"],
															"minPrice" => $arItem["VALUES"]["MIN"]["VALUE"],
															"maxPrice" => $arItem["VALUES"]["MAX"]["VALUE"],
															"curMinPrice" => $arItem["VALUES"]["MIN"]["HTML_VALUE"],
															"curMaxPrice" => $arItem["VALUES"]["MAX"]["HTML_VALUE"],
															"fltMinPrice" => intval($arItem["VALUES"]["MIN"]["FILTERED_VALUE"]) ? $arItem["VALUES"]["MIN"]["FILTERED_VALUE"] : $arItem["VALUES"]["MIN"]["VALUE"] ,
															"fltMaxPrice" => intval($arItem["VALUES"]["MAX"]["FILTERED_VALUE"]) ? $arItem["VALUES"]["MAX"]["FILTERED_VALUE"] : $arItem["VALUES"]["MAX"]["VALUE"],
															"precision" => $arItem["DECIMALS"]? $arItem["DECIMALS"]: 0,
															"colorUnavailableActive" => 'colorUnavailableActive_'.$key,
															"colorAvailableActive" => 'colorAvailableActive_'.$key,
															"colorAvailableInactive" => 'colorAvailableInactive_'.$key,
														);
														*/
														?>
														<!--
														<script type="text/javascript">
															BX.ready(function(){
																window['trackBar<?=$key?>'] = new BX.Iblock.SmartFilter(<?=CUtil::PhpToJSObject($arJsParams)?>);
															});
														</script
														-->
														<?
														break;
													case "B"://NUMBERS
														?>
														<div class="filter-inputs-wrapp">
														<div class="col-xs-6 bx-filter-parameters-box-container-block bx-left">
															<i class="bx-ft-sub"><?=GetMessage("CT_BCSF_FILTER_FROM")?></i>
															<div class="bx-filter-input-container">
																<input
																	class="min-price startfiltersearch"
																	type="text"
																	name="<?echo $arItem["VALUES"]["MIN"]["CONTROL_NAME"]?>"
																	id="<?echo $arItem["VALUES"]["MIN"]["CONTROL_ID"]?>"
																	value="<?echo $arItem["VALUES"]["MIN"]["HTML_VALUE"]?>"
																	size="5"
																	onkeyup="smartFilter.keyup(this)"
																	/>
															</div>
														</div>
														<div class="col-xs-6 bx-filter-parameters-box-container-block bx-right">
															<i class="bx-ft-sub"><?=GetMessage("CT_BCSF_FILTER_TO")?></i>
															<div class="bx-filter-input-container">
																<input
																	class="max-price startfiltersearch"
																	type="text"
																	name="<?echo $arItem["VALUES"]["MAX"]["CONTROL_NAME"]?>"
																	id="<?echo $arItem["VALUES"]["MAX"]["CONTROL_ID"]?>"
																	value="<?echo $arItem["VALUES"]["MAX"]["HTML_VALUE"]?>"
																	size="5"
																	onkeyup="smartFilter.keyup(this)"
																	/>
															</div>
														</div>
														</div>
														<?
														break;
													case "G"://CHECKBOXES_WITH_PICTURES
														?>
														<div class="col-xs-12">
															<div class="bx-filter-param-btn-inline">
															<?foreach ($arItem["VALUES"] as $val => $ar):?>
																<input 
																	class="startfiltersearch"
																	style="display: none"
																	type="checkbox"
																	name="<?=$ar["CONTROL_NAME"]?>"
																	id="<?=$ar["CONTROL_ID"]?>"
																	value="<?=$ar["HTML_VALUE"]?>"
																	<? echo $ar["CHECKED"]? 'checked="checked"': '' ?>
																/>
																<?
																$class = "";
																if ($ar["CHECKED"])
																	$class.= " bx-active";
																if ($ar["DISABLED"])
																	$class.= " disabled";
																?>
																<label for="<?=$ar["CONTROL_ID"]?>" data-role="label_<?=$ar["CONTROL_ID"]?>" class="bx-filter-param-label <?=$class?>" onclick="smartFilter.keyup(BX('<?=CUtil::JSEscape($ar["CONTROL_ID"])?>')); BX.toggleClass(this, 'bx-active');">
																	<span class="bx-filter-param-btn bx-color-sl">
																		<?if (isset($ar["FILE"]) && !empty($ar["FILE"]["SRC"])):?>
																		<span class="bx-filter-btn-color-icon" style="background-image:url('<?=$ar["FILE"]["SRC"]?>');"></span>
																		<?endif?>
																	</span>
																</label>
															<?endforeach?>
															</div>
														</div>
														<?
														break;
													case "H"://CHECKBOXES_WITH_PICTURES_AND_LABELS
														?>
														<div class="col-xs-12">
															<div class="bx-filter-param-btn-block">
															<?foreach ($arItem["VALUES"] as $val => $ar):?>
																<input
																	class="startfiltersearch"
																	style="display: none"
																	type="checkbox"
																	name="<?=$ar["CONTROL_NAME"]?>"
																	id="<?=$ar["CONTROL_ID"]?>"
																	value="<?=$ar["HTML_VALUE"]?>"
																	<? echo $ar["CHECKED"]? 'checked="checked"': '' ?>
																/>
																<?
																$class = "";
																if ($ar["CHECKED"])
																	$class.= " bx-active";
																if ($ar["DISABLED"])
																	$class.= " disabled";
																?>
																<label for="<?=$ar["CONTROL_ID"]?>" data-role="label_<?=$ar["CONTROL_ID"]?>" class="bx-filter-param-label<?=$class?>" onclick="smartFilter.keyup(BX('<?=CUtil::JSEscape($ar["CONTROL_ID"])?>')); BX.toggleClass(this, 'bx-active');">
																	<span class="bx-filter-param-btn bx-color-sl">
																		<?if (isset($ar["FILE"]) && !empty($ar["FILE"]["SRC"])):?>
																			<span class="bx-filter-btn-color-icon" style="background-image:url('<?=$ar["FILE"]["SRC"]?>');"></span>
																		<?endif?>
																	</span>
																	<span class="bx-filter-param-text" title="<?=$ar["VALUE"];?>"><?=$ar["VALUE"];?><?
																	if ($arParams["DISPLAY_ELEMENT_COUNT"] !== "N" && isset($ar["ELEMENT_COUNT"])):
																		?> (<span data-role="count_<?=$ar["CONTROL_ID"]?>"><? echo $ar["ELEMENT_COUNT"]; ?></span>)<?
																	endif;?></span>
																</label>
															<?endforeach?>
															</div>
														</div>
														<?
														break;
													case "P"://DROPDOWN
														$checkedItemExist = false;
														?>
														<div class="col-xs-12">
															<div class="bx-filter-select-container">
																<div class="bx-filter-select-block" onclick="smartFilter.showDropDownPopup(this, '<?=CUtil::JSEscape($key)?>')">
																	<div class="bx-filter-select-text" data-role="currentOption">
																		<?
																		foreach ($arItem["VALUES"] as $val => $ar)
																		{
																			if ($ar["CHECKED"])
																			{
																				echo $ar["VALUE"];
																				$checkedItemExist = true;
																			}
																		}
																		if (!$checkedItemExist)
																		{
																			echo GetMessage("CT_BCSF_FILTER_ALL");
																		}
																		?>
																	</div>
																	<div class="bx-filter-select-arrow"></div>
																	<input		
																		class="startfiltersearch"	
																		style="display: none"
																		type="radio"
																		name="<?=$arCur["CONTROL_NAME_ALT"]?>"
																		id="<? echo "all_".$arCur["CONTROL_ID"] ?>"
																		value=""
																	/>
																	<?foreach ($arItem["VALUES"] as $val => $ar):?>
																		<input
																			class="startfiltersearch"
																			style="display: none"
																			type="radio"
																			name="<?=$ar["CONTROL_NAME_ALT"]?>"
																			id="<?=$ar["CONTROL_ID"]?>"
																			value="<? echo $ar["HTML_VALUE_ALT"] ?>"
																			<? echo $ar["CHECKED"]? 'checked="checked"': '' ?>
																		/>
																	<?endforeach?>
																	<div class="bx-filter-select-popup" data-role="dropdownContent" style="display: none;">
																		<ul>
																			<li>
																				<label for="<?="all_".$arCur["CONTROL_ID"]?>" class="bx-filter-param-label" data-role="label_<?="all_".$arCur["CONTROL_ID"]?>" onclick="smartFilter.selectDropDownItem(this, '<?=CUtil::JSEscape("all_".$arCur["CONTROL_ID"])?>')">
																					<? echo GetMessage("CT_BCSF_FILTER_ALL"); ?>
																				</label>
																			</li>
																		<?
																		foreach ($arItem["VALUES"] as $val => $ar):
																			$class = "";
																			if ($ar["CHECKED"])
																				$class.= " selected";
																			if ($ar["DISABLED"])
																				$class.= " disabled";
																		?>
																			<li>
																				<label for="<?=$ar["CONTROL_ID"]?>" class="bx-filter-param-label<?=$class?>" data-role="label_<?=$ar["CONTROL_ID"]?>" onclick="smartFilter.selectDropDownItem(this, '<?=CUtil::JSEscape($ar["CONTROL_ID"])?>')"><?=$ar["VALUE"]?></label>
																			</li>
																		<?endforeach?>
																		</ul>
																	</div>
																</div>
															</div>
														</div>
														<?
														break;
													case "R"://DROPDOWN_WITH_PICTURES_AND_LABELS
														?>
														<div class="col-xs-12">
															<div class="bx-filter-select-container">
																<div class="bx-filter-select-block" onclick="smartFilter.showDropDownPopup(this, '<?=CUtil::JSEscape($key)?>')">
																	<div class="bx-filter-select-text fix" data-role="currentOption">
																		<?
																		$checkedItemExist = false;
																		foreach ($arItem["VALUES"] as $val => $ar):
																			if ($ar["CHECKED"])
																			{
																			?>
																				<?if (isset($ar["FILE"]) && !empty($ar["FILE"]["SRC"])):?>
																					<span class="bx-filter-btn-color-icon" style="background-image:url('<?=$ar["FILE"]["SRC"]?>');"></span>
																				<?endif?>
																				<span class="bx-filter-param-text">
																					<?=$ar["VALUE"]?>
																				</span>
																			<?
																				$checkedItemExist = true;
																			}
																		endforeach;
																		if (!$checkedItemExist)
																		{
																			?><span class="bx-filter-btn-color-icon all"></span> <?
																			echo GetMessage("CT_BCSF_FILTER_ALL");
																		}
																		?>
																	</div>
																	<div class="bx-filter-select-arrow"></div>
																	<input
																		class="startfiltersearch"
																		style="display: none"
																		type="radio"
																		name="<?=$arCur["CONTROL_NAME_ALT"]?>"
																		id="<? echo "all_".$arCur["CONTROL_ID"] ?>"
																		value=""
																	/>
																	<?foreach ($arItem["VALUES"] as $val => $ar):?>
																		<input
																			class="startfiltersearch"
																			style="display: none"
																			type="radio"
																			name="<?=$ar["CONTROL_NAME_ALT"]?>"
																			id="<?=$ar["CONTROL_ID"]?>"
																			value="<?=$ar["HTML_VALUE_ALT"]?>"
																			<? echo $ar["CHECKED"]? 'checked="checked"': '' ?>
																		/>
																	<?endforeach?>
																	<div class="bx-filter-select-popup" data-role="dropdownContent" style="display: none">
																		<ul>
																			<li style="border-bottom: 1px solid #e5e5e5;padding-bottom: 5px;margin-bottom: 5px;">
																				<label for="<?="all_".$arCur["CONTROL_ID"]?>" class="bx-filter-param-label" data-role="label_<?="all_".$arCur["CONTROL_ID"]?>" onclick="smartFilter.selectDropDownItem(this, '<?=CUtil::JSEscape("all_".$arCur["CONTROL_ID"])?>')">
																					<span class="bx-filter-btn-color-icon all"></span>
																					<? echo GetMessage("CT_BCSF_FILTER_ALL"); ?>
																				</label>
																			</li>
																		<?
																		foreach ($arItem["VALUES"] as $val => $ar):
																			$class = "";
																			if ($ar["CHECKED"])
																				$class.= " selected";
																			if ($ar["DISABLED"])
																				$class.= " disabled";
																		?>
																			<li>
																				<label for="<?=$ar["CONTROL_ID"]?>" data-role="label_<?=$ar["CONTROL_ID"]?>" class="bx-filter-param-label<?=$class?>" onclick="smartFilter.selectDropDownItem(this, '<?=CUtil::JSEscape($ar["CONTROL_ID"])?>')">
																					<?if (isset($ar["FILE"]) && !empty($ar["FILE"]["SRC"])):?>
																						<span class="bx-filter-btn-color-icon" style="background-image:url('<?=$ar["FILE"]["SRC"]?>');"></span>
																					<?endif?>
																					<span class="bx-filter-param-text">
																						<?=$ar["VALUE"]?>
																					</span>
																				</label>
																			</li>
																		<?endforeach?>
																		</ul>
																	</div>
																</div>
															</div>
														</div>
														<?
														break;
													case "K"://RADIO_BUTTONS
														?>
														<div class="col-xs-12">
															<div class="radio">
																<label class="bx-filter-param-label" for="<? echo "all_".$arCur["CONTROL_ID"] ?>">
																	<span class="bx-filter-input-checkbox">
																		<input
																			class="startfiltersearch"
																			type="radio"
																			value=""
																			name="<? echo $arCur["CONTROL_NAME_ALT"] ?>"
																			id="<? echo "all_".$arCur["CONTROL_ID"] ?>"
																			onclick="smartFilter.click(this)"
																		/>
																		<span class="bx-filter-param-text"><? echo GetMessage("CT_BCSF_FILTER_ALL"); ?></span>
																	</span>
																</label>
															</div>
															<?foreach($arItem["VALUES"] as $val => $ar):?>
																<div class="radio">
																	<label data-role="label_<?=$ar["CONTROL_ID"]?>" class="bx-filter-param-label" for="<? echo $ar["CONTROL_ID"] ?>">
																		<span class="bx-filter-input-checkbox <? echo $ar["DISABLED"] ? 'disabled': '' ?>">
																			<input
																				class="startfiltersearch"
																				type="radio"
																				value="<? echo $ar["HTML_VALUE_ALT"] ?>"
																				name="<? echo $ar["CONTROL_NAME_ALT"] ?>"
																				id="<? echo $ar["CONTROL_ID"] ?>"
																				<?// echo $ar["CHECKED"]? 'checked="checked"': '' ?>
																				onclick="smartFilter.click(this)"
																			/>
																			<span class="bx-filter-param-text" title="<?=$ar["VALUE"];?>"><?=$ar["VALUE"];?><?
																			if ($arParams["DISPLAY_ELEMENT_COUNT"] !== "N" && isset($ar["ELEMENT_COUNT"])):
																				?>&nbsp;(<span data-role="count_<?=$ar["CONTROL_ID"]?>"><? echo $ar["ELEMENT_COUNT"]; ?></span>)<?
																			endif;?></span>
																		</span>
																	</label>
																</div>
															<?endforeach;?>
														</div>
														<?
														break;
													case "U"://CALENDAR
														?>
														<div class="col-xs-12">
															<div class="bx-filter-parameters-box-container-block"><div class="bx-filter-input-container bx-filter-calendar-container">
																<?$APPLICATION->IncludeComponent(
																	'bitrix:main.calendar',
																	'',
																	array(
																		'FORM_NAME' => $arResult["FILTER_NAME"]."_form",
																		'SHOW_INPUT' => 'Y',
																		'INPUT_ADDITIONAL_ATTR' => 'class="calendar" placeholder="'.FormatDate("SHORT", $arItem["VALUES"]["MIN"]["VALUE"]).'" onkeyup="smartFilter.keyup(this)" onchange="smartFilter.keyup(this)"',
																		'INPUT_NAME' => $arItem["VALUES"]["MIN"]["CONTROL_NAME"],
																		'INPUT_VALUE' => $arItem["VALUES"]["MIN"]["HTML_VALUE"],
																		'SHOW_TIME' => 'N',
																		'HIDE_TIMEBAR' => 'Y',
																	),
																	null,
																	array('HIDE_ICONS' => 'Y')
																);?>
															</div></div>
															<div class="bx-filter-parameters-box-container-block"><div class="bx-filter-input-container bx-filter-calendar-container">
																<?$APPLICATION->IncludeComponent(
																	'bitrix:main.calendar',
																	'',
																	array(
																		'FORM_NAME' => $arResult["FILTER_NAME"]."_form",
																		'SHOW_INPUT' => 'Y',
																		'INPUT_ADDITIONAL_ATTR' => 'class="calendar" placeholder="'.FormatDate("SHORT", $arItem["VALUES"]["MAX"]["VALUE"]).'" onkeyup="smartFilter.keyup(this)" onchange="smartFilter.keyup(this)"',
																		'INPUT_NAME' => $arItem["VALUES"]["MAX"]["CONTROL_NAME"],
																		'INPUT_VALUE' => $arItem["VALUES"]["MAX"]["HTML_VALUE"],
																		'SHOW_TIME' => 'N',
																		'HIDE_TIMEBAR' => 'Y',
																	),
																	null,
																	array('HIDE_ICONS' => 'Y')
																);?>
															</div></div>
														</div>
														<?
														break;
													default://CHECKBOXES
														?>
                                        	<div style="display: none;">
                                        		<? //print_r($arItem); ?>
                                        	</div>
											<?
														?>
                                            <ul
          class="products-sidebar-item-list ul-filter-listnew"
          data-list-index="<?= $idx ?>"
        >
          <?php $i = 0; ?>
          <?php foreach ($arItem["VALUES"] as $val => $ar): ?>
            <?php
              // фильтрация по тексту
              if ($q !== '' && stripos($ar["VALUE"], $q) === false) {
                  // этот элемент не соответствует поиску
                  continue;
              }
              // скрытие по toggle
              $hide = ($i >= $maxVisible && !$expanded);
            ?>
            <li style="<?= $hide ? 'display:none;' : '' ?>">
              <label class="checkbox-label products-filter-checkbox-label">
                <input
                  type="checkbox"
                  class="checkbox startfiltersearch"
                  name="<?= htmlspecialchars($ar["CONTROL_NAME"], ENT_QUOTES) ?>"
                  id="<?= $ar["CONTROL_ID"] ?>"
                  value="<?= htmlspecialchars($ar["HTML_VALUE"], ENT_QUOTES) ?>"
                  <?= $ar["CHECKED"] ? 'checked':'' ?>
                />
                <span class="products-filter-checkbox-title"><?= htmlspecialchars($ar["VALUE"]) ?></span>
                <?php if (isset($ar["ELEMENT_COUNT"])): ?>
                  <span class="products-filter-checkbox-count"><?= $ar["ELEMENT_COUNT"] ?></span>
                <?php endif; ?>
              </label>
            </li>
            <?php $i++; ?>
          <?php endforeach; ?>
        </ul>

        <div class="list-button-wrapper">
          <button
            type="button"
            class="reset-filter-button"
            <?= ($arItem['CHECKED_COUNT'] ? '' : 'disabled') ?>
          >
            <!-- SVG и текст -->
            Сбросить выбор<?= $arItem['CHECKED_COUNT'] ? " ({$arItem['CHECKED_COUNT']})" : '' ?>
          </button>

          <?php if (count($arItem["VALUES"]) > $maxVisible): ?>
            <button
              type="button"
              class="toggle-list-button"
              data-expanded="<?= $expanded ? 'true' : 'false' ?>"
            >
              <span><?= $expanded ? 'Скрыть' : 'Показать все' ?></span>
              <svg
                width="8" height="5"
                viewBox="0 0 8 5"
                style="<?= $expanded ? 'transform: rotate(180deg);' : '' ?>"
              >
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M8 0.938795L7.07551 0L4 3.12267L0.924488 0L0 0.938795L4 5L8 0.938795Z"
                />
              </svg>
            </button>
          <?php endif; ?>
        </div>
<!-- 
                                        <div class="list-button-wrapper">
                                            <button type="button" disabled="" class="reset-filter-button" style="color: rgb(136, 141, 150);">
                                                    <svg width="9" height="10" viewBox="0 0 9 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <line x1="0.353553" y1="0.646569" x2="8.57794" y2="8.87095" stroke="#888D96"></line>
                                                        <line x1="0.421837" y1="8.87081" x2="8.64622" y2="0.646428" stroke="#888D96"></line>
                                                    </svg>
                                                    Сбросить выбор
                                                </button>
                                            </div> -->

												<?
												}
												?>								
											
										</div>
										
									</div>
									
								<?
								}
								?>												
								
								<div class="products-sidebar-filter-btns-wrapp">
									<ul class="products-sidebar-filter-btns">
										<li>
											<a href="<?=$APPLICATION->GetCurPage();?>" class="btn btn-small btn-gray">Сбросить</a>																						
										</li>
										<li>
											<input
												class="btn btn-small submitstart"
												type="submit"
												id="set_filter"
												name="set_filter"
												value="Подобрать"
											/>											
										</li>
									</ul>									
								</div>
								
							</form>
						</div>
					</div>
				</div>