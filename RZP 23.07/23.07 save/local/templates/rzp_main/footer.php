<?if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true) die();?>
<?php
$isMain = ($APPLICATION->GetCurPage(false) == '/') ? true : false;
$isDetail = $APPLICATION->GetPageProperty('IS_DETAIL_PAGE', 'N') === 'Y';
?>
<? if(!$isMain && !$isDetail) {?>
    </section>

<? } ?>
<footer class="full-width">
    <div class="footer-content content-width">
        <div class="partners">
            <a href="">
                <img src="<?= SITE_TEMPLATE_PATH ?>/assets/images/footerlogo1.png" alt="" />
            </a>

            <a href="">
                <img src="<?= SITE_TEMPLATE_PATH ?>/assets/images/footerlogo2.png" alt="" />
            </a>

            <a href="">
                <img src="<?= SITE_TEMPLATE_PATH ?>/assets/images/footerlogo3.png" alt="" />
            </a>

            <a href="">
                <img src="<?= SITE_TEMPLATE_PATH ?>/assets/images/footerlogo4.png" alt="" />
            </a>
        </div>

        <div class="nav text-16-always">
            <a class="with-underline" href="">Производство</a>
            <a class="with-underline" href="">Услуги</a>
            <a class="with-underline" href="">О компании</a>
            <a class="with-underline" href="">Контакты</a>
        </div>

        <div class="contacts">
            <a href="">
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M18.249 13.41C17.463 15.003 16.398 16.59 15.309 18.015C14.2748 19.3575 13.1703 20.6443 12 21.87C10.8297 20.6443 9.72518 19.3575 8.691 18.015C7.602 16.59 6.537 15.003 5.751 13.41C4.956 11.8005 4.5 10.293 4.5 9C4.5 7.01088 5.29018 5.10322 6.6967 3.6967C8.10322 2.29018 10.0109 1.5 12 1.5C13.9891 1.5 15.8968 2.29018 17.3033 3.6967C18.7098 5.10322 19.5 7.01088 19.5 9C19.5 10.293 19.0425 11.8005 18.249 13.41ZM12 24C12 24 21 15.471 21 9C21 6.61305 20.0518 4.32387 18.364 2.63604C16.6761 0.948211 14.3869 0 12 0C9.61305 0 7.32387 0.948211 5.63604 2.63604C3.94821 4.32387 3 6.61305 3 9C3 15.471 12 24 12 24Z"
                        fill="white"></path>
                    <path
                        d="M12 12C11.2044 12 10.4413 11.6839 9.87868 11.1213C9.31607 10.5587 9 9.79565 9 9C9 8.20435 9.31607 7.44129 9.87868 6.87868C10.4413 6.31607 11.2044 6 12 6C12.7956 6 13.5587 6.31607 14.1213 6.87868C14.6839 7.44129 15 8.20435 15 9C15 9.79565 14.6839 10.5587 14.1213 11.1213C13.5587 11.6839 12.7956 12 12 12ZM12 13.5C13.1935 13.5 14.3381 13.0259 15.182 12.182C16.0259 11.3381 16.5 10.1935 16.5 9C16.5 7.80653 16.0259 6.66193 15.182 5.81802C14.3381 4.97411 13.1935 4.5 12 4.5C10.8065 4.5 9.66193 4.97411 8.81802 5.81802C7.97411 6.66193 7.5 7.80653 7.5 9C7.5 10.1935 7.97411 11.3381 8.81802 12.182C9.66193 13.0259 10.8065 13.5 12 13.5Z"
                        fill="white"></path>
                </svg>

                <span
                    >152907, Ярославская область, г. Рыбинск, пр. Серова, д. 89.</span
                >
            </a>

            <a href="">
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M22.0001 4H2L2.00006 20H22.0001V4Z"
                        stroke="white"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"></path>
                    <path
                        d="M22 7L13.03 12.7C12.7213 12.8934 12.3643 12.996 12 12.996C11.6357 12.996 11.2787 12.8934 10.97 12.7L2 7"
                        stroke="white"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"></path>
                </svg>

                <span>zakaz@sborkaelectroniki.ru</span>
            </a>

            <a href="">
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M22.0001 4H2L2.00006 20H22.0001V4Z"
                        stroke="white"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"></path>
                    <path
                        d="M22 7L13.03 12.7C12.7213 12.8934 12.3643 12.996 12 12.996C11.6357 12.996 11.2787 12.8934 10.97 12.7L2 7"
                        stroke="white"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"></path>
                </svg>

                <span>pribor@rzp.su</span>
            </a>

            <a href="">
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M10.554 6.24003L7.17099 2.33503C6.78099 1.88503 6.06599 1.88703 5.61299 2.34103L2.83099 5.12803C2.00299 5.95703 1.76599 7.18803 2.24499 8.17503C5.10615 14.1003 9.88471 18.8856 15.806 21.755C16.792 22.234 18.022 21.997 18.85 21.168L21.658 18.355C22.113 17.9 22.114 17.181 21.66 16.791L17.74 13.426C17.33 13.074 16.693 13.12 16.282 13.532L14.918 14.898C14.8483 14.9715 14.7564 15.02 14.6564 15.0359C14.5564 15.0518 14.454 15.0343 14.365 14.986C12.1355 13.702 10.2861 11.8502 9.00499 9.61903C8.95651 9.52991 8.93886 9.42726 8.95477 9.32706C8.97069 9.22687 9.01928 9.13474 9.09299 9.06503L10.453 7.70403C10.865 7.29003 10.91 6.65103 10.554 6.24003Z"
                        stroke="white"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"></path>
                </svg>

                <span>8 (930) 122-72-65</span>
            </a>

            <a href="">
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M10.554 6.24003L7.17099 2.33503C6.78099 1.88503 6.06599 1.88703 5.61299 2.34103L2.83099 5.12803C2.00299 5.95703 1.76599 7.18803 2.24499 8.17503C5.10615 14.1003 9.88471 18.8856 15.806 21.755C16.792 22.234 18.022 21.997 18.85 21.168L21.658 18.355C22.113 17.9 22.114 17.181 21.66 16.791L17.74 13.426C17.33 13.074 16.693 13.12 16.282 13.532L14.918 14.898C14.8483 14.9715 14.7564 15.02 14.6564 15.0359C14.5564 15.0518 14.454 15.0343 14.365 14.986C12.1355 13.702 10.2861 11.8502 9.00499 9.61903C8.95651 9.52991 8.93886 9.42726 8.95477 9.32706C8.97069 9.22687 9.01928 9.13474 9.09299 9.06503L10.453 7.70403C10.865 7.29003 10.91 6.65103 10.554 6.24003Z"
                        stroke="white"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"></path>
                </svg>

                <span>8 (4855) 59-24-00</span>
            </a>
        </div>

        <div class="other-links">
            <a class="with-underline-always" href=""
                >Горячая линия по противодействию коррупции</a
            >
            <a class="with-underline-always" href=""
                >Единая цифровая платформа</a
            >
            <a class="with-underline-always" href=""
                >Участник проекта «Производительность.РФ»</a
            >
        </div>
    </div>

    <div class="footer-copyright content-width text-12">
        <span>© 2025 АО «РЗП» Все права защищены</span>
        <a class="with-underline-always" href="/policy"
            >Политика конфеденциальности</a
        >
    </div>
</footer>


</body>
</html>