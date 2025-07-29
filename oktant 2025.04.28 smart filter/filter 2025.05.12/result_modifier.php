<?if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true)die();

if (isset($arParams["TEMPLATE_THEME"]) && !empty($arParams["TEMPLATE_THEME"]))
{
	$arAvailableThemes = array();
	$dir = trim(preg_replace("'[\\\\/]+'", "/", dirname(__FILE__)."/themes/"));
	if (is_dir($dir) && $directory = opendir($dir))
	{
		while (($file = readdir($directory)) !== false)
		{
			if ($file != "." && $file != ".." && is_dir($dir.$file))
				$arAvailableThemes[] = $file;
		}
		closedir($directory);
	}

	if ($arParams["TEMPLATE_THEME"] == "site")
	{
		$solution = COption::GetOptionString("main", "wizard_solution", "", SITE_ID);
		if ($solution == "eshop")
		{
			$templateId = COption::GetOptionString("main", "wizard_template_id", "eshop_bootstrap", SITE_ID);
			$templateId = (preg_match("/^eshop_adapt/", $templateId)) ? "eshop_adapt" : $templateId;
			$theme = COption::GetOptionString("main", "wizard_".$templateId."_theme_id", "blue", SITE_ID);
			$arParams["TEMPLATE_THEME"] = (in_array($theme, $arAvailableThemes)) ? $theme : "blue";
		}
	}
	else
	{
		$arParams["TEMPLATE_THEME"] = (in_array($arParams["TEMPLATE_THEME"], $arAvailableThemes)) ? $arParams["TEMPLATE_THEME"] : "blue";
	}
}
else
{
	$arParams["TEMPLATE_THEME"] = "blue";
}

$arParams["FILTER_VIEW_MODE"] = (isset($arParams["FILTER_VIEW_MODE"]) && toUpper($arParams["FILTER_VIEW_MODE"]) == "HORIZONTAL") ? "HORIZONTAL" : "VERTICAL";
$arParams["POPUP_POSITION"] = (isset($arParams["POPUP_POSITION"]) && in_array($arParams["POPUP_POSITION"], array("left", "right"))) ? $arParams["POPUP_POSITION"] : "left";

foreach ($arResult['ITEMS'] as $key => $arItemZ) {
    if ($arItemZ['PROPERTY_TYPE'] == 'S') {
        $arTempValues = $arItemZ['VALUES'];
        ksort($arTempValues);
        $arResult['ITEMS'][$key]['VALUES'] = $arTempValues;
    }
    
    $hint=CIBlockProperty::GetByID($arItemZ["ID"], $arItemZ["IBLOCK_ID"])->GetNext()["HINT"]?:'';
    $arResult["ITEMS"][$key]["HINT"]=$hint;
    $arResult['ITEMS'][$key]['NEW_SORT'] = 0;
    if ($arItemZ['FILTER_HINT']) {
        if (preg_match('/^\[(\d+)\]/', $arItemZ['FILTER_HINT'], $matches)) {
            // Первое совпадение содержит число без скобок
            $arResult['ITEMS'][$key]['NEW_SORT'] = $matches[1] ?: 0;

            // Удаляем квадратные скобки с числом из строки
            $newStr = preg_replace('/^\[\d+\]/', '', $arItemZ['FILTER_HINT']);
            $arResult['ITEMS'][$key]['FILTER_HINT'] = $newStr;
            // Вывод результатов
        }
    }
    $arResult['ITEMS'][$key]['CHECKED_COUNT'] = 0;
}

// Быстрый проход: если хоть один элемент имеет ненулевое значение NEW_SORT, сортируем
$hasValid = false;
foreach ($arResult['ITEMS'] as $key => $item) {
    $countActive = 0;
    foreach ($item['VALUES'] as $prop) {
        if ($prop['CHECKED'])
            $countActive++;
    }
    $arResult['ITEMS'][$key]['CHECKED_COUNT'] = $countActive;
    if (!empty($item['NEW_SORT'])) { // empty проверяет наличие и ненулевое значение
        $hasValid = true;
        break;
    }
}

// Если есть хотя бы один валидный NEW_SORT, выполняем сортировку по убыванию
if ($hasValid) {
    usort($arResult['ITEMS'], function($a, $b) {
        $aSort = isset($a['NEW_SORT']) ? (int)$a['NEW_SORT'] : 0;
        $bSort = isset($b['NEW_SORT']) ? (int)$b['NEW_SORT'] : 0;
        return $bSort <=> $aSort; // сортировка по убыванию
    });
}
