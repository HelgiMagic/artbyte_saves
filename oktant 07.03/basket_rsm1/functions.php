<?if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true)die();

/*
if (!function_exists("price_cel_drob")) {

    function price_cel_drob( $price ) {
        //$cel = floor($price);
        //$drob = $price - $cel;
        //$drob = substr('00'.$drob,-2);
        $price = round($price,2);
        $currentpricef = number_format($price,2,'.',' ');
        $arrpricecur = explode('.',$currentpricef);
        $curpriceround = $arrpricecur[0];
        $curpricecop = $arrpricecur[1];
        
        
        //return number_format($cel,0,' ',' ').' <sup>'.$drob.'</sup>';
        
        return $curpriceround.' <sup>'.$curpricecop.'</sup>';
        
    }
    
}
*/    
?>