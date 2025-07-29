<?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
$APPLICATION->SetPageProperty("keywords", "врубель, врубель картины, михаил врубель, художник врубель, музей врубеля, михаил врубель картины, врубель купить, врубель работы, врубель галерея");
$APPLICATION->SetPageProperty("description", "Просветительский проект \"Александровский сад\"- авторские программы об искусстве конца XIX - начала XX веков. Ваш уникальный шанс узнать об искусстве больше!");
$APPLICATION->SetPageProperty("title", "Александровский сад - просветительский проект, предлагающий разнообразные курсы, лекции и выставки по искусству и культуре.");
$APPLICATION->SetTitle("Просветительский проект \"Александровский сад\"");

global $arTheme;
?>

<?php
require_once($_SERVER["DOCUMENT_ROOT"] . "/bitrix/modules/main/include.php");
$APPLICATION->AddHeadScript("https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js");
$APPLICATION->SetAdditionalCSS("https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css");
?>

<link rel="stylesheet" href="/test_new-films/style.css">

<!-- заставка -->
<div class="cycle-head fullwidth" style="background: url('/upload/iblock/57e/evg8bdilqax1bn0iybq47be85ebol969.jpg')">
    <div class="content">
        <h1>Сквозь призму декоративности: от цветка к орнаменту</h1>

        <div class="description">
            Фильм из цикла <br>
            Поэзия метаморфоз Михаила Врубеля
        </div>

        <div class="features">
            <a class="feature" href="#films">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 4.5H3A1.5 1.5 0 0 0 1.5 6v12A1.5 1.5 0 0 0 3 19.5h18a1.5 1.5 0 0 0 1.5-1.5V6A1.5 1.5 0 0 0 21 4.5M21 6v2.25H3V6zm0 12H3V9.75h18zm-1.5-2.25a.75.75 0 0 1-.75.75h-3a.75.75 0 1 1 0-1.5h3a.75.75 0 0 1 .75.75m-6 0a.75.75 0 0 1-.75.75h-1.5a.75.75 0 1 1 0-1.5h1.5a.75.75 0 0 1 .75.75" fill="#222"/></svg>
                950 ₽
            </a>
            <a class="feature" href="#films">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" stroke="#222" stroke-width="1.5" stroke-linejoin="round"/><path d="M12.004 6v6.005l4.24 4.24" stroke="#222" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>

                47 минут
            </a>
            <a class="feature" href="#films">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.6034 6.84375C23.4838 6.77964 23.3491 6.74919 23.2135 6.75563C23.078 6.76207 22.9467 6.80516 22.8337 6.88031L19.5 9.09844V6.75C19.5 6.35218 19.342 5.97064 19.0607 5.68934C18.7794 5.40804 18.3978 5.25 18 5.25H3C2.60218 5.25 2.22064 5.40804 1.93934 5.68934C1.65804 5.97064 1.5 6.35218 1.5 6.75V17.25C1.5 17.6478 1.65804 18.0294 1.93934 18.3107C2.22064 18.592 2.60218 18.75 3 18.75H18C18.3978 18.75 18.7794 18.592 19.0607 18.3107C19.342 18.0294 19.5 17.6478 19.5 17.25V14.9062L22.8337 17.1291C22.9576 17.2095 23.1024 17.2515 23.25 17.25C23.4489 17.25 23.6397 17.171 23.7803 17.0303C23.921 16.8897 24 16.6989 24 16.5V7.5C23.9991 7.36505 23.9617 7.23287 23.8919 7.11737C23.8221 7.00187 23.7225 6.90734 23.6034 6.84375ZM18 17.25H3V6.75H18V17.25ZM22.5 15.0984L19.5 13.0988V10.9012L22.5 8.90625V15.0984Z" fill="#222222"/>
                </svg>
    
                В записи
            </a>
            <a class="feature" href="#films">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.2497 11.9999C23.2498 13.0383 22.9419 14.0534 22.365 14.9168C21.7882 15.7803 20.9682 16.4532 20.0088 16.8506C19.0495 17.248 17.9938 17.352 16.9754 17.1494C15.9569 16.9468 15.0214 16.4467 14.2872 15.7124L14.2563 15.6796L8.63595 9.33271C8.10976 8.81267 7.44152 8.45989 6.7153 8.31876C5.98908 8.17763 5.23734 8.25446 4.55469 8.53958C3.87204 8.82469 3.28897 9.30536 2.87886 9.92109C2.46875 10.5368 2.24993 11.2601 2.24993 11.9999C2.24993 12.7397 2.46875 13.463 2.87886 14.0787C3.28897 14.6944 3.87204 15.1751 4.55469 15.4602C5.23734 15.7453 5.98908 15.8222 6.7153 15.681C7.44152 15.5399 8.10976 15.1871 8.63595 14.6671L9.4347 13.7652C9.50001 13.6913 9.57923 13.6311 9.66784 13.5878C9.75645 13.5446 9.85271 13.5192 9.95113 13.5131C10.0495 13.5071 10.1482 13.5205 10.2414 13.5525C10.3347 13.5846 10.4207 13.6347 10.4945 13.7C10.5684 13.7654 10.6287 13.8446 10.6719 13.9332C10.7152 14.0218 10.7406 14.1181 10.7466 14.2165C10.7527 14.3149 10.7393 14.4135 10.7072 14.5068C10.6751 14.6 10.625 14.686 10.5597 14.7599L9.74501 15.6796L9.71407 15.7124C8.97983 16.4466 8.04437 16.9465 7.02598 17.1491C6.00759 17.3516 4.95202 17.2476 3.99274 16.8502C3.03346 16.4528 2.21355 15.7799 1.6367 14.9166C1.05985 14.0532 0.751953 13.0382 0.751953 11.9999C0.751953 10.9616 1.05985 9.94655 1.6367 9.08321C2.21355 8.21986 3.03346 7.54695 3.99274 7.14958C4.95202 6.7522 6.00759 6.6482 7.02598 6.85073C8.04437 7.05326 8.97983 7.55322 9.71407 8.28739L9.74501 8.32021L15.3653 14.6671C15.8915 15.1871 16.5598 15.5399 17.286 15.681C18.0122 15.8222 18.7639 15.7453 19.4466 15.4602C20.1292 15.1751 20.7123 14.6944 21.1224 14.0787C21.5325 13.463 21.7513 12.7397 21.7513 11.9999C21.7513 11.2601 21.5325 10.5368 21.1224 9.92109C20.7123 9.30536 20.1292 8.82469 19.4466 8.53958C18.7639 8.25446 18.0122 8.17763 17.286 8.31876C16.5598 8.45989 15.8915 8.81267 15.3653 9.33271L14.5666 10.2346C14.4347 10.3838 14.2489 10.4744 14.0501 10.4867C13.8514 10.4989 13.6559 10.4316 13.5067 10.2997C13.3575 10.1678 13.2669 9.98207 13.2547 9.78331C13.2424 9.58455 13.3097 9.38908 13.4416 9.23989L14.2563 8.32021L14.2872 8.28739C15.0214 7.55309 15.9569 7.05302 16.9754 6.85041C17.9938 6.64781 19.0495 6.75178 20.0088 7.14917C20.9682 7.54656 21.7882 8.21952 22.365 9.08295C22.9419 9.94638 23.2498 10.9615 23.2497 11.9999Z" fill="#222222"/>
                </svg>

                Доступ навсегда
            </a>
        </div>

        <button class="buy-cycle btn btn-default">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#a)"><g clip-path="url(#b)"><path d="M20.882 6.592a.51.51 0 0 0-.391-.184H6.65L6.11 3.42A.51.51 0 0 0 5.608 3h-2.1A.51.51 0 0 0 3 3.511a.51.51 0 0 0 .51.511h1.674l2.191 12.094c.069.381.254.732.53 1.003a2.22 2.22 0 0 0-.758 2.29 2.22 2.22 0 0 0 1.776 1.626 2.2 2.2 0 0 0 2.204-.967 2.22 2.22 0 0 0 .015-2.413h4.434a2.22 2.22 0 0 0 .247 2.705 2.206 2.206 0 0 0 3.638-.631 2.22 2.22 0 0 0-.673-2.632 2.2 2.2 0 0 0-1.354-.465H9.213a.85.85 0 0 1-.836-.7l-.306-1.685h10.05a1.864 1.864 0 0 0 1.84-1.54l1.03-5.697a.51.51 0 0 0-.109-.418m-10.41 12.256a1.2 1.2 0 0 1-.734 1.102 1.185 1.185 0 0 1-1.295-.259 1.194 1.194 0 0 1 .84-2.036 1.195 1.195 0 0 1 1.189 1.193m8.15 0a1.2 1.2 0 0 1-.733 1.102 1.185 1.185 0 0 1-1.295-.259 1.195 1.195 0 0 1 .84-2.036 1.195 1.195 0 0 1 1.189 1.193m.335-6.323a.85.85 0 0 1-.835.7H7.886L6.836 7.43H19.88z" fill="#fff"/></g></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h24v24H0z"/></clipPath><clipPath id="b"><path fill="#fff" d="M0 0h24v24H0z"/></clipPath></defs></svg>
            Купить доступ к фильму
        </button>
    </div>
