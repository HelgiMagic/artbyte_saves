<?
/**
 * Bitrix Framework
 * @package bitrix
 * @subpackage main
 * @copyright 2001-2014 Bitrix
 */

/**
 * Bitrix vars
 * @global CMain $APPLICATION
 * @var array $arParams
 * @var array $arResult
 * @var CBitrixComponentTemplate $this
 */

if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true)die();

if($arResult["SHOW_SMS_FIELD"] == true)
{
    CJSCore::Init('phone_auth');
}

//one css for all system.auth.* forms
$APPLICATION->SetAdditionalCSS("/bitrix/css/main/system.auth/flat/style.css");
?>

<div class="bx-authform">
    <noindex>
        <?if($arResult["SHOW_EMAIL_SENT_CONFIRMATION"]):?>
            <div class="alert alert-success"><?echo GetMessage("AUTH_EMAIL_SENT")?></div>
        <?endif?>

        <?if(!$arResult["SHOW_EMAIL_SENT_CONFIRMATION"] && $arResult["USE_EMAIL_CONFIRMATION"] === "Y"):?>
            <div class="alert alert-warning"><?echo GetMessage("AUTH_EMAIL_WILL_BE_SENT")?></div>
        <?endif?>

        <?if($arResult["SHOW_SMS_FIELD"] == true):?>

            <form method="post" action="<?=$arResult["AUTH_URL"]?>" name="regform">

                <h3 class="nav-title">Вход в личный кабинет / <button type="button" data-href="/ajax/auth.php?register=yes">Регистрация</button></h3>


                <input type="hidden" name="SIGNED_DATA" value="<?=htmlspecialcharsbx($arResult["SIGNED_DATA"])?>" />

                <div class="bx-authform-formgroup-container">
                    <div class="bx-authform-label-container"><span class="bx-authform-starrequired">*</span><?echo GetMessage("main_register_sms_code")?></div>
                    <div class="bx-authform-input-container2">
                        <input class="input" type="text" name="SMS_CODE" maxlength="255" value="<?=htmlspecialcharsbx($arResult["SMS_CODE"])?>" autocomplete="off" />
                    </div>
                </div>

                <div class="bx-authform-formgroup-container">
                    <input type="submit" class="btn btn-primary" name="code_submit_button" value="<?echo GetMessage("main_register_sms_send")?>" />
                </div>

            </form>

            <script>
                new BX.PhoneAuth({
                    containerId: 'bx_register_resend',
                    errorContainerId: 'bx_register_error',
                    interval: <?=$arResult["PHONE_CODE_RESEND_INTERVAL"]?>,
                    data:
                        <?=CUtil::PhpToJSObject([
                            'signedData' => $arResult["SIGNED_DATA"],
                        ])?>,
                    onError:
                        function(response)
                        {
                            var errorNode = BX('bx_register_error');
                            errorNode.innerHTML = '';
                            for(var i = 0; i < response.errors.length; i++)
                            {
                                errorNode.innerHTML = errorNode.innerHTML + BX.util.htmlspecialchars(response.errors[i].message) + '<br />';
                            }
                            errorNode.style.display = '';
                        }
                });
            </script>

            <div id="bx_register_error" style="display:none" class="alert alert-danger"></div>

            <div id="bx_register_resend"></div>

        <?elseif(!$arResult["SHOW_EMAIL_SENT_CONFIRMATION"]):?>

