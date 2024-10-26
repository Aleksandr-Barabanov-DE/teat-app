// dragAndDrop.js
let touchStartX = 0;
let touchStartY = 0;

import { handleDrop, resetProductStyles } from "./cartUtils.js";

export function initializeDragAndDrop(products, cart) {
  products.forEach((product) => {
    addDragEvents(product, cart);
  });
}

// Checks if the device is touch-capable
function isTouchDevice() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

// Adds appropriate event listeners based on the device type
function addDragEvents(product, cart) {
  if (isTouchDevice()) {
    addTouchEvents(product, cart);
  } else {
    addMouseEvents(product, cart);
  }
}

// Adds touch events
function addTouchEvents(product, cart) {
  product.addEventListener("touchstart", (e) => startTouchDrag(e, product));
  product.addEventListener("touchmove", (e) => moveTouchDrag(e, product), {
    passive: false,
  });
  product.addEventListener("touchend", (e) => endTouchDrag(e, product, cart));
}

// Adds mouse events
function addMouseEvents(product, cart) {
  product.addEventListener("mousedown", (e) =>
    startMouseDrag(e, product, cart)
  );
}

// Functions for touch drag-and-drop
function startTouchDrag(e, product) {
  const touch = e.touches[0];
  product.classList.add("dragging");
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
}

function moveTouchDrag(e, product) {
  e.preventDefault();
  const touch = e.touches[0];
  product.style.transform = `translate(${touch.clientX - touchStartX}px, ${
    touch.clientY - touchStartY
  }px)`;
}

function endTouchDrag(e, product, cart) {
  const touch = e.changedTouches[0];
  if (isTouchOverCart(touch, cart)) {
    handleDrop(product, cart);
  } else {
    resetProductStyles(product);
  }
}

// Functions for mouse drag-and-drop
function startMouseDrag(e, product, cart) {
  e.preventDefault();
  touchStartX = e.clientX;
  touchStartY = e.clientY;
  product.classList.add("dragging");

  const mouseMoveHandler = (eMove) => {
    product.style.transform = `translate(${eMove.clientX - touchStartX}px, ${
      eMove.clientY - touchStartY
    }px)`;
  };

  const mouseUpHandler = (eEnd) => {
    if (isMouseOverCart(eEnd, cart)) {
      handleDrop(product, cart);
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

// Helper functions for checking if item is over cart
function isTouchOverCart(touch, cart) {
  const cartRect = cart.getBoundingClientRect();
  const padding = 100;

  return (
    touch.clientX >= cartRect.left - padding &&
    touch.clientX <= cartRect.right + padding &&
    touch.clientY >= cartRect.top - padding &&
    touch.clientY <= cartRect.bottom + padding
  );
}

function isMouseOverCart(mouseEvent, cart) {
  const cartRect = cart.getBoundingClientRect();
  const padding = 100;

  return (
    mouseEvent.clientX >= cartRect.left - padding &&
    mouseEvent.clientX <= cartRect.right + padding &&
    mouseEvent.clientY >= cartRect.top - padding &&
    mouseEvent.clientY <= cartRect.bottom + padding
  );
}
