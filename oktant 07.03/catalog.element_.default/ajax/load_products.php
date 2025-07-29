<?php
require($_SERVER['DOCUMENT_ROOT'].'/bitrix/modules/main/include/prolog_before.php');
// Получаем данные из AJAX-запроса
//$data = isset($_POST['data']) ? $_POST['data'] : [];

function array_multisort_value()
	{
		$args = func_get_args();
		$data = array_shift($args);
		foreach ($args as $n => $field) {
			if (is_string($field)) {
				$tmp = array();
				foreach ($data as $key => $row) {
					$tmp[$key] = $row[$field];
				}
				$args[$n] = $tmp;
			}
		}
		$args[] = &$data;
		call_user_func_array('array_multisort', $args);
		return array_pop($args);
	}

if(isset($_POST['data'])){
	
		$complect = $_POST['data'];
		$sectid = $_POST['sect'];
		//print_r($complect);
		
		if (!empty($complect)) {
		    $complects = explode(",", $complect);
		    foreach ($complects as $c):
		        $complectscl[] = trim($c);
		        
		    endforeach;
		    //$arFilter_complects = array("IBLOCK_ID"=>9,"ACTIVE"=>"Y","PROPERTY_CML2_ARTICLE"=>$complectscl);
		    //$arSelectN = Array("ID", "IBLOCK_ID", "NAME", 'PREVIEW_TEXT', 'DETAIL_TEXT', 'PREVIEW_PICTURE', "PROPERTY_*");
		    CModule::IncludeModule("iblock");
		    $arFilter_complects = array("IBLOCK_ID" => 9, "ACTIVE" => "Y", "PROPERTY_CML2_TRAITS" => $complectscl, "SECTION_ID" => $sectid);
		    $res_complects = CIBlockElement::GetList(array("ID" => "DESC"), $arFilter_complects);
		    $contComlects = "";
		    while ($ob_complects = $res_complects->GetNextElement()) {
		        $arFields_complects = $ob_complects->GetFields();
		        $arFields_complects['PROPERTIES'] = $ob_complects->GetProperties();
		        if ($arFields_complects['IBLOCK_SECTION_ID'] > 0):
		            $array_complects[$arFields_complects['IBLOCK_SECTION_ID']][] = $arFields_complects;
		        endif;
		    
			}
		    $ccc = 1;
    		$ddd = 1;
		    $arFilter_complectsS = array("IBLOCK_ID" => 9, "ACTIVE" => "Y", "PROPERTY_CML2_TRAITS" => $complectscl);
		    $res_complectsS = CIBlockElement::GetList(array("IBLOCK_SECTION_ID" => "ASC"), $arFilter_complectsS);
		    while ($ob_complectsS = $res_complectsS->GetNextElement()) {

		        $arFields_complectsS = $ob_complectsS->GetFields();
		        if($ddd == 1){
		    		$arFields_complects4sect2 = $arFields_complectsS['IBLOCK_SECTION_ID'];
				}
		        if ($arFields_complectsS['IBLOCK_SECTION_ID'] > 0):
		        	//echo $arFields_complects4sect2;
		        	if($arFields_complects4sect2 == $arFields_complectsS['IBLOCK_SECTION_ID']){
		            	$array_complectsS[$arFields_complectsS['IBLOCK_SECTION_ID']]['name'] = $arFields_complectsS['IBLOCK_SECTION_ID'];
		            	$array_complectsS[$arFields_complectsS['IBLOCK_SECTION_ID']]['count'] = $ccc;
					}else{
						$ccc = 1;
						$array_complectsS[$arFields_complectsS['IBLOCK_SECTION_ID']]['name'] = $arFields_complectsS['IBLOCK_SECTION_ID'];
		            	$array_complectsS[$arFields_complectsS['IBLOCK_SECTION_ID']]['count'] = $ccc;
					}
					$arFields_complects4sect2 = $arFields_complectsS['IBLOCK_SECTION_ID'];
					$ccc++;
					//echo $ccc;
		            $ddd++;
		        	
		            //$array_complectsS[$arFields_complectsS['IBLOCK_SECTION_ID']][] = $arFields_complectsS;
		        endif;
		            
		        $contComlects++;
		    }
		    
		    //print($array_complectsS);
		    $array_complectsS = array_multisort_value($array_complectsS, 'count', SORT_DESC);
		}
		/*if ($s == 1): ?>class="active"<? endif; style="overflow:hidden; max-height: 370px" */
								?>
											<script type="text/javascript">
												var offsetHeight = $(".items-slider-komplect-more-wrapp .items-slide").height();
												console.log(offsetHeight);
												//if ($(window).width() <= 619) {
					
												if ($(window).width() <= 1023) {
													$('.items-slider-komplect-more-wrapp').css({'overflow':'hidden', 'max-height': offsetHeight+1190});
												}else{
													$('.items-slider-komplect-more-wrapp').css({'overflow':'hidden', 'max-height': offsetHeight+1110});
												}
												/*}else if ($(window).width() <= 1023) {
					
													$('.items-slider-komplect-more-wrapp').css({'overflow':'hidden', 'max-height': '430px'});
												} else {
			
													$('.items-slider-komplect-more-wrapp').css({'overflow':'hidden', 'max-height': '385px'});
												}*/
											</script>			
		<?
								 echo '<div class="items-slider items-slider-komplect-more-wrapp">';
								 
								 						echo'<div class="tabs-nav tabs-nav-komplect" data-tabs="#accessories-tabs">
                                                    		<ul>';
							                                
							                                $s = 1;
							                                foreach ($array_complectsS as $sect_id => $comps):
							                                    $sect_arr = CIBlockSection::GetByID($comps['name'])->GetNext();
							                                    if($comps['name'] == $sectid){
							                                    	$act = 'class="active"';
							                                    }else{
							                                    	$act = '';
							                                    }
							                                    echo'<li '.$act.'><a '.$comps['count'].' data-sect="'.$comps['name'].'" href="#accessories-tab-'.$comps['name'].'">'.$sect_arr['NAME'].'</a></li>';
							                                    
							                                    $s++;
							                                endforeach;
							                            
							                            echo'</ul></div>';
								 
												foreach ($array_complects as $sect_id => $comps):
                                                        foreach ($comps as $comp):
                                                            $item = $comp;
															//print_r($item);
                                                            echo '<div class="items-slide">';
                                                            include($_SERVER["DOCUMENT_ROOT"] . "/" . SITE_TEMPLATE_PATH . "/inc/tovar.php");
                                                            echo '</div>';
                                                            
                                                        endforeach;
                                                        echo '</div>';
                                                $allcountcompl = count($comps);
                                                    if($allcountcompl >= 4){
                                                    echo '<div class="descmore4">Показать все</div>';
                                                    }
                                                endforeach;
                                 
                                                    
	
      	/*if(CModule::IncludeModule('iblock')){
			$arSelectN = Array("ID", "IBLOCK_ID", "NAME", 'PREVIEW_TEXT', 'DETAIL_TEXT', 'PREVIEW_PICTURE', "PROPERTY_*");
			$arFilterN = Array("IBLOCK_ID"=>1, "ACTIVE"=>"Y");
			$resN = CIBlockElement::GetList(Array('date_active_from'=>'DESC'), $arFilterN, false, false, $arSelectN);
			while($obN = $resN->GetNextElement()){
				$arFieldsN = $obN->GetFields();
				$propertiesN = $obN->GetProperties();
				$prodImageN = CFile::GetPath($arFieldsN['PREVIEW_PICTURE']);
				//print_r($arFieldsS);
			?>	
			
															<div class="items-slide">
                                                                <? include($_SERVER["DOCUMENT_ROOT"] . "/" . SITE_TEMPLATE_PATH . "/inc/tovar.php"); ?>
                                                            </div>
			
					<div class="tp-blog mb-60">
					<? if(!empty($prodImageN)){ ?>
                        <div class="tp-blog__thumb m-img mb-35">
                           <a href="blog-details.html"><img src="<?=$prodImageN?>" alt="blog-img"></a>
                        </div>
                    <? } ?>
                        <div class="tp-blog__content">
                           <div class="tp-blog__meta mb-15">
                              <span><a href="#"><i class="fal fa-clock"></i> <?=$arFieldsN['NAME']?> </a></span>
                              <span><a href="#"><i class="far fa-user"></i> Iqbal</a></span>
                              <span><a href="#"><i class="far fa-comments"></i> 2 Comments</a></span>
                           </div>
                           <h3 class="tp-blog__title mb-15"><a href="blog-details.html"><?=$arFieldsN['NAME']?></a></h3>
                           <p><?=$arFieldsN['DETAIL_TEXT']?></p>
                           <div class="tp-blog-btn mt-25">
                              <a href="blog-details.html" class="tp-btn">Подробнее</a>
                           </div>
                        </div>
                     </div>				
			<?	
			}
		}*/
	
$response = [
    'status' => 'success',
    'message' => 'Данные успешно загружены'
];
	//echo json_encode($response);
}

// Здесь вы можете обработать данные, например, выполнить запрос к базе данных
// и вернуть нужные элементы в формате JSON.



// Возвращаем ответ в формате JSON


?>