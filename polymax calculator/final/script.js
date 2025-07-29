console.log('testoviy cutting3');

// modal
const modal = document.querySelector('.cutting-calculator__modal');
const modalOverlay = document.querySelector('.overlay');
const modalBody = modal.querySelector('.modal__body');
const modalFooter = modal.querySelector('.modal__footer');
const modalLoading = modal.querySelector('.modal__loading');

const modalAskAgain = modal.querySelector('.modal__ask-again');

const modalOk = modal.querySelector('#modal-ok');
const modalCancel = modal.querySelector('#modal-cancel');

let askAgain = true;

function openModal(variant, deletingObject) {
  modal.classList.add('d-flex');
  modalOverlay.classList.add('d-block');

  modalAskAgain.classList.add('d-none');
  modalCancel.classList.add('d-none');
  modalFooter.classList.remove('d-none');
  modalLoading.classList.add('d-none');

  modalOk.setAttribute('onclick', 'closeModal()');

  switch (variant) {
    case 'quantity': {
      modalBody.textContent =
        'Количество введенных деталей превышает один лист. Раскрой будет пересмотрен с учетом добавления нового листа или переносом детали на следующий лист';
      break;
    }
    case 'quantityOptimal': {
      modalBody.textContent = 'Одна из деталей не вместилась на лист после перемещения';
      break;
    }
    case 'tooBigDetail': {
      modalBody.textContent = 'Деталь превышает размер листа. Введите корректный размер';
      break;
    }
    case 'notSelectedProps': {
      modalBody.textContent = 'Не выбран один из параметров: материал, размер';
      break;
    }
    case 'deletingElement': {
      modalBody.textContent = 'Данный элемент удалится безвозвратно. Хотите продолжить?';

      modalAskAgain.classList.remove('d-none');
      modalCancel.classList.remove('d-none');

      const { thingType } = deletingObject;

      if (thingType === 'list') {
        modalOk.setAttribute('onclick', `deleteList(${deletingObject.listI})`);
      } else if (thingType === 'detail') {
        modalOk.setAttribute('onclick', `deleteDetail(${deletingObject.listI}, ${deletingObject.detailI})`);
      }

      break;
    }
    case 'methodNotSelected': {
      modalBody.textContent = 'Не выбран метод раскроя листа';
      break;
    }
    case 'waitingPDF': {
      modalBody.textContent = 'Идёт генерация PDF. Пожалуйста, подождите';
      modalFooter.classList.add('d-none');
      modalLoading.classList.remove('d-none');
      break;
    }
    default: {
      modalBody.textContent = 'Произошла ошибка. Перезагрузите страницу для устранения';
    }
  }
}

function closeModal() {
  modal.classList.remove('d-flex');
  modalOverlay.classList.remove('d-block');
}

// для формы
const modalFormWrapper = document.querySelector('.cutting-calculator__modal-form');
const modalForm = modalFormWrapper.querySelector('.modal-form__form');

const modalFormName = modalForm.querySelector('#modal-form__name');
const modalFormPhone = modalForm.querySelector('#modal-form__phone');
const modalFormEmail = modalForm.querySelector('#modal-form__email');
const modalFormSubmit = modalForm.querySelector('button[type="submit"]');

function openModalForm(variant) {
  const materialDropdownContent = document.querySelector('#material .dropdown-btn').textContent;

  if (materialDropdownContent === 'Выберите материал') {
    openModal('notSelectedProps');
    return;
  }

  modalFormWrapper.classList.add('d-block');
  modalOverlay.classList.add('d-block');

  modalFormEmail.classList.add('d-none');

  modalFormName.removeAttribute('required');
  modalFormEmail.removeAttribute('required');
  modalFormPhone.removeAttribute('required');

  modalForm.setAttribute('data-variant', variant);

  // при открытии в зависимости от варианта будет устанавливаться data-атрибут например email или telegram для отправки на сервер.

  switch (variant) {
    case 'download': {
      modalFormName.setAttribute('required', true);
      modalFormPhone.setAttribute('required', true);

      modalFormSubmit.textContent = 'Скачать файл';
      break;
    }
    case 'email': {
      modalFormEmail.classList.remove('d-none');

      modalFormName.setAttribute('required', true);
      modalFormPhone.setAttribute('required', true);
      modalFormEmail.setAttribute('required', true);

      modalFormSubmit.textContent = 'Отправить на почту';

      break;
    }
    default: {
      throw new Error('неизвестный вариант формы');
    }
  }
}

function closeModalForm() {
  modalFormWrapper.classList.remove('d-block');
  modalOverlay.classList.remove('d-block');

  modalForm.reset();
}

function checkName(input) {
  const variant = modalForm.getAttribute('data-variant');
  if (variant !== 'download') return;

  if (input.value === '0000') {
    modalFormPhone.removeAttribute('required');
    modalFormName.removeAttribute('required');
  } else {
    modalFormPhone.setAttribute('required', true);
    modalFormName.setAttribute('required', true);
  }
}

// dropdown
function toggleDropdown(dropdownContent) {
  dropdownContent.classList.toggle('show');
}

function closeAllDropdowns() {
  const dropdowns = document.querySelectorAll('.dropdown-content');

  dropdowns.forEach((dropdown) => {
    dropdown.classList.remove('show');
  });
}

// создание элемента dropdown
function createDropdownVariant(text, element) {
  const div = document.createElement('div');
  div.classList.add('dropdown-variant');
  div.textContent = text;
  element.appendChild(div);
}

// размеры (второй dropdown)
function calculateSizes(value) {
  const sizeSotoviy = ['6000x2100', '12000x2100'];
  const sizeMonolit = ['3050x2050', '2050x1525'];
  const sizeOrgsteklo = ['3050x2050', '2050x1525'];

  const sizes = {
    'Сотовый поликарбонат': sizeSotoviy,
    'Монолитный поликарбонат': sizeMonolit,
    Оргстекло: sizeOrgsteklo,
    Другое: ['Введите размер в полях ниже'],
  };

  const defaultValues = [];

  return sizes[value] || defaultValues;
}

// функция получения цены за 1 м реза (погонный метр)
function getCutPrice(material) {
  if (material === 'Сотовый поликарбонат') {
    return 45;
  }

  if (['Монолитный поликарбонат', 'Оргстекло'].includes(material)) {
    const thickness = document.querySelector('#thickness-row .dropdown-btn').textContent;

    return thickness === 'больше 8 мм' ? 55 : 50;
  }

  return 50;
}

// функция округления
function roundSize(number) {
  if (!number) return number;

  // Преобразуем число в строку с фиксированной точкой до 10 знаков после запятой
  const numberString = number.toFixed(10);

  // Найдем индекс десятичной точки
  const decimalPart = numberString.split('.')[1];

  if (decimalPart.startsWith('00')) {
    return Math.round(number);
  }

  if (Number(decimalPart.slice(0, 2)) >= 95) {
    return Math.round(number);
  }

  return number;
}

// функция получения площади с учётом ширины пропила
function getElementSquare(width, height, cutWidth) {
  return (Number(width) + Number(cutWidth)) * (Number(height) + Number(cutWidth));
}

// функция получения размера листа - обычного или с инпута
function getListSize(shouldConvertToNumbers) {
  // значение материала листа
  const materialValue = document.querySelector('#material .dropdown-btn');
  // значение размера листа
  let sizeValue = '';
  if (materialValue.textContent === 'Другое') {
    const firstInput = document.querySelector('#size .cutting-inputs input:nth-of-type(1)').value;
    const secondInput = document.querySelector('#size .cutting-inputs input:nth-of-type(2)').value;
    sizeValue = `${firstInput}x${secondInput}`;
  } else {
    sizeValue = document.querySelector('#size .dropdown-btn').textContent;
  }

  if (shouldConvertToNumbers) {
    return sizeValue.split('x').map(Number);
  }

  return sizeValue;
}

// массив листов - он будет обновляться
let listsArray = [];

// активный лист - выбирается через среднюю панель листов
let activeList = 0;

// zoom - будет добавляться к автоматическому listScale
let zoomAddition = 0;

// массив cutlines на всех листах - будет обновляться в миниатюрах
let cutlinesArray = [];
let cutlinesScale = 0;

// создание листа
const methodValueList = document.querySelector('#method .dropdown-btn');

function createNewList(details = []) {
  if (methodValueList.textContent.startsWith('Разрезать')) {
    listsArray.push({
      details: [],
    });

    fillListAuto();
    return;
  }

  const detail1 = createNewDetail();
  const detail2 = createNewDetail();
  const detail3 = createNewDetail();

  if (details.length === 0) {
    listsArray.push({
      details: [detail1, detail2, detail3],
    });

    return;
  }

  listsArray.push({
    details,
  });
}

// создание новой детали
function createNewDetail() {
  return {
    width: '',
    height: '',
    quantity: '', // убрано для отображения, но на самом деле 0
    touches: {
      // соприкасается с правой или нижней границей
      bottom: 0,
      right: 0,
    },
  };
}

// функция удаления листа по номеру или последнего.
// TODO сделать передачу i в модалку и просто при нажатии.
function deleteList(listI = listsArray.length - 1) {
  listsArray.splice(listI, 1);

  if (activeList === listI) {
    activeList = listsArray.length > 0 ? listsArray.length - 1 : 0;
  }

  // если листов не осталось, сбрасываем параметры листа
  if (listsArray.length === 0) {
    resetState();
  }

  renderLists();
  renderResults();

  closeModal();
}

// функция удаления конкретной детали
function deleteDetail(listI, detailI) {
  listsArray[listI].details.splice(detailI, 1);
  renderLists();
  renderResults();

  closeModal();
}

// функция отката к первоначальному состоянию
function resetState() {
  const materialValue = document.querySelector('#material .dropdown-btn');
  const sizeValue = document.querySelector('#size .dropdown-btn');
  const methodValue = document.querySelector('#method .dropdown-btn');

  const inputPrice = document.querySelector('#cut-price input');

  materialValue.textContent = 'Выберите материал';
  sizeValue.textContent = 'Выберите размер';
  methodValue.textContent = 'Выберите метод';
  inputPrice.setAttribute('value', '');

  listsArray = [];
  activeList = 0;

  renderLists();
  renderResults();
}

