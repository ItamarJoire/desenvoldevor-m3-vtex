const URL = "http://localhost:5000/products";

const buttonFilter = document.querySelector("#btn-filter");
const buttonFilterOrder = document.querySelector("#btn-order");

const clothingSection = document.querySelector("#clothing");
const checkColors = document.querySelectorAll(".filters .shirts-op");

const buttonCloseFilter = document.querySelector("#close-filter");
const buttonShowFilterColors = document.querySelector("#show-colors");

const buttonCloseOrder = document.querySelector("#close-filter-order");
const buttonShowOrderDesktop = document.querySelector("#toggle-order-desktop");

const optionsOrderDesktop = document.querySelector(".order");
const optionOrderRecent = document.querySelector("#order-recent");
const optionOrderRecentDesktop = document.querySelector(
  "#order-recent-desktop"
);

const modalFilter = document.querySelector(".modal-filter-ctp");
const menuColor = document.querySelector("#menu-color");
const menuOrder = document.querySelector("#menu-order");

const collection = [];
const eventsColors = [];

buttonFilterOrder.addEventListener("click", () => {
  menuOrder.classList.add("active-filter-orders");
});

buttonCloseOrder.addEventListener("click", () => {
  menuOrder.classList.remove("active-filter-orders");
});

// Mostra as opções de ordenação DESKTOP
buttonShowOrderDesktop.addEventListener("click", () => {
  buttonShowOrderDesktop.classList.toggle("active-rotation-desktop");
  console.log(buttonShowOrderDesktop);
  if (buttonShowOrderDesktop.classList.contains("active-rotation-desktop")) {
    optionsOrderDesktop.classList.add("active-options");
  } else {
    optionsOrderDesktop.classList.remove("active-options");
  }
});

// Ordena para o Mais recente DESKTOP
optionOrderRecentDesktop.addEventListener("click", () => {
  optionOrderRecentDesktop.classList.toggle("active-order-desktop");
  if (optionOrderRecentDesktop.classList.contains("active-order-desktop")) {
    optionOrderRecent.classList.add("active-order");
  } else {
    optionOrderRecent.classList.remove("active-order");
  }
  if (collection.length > 0) {
    collection.sort(function (a, b) {
      if (a.date < b.date) {
        return 1;
      }
      if (a.date > b.date) {
        return -1;
      }
      return 0;
    });
    structsProducts.filteredProducts();
  } else {
    getUser();
  }
});

// Ordena para o Mais recente MOBILE
optionOrderRecent.addEventListener("click", () => {
  optionOrderRecent.classList.toggle("active-order");
  if (optionOrderRecent.classList.contains("active-order")) {
    optionOrderRecentDesktop.classList.add("active-order-desktop");
  } else {
    optionOrderRecentDesktop.classList.remove("active-order-desktop");
  }
  if (optionOrderRecent.classList.contains("active-order")) {
    if (collection.length > 0) {
      collection.sort(function (a, b) {
        if (a.date < b.date) {
          return 1;
        }
        if (a.date > b.date) {
          return -1;
        }
        return 0;
      });

      structsProducts.filteredProducts();
    } else {
      getUser();
    }
  } else {
    getUser();
  }
});

// Mostrar opções do FILTRO CORES
buttonShowFilterColors.addEventListener("click", () => {
  buttonShowFilterColors.classList.toggle("active-rotation");
  if (buttonShowFilterColors.classList.contains("active-rotation")) {
    menuColor.classList.add("active-filter-colors");
  } else {
    menuColor.classList.remove("active-filter-colors");
  }
});

// Abrir o menu FILTRO mobile
buttonFilter.addEventListener("click", () => {
  modalFilter.classList.add("active-modal-filter");
});

// Fechar o menu FILTRO mobile
buttonCloseFilter.addEventListener("click", () => {
  modalFilter.classList.remove("active-modal-filter");
  menuColor.classList.remove("active-filter-colors");
  buttonShowFilterColors.classList.remove("active-rotation");
});

// Checa se algum FILTRO DE COR foi selecionado
checkColors.forEach((button) => {
  button.addEventListener("click", (event) => {
    const eventValue = event.target.value;

    if (button.checked) {
      eventsColors.push(eventValue);
      getUser();
    } else {
      removeProductFilter(eventValue);
    }
  });
});

// Remove os produtos correspondentes quando se tira a opção de filtro de cor
function removeProductFilter(eventValue) {
  for (let i = 0; i < collection.length; i++) {
    if (collection[i].color === eventValue) {
      collection.splice(i, 1);
      i = -1;
    }
  }

  for (let i = 0; i < eventsColors.length; i++) {
    if (eventsColors[i] === eventValue) {
      eventsColors.splice(i, 1);
    }
  }

  while (collection.length) {
    collection.pop();
  }

  getUser();
}

function insertFilter(data) {
  // Limpando o array de filtros
  while (collection.length) {
    collection.pop();
  }

  // Inserindo no array de filtros as estruturas filtradas
  for (let i = 0; i < eventsColors.length; i++) {
    data.filter((element) => {
      if (element.color === eventsColors[i]) {
        collection.push({
          id: element.id,
          name: element.name,
          price: element.price,
          parcelamento: element.parcelamento,
          color: element.color,
          image: element.image,
          size: element.size,
          date: element.date,
        });
      }
    });
  }
}

// Captura os dados da API
function getUser() {
  axios
    .get(URL)
    .then((response) => {
      const data = response.data;

      if (eventsColors.length == 0) {
        if (
          optionOrderRecent.classList.contains("active-order") ||
          optionOrderRecentDesktop.classList.contains("active-order-desktop")
        ) {
          data.sort(function (a, b) {
            if (a.date < b.date) {
              return 1;
            }
            if (a.date > b.date) {
              return -1;
            }
            return 0;
          });
        }

        structsProducts.productsAll(data);
        return;
      } else {
        insertFilter(data);
      }

      structsProducts.filteredProducts();
    })
    .catch((error) => console.log(error));
}

getUser();

// Objeto que contém os métodos que mostra os produtos na view
const structsProducts = {
  // Todos os produtos da API
  productsAll(data) {
    clothingSection.innerHTML = "";
    for (var i = 0; i < data.length; i++) {
      const div = document.createElement("div");
      div.setAttribute("id", "product");

      div.innerHTML = `
        <img src="${data[i].image}" alt="" />
        <h3>${data[i].name}</h3>
        <p class="price">R$ ${data[i].price}</p>
        <p class="portion">até ${data[i].parcelamento[0]}x de R$${data[i].parcelamento[1]}</p>
        <a class="purchase" href="#">COMPRAR</a>
      `;

      clothingSection.appendChild(div);
    }
  },

  // Captura dos produtos com os filtros
  filteredProducts() {
    clothingSection.innerHTML = "";
    for (var i = 0; i < collection.length; i++) {
      const div = document.createElement("div");
      div.setAttribute("id", "product");

      div.innerHTML = `
          <img src="${collection[i].image}" alt="" />
          <h3>${collection[i].name}</h3>
          <p class="price">R$ ${collection[i].price}</p>
          <p class="portion">até ${collection[i].parcelamento[0]}x de R$${collection[i].parcelamento[1]}</p>
          <a class="purchase" href="#">COMPRAR</a>
        `;

      clothingSection.appendChild(div);
    }
  },
};
