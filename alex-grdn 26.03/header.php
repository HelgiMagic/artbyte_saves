<?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
$APPLICATION->SetPageProperty("keywords", "врубель, врубель картины, михаил врубель, художник врубель, музей врубеля, михаил врубель картины, врубель купить, врубель работы, врубель галерея");
$APPLICATION->SetPageProperty("description", "Просветительский проект \"Александровский сад\"- авторские программы об искусстве конца XIX - начала XX веков. Ваш уникальный шанс узнать об искусстве больше!");
$APPLICATION->SetPageProperty("title", "Александровский сад - просветительский проект, предлагающий разнообразные курсы, лекции и выставки по искусству и культуре.");
$APPLICATION->SetTitle("Просветительский проект \"Александровский сад\"");

global $arTheme;
?>

<header>
    <div class="content">
        <div class="first-half">
            <div class="first-row">
                <div class="description">Просветительский и образовательный проект</div>
                <div class="search">
                    <input type="text" placeholder="Поиск">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m20.858 20.17-4.53-4.546a7.64 7.64 0 0 0-.551-10.576 7.58 7.58 0 0 0-10.552.185 7.637 7.637 0 0 0-.184 10.589 7.58 7.58 0 0 0 10.54.553l4.53 4.545a.528.528 0 0 0 .889-.379.53.53 0 0 0-.142-.371M4.084 10.635c0-1.294.383-2.56 1.1-3.637a6.53 6.53 0 0 1 2.928-2.411 6.5 6.5 0 0 1 7.11 1.419 6.57 6.57 0 0 1 1.414 7.135 6.54 6.54 0 0 1-2.402 2.938 6.5 6.5 0 0 1-3.625 1.104 6.52 6.52 0 0 1-4.611-1.92 6.57 6.57 0 0 1-1.914-4.627" fill="#222"/></svg>
                </div>
            </div>
            <div class="second-row">
                <a href="/" class="font-forum">Главная</a>
                <div class="mega-menu-wrapper">
                    <a href="" class="font-forum">
                        Программы
                        <svg width="9" height="8" viewBox="0 0 9 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 4 0 7.464V.536z" fill="#222"/></svg>
                    </a>

                    <div class="mega-menu">
                        <div class="programs">
                            <?php for ($i = 0; $i < 30; $i++): ?>
                            <div class="program-element">
                                <img src="/upload/resize_cache/iblock/57e/60_60_2/evg8bdilqax1bn0iybq47be85ebol969.jpg" alt="">
                                <div class="content">
                                    <a href="/" class="title">Лекции</a>
                                    <div class="list">
                                        <a href="/" class="title">Визуальная логика цветка: концы и начала</a>
                                        <a href="/" class="title">Сквозь призму декоративности: от цветка к орнаменту</a>
                                        <a href="/" class="title">Философия предмета: «Раковины» Михаила Врубеля</a>
                                        <a href="/" class="title">Космогония узора: о природе форм в творчестве художника</a>
                                    </div>
                                </div>
                            </div>
                            <?php endfor; ?>
                        </div>
                    </div>
                </div>
                <a href="" class="font-forum">Экскурсии</a>
                <a href="" class="font-forum">Кураторы</a>
                <a href="" class="font-forum">Статьи</a>
            </div>
        </div>
        <div class="logo">
            <img src="/local/templates/alex-garden/assets/newlogo.png" alt="">
        </div>
        <div class="second-half">
            <div class="first-row">
                <div class="navigation">
                    <a href="/cart"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.882 6.592a.51.51 0 0 0-.391-.184H6.65L6.11 3.42A.51.51 0 0 0 5.608 3h-2.1A.51.51 0 0 0 3 3.511a.51.51 0 0 0 .51.511h1.674l2.191 12.094c.069.381.254.732.53 1.003a2.22 2.22 0 0 0-.758 2.29 2.22 2.22 0 0 0 1.776 1.626 2.2 2.2 0 0 0 2.204-.967 2.22 2.22 0 0 0 .015-2.413h4.434a2.22 2.22 0 0 0 .247 2.705 2.206 2.206 0 0 0 3.638-.631 2.22 2.22 0 0 0-.673-2.632 2.2 2.2 0 0 0-1.354-.465H9.213a.85.85 0 0 1-.836-.7l-.306-1.685h10.05a1.864 1.864 0 0 0 1.84-1.54l1.03-5.697a.51.51 0 0 0-.109-.418m-10.41 12.256a1.2 1.2 0 0 1-.734 1.102 1.185 1.185 0 0 1-1.295-.259 1.194 1.194 0 0 1 .84-2.036 1.195 1.195 0 0 1 1.189 1.193m8.15 0a1.2 1.2 0 0 1-.733 1.102 1.185 1.185 0 0 1-1.295-.259 1.195 1.195 0 0 1 .84-2.036 1.195 1.195 0 0 1 1.189 1.193m.335-6.323a.85.85 0 0 1-.835.7H7.886L6.836 7.43H19.88z" fill="#222"/></svg></a>
                    <a href="/cabinet/"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.38A9.62 9.62 0 1 0 21.62 12 9.63 9.63 0 0 0 12 2.38M6.666 18.602a6.225 6.225 0 0 1 10.668 0 8.47 8.47 0 0 1-10.668 0m2.127-7.357a3.207 3.207 0 1 1 6.414 0 3.207 3.207 0 0 1-6.414 0m9.385 6.568a7.3 7.3 0 0 0-3.772-2.96 4.338 4.338 0 1 0-4.81 0 7.3 7.3 0 0 0-3.773 2.96 8.488 8.488 0 1 1 12.355 0" fill="#222"/></svg></a>
                    <button class="open-mobile-burger menu-btn"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="6" width="18" height="1" rx=".5" fill="#222"/><rect x="3" y="16" width="18" height="1" rx=".5" fill="#222"/><rect x="3" y="11" width="18" height="1" rx=".5" fill="#222"/></svg></button>
                </div>
    
                <div class="socials">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M29.607 7.4c-4.787-7.4-14.56-9.6-22.14-5C.089 7-2.304 17 2.483 24.4l.398.6-1.595 6 5.983-1.6.599.4c2.593 1.4 5.385 2.2 8.177 2.2 2.992 0 5.984-.8 8.577-2.4C32 24.8 34.194 15 29.607 7.4m-4.189 15.4c-.797 1.2-1.795 2-3.19 2.2-.799 0-1.796.4-5.785-1.2-3.39-1.6-6.183-4.2-8.177-7.2-1.197-1.4-1.795-3.2-1.995-5 0-1.6.598-3 1.596-4Q8.466 7 9.063 7h.998c.399 0 .797 0 .997.8.399 1 1.396 3.4 1.396 3.6.2.2.2.6 0 .8.2.4 0 .8-.2 1-.199.2-.398.6-.598.8-.399.2-.598.6-.399 1 .798 1.2 1.796 2.4 2.793 3.4 1.196 1 2.393 1.8 3.79 2.4.398.2.797.2.997-.2s1.196-1.4 1.595-1.8.599-.4.997-.2l3.192 1.6c.399.2.797.4.997.6.2.6.2 1.4-.2 2" fill="#054478"/></svg>
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 0C7.168 0 0 7.168 0 16s7.168 16 16 16 16-7.168 16-16S24.832 0 16 0m7.424 10.88c-.24 2.528-1.28 8.672-1.808 11.504-.224 1.2-.672 1.6-1.088 1.648-.928.08-1.632-.608-2.528-1.2-1.408-.928-2.208-1.504-3.568-2.4-1.584-1.04-.56-1.616.352-2.544.24-.24 4.336-3.968 4.416-4.304a.32.32 0 0 0-.08-.288c-.096-.08-.224-.048-.336-.032-.144.032-2.384 1.52-6.752 4.464-.64.432-1.216.656-1.728.64-.576-.016-1.664-.32-2.48-.592-1.008-.32-1.792-.496-1.728-1.056.032-.288.432-.576 1.184-.88 4.672-2.032 7.776-3.376 9.328-4.016 4.448-1.856 5.36-2.176 5.968-2.176.128 0 .432.032.624.192.16.128.208.304.224.432-.016.096.016.384 0 .608" fill="#054478"/></svg>
                </div>
    
                <button class="btn btn-default" data-event="jqm" data-param-id="WEB_9" data-name="callback">Обратный звонок</button>
            </div>
            <div class="second-row">
                <a href="" class="font-forum">Интервью</a>
                <a href="" class="font-forum">Художники</a>
                <a href="" class="font-forum">Новости</a>
                <a href="" class="font-forum">О проекте</a>
                <a href="" class="font-forum">Контакты</a>

            </div>
        </div>
    </div>
