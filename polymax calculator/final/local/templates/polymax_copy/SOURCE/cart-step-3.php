<!doctype html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Корзина. Шаг 3</title>
    <link rel="stylesheet" href="assets/css/styles.css">
    <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
    <script src="assets/js/prefix-free.min.js"></script>
    <script src="assets/js/owl-carousel/owl.carousel.min.js"></script>
    <link rel="stylesheet" href="assets/js/owl-carousel/assets/owl.carousel.min.css">
    <link rel="stylesheet" href="assets/js/owl-carousel/assets/owl.theme.default.min.css">
    <script src="assets/js/main.js"></script>
</head>
<body>
<header class="header">
    <div class="header__logo">
        <a href="">
            <img src="assets/img/header/header-logo@2x.png" alt="">
        </a>
    </div>
    <div class="header__content">
        <div class="header__tools">
            <div class="header__search">
                <form class="form form--search" action="">
                    <div class="form__ele-wrap">
                        <input type="text" placeholder="Поиск">
                        <button type="submit"></button>
                    </div>
                </form>
            </div>
            <div class="header__phones">
                <div class="header__phone">
                    <span>Москва</span>
                    <a href="">8 (800) 454-22-25</a>
                </div>
                <div class="header__phone">
                    <span>Москва</span>
                    <a href="">8 (800) 454-22-25</a>
                </div>
            </div>
            <div class="header__socials">
                <span>Онлайн-чат</span>
                <ul>
                    <li>
                        <a href="" style="background-color:#0dc143;">
                            <img src="assets/img/header/header-whatsapp@2x.png" alt="">
                        </a>
                    </li>
                    <li>
                        <a href="" style="background-color:#5a93e0;">
                            <img src="assets/img/header/header-skype@2x.png" alt="">
                        </a>
                    </li>
                    <li>
                        <a href="" style="background-color:#705299;">
                            <img src="assets/img/header/header-viber@2x.png" alt="">
                        </a>
                    </li>
                    <li>
                        <a href="" style="background-color:#6aacdf;">
                            <img src="assets/img/header/header-telegram@2x.png" alt="">
                        </a>
                    </li>
                </ul>
            </div>
            <div class="header-cart">
                <div class="header-cart__icon">
                    <div class="header-cart__total" id="header-cart__total">1</div>
                </div>
                <span>Корзина</span>
                <div class="header-cart__price" id="header-cart__price">4 569 ₽</div>
            </div>
        </div>
        <div class="header__nav">
            <nav>
                <ul>
                    <li><a href="">Каталог</a></li>
                    <li><a href="">Прайс-лист</a></li>
                    <li><a href="">Доставка</a></li>
                    <li><a href="">Монтаж</a></li>
                    <li><a href="">Опт</a></li>
                    <li><a href="">О нас</a></li>
                    <li><a href="" class="sale">Акции</a></li>
                    <li><a href="">Контакты</a></li>
                </ul>
            </nav>
        </div>
    </div>
</header>
<div class="main-nav">
    <nav>
        <ul>
            <li><a href=""><div class="icon"><img src="assets/img/menu-nav/cat-poly-icon@2x.png" alt=""></div>Поликарбонат</a></li>
            <li><a href=""><div class="icon"><img src="assets/img/menu-nav/cat-komp-icon@2x.png" alt=""></div>Комплектующие</a></li>
            <li><a href=""><div class="icon"><img src="assets/img/menu-nav/cat-org-icon@2x.png" alt=""></div>Оргстекло</a></li>
            <li><a href=""><div class="icon"><img src="assets/img/menu-nav/cat-pvh-icon@2x.png" alt=""></div>ПВХ вспененный</a></li>
            <li><a href=""><div class="icon"><img src="assets/img/menu-nav/cat-pet-icon@2x.png" alt=""></div>ПЭТ листы</a></li>
            <li><a href=""><div class="icon"><img src="assets/img/menu-nav/cat-tkan-icon@2x.png" alt=""></div>Баннерная ткань</a></li>
            <li><a href=""><div class="icon"><img src="assets/img/menu-nav/cat-tep-icon@2x.png" alt=""></div>Теплицы</a></li>
            <li><a href=""><div class="icon"><img src="assets/img/menu-nav/cat-sale-icon@2x.png" alt=""></div>Акции</a></li>
        </ul>
    </nav>
</div>
<div class="main-content">
    <section class="breadcrumbs">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <ul>
                        <li>
                            <a href="">Главная</a>
                        </li>
                        <li>
                            <a href="">Корзина</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </section>
    <div class="section-heading">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <h1>Корзина</h1>
                </div>
            </div>
        </div>
    </div>
    <section class="cart-steps">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div class="cart-steps__item done">
                        <span>01</span>
                        <span>Корзина</span>
                    </div>
                    <div class="cart-steps__item done">
                        <span>02</span>
                        <span>Контакты <br/>и доставка</span>
                    </div>
                    <div class="cart-steps__item active">
                        <span>03</span>
                        <span>Оплата и <br>подтверждение <br>заказа</span>
                    </div>
                    <div class="cart-steps__item">
                        <span>04</span>
                        <span>Спасибо <br>за покупку</span>
                    </div>

                </div>
            </div>
        </div>
    </section>


    <section class="payment-method">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div class="payment-method__heading">
                        <span>Выберите способ оплаты</span>
                    </div>
                </div>
                <div class="col-12">
                    <div class="payment-method__item cash active">
                        <h4>Наличными при самовывозе или доставке</h4>
                        <span>Оплата производится при получении заказа в нашем магазине</span>
                    </div>
                </div>
                <div class="col-12">
                    <div class="payment-method__item online-pay">
                        <h4>Онлайн-оплата банковской картой при самовывозе</h4>
                        <span>Для оплаты покупки Вы будете перенаправлены на платежный шлюз ОАО “Сбербанк” России, для ввода реквизитов вашей карта.