// функция заполнения одинаковых деталей для листа (разрезать на X частей)
function fillListAuto() {
  const detailsCount = document.querySelector('#method .dropdown-btn').textContent.split(' ')[2];

  if (!Number(detailsCount)) {
    document.querySelector('.cutting-calculator__panel__lists-details').classList.remove('d-none');

    return;
  }

  document.querySelector('.cutting-calculator__panel__lists-details').classList.add('d-none');

  const listSize = getListSize(true);
  let detailWidth = listSize[0] / (detailsCount / 2);
  let detailHeight = listSize[1] / 2;

  if (detailsCount == 2) {
    detailWidth = listSize[0] / 2;
    detailHeight = listSize[1];
  }

  const detail = createNewDetail();
  detail.width = detailWidth;
  detail.height = detailHeight;
  detail.quantity = detailsCount;

  listsArray.forEach((_, i) => {
    listsArray[i].details = [{ ...detail }];
  });
  renderActualListCut();
}

// если два ключевых параметра введены, то первый лист создаётся автоматически (материал, размер)
function checkAutoCreation() {
  const size = getListSize();
  const materialValue = document.querySelector('#material .dropdown-btn').textContent;
  const methodValue = document.querySelector('#method .dropdown-btn').textContent;
  // const listTooltip = document.querySelector('#add-list-tooltip');
  // const detailTooltip = document.querySelector('#add-detail-tooltip');
  const listFigureSotoviyTooltip = document.querySelector('.lists-results__body__wrapper__tooltip#sotoviy');
  listFigureSotoviyTooltip.classList.add('d-none');

  const listFigureOptimalnoTooltip = document.querySelector('.lists-results__body__wrapper__tooltip#optimalno');
  listFigureOptimalnoTooltip.classList.add('d-none');

  // если все три значения не равны дефолтным и листов меньше чем 1, создаём первый лист
  if (size !== 'Выберите размер' && materialValue !== 'Выберите материал' && listsArray.length === 0) {
    createNewList();
    renderResults();
    renderLists();

    // меняем подсказку
    // listTooltip.classList.add('d-none');
    // detailTooltip.classList.remove('d-none');
  }

  if (materialValue === 'Сотовый поликарбонат') {
    // включаем подсказку
    listFigureSotoviyTooltip.classList.remove('d-none');
  }

  if (methodValue === 'Оптимально') {
    listFigureOptimalnoTooltip.classList.remove('d-none');
  }

  // если выбран метод и создан 1 лист - рендерим листы в настройке
  if (methodValue !== 'Выберите метод' && listsArray.length === 1 && listsArray[0].details.length === 3) {
    renderLists();
  }
}

function findClosestDivisor(target, start, precision = 4) {
  for (let i = start; ; i++) {
    const result = target / i;
    const fixedNumber = Number(result.toFixed(precision));

    if (result === fixedNumber) {
      return i;
    }
  }
}

