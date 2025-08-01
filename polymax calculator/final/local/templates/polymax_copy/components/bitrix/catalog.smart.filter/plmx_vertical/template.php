<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true)
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
/** @var CBitrixComponent $component */
$this->setFrameMode(true);

$templateData = array(
	'TEMPLATE_THEME' => $this->GetFolder() . '/themes/' . $arParams['TEMPLATE_THEME'] . '/colors.css',
	'TEMPLATE_CLASS' => 'bx-' . $arParams['TEMPLATE_THEME']
);

if (isset($templateData['TEMPLATE_THEME'])) {
	$this->addExternalCss($templateData['TEMPLATE_THEME']);
}
?>

<div
	class="bx-filter <?= $templateData["TEMPLATE_CLASS"] ?> <? if ($arParams["FILTER_VIEW_MODE"] == "HORIZONTAL") echo "bx-filter-horizontal" ?>"
	>
		<div class="bx-filter-section container-fluid">
			<div class="bx-filter-head">
				<div class=" bx-filter-title">
					<? echo GetMessage("CT_BCSF_FILTER_TITLE") ?>
				</div>
				<input
								class="btn btn-link hide-btn"
								type="button"
								id="del_filter-second"
								value="<?= GetMessage("CT_BCSF_DEL_FILTER") ?>"
							/>
							
			</div>
		<form
			name="<? echo $arResult["FILTER_NAME"] . "_form" ?>"
			action="<? echo $arResult["FORM_ACTION"] ?>"
			method="get"
			class="smartfilter"
		>
			<? foreach ($arResult["HIDDEN"] as $arItem): ?>
				<input
					type="hidden"
					name="<? echo $arItem["CONTROL_NAME"] ?>"
					id="<? echo $arItem["CONTROL_ID"] ?>"
					value="<? echo $arItem["HTML_VALUE"] ?>"
				/>
			<? endforeach; ?>
			<div class="">

				<? foreach ($arResult["ITEMS"] as $key => $arItem) //prices
				{

					$key = $arItem["ENCODED_ID"];
					if (isset($arItem["PRICE"])):
						if ($arItem["VALUES"]["MAX"]["VALUE"] - $arItem["VALUES"]["MIN"]["VALUE"] <= 0)
							continue;

						$step_num = 4;
						$step = ($arItem["VALUES"]["MAX"]["VALUE"] - $arItem["VALUES"]["MIN"]["VALUE"]) / $step_num;
						$prices = array();
						if (Bitrix\Main\Loader::includeModule("currency")) {
							for ($i = 0; $i < $step_num; $i++) {
								$prices[$i] = CCurrencyLang::CurrencyFormat($arItem["VALUES"]["MIN"]["VALUE"] + $step * $i, $arItem["VALUES"]["MIN"]["CURRENCY"], false);
							}
							$prices[$step_num] = CCurrencyLang::CurrencyFormat($arItem["VALUES"]["MAX"]["VALUE"], $arItem["VALUES"]["MAX"]["CURRENCY"], false);
						} else {
							$precision = $arItem["DECIMALS"] ? $arItem["DECIMALS"] : 0;
							for ($i = 0; $i < $step_num; $i++) {
								$prices[$i] = number_format($arItem["VALUES"]["MIN"]["VALUE"] + $step * $i, $precision, ".", "");
							}
							$prices[$step_num] = number_format($arItem["VALUES"]["MAX"]["VALUE"], $precision, ".", "");
						}
						?>
						<div
							class="<? if ($arParams["FILTER_VIEW_MODE"] == "HORIZONTAL"): ?>col-sm-6 col-md-4<? else: ?><? endif ?> bx-filter-parameters-box bx-active"
						>
							<span class="bx-filter-container-modef"></span>
							<div class="row">
								<div class="col-12">
									<div
										class="bx-filter-parameters-box-title"
										onclick="smartFilter.hideFilterProps(this)"
									><span>
											<?= $arItem["NAME"] ?> <i
												data-role="prop_angle"
												class="fa fa-angle-<? if ($arItem["DISPLAY_EXPANDED"] == "Y"): ?>up<? else: ?>down<? endif ?>"
											></i>
										</span></div>
								</div>
							</div>
							<div
								class="bx-filter-block"
								data-role="bx_filter_block"
							>
								<div class="row bx-filter-parameters-box-container">
									<div class="col-12 bx-ui-slider-track-container">
										<div
											class="bx-ui-slider-track"
											id="drag_track_<?= $key ?>"
										>
											<? for ($i = 0; $i <= $step_num; $i++): ?>
												<div class="bx-ui-slider-part p<?= $i + 1 ?>"><span>
														<?= $prices[$i] ?>
													</span></div>
											<? endfor; ?>

											<div
												class="bx-ui-slider-pricebar-vd"
												style="left: 0;right: 0;"
												id="colorUnavailableActive_<?= $key ?>"
											></div>
											<div
												class="bx-ui-slider-pricebar-vn"
												style="left: 0;right: 0;"
												id="colorAvailableInactive_<?= $key ?>"
											></div>
											<div
												class="bx-ui-slider-pricebar-v"
												style="left: 0;right: 0;"
												id="colorAvailableActive_<?= $key ?>"
											></div>
											<div
												class="bx-ui-slider-range"
												id="drag_tracker_<?= $key ?>"
												style="left: 0%; right: 0%;"
											>
												<a
													class="bx-ui-slider-handle left"
													style="left:0;"
													href="javascript:void(0)"
													id="left_slider_<?= $key ?>"
												></a>
												<a
													class="bx-ui-slider-handle right"
													style="right:0;"
													href="javascript:void(0)"
													id="right_slider_<?= $key ?>"
												></a>
											</div>
										</div>
									</div>
									<div class="col-6 bx-filter-parameters-box-container-block bx-left">
										<span class="bx-ft-sub">
											<?= GetMessage("CT_BCSF_FILTER_FROM") ?>
										</span>
										<div class="bx-filter-input-container">
											<input
												class="min-price"
												type="text"
												name="<? echo $arItem["VALUES"]["MIN"]["CONTROL_NAME"] ?>"
												id="<? echo $arItem["VALUES"]["MIN"]["CONTROL_ID"] ?>"
												value="<? echo $arItem["VALUES"]["MIN"]["HTML_VALUE"] ?>"
												style="text-align:center"
												placeholder="<?= round($arItem["VALUES"]["MIN"]["VALUE"]); ?>"
												onkeyup="smartFilter.keyup(this)"
											/>
										</div>
									</div>
									<div class="col-6 bx-filter-parameters-box-container-block bx-right">
										<span class="bx-ft-sub">
											<?= GetMessage("CT_BCSF_FILTER_TO") ?>
										</span>
										<div class="bx-filter-input-container">
											<input
												class="max-price"
												type="text"
												name="<? echo $arItem["VALUES"]["MAX"]["CONTROL_NAME"] ?>"
												id="<? echo $arItem["VALUES"]["MAX"]["CONTROL_ID"] ?>"
												value="<? echo $arItem["VALUES"]["MAX"]["HTML_VALUE"] ?>"
												style="text-align:center"
												placeholder="<?= round($arItem["VALUES"]["MAX"]["VALUE"]); ?>"
												onkeyup="smartFilter.keyup(this)"
											/>
										</div>
									</div>
									<? if ($arResult['SALE_PROP']['VALUES']) { ?>
										<div class="col-12">
											<label class="switcher-block">
												<div class="switcher"> 
													<input class="switcher__input" type="checkbox" value="<?= $arResult['SALE_PROP']['VALUES']["HTML_VALUE"] ?>" name="<?= $arResult['SALE_PROP']['VALUES']["CONTROL_NAME"] ?>" id="<?= $arResult['SALE_PROP']['VALUES']["CONTROL_ID"] ?>" <?= $arResult['SALE_PROP']['VALUES']["CHECKED"] ? 'checked="checked"' : '' ?> onclick="smartFilter.click(this)" <?= $arResult['SALE_PROP']['VALUES']["DISABLED"] ? 'disabled' : '' ?>>
													<div class="switcher__ui"> </div>
												</div>
												<div class="switcher__text">
													Товары со скидкой123
												</div>
											</label>
										
										</div>
									<? } ?>
                                    <? if ($arResult['ATT_NAL_STORE']['VALUES']) { ?>
                                        <div class="col-12">
                                            <label class="switcher-block">
                                                <div class="switcher">
                                                    <input class="switcher__input" type="checkbox" value="<?= $arResult['ATT_NAL_STORE']['VALUES']["HTML_VALUE"] ?>" name="<?= $arResult['ATT_NAL_STORE']['VALUES']["CONTROL_NAME"] ?>" id="<?= $arResult['ATT_NAL_STORE']['VALUES']["CONTROL_ID"] ?>" <?= $arResult['ATT_NAL_STORE']['VALUES']["CHECKED"] ? 'checked="checked"' : '' ?> onclick="smartFilter.click(this)" <?= $arResult['ATT_NAL_STORE']['VALUES']["DISABLED"] ? 'disabled' : '' ?>>
                                                    <div class="switcher__ui"> </div>
                                                </div>
                                                <div class="switcher__text">
                                                    Товар в наличии456
                                                </div>
                                            </label>

                                        </div>
                                    <? } ?>
								</div>
								
							</div>
						</div>
						<?
						$arJsParams = array(
							"leftSlider" => 'left_slider_' . $key,
							"rightSlider" => 'right_slider_' . $key,
							"tracker" => "drag_tracker_" . $key,
							"trackerWrap" => "drag_track_" . $key,
							"minInputId" => $arItem["VALUES"]["MIN"]["CONTROL_ID"],
							"maxInputId" => $arItem["VALUES"]["MAX"]["CONTROL_ID"],
							"minPrice" => $arItem["VALUES"]["MIN"]["VALUE"],
							"maxPrice" => $arItem["VALUES"]["MAX"]["VALUE"],
							"curMinPrice" => $arItem["VALUES"]["MIN"]["HTML_VALUE"],
							"curMaxPrice" => $arItem["VALUES"]["MAX"]["HTML_VALUE"],
							"fltMinPrice" => intval($arItem["VALUES"]["MIN"]["FILTERED_VALUE"]) ? $arItem["VALUES"]["MIN"]["FILTERED_VALUE"] : $arItem["VALUES"]["MIN"]["VALUE"],
							"fltMaxPrice" => intval($arItem["VALUES"]["MAX"]["FILTERED_VALUE"]) ? $arItem["VALUES"]["MAX"]["FILTERED_VALUE"] : $arItem["VALUES"]["MAX"]["VALUE"],
							"precision" => $precision,
							"colorUnavailableActive" => 'colorUnavailableActive_' . $key,
							"colorAvailableActive" => 'colorAvailableActive_' . $key,
							"colorAvailableInactive" => 'colorAvailableInactive_' . $key,
						);
						?>
						<script type="text/javascript">
							BX.ready(function () {
								window['trackBar<?= $key ?>'] = new BX.Iblock.SmartFilter(<?= CUtil::PhpToJSObject($arJsParams) ?>);
							});
						</script>
					<? endif;
				}

				//not prices
				foreach ($arResult["ITEMS"] as $key => $arItem) {
					if (
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

					if ($arItem['CODE'] == 'SALE' || $arItem['CODE'] == 'ATT_NAL_STORE')
						continue;
		

					$shortValues = array_filter($arItem["VALUES"], fn($filterValue) => mb_strlen($filterValue["VALUE"]) <= 6);
					$areAllValuesShort = count($shortValues) == count($arItem["VALUES"]);
					?>

					<div
						class="<? if ($arParams["FILTER_VIEW_MODE"] == "HORIZONTAL"): ?>col-sm-6 col-md-4<? else: ?><? endif ?> bx-filter-parameters-box <? if ($arItem["DISPLAY_EXPANDED"] == "Y"): ?>bx-active<? endif ?>"
					>
						<div class="row">
							<div class="col-xs-12 col-12">
								<div
									class="bx-filter-parameters-box-title"
									onclick="smartFilter.hideFilterProps(this)"
								>
									<span class="bx-filter-parameters-box-hint">
										<?= $arItem["NAME"] ?>
										<? if ($arItem["FILTER_HINT"] <> ""): ?>
											<i
												id="item_title_hint_<? echo $arItem["ID"] ?>"
												class="fa fa-question-circle"
											></i>
											<script type="text/javascript">
												new top.BX.CHint({
													parent: top.BX("item_title_hint_<? echo $arItem["ID"] ?>"),
													show_timeout: 10,
													hide_timeout: 200,
													dx: 2,
													preventHide: true,
													min_width: 250,
													hint: '<?= CUtil::JSEscape($arItem["FILTER_HINT"]) ?>'
												});
											</script>
										<? endif ?>
										<i
											data-role="prop_angle"
											class="fa fa-angle-<? if ($arItem["DISPLAY_EXPANDED"] == "Y"): ?>up<? else: ?>down<? endif ?>"
										></i>
									</span>
								</div>
								<div
									class="bx-filter-block"
									data-role="bx_filter_block"
								>
									<span class="bx-filter-container-modef"></span>

									<div class="row bx-filter-parameters-box-container">
										<?
										$arCur = current($arItem["VALUES"]);
										switch ($arItem["DISPLAY_TYPE"]) {
											case "A": //NUMBERS_WITH_SLIDER
												?>
												<div class="col-6 bx-filter-parameters-box-container-block bx-left">
													<span class="bx-ft-sub">
														<?= GetMessage("CT_BCSF_FILTER_FROM") ?>
													</span>
													<div class="bx-filter-input-container">
														<input
															class="min-price"
															type="text"
															name="<? echo $arItem["VALUES"]["MIN"]["CONTROL_NAME"] ?>"
															id="<? echo $arItem["VALUES"]["MIN"]["CONTROL_ID"] ?>"
															value="<? echo $arItem["VALUES"]["MIN"]["HTML_VALUE"] ?>"
															size="5"
															onkeyup="smartFilter.keyup(this)"
														/>
													</div>
												</div>
												<div class="col-6 bx-filter-parameters-box-container-block bx-right">
													<span class="bx-ft-sub">
														<?= GetMessage("CT_BCSF_FILTER_TO") ?>
													</span>
													<div class="bx-filter-input-container">
														<input
															class="max-price"
															type="text"
															name="<? echo $arItem["VALUES"]["MAX"]["CONTROL_NAME"] ?>"
															id="<? echo $arItem["VALUES"]["MAX"]["CONTROL_ID"] ?>"
															value="<? echo $arItem["VALUES"]["MAX"]["HTML_VALUE"] ?>"
															size="5"
															onkeyup="smartFilter.keyup(this)"
														/>
													</div>
												</div>

												<div class="col- bx-ui-slider-track-container">
													<div
														class="bx-ui-slider-track"
														id="drag_track_<?= $key ?>"
													>
														<?
														$precision = $arItem["DECIMALS"] ? $arItem["DECIMALS"] : 0;
														$step = ($arItem["VALUES"]["MAX"]["VALUE"] - $arItem["VALUES"]["MIN"]["VALUE"]) / 4;
														$value1 = number_format($arItem["VALUES"]["MIN"]["VALUE"], $precision, ".", "");
														$value2 = number_format($arItem["VALUES"]["MIN"]["VALUE"] + $step, $precision, ".", "");
														$value3 = number_format($arItem["VALUES"]["MIN"]["VALUE"] + $step * 2, $precision, ".", "");
														$value4 = number_format($arItem["VALUES"]["MIN"]["VALUE"] + $step * 3, $precision, ".", "");
														$value5 = number_format($arItem["VALUES"]["MAX"]["VALUE"], $precision, ".", "");
														?>
														<div class="bx-ui-slider-part p1"><span>
																<?= $value1 ?>
															</span></div>
														<div class="bx-ui-slider-part p2"><span>
																<?= $value2 ?>
															</span></div>
														<div class="bx-ui-slider-part p3"><span>
																<?= $value3 ?>
															</span></div>
														<div class="bx-ui-slider-part p4"><span>
																<?= $value4 ?>
															</span></div>
														<div class="bx-ui-slider-part p5"><span>
																<?= $value5 ?>
															</span></div>

														<div
															class="bx-ui-slider-pricebar-vd"
															style="left: 0;right: 0;"
															id="colorUnavailableActive_<?= $key ?>"
														></div>
														<div
															class="bx-ui-slider-pricebar-vn"
															style="left: 0;right: 0;"
															id="colorAvailableInactive_<?= $key ?>"
														></div>
														<div
															class="bx-ui-slider-pricebar-v"
															style="left: 0;right: 0;"
															id="colorAvailableActive_<?= $key ?>"
														></div>
														<div
															class="bx-ui-slider-range"
															id="drag_tracker_<?= $key ?>"
															style="left: 0;right: 0;"
														>
															<a
																class="bx-ui-slider-handle left"
																style="left:0;"
																href="javascript:void(0)"
																id="left_slider_<?= $key ?>"
															></a>
															<a
																class="bx-ui-slider-handle right"
																style="right:0;"
																href="javascript:void(0)"
																id="right_slider_<?= $key ?>"
															></a>
														</div>
													</div>
												</div>
												<?
												$arJsParams = array(
													"leftSlider" => 'left_slider_' . $key,
													"rightSlider" => 'right_slider_' . $key,
													"tracker" => "drag_tracker_" . $key,
													"trackerWrap" => "drag_track_" . $key,
													"minInputId" => $arItem["VALUES"]["MIN"]["CONTROL_ID"],
													"maxInputId" => $arItem["VALUES"]["MAX"]["CONTROL_ID"],
													"minPrice" => $arItem["VALUES"]["MIN"]["VALUE"],
													"maxPrice" => $arItem["VALUES"]["MAX"]["VALUE"],
													"curMinPrice" => $arItem["VALUES"]["MIN"]["HTML_VALUE"],
													"curMaxPrice" => $arItem["VALUES"]["MAX"]["HTML_VALUE"],
													"fltMinPrice" => intval($arItem["VALUES"]["MIN"]["FILTERED_VALUE"]) ? $arItem["VALUES"]["MIN"]["FILTERED_VALUE"] : $arItem["VALUES"]["MIN"]["VALUE"],
													"fltMaxPrice" => intval($arItem["VALUES"]["MAX"]["FILTERED_VALUE"]) ? $arItem["VALUES"]["MAX"]["FILTERED_VALUE"] : $arItem["VALUES"]["MAX"]["VALUE"],
													"precision" => $arItem["DECIMALS"] ? $arItem["DECIMALS"] : 0,
													"colorUnavailableActive" => 'colorUnavailableActive_' . $key,
													"colorAvailableActive" => 'colorAvailableActive_' . $key,
													"colorAvailableInactive" => 'colorAvailableInactive_' . $key,
												);
												?>
												<script type="text/javascript">
													BX.ready(function () {
														window['trackBar<?= $key ?>'] = new BX.Iblock.SmartFilter(<?= CUtil::PhpToJSObject($arJsParams) ?>);
													});
												</script>
												<?
												break;
											case "B": //NUMBERS
												?>
												<div class="col-6 bx-filter-parameters-box-container-block bx-left">
													<span class="bx-ft-sub">
														<?= GetMessage("CT_BCSF_FILTER_FROM") ?>
													</span>
													<div class="bx-filter-input-container">
														<input
															class="min-price"
															type="text"
															name="<? echo $arItem["VALUES"]["MIN"]["CONTROL_NAME"] ?>"
															id="<? echo $arItem["VALUES"]["MIN"]["CONTROL_ID"] ?>"
															value="<? echo $arItem["VALUES"]["MIN"]["HTML_VALUE"] ?>"
															size="5"
															onkeyup="smartFilter.keyup(this)"
														/>
													</div>
												</div>
												<div class="col-6 bx-filter-parameters-box-container-block bx-right">
													<span class="bx-ft-sub">
														<?= GetMessage("CT_BCSF_FILTER_TO") ?>
													</span>
													<div class="bx-filter-input-container">
														<input
															class="max-price"
															type="text"
															name="<? echo $arItem["VALUES"]["MAX"]["CONTROL_NAME"] ?>"
															id="<? echo $arItem["VALUES"]["MAX"]["CONTROL_ID"] ?>"
															value="<? echo $arItem["VALUES"]["MAX"]["HTML_VALUE"] ?>"
															size="5"
															onkeyup="smartFilter.keyup(this)"
														/>
													</div>
												</div>
												<?
												break;
											case "G": //CHECKBOXES_WITH_PICTURES
												?>
												<div class="col-xs-12">
													<div class="bx-filter-param-btn-inline">
														<? foreach ($arItem["VALUES"] as $val => $ar): ?>
															<input
																style="display: none"
																type="checkbox"
																name="<?= $ar["CONTROL_NAME"] ?>"
																id="<?= $ar["CONTROL_ID"] ?>"
																value="<?= $ar["HTML_VALUE"] ?>"
																<?= $ar["CHECKED"] ? 'checked="checked"' : '' ?>
															/>
															<?
															$class = "";
															if ($ar["CHECKED"])
																$class .= " bx-active";
															if ($ar["DISABLED"])
																$class .= " disabled";
															?>
															<label
																for="<?= $ar["CONTROL_ID"] ?>"
																data-role="label_<?= $ar["CONTROL_ID"] ?>"
																class="bx-filter-param-label <?= $class ?>"
																onclick="smartFilter.keyup(BX('<?= CUtil::JSEscape($ar["CONTROL_ID"]) ?>')); BX.toggleClass(this, 'bx-active');"
															>
																<span class="bx-filter-param-btn bx-color-sl">
																	<? if (isset($ar["FILE"]) && !empty($ar["FILE"]["SRC"])): ?>
																		<span
																			class="bx-filter-btn-color-icon"
																			style="background-image:url('<?= $ar["FILE"]["SRC"] ?>');"
																		></span>
																	<? endif ?>
																</span>
															</label>
														<? endforeach ?>
													</div>
												</div>
												<?
												break;
											case "H": //CHECKBOXES_WITH_PICTURES_AND_LABELS
												?>
												<div class="col-xs-12">
													<div class="bx-filter-param-btn-block">
														<? foreach ($arItem["VALUES"] as $val => $ar): ?>
															<input
																style="display: none"
																type="checkbox"
																name="<?= $ar["CONTROL_NAME"] ?>"
																id="<?= $ar["CONTROL_ID"] ?>"
																value="<?= $ar["HTML_VALUE"] ?>"
																<? echo $ar["CHECKED"] ? 'checked="checked"' : '' ?>
															/>
															<?
															$class = "";
															if ($ar["CHECKED"])
																$class .= " bx-active";
															if ($ar["DISABLED"])
																$class .= " disabled";
															?>
															<label
																for="<?= $ar["CONTROL_ID"] ?>"
																data-role="label_<?= $ar["CONTROL_ID"] ?>"
																class="bx-filter-param-label<?= $class ?>"
																onclick="smartFilter.keyup(BX('<?= CUtil::JSEscape($ar["CONTROL_ID"]) ?>')); BX.toggleClass(this, 'bx-active');"
															>
																<span class="bx-filter-param-btn bx-color-sl">
																	<? if (isset($ar["FILE"]) && !empty($ar["FILE"]["SRC"])): ?>
																		<span
																			class="bx-filter-btn-color-icon"
																			style="background-image:url('<?= $ar["FILE"]["SRC"] ?>');"
																		></span>
																	<? endif ?>
																</span>
																<span
																	class="bx-filter-param-text"
																	title="<?= $ar["VALUE"]; ?>"
																>
																	<?= $ar["VALUE"]; ?>
																	<?
																	if ($arParams["DISPLAY_ELEMENT_COUNT"] !== "N" && isset($ar["ELEMENT_COUNT"])):
																		?> (<span data-role="count_<?= $ar["CONTROL_ID"] ?>">
																			<? echo $ar["ELEMENT_COUNT"]; ?>
																		</span>)
																		<?
																	endif; ?>
																</span>
															</label>
														<? endforeach ?>
													</div>
												</div>
												<?
												break;
											case "P": //DROPDOWN
												$checkedItemExist = false;
												?>
												<div class="col-xs-12">
													<div class="bx-filter-select-container">
														<div
															class="bx-filter-select-block"
															onclick="smartFilter.showDropDownPopup(this, '<?= CUtil::JSEscape($key) ?>')"
														>
															<div
																class="bx-filter-select-text"
																data-role="currentOption"
															>
																<?
																foreach ($arItem["VALUES"] as $val => $ar) {
																	if ($ar["CHECKED"]) {
																		echo $ar["VALUE"];
																		$checkedItemExist = true;
																	}
																}
																if (!$checkedItemExist) {
																	echo GetMessage("CT_BCSF_FILTER_ALL");
																}
																?>
															</div>
															<div class="bx-filter-select-arrow"></div>
															<input
																style="display: none"
																type="radio"
																name="<?= $arCur["CONTROL_NAME_ALT"] ?>"
																id="<? echo "all_" . $arCur["CONTROL_ID"] ?>"
																value=""
															/>
															<? foreach ($arItem["VALUES"] as $val => $ar): ?>
																<input
																	style="display: none"
																	type="radio"
																	name="<?= $ar["CONTROL_NAME_ALT"] ?>"
																	id="<?= $ar["CONTROL_ID"] ?>"
																	value="<? echo $ar["HTML_VALUE_ALT"] ?>"
																	<? echo $ar["CHECKED"] ? 'checked="checked"' : '' ?>
																/>
															<? endforeach ?>
															<div
																class="bx-filter-select-popup"
																data-role="dropdownContent"
																style="display: none;"
															>
																<ul>
																	<li>
																		<label
																			for="<?= "all_" . $arCur["CONTROL_ID"] ?>"
																			class="bx-filter-param-label"
																			data-role="label_<?= "all_" . $arCur["CONTROL_ID"] ?>"
																			onclick="smartFilter.selectDropDownItem(this, '<?= CUtil::JSEscape("all_" . $arCur["CONTROL_ID"]) ?>')"
																		>
																			<? echo GetMessage("CT_BCSF_FILTER_ALL"); ?>
																		</label>
																	</li>
																	<?
																	foreach ($arItem["VALUES"] as $val => $ar):
																		$class = "";
																		if ($ar["CHECKED"])
																			$class .= " selected";
																		if ($ar["DISABLED"])
																			$class .= " disabled";
																		?>
																		<li>
																			<label
																				for="<?= $ar["CONTROL_ID"] ?>"
																				class="bx-filter-param-label<?= $class ?>"
																				data-role="label_<?= $ar["CONTROL_ID"] ?>"
																				onclick="smartFilter.selectDropDownItem(this, '<?= CUtil::JSEscape($ar["CONTROL_ID"]) ?>')"
																			>
																				<?= $ar["VALUE"] ?>
																			</label>
																		</li>
																	<? endforeach ?>
																</ul>
															</div>
														</div>
													</div>
												</div>
												<?
												break;
											case "R": //DROPDOWN_WITH_PICTURES_AND_LABELS
												?>
												<div class="col-xs-12">
													<div class="bx-filter-select-container">
														<div
															class="bx-filter-select-block"
															onclick="smartFilter.showDropDownPopup(this, '<?= CUtil::JSEscape($key) ?>')"
														>
															<div
																class="bx-filter-select-text fix"
																data-role="currentOption"
															>
																<?
																$checkedItemExist = false;
																foreach ($arItem["VALUES"] as $val => $ar):
																	if ($ar["CHECKED"]) {
																		?>
																		<? if (isset($ar["FILE"]) && !empty($ar["FILE"]["SRC"])): ?>
																			<span
																				class="bx-filter-btn-color-icon"
																				style="background-image:url('<?= $ar["FILE"]["SRC"] ?>');"
																			></span>
																		<? endif ?>
																		<span class="bx-filter-param-text">
																			<?= $ar["VALUE"] ?>
																		</span>
																		<?
																		$checkedItemExist = true;
																	}
																endforeach;
																if (!$checkedItemExist) {
																	?><span class="bx-filter-btn-color-icon all"></span>
																	<?
																	echo GetMessage("CT_BCSF_FILTER_ALL");
																}
																?>
															</div>
															<div class="bx-filter-select-arrow"></div>
															<input
																style="display: none"
																type="radio"
																name="<?= $arCur["CONTROL_NAME_ALT"] ?>"
																id="<? echo "all_" . $arCur["CONTROL_ID"] ?>"
																value=""
															/>
															<? foreach ($arItem["VALUES"] as $val => $ar): ?>
																<input
																	style="display: none"
																	type="radio"
																	name="<?= $ar["CONTROL_NAME_ALT"] ?>"
																	id="<?= $ar["CONTROL_ID"] ?>"
																	value="<?= $ar["HTML_VALUE_ALT"] ?>"
																	<? echo $ar["CHECKED"] ? 'checked="checked"' : '' ?>
																/>
															<? endforeach ?>
															<div
																class="bx-filter-select-popup"
																data-role="dropdownContent"
																style="display: none"
															>
																<ul>
																	<li style="border-bottom: 1px solid #e5e5e5;padding-bottom: 5px;margin-bottom: 5px;">
																		<label
																			for="<?= "all_" . $arCur["CONTROL_ID"] ?>"
																			class="bx-filter-param-label"
																			data-role="label_<?= "all_" . $arCur["CONTROL_ID"] ?>"
																			onclick="smartFilter.selectDropDownItem(this, '<?= CUtil::JSEscape("all_" . $arCur["CONTROL_ID"]) ?>')"
																		>
																			<span class="bx-filter-btn-color-icon all"></span>
																			<? echo GetMessage("CT_BCSF_FILTER_ALL"); ?>
																		</label>
																	</li>
																	<?
																	foreach ($arItem["VALUES"] as $val => $ar):
																		$class = "";
																		if ($ar["CHECKED"])
																			$class .= " selected";
																		if ($ar["DISABLED"])
																			$class .= " disabled";
																		?>
																		<li>
																			<label
																				for="<?= $ar["CONTROL_ID"] ?>"
																				data-role="label_<?= $ar["CONTROL_ID"] ?>"
																				class="bx-filter-param-label<?= $class ?>"
																				onclick="smartFilter.selectDropDownItem(this, '<?= CUtil::JSEscape($ar["CONTROL_ID"]) ?>')"
																			>
																				<? if (isset($ar["FILE"]) && !empty($ar["FILE"]["SRC"])): ?>
																					<span
																						class="bx-filter-btn-color-icon"
																						style="background-image:url('<?= $ar["FILE"]["SRC"] ?>');"
																					></span>
																				<? endif ?>
																				<span class="bx-filter-param-text">
																					<?= $ar["VALUE"] ?>
																				</span>
																			</label>
																		</li>
																	<? endforeach ?>
																</ul>
															</div>
														</div>
													</div>
												</div>
												<?
												break;
											case "K": //RADIO_BUTTONS
												?>
												<div class="col-xs-12">
													<div class="radio">
														<label
															class="bx-filter-param-label"
															for="<? echo "all_" . $arCur["CONTROL_ID"] ?>"
														>
															<span class="bx-filter-input-checkbox">
																<input
																	type="radio"
																	value=""
																	name="<? echo $arCur["CONTROL_NAME_ALT"] ?>"
																	id="<? echo "all_" . $arCur["CONTROL_ID"] ?>"
																	onclick="smartFilter.click(this)"
																/>
																<span class="bx-filter-param-text">
																	<? echo GetMessage("CT_BCSF_FILTER_ALL"); ?>
																</span>
															</span>
														</label>
													</div>
													<? foreach ($arItem["VALUES"] as $val => $ar): ?>
														<div class="radio">
															<label
																data-role="label_<?= $ar["CONTROL_ID"] ?>"
																class="bx-filter-param-label"
																for="<? echo $ar["CONTROL_ID"] ?>"
															>
																<span class="bx-filter-input-checkbox <? echo $ar["DISABLED"] ? 'disabled' : '' ?>">
																	<input
																		type="radio"
																		value="<? echo $ar["HTML_VALUE_ALT"] ?>"
																		name="<? echo $ar["CONTROL_NAME_ALT"] ?>"
																		id="<? echo $ar["CONTROL_ID"] ?>"
																		<? echo $ar["CHECKED"] ? 'checked="checked"' : '' ?>
																		onclick="smartFilter.click(this)"
																	/>
																	<span
																		class="bx-filter-param-text"
																		title="<?= $ar["VALUE"]; ?>"
																	>
																		<?= $ar["VALUE"]; ?>
																		<?
																		if ($arParams["DISPLAY_ELEMENT_COUNT"] !== "N" && isset($ar["ELEMENT_COUNT"])):
																			?>&nbsp;(<span data-role="count_<?= $ar["CONTROL_ID"] ?>">
																				<? echo $ar["ELEMENT_COUNT"]; ?>
																			</span>)
																			<?
																		endif; ?>
																	</span>
																</span>
															</label>
														</div>
													<? endforeach; ?>
												</div>
												<?
												break;
											case "U": //CALENDAR
												?>
												<div class="col-xs-12">
													<div class="bx-filter-parameters-box-container-block">
														<div class="bx-filter-input-container bx-filter-calendar-container">
															<? $APPLICATION->IncludeComponent(
																'bitrix:main.calendar',
																'',
																array(
																	'FORM_NAME' => $arResult["FILTER_NAME"] . "_form",
																	'SHOW_INPUT' => 'Y',
																	'INPUT_ADDITIONAL_ATTR' => 'class="calendar" placeholder="' . FormatDate("SHORT", $arItem["VALUES"]["MIN"]["VALUE"]) . '" onkeyup="smartFilter.keyup(this)" onchange="smartFilter.keyup(this)"',
																	'INPUT_NAME' => $arItem["VALUES"]["MIN"]["CONTROL_NAME"],
																	'INPUT_VALUE' => $arItem["VALUES"]["MIN"]["HTML_VALUE"],
																	'SHOW_TIME' => 'N',
																	'HIDE_TIMEBAR' => 'Y',
																),
																null,
																array('HIDE_ICONS' => 'Y')
															); ?>
														</div>
													</div>
													<div class="bx-filter-parameters-box-container-block">
														<div class="bx-filter-input-container bx-filter-calendar-container">
															<? $APPLICATION->IncludeComponent(
																'bitrix:main.calendar',
																'',
																array(
																	'FORM_NAME' => $arResult["FILTER_NAME"] . "_form",
																	'SHOW_INPUT' => 'Y',
																	'INPUT_ADDITIONAL_ATTR' => 'class="calendar" placeholder="' . FormatDate("SHORT", $arItem["VALUES"]["MAX"]["VALUE"]) . '" onkeyup="smartFilter.keyup(this)" onchange="smartFilter.keyup(this)"',
																	'INPUT_NAME' => $arItem["VALUES"]["MAX"]["CONTROL_NAME"],
																	'INPUT_VALUE' => $arItem["VALUES"]["MAX"]["HTML_VALUE"],
																	'SHOW_TIME' => 'N',
																	'HIDE_TIMEBAR' => 'Y',
																),
																null,
																array('HIDE_ICONS' => 'Y')
															); ?>
														</div>
													</div>
												</div>
												<?
												break;
											default: //CHECKBOXES
												?>
												<div class="col-xs-12 sizebox col-12<?= $areAllValuesShort ? ' two-columns' : '' ?>">
													<? $count = count($arItem["VALUES"]) - 6;
													$i = 0;
													?>
													<? foreach ($arItem["VALUES"] as $val => $ar):
														if ($ar['CONTROL_NAME_ALT'] == 'arrFilter_254') {
															$arColor = color($ar["VALUE"], 'lit');
															$ar["NAME2"] = $arColor["NAME"];
														} else {
															$ar["NAME2"] = $ar["VALUE"];
														}
														?>

														<div
															class="checkbox <?= $ar['CONTROL_NAME_ALT'] == 'arrFilter_254' ? 'checkbox_tick' : 'checkbox_tick_desktop' ?>"
														>
															<label
																data-role="label_<?= $ar["CONTROL_ID"] ?>"
																class="bx-filter-param-label <? echo $ar["DISABLED"] ? 'disabled' : '' ?>"
																for="<? echo $ar["CONTROL_ID"] ?>"
															>
																<span class="bx-filter-input-checkbox ">
																	<input
																		type="checkbox"
																		value="<? echo $ar["HTML_VALUE"] ?>"
																		name="<? echo $ar["CONTROL_NAME"] ?>"
																		id="<? echo $ar["CONTROL_ID"] ?>"
																		<?= $ar["CHECKED"] ? 'checked="checked"' : '' ?>
																		onclick="smartFilter.click(this)"
																		<?= $ar["DISABLED"] ? 'disabled' : '' ?>
																	/>
																	<span
																		class="bx-filter-param-text"
																		title="<?= $ar["NAME2"]; ?>"
																	>
																		<? if ($ar['NEW_URL'] != '') { ?><a
																				href="<?= $ar['NEW_URL'] ?>"
																				class="label_href<?= $ar["DISABLED"] ? " disabled" : "" ?>"
																			>
																				<?= $ar["NAME2"]; ?>
																			</a>
																		<? } else { ?>
																			<?= $ar["NAME2"]; ?>
																		<? } ?>
																		<?
																		if ($arParams["DISPLAY_ELEMENT_COUNT"] !== "N" && isset($ar["ELEMENT_COUNT"])):
																			?>&nbsp;(<span data-role="count_<?= $ar["CONTROL_ID"] ?>">
																				<? echo $ar["ELEMENT_COUNT"]; ?>
																			</span>)
																			<?
																		endif; ?>
																	</span>
																	<? if ($ar['CONTROL_NAME_ALT'] == 'arrFilter_254') {
																		$isTransparent = $arColor['NAME'] == 'прозрачный';
																		?>
																		<span
																			class="<?= $isTransparent ? ' transparent' : '' ?>"
																			style="<?= $arColor["BG"] ?>"
																		>
																			<? if ($ar['CHECKED']) { ?>
																				
																				<svg
																					class="selected-checkmark-icon <?= $isTransparent ? ' is-dark' : '' ?>"
																					viewBox="0 0 13 10"
																					fill="none"
																					xmlns="http://www.w3.org/2000/svg"
																				>
																					<path
																						d="M4.0708 10L0 5.9292L1.76991 4.24779L4.0708 6.54867L10.6195 0L12.3894 1.76991L4.0708 10Z"
																						fill="currentcolor"
																					/>
																				</svg>
																			<? } ?>
																		<? } ?>
																	</span>
															</label>
														</div>
														<? if (($i++ == 5) && ($count > 0)) { ?>
															<? if (!$areAllValuesShort) { ?><div class="clearfix"></div><? } ?>
															<div class="show_more_filter<?= $areAllValuesShort ? ' two-columns' : '' ?> <?= in_array($arItem['CODE'], ['WIDTH', 'PO_PRIMENENIU']) ? 'active': '' ?>"> <span class="show_more_filter__text">Ещё
																<?= $count; ?> значений</span> 
															</div>
															<div class="show_more_block<?= $areAllValuesShort ? ' two-columns' : '' ?>">
															<? } ?>
														<? endforeach; ?>
														<? if ($count > 0) { ?>
															<? if (!$areAllValuesShort) { ?><div class="clearfix"></div><? } ?>
															<div class="show_less_filter<?= $areAllValuesShort ? ' two-columns' : '' ?>"> <span class="show_more_filter__text">Свернуть</span></div>
														</div>
													<? } ?>
												</div>
											<?
										}
										?>
									</div>
									<div style="clear: both"></div>
								</div>
							</div>
						</div>
					</div>
					<?
				}
				?>
			</div><!--//row-->
			<div class="smartfilter__controls row">
				<div class="col-xs-12 bx-filter-button-box">
					<div class="bx-filter-block">
						<div class="bx-filter-parameters-box-container smartfilter__controls-buttons">
							<input
								class="btn btn-themes btn--full-mobile"
								type="submit"
								id="set_filter"
								name="set_filter"
								value="<?= GetMessage("CT_BCSF_SET_FILTER") ?>"
							/>
							<input
								class="btn btn-link hide-mobile-btn"
								type="submit"
								id="del_filter"
								name="del_filter"
								value="<?= GetMessage("CT_BCSF_DEL_FILTER") ?>"
							/>
							<div
								class="bx-filter-popup-result <? if ($arParams["FILTER_VIEW_MODE"] == "VERTICAL")
									echo $arParams["POPUP_POSITION"] ?>"
									id="modef"
								<? 
								if (!isset($arResult["ELEMENT_COUNT"]))
									echo 'style="display: none"';
								else 
									echo 'style="display: inline-block';
								 ?>
							>
								<? echo GetMessage("CT_BCSF_FILTER_COUNT", array("#ELEMENT_COUNT#" => '<span id="modef_num">' . intval($arResult["ELEMENT_COUNT"]) . '</span>')); ?>
								<span class="arrow"></span>
								<br />
								<a
									href="<? echo $arResult["FILTER_URL"] ?>"
									target=""
								>
									<? echo GetMessage("CT_BCSF_FILTER_SHOW") ?>
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="clb"></div>
		</form>
	</div>
</div>
<script type="text/javascript">
	var smartFilter = new JCSmartFilter('<? echo CUtil::JSEscape($arResult["FORM_ACTION"]) ?>', '<?= CUtil::JSEscape($arParams["FILTER_VIEW_MODE"]) ?>', <?= CUtil::PhpToJSObject($arResult["JS_FILTER_PARAMS"]) ?>);
</script>