</div>

<!-- о цикле -->
<div class="about-film default-margin">
    <div class="first-content">
        <div class="film-text">
            <h2>Об этом фильме</h2>
            <p>Предмет разговора второго выпуска – декоративность как феномен визуального языка М.А. Врубеля. Из области художественно-прикладных и функциональных задач декоративность как особое качество пластической формы перенесена М.А. Врубелем в сферу образно-смысловых аспектов «чистого искусства».</p>
            <p>В программе впервые звучат стихи самого М.А. Врубеля.</p>
            <p>Непосредственным художественным символом подобного единства стал «цветочный лейтмотив», который в разных интерпретациях – от натурных до абстрактно-орнаментальных – звучит в большинстве произведений М.А. Врубеля. Реальным импульсом к созданию программы послужил переживший столетие гербарий (03.04.1910) из лепестков прощального венка М.А. Врубеля, обнаруженный О.С. Давыдовой в 2021 году во время работы с архивами мастера.</p>
        </div>
        <img class="film-picture" src="/upload/iblock/aaa/cctm2yhz19k7z2jetg4jkqbfwk759gcy.jpg" alt="">
    </div>

    <div class="rest">
        <p>
            <b>Часть 1: «Концы»</b>
        </p>
        <p>Творческая ностальгия по Вечности уникальный внутренний симптом произведений художников, обладавших символистским мироощущением. Характер этой ностальгии у каждого мастера был свой. Индивидуальную неповторимость поэтики М.А. Врубеля во многом определил византийский масштаб его изначальных профессиональных ориентиров. Именно о византийском и древнерусском искусстве как источнике поисков М.А. Врубеля, как о мере соотношения образной системы художника с духовной реальностью искусства, в которой цветы иносказательно отражают гармонию Рая, идет речь во второй части первой программы. Особый акцент поставлен на раннем периоде творчества художника на декоративно-монументальных, реставрационных и графических работах М.А. Врубеля в Киеве.</p>
    </div>
