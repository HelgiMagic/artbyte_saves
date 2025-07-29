<?
if ($_POST["BasketDelete"] and CModule::IncludeModule("sale"))
{
   CSaleBasket::DeleteAll(CSaleBasket::GetBasketUserID());
   LocalRedirect("/personal/cart/");
}

if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED!==true) die();
/** @var CBitrixComponentTemplate $this */
/** @var array $arParams */
/** @var array $arResult */
use Bitrix\Main;
use RSMasterSpace\RSMTools;


foreach ($arResult["GRID"]["ROWS"] as $k => $arItem) {
    //склады
    $allcount = 0;
    $stores = array();
    $resStore = CCatalogStore::GetList(
       array('PRODUCT_ID'=>'ASC','ID' => 'ASC'),
       array('ACTIVE' => 'Y','PRODUCT_ID'=>array( $arItem['PRODUCT_ID'])),
       false,
       false,
       array()
    );
    while($sklad = $resStore->Fetch()){
            unset($AMOUNT);
            $arFilter_store = array("PRODUCT_ID"=> $arItem['PRODUCT_ID'],"STORE_ID"=>$sklad['ID']);
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
    
    $arResult["GRID"]["ROWS"][$k]['STORES'] = $stores;
    
    $arPrices = RSMTools::get_tovar_prices( $arItem['PRODUCT_ID'] );
    $arResult["GRID"]["ROWS"][$k] = array_merge($arResult["GRID"]["ROWS"][$k], $arPrices);

    
    
    $obElement = CIBlockElement::GetByID( $arItem['PRODUCT_ID'] );
    if ($arElement = $obElement->GetNext()) {
        $dbElms = CIBlockElement::GetList ( 
            array('ID'=>'asc'),  
            array( 
                'IBLOCK_ID'=>$arElement['IBLOCK_ID'], 
                'ID' => $arElement['ID'] 
            ), 
            false, false, 
            array('IBLOCK_ID', 'ID', 'NAME', 'PROPERTY_*' ) 
        );
        if ($obElm = $dbElms->GetNextElement())
        {
            $arResult["GRID"]["ROWS"][$k]['PROPERTIES'] = $obElm->GetProperties();
        } 
    } else {
        $arResult["GRID"]["ROWS"][$k]['PROPERTIES'] = [];
    }

    // KRATNOST_PRODAZHI
    if (intVal($arResult["GRID"]["ROWS"][$k]['PROPERTIES']['KRATNOST_PRODAZHI']['VALUE'])>0) {
       $arResult["GRID"]["ROWS"][$k]['MEASURE_RATIO_VALUE'] = 
           $arResult["GRID"]["ROWS"][$k]['MEASURE_RATIO'] = $arResult["GRID"]["ROWS"][$k]['PROPERTIES']['KRATNOST_PRODAZHI']['VALUE'];
    }
    
    //PR( $arResult["GRID"]["ROWS"][$k] );
    
} 

RSMTools::refresh_Brands();