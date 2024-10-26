let itemCount = 0;

// Function to handle product drop into the cart
export function handleDrop(product, cart) {
  const newItem = createCartItem(product);
  cart.appendChild(newItem);
  itemCount++;

  updateProductStyles(product);
  limitCartItemsDisplay(cart);

  // Show checkout button when 3 or more items are added
  if (itemCount >= 3) {
    showCheckoutButton(cart);
  }
}

// Function to create a cart item element
export function createCartItem(draggingElement) {
  const imgSrc = draggingElement.getAttribute("src");
  const newItem = document.createElement("div");
  newItem.classList.add("cart-item");

  const img = document.createElement("img");
  img.src = imgSrc;
  img.alt = draggingElement.alt;
  img.style.transform = "scale(1.45)";
  img.style.transition = "transform 0.3s ease";

  applyImageEffects(img, draggingElement.alt);

  newItem.appendChild(img);
  return newItem;
}

// Function to apply specific effects to product images
export function applyImageEffects(img, altText) {
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
      img.style.transform += ` ${value}`;
    }
  }
}

// Function to update styles of product once added to cart
export function updateProductStyles(product) {
  product.classList.add("in-cart");
  product.classList.remove("dragging");
  product.style.visibility = "hidden";
}

// Function to reset styles if product drag ends outside cart
export function resetProductStyles(product) {
  product.classList.remove("dragging");
  product.style.visibility = "visible";
  product.style.transform = "";
}

// Function to limit the display of cart items to the last three
export function limitCartItemsDisplay(cart) {
  const cartItems = cart.querySelectorAll(".cart-item");
  cartItems.forEach((item, index) => {
    item.style.display = index >= cartItems.length - 3 ? "block" : "none";
  });
}

// Function to display the "Checkout" button after 3 items
export function showCheckoutButton(cart) {
  if (!document.querySelector(".checkout-button")) {
    const checkoutButton = document.createElement("button");
    checkoutButton.textContent = "Оплатить корзину";
    checkoutButton.className = "checkout-button blinking";
    checkoutButton.onclick = () =>
      (window.location.href = "https://lavka.yandex.ru/");
    cart.appendChild(checkoutButton);
  }
}