</div>

<!-- визуальный ряд фильма -->
<div class="film-visual default-margin">
    <h2>Визуальный ряд фильма</h2>
    <p>и картины и иллюстрации, о которых рассказываем</p>

    <div style="position: relative;">
        <div class="swiper">
            <div class="swiper-wrapper">
                <?php for ($i = 1; $i <= 10; $i++): ?>
                <div class="swiper-slide">
                    <img src="/upload/iblock/aaa/cctm2yhz19k7z2jetg4jkqbfwk759gcy.jpg" alt="">
                </div>
                <?php endfor; ?>
            </div>
    
        </div>
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
        <div class="swiper-pagination"></div>
    </div>

    <script>
          const swiper = new Swiper('.film-visual .swiper', {
    // Enable carousel effect module
    modules: [
      // ... other modules you might be using
      function ({ swiper, on, extendParams }) {
        extendParams({
          carouselEffect: {
            opacityStep: 0.33,
            scaleStep: 0.15,
            sideSlides: 2,
          },
        });

        on('beforeInit', () => {
          if (swiper.params.effect !== 'carousel') return;

          // Add carousel class to container
          swiper.classNames.push(
            `${swiper.params.containerModifierClass}carousel`
          );

          // Enable necessary options for carousel effect
          swiper.params = {
            ...swiper.params,
            watchSlidesProgress: true,
            centeredSlides: true,
          };

          // Store original params for potential reset
          swiper.originalParams = {
            ...swiper.originalParams,
            watchSlidesProgress: true,
            centeredSlides: true,
          };
        });

        on('progress', () => {
          if (swiper.params.effect !== 'carousel') return;

          const { scaleStep, opacityStep } = swiper.params.carouselEffect;
          const maxSideSlides = Math.max(
            Math.min(swiper.params.carouselEffect.sideSlides, 3),
            1
          );
          const zIndexFactor = {
            1: 2,
            2: 1,
            3: 0.2,
          }[maxSideSlides];
          const opacityFactor = {
            1: 50,
            2: 50,
            3: 67,
          }[maxSideSlides];

          for (let i = 0; i < swiper.slides.length; i += 1) {
            const slide = swiper.slides[i];
            const progress = slide.progress;
            const absProgress = Math.abs(progress);
            const scale = 1 - absProgress * scaleStep;
            let magicD = 1;

            if (absProgress > 1) {
              magicD = 0.3 * (absProgress - 1) * zIndexFactor + 1;
            }

            const opacityElements = slide.querySelectorAll(
              '.swiper-carousel-animate-opacity'
            );
            const translateX =
              progress *
                magicD *
                opacityFactor *
                (swiper.rtlTranslate ? -1 : 1) +
              '%';
            const transform = `translateX(${translateX}) scale(${scale})`;
            const zIndex =
              swiper.slides.length - Math.abs(Math.round(progress));

            slide.style.transform = transform;
            slide.style.zIndex = zIndex;
            // slide.style.opacity = absProgress > maxSideSlides + 1 ? 0 : 1;
            slide.style.opacity = 1;

            opacityElements.forEach((element) => {
              // element.style.opacity = 1 - absProgress * opacityStep;
              element.style.opacity = 1;
            });
          }
        });

        on('setTransition', (s, t) => {
          if (swiper.params.effect === 'carousel') {
            for (let i = 0; i < swiper.slides.length; i += 1) {
              const slide = swiper.slides[i];
              const opacityElements = slide.querySelectorAll(
                '.swiper-carousel-animate-opacity'
              );

              slide.style.transitionDuration = `${t}ms`;
              opacityElements.forEach((element) => {
                element.style.transitionDuration = `${t}ms`;
              });
            }
          }
        });
      },
    ],

    // Other Swiper options
    effect: 'carousel',
    grabCursor: true,
    loop: true,
    loopAdditionalSlides: 1,
    slidesPerView: 'auto',
    navigation: {
      nextEl: '.film-visual .swiper-button-next',
      prevEl: '.film-visual .swiper-button-prev',
    },
    pagination: {
      el: '.film-visual .swiper-pagination',
    },
    //   autoplay: {
    //     delay: 3000,
    //   },
  });
    </script>
