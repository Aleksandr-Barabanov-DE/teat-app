export function createShelfSection() {
  const displaySection = document.querySelector(".display");

  const shelfDiv = document.createElement("div");
  shelfDiv.classList.add("shelf");

  const rows = [
    [
      { src: "images/bottle.svg", alt: "Изображение бутылки вина" },
      { src: "images/milk.svg", alt: "Изображение упаковки молока" },
      { src: "images/jam.svg", alt: "Изображение банки варенья" },
      { src: "images/cheese.svg", alt: "Изображение куска сыра" },
    ],
    [
      { src: "images/meat.svg", alt: "Изображение кусочка мяса" },
      { src: "images/chicken.svg", alt: "Изображение курицы" },
      { src: "images/chips.svg", alt: "Изображение пачки чипсов" },
    ],
    [
      { src: "images/ananas.svg", alt: "Изображение ананаса" },
      { src: "images/bananas.svg", alt: "Изображение бананов" },
      { src: "images/apple.svg", alt: "Изображение яблока" },
      { src: "images/green.svg", alt: "Изображение зелени" },
    ],
  ];

  rows.forEach((rowImages, index) => {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("row");

    if (index === 0) rowDiv.classList.add("first-row");
    else if (index === 1) rowDiv.classList.add("second-row");
    else if (index === 2) rowDiv.classList.add("third-row");

    rowImages.forEach((imageData) => {
      const img = document.createElement("img");
      img.src = imageData.src;
      img.alt = imageData.alt;
      img.classList.add("product");
      img.draggable = true;

      rowDiv.appendChild(img);
    });

    shelfDiv.appendChild(rowDiv);
  });

  displaySection.appendChild(shelfDiv);
}

createShelfSection();
