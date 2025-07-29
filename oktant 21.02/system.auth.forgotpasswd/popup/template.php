<?
if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true)
{
	die();
}
/**
 * @global CMain $APPLICATION
 * @var array $arParams
 * @var array $arResult
 */

//one css for all system.auth.* forms
$APPLICATION->SetAdditionalCSS("/bitrix/css/main/system.auth/flat/style.css");
?>

<div class="bx-authform">

    <button class="close"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="12" fill="#F0F0F0"/><path stroke="#0060CC" stroke-width="1.5" d="m6.53 6.47 10.607 10.606m-10.667 0L17.076 6.47"/></svg></button>

	<form name="bform" method="post" target="_top" action="<?=$arResult["AUTH_URL"]?>">

    <h3 class="nav-title">Восстановление пароля</h3>

<?if($arResult["BACKURL"] <> ''):?>
		<input type="hidden" name="backurl" value="<?=$arResult["BACKURL"]?>" />
<?endif?>
		<input type="hidden" name="AUTH_FORM" value="Y">
		<input type="hidden" name="TYPE" value="SEND_PWD">

        <p style="margin-bottom: 14px; color: #3C4759B2; line-height: 17.5px;">На ваш email будет отправлено письмо со ссылкой для установки нового пароля профиля.</p>

		<div class="bx-authform-formgroup-container">
			<div class="bx-authform-label-container">E-mail или логин</div>
			<div class="bx-authform-input-container2">
				<input class="input" type="text" name="USER_LOGIN" maxlength="255" value="<?=$arResult["USER_LOGIN"]?>" />
				<input type="hidden" name="USER_EMAIL" />
			</div>
		</div>

<?if($arResult["PHONE_REGISTRATION"]):?>
		<div class="bx-authform-formgroup-container">
			<div class="bx-authform-label-container"><?echo GetMessage("forgot_pass_phone_number")?></div>
			<div class="bx-authform-input-container2">
				<input class="input" type="text" name="USER_PHONE_NUMBER" maxlength="255" value="<?=$arResult["USER_PHONE_NUMBER"]?>" />
			</div>
			<div class="bx-authform-note-container"><?echo GetMessage("forgot_pass_phone_number_note")?></div>
		</div>
<?endif?>

<?if ($arResult["USE_CAPTCHA"]):?>
		<input type="hidden" name="captcha_sid" value="<?=$arResult["CAPTCHA_CODE"]?>" />

		<div class="bx-authform-formgroup-container">
			<div class="bx-authform-label-container"><?echo GetMessage("system_auth_captcha")?></div>
			<div class="bx-captcha"><img src="/bitrix/tools/captcha.php?captcha_sid=<?=$arResult["CAPTCHA_CODE"]?>" width="180" height="40" alt="CAPTCHA" /></div>
			<div class="bx-authform-input-container2">
				<input class="input" type="text" name="captcha_word" maxlength="50" value="" autocomplete="off"/>
			</div>
		</div>

<?endif?>

<?
if(!empty($arParams["~AUTH_RESULT"])):
	$text = str_replace(array("<br>", "<br />"), "\n", $arParams["~AUTH_RESULT"]["MESSAGE"]);
	$text = $arParams["~AUTH_RESULT"]["TYPE"] == "OK" ? GetMessage('forgot_pass_email_note') : $text;
?>
	<div class="alert <?=($arParams["~AUTH_RESULT"]["TYPE"] == "OK"? "alert-success":"alert-danger")?>"><?=nl2br(htmlspecialcharsbx($text))?></div>
<?endif?>


        <div class="bx-authform-formgroup-container form-buttons" style="margin-top: 59px;">
            <button type="button" style="flex: 1;" class="forgot-button" data-href="/ajax/auth.php">Авторизация</button>
			<input style="flex: 1;" type="submit" class="btn btn-primary" name="send_account_info" value="<?=GetMessage("AUTH_SEND")?>" />
		</div>

	</form>

</div>

<script type="text/javascript">
document.bform.onsubmit = function(){document.bform.USER_EMAIL.value = document.bform.USER_LOGIN.value;};
document.bform.USER_LOGIN.focus();
</script>