</div>
<!-- /визуальный ряд фильма -->

<!-- автор и куратор программы -->
<div class="author-wrapper fullwidth">
    <div class="maxwidth-theme">
        <div class="author-content col-xs-12">
            <h2>Автор и куратор программы</h2>


            <div class="author-row">
                <div class="author-profile">
                    <img src="/upload/resize_cache/iblock/34f/280_223_2/uuviqvxk4mhiyaf7iqtn0otbmqtz6rzw.jpg" alt="" class="author-img">
                    <div class="author-info">
                        <div class="name font-forum">Давыдова Ольга Сергеевна</div>
                        <p>
                            Кандидат искусствоведения, член-корреспондент
                            РАХ, ведущий научный сотрудник «Отдела русское
                            искусство XVIII – начала XX века» НИИ РАХ.
                            За научный вклад в изучение символизма отмечена двумя медалями Российской академии художеств – «Шувалов» (2019) и «Достойному» (2021).
                        </p>
                        <a href="/">Подробнее</a>
                    </div>
                </div>

                <div class="author-about">
                    <p>Автор цикла лекций, посвященных творчеству Врубеля — искусствовед и ведущий научный сотрудник НИИ РАХ Ольга Сергеевна Давыдова. Наиболее пристальное внимание в ее исследованиях уделено изучению духовных аспектов искусства эпохи модерна и символизма. Научный вклад преподавателя отмечен медалями Российской Академии художеств. Программы О.С. Давыдовой воссоздают художественную глубину творчества М.А. Врубеля и эпохи модерна в целом с опорой на новаторский подход в современном искусствознании. Ольга Сергеевна исследует и раскрывает влияние душевной жизни живописца на процесс формирования им художественных образов. Индивидуальный метод автора основан на синтезе малоизвестных и новых документально-исторических фактов с современными исследовательскими возможностями науки.</p>
                    <a class="btn btn-default" href="/">Все программы Давыдовой О.С.</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- другие программы из цикла -->
