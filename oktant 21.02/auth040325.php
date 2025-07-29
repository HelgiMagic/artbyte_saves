<?
require($_SERVER['DOCUMENT_ROOT'].'/bitrix/modules/main/include/prolog_before.php');
global $APPLICATION, $USER, $arTheme;

$url = (is_array($arTheme['PERSONAL_PAGE_URL']) ? $arTheme['PERSONAL_PAGE_URL']['VALUE'] : '') ?: SITE_DIR.'personal/';

if($_GET['auth_service_error']){
	LocalRedirect($url);
}
?>
<?if(!$USER->IsAuthorized()):?>
	<?$GLOBALS['APPLICATION']->ShowAjaxHead();?>
	<?if(isset($_REQUEST['backurl']) && $_REQUEST['backurl']){
		// fix ajax url
		if($_REQUEST['backurl'] != $_SERVER['REQUEST_URI']){
			$_SERVER['QUERY_STRING'] = '';
			$_SERVER['REQUEST_URI'] = $_REQUEST['backurl'];

			$APPLICATION->sDocPath2 = GetPagePath(false, true);
			$APPLICATION->sDirPath = GetDirPath($APPLICATION->sDocPath2);
		}
	}?>
	<div id="wrap_ajax_auth" class="form">
		<?
		if($_REQUEST) {
			if ($_REQUEST['register'] === 'yes') {
				$componentName = "bitrix:system.auth.registration";
			} elseif ($_REQUEST['forgot_password'] === 'yes') {
				$componentName = "bitrix:system.auth.forgotpasswd";
			} else {
				$componentName = "bitrix:system.auth.authorize";
			}
		}

		if( !$componentName ){
			$componentName = 'bitrix:system.auth.authorize';
		}
		
		$APPLICATION->IncludeComponent(
			$componentName,
			"popup",
			Array(
				'AUTH_RESULT' => $APPLICATION->arAuthResult ?: '',
				'~AUTH_RESULT' => $APPLICATION->arAuthResult ?: '',
				"REGISTER_URL" => SITE_DIR."/ajax/auth.php?register=yes",
				"PROFILE_URL" => SITE_DIR."/personal/",
				"FORGOT_PASSWORD_URL" => SITE_DIR."/ajax/auth.php?forgot-password=yes",
				"AUTH_URL" => SITE_DIR."/ajax/auth.php",
				"SHOW_ERRORS" => "Y",
				"POPUP_AUTH" => "Y",
				"AJAX_MODE" => "Y",
				"BACKURL" => ((isset($_REQUEST['backurl']) && $_REQUEST['backurl']) ? $_REQUEST['backurl'] : "")
			)
		);?>
	</div>
<?endif;?>