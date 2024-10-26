// 1. Глобальные переменные
const products = document.querySelectorAll(".product");
const cart = document.querySelector(".cart");
let itemCount = 0;
let isItemDropped = false;
let touchStartX, touchStartY;

// 2. Проверка на сенсорное устройство
function isTouchDevice() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

// 3. Универсальные обработчики событий для перетаскивания
products.forEach((product) => {
  addDragEvents(product);
});

function addDragEvents(product) {
  if (isTouchDevice()) {
    addTouchEvents(product);
  } else {
    addMouseEvents(product);
  }
}

function addTouchEvents(product) {
  product.addEventListener("touchstart", (e) => startTouchDrag(e, product));
  product.addEventListener("touchmove", (e) => moveTouchDrag(e, product), {
    passive: false,
  });
  product.addEventListener("touchend", (e) => endTouchDrag(e, product));
}

function addMouseEvents(product) {
  product.addEventListener("mousedown", (e) => startMouseDrag(e, product));
}

// 4. Функции для обработки сенсорного перетаскивания
function startTouchDrag(e, product) {
  const touch = e.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
  product.classList.add("dragging");
  isItemDropped = false;
}

function moveTouchDrag(e, product) {
  e.preventDefault();
  const touch = e.touches[0];
  product.style.transform = `translate(${touch.clientX - touchStartX}px, ${
    touch.clientY - touchStartY
  }px)`;
}

function endTouchDrag(e, product) {
  const touch = e.changedTouches[0];
  if (isTouchOverCart(touch)) {
    handleDrop(product);
  } else {
    resetProductStyles(product);
  }
  product.classList.remove("dragging");
  product.style.transform = "";
}

// 5. Функции для обработки десктопного перетаскивания
function startMouseDrag(e, product) {
  e.preventDefault();
  touchStartX = e.clientX;
  touchStartY = e.clientY;
  product.classList.add("dragging");
  isItemDropped = false;

  const mouseMoveHandler = (eMove) => {
    product.style.transform = `translate(${eMove.clientX - touchStartX}px, ${
      eMove.clientY - touchStartY
    }px)`;
  };

  const mouseUpHandler = (eEnd) => {
    if (isMouseOverCart(eEnd)) {
      handleDrop(product);
    } else {
      resetProductStyles(product);
    }
    document.removeEventListener("mousemove", mouseMoveHandler);
    document.removeEventListener("mouseup", mouseUpHandler);
    product.classList.remove("dragging");
    product.style.transform = "";
  };

  document.addEventListener("mousemove", mouseMoveHandler);
  document.addEventListener("mouseup", mouseUpHandler);
}

// 6. Проверка на нахождение над корзиной
function isTouchOverCart(touch) {
  const cartRect = cart.getBoundingClientRect();
  const threshold = 100;

  return (
    touch.clientX >= cartRect.left - threshold &&
    touch.clientX <= cartRect.right + threshold &&
    touch.clientY >= cartRect.top - threshold &&
    touch.clientY <= cartRect.bottom + threshold
  );
}

function isMouseOverCart(mouseEvent) {
  const cartRect = cart.getBoundingClientRect();
  const threshold = 100;

  return (
    mouseEvent.clientX >= cartRect.left - threshold &&
    mouseEvent.clientX <= cartRect.right + threshold &&
    mouseEvent.clientY >= cartRect.top - threshold &&
    mouseEvent.clientY <= cartRect.bottom + threshold
  );
}

// 7. Обработка добавления товара в корзину
function handleDrop(product) {
  isItemDropped = true;
  const newItem = createCartItem(product);
  cart.appendChild(newItem);
  itemCount++;

  updateProductStyles(product);
  limitCartItemsDisplay();

  // Показываем кнопку "Оплатить корзину" при добавлении 3-х или более товаров
  if (itemCount >= 3) {
    showCheckoutButton();
  }
}

// 8. Создание элемента корзины
function createCartItem(draggingElement) {
  const imgSrc = draggingElement.getAttribute("src");
  const newItem = document.createElement("div");
  newItem.classList.add("cart-item");

  const img = document.createElement("img");
  img.src = imgSrc;
  img.alt = draggingElement.alt;
  img.style.transform = "scale(1.45)";
  img.style.transition = "transform 0.3s ease";

  // Применяем эффекты для изображений в зависимости от их типа
  applyImageEffects(img, draggingElement.alt);

  newItem.appendChild(img);
  return newItem;
}

// 9. Применение эффектов к изображениям
function applyImageEffects(img, altText) {
  const effects = {
    вина: "rotate(2deg) translateY(5px) scale(0.8)",
    молока: "scale(1.05)",
    варенья: "rotate(2deg) translateY(5px)",
    сыра: "rotate(15deg) translateY(9px)",
    мяса: "rotate(30deg) translateY(15px) scale(0.8)",
    курицы: "translateY(15px) rotate(-30deg) scale(0.8)",
    чипсов: "scale(0.8) rotate(-40deg) translateX(-10px)",
    ананаса: "rotate(7deg) translate(8px)",
    бананов: "rotate(-27deg) translateY(6px) scale(1.05)",
    яблока: "scale(1.1) translateY(5px)",
    зелени: "rotate(15deg) translateY(8px) translateX(3px)",
  };

  for (const [key, value] of Object.entries(effects)) {
    if (altText.includes(key)) {
      img.style.transform += ` ${value}`; // Применяем эффекты
    }
  }
}

// 10. Обновление стилей продукта
function updateProductStyles(product) {
  product.classList.add("in-cart");
  product.classList.remove("dragging");
  product.style.visibility = "hidden";
}

// 11. Сброс стилей продукта
function resetProductStyles(product) {
  product.classList.remove("dragging");
  product.style.visibility = "visible";
  product.style.transform = "";
}

// 12. Ограничение отображения товаров в корзине
function limitCartItemsDisplay() {
  const cartItems = cart.querySelectorAll(".cart-item");
  // Отображаем только последние три добавленных элемента
  cartItems.forEach((item, index) => {
    item.style.display = index >= cartItems.length - 3 ? "block" : "none";
  });
}

// 13. Показ кнопки "Оплатить корзину"
function showCheckoutButton() {
  if (!document.querySelector(".checkout-button")) {
    const checkoutButton = document.createElement("button");
    checkoutButton.textContent = "Оплатить корзину";
    checkoutButton.className = "checkout-button blinking";
    checkoutButton.onclick = () =>
      (window.location.href = "https://lavka.yandex.ru/");
    cart.appendChild(checkoutButton);
  }
}

// 14. Инициализация анимации при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  products.forEach((product, index) => {
    product.style.animationDelay = `${index * 0.2}s`; // Устанавливаем задержку для каждого продукта
    product.classList.add("fade-in"); // Добавляем класс для анимации
  });
});