<div class="other-cycle-programms default-margin">
    <h2>Другие программы из цикла</h2>

    <div style="position: relative;">
        <div class="swiper">
            <div class="swiper-wrapper">
                <?php for ($i = 1; $i <= 10; $i++): ?>
                <a href="/" class="swiper-slide">
                    <div class="img-wrapper">
                        <img src="/upload/iblock/aaa/cctm2yhz19k7z2jetg4jkqbfwk759gcy.jpg" alt="">
                    </div>
                    <div class="content font-forum">
                        Визуальная логика цветка: концы и начала
                    </div>
                </a>
                <?php endfor; ?>
            </div>
    
        </div>
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
        <div class="swiper-pagination"></div>
    </div>

    <a href="/" class="btn btn-default all-mats">Все программы</a>

    <script>
        function initSwiper() {
            if (window.innerWidth <= 768) {
                // Инициализация обычного Swiper без эффектов
                new Swiper('.other-cycle-programms .swiper', {
                    loop: true,
                    slidesPerView: 'auto',
                    spaceBetween: 8,
                    navigation: {
                        nextEl: '.other-cycle-programms .swiper-button-next',
                        prevEl: '.other-cycle-programms .swiper-button-prev',
                    },
                    pagination: {
                        el: '.other-cycle-programms .swiper-pagination',
                    },
                });
            } else {
                // Инициализация Swiper с эффектом carousel
                new Swiper('.other-cycle-programms .swiper', {
                    modules: [
                        function ({ swiper, on, extendParams }) {
                            extendParams({
                                carouselEffect: {
                                    opacityStep: 0.33,
                                    scaleStep: 0.15,
                                    sideSlides: 1,
                                },
                            });

                            on('beforeInit', () => {
                                if (swiper.params.effect !== 'carousel') return;

                                swiper.classNames.push(
                                    `${swiper.params.containerModifierClass}carousel`
                                );

                                swiper.params = {
                                    ...swiper.params,
                                    watchSlidesProgress: true,
                                    centeredSlides: true,
                                };

                                swiper.originalParams = {
                                    ...swiper.originalParams,
                                    watchSlidesProgress: true,
                                    centeredSlides: true,
                                };
                            });

                            on('progress', () => {
                                if (swiper.params.effect !== 'carousel') return;

                                const { scaleStep, opacityStep } = swiper.params.carouselEffect;
                                const maxSideSlides = Math.max(
                                    Math.min(swiper.params.carouselEffect.sideSlides, 3),
                                    1
                                );
                                const zIndexFactor = {
                                    1: 2,
                                    2: 1,
                                    3: 0.2,
                                }[maxSideSlides];
                                const opacityFactor = {
                                    1: 50,
                                    2: 50,
                                    3: 67,
                                }[maxSideSlides];

                                for (let i = 0; i < swiper.slides.length; i += 1) {
                                    const slide = swiper.slides[i];
                                    const progress = slide.progress;
                                    const absProgress = Math.abs(progress);
                                    const scale = 1 - absProgress * scaleStep;
                                    let magicD = 1;

                                    if (absProgress > 1) {
                                        magicD = 0.3 * (absProgress - 1) * zIndexFactor + 1;
                                    }

                                    const opacityElements = slide.querySelectorAll(
                                        '.swiper-carousel-animate-opacity'
                                    );
                                    const translateX =
                                        progress *
                                        magicD *
                                        opacityFactor *
                                        (swiper.rtlTranslate ? -1 : 1) +
                                        '%';
                                    const transform = `translateX(${translateX}) scale(${scale})`;
                                    const zIndex =
                                        swiper.slides.length - Math.abs(Math.round(progress));

                                    slide.style.transform = transform;
                                    slide.style.zIndex = zIndex;
                                    slide.style.opacity = 1;

                                    opacityElements.forEach((element) => {
                                        element.style.opacity = 1;
                                    });
                                }
                            });

                            on('setTransition', (s, t) => {
                                if (swiper.params.effect === 'carousel') {
                                    for (let i = 0; i < swiper.slides.length; i += 1) {
                                        const slide = swiper.slides[i];
                                        const opacityElements = slide.querySelectorAll(
                                            '.swiper-carousel-animate-opacity'
                                        );

                                        slide.style.transitionDuration = `${t}ms`;
                                        opacityElements.forEach((element) => {
                                            element.style.transitionDuration = `${t}ms`;
                                        });
                                    }
                                }
                            });
                        },
                    ],

                    effect: 'carousel',
                    grabCursor: true,
                    loop: true,
                    loopAdditionalSlides: 1,
                    slidesPerView: 'auto',
                    navigation: {
                        nextEl: '.other-cycle-programms .swiper-button-next',
                        prevEl: '.other-cycle-programms .swiper-button-prev',
                    },
                    pagination: {
                        el: '.other-cycle-programms .swiper-pagination',
                    },
                });
            }
        }

        initSwiper();

        window.addEventListener('resize', function() {
            // Переинициализация Swiper при изменении размера окна
            if (document.querySelector('.other-cycle-programms .swiper').swiper) {
                document.querySelector('.other-cycle-programms .swiper').swiper.destroy();
            }
            initSwiper();
        });
    </script>