</header>

<noindex>
<style>
    * {
        box-sizing: border-box;
    }

    header.header_5 {
        display: none;
    }

    body {
        background-color: #F6F7FA;
    }

    header {
        width: 100%;
        background-color: white;
        position: relative;
    }

    header .content {
        max-width: 1520px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
    }

    .first-half {
        width: 41.666667%; // 5 / 12
    }

    .logo {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: 330px;
        bottom: 0;
    }

    .logo img {
        width: 100%;
        object-fit: cover;
        max-width: unset !important;
    }

    .second-half {
        width: 41.666667%;
    }

    .first-row {
        position: relative;
        display: flex;
        justify-content: start;
        gap: 40px;
        align-items: center;
        padding: 40px;
        padding-bottom: 36px;
        height: 124px;
    }

    .second-half .first-row {
        justify-content: end;
    }

    .description {
        max-width: 200px;
        font-size: 16px;
        line-height: 24px;
        font-weight: 300;
    }

    .navigation {
        display: flex;
        gap: 24px;

        a {
            height: auto;
            display: flex
        }
    }
    
    .socials {
        display: flex;
        gap: 24px;
        margin-left: 20px;
    }

    button {
        margin: 0 !important;
    }

    .search {
        position: relative;
        max-width: 242px;
    }

    .search input {
        height: 48px;
        width: 100%;
        border: 1px solid #EBEBEF;
        background: #F6F7FA;
        padding-left: 12px;
        padding-right: 38px;
        border-radius: 6px;
    }

    .search svg {
        position: absolute;
        top: 50%;
        right: 12px;
        transform: translateY(-50%);
    }

    .second-row {
        display: flex;
        gap: 48px;
        padding: 40px;
        padding-top: 12px;
        padding-bottom: 16px;
    }

    .first-half .second-row {
        padding-right: 0;
    }

    .second-half .second-row {
        justify-content: end;
        padding-left: 0;
    }

    .first-row::before {
        content: '';
        width: 200%;
        height: 2px;
        background: rgba(153, 153, 153, 0.2);
        position: absolute;
        bottom: 0px;
        left: 0;
    }

    .first-half .first-row::before {
        transform: translateX(-50%);
    }

    .second-row a {
        color: #222222;
        font-size: 18px;
        line-height: 28px;
        text-wrap: nowrap;
        display: flex;
        gap: 8px;
        align-items: center;
    }

    .second-row a:hover {
        color: #054478;
    }

    .menu-btn {
        display: none;
        padding: 0;
        margin: 0;
        height: fit-content;
        border: none;
        background: none;
    }

    @media (width <= 1450px) {
        .second-row {
            display: none;
        }

        .first-row {
            gap: 24px;
            padding-bottom: 26px;
            height: 114px;
        }

        .logo {
            width: 187px;
        }

        .socials {
            display: none;
        }

        .menu-btn {
            display: flex;
        }

        .navigation {
            margin-right: 12px;
        }
    }

    @media (width <= 1000px) {
        .first-half {
            display: none;
        }


        .second-half {
            width: 100%;
        }

        .first-row {
            padding-right: 16px;
            padding-top: 28px;
            height: 88px;
        }

        button[data-name="callback"] {
            display: none;
        }

        .logo {
            position: static;
            transform: none;
            padding-left: 16px;
            flex-shrink: 0;
            width: 120px;
        }
    }

    /* mega menu */
    .mega-menu {
        display: none;
        position: absolute;
        left: 0;
        width: 100%;
    }

    .mega-menu-wrapper:hover .mega-menu {
        display: block;
        background-color: white;
        box-shadow: 0px 8px 10px -6px #0000001A, 0px 20px 25px -5px #0000001A;
        padding-top: 40px;
    }

    .mega-menu-wrapper:hover svg {
        transform: rotate(90deg);
        transition: all 0.1s;

        path {
            fill: #054478;
        }
    }

    
    .mega-menu-wrapper .programs {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        row-gap: 32px;
        column-gap: 24px;
        max-height: 520px;
        max-width: 1520px;
        margin: 0 auto;
        padding: 40px;
        padding-top: 0;
        overflow-y: auto;
        padding-right: 10px; /* Отступ от контента до скроллбара */
    }

    .mega-menu-wrapper .programs::-webkit-scrollbar {
        width: 1px; /* Ширина скроллбара */
    }

    .mega-menu-wrapper .programs::-webkit-scrollbar-track {
        background-color: #EBEBEF; /* Неактивная часть */
    }

    .mega-menu-wrapper .programs::-webkit-scrollbar-thumb {
        background-color: #555555; /* Активная часть */
    }


    .program-element {
        display: flex;
        gap: 16px;
        align-items: flex-start;

        img {
            width: 40px;
            aspect-ratio:  1 / 1;
        }

        .content {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .title {
            font-size: 18px;
            line-height: 20px;
            font-weight: 700;
            color: #222222;
        }

        .list {
            display: grid;
            gap: 6px;
        }

        .list a {
            font-weight: 400;
            font-size: 16px;
            line-height: 20px;
            color: #555555;
        }

        a {
            max-width: 263px;
            text-wrap: wrap;
        }

        a:hover {
            color: #054478;
        }
    }
</style>
</noindex>

<div style="height: 1000px">bla bla</div>

<?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");?>