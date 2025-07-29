// Функция для раскроя листа
function layoutDetails(sheetWidth, sheetHeight, details) {
    console.log('details', details);
    // 1. Сортировка деталей по убыванию площади
    details.sort((a, b) => (b.width * b.height) - (a.width * a.height));
  
    // 2. Инициализация информации о листе
    let sheet = {
      width: sheetWidth,
      height: sheetHeight,
      usedSpace: [], // Массив для хранения информации о занятых областях
      cuts: [], // Массив для хранения информации о разрезах
    };
  
    // 3. Размещение деталей
    let placedDetails = []; // Массив для хранения информации о размещенных деталях
  
    for (let detail of details) {
      let bestOrientation;
      let bestPosition;
      let minCutLength = Infinity;
  
      // Перебор ориентаций (горизонтальная и вертикальная)
      for (let orientation of ['horizontal', 'vertical']) {
        let currentDetail = { ...detail };
        if (orientation === 'vertical') {
          [currentDetail.width, currentDetail.height] = [currentDetail.height, currentDetail.width];
        }
  
        // Перебор возможных позиций на листе
        for (let y = 0; y <= sheet.height - currentDetail.height; y += 10) {
          for (let x = 0; x <= sheet.width - currentDetail.width; x += 10) {
            let position = { x, y };
  
            console.log(position);
  
            // Проверка, помещается ли деталь на лист в данной позиции
            if (canPlaceDetail(sheet, currentDetail, position)) {
              // Вычисление длины разреза
              let cutLength = calculateCutLength(sheet, currentDetail, position);
  
              // Если длина разреза меньше минимальной, обновляем данные
              if (cutLength < minCutLength) {
                minCutLength = cutLength;
                bestOrientation = orientation;
                bestPosition = position;
              }
            }
          }
        }
      }
  
      // 4. Размещение детали на листе в найденной позиции
      if (bestPosition) {
        console.log('best position');
        placeDetail(sheet, { ...detail, orientation: bestOrientation }, bestPosition);
        placedDetails.push({
          ...detail,
          orientation: bestOrientation,
          x: bestPosition.x,
          y: bestPosition.y,
        });
      } else {
        console.warn(`Деталь ${detail.id} не поместилась на лист.`);
      }
    }
  
    return { placedDetails, cuts: sheet.cuts };
  }
  
  // Функция проверки, помещается ли деталь на лист
  function canPlaceDetail(sheet, detail, position) {
    // Проверяем, не выходит ли деталь за границы листа
    if (
      position.x + detail.width > sheet.width ||
      position.y + detail.height > sheet.height
    ) {
      return false;
    }
  
    // Проверяем, не пересекается ли деталь с уже занятыми областями
    for (let usedArea of sheet.usedSpace) {
      if (
        position.x < usedArea.x + usedArea.width &&
        position.x + detail.width > usedArea.x &&
        position.y < usedArea.y + usedArea.height &&
        position.y + detail.height > usedArea.y
      ) {
        return false;
      }
    }
  
    // console.log('return true')
  
    return true;
  }
  
  // Функция вычисления длины разреза
  function calculateCutLength(sheet, detail, position) {
    // Здесь мы просто вычисляем длину разреза до конца листа
    // Можно добавить более сложные метрики, как обсуждали ранее
    // console.log('cut length', detail)
    let cutLength = 0;
    if (detail.orientation === 'horizontal') {
        cutLength = sheet.width - position.x;
    } else {
        cutLength = sheet.height - position.y;
    }
    // console.log(cutLength);
    return cutLength;
  }
  
  // Функция размещения детали на листе
  function placeDetail(sheet, detail, position) {
    // Обновляем информацию о занятом пространстве
    sheet.usedSpace.push({
      x: position.x,
      y: position.y,
      width: detail.orientation === 'horizontal' ? detail.width : detail.height,
      height: detail.orientation === 'horizontal' ? detail.height : detail.width,
    });
  
    // Добавляем информацию о разрезе
    if (detail.orientation === 'horizontal') {
        sheet.cuts.push({
            x: position.x + (detail.orientation === 'horizontal' ? detail.width : detail.height),
            y: position.y,
            length: sheet.height - position.y,
            type: 'vertical'
        });
    } else {
        sheet.cuts.push({
            x: position.x,
            y: position.y + (detail.orientation === 'horizontal' ? detail.height : detail.width),
            length: sheet.width - position.x,
            type: 'horizontal'
        });
    }
  }
  
  // Пример использования
  let sheetWidth = 3000;
  let sheetHeight = 2000;
  let details = [
    { id: 1, width: 1200, height: 600 },
    { id: 2, width: 1200, height: 600 },
    { id: 3, width: 1200, height: 600 },
  ];
  
  // let result = layoutDetails(sheetWidth, sheetHeight, details);
  console.log("Размещенные детали:", result.placedDetails);
  console.log("Разрезы:", result.cuts);
  
  // Функция рендера (пример)
  function renderDetails(placedDetails, cuts, sheetWidth, sheetHeight) {
    const container = document.createElement('div');
    container.style.position = 'relative';
    container.style.width = `${sheetWidth}px`;
    container.style.height = `${sheetHeight}px`;
    container.style.border = '1px solid black';
  
    placedDetails.forEach(detail => {
      const detailDiv = document.createElement('div');
      detailDiv.style.position = 'absolute';
      detailDiv.style.left = `${detail.x}px`;
      detailDiv.style.top = `${detail.y}px`;
      detailDiv.style.width = `${detail.orientation === 'horizontal' ? detail.width : detail.height}px`;
      detailDiv.style.height = `${detail.orientation === 'horizontal' ? detail.height : detail.width}px`;
      detailDiv.style.backgroundColor = 'lightblue';
      detailDiv.style.border = '1px solid blue';
      detailDiv.textContent = `ID: ${detail.id}`;
      container.appendChild(detailDiv);
    });
  
    cuts.forEach(cut => {
      const cutDiv = document.createElement('div');
      cutDiv.style.position = 'absolute';
      cutDiv.style.left = `${cut.x}px`;
      cutDiv.style.top = `${cut.y}px`;
      cutDiv.style.width = `${cut.type === 'horizontal' ? cut.length : 1}px`;
      cutDiv.style.height = `${cut.type === 'vertical' ? cut.length : 1}px`;
      cutDiv.style.backgroundColor = 'red';
      container.appendChild(cutDiv);
    });
  
    document.body.appendChild(container);
  }
  
  // renderDetails(result.placedDetails, result.cuts, sheetWidth, sheetHeight);