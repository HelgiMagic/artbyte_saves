<form>
    <h3 class="text-24">Связаться с нами</h3>
    <div class="input-wrapper">
        <input type="text" id="full-name" name="full-name" aria-label="Ваше ФИО" required autocomplete="name">
        <div class="placeholder">
            ФИО <span class="red">*</span>
        </div>
    </div>

    <div class="input-wrapper">
        <input type="text" id="tel" name="tel" aria-label="Номер телефона" required autocomplete="tel">
        <div class="placeholder">
            Телефон <span class="red">*</span>
        </div>
    </div>


        <div class="input-wrapper">
        <input type="text" id="email" name="email" aria-label="E-mail" required autocomplete="email">
        <div class="placeholder">
            E-mail <span class="red">*</span>
        </div>
    </div>

    <div class="input-dropdown">
        <input type="hidden" id="location" name="location" value="">

        <div class="value-row">
            <div class="value">Выберите свое местоположение <span class="red">*</span></div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 10L12 14L8 10" stroke="#788188" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>

        <div class="content">
            <div class="list">
                <div class="option">Москва</div>
                <div class="option">Санкт-Петербург</div>
                <div class="option">Казань</div>
                <div class="option">Москва</div>
                <div class="option">Санкт-Петербург</div>
                <div class="option">Казань</div>
                <div class="option">Москва</div>
                <div class="option">Санкт-Петербург</div>
                <div class="option">Казань</div>
            </div>
        </div>
    </div>

    <label>
        <input type="checkbox" id="consent" name="consent" checked required>
        <span>
            Я даю свое согласие на обработку
            <a href="#">персональных данных</a>
        </span>
    </label>

    <button class="btn btn-primary" type="submit">Получить подробности</button>

    <div class="text-12"><span class="red">*</span> — поля, обязательные для заполнения</div>
</form>

