const products = document.querySelectorAll(".product");
const cart = document.querySelector(".cart");
let itemCount = 0;
let isItemDropped = false;
let touchStartX, touchStartY;

// Проверка на сенсорное устройство
function isTouchDevice() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

// Универсальные обработчики для сенсорных устройств и десктопов
products.forEach((product) => {
  if (isTouchDevice()) {
    // Для сенсорных устройств
    product.addEventListener("touchstart", (e) => {
      const touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      product.classList.add("dragging");
      isItemDropped = false;
    });

    product.addEventListener(
      "touchmove",
      (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        // Перемещение с использованием CSS-трансформаций
        product.style.transform = `translate(${
          touch.clientX - touchStartX
        }px, ${touch.clientY - touchStartY}px)`;
      },
      { passive: false }
    );

    product.addEventListener("touchend", (e) => {
      const touch = e.changedTouches[0];
      if (isTouchOverCart(touch)) {
        handleDrop(product);
      } else {
        resetProductStyles(product);
      }
      product.classList.remove("dragging");
      product.style.transform = "";
    });
  } else {
    // Обработка для десктопов и touchpad
    product.addEventListener("mousedown", (e) => {
      e.preventDefault();
      touchStartX = e.clientX;
      touchStartY = e.clientY;
      product.classList.add("dragging");
      isItemDropped = false;

      // Обработчики для перемещения
      const mouseMoveHandler = (eMove) => {
        product.style.transform = `translate(${
          eMove.clientX - touchStartX
        }px, ${eMove.clientY - touchStartY}px)`;
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
    });
  }
});

// Проверка, находится ли элемент над корзиной при касании
function isTouchOverCart(touch) {
  const cartRect = cart.getBoundingClientRect();
  const threshold = 100; // Установим порог в 100 пикселей

  return (
    touch.clientX >= cartRect.left - threshold &&
    touch.clientX <= cartRect.right + threshold &&
    touch.clientY >= cartRect.top - threshold &&
    touch.clientY <= cartRect.bottom + threshold
  );
}

// Проверка, находится ли мышь над корзиной
function isMouseOverCart(mouseEvent) {
  const cartRect = cart.getBoundingClientRect();
  const threshold = 100; // Установим порог в 100 пикселей

  return (
    mouseEvent.clientX >= cartRect.left - threshold &&
    mouseEvent.clientX <= cartRect.right + threshold &&
    mouseEvent.clientY >= cartRect.top - threshold &&
    mouseEvent.clientY <= cartRect.bottom + threshold
  );
}

function handleDrop(product) {
  isItemDropped = true;
  const newItem = createCartItem(product);

  // Добавляем новый товар в корзину
  cart.appendChild(newItem);
  itemCount++;

  updateProductStyles(product);

  // Обновляем отображение товаров в корзине
  limitCartItemsDisplay();

  // Показываем кнопку "Оплатить корзину" при добавлении 3-х или более товаров
  if (itemCount >= 3) {
    showCheckoutButton();
  }
}

function resetProductStyles(product) {
  product.classList.remove("dragging");
  product.style.visibility = "visible";
  product.style.transform = "";
}

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

function applyImageEffects(img, altText) {
  const effects = {
    вина: "rotate(2deg) translateY(5px) scale(0.8)",
    молока: "scale(1.05)",
    варенья: "rotate(2deg) translateY(5px)",
    сыра: "rotate(15deg) translateY(9px)",
    мяса: "rotate(30deg) translateY(15px) scale(0.8)",
    курицы: " translateY(15px) rotate(-30deg)  scale(0.8)",
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

function updateProductStyles(product) {
  product.classList.add("in-cart");
  product.classList.remove("dragging");
  product.style.visibility = "hidden";
}

function limitCartItemsDisplay() {
  const cartItems = cart.querySelectorAll(".cart-item");

  // Отображаем только последние три добавленных элемента
  cartItems.forEach((item, index) => {
    item.style.display = index >= cartItems.length - 3 ? "block" : "none";
  });
}

function showCheckoutButton() {
  if (!document.querySelector(".checkout-button")) {
    const checkoutButton = document.createElement("button");
    checkoutButton.textContent = "Оплатить корзину";
    checkoutButton.className = "checkout-button";
    checkoutButton.classList.add("blinking");
    checkoutButton.onclick = () =>
      (window.location.href = "https://lavka.yandex.ru/");
    cart.appendChild(checkoutButton);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const products = document.querySelectorAll(".product");
  products.forEach((product, index) => {
    product.style.animationDelay = `${index * 0.2}s`; // Устанавливаем задержку для каждого продукта
    product.classList.add("fade-in"); // Добавляем класс для анимации
  });
});