</div>

<!-- Полный доступ -->
<div class="cycle-head fullwidth" style="background: url('/upload/iblock/57e/evg8bdilqax1bn0iybq47be85ebol969.jpg')">
    <div class="content">
        <h2>Вы можете приобрести полный бессрочный доступ к этому фильму либо сразу ко всему циклу</h2>
        <div class="actions">
            <a class="action" href="#films">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.25 3.75H3.75a1.5 1.5 0 0 0-1.5 1.5v13.5a1.5 1.5 0 0 0 1.5 1.5h16.5a1.5 1.5 0 0 0 1.5-1.5V5.25a1.5 1.5 0 0 0-1.5-1.5m-16.5 4.5h7.5v7.5h-7.5zm9-1.5v-1.5h3v1.5zm-1.5 0h-3v-1.5h3zm0 10.5v1.5h-3v-1.5zm1.5 0h3v1.5h-3zm0-1.5v-7.5h7.5v7.5zm7.5-9h-3v-1.5h3zm-13.5-1.5v1.5h-3v-1.5zm-3 12h3v1.5h-3zm16.5 1.5h-3v-1.5h3z" fill="#fff"/></svg>
                Получить доступ к фильму
            </a>
            <a class="action" href="#films">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.249 12a6.757 6.757 0 0 1 6.75-6.75h10.19l-.971-.97a.75.75 0 0 1 1.061-1.06l2.25 2.25a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 1 1-1.061-1.06l.97-.97H8.998A5.256 5.256 0 0 0 3.749 12a.75.75 0 0 1-1.5 0m18.75-.75a.75.75 0 0 0-.75.75 5.256 5.256 0 0 1-5.25 5.25H4.809l.97-.97a.751.751 0 0 0-1.061-1.06l-2.25 2.25a.75.75 0 0 0 0 1.06l2.25 2.25a.751.751 0 0 0 1.061-1.06l-.97-.97h10.19a6.76 6.76 0 0 0 6.75-6.75.75.75 0 0 0-.75-.75" fill="#fff"/></svg>
                Получить доступ к циклу
            </a>
        </div>
    </div>
