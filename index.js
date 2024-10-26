import { createShelfSection } from "./scripts/shelf-section.js";
import { initializeDragAndDrop } from "./scripts/dragAndDrop.js";

// Initialize shelf section and query products and cart elements
createShelfSection();

const products = document.querySelectorAll(".product");
const cart = document.querySelector(".cart");

// Initialize drag-and-drop functionality with products and cart elements
initializeDragAndDrop(products, cart);

// Additional logic for initializing animations on page load
document.addEventListener("DOMContentLoaded", () => {
  products.forEach((product, index) => {
    product.style.animationDelay = `${index * 0.1}s`;
    product.classList.add("fade-in");
  });
});
