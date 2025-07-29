<? if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) die();

use \Bitrix\Main\Localization\Loc;

/**
* @global CMain $APPLICATION
* @var array $arParams
* @var array $item
* @var array $actualItem
* @var array $minOffer
* @var array $itemIds
* @var array $price
* @var array $measureRatio
* @var bool $haveOffers
* @var bool $showSubscribe
* @var array $morePhoto
* @var bool $showSlider
* @var string $imgTitle
* @var string $productTitle
* @var string $buttonSizeClass
* @var CatalogSectionComponent $component
*/
$shopCatClass = '';
// Список цветов (Свойства "цвет", SKU TSVET)

?>

 
<?
#pprint_r($item['JS_OFFERS']);

/*
$tmp_meter_price=$item['JS_OFFERS'][0]["DISPLAY_PROPERTIES"][0]["VALUE"];

$lineArr=explode(" ",$tmp_meter_price);
$newPrice=round($lineArr[0]/$koeff);
foreach($lineArr as $i=>$val){
	if($i>0){
		$newPrice.=' '.$val;
	}
}
*/

#pprint_r($_SESSION);

#$price=

#pprint_r($arParams['SKU_PROPS']);

?>


 
	<div class="shop-cat<?/*=$shopCatClass; */?>__media" style="display:none;">
		<a href="<?=$item['DETAIL_PAGE_URL']?>" title="<?=$imgTitle?>" data-entity="image-wrapper">
			<span class="product-item-image-slider-slide-container slide" id="<?=$itemIds['PICT_SLIDER']?>"
				  style="display: <?=($showSlider ? '' : 'none')?>;"
				  data-slider-interval="<?=$arParams['SLIDER_INTERVAL']?>" data-slider-wrap="true">
				<?

				?>
			</span>
			<span class="product-item-image-original" id="<?=$itemIds['PICT']?>"
				  style="  display: <?=($showSlider ? 'none' : '')?>;"></span>
			<?
			if ($item['SECOND_PICT'])
			{
				$bgImage = !empty($item['PREVIEW_PICTURE_SECOND']) ? $item['PREVIEW_PICTURE_SECOND']['SRC'] : $item['PREVIEW_PICTURE']['SRC'];
				?>
				<span class="product-item-image-alternative" id="<?=$itemIds['SECOND_PICT']?>"
					  style=" display: <?=($showSlider ? 'none' : '')?>;"></span>
				<?
			}
			?>
			<div class="product-item-image-slider-control-container" id="<?=$itemIds['PICT_SLIDER']?>_indicator"
				 style="display: <?=($showSlider ? '' : 'none')?>;">
				<?
				if ($showSlider)
				{
					foreach ($morePhoto as $key => $photo)
					{
						?>
						<div class="product-item-image-slider-control<?=($key == 0 ? ' active' : '')?>" data-go-to="<?=$key?>"></div>
						<?
					}
				}
				?>
			</div>
			<?
			if ($arParams['SLIDER_PROGRESS'] === 'Y')
			{
				?>
				<div class="product-item-image-slider-progress-bar-container">
					<div class="product-item-image-slider-progress-bar" id="<?=$itemIds['PICT_SLIDER']?>_progress_bar" style="width: 0;"></div>
				</div>
				<?
			}
			?>
		</a>
	</div>
	<div class="shop-cat<?/*=$shopCatClass; */?>__content">
		<div class="shop-cat<?/*=$shopCatClass; */?>__name">
			<a href="<?=$item['DETAIL_PAGE_URL']?>" title="<?=$productTitle?>"><?=$productTitle?></a>
			<div class="shop_min_carret"></div>
		</div>
		<div class="shop-cat__props">
			<div class="shop-cat__prop">
                <?
                echo $item['SORT_TOLSHCHINA']."мм";
                /*if($item['IBLOCK_SECTION_ID'] == 16){
                    echo current(array_filter($item['PROPERTIES'], fn($property) => $property['ID'] == 285))['VALUE'] ;
                }else if ($item['IBLOCK_SECTION_ID'] == 15){
				echo current(array_filter($item['PROPERTIES'], fn($property) => $property['ID'] == 261))['VALUE'] ;
                }else if($item['IBLOCK_SECTION_ID'] == 17){
                    echo current(array_filter($item['PROPERTIES'], fn($property) => $property['ID'] == 284))['VALUE'] ;
                }else if($item['IBLOCK_SECTION_ID'] == 25 || $item['IBLOCK_SECTION_ID'] == 27 || $item['IBLOCK_SECTION_ID'] == 85 || $item['IBLOCK_SECTION_ID'] == 26 || $item['IBLOCK_SECTION_ID'] == 84 || $item['IBLOCK_SECTION_ID'] == 56 || $item['IBLOCK_SECTION_ID'] == 57){
                    echo current(array_filter($item['PROPERTIES'], fn($property) => $property['ID'] == 377))['VALUE'] ;
                }*/
                ?>

			</div>
		</div>
		<?
				if (!$haveOffers)
				{
					if (!empty($item['DISPLAY_PROPERTIES']))
					{
						?>
						<div class="product-item-info-container product-item-hidden" data-entity="props-block" data-line="111">
							<dl class="product-item-properties">
								<?
								foreach ($item['DISPLAY_PROPERTIES'] as $code => $displayProperty)
								{
									$os = array("TOLSHCHINA_DLYA_SOTOVOGO", "TOLSHCHINA_DLYA_MONOLITNOGO", "TOLSHCHINA_DLYA_KROVELNOGO", "TOLSHCHINA_DLYA_PET","TOLSHCHINA_DLYA_ORGSTEKLA","TOLSHCHINA_DLYA_PVKH","TOLSHCHINA_POLIPROPILEN");
									if (!in_array($code, $os)) { continue;}
									?>
									<?# echo $code;?>
									<div class="dt-cont <?=$displayProperty["CODE"]?>">
										<dt<?=(!isset($item['PROPERTY_CODE_MOBILE'][$code]) ? ' class="hidden-xs"' : '')?>	tmpid="dt<?=$displayProperty["ID"]?>"  data-code="<?=$displayProperty["CODE"]?>">
											<?=$displayProperty['NAME']?>
										</dt>
										<dd<?=(!isset($item['PROPERTY_CODE_MOBILE'][$code]) ? ' class="hidden-xs"' : '')?>>
											<?=(is_array($displayProperty['DISPLAY_VALUE'])
												? implode(' / ', $displayProperty['DISPLAY_VALUE'])
												: $displayProperty['DISPLAY_VALUE'])?>
										</dd>
									</div>
									<?
								}
								?>
							</dl>
						</div>
						<?
					}

					if ($arParams['ADD_PROPERTIES_TO_BASKET'] === 'Y' && !empty($item['PRODUCT_PROPERTIES']))
					{
						?>
						<div id="<?=$itemIds['BASKET_PROP_DIV']?>" style="display: none;">
							<?
							if (!empty($item['PRODUCT_PROPERTIES_FILL']))
							{
								foreach ($item['PRODUCT_PROPERTIES_FILL'] as $propID => $propInfo)
								{
									?>
									<input type="hidden" name="<?=$arParams['PRODUCT_PROPS_VARIABLE']?>[<?=$propID?>]"
										   value="<?=htmlspecialcharsbx($propInfo['ID'])?>">
									<?
									unset($item['PRODUCT_PROPERTIES'][$propID]);
								}
							}

							if (!empty($item['PRODUCT_PROPERTIES']))
							{
								?>
								<table>
									<?
									foreach ($item['PRODUCT_PROPERTIES'] as $propID => $propInfo)
									{
										?>
										<tr>
											<td><?=$item['PROPERTIES'][$propID]['NAME']?></td>
											<td>
												<?
												if (
													$item['PROPERTIES'][$propID]['PROPERTY_TYPE'] === 'L'
													&& $item['PROPERTIES'][$propID]['LIST_TYPE'] === 'C'
												)
												{
													foreach ($propInfo['VALUES'] as $valueID => $value)
													{
														?>
														<label>
															<? $checked = $valueID === $propInfo['SELECTED'] ? 'checked' : ''; ?>
															<input type="radio" name="<?=$arParams['PRODUCT_PROPS_VARIABLE']?>[<?=$propID?>]"
																   value="<?=$valueID?>" <?=$checked?>>
															<?=$value?>
														</label>
														<br />
														<?
													}
												}
												else
												{
													?>
													<select name="<?=$arParams['PRODUCT_PROPS_VARIABLE']?>[<?=$propID?>]">
														<?
														foreach ($propInfo['VALUES'] as $valueID => $value)
														{
															$selected = $valueID === $propInfo['SELECTED'] ? 'selected' : '';
															?>
															<option value="<?=$valueID?>" <?=$selected?>>
																<?=$value?>
															</option>
															<?
														}
														?>
													</select>
													<?
												}
												?>
											</td>
										</tr>
										<?
									}
									?>
								</table>
								<?
							}
							?>
						</div>
						<?
					}
				}
				else
				{
					$showProductProps = !empty($item['DISPLAY_PROPERTIES']);
					$showOfferProps = $arParams['PRODUCT_DISPLAY_MODE'] === 'Y' && $item['OFFERS_PROPS_DISPLAY'];

					if ($showProductProps || $showOfferProps)
					{
						if($price['RATIO_PRICE'] < $price['RATIO_BASE_PRICE']){
							$koeff=$price['RATIO_BASE_PRICE']/$price['RATIO_PRICE'];
						}else{
							$koeff=1;
						}
						$c=0;
						foreach ($item['DISPLAY_PROPERTIES'] as $code => $displayProperty){
							$os = array("TOLSHCHINA_DLYA_SOTOVOGO", "TOLSHCHINA_DLYA_MONOLITNOGO", "TOLSHCHINA_DLYA_KROVELNOGO", "TOLSHCHINA_DLYA_PET","TOLSHCHINA_DLYA_ORGSTEKLA","TOLSHCHINA_DLYA_PVKH","TOLSHCHINA_POLIPROPILEN");
							if (!in_array($code, $os)) { continue;}
							$c++;
						}
#						echo $c;
						?>
						<?if($c>0){?>
							<div class="product-item-info-container product-item-hidden" data-entity="props-block" data-line="238">
								<dl class="product-item-pre-properties" data-line="233">
									<?
									if ($showProductProps)
									{
										foreach ($item['DISPLAY_PROPERTIES'] as $code => $displayProperty)
										{
	#										  pprint_r($displayProperty);
											$os = array("TOLSHCHINA_DLYA_SOTOVOGO", "TOLSHCHINA_DLYA_MONOLITNOGO", "TOLSHCHINA_DLYA_KROVELNOGO", "TOLSHCHINA_DLYA_PET","TOLSHCHINA_DLYA_ORGSTEKLA","TOLSHCHINA_DLYA_PVKH","TOLSHCHINA_POLIPROPILEN");
											if (!in_array($code, $os)) { continue;}
											
											?> 
											<div class="dt-cont <?=$displayProperty["CODE"]?>">
												 <dt<?=(!isset($item['PROPERTY_CODE_MOBILE'][$code]) ? ' class="hidden-xs"' : '')?> tmpid="dt<?=$displayProperty["ID"]?>" data-code="<?=$displayProperty["CODE"]?>">
													 <?=$displayProperty['NAME']?>
												 </dt>
												 <dd<?=(!isset($item['PROPERTY_CODE_MOBILE'][$code]) ? ' class="hidden-xs"' : '')?>>
													 <?=(is_array($displayProperty['DISPLAY_VALUE'])
														 ? implode(' / ', $displayProperty['DISPLAY_VALUE'])
														 : $displayProperty['DISPLAY_VALUE'])?>
												 </dd>
											</div>
											<?
											
										}
									}
	
									if ($showOfferProps)
									{
										?>
										<span id="<?=$itemIds['DISPLAY_PROP_DIV']?>" class="large-cont" style="display: none;"></span>
										<?
									}
									?>
								</dl>
							</div>
						<?}
					}
				}
				?>
		<div class="shop-cat<?/*=$shopCatClass; */?>__params">
		<?
			if ($arParams['PRODUCT_DISPLAY_MODE'] === 'Y' && $haveOffers && !empty($item['OFFERS_PROP']))
			{
				?>
				<ul>
				<?
				foreach ($arParams['SKU_PROPS'] as $skuProperty)
				{
					?>
					<li><?=$skuProperty['NAME']?> - <span code="<?=$skuProperty['CODE']?>"><?=count($skuProperty['VALUES'])?></span></li>
					<?
				}
				?>
				</ul>
				<?
				}
				?>
		</div>
		<!--div class="shop-cat<?/*=$shopCatClass; */?>__tools"-->
	
			<?
			if ($arParams['PRODUCT_DISPLAY_MODE'] === 'Y' && $haveOffers && !empty($item['OFFERS_PROP']))
			{
				?>
				<div class="shop-cat<?/*=$shopCatClass; */?>__props" id="<?=$itemIds['PROP_DIV']?>">
					<?
					foreach ($arParams['SKU_PROPS'] as $skuProperty)
					{
						$propertyId = $skuProperty['ID'];
						$skuProperty['NAME'] = htmlspecialcharsbx($skuProperty['NAME']);
						if (!isset($item['SKU_TREE_VALUES'][$propertyId]))
							continue;
						?>
						<div class="shop-cat<?/*=$shopCatClass; */?>__prop line_344 product-item-hidden" data-entity="sku-block">
							<div class="" data-entity="sku-line-block">
								<div class="shop-cat<?/*=$shopCatClass; */?>__prop--heading">
									<span><?=$skuProperty['NAME']?></span>
								</div>
							  
								<?
								if ($skuProperty['CODE'] == 'TSVET'){
									$skuClass = '--color';
								} else {
									$skuClass = '--default';
								}
								?>
								<div class="product-item-scu-block" code="<?=$skuProperty['CODE'];?>" data-code="SKU_<?=$skuProperty['CODE'];?>">
									<div class="product-item-scu-list shop-cat__prop shop-cat__prop<?=$skuClass; ?> price_prop_block<?=$skuClass; ?> my_prop_block<?=$skuClass;?>">
										<ul class="product-item-scu-item-list show_in_mob">
											<?
											 $iv=0;
											foreach ($skuProperty['VALUES'] as $value)
											{
												if (!isset($item['SKU_TREE_VALUES'][$propertyId][$value['ID']]))
													continue;

												$value['NAME'] = htmlspecialcharsbx($value['NAME']);

												if ($skuProperty['SHOW_MODE'] === 'PICT')
												{
													?>
													<li class="product-item-scu-item-color-container mobile_count_container_" title="<?=$value['NAME']?>"
														data-treevalue="<?=$propertyId?>_<?=$value['ID']?>" data-onevalue="<?=$value['ID']?>"
														data-koef="<?=$koeff?>" data-meterprice="<?=$item["DISPLAY_PROPERTIES"]["PRICE_FOR_METER"]["VALUE"]?>"
														>
														<div class="product-item-scu-item-color-block">
															<div class="product-item-scu-item-color" title="<?=$value['NAME']?>"
																 style="background-image: url('<?/*=$value['PICT']['SRC']*/?>');">
															</div>
														</div>
													</li>
													<?
												}
												else
												{
													?>
													<? if ($skuProperty['CODE'] == 'TSVET'):
														/*$skuExploded = explode('::', $value['NAME']);
														$skuCurrentName = $skuExploded[0];
														$skuCurrentColor = $skuExploded[1];*/
														$arColor=color($value['NAME'],"lit");
														?>
														<li class="product-item-scu-item-text-container mobile_count_container_" 
															data-treevalue="<?=$propertyId?>_<?=$value['ID']?>" data-onevalue="<?=$value['ID']?>"
															data-id="<?=$value['ID']?>"
															>
															<a class="product-item-scu-item-text-block block<?=$skuClass?>">
<?/*
																<span class="product-item-scu-item-text  <?if($arColor['NAME']=="прозрачный") echo 'transparent';?>" style="background-color:<?=$arColor["HEX"];?>;">&nbsp;</span>
*/?>
																<span class="product-item-scu-item-text <?if($arColor['NAME']=="прозрачный") echo 'transparent';?>" style="<?if($arColor["BG_PICT"]){ echo $arColor["BG_PICT"];}else{echo 'background-color:'.$arColor["HEX"];}?>">&nbsp;</span>
																<span class="product-item-scu-item-text_drop"><?=$arColor['NAME'];?></span>
															</a>
														</li>
													<? else: ?>
													 	<?
														#pprint_r($item['JS_OFFERS']);
														
														
														$tmp_meter_price=$item['JS_OFFERS'][$iv]["DISPLAY_PROPERTIES"][0]["VALUE"];
														$lineArr=explode(" ",$tmp_meter_price);
														$oldPrice=$tmp_meter_price;
														$newPrice=round($lineArr[0]/$koeff);
														foreach($lineArr as $i=>$val){
															if($i>0){
																$newPrice.=' '.$val;
															}
														}
														
														  	
													 	?>
														 <li class="product-item-scu-item-text-container mobile_count_container_" title="<?=$value['NAME']?>"
															 data-treevalue="<?=$propertyId?>_<?=$value['ID']?>" data-onevalue="<?=$value['ID']?>"
															 data-koef="<?=$koeff?>" data-meterprice="<?=$oldPrice?>" data-meterprice_new="<?=$newPrice?>"
															 data-id="<?=$value['ID']?>"
															 >
															 <a class="product-item-scu-item-text-block">
																 <span class="product-item-scu-item-text"><?=$value['NAME']?></span>
															 </a>
														 </li>
													 <? endif; ?>
													<?
												}
												$iv++;
											}
										  #	 pprint_r($i);
											?>
										</ul>
									</div>
								</div>
							</div>
						</div>
						<?
					}
					?>
				</div>
				<?
				foreach ($arParams['SKU_PROPS'] as $skuProperty)
				{
					if (!isset($item['OFFERS_PROP'][$skuProperty['CODE']]))
						continue;

					$skuProps[] = array(
						'ID' => $skuProperty['ID'],
						'SHOW_MODE' => $skuProperty['SHOW_MODE'],
						'VALUES' => $skuProperty['VALUES'],
						'VALUES_COUNT' => $skuProperty['VALUES_COUNT']
					);
				}

				unset($skuProperty, $value);

				if ($item['OFFERS_PROPS_DISPLAY'])
				{
					foreach ($item['JS_OFFERS'] as $keyOffer => $jsOffer)
					{
						$strProps = '';

						if (!empty($jsOffer['DISPLAY_PROPERTIES']))
						{
							foreach ($jsOffer['DISPLAY_PROPERTIES'] as $displayProperty)
							{
								if($displayProperty["CODE"]=="PRICE_FOR_METER" and $koeff!=1){
									$old_price=$displayProperty['VALUE'];
									$lineArr=explode(" ",$displayProperty['VALUE']);
									$newPrice=round($lineArr[0]/$koeff);
									foreach($lineArr as $i=>$val){
										if($i>0){
											$newPrice.=' '.$val;
										}
									}
									
//									$displayProperty['VALUE']=$newPrice;

									$displayProperty['VALUE']='<div class="shop-cat__price price2"><div class="old">'.$old_price.'</div><div class="new">'.$newPrice.'</div></div>';

								}
								 
								$strProps .= '		<div class="dt-cont '.$displayProperty["CODE"].'"><dt tmpid="dt_'.$displayProperty["CODE"].'"  data-code="SKU_'.$displayProperty["CODE"].'">'.$displayProperty['NAME'].'</dt><dd>'
									.(is_array($displayProperty['VALUE'])
										? implode(' / ', $displayProperty['VALUE'])
										: $displayProperty['VALUE'])
									.'</dd></div>';
							}
						}

						$item['JS_OFFERS'][$keyOffer]['DISPLAY_PROPERTIES'] = $strProps;
					}
					unset($jsOffer, $strProps);
				}
			}
			?> 
			
			<? 
				if (!$haveOffers)
				{
					if (!empty($item['DISPLAY_PROPERTIES']))
					{
						?>
						<div class="product-item-info-container product-item-hidden" data-entity="props-block" data-line="479">
							<dl class="product-item-properties">
								<?
								foreach ($item['DISPLAY_PROPERTIES'] as $code => $displayProperty)
								{
									$os = array("TOLSHCHINA_DLYA_SOTOVOGO", "TOLSHCHINA_DLYA_MONOLITNOGO", "TOLSHCHINA_DLYA_KROVELNOGO", "TOLSHCHINA_DLYA_PET","TOLSHCHINA_DLYA_ORGSTEKLA","TOLSHCHINA_DLYA_PVKH","TOLSHCHINA_POLIPROPILEN");
									if (in_array($code, $os)) { continue;}
									?>
									<div class="dt-cont <?=$displayProperty["CODE"]?>">
										 <dt<?=(!isset($item['PROPERTY_CODE_MOBILE'][$code]) ? ' class="hidden-xs"' : '')?>	 tmpid="dt<?=$displayProperty["ID"]?>" data-code="<?=$displayProperty["CODE"]?>">
											 <?=$displayProperty['NAME']?>
										 </dt>
										 <dd<?=(!isset($item['PROPERTY_CODE_MOBILE'][$code]) ? ' class="hidden-xs"' : '')?>>
											 <?=(is_array($displayProperty['DISPLAY_VALUE'])
												 ? implode(' / ', $displayProperty['DISPLAY_VALUE'])
												 : $displayProperty['DISPLAY_VALUE'])?>
										 </dd>
									</div>
									<?
								}
								?>
							</dl>
						</div>
						<?
					}

					if ($arParams['ADD_PROPERTIES_TO_BASKET'] === 'Y' && !empty($item['PRODUCT_PROPERTIES']))
					{
						?>
						<div id="<?=$itemIds['BASKET_PROP_DIV']?>" style="display: none;">
							<?
							if (!empty($item['PRODUCT_PROPERTIES_FILL']))
							{
								foreach ($item['PRODUCT_PROPERTIES_FILL'] as $propID => $propInfo)
								{
									?>
									<input type="hidden" name="<?=$arParams['PRODUCT_PROPS_VARIABLE']?>[<?=$propID?>]"
										   value="<?=htmlspecialcharsbx($propInfo['ID'])?>">
									<?
									unset($item['PRODUCT_PROPERTIES'][$propID]);
								}
							}

							if (!empty($item['PRODUCT_PROPERTIES']))
							{
								?>
								<table>
									<?
									foreach ($item['PRODUCT_PROPERTIES'] as $propID => $propInfo)
									{
										?>
										<tr>
											<td><?=$item['PROPERTIES'][$propID]['NAME']?></td>
											<td>
												<?
												if (
													$item['PROPERTIES'][$propID]['PROPERTY_TYPE'] === 'L'
													&& $item['PROPERTIES'][$propID]['LIST_TYPE'] === 'C'
												)
												{
													foreach ($propInfo['VALUES'] as $valueID => $value)
													{
														?>
														<label>
															<? $checked = $valueID === $propInfo['SELECTED'] ? 'checked' : ''; ?>
															<input type="radio" name="<?=$arParams['PRODUCT_PROPS_VARIABLE']?>[<?=$propID?>]"
																   value="<?=$valueID?>" <?=$checked?>>
															<?=$value?>
														</label>
														<br />
														<?
													}
												}
												else
												{
													?>
													<select name="<?=$arParams['PRODUCT_PROPS_VARIABLE']?>[<?=$propID?>]">
														<?
														foreach ($propInfo['VALUES'] as $valueID => $value)
														{
															$selected = $valueID === $propInfo['SELECTED'] ? 'selected' : '';
															?>
															<option value="<?=$valueID?>" <?=$selected?>>
																<?=$value?>
															</option>
															<?
														}
														?>
													</select>
													<?
												}
												?>
											</td>
										</tr>
										<?
									}
									?>
								</table>
								<?
							}
							?>
						</div>
						<?
					}
				}
				else
				{
					$showProductProps = !empty($item['DISPLAY_PROPERTIES']);
					$showOfferProps = $arParams['PRODUCT_DISPLAY_MODE'] === 'Y' && $item['OFFERS_PROPS_DISPLAY'];

					if ($showProductProps || $showOfferProps)
					{
						?>
						<div class="product-item-info-container product-item-hidden" data-entity="props-block" data-line="592">
							<dl class="product-item-properties">
								<?
								if ($showProductProps)
								{
									foreach ($item['DISPLAY_PROPERTIES'] as $code => $displayProperty)
									{
										$os = array("TOLSHCHINA_DLYA_SOTOVOGO", "TOLSHCHINA_DLYA_MONOLITNOGO", "TOLSHCHINA_DLYA_KROVELNOGO", "TOLSHCHINA_DLYA_PET","TOLSHCHINA_DLYA_ORGSTEKLA","TOLSHCHINA_DLYA_PVKH","TOLSHCHINA_POLIPROPILEN");
										if (in_array($code, $os)) { continue;}
										?>
										<div class="dt-cont <?=$displayProperty["CODE"]?>">
											 <dt<?=(!isset($item['PROPERTY_CODE_MOBILE'][$code]) ? ' class="hidden-xs"' : '')?> tmpid="dt<?=$displayProperty["ID"]?>" data-code="<?=$displayProperty["CODE"]?>">
												 <?=$displayProperty['NAME']?> 
											 </dt>
											 <dd<?=(!isset($item['PROPERTY_CODE_MOBILE'][$code]) ? ' class="hidden-xs"' : '')?>>
												 <?=(is_array($displayProperty['DISPLAY_VALUE'])
													 ? implode(' / ', $displayProperty['DISPLAY_VALUE'])
													 : $displayProperty['DISPLAY_VALUE'])?>
											 </dd>
										 </div>
										<?
									}
								}

								if ($showOfferProps)
								{
									?>
									<div class="dt-cont large-cont" data-noborder data-line="618" id="<?=$itemIds['DISPLAY_PROP_DIV']?>" style="display: none;"></div>
									<?
								}
								?>
<?/*
								<div class="dt-cont NAL">
									<dt class="hidden-xs_" tmpid="dt99999999" data-code="NAL">
										Наличие 
									</dt>
									<dd class="hidden-xs_">
										<span class="nal_in">В наличии</span>
									</dd>
								</div>
*/?>
							</dl>
						</div>
						<?
					}
				}
				?>



				<div class="shop-cat__controls">

					<div class="shop-cat<?=$shopCatClass;?>__price hide-mobile" data-entity="price-block">
								<?
						/**
						 * PRODUCT PRICE
						 */
						if (($arParams['SHOW_OLD_PRICE'] === 'Y')&&($price['RATIO_PRICE'] < $price['RATIO_BASE_PRICE'] )){?>
							<div class="old" id="<?=$itemIds['PRICE_OLD']?>" <?=($price['RATIO_PRICE'] >= $price['RATIO_BASE_PRICE'] ? 'style="display: none;"' : '')?>><?=$price['PRINT_RATIO_BASE_PRICE']?></div>
							<div class="new <?=($price['RATIO_PRICE'] >= $price['RATIO_BASE_PRICE'] ? '' : 'is-discounted')?>" id="<?=$itemIds['PRICE']?>">
								<?
								if (!empty($price))
								{
									if ($arParams['PRODUCT_DISPLAY_MODE'] === 'N' && $haveOffers)
									{
										echo Loc::getMessage(
											'CT_BCI_TPL_MESS_PRICE_SIMPLE_MODE',
											array(
												'#PRICE#' => $price['PRINT_RATIO_PRICE'],
												'#VALUE#' => $measureRatio,
												'#UNIT#' => $minOffer['ITEM_MEASURE']['TITLE']
											)
										);
									}
									else
									{
										echo $price['PRINT_RATIO_PRICE'];
									}
								}
								?>
							</div>
						<?}else{?>
                            <div class="new price_under_5"  id="<?=$itemIds['PRICE']?>"><?=$price['PRINT_RATIO_PRICE'];?></div>
                            <div class="price_over_5 "  style="display: none;" > <?/*В js добавляем класс old и красота */?>
                                <?=CurrencyFormat($price['RATIO_PRICE'] * 0.97,"RUB")?>
                            </div>
						<?}?>
					</div>

					<div class="shop-cat__availability"  >
						<?
                        /*$quantity = $item['TOTAL_CATALOG_QUANTITY'];
                    $availability_status = $quantity == 0
                            ? 'out-of-stock'
                            : ($quantity < 10
                                ? 'almost-out-of-stock'
                                : 'in-stock');
                    $availability_text = [
                        'out-of-stock' => 'В наличии у поставщика',
                        'almost-out-of-stock' => 'Скоро закончится',
                        'in-stock' => 'В наличии на складе',
                    ][$availability_status];
                */?>
						<div  class="tooltip-trigger" data-tippy-content="<?/*= $availability_text */?>">
							<div class="availability-indicator "></div>
						</div>
						<div class="availability-text"><?/*= $availability_text */?></div>
					</div>

					<div class="shop-cat__more"><div>Развернуть</div></div>
					<?/*
					<div class="shop-cat__more fake-button"></div>
					*/?>
				</div>
				

				<div class="shop-cat<?/*=$shopCatClass; */?>__actions">
					<?
					/**
					 * PRODUCT QUANTITY
					 */
					if ($arParams['SHOW_MAX_QUANTITY'] !== 'N')
					{
						if ($haveOffers)
						{
							if ($arParams['PRODUCT_DISPLAY_MODE'] === 'Y')
							{
								?>
								<div class="product-item-info-container product-item-hidden" id="<?=$itemIds['QUANTITY_LIMIT']?>"
									 style="display: none;" data-entity="quantity-limit-block">
									<div class="product-item-info-container-title">
										<?=$arParams['MESS_SHOW_MAX_QUANTITY']?>:
										<span class="product-item-quantity" data-entity="quantity-limit-value"></span>
									</div>
								</div>
								<?
							}
						}
						else
						{
							if (
								$measureRatio
								&& (float)$actualItem['CATALOG_QUANTITY'] > 0
								&& $actualItem['CATALOG_QUANTITY_TRACE'] === 'Y'
								&& $actualItem['CATALOG_CAN_BUY_ZERO'] === 'N'
							)
							{
								?>
								<div class="product-item-info-container product-item-hidden" id="<?=$itemIds['QUANTITY_LIMIT']?>">
									<div class="product-item-info-container-title">
										<?=$arParams['MESS_SHOW_MAX_QUANTITY']?>:
										<span class="product-item-quantity">
											<?
											if ($arParams['SHOW_MAX_QUANTITY'] === 'M')
											{
												if ((float)$actualItem['CATALOG_QUANTITY'] / $measureRatio >= $arParams['RELATIVE_QUANTITY_FACTOR'])
												{
													echo $arParams['MESS_RELATIVE_QUANTITY_MANY'];
												}
												else
												{
													echo $arParams['MESS_RELATIVE_QUANTITY_FEW'];
												}
											}
											else
											{
												echo $actualItem['CATALOG_QUANTITY'].' '.$actualItem['ITEM_MEASURE']['TITLE'];
											}
											?>
										</span>
									</div>
								</div>
								<?
							}
						}
					}
					?>
			   
					<?/*
					if (!$haveOffers)
					{
						if ($actualItem['CAN_BUY'] && $arParams['USE_PRODUCT_QUANTITY'])
						{
							?>
							<div class="shop-cat__quantity" data-entity="quantity-block">
								<a id="<?=$itemIds['QUANTITY_DOWN']?>" href="javascript:void(0)" rel="nofollow" class="mns"></a>
								<input id="<?=$itemIds['QUANTITY']?>" type="tel" name="<?=$arParams['PRODUCT_QUANTITY_VARIABLE']?>" value="<?=$measureRatio?>">
								<a id="<?=$itemIds['QUANTITY_UP']?>" href="javascript:void(0)" rel="nofollow" class="pls"></a>
							</div>
							<?
						}
					}
					elseif ($arParams['PRODUCT_DISPLAY_MODE'] === 'Y')
					{
						if ($arParams['USE_PRODUCT_QUANTITY'])
						{
							?>
							<div class="shop-cat__quantity" data-entity="quantity-block">
								<a id="<?=$itemIds['QUANTITY_DOWN']?>" href="javascript:void(0)" rel="nofollow" class="mns"></a>
								<input id="<?=$itemIds['QUANTITY']?>" type="tel" name="<?=$arParams['PRODUCT_QUANTITY_VARIABLE']?>" value="<?=$measureRatio?>">
								<a id="<?=$itemIds['QUANTITY_UP']?>" href="javascript:void(0)" rel="nofollow" class="pls"></a>
							</div>
							<?
						}
					}
					*/
					?>
					<?
					if (!$haveOffers)
					{
						if ($actualItem['CAN_BUY'])
						{
							?>

							<div class="show-mobile price-mobile">

							
									<?
								/**
								 * PRODUCT PRICE
								 */
								if (($arParams['SHOW_OLD_PRICE'] === 'Y')&&($price['RATIO_PRICE'] < $price['RATIO_BASE_PRICE'] )){?>
									<div class="old" id="<?=$itemIds['PRICE_OLD']?>" <?=($price['RATIO_PRICE'] >= $price['RATIO_BASE_PRICE'] ? 'style="display: none;"' : '')?>><?=$price['PRINT_RATIO_BASE_PRICE']?></div>
									<div class="new <?=($price['RATIO_PRICE'] >= $price['RATIO_BASE_PRICE'] ? '' : 'is-discounted')?>" id="<?=$itemIds['PRICE']?>">
										<?
										if (!empty($price))
										{
											if ($arParams['PRODUCT_DISPLAY_MODE'] === 'N' && $haveOffers)
											{
												echo Loc::getMessage(
													'CT_BCI_TPL_MESS_PRICE_SIMPLE_MODE',
													array(
														'#PRICE#' => $price['PRINT_RATIO_PRICE'],
														'#VALUE#' => $measureRatio,
														'#UNIT#' => $minOffer['ITEM_MEASURE']['TITLE']
													)
												);
											}
											else
											{
												echo $price['PRINT_RATIO_PRICE'];
											}
										}
										?>
									</div>
								<?}else{?>
																<div class="new price_under_5"  id="<?=$itemIds['PRICE']?>"><?=$price['PRINT_RATIO_PRICE'];?></div>
																<div class="price_over_5 "  style="display: none;" > <?/*В js добавляем класс old и красота */?>
																		<?=CurrencyFormat($price['RATIO_PRICE'] * 0.97,"RUB")?>
																</div>
								<?}?>
							</div>

							<div class="shop-cat<?/*=$shopCatClass; */?>__add-to-cart" id="<?=$itemIds['BASKET_ACTIONS']?>">
								<!--a class="fast-buy" href="javascript:void(0);" data-button="modal" data-modal="fast-buy">Купить в 1 клик</a-->
								<div class="count" data-id="<?=$item["ID"]?>">
									<a id="<?=$itemIds['QUANTITY_DOWN']?>" href="javascript:void(0)" rel="nofollow" class="mns"></a>
									<input id="<?=$itemIds['QUANTITY']?>" type="tel" name="<?=$arParams['PRODUCT_QUANTITY_VARIABLE']?>" value="<?=$measureRatio?>">
									<a id="<?=$itemIds['QUANTITY_UP']?>" href="javascript:void(0)" rel="nofollow" class="pls"></a>
								</div>
								
								<a data-counter-event="addProduct" id="<?=$itemIds['BUY_LINK']?>" class="view" href="javascript:void(0)" rel="nofollow"> </a>
							</div>
							<?
						}
					}
					else
					{
						if ($arParams['PRODUCT_DISPLAY_MODE'] === 'Y')
						{
							?>

							<div class="show-mobile price-mobile">

														
							<?
							/**
							* PRODUCT PRICE
							*/
							if (($arParams['SHOW_OLD_PRICE'] === 'Y')&&($price['RATIO_PRICE'] < $price['RATIO_BASE_PRICE'] )){?>
							<div class="old" id="<?=$itemIds['PRICE_OLD']?>" <?=($price['RATIO_PRICE'] >= $price['RATIO_BASE_PRICE'] ? 'style="display: none;"' : '')?>><?=$price['PRINT_RATIO_BASE_PRICE']?></div>
							<div class="new <?=($price['RATIO_PRICE'] >= $price['RATIO_BASE_PRICE'] ? '' : 'is-discounted')?>" id="<?=$itemIds['PRICE']?>">
								<?
								if (!empty($price))
								{
									if ($arParams['PRODUCT_DISPLAY_MODE'] === 'N' && $haveOffers)
									{
										echo Loc::getMessage(
											'CT_BCI_TPL_MESS_PRICE_SIMPLE_MODE',
											array(
												'#PRICE#' => $price['PRINT_RATIO_PRICE'],
												'#VALUE#' => $measureRatio,
												'#UNIT#' => $minOffer['ITEM_MEASURE']['TITLE']
											)
										);
									}
									else
									{
										echo $price['PRINT_RATIO_PRICE'];
									}
								}
								?>
							</div>
							<?}else{?>
														<div class="new price_under_5"  id="<?=$itemIds['PRICE']?>"><?=$price['PRINT_RATIO_PRICE'];?></div>
														<div class="price_over_5 "  style="display: none;" > <?/*В js добавляем класс old и красота */?>
																<?=CurrencyFormat($price['RATIO_PRICE'] * 0.97,"RUB")?>
														</div>
							<?}?>
							</div>

							<div class="shop-cat<?/*=$shopCatClass; */?>__add-to-cart" id="<?=$itemIds['BASKET_ACTIONS']?>">
								 <!--a class="fast-buy" href="javascript:void(0);" data-button="modal" data-modal="fast-buy">Купить в 1 клик</a-->
								<?
								$offId=$item["OFFER_ID_SELECTED"];
								if(is_array($GLOBALS["CART"][$offId])){
									$in_cart=true;
								}else{
									$in_cart=false;
								}
#								pprint_r($GLOBALS["CART"]);
#								echo $offId;
#								if()
								?>
								<div class="count <?=($in_cart?"active":"")?>" data-id="<?=$offId?>">
									<a id="<?=$itemIds['QUANTITY_DOWN']?>" href="javascript:void(0)" rel="nofollow" class="mns"></a>
									<input id="<?=$itemIds['QUANTITY']?>" type="tel" name="<?=$arParams['PRODUCT_QUANTITY_VARIABLE']?>" value="<?=($in_cart?$measureRatio*$GLOBALS["CART"][$offId]["QUANTITY"]:$measureRatio);?>">
									<a id="<?=$itemIds['QUANTITY_UP']?>" href="javascript:void(0)" rel="nofollow" class="pls"></a>

								</div>
								<a data-counter-event="addProduct" id="<?=$itemIds['BUY_LINK']?>" class="view <?=($in_cart?"hidden":"")?>" href="javascript:void(0)" rel="nofollow"> </a>

							</div>
							<?
						}
						else
						{
							?>
							<div class="show-mobile price-mobile">

							
							<?
							/**
							* PRODUCT PRICE
							*/
							if (($arParams['SHOW_OLD_PRICE'] === 'Y')&&($price['RATIO_PRICE'] < $price['RATIO_BASE_PRICE'] )){?>
							<div class="old" id="<?=$itemIds['PRICE_OLD']?>" <?=($price['RATIO_PRICE'] >= $price['RATIO_BASE_PRICE'] ? 'style="display: none;"' : '')?>><?=$price['PRINT_RATIO_BASE_PRICE']?></div>
							<div class="new <?=($price['RATIO_PRICE'] >= $price['RATIO_BASE_PRICE'] ? '' : 'is-discounted')?>" id="<?=$itemIds['PRICE']?>">
								<?
								if (!empty($price))
								{
									if ($arParams['PRODUCT_DISPLAY_MODE'] === 'N' && $haveOffers)
									{
										echo Loc::getMessage(
											'CT_BCI_TPL_MESS_PRICE_SIMPLE_MODE',
											array(
												'#PRICE#' => $price['PRINT_RATIO_PRICE'],
												'#VALUE#' => $measureRatio,
												'#UNIT#' => $minOffer['ITEM_MEASURE']['TITLE']
											)
										);
									}
									else
									{
										echo $price['PRINT_RATIO_PRICE'];
									}
								}
								?>
							</div>
							<?}else{?>
														<div class="new price_under_5"  id="<?=$itemIds['PRICE']?>"><?=$price['PRINT_RATIO_PRICE'];?></div>
														<div class="price_over_5 "  style="display: none;" > <?/*В js добавляем класс old и красота */?>
																<?=CurrencyFormat($price['RATIO_PRICE'] * 0.97,"RUB")?>
														</div>
							<?}?>
							</div>

							<div class="shop-cat<?/*=$shopCatClass; */?>__add-to-cart" id="<?=$itemIds['BASKET_ACTIONS']?>">
								<!--a class="fast-buy" href="javascript:void(0);" data-button="modal" data-modal="fast-buy">Купить в 1 клик</a-->
							  
								<a data-counter-event="addProduct" href="<?=$item['DETAIL_PAGE_URL']?>" class="view"> </a>
							</div>
							<?
						}
					}
					?>
	
				</div>

		<!--/div-->
	</div>


    <div class="shop-cat__content-mobile">
        <div class="image-wrapper">
            <img src="https://dev.poly-max.com/upload/resize_cache/webp/iblock/284/mrlu61e3nrf4qu3qmuemduyatb1qkzka.webp" alt="">

            <!-- это пока выключено т.к. в этом шаблоне изначально этого нет-->
            <!-- <div>Цена за:</div>
            <div>м2</div>
            <div>лист</div> -->
        </div>

        <div class="content-wrapper">
            <div class="title"><?=$item["NAME"]?></div>

            <div class="colors-wrapper">
                <?php $count = 10; ?>
                <?for($i=0; $i<$count; $i++):?>
                    <!-- 254 - цвет, 1439 - значение цвета -->
                    <div class="color <?= $i >= 5 ? 'hidden' : '' ?>" style="background: red;" data-treevalue="254_1439"></div>
                <?endfor;?>
                <?if($count > 5):?>
                    <div class="show-more">+<?= $count - 5 ?></div>
                <?endif;?>
            </div>

            <div class="sizes-wrapper">
                <div class="size">6000х2100</div>
                <div class="size">12000х2100</div>
            </div>

            <div class="price-wrapper">
                <div class="price">5 760 ₽</div>
                <button class="to-cart" onclick="<?=$obName?>.openBuyPopup(<?=$item["ID"]?>)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path clip-rule="evenodd" d="M8 23a2 2 0 1 0 0-4 2 2 0 0 0 0 4m12 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M5.67 6H23l-1.68 8.39a2 2 0 0 1-2 1.61H8.75a2 2 0 0 1-2-1.74L5.23 2.74A2 2 0 0 0 3.25 1H1" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
            </div>
        </div>
    </div>