</div>


<!-- слайдер материалов -->
<div class="materials-slider-wrapper">
    <h2>Материалы, которые могут вам понравиться</h2>

    <div class="custom-swiper-container">
        <div class="swiper-container">
            <div class="swiper-wrapper">
                <?php for ($i = 1; $i <= 10; $i++): ?>
                <a href="/" class="swiper-slide">
                    <div class="img-container">
                        <div class="status">Статьи</div>
                        <img src="/upload/iblock/aaa/cctm2yhz19k7z2jetg4jkqbfwk759gcy.jpg" alt="">
                    </div>
                    <div class="content">
                        <div class="name">Живописный ноктюрн Ильи Репина «Лунная ночь. Здравнёво»</div>
                        <div class="text">
                        Автор: Ольга Давыдова <br>
                        Тут есть поэзия, а это и есть бессмертная душа искусства. Репин И.Е. Письма об искусстве (Письмо первое), 1893 г.
                        </div>
                        <div class="date">11 июня 2024</div>
                    </div>
                </a>
                <?php endfor; ?>
            </div>
        </div>
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
        <div class="swiper-pagination"></div>
    </div>

    <a class="btn btn-default all-mats"  href="/">Все материалы</a>

</div>

<script>
    $(document).ready(function () {
        var swiper = new Swiper('.materials-slider-wrapper .swiper-container', {
            slidesPerView: '4',
            spaceBetween: 30,
            pagination: {
                el: '.materials-slider-wrapper .swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.materials-slider-wrapper .swiper-button-next',
                prevEl: '.materials-slider-wrapper .swiper-button-prev',
            },
            breakpoints: {
                1400: {
                    slidesPerView: 4,
                    spaceBetween: 16,
                    pagination: {
                        enabled: false,
                    },
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 16,
                    pagination: {
                        enabled: false,
                    },
                },
                768: {
                    slidesPerView: 2,
                    spaceBetween: 16,
                    pagination: {
                        enabled: false,
                    },
                },
                0: {
                    slidesPerView: 'auto',
                    spaceBetween: 7,
                    pagination: {
                        enabled: true,
                    },
                }
            },
        });
    });
</script>


<!-- вопросы -->
<div class="questions default-margin">
    <h2>Вопросы и ответы</h2>

    <div class="question">
        <div class="title-row">
            <div class="title font-forum">Как купить цикл или отдельную программу?</div>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.293 11.292a1 1 0 0 1 1.415 0L16 20.586l9.293-9.294a1 1 0 0 1 1.415 1.415l-10 10a1 1 0 0 1-1.415 0l-10-10a1 1 0 0 1 0-1.415" fill="#222"/></svg>
        </div>

        <div class="content">Для приобретения необходимого цикла, отдельного фильма, экскурсии или другого авторского продукта, нужно положить его в корзину, затем нажать на кнопку «Оформить заказ». Следующий шаг — заполнение данных и, непосредственно, оплата. Онлайн-оплата происходит по безопасному защищенному протоколу через интернет-эквайринг Т-Банка.</div>
    </div>
</div>

<script>
const faqItems = document.querySelectorAll('.questions .question');

faqItems.forEach(item => {
    item.addEventListener('click', () => {
        const content = item.querySelector('.content');
        content.style.maxHeight = content.style.maxHeight ? null : content.scrollHeight + 'px';
        const chevron = item.querySelector('svg');
        chevron.style.transform = chevron.style.transform ? null : 'rotate(180deg)';
        content.classList.toggle('active')

    });
});
</script>






<?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");?>