Соединение с платежным шлюзом и передача информации осуществляется в защитном режиме с использованием протокола SSL</span>
                    </div>
                </div>
                <div class="col-12">
                    <div class="payment-method__item non-cash">
                        <h4>Безналичный расчет для юр. лиц</h4>
                        <span>Выставленй счет можно оплатить в любом банке. Счет сформируется автоматически после заказа</span>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <section class="order-check">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div class="order-check__heading">
                        <span>Проверьте состав заказа</span>
                    </div>
                </div>
                <div class="col-9">
                    <div class="order-check__tabl">
                        <table>
                            <thead>
                            <tr>
                                <td>Товар</td>
                                <td>Цена</td>
                                <td>Количество</td>
                                <td>Сумма</td>
                            </tr>
                            </thead>
                            <tbody>
                            <tr class="item">
                                <td class="product-item">
                                    <div class="product">
                                        <div class="product__media">
                                            <a href=""></a>
                                        </div>
                                        <div class="product__content">
                                            <div class="product__info">
                                                <div class="product__stock">
                                                    <span>В наличии</span>
                                                </div>
                                            </div>
                                            <div class="product__name">
                                                <a href="">Сотовый поликарбонат 6мм, цветной, 6м</a>
                                            </div>
                                            <div class="product__sku">
                                                <span>00000130810</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="price">
                                    <span>1800</span>
                                    <span>руб.</span>
                                </td>
                                <td class="quantity">
                                    <span>1</span>
                                </td>
                                <td class="price">
                                    <span>45 000</span>
                                    <span>руб.</span>
                                </td>
                            </tr>
                            <tr class="item">
                                <td class="product-item">
                                    <div class="product">
                                        <div class="product__media">
                                            <a href=""></a>
                                        </div>
                                        <div class="product__content">
                                            <div class="product__info">
                                                <div class="product__stock">
                                                    <span>В наличии</span>
                                                </div>
                                            </div>
                                            <div class="product__name">
                                                <a href="">Сотовый поликарбонат 6мм, цветной, 6м</a>
                                            </div>
                                            <div class="product__sku">
                                                <span>00000130810</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="price">
                                    <span>1800</span>
                                    <span>руб.</span>
                                </td>
                                <td class="quantity">
                                    <span>2</span>
                                </td>
                                <td class="price">
                                    <span>45 000</span>
                                    <span>руб.</span>
                                </td>
                            </tr>
                            <tr class="item">
                                <td class="product-item">
                                    <div class="product">
                                        <div class="product__media">
                                            <a href=""></a>
                                        </div>
                                        <div class="product__content">
                                            <div class="product__info">
                                                <div class="product__stock">
                                                    <span>В наличии</span>
                                                </div>
                                            </div>
                                            <div class="product__name">
                                                <a href="">Сотовый поликарбонат 6мм, цветной, 6м</a>
                                            </div>
                                            <div class="product__sku">
                                                <span>00000130810</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="price">
                                    <span>1800</span>
                                    <span>руб.</span>
                                </td>
                                <td class="quantity">
                                    <span>3</span>
                                </td>
                                <td class="price">
                                    <span>45 000</span>
                                    <span>руб.</span>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="col-3">
                    <div class="order-check__price">
                        <span>Стоимость материалов</span>
                        <strong>96 782 руб.</strong>
                        <span>Доставка</span>
                        <strong>96 782 руб.</strong>
                        <span>Скидка 10%:</span>
                        <strong>-30 000 руб.</strong>
                        <span>Сумма к оплате:</span>
                        <strong>126 782 руб.*</strong>
                    </div>
                    <div class="order-check__button">
                        <a href="">Завершить оформление</a>
                    </div>
                </div>
            </div>
        </div>
    </section>











    <footer class="footer">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div class="footer__item">
                        <div class="footer__heading">
                            <h5>Адрес:</h5>
                        </div>
                        <span class="footer__desc">Санкт-Петербург, проспект Александровской фермы,<br>Д. 29 литера С Ярославль, Тутаевское шоссе, 10</span>
                        <div class="footer__nav">
                            <nav>
                                <ul>
                                    <li><a href="">Каталог</a></li>
                                    <li><a href="">Доставка</a></li>
                                    <li><a href="">О компании</a></li>
                                    <li><a href="">Контакты</a></li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                    <div class="footer__item">
                        <div class="footer__heading">
                            <h5>Телефон</h5>
                        </div>
                        <div class="footer__phones">
                            <div class="footer__phone">
                                <a href="">+7 (812) 454-22-25,</a>
                            </div>
                            <div class="footer__phone">
                                <a href="">+7 (812) 454-22-25</a>
                            </div>
                            <span>Прием звонков с 10:00 до 19:00</span>
                        </div>
                    </div>
                    <div class="footer__item">
                        <div class="footer__heading">
                            <h5>Время работы:</h5>
                        </div>
                        <span class="footer__desc">Пн. — Пт. с9:30 до 18:30,<br>Сб с 10:00 до 16:00,<br>Вс — выходной</span>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</div>
</body>
</html>