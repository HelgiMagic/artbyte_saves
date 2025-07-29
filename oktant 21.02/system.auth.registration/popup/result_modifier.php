<?php

/** @var  array $arParams */
/** @var  array $arResult */

$error = 'Пользователь с логином "'.$arResult['USER_EMAIL'].'" уже существует.<br>';

global $APPLICATION, $DB;
if ($arParams["~AUTH_RESULT"] && $arParams["~AUTH_RESULT"]["MESSAGE"] === $error) {
    $strSql =
        "SELECT ID, LID, ACTIVE, CONFIRM_CODE, LOGIN, EMAIL, NAME, LAST_NAME, LANGUAGE_ID " .
        "FROM b_user u " .
        "WHERE EMAIL='" . $DB->ForSQL($arResult['USER_EMAIL']) . "' " .
        "	AND ACTIVE='N' ";

    $res = $DB->Query($strSql);

    if ($arUser = $res->Fetch()) {
        $confirmCode = randString(8);

        $user = new CUser();
        $arFieldsUser = array(
            "ACTIVE" => "Y",
            "NAME" => $arResult["USER_NAME"],
            "LAST_NAME" => $arResult["USER_LAST_NAME"],
            'CONFIRM_CODE' => $confirmCode,
            "PASSWORD" => $arResult["USER_PASSWORD"],
            "CONFIRM_PASSWORD" => $arResult["USER_CONFIRM_PASSWORD"],
        );
        $user->Update($arUser['ID'], $arFieldsUser);

        // authorize user
        global $USER;
        $USER->Authorize($arUser['ID']);
        LocalRedirect(
            $APPLICATION->GetCurPageParam("", [
                "login",
                "logout",
                "register",
                "forgot_password",
                "change_password",
                "confirm_registration",
                "confirm_code",
                "confirm_user_id"
            ])
        );
    }
}