// функция рендера списка листов - принимает элемент, в который рендерит массив с объектами листов
function renderLists() {
  const listsAndDetailsHTML = document.querySelector('.cutting-calculator__panel__lists-details');
  const methodBeforeRender = document.querySelector('#method .dropdown-btn').textContent;

  listsAndDetailsHTML.innerHTML = '';
  if (methodBeforeRender === 'Выберите метод') {
    // рендер листа справа
    renderActualListCut();

    return;
  }

  listsArray.forEach((list, i) => {
    const listWrapper = document.createElement('div');
    listWrapper.classList.add('list-wrapper');

    // создаём heading
    const heading = document.createElement('div');
    heading.classList.add('list__heading');
    heading.textContent = `Лист ${i + 1}`;

    if (i === 0) {
      const tooltip = document.createElement('p');
      tooltip.classList.add('list__heading__tooltip');
      tooltip.textContent = 'Введите необходимые размеры деталей';
      heading.appendChild(tooltip);
    }
    listWrapper.appendChild(heading);

    // детали
    const detailsList = document.createElement('div');
    detailsList.classList.add('list__details');
    listWrapper.appendChild(detailsList);
    renderDetails(detailsList, list, i);

    // кнопка добавления деталей

    const createDetailButton = document.createElement('button');
    createDetailButton.classList.add('cutting-calculator__small-button', 'list__create-detail');
    createDetailButton.title = 'Добавить деталь';
    createDetailButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M6 6V0H8V6H14V8H8V14H6V8H0V6H6Z" fill="white"/>
            </svg>
        `;

    createDetailButton.addEventListener('click', () => {
      const method = document.querySelector('#method .dropdown-btn').textContent;
      if (method !== 'Выберите метод') {
        const detail = createNewDetail();
        list.details.push(detail);
        list.details.forEach((detail) => {
          detail.positions = [];
        });

        renderDetails(detailsList, list, i);
      } else {
        openModal('methodNotSelected');
      }
    });

    listWrapper.appendChild(createDetailButton);

    listsAndDetailsHTML.appendChild(listWrapper);
  });

  // рендер листа справа
  renderActualListCut();
}

// функция поиска
function findDetailsRow(listI, detailsI) {
  const element = document.querySelector(`.list-wrapper:nth-of-type(${listI + 1}) .list__details__row:nth-of-type(${detailsI + 1})`);

  return element;
}

// функция для хэндлеров инпутов
function handleDetailsInput(inputType, listI, detailsI) {
  const currentDetailHTML = findDetailsRow(listI, detailsI);
  const element = currentDetailHTML.querySelector(`.list__details__row__${inputType}`);
  const currentDetail = listsArray[listI].details[detailsI];

  // сброс для оптимально
  listsArray[listI].details.forEach((detail) => {
    detail.positions = [];
  });

  currentDetail[inputType] = element.value;

  // значение выбранного пользователем размера
  const sizeValue = document.querySelector('#size .dropdown-btn').textContent.split('x');

  if (sizeValue[1]) {
    // если одна (1) деталь больше всего листа по ширине или высоте - обнуляем её размер
    if (Number(currentDetail.width) > Number(sizeValue[0])) {
      openModal('tooBigDetail');

      currentDetail.width = '0';
      renderLists();
    } else if (Number(currentDetail.height) > Number(sizeValue[1])) {
      openModal('tooBigDetail');

      currentDetail.height = '0';
      renderLists();
    }
  }

  renderActualListCut();
  renderResults();
}

// округление после разфокуса деталей - до кратного 5 числа
function handleDetailsBlur(inputType, listI, detailsI) {
  const currentDetail = listsArray[listI].details[detailsI];

  // сброс для оптимально
  listsArray[listI].details.forEach((detail) => {
    detail.positions = [];
  });

  const oldValue = currentDetail[inputType];

  const currentDetailHTML = findDetailsRow(listI, detailsI);
  const element = currentDetailHTML.querySelector(`.list__details__row__${inputType}`);

  if (inputType === 'quantity') {
    currentDetail[inputType] = Math.floor(Number(currentDetail[inputType]));
  } else {
    currentDetail[inputType] = Math.floor(Number(currentDetail[inputType]) / 5) * 5;

    const otherInputType = inputType === 'width' ? 'height' : 'width';
    const currentValue = currentDetail[inputType];
    const otherValue = currentDetail[otherInputType];

    if (currentValue && otherValue) {
      if (currentValue > otherValue) {
        if (currentValue < 500) currentDetail[inputType] = 500;
        if (otherValue < 100) currentDetail[otherInputType] = 100;
      } else {
        if (otherValue < 500) currentDetail[otherInputType] = 500;
        if (currentValue < 100) currentDetail[inputType] = 100;
      }

      const parent = element.parentElement;
      parent.querySelector('.list__details__row__width').value = String(currentDetail.width);
      parent.querySelector('.list__details__row__height').value = String(currentDetail.height);
    }
  }

  element.value = String(currentDetail[inputType]);
  if (element.value === '0') element.value = '';
  currentDetail[inputType] = String(currentDetail[inputType]);

  // если новое значение отличается от старого - рендерим изменения
  if (oldValue !== currentDetail[inputType]) {
    renderActualListCut();
    renderResults();
  }
}

// функция создание заглушки для больших листов и миниатюр
function createStubs() {
  // создание большой заглушки
  const figureHTML = document.querySelector('.cutting-calculator__lists-results .list-figure');
  figureHTML.style.cssText =
    'background: none; justify-content: center; display: flex; visibility: visible; flex-direction: column; align-content: center; align-items: center; gap: 30px; padding: 30px 0; height: auto !important;';

  const img = document.createElement('img');
  img.src = '/local/templates/polymax_copy/assets/img/cutting-calculator/zaglushka.svg';
  figureHTML.appendChild(img);

  const pleaseText = document.createElement('p');
  pleaseText.textContent = 'Пожалуйста, выберите материал и размер для начала расчёта';
  pleaseText.style.fontSize = '20px';
  figureHTML.appendChild(pleaseText);

  const sizesTooltips = `
        <div class="list-figure__dlina">Длина</div>
        <div class="list-figure__shirina">Ширина</div>
    `;

  figureHTML.insertAdjacentHTML('afterbegin', sizesTooltips);

  // убирание zoom
  const zoomBlock = document.querySelector('.lists-results__body__zoom');
  zoomBlock.style.display = 'none';

  // создание заглушки миниатюры
  const miniatureWrapperHTML = document.querySelector('.lists-preview__body');
  const listWrapper = document.createElement('div');
  listWrapper.classList.add('lists-preview__body__wrapper');

  const listName = document.createElement('div');
  listName.classList.add('lists-preview__body__wrapper__name');
  listName.textContent = `Лист 1`;
  listWrapper.appendChild(listName);

  const listResultWrapper = document.createElement('div');
  listResultWrapper.classList.add('lists-preview__body__wrapper__result');
  listWrapper.appendChild(listResultWrapper);

  const result = document.createElement('div');
  result.classList.add('lists-preview__body__wrapper__result__list', 'list-figure');
  result.style.background = 'none';
  result.style.display = 'flex';
  result.style.paddingTop = '10px';
  result.style.paddingBottom = '10px';
  listResultWrapper.appendChild(result);

  const imgClone = img.cloneNode(false);
  imgClone.style.width = '50%';
  imgClone.style.margin = 'auto';
  result.appendChild(imgClone);

  miniatureWrapperHTML.appendChild(listWrapper);
}

// создание detailWrapper
function createDetailWrapper(detail, listScale, methodValue, isMiniature) {
  const detailWrapper = document.createElement('div');
  detailWrapper.classList = 'list-figure__detail';

  const detailWidth = getPixelsFromMM(detail.width, listScale);
  const detailHeight = getPixelsFromMM(detail.height, listScale);
  detailWrapper.style.width = detailWidth + 'px';
  detailWrapper.style.height = detailHeight + 'px';

  // цвет детали выбирается из массива
  detailWrapper.style.background = getDetailColor(detail.number);

  // если размер ширины или высоты 0 - убираем border (чтоб скрыть элемент)
  // если метод не равен оптимально тоже убираем, т.к там вместо border будут cutlines
  if (detailWidth === 0 || detailHeight === 0 || methodValue !== 'Оптимально') {
    detailWrapper.classList.add('no-border');
  }

  // если не минатюра то добавляем надписи на деталь
  if (!isMiniature) {
    if (detailWidth > 50 && detailHeight > 50) {
      // ширина элемента - сверху
      const elementWidthHTML = document.createElement('div');
      elementWidthHTML.classList.add('list-figure__detail__width');
      elementWidthHTML.textContent = detail.width;
      detailWrapper.appendChild(elementWidthHTML);

      // высота элемента - слева
      const elementHeightHTML = document.createElement('div');
      elementHeightHTML.classList.add('list-figure__detail__height');
      elementHeightHTML.textContent = detail.height;
      detailWrapper.appendChild(elementHeightHTML);
    } else {
      detailWrapper.classList.add('small');
    }

    if (detailWidth > 20 && detailHeight > 20) {
      // номер элемента - справа
      const elementNumberHTML = document.createElement('div');
      elementNumberHTML.classList.add('list-figure__detail__number');
      elementNumberHTML.textContent = detail.position === 0 ? `№${detail.number + 1}` : `№${detail.number + 1}.${detail.position}`;
      detailWrapper.appendChild(elementNumberHTML);
    }
  }

  return detailWrapper;
}

// создание cutlines на листе
function createCutLines(
  methodValue,
  lastRow,
  detailWidth,
  detailHeight,
  relativeX,
  relativeY,
  scaleWidth,
  scaleHeight,
  isMiniature,
  listI,
  remainingOrientation,
  detailWrapper
) {
  if (methodValue === 'Оптимально') return;

  const rowWidth = lastRow.getBoundingClientRect().width;
  const rowHeight = lastRow.getBoundingClientRect().height;

  const epsilon = 0.06;

  // если это первый элемент для row - создаём cut-line на всю ширину/длину ряда (взависимости от orientation)
  // NEW: если ширина/длина(в зависимости от orientation) равна листу, не добавляем cut-line
  if (lastRow.children.length === 1) {
    const cutLine = document.createElement('div');
    cutLine.classList.add('cutline');

    if (remainingOrientation === 'column' && Math.abs(relativeX + rowWidth - scaleWidth) >= epsilon) {
      cutLine.style.cssText = 'position: absolute; right: 0; width: 1px; height: 100%; top: 0;';

      if (isMiniature) {
        cutlinesArray[listI].push(scaleHeight);
      }
    } else if (remainingOrientation === 'row' && Math.abs(relativeY + rowHeight - scaleHeight) >= epsilon) {
      cutLine.style.cssText = 'position: absolute; left: 0; width: 100%; height: 1px; bottom: 0;';

      if (isMiniature) {
        cutlinesArray[listI].push(scaleWidth);
      }
    }

    lastRow.appendChild(cutLine);
  }

  // если не соприкасается с правой границей ряда или не соприкасается с границей листа
  // для варианта по ширине она будет в высоту элемента, а для варианта по длине во всю высоту ряда
  if (detailWidth < rowWidth && Math.abs(relativeX + detailWidth - scaleWidth) >= epsilon) {
    const cutLine = document.createElement('div');
    cutLine.classList.add('cutline');
    if (remainingOrientation === 'column') {
      cutLine.style.cssText = 'right: 0; width: 1px; height: 100%; top: 0;';

      if (isMiniature) {
        cutlinesArray[listI].push(detailHeight);
      }
    } else {
      cutLine.style.cssText = 'right: 0; width: 1px; height: 100%; top: 0;';
      cutLine.style.height = rowHeight + 'px';

      if (isMiniature) {
        cutlinesArray[listI].push(rowHeight);
      }
    }

    detailWrapper.appendChild(cutLine);
  }

  // если не соприкасается с низом листа, создаём cutline
  // или если по длине - если не соприкасается с низом листа ИЛИ с нижней границей ряда
  if (Math.abs(relativeY + detailHeight - scaleHeight) >= epsilon && remainingOrientation === 'column') {
    const cutLine = document.createElement('div');
    cutLine.classList.add('cutline');
    cutLine.style.cssText = 'left: 0; width: 100%; height: 1px; bottom: 0;';
    cutLine.style.width = rowWidth + 'px';

    if (isMiniature) {
      cutlinesArray[listI].push(rowWidth);
    }

    detailWrapper.appendChild(cutLine);
  }

  if (detailHeight < rowHeight && Math.abs(detailHeight - rowHeight) >= epsilon && remainingOrientation === 'row') {
    const cutLine = document.createElement('div');
    cutLine.classList.add('cutline');
    cutLine.style.cssText = 'left: 0; width: 100%; height: 1px; bottom: 0;';

    if (isMiniature) {
      cutlinesArray[listI].push(detailWidth);
    }

    detailWrapper.appendChild(cutLine);
  }

  console.log('cutlines', cutlinesArray);
}

// функция рендера деталей в ЛИСТЕ - дополнение к функции рендера листов renderLists
// принимает объект, куда нужно рендерить детали
function renderDetails(detailsListHtml, list, listI) {
  detailsListHtml.innerHTML = '';

  list.details.forEach((detail, i) => {
    // ряд элементов
    const detailRow = document.createElement('div');
    detailRow.classList.add('list__details__row');

    // Номер ряда
    const rowNumber = document.createElement('div');
    rowNumber.classList.add('list__details__row__number');
    rowNumber.textContent = i + 1;
    detailRow.appendChild(rowNumber);

    // группа для инпута ширины, крестика, инпута высоты
    const inputsGroup = document.createElement('div');
    inputsGroup.classList.add('list__details__row__inputs');
    detailRow.appendChild(inputsGroup);

    // для первой детали первого листа добавляем подсказку
    if (i === 0 && listI === 0) {
      const heightTooltip = document.createElement('div');
      heightTooltip.className = 'list__details__row__inputs__tooltip-height';
      heightTooltip.textContent = 'длина';
      inputsGroup.appendChild(heightTooltip);

      const widthTooltip = document.createElement('div');
      widthTooltip.className = 'list__details__row__inputs__tooltip-width';
      widthTooltip.textContent = 'ширина';
      inputsGroup.appendChild(widthTooltip);

      detailRow.style.paddingTop = '20px';
    }

    // инпут ширины
    const widthInput = document.createElement('input');
    widthInput.type = 'number';
    widthInput.setAttribute('step', '5');
    widthInput.setAttribute('min', '10');
    widthInput.classList.add('cutting-input', 'list__details__row__width');
    widthInput.placeholder = '0';
    widthInput.setAttribute('value', detail.width);
    widthInput.setAttribute('oninput', `handleDetailsInput('width', ${listI}, ${i})`);
    widthInput.setAttribute('onblur', `handleDetailsBlur('width', ${listI}, ${i})`);

    inputsGroup.appendChild(widthInput);

    // svg крестик
    const svgX = `
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.364 4.95 11.314 0l1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95L0 11.314l4.95-4.95L0 1.414 1.414 0z" fill="#999"/></svg>
        `;
    inputsGroup.innerHTML += svgX;

    // инпут высоты
    const heightInput = document.createElement('input');
    heightInput.type = 'number';
    heightInput.setAttribute('step', '5');
    heightInput.setAttribute('min', '10');
    heightInput.classList.add('cutting-input', 'list__details__row__height');
    heightInput.placeholder = '0';
    heightInput.setAttribute('value', detail.height);
    heightInput.setAttribute('oninput', `handleDetailsInput('height', ${listI}, ${i})`);
    heightInput.setAttribute('onblur', `handleDetailsBlur('height', ${listI}, ${i})`);
    inputsGroup.appendChild(heightInput);

    // пояснение (мм)
    const explanationMm = document.createElement('div');
    explanationMm.classList.add('list__details__row__explanation');
    explanationMm.textContent = '(мм)';
    detailRow.appendChild(explanationMm);

    // пояснение (кол-во)
    const explanationQuantity = document.createElement('div');
    explanationQuantity.classList.add('list__details__row__quantity-explanation');
    explanationQuantity.textContent = 'Кол-во:';
    detailRow.appendChild(explanationQuantity);

    // инпут количества
    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.setAttribute('min', 0);
    quantityInput.classList.add('cutting-input', 'list__details__row__quantity');
    quantityInput.placeholder = '0';
    quantityInput.setAttribute('value', detail.quantity);
    quantityInput.setAttribute('oninput', `handleDetailsInput('quantity', ${listI}, ${i})`);
    quantityInput.setAttribute('onblur', `handleDetailsBlur('quantity', ${listI}, ${i})`);
    detailRow.appendChild(quantityInput);

    // кнопка удаления
    const buttonDelete = document.createElement('button');
    buttonDelete.classList.add('svg-button');

    buttonDelete.addEventListener('click', () => {
      if (askAgain) {
        openModal('deletingElement', {
          thingType: 'detail',
          listI: listI,
          detailI: i,
        });

        return;
      }

      deleteDetail(listI, i);
    });

    detailRow.appendChild(buttonDelete);

    // крестик удаления для кнопки удаления
    const svgDelete = `
            <svg class="list__details__row__delete" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M6.99999 5.58599L11.95 0.635986L13.364 2.04999L8.41399 6.99999L13.364 11.95L11.95 13.364L6.99999 8.41399L2.04999 13.364L0.635986 11.95L5.58599 6.99999L0.635986 2.04999L2.04999 0.635986L6.99999 5.58599Z" fill="#D14040"/>
            </svg>
        `;
    buttonDelete.innerHTML = svgDelete;

    detailsListHtml.appendChild(detailRow);
  });

  renderResults();
}

// функция рендера результатов в левой панели
const resultBodyHTML = document.querySelector('.results__body');

function renderResults() {
  // значение метода (важно для allCutLength)
  const methodValue = document.querySelector('#method .dropdown-btn').textContent;

  // ширина пропила - отключена по требованию заказчика
  const cutWidthValue = 0;

  // значение размера листа
  const sizeValue = getListSize();

  // площади деталей на каждом листе
  const detailsSquares = [];

  // площадь деталей с учётом ширины пропила отдельно для каждого листа
  listsArray.forEach((list) => {
    const result = list.details.reduce((acc, detail) => {
      const elementSquare = getElementSquare(detail.width, detail.height, cutWidthValue);
      const squareWithQuantity = elementSquare * Number(detail.quantity);

      return acc + squareWithQuantity;
    }, 0);

    detailsSquares.push(result);
  });

  // остатки на каждом листе
  const remains = detailsSquares.map((listCutWidth) => {
    const sizes = sizeValue.split('x');
    if (sizes[1]) {
      const listSquare = Number(sizes[0]) * Number(sizes[1]);
      const result = (listSquare - listCutWidth) / 1000000;
      return result.toFixed(2);
    }
  });

  console.log('remains:', remains);

  // значение количества листов
  const listsQuantity = listsArray.length;
  // значение количества деталей
  const detailsQuantity = listsArray.reduce((acc, list) => {
    return acc + list.details.length;
  }, 0);
  // общая длина реза
  let allCutLength = 0;
  if (methodValue === 'Оптимально') {
    allCutLength =
      listsArray.reduce((acc, list) => {
        // длины и ширины всех деталей на листе
        const widthAndHeightSum = list.details.reduce((detailsAcc, detail) => {
          const widthToAdd = (detail.quantity - detail.touches.bottom) * Number(detail.width);
          const heightToAdd = (detail.quantity - detail.touches.right) * Number(detail.height);

          return detailsAcc + widthToAdd + heightToAdd;
        }, 0);

        return acc + widthAndHeightSum;
      }, 0) / 1000;

    allCutLength = allCutLength * 1.1;
    console.log('allCutLength:', allCutLength);
  } else {
    allCutLength =
      cutlinesArray.reduce((acc, list) => {
        const listCut = list.reduce((listAcc, cutline) => {
          return listAcc + cutline;
        }, 0);

        return acc + listCut * cutlinesScale;
      }, 0) / 1000;
  }

  // округление в большую сторону;
  allCutLength = Math.ceil(allCutLength);
  // цена реза за 1м2
  const cutPrice = document.querySelector('#cut-price-input').value;

  resultBodyHTML.innerHTML = '';

  const resultObject = {
    'Размер листа': sizeValue,
    'Количество листов, шт': listsQuantity,
    'Количество деталей, шт': detailsQuantity,
    'Общая длина реза, пог. м': allCutLength,
    'Цена за 1 пог. м реза, ₽': cutPrice,
  };
  const pairs = Object.entries(resultObject);

  pairs.forEach((pair) => {
    // создание элемента-обёртки
    const resultsRow = document.createElement('div');
    resultsRow.classList.add('results__body__row');

    // создание заголовка
    const resultsName = document.createElement('div');
    resultsName.classList.add('results__body__row__name');
    resultsName.textContent = pair[0];
    resultsRow.appendChild(resultsName);

    // создание значения
    const resultsValue = document.createElement('div');
    resultsValue.classList.add('results__body__row__value');
    resultsValue.textContent = pair[1];
    resultsRow.appendChild(resultsValue);

    resultBodyHTML.appendChild(resultsRow);
  });

  // остатки для каждого листа
  remains.forEach((remain, i) => {
    // создание элемента-обёртки
    const resultsRow = document.createElement('div');
    resultsRow.classList.add('results__body__row');

    // создание заголовка
    const resultsName = document.createElement('div');
    resultsName.classList.add('results__body__row__name');
    resultsName.textContent = `Площадь остатка, м², лист ${i + 1}`;
    resultsRow.appendChild(resultsName);

    // создание значения
    const resultsValue = document.createElement('div');
    resultsValue.classList.add('results__body__row__value');
    resultsValue.textContent = remain;
    resultsRow.appendChild(resultsValue);

    resultBodyHTML.appendChild(resultsRow);
  });

  // стоимость реза
  const resultFooterValueHTML = document.querySelector('.results__footer .results__body__row__value');
  resultFooterValueHTML.textContent = Math.ceil(allCutLength * cutPrice);
}
// получение пикселей из миллиметров
function getPixelsFromMM(mm, scale = 4) {
  const pixels = Number(mm) / scale;

  return pixels;
}

// массив цветов для деталей
const detailsColors = ['#D7F2D5', '#EFF2D5', '#D0D7A5', '#CEDC72', '#CCE13D', '#C089E5', '#E6D5F2'];

function getDetailColor(i) {
  if (i >= detailsColors.length) {
    const offset = i % detailsColors.length;
    return detailsColors[offset];
  }

  return detailsColors[i];
}

// Удаление px на конце. 500px -> 500
function removePx(string) {
  return Number(string.slice(0, -2));
}

// функция по перебросу детали на следующий лист, или создание нового листа если следующего листа нет
function handleDetailTransfer(newDetail, currentListI) {
  if (currentListI + 1 === listsArray.length) {
    createNewList([newDetail]);
    return;
  }

  const nextList = listsArray[currentListI + 1];
  nextList.details.push(newDetail);
}

// Проверка одной детали на выход за границы листа
function checkDetailBounds(detail, detailWrapper, fatherHTML, listWidth, listHeight, listI, isMiniature, methodValue, isAfterMovement) {
  const scaleAppr = isMiniature ? 0.5 : 0;

  // ПОЛУЧАЕМ ОТНОСИТЕЛЬНЫЕ КООРДИНАТЫ ДЕТАЛИ
  const boundingRect = detailWrapper.getBoundingClientRect();
  const fatherRect = fatherHTML.getBoundingClientRect();
  const relativeX = boundingRect.left - fatherRect.left - 1;
  const relativeY = boundingRect.top - fatherRect.top - 1;

  const detailHeight = Number(removePx(detailWrapper.style.height));
  const detailWidth = Number(removePx(detailWrapper.style.width));
  const topValue = relativeY + detailHeight;
  const leftValue = relativeX + detailWidth;

  const detailFromOriginalList = listsArray[listI].details[detail.number];

  // расчёт соприкасается ли с правой или нижней границей - для расчёта стоимости
  if (roundSize(leftValue) === listWidth) {
    console.log('соприкасается справа', leftValue, detailWidth, listWidth, detail, detailWrapper);
    const detailFromOriginalList = listsArray[listI].details[detail.number];
    detailFromOriginalList.touches.right += 1;
  }

  if (roundSize(topValue) === listHeight) {
    console.log('соприкасается снизу', leftValue, detailWidth, listWidth, detail, detailWrapper);
    const detailFromOriginalList = listsArray[listI].details[detail.number];
    detailFromOriginalList.touches.bottom += 1;
  }

  // ПРЕДУПРЕЖДЕНИЯ о вылезании деталей
  if (
    roundSize(relativeY + detailHeight) > listHeight + scaleAppr ||
    roundSize(relativeX + detailWidth) > listWidth + scaleAppr ||
    roundSize(topValue) > listHeight + scaleAppr ||
    roundSize(leftValue) > listWidth + scaleAppr
  ) {
    const originalQuantity = Number(detailFromOriginalList.quantity);

    if (methodValue === 'Оптимально' && isAfterMovement) {
      openModal('quantityOptimal');
      renderLists();
    } else {
      // т.е если позиция 6 - элемент седьмой ВЫЛЕЗАЕТ, соответственно оставляем 6
      detailFromOriginalList.quantity = String(detail.position);

      // то есть если позиция = 6 (начинается с нуля, т.е это 7 элемент), а количество = 10, то 10 - 6 = 4
      // 4 добавляем на следующий лист
      // на текущем оставляем 6

      if (detailFromOriginalList.quantity == 0) {
        listsArray[listI].details.splice(detail.number, 1);
      }

      const newDetail = structuredClone(detailFromOriginalList);

      // 10(количество) - (6) (позиция) = количество на новом листе
      newDetail.quantity = String(originalQuantity - detail.position);

      // хандлер переброса на следующий или новый лист
      handleDetailTransfer(newDetail, listI);
      openModal('quantity');
      renderLists();
    }

    console.log('выброс ошибки', detail, detailWrapper);
    // ошибка выбрасывается для остановки цикла
    throw new Error('detail is too big');
  }
}

function createRemainingSpaceThing(fatherBlock, method, listScale, isDetails) {
  const htmlBlock = document.createElement('div');
  // для по ширине нужно width и height unset, а по длине 100% и то и то
  let heightAndWidthValue = 'unset';
  if (method !== 'По ширине листа' && !isDetails) {
    heightAndWidthValue = '100%';
  }

  // const heightAndWidthValue = method === 'По ширине листа' ? 'unset' : '100%';
  htmlBlock.style.cssText = `flex-grow:1; width: ${heightAndWidthValue}; height: ${heightAndWidthValue}; background: transparent; position: relative;`;

  fatherBlock.appendChild(htmlBlock);

  if (htmlBlock.offsetWidth > 30 && htmlBlock.offsetHeight > 30) {
    htmlBlock.innerHTML = `
            <div class="list-figure__detail__height" style="color: red;">800</div>
            <div class="list-figure__detail__width" style="color: red;">900</div>
        `;

    htmlBlock.children[0].textContent = Math.round(htmlBlock.getBoundingClientRect().height * listScale);
    htmlBlock.children[1].textContent = Math.round(htmlBlock.getBoundingClientRect().width * listScale);
  } else {
    htmlBlock.style.display = 'none';
  }
}

// вспом. функция получения элемента по координатам. работает неидеально, но проще с точки зрения производительности
function getElementAtCoordinates(parentElement, x, y) {
  if (!(parentElement instanceof HTMLElement)) {
    throw new Error('Укажите корректный родительский элемент.');
  }

  // Получаем элемент под заданными координатами относительно родительского элемента
  const rect = parentElement.getBoundingClientRect();
  const element = document.elementFromPoint(rect.left + x, rect.top + y);

  // Проверяем, находится ли элемент внутри родительского
  if (element && parentElement.contains(element)) {
    return element;
  }

  return null; // Элемента в этих координатах нет или он вне родительского элемента
}

// проверка вмещаются ли все детали на листе в методе оптимально
// Проверка всех деталей на листе
function checkAllDetailsOnList(fatherHTML, details, methodValue) {
  const listWidth = removePx(fatherHTML.style.width);
  const listHeight = removePx(fatherHTML.style.maxHeight);

  const isMiniature = false;

  // обнуляем touches для активного листа
  listsArray[activeList].details.forEach((detail) => {
    detail.touches = { bottom: 0, right: 0 };
  });

  let isAllDetailsOnList = true;

  details.forEach((detailWrapper) => {
    // сравним топ + высота и лефт + ширина с размерами листа

    const detailNumberText = detailWrapper.querySelector('.list-figure__detail__number').textContent;
    let detailNumber = detailNumberText.split('№')[1].split('.')[0];
    detailNumber = Number(detailNumber) - 1;

    const detailFromOriginalList = listsArray[activeList].details.find((detail) => detail.number === detailNumber);

    try {
      checkDetailBounds(
        detailFromOriginalList,
        detailWrapper,
        fatherHTML,
        listWidth,
        listHeight,
        activeList,
        isMiniature,
        methodValue,
        true
      );
    } catch (error) {
      console.error(error.message);
      isAllDetailsOnList = false;
    }
  });

  return isAllDetailsOnList;
}

// запоминание left и top
function setOptimalPositions(grid, listI) {
  const elements = grid.querySelectorAll('.list-figure__detail');

  const newElements = Array.from(elements).map((element) => {
    const computedLeft = Number(removePx(window.getComputedStyle(element).left));
    const computedTop = Number(removePx(window.getComputedStyle(element).top));

    let number = element.querySelector('.list-figure__detail__number').textContent;
    number = Number(number.split('№')[1].split('.')[0]);

    return { left: computedLeft, top: computedTop, number: number };
  });

  listsArray[listI].details.forEach((detail) => {
    detail.positions = newElements.filter((element) => {
      return element.number - 1 === detail.number;
    });
  });
}

// самая важная функция - рендер деталей на листе
function renderActualListDetails(fatherHTML, details, listI, isMiniature) {
  fatherHTML.innerHTML = '';

  // значение размера листа
  const listSize = getListSize(true);
  const [listWidth, listHeight] = listSize;

  // значение метода раскроя
  let methodValue = document.querySelector('#method .dropdown-btn').textContent;

  // дефолтное значение
  if (methodValue === 'Выберите метод') {
    methodValue = 'По длине листа';
  }

  // фактическая ширина и масштаб исходя из неё
  const resultWidth = fatherHTML.clientWidth;
  let listScale = Math.ceil(listWidth / resultWidth);
  listScale = findClosestDivisor(listWidth, listScale);
  // минимальный масштаб - 4, максимальный - 7
  if (listScale < 4) listScale = 4;
  if (!isMiniature && listScale > 7) listScale = 7;

  // zoom
  if (!isMiniature) listScale += zoomAddition;

  if (methodValue === 'Оптимально') {
    // округляем до 5 в большую сторону
    listScale = Math.ceil(listScale / 5) * 5;
  }

  console.log('list scale:', listScale);

  const scaleWidth = getPixelsFromMM(listWidth, listScale);
  const scaleHeight = getPixelsFromMM(listHeight, listScale);

  // ширина родительского элемента
  fatherHTML.style.setProperty('width', scaleWidth + 'px', 'important');

  // высота родительского элемента устанавливается исходя из масштаба полученного с ширины
  fatherHTML.style.setProperty('min-height', scaleHeight + 'px', 'important');
  fatherHTML.style.setProperty('max-height', scaleHeight + 'px', 'important');

  // детали с quantity повторяются несколько раз
  const detailsWithQuantityFill = [];
  details.forEach((detail, i) => {
    // обнуление соприкосновений справа
    detail.touches.right = 0;
    detail.touches.bottom = 0;

    detail.number = i;
    const detailArray = Array(Number(detail.quantity)).fill(detail);
    const result = detailArray.map((miniDetail, i) => {
      return { ...miniDetail, position: i };
    });

    detailsWithQuantityFill.push(...result);
  });

  if (methodValue.startsWith('Разрезать')) {
    const detailsCount = methodValue.split(' ')[2];

    if (listHeight / 2 > listWidth / (detailsCount / 2)) {
      methodValue = 'По ширине листа';
    } else {
      methodValue = 'По длине листа';
    }

    if (detailsCount === '2') {
      methodValue = 'По ширине листа';
    }
  }

  if (methodValue === 'По длине листа') {
    fatherHTML.style.flexDirection = 'column';
    fatherHTML.style.display = 'flex';
  } else if (methodValue === 'По ширине листа') {
    fatherHTML.style.flexDirection = 'row';
    fatherHTML.style.display = 'flex';

    fatherHTML.style.alignItems = 'unset';
    fatherHTML.style.alignContent = 'unset';
    fatherHTML.style.flexWrap = 'nowrap';
  } else if (methodValue === 'Оптимально') {
    var grid = fatherHTML;

    var pckry = new Packery(grid, {
      itemSelector: '.list-figure__detail',
      transitionDuration: 0,
      columnWidth: 0.1,
    });

    setTimeout(() => {
      pckry.getItemElements().forEach(function (itemElem) {
        var draggie = new Draggabilly(itemElem);
        pckry.bindDraggabillyEvents(draggie);
      });

      pckry.once('layoutComplete', (items) => {
        console.log('layoutComplete');

        items.forEach((draggie) => {
          const dataX = Number(draggie.element.getAttribute('data-x'));
          const dataY = Number(draggie.element.getAttribute('data-y'));

          const dataXInit = draggie.element.getAttribute('data-x');
          if (!dataXInit) {
            console.log('no data x!');
            return;
          }

          draggie.element.style.setProperty('left', `${dataX}px`, 'important');
          draggie.element.style.setProperty('top', `${dataY}px`, 'important');

          draggie.position.x = dataX;
          draggie.position.y = dataY;
          draggie.rect.x = dataX;
          draggie.rect.y = dataY;
        });

        // обработка поворотов деталей
        $('.lists-results__body__wrapper .list-figure .list-figure__detail').on('contextmenu', (e) => {
          e.preventDefault();

          // Удаляем ранее добавленное меню, если оно существует
          $('.context-menu').remove();

          // Создаем меню
          const menu = document.createElement('div');
          menu.classList.add('context-menu');
          menu.innerHTML = `
            <div class="context-menu__item">Повернуть на 90°</div>
          `;

          // Устанавливаем позицию меню в месте клика
          menu.style.position = 'absolute';
          menu.style.top = `${e.pageY}px`;
          menu.style.left = `${e.pageX}px`;

          // Добавляем меню на страницу
          document.body.appendChild(menu);

          // Добавляем обработчик для кликов по элементам меню
          $('.context-menu__item').on('click', function () {
            // Выполняем действие, например, поворот элемента
            const target = $(e.target); // Целевая деталь

            const detailNumberText = e.currentTarget.querySelector('.list-figure__detail__number').textContent;
            let detailNumber = detailNumberText.split('№')[1].split('.')[0];
            detailNumber = Number(detailNumber) - 1;

            const detailFromOriginalList = listsArray[listI].details.find((detail) => detail.number === detailNumber);
            detailFromOriginalList.quantity = String(Number(detailFromOriginalList.quantity) - 1);

            const newDetail = createNewDetail();
            newDetail.quantity = '1';
            newDetail.height = detailFromOriginalList.width;
            newDetail.width = detailFromOriginalList.height;

            // todo убрать старый позишн
            const excludedPositionIndex = detailFromOriginalList.positions.findIndex(
              (position) => position.left === removePx(target.css('left')) && position.top === removePx(target.css('top'))
            );
            if (excludedPositionIndex !== -1) {
              detailFromOriginalList.positions.splice(excludedPositionIndex, 1);
            }

            if (details.some((detail) => detail.positions.length > 0)) {
              const x = listWidth / listScale - newDetail.width / listScale - 5;
              const y = listHeight / listScale - newDetail.height / listScale - 5;

              newDetail.positions = [
                {
                  left: x,
                  top: y,
                  number: listsArray[activeList].details.length + 1,
                },
              ];
            }

            details.push(newDetail);

            renderActualListDetails(fatherHTML, details, listI, isMiniature);
            renderLists();
          });
        });
      });

      pckry.layout();

      // todo: onDragEnd вместо positioned для перформанса?

      pckry.on('dragItemPositioned', (draggedItem) => {
        const initPositionX = draggedItem.position.x;
        const initPositionY = draggedItem.position.y;

        let whileDo = true;
        let plusValue = 1;

        while (whileDo) {
          plusValue = plusValue - 5; // -5 для оптимизации, можно -1 для точности
          const detailHeight = removePx(window.getComputedStyle(draggedItem.element).height);
          const element = getElementAtCoordinates(grid, initPositionX + plusValue, initPositionY + 1);
          const bottomElement = getElementAtCoordinates(grid, initPositionX + plusValue, initPositionY + detailHeight);

          if (element && element.classList.contains('list-figure__detail')) {
            whileDo = false;

            const computedLeft = Number(removePx(window.getComputedStyle(element).left));
            const computedWidth = Number(removePx(window.getComputedStyle(element).width));

            const finalPosition = computedLeft + computedWidth;
            draggedItem.position.x = finalPosition;
            draggedItem.rect.x = finalPosition;
            draggedItem.element.style.left = `${finalPosition}px`;

            const isAllDetailsOnList = checkAllDetailsOnList(fatherHTML, pckry.getItemElements(), methodValue);
            if (isAllDetailsOnList) {
              setOptimalPositions(grid, listI);
            }
          } else if (bottomElement && bottomElement.classList.contains('list-figure__detail')) {
            whileDo = false;

            const computedLeft = Number(removePx(window.getComputedStyle(bottomElement).left));
            const computedWidth = Number(removePx(window.getComputedStyle(bottomElement).width));

            const finalPosition = computedLeft + computedWidth;
            draggedItem.position.x = finalPosition;
            draggedItem.rect.x = finalPosition;
            draggedItem.element.style.left = `${finalPosition}px`;

            const isAllDetailsOnList = checkAllDetailsOnList(fatherHTML, pckry.getItemElements(), methodValue);
            if (isAllDetailsOnList) {
              setOptimalPositions(grid, listI);
            }
          }

          if (initPositionX + plusValue < 0) {
            whileDo = false;
            draggedItem.position.x = 0;
            draggedItem.rect.x = 0;
            draggedItem.element.style.left = '0px';

            const isAllDetailsOnList = checkAllDetailsOnList(fatherHTML, pckry.getItemElements(), methodValue);
            if (isAllDetailsOnList) {
              setOptimalPositions(grid, listI);
            }
          }
        }
      });
    }, 500);
  }

  if (isMiniature) {
    cutlinesScale = listScale;
  }

  let remainingOrientation = 'column';

  if (methodValue === 'По ширине листа') {
    remainingOrientation = 'column';
  } else if (methodValue === 'По длине листа') {
    remainingOrientation = 'row';
  }

  let detailsToRender = detailsWithQuantityFill;

  if (!methodValue.startsWith('Разрезать')) {
    detailsToRender = sortDetails(detailsWithQuantityFill, remainingOrientation, methodValue);
  }

  console.log('orientation', remainingOrientation);
  console.log('detailsToRender', detailsToRender);

  if (methodValue === 'Оптимально') {
    const allDetails = detailsToRender.flat();
    detailsToRender = [allDetails];
  }

  detailsToRender.forEach((row, rowI) => {
    const lastRow = document.createElement('div');

    const classToAdd = remainingOrientation === 'column' ? 'list-figure__column' : 'list-figure__row';
    lastRow.classList.add(classToAdd);

    if (methodValue !== 'Оптимально') {
      fatherHTML.appendChild(lastRow);
    }

    row.forEach((detail, i) => {
      // создаём саму деталь
      console.log('создаем detail', detail);
      const detailWrapper = createDetailWrapper(detail, listScale, methodValue, isMiniature);

      const detailWidth = getPixelsFromMM(detail.width, listScale);
      const detailHeight = getPixelsFromMM(detail.height, listScale);

      if (methodValue === 'Оптимально') {
        fatherHTML.appendChild(detailWrapper);

        if (!detail.positions || !detail.positions.length) {
          pckry.appended(detailWrapper);
          pckry.layout();
        }

        if (detail.positions && detail.positions[detail.position]) {
          const detailPosition = detail.positions[detail.position];

          pckry.addItems(detailWrapper);
          detailWrapper.style.top = detailPosition.top + 'px';
          detailWrapper.style.left = detailPosition.left + 'px';

          detailWrapper.setAttribute('data-x', detailPosition.left);
          detailWrapper.setAttribute('data-y', detailPosition.top);
        }
      } else {
        lastRow.appendChild(detailWrapper);
      }

      // координаты элемента

      const boundingRect = detailWrapper.getBoundingClientRect();
      const relativeX = boundingRect.left - fatherHTML.getBoundingClientRect().left - 1;
      const relativeY = boundingRect.top - fatherHTML.getBoundingClientRect().top - 1;

      console.log('relatives: x y and detailHeight: ', relativeX, relativeY, detailHeight);

      // создаём cut-lines
      createCutLines(
        methodValue,
        lastRow,
        detailWidth,
        detailHeight,
        relativeX,
        relativeY,
        scaleWidth,
        scaleHeight,
        isMiniature,
        listI,
        remainingOrientation,
        detailWrapper
      );

      // ПРЕДУПРЕЖДЕНИЯ о вылезании деталей
      checkDetailBounds(detail, detailWrapper, fatherHTML, scaleWidth, scaleHeight, listI, isMiniature, methodValue, false);

      // остатки
      // если row закончился, добавляем остаток на всё оставшееся место
      if (i + 1 === row.length && !isMiniature) {
        createRemainingSpaceThing(lastRow, methodValue, listScale, true);
      }
    });

    // если ряды закончились добавляем остаток на всё оставшееся место
    if (rowI + 1 === detailsToRender.length && !isMiniature && methodValue !== 'Оптимально') {
      createRemainingSpaceThing(fatherHTML, methodValue, listScale);
    }
  });
}

function sortDetails(detailsWithQuantityFill, orientation = 'row', methodValue) {
  const sizes = getListSize(true);
  let remainingDetails = detailsWithQuantityFill.map((detail) => ({
    ...detail,
    width: Number(detail.width),
    height: Number(detail.height),
  }));

  if (methodValue !== 'Оптимально') {
    console.log('не оптимально');
    remainingDetails = adjustDetailsOrientation(remainingDetails, sizes, orientation);
  }

  const sortBy = orientation === 'column' ? 'width' : 'height';
  remainingDetails.sort((a, b) => b[sortBy] - a[sortBy]);

  const rows = createRows(remainingDetails, sizes, orientation, methodValue);
  return rows;
}

function adjustDetailsOrientation(details, sizes, orientation) {
  return details.map((detail) => {
    if (orientation === 'column') {
      if (detail.width > detail.height) [detail.width, detail.height] = [detail.height, detail.width];
      if (detail.height > sizes[1]) [detail.width, detail.height] = [detail.height, detail.width];
    } else {
      if (detail.height > detail.width) [detail.width, detail.height] = [detail.height, detail.width];
      if (detail.width > sizes[0]) [detail.width, detail.height] = [detail.height, detail.width];
    }
    return detail;
  });
}

function createRows(remainingDetails, sizes, orientation, methodValue) {
  const rows = [];

  if (methodValue === 'Оптимально') {
    return remainingDetails;
  }

  while (remainingDetails.length > 0) {
    const currentRow = [];
    for (let i = 0; i < remainingDetails.length; ) {
      const detail = remainingDetails[i];
      if (canAddToRow(currentRow, detail, orientation, sizes)) {
        currentRow.push(detail);
        remainingDetails.splice(i, 1);
      } else if (canRotateAndAdd(currentRow, detail, orientation, sizes)) {
        currentRow.push(detail);
        remainingDetails.splice(i, 1);
      } else {
        i++;
      }
    }
    rows.push(currentRow);
  }
  return rows;
}

function canAddToRow(row, detail, orientation, sizes) {
  const param = orientation === 'column' ? 'height' : 'width';
  const maxSize = sizes[orientation === 'column' ? 1 : 0];
  const totalSize = row.reduce((sum, item) => sum + item[param], 0);
  return totalSize + detail[param] <= maxSize;
}

function canRotateAndAdd(row, detail, orientation, sizes) {
  [detail.width, detail.height] = [detail.height, detail.width];

  const canAdd =
    canAddToRow(row, detail, orientation, sizes) &&
    ((orientation === 'row' && detail.height <= row[0]?.height) || (orientation === 'column' && detail.width <= row[0]?.width));

  if (!canAdd) {
    [detail.width, detail.height] = [detail.height, detail.width]; // переворачивает обратно
  }

  return canAdd;
}

// рендер большой версии листа (справа)
function renderActualListCut(hideWidth = false, renderForPDF = false) {
  const list = listsArray[activeList];

  const figureHTML = document.querySelector('.cutting-calculator__lists-results .list-figure');
  figureHTML.style.cssText = '';

  if (!list) {
    figureHTML.innerHTML = '';
    renderListsCutPanel();

    createStubs();
    return;
  }

  const zoomBlock = document.querySelector('.lists-results__body__zoom');
  zoomBlock.style.display = 'flex';

  const heading = document.querySelector('.lists-results__body__heading');
  heading.textContent = `Лист ${activeList + 1}`;

  figureHTML.style.visibility = 'visible';

  const materialValue = document.querySelector('#material .dropdown-btn').textContent;

  if (list.details.length === 3 && listsArray.length === 1) {
    const allDetailsHaveZeroSize = list.details.every((detail) => detail.width == 0 && detail.height == 0);
    if (allDetailsHaveZeroSize) {
      if (materialValue === 'Сотовый поликарбонат') {
        figureHTML.style.background = `url('/local/templates/polymax_copy/assets/img/cutting-calculator/sotoviy_remains.png')`;
      } else {
        figureHTML.style.background = 'var(--grey-light)';
      }
    }
  }

  const [listWidth, listHeight] = getListSize(true);

  renderActualListDetails(figureHTML, list.details, activeList);

  if (renderForPDF) {
    document.querySelectorAll('.cutting-calculator__lists-results .list-figure__detail').forEach((elem) => {
      elem.style.setProperty('background', 'white', 'important');
    });

    document.querySelectorAll('.cutting-calculator__lists-results .cutline').forEach((cutline) => {
      let width = cutline.offsetWidth;
      let height = cutline.offsetHeight;

      cutline.style.backgroundColor = 'black';

      if (width === 1) {
        cutline.style.width = '2px';
        cutline.style.right = '-1px';
      } else if (height === 1) {
        cutline.style.height = '2px';
        cutline.style.bottom = '-1px';
      }
    });

    const listSizeWidths = document.querySelectorAll('.cutting-calculator__lists-results .list-figure__detail__width');
    const listSizeHeights = document.querySelectorAll('.cutting-calculator__lists-results .list-figure__detail__height');

    const listSizes = [...listSizeWidths, ...listSizeHeights];

    listSizes.forEach((sizeElem) => {
      sizeElem.style.setProperty('color', 'black', 'important');
      sizeElem.style.setProperty('font-weight', 'bold', 'important');
      sizeElem.style.setProperty('font-size', '22px', 'important');

      if (sizeElem.classList.contains('list-figure__detail__height')) {
        sizeElem.style.left = '-14px';
      }
    });

    figureHTML.style.setProperty('border-width', '2px', 'important');
  }

  const sizesTooltips = `
  <div class="list-figure__dlina">Длина (${listWidth})</div>
  ${hideWidth || !listHeight ? '' : `<div class="list-figure__shirina">Ширина (${listHeight})</div>`}
`;

  figureHTML.insertAdjacentHTML('afterbegin', sizesTooltips);

  if (!renderForPDF) {
    renderListsCutPanel();
  }
}

// функция рендера листов в панели посередине (с миниатюрами)
function renderListsCutPanel() {
  const wrapper = document.querySelector('.cutting-calculator__lists-preview .lists-preview__body');
  wrapper.innerHTML = '';

  wrapper.style.setProperty('max-height', document.querySelector('.cutting-calculator__panel').clientHeight + 'px', 'important');
  cutlinesArray = [];

  const materialValue = document.querySelector('#material .dropdown-btn').textContent;

  listsArray.forEach((list, i) => {
    const listWrapper = document.createElement('div');
    listWrapper.classList.add('lists-preview__body__wrapper');

    listWrapper.addEventListener('click', (e) => {
      if (
        e.target.classList.contains('lists-preview__body__wrapper__delete') ||
        e.target.classList.contains('delete__svg') ||
        e.target.classList.contains('delete__svg__path')
      ) {
        return;
      }

      activeList = i;

      renderLists();
    });

    if (i === activeList) {
      listWrapper.classList.add('active');
    }

    const listName = document.createElement('div');
    listName.classList.add('lists-preview__body__wrapper__name');
    listName.textContent = `Лист ${i + 1}`;
    listWrapper.appendChild(listName);

    const listResultWrapper = document.createElement('div');
    listResultWrapper.classList.add('lists-preview__body__wrapper__result');
    listWrapper.appendChild(listResultWrapper);

    const result = document.createElement('div');
    result.classList.add('lists-preview__body__wrapper__result__list', 'list-figure');
    listResultWrapper.appendChild(result);

    if (list.details.length === 3 && listsArray.length === 1) {
      const allDetailsHaveZeroSize = list.details.every((detail) => detail.width == 0 && detail.height == 0);
      if (allDetailsHaveZeroSize) {
        if (materialValue !== 'Сотовый поликарбонат') {
          listResultWrapper.style.background = 'var(--grey-light)';
          listResultWrapper.style.border = '1px solid var(--gray-dark)';
          result.style.opacity = '0';
        } else {
          result.style.background = `url('/local/templates/polymax_copy/assets/img/cutting-calculator/miniature-remains.png')`;
        }
      }
    }

    // кнопка удаления
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = `<svg class="delete__svg" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none"><path class="delete__svg__path" d="M6.364 4.95 11.314 0l1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95L0 11.314l4.95-4.95L0 1.414 1.414 0z" fill="#fd6a6a"/></svg>`;
    deleteButton.classList.add('lists-preview__body__wrapper__delete');

    deleteButton.onclick = () => {
      if (askAgain) {
        openModal('deletingElement', {
          thingType: 'list',
          listI: i,
        });
        return;
      }

      deleteList(i);
    };

    listWrapper.appendChild(deleteButton);

    wrapper.appendChild(listWrapper);

    const methodValue = document.querySelector('#method .dropdown-btn');

    if (methodValue.textContent === 'Оптимально') {
      listResultWrapper.style.background = 'var(--grey-light)';
      listResultWrapper.style.border = '1px solid var(--gray-dark)';
      result.style.opacity = '0';

      return;
    }

    cutlinesArray.push([]);
    renderActualListDetails(result, list.details, i, true);

    //TODO вставление элементов
    // брать width из HTML. например если в HTMl получилась width 125px, то берётся масштаб 2050 / 125. То есть 1 пиксель = 16.4 мм
    // и в функции делить не на 4 а на 16.4
    // + height элемента высчитать из этого же масштаба

    // TODO сделать минимальную ширину у элемента чтоб не был слишком тонким и масштаб не ломался
  });

  if (listsArray.length > 0) {
    const addListButton = document.createElement('button');
    addListButton.classList.add('cutting-calculator__small-button');
    addListButton.title = 'Добавить лист';
    addListButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M6 6V0H8V6H14V8H8V14H6V8H0V6H6Z" fill="white"></path>
        </svg>`;

    addListButton.addEventListener('click', () => {
      createNewList();

      renderLists();
      renderResults();
    });

    wrapper.appendChild(addListButton);
  }
}
const toScale = (number) => number / 2.83;
const createPDFFooter = (pdf) => {
  const currentPage = pdf.internal.getCurrentPageInfo().pageNumber;
  // const pagesLength = pdf.internal.getNumberOfPages();

  pdf.setFont('Panton-400');
  pdf.setFontSize(14);
  pdf.setTextColor(104, 106, 91);

  pdf.text('poly-max.com', toScale(40), toScale(800));
  pdf.text(`Страница ${currentPage}`, toScale(473), toScale(800));
};
const createPDFSmallLogo = (pdf, logo) => {
  pdf.addImage(logo, 'PNG', toScale(473), toScale(40), toScale(81), toScale(60), null, 'FAST');
};

function convertToGrayscale(canvas) {
  const ctx = canvas.getContext('2d');

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const red = data[i];
    const green = data[i + 1];
    const blue = data[i + 2];

    const gray = 0.3 * red + 0.59 * green + 0.11 * blue;

    data[i] = gray;
    data[i + 1] = gray;
    data[i + 2] = gray;
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL('image/png');
}

async function generatePDF() {
  const form = document.querySelector('.cutting-calculator__modal-form');
  form.classList.remove('d-block');

  openModal('waitingPDF');
  const { jsPDF } = window.jspdf;

  const images = [];

  const pdf = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4', // A4 в пикселях при 72 DPI (ширина 595px и высота 842px)
  });

  pdf.setFont('Panton');

  // первый параметр отступ слева по горизонтали, второй параметр отступ сверху по вертикали
  // pdf.text("Hello world!", 50, 10);

  // Добавление текста и изображения на первую страницу
  const polymaxLogo = new Image();
  polymaxLogo.src = '/local/templates/polymax_copy/assets/img/cutting-calculator/pdf/polymax-logo-3.png';

  //   pdf.addImage(
  //     polymaxLogo,
  //     'PNG',
  //     toScale(40),
  //     toScale(40),
  //     toScale(205),
  //     toScale(150),
  //     null,
  //     'FAST'
  //   ); // координаты и размеры изображения

  //   pdf.setFontSize(64);
  //   pdf.setTextColor(39, 39, 39);
  //   pdf.text('Результаты', toScale(40), toScale(332)); // координаты текста
  //   pdf.text('раскроя', toScale(40), toScale(332 + 64));

  //   const gradientLine = new Image();
  //   gradientLine.src =
  //     '/local/templates/polymax_copy/assets/img/cutting-calculator/pdf/gradient-line.png';
  //   pdf.addImage(
  //     gradientLine,
  //     'PNG',
  //     toScale(0),
  //     toScale(480),
  //     pdfWidth,
  //     toScale(40),
  //     null,
  //     'FAST'
  //   ); // координаты и размеры изображения

  //   // Добавляем тексты снизу страницы
  //   pdf.setFontSize(14);
  //   pdf.setFont('Panton-400');
  //   pdf.setTextColor(104, 106, 91);

  //   pdf.text('Останутся вопросы,', toScale(40), toScale(760));
  //   pdf.text('звоните', toScale(40), toScale(760 + 21));

  //   pdf.text('Санкт-Петербург:', toScale(253), toScale(760));
  //   pdf.text('8 (812) 454-22-25', toScale(253), toScale(760 + 21));

  //   pdf.text('Ярославль:', toScale(432), toScale(760));
  //   pdf.text('8 (485) 228-09-89', toScale(432), toScale(760 + 21));

  // Новая страница
  const listSize = getListSize();
  const listSizes = getListSize(true);

  const figure = document.querySelector('.lists-results__body__wrapper .list-figure');
  const results = document.querySelector('.cutting-calculator__panel__results .results__body-wrapper');

  const oldActiveList = activeList;

  for (const [i, list] of listsArray.entries()) {
    if (i !== 0) {
      pdf.addPage();
    }

    createPDFSmallLogo(pdf, polymaxLogo);

    pdf.setFontSize(16);
    pdf.setFont('Panton');
    pdf.setTextColor(39, 39, 39);
    pdf.text(`Лист ${i + 1}`, toScale(40), toScale(104));

    pdf.setFontSize(14);
    pdf.setFont('Panton-400');
    pdf.text(`Размер листа (мм) ${listSize}`, toScale(100), toScale(104));

    activeList = i;
    renderActualListCut(true, true);

    const canvas = await html2canvas(figure);
    const imgData = canvas.toDataURL('image/png');
    const grayImgData = convertToGrayscale(canvas);
    images.push({ img: imgData, grayImg: grayImgData });
    // 3050x2050 идеально встаёт под размеры 454 276
    // получается масштаб такой: 3050:454 = 6.7, округлим до 7
    // значит 6000x2100 будет 6000:7 = 857 и 2100:7 = 300
    // но как высчитать полный масштаб? вдруг он будет вылезать за пределы в случае 12000 и т.д.
    // надо взять ширину листа 210мм. это максимальный масштаб в мм
    // в пискелях это 630.
    // получается 3050 делим на 630 получаем масштаб 4.8
    // 12000 делим на 630 получаем масштаб 19.04

    // то есть при масштабе 19.04 мы должны разделить высоту 2100 на 19 получаем 110 пикселей
    // и эти 110 пикселей помещаем в toScale для переноса в милиметры
    const biggestSize = Math.max(...listSizes);

    const scaleDivider = biggestSize == listSizes[0] ? 515 : 320;

    let listScale = Math.ceil(biggestSize / scaleDivider);
    let listWidth = listSizes[0] / listScale;
    let listHeight = listSizes[1] / listScale;

    if (listHeight > 320) {
      listScale = listSizes[1] / 320;
      listWidth = listSizes[0] / listScale;
      listHeight = listSizes[1] / listScale;
    }

    // расчёты почти правильные но не учли отступ 40 пикселей слева. ещё же нужен небольшой отступ справа
    // значит нужно уменишить изначальный масштаб на 80 пикселей получается 550 пикселей
    pdf.addImage(grayImgData, 'PNG', toScale(40), toScale(140), toScale(listWidth), toScale(listHeight));

    pdf.setFontSize(12);
    pdf.setFont('Panton');
    pdf.setTextColor(39, 39, 39);
    pdf.text(`Длина (${listSizes[0]})`, toScale(40 + listWidth / 2 - 20), toScale(130));
    pdf.text(`Ширина (${listSizes[1]})`, toScale(40 + listWidth + 5), toScale(100 + listHeight / 2), { angle: 270 });

    pdf.setFontSize(12);
    pdf.setFont('Panton');
    pdf.setTextColor(134, 142, 150);
    pdf.text(`фотографию листа в хорошем качестве можно найти в файле лист_${i + 1}.png`, toScale(40), toScale(480));

    pdf.setFontSize(16);
    pdf.setTextColor(39, 39, 39);
    pdf.setFont('Panton');
    pdf.text('Элементы', toScale(40), toScale(520));

    // теперь вывод деталей
    pdf.setFontSize(14);
    pdf.setFont('Panton-400');
    let xValue = 556; //изначальная точка, будет прибавляться 10 к ней
    list.details.forEach((detail, i) => {
      if (detail.height === '' || detail.width === '' || detail.quantity === 0) return;

      pdf.text(`${i + 1}.  ${detail.width} мм x ${detail.height} мм, количество: ${detail.quantity}`, toScale(40), toScale(xValue));
      xValue += 30;

      if (xValue > 800) {
        createPDFFooter(pdf);
        pdf.addPage();
        createPDFSmallLogo(pdf, polymaxLogo);
        pdf.setFontSize(14);
        pdf.setFont('Panton-400');
        pdf.setTextColor(39, 39, 39);
        xValue = 100;
      }
    });

    createPDFFooter(pdf);
  }

  // создание последней страницы с результатами
  pdf.addPage();
  createPDFSmallLogo(pdf, polymaxLogo);

  results.style.width = '515px';

  let resultsWidth = 515;
  let resultsHeight = results.offsetHeight;

  if (results.offsetHeight > 681) {
    const resultsScale = results.offsetHeight / 681;

    resultsWidth = resultsWidth / resultsScale;
    resultsHeight = 681;
  }

  const canvas = await html2canvas(results, { scale: 3 });
  const imgData = canvas.toDataURL('image/png');
  pdf.addImage(imgData, 'PNG', toScale(40), toScale(140), toScale(resultsWidth), toScale(resultsHeight));

  pdf.setFontSize(16);
  pdf.setFont('Panton');
  pdf.setTextColor(39, 39, 39);
  pdf.text('Результаты расчета', toScale(40), toScale(104));

  createPDFFooter(pdf);

  // зарендерить старый лист
  activeList = oldActiveList;
  renderActualListCut(false, false);
  results.style.width = 'unset';

  return { pdf, images };
}

function generateZip(pdf, images) {
  const zip = new JSZip();

  images.forEach((image, i) => {
    // Конвертация Data URL в Blob
    const data = image.grayImg.split(',')[1]; // Убираем префикс "data:image/png;base64,"
    const binaryData = atob(data);
    const arrayBuffer = new Uint8Array(binaryData.length);
    for (let j = 0; j < binaryData.length; j++) {
      arrayBuffer[j] = binaryData.charCodeAt(j);
    }
    const blob = new Blob([arrayBuffer], { type: 'image/png' });

    // Добавление изображения в zip
    zip.file(`лист_${i + 1}.png`, blob);
  });

  const pdfBlob = pdf.output('blob');
  zip.file('polymax.pdf', pdfBlob);

  return zip.generateAsync({ type: 'blob' });
}

function generateStringResult() {
  const material = document.querySelector('#material .dropdown-btn').textContent;
  const resultsWrapper = document.querySelector('.cutting-calculator__panel__results .results__body-wrapper');
  const resultRows = resultsWrapper.querySelectorAll('.results__body__row');

  const resultArray = [`Материал: ${material}`];

  resultRows.forEach((row) => {
    const name = row.querySelector('.results__body__row__name').textContent;
    const value = row.querySelector('.results__body__row__value').textContent;

    resultArray.push(`${name}: ${value}`);
  });

  return resultArray.join('\n');
}

document.addEventListener('DOMContentLoaded', () => {
  // базовый dropdown с выбором значения
  const dropdowns = document.querySelectorAll('.cutting-dropdown');

  dropdowns.forEach((dropdown) => {
    const dropdownContent = dropdown.querySelector('.dropdown-content');
    const dropdownButton = dropdown.querySelector('.dropdown-btn');

    // открытие и закрытие dropdown
    dropdownButton.addEventListener('click', (e) => {
      e.stopPropagation();
      const hasShow = dropdownContent.classList.contains('show');
      closeAllDropdowns();

      if (!hasShow) {
        toggleDropdown(dropdownContent);
      }
    });

    dropdownContent.addEventListener('click', (e) => {
      if (!e.target.classList.contains('dropdown-variant')) return;

      dropdownButton.textContent = e.target.textContent;
      toggleDropdown(dropdownContent);

      // при выборе меняются результаты
      setTimeout(() => {
        renderActualListCut();
        renderResults();
      });

      checkAutoCreation();
    });
  });

  // при нажатии в любое место снаружи - все дропдауны закрываются
  document.addEventListener('click', () => {
    closeAllDropdowns();
  });

  // при вводе в любой инпут обновляются результаты
  const inputs = document.querySelectorAll('.cutting-calculator__panel__options input');
  inputs.forEach((input) => {
    input.addEventListener('input', () => renderResults());
  });

  //константы
  const materialDropdownContent = document.querySelector('#material .dropdown-content');
  const materialDropdownButton = document.querySelector('#material .dropdown-btn');

  const sizeDropdownContent = document.querySelector('#size .dropdown-content');
  const sizeDropdownButton = document.querySelector('#size .dropdown-btn');

  const methodDropdownContent = document.querySelector('#method .dropdown-content');

  // при выборе метода разрезать или при изменении размера - добавляем "разрезать X" деталей
  const fillListListeners = [methodDropdownContent, sizeDropdownContent];
  fillListListeners.forEach((content) => {
    content.addEventListener('click', (e) => {
      if (!e.target.classList.contains('dropdown-variant')) return;

      fillListAuto();
    });
  });

  // при выборе метода рендерим листы
  methodDropdownContent.addEventListener('click', (e) => {
    if (!e.target.classList.contains('dropdown-variant')) return;

    renderLists();
  });

  // при выборе материала меняются доступные размеры
  const priceInput = document.querySelector('#cut-price-input');
  materialDropdownContent.addEventListener('click', (e) => {
    if (!e.target.classList.contains('dropdown-variant')) return;

    sizeDropdownContent.innerHTML = '';
    const sizes = calculateSizes(e.target.textContent);
    sizes.forEach((size) => {
      createDropdownVariant(size, sizeDropdownContent);
    });

    // выбор первого элемента
    sizeDropdownButton.textContent = sizes[0];

    // при выборе меняются результаты
    setTimeout(() => {
      fillListAuto();
      renderActualListCut();
      renderResults();
    });

    checkAutoCreation();
  });

  // при выборе материала меняется цена за пог. метр
  materialDropdownContent.addEventListener('click', (e) => {
    if (!e.target.classList.contains('dropdown-variant')) return;

    const cutPrice = getCutPrice(e.target.textContent);

    // значение инпута цены = cut price
    priceInput.setAttribute('value', cutPrice);
  });

  // при выборе материала ДРУГОЕ появляются / исчезают инпуты ввода размера
  const cuttingInputs = document.querySelector('.cutting-inputs');

  materialDropdownContent.addEventListener('click', (e) => {
    if (!e.target.classList.contains('dropdown-variant')) return;

    if (e.target.textContent === 'Другое') {
      cuttingInputs.classList.remove('d-none');
    } else {
      cuttingInputs.classList.add('d-none');
    }
  });

  // при выборе материала добавляется толщина
  const thicknessRow = document.querySelector('#thickness-row');

  materialDropdownContent.addEventListener('click', (e) => {
    if (!e.target.classList.contains('dropdown-variant')) return;

    if (['Монолитный поликарбонат', 'Оргстекло'].includes(e.target.textContent)) {
      thicknessRow.classList.remove('d-none');
    } else {
      thicknessRow.classList.add('d-none');
    }
  });

  // при выборе толщины меняется цена за пог. метр
  const thicknessDropdownContent = thicknessRow.querySelector('.dropdown-content');

  thicknessDropdownContent.addEventListener('click', (e) => {
    if (!e.target.classList.contains('dropdown-variant')) return;

    const cutPrice = getCutPrice(materialDropdownButton.textContent);

    // значение инпута цены = cut price
    priceInput.setAttribute('value', cutPrice);
  });

  // при вводе в размеры у ДРУГОЕ обновляются результаты
  cuttingInputs.addEventListener('input', () => {
    renderActualListCut();
    renderResults();
    checkAutoCreation();
  });

  // модалка - ask again
  const askAgainCheckboxHTML = document.querySelector('#ask-again-check');
  askAgainCheckboxHTML.addEventListener('change', () => {
    askAgain = !askAgain;
  });

  // раскрытие и закрытие блоков на мобилке
  if (window.innerWidth <= 660) {
    const results = document.querySelector('.cutting-calculator__panel__results');
    const resultsHeader = results.querySelector('.results__heading');
    const resultsBody = results.querySelector('.results__body');
    const resultsFooter = results.querySelector('.results__footer');

    resultsHeader.addEventListener('click', () => {
      resultsBody.classList.toggle('d-none');
      resultsFooter.classList.toggle('d-none');
    });

    const listsPreview = document.querySelector('.cutting-calculator__lists-preview');
    const listsHeader = listsPreview.querySelector('.lists-preview__heading');
    const listsBody = listsPreview.querySelector('.lists-preview__body');

    listsHeader.addEventListener('click', () => {
      listsBody.classList.toggle('d-none');
    });
  }

  // функционал zoom - увеличения listScale
  const zoomBlock = document.querySelector('.lists-results__body__zoom');
  const zoomMinus = zoomBlock.querySelector('.zoom-minus');
  const zoomPlus = zoomBlock.querySelector('.zoom-plus');
  const zoomValue = zoomBlock.querySelector('.zoom-value');

  let zoomValuePercent = 100;

  zoomMinus.addEventListener('click', () => {
    if (zoomAddition === 0) return;

    zoomAddition += 0.5;
    zoomValuePercent -= 10;

    zoomValue.textContent = `${zoomValuePercent}%`;

    // Округляем zoomAddition до одного десятичного знака
    zoomAddition = Number(zoomAddition.toFixed(1));

    if (zoomAddition === 0) {
      zoomMinus.classList.remove('active');
    }

    renderActualListCut();
  });

  zoomPlus.addEventListener('click', () => {
    zoomAddition -= 0.5;

    zoomMinus.classList.add('active');

    // Округляем zoomAddition до одного десятичного знака
    zoomAddition = Number(zoomAddition.toFixed(1));
    zoomValuePercent += 10;

    zoomValue.textContent = `${zoomValuePercent}%`;

    renderActualListCut();
  });

  // Удаление меню при клике в любом другом месте
  $(document).on('click', () => {
    $('.context-menu').remove();
  });

  // отправка PDF
  modalForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const variant = modalForm.getAttribute('data-variant');

    switch (variant) {
      case 'download': {
        const { pdf, images } = await generatePDF();
        const zip = await generateZip(pdf, images);
        saveAs(zip, 'polymax.zip');

        const formData = new FormData();
        formData.append('name', modalFormName.value);
        formData.append('phone', modalFormPhone.value);
        formData.append('message', generateStringResult());

        if (modalFormName.value !== '0000') {
          try {
            const response = await fetch('/ajax/sendPdf.php', {
              method: 'POST',
              body: formData,
            });

            if (response.ok) {
              console.log('успешно');
            } else {
              console.error('Ошибка отправки:', response.statusText);
            }
          } catch (error) {
            console.error('Ошибка:', error);
          }
        }

        closeModal();
        closeModalForm();

        break;
      }
      case 'email': {
        const { pdf, images } = await generatePDF();
        const zip = await generateZip(pdf, images);

        const formData = new FormData();
        formData.append('email', modalFormEmail.value);
        formData.append('phone', modalFormPhone.value);
        formData.append('name', modalFormName.value);

        const currentDate = Date.now();
        formData.append('file', zip, `polymax_${currentDate}.zip`);

        try {
          const response = await fetch('/ajax/sendPdf.php', {
            method: 'POST',
            body: formData,
          });

          if (response.ok) {
            console.log('успешно');
          } else {
            console.error('Ошибка отправки:', response.statusText);
          }
        } catch (error) {
          console.error('Ошибка:', error);
        }

        closeModal();
        closeModalForm();

        break;
      }
      default: {
        throw new Error('неизвестный вариант формы');
      }
    }
  });
  // результаты - первичный рендер
  renderResults();
  // первичный рендер заглушек
  createStubs();
});