<button class="close"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="12" fill="#F0F0F0"/><path stroke="#0060CC" stroke-width="1.5" d="m6.53 6.47 10.607 10.606m-10.667 0L17.076 6.47"/></svg></button>


            <form method="post" action="<?=$arResult["AUTH_URL"]?>" name="bform" enctype="multipart/form-data">

                <h3 class="nav-title"><button type="button" data-href="/ajax/auth.php">Вход в личный кабинет</button> / Регистрация</h3>


                <input type="hidden" name="AUTH_FORM" value="Y" />
                <input type="hidden" name="TYPE" value="REGISTRATION" />

                <div class="bx-authform-formgroup-container">
                    <div class="bx-authform-label-container"><?=GetMessage("AUTH_NAME")?></div>
                    <div class="bx-authform-input-container2">
                        <input class="input" type="text" name="USER_NAME" maxlength="255" value="<?=$arResult["USER_NAME"]?>" />
                    </div>
                </div>

                <div class="bx-authform-formgroup-container">
                    <div class="bx-authform-label-container"><?=GetMessage("AUTH_LAST_NAME")?></div>
                    <div class="bx-authform-input-container2">
                        <input class="input" type="text" name="USER_LAST_NAME" maxlength="255" value="<?=$arResult["USER_LAST_NAME"]?>" />
                    </div>
                </div>

                <div class="bx-authform-formgroup-container" style="display: none">
                    <div class="bx-authform-label-container"><span class="bx-authform-starrequired">*</span><?=GetMessage("AUTH_LOGIN_MIN")?></div>
                    <div class="bx-authform-input-container2">
                        <input class="input" type="text" id="authLoginInput" name="USER_LOGIN" maxlength="255" value="<?=$arResult["USER_LOGIN"]?>" />
                    </div>
                </div>

                    <div class="bx-authform-formgroup-container">
                        <div class="bx-authform-label-container"><?if($arResult["EMAIL_REQUIRED"]):?><span class="bx-authform-starrequired">*</span><?endif?><?=GetMessage("AUTH_EMAIL")?></div>
                        <div class="bx-authform-input-container2">
                            <input class="input" type="text" onchange="copyToLogin(this)" name="USER_EMAIL" maxlength="255" value="<?=$arResult["USER_EMAIL"]?>" />
                            <script type="text/javascript">
                                function copyToLogin(el){
                                    //authLoginInput
                                    document.getElementById('authLoginInput').value = el.value;
                                }
                            </script>
                        </div>
                    </div>

                <div class="bx-authform-formgroup-container">
                    <div class="bx-authform-label-container"><span class="bx-authform-starrequired">*</span>Пароль (не менее 6 символов)</div>
                    <div class="bx-authform-input-container2">
                        <?if($arResult["SECURE_AUTH"]):?>
                            <div class="bx-authform-psw-protected" id="bx_auth_secure" style="display:none"><div class="bx-authform-psw-protected-desc"><span></span><?echo GetMessage("AUTH_SECURE_NOTE")?></div></div>

                            <script type="text/javascript">
                                document.getElementById('bx_auth_secure').style.display = '';
                            </script>
                        <?endif?>
                        <input class="input" type="password" name="USER_PASSWORD" maxlength="255" value="<?=$arResult["USER_PASSWORD"]?>" autocomplete="off" />
                    </div>
                </div>

                <div class="bx-authform-formgroup-container password-confirmation">
                    <div class="bx-authform-label-container"><span class="bx-authform-starrequired">*</span><?=GetMessage("AUTH_CONFIRM")?></div>
                    <div class="bx-authform-input-container2">
                        <?if($arResult["SECURE_AUTH"]):?>
                            <div class="bx-authform-psw-protected" id="bx_auth_secure_conf" style="display:none"><div class="bx-authform-psw-protected-desc"><span></span><?echo GetMessage("AUTH_SECURE_NOTE")?></div></div>

                            <script type="text/javascript">
                                document.getElementById('bx_auth_secure_conf').style.display = '';
                            </script>
                        <?endif?>
                        <input class="input" type="password" name="USER_CONFIRM_PASSWORD" maxlength="255" value="<?=$arResult["USER_CONFIRM_PASSWORD"]?>" autocomplete="off" />
                    </div>
                </div>


                <?if($arResult["PHONE_REGISTRATION"]):?>
                    <div class="bx-authform-formgroup-container">
                        <div class="bx-authform-label-container"><?if($arResult["PHONE_REQUIRED"]):?><span class="bx-authform-starrequired">*</span><?endif?><?echo GetMessage("main_register_phone_number")?></div>
                        <div class="bx-authform-input-container">
                            <input type="text" name="USER_PHONE_NUMBER" maxlength="255" value="<?=$arResult["USER_PHONE_NUMBER"]?>" />
                        </div>
                    </div>
                <?endif?>

                <?if($arResult["USER_PROPERTIES"]["SHOW"] == "Y"):?>
                    <?foreach ($arResult["USER_PROPERTIES"]["DATA"] as $FIELD_NAME => $arUserField):?>

                        <div class="bx-authform-formgroup-container">
                            <div class="bx-authform-label-container"><?if ($arUserField["MANDATORY"]=="Y"):?><span class="bx-authform-starrequired">*</span><?endif?><?=$arUserField["EDIT_FORM_LABEL"]?></div>
                            <div class="bx-authform-input-container">
                                <?
                                $APPLICATION->IncludeComponent(
                                    "bitrix:system.field.edit",
                                    $arUserField["USER_TYPE"]["USER_TYPE_ID"],
                                    array(
                                        "bVarsFromForm" => $arResult["bVarsFromForm"],
                                        "arUserField" => $arUserField,
                                        "form_name" => "bform"
                                    ),
                                    null,
                                    array("HIDE_ICONS"=>"Y")
                                );
                                ?>
                            </div>
                        </div>

                    <?endforeach;?>
                <?endif;?>
                <?if ($arResult["USE_CAPTCHA"] == "Y"):?>
                    <input type="hidden" name="captcha_sid" value="<?=$arResult["CAPTCHA_CODE"]?>" />

                    <div class="bx-authform-formgroup-container">
                        <div class="bx-authform-label-container">
                            <span class="bx-authform-starrequired">*</span>Введите проверочное слово с картинки
                        </div>
                        <div class="bx-captcha"><img src="/bitrix/tools/captcha.php?captcha_sid=<?=$arResult["CAPTCHA_CODE"]?>" width="180" height="40" alt="CAPTCHA" /></div>
                        <div class="bx-authform-input-container2">
                            <input class="input" type="text" name="captcha_word" maxlength="50" value="" autocomplete="off"/>
                        </div>
                    </div>

                <?endif?>
                <div class="bx-authform-formgroup-container">
                    <div class="bx-authform-label-container">
                    </div>
                    <div class="bx-authform-input-container">
                        <?$APPLICATION->IncludeComponent("bitrix:main.userconsent.request", "",
                            array(
                                "ID" => COption::getOptionString("main", "new_user_agreement", ""),
                                "IS_CHECKED" => "Y",
                                "AUTO_SAVE" => "N",
                                "IS_LOADED" => "Y",
                                "ORIGINATOR_ID" => $arResult["AGREEMENT_ORIGINATOR_ID"],
                                "ORIGIN_ID" => $arResult["AGREEMENT_ORIGIN_ID"],
                                "INPUT_NAME" => $arResult["AGREEMENT_INPUT_NAME"],
                                "REPLACE" => array(
                                    "button_caption" => GetMessage("AUTH_REGISTER"),
                                    "fields" => array(
                                        rtrim(GetMessage("AUTH_NAME"), ":"),
                                        rtrim(GetMessage("AUTH_LAST_NAME"), ":"),
                                        rtrim(GetMessage("AUTH_LOGIN_MIN"), ":"),
                                        rtrim(GetMessage("AUTH_PASSWORD_REQ"), ":"),
                                        rtrim(GetMessage("AUTH_EMAIL"), ":"),
                                    )
                                ),
                            )
                        );?>
                    </div>
                </div>

                        
                <?
                if(!empty($arParams["~AUTH_RESULT"])):
                    $text = str_replace(array("<br>", "<br />"), "\n", $arParams["~AUTH_RESULT"]["MESSAGE"]);
                    ?>
                    <div class="alert <?=($arParams["~AUTH_RESULT"]["TYPE"] == "OK"? "alert-success":"alert-danger")?>"><?=nl2br(htmlspecialcharsbx($text))?></div>
                <?endif?>

                <div class="bx-authform-formgroup-container form-buttons" style="margin-top: 44px;">
                    <button type="button" style="flex: 1;" class="forgot-button" data-href="/ajax/auth.php">Авторизация</button>
                    <input style="flex: 1;" type="submit" class="btn btn-primary" name="Register" value="<?=GetMessage("AUTH_REGISTER")?>" />
                </div>

                <div class="bx-authform-description-container" style="padding: 0;margin: 0 auto;width: fit-content; margin-top: 6px;">
                    <span class="bx-authform-starrequired">*</span><?=GetMessage("AUTH_REQ")?>
                </div>
            </form>

            <script type="text/javascript">
                document.bform.USER_NAME.focus();
            </script>

        <?endif?>

        <style>
            .password-confirmation {
                display: none;
            }
        </style>

        <script>
            var passwordInput = document.querySelector('input[name="USER_PASSWORD"]');
            var passwordConfirmationInput = document.querySelector('input[name="USER_CONFIRM_PASSWORD"]');


            if (passwordInput && passwordConfirmationInput) {
                passwordInput.addEventListener('input', function() {
                    passwordConfirmationInput.value = passwordInput.value;
                });
            }
        </script>

    </noindex>
</div>
