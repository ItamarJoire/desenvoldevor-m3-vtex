const url = "http://localhost:5000/products";
const clothingSection = document.querySelector("#clothing");
const checkColors = document.querySelectorAll(".filters .shirts-op");
const checkSizes = document.querySelectorAll(".size");

const buttonFilter = document.querySelector("#btn-filter");
const buttonCloseFilter = document.querySelector("#close-filter");
const modalFilter = document.querySelector(".modal-filter");

// Abrir o menu FILTER mobile
buttonFilter.addEventListener("click", () => {
  console.log(modalFilter);
  modalFilter.classList.add("active-modal-filter");
});

buttonCloseFilter.addEventListener("click", () => {
  modalFilter.classList.remove("active-modal-filter");
});

const collection = [];
const eventsColors = [];

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

// Checa se algum FILTRO DE TAMANHO foi selecionado
checkSizes.forEach((button) => {
  button.addEventListener("click", (event) => {
    const eventValue = event.target.value;
    if (button.checked) {
      console.log("Pressionado");
    } else {
      console.log("Removido");
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
    .get(url)
    .then((response) => {
      const data = response.data;

      if (eventsColors.length == 0) {
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
        <a href="#">COMPRAR</a>
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
          <a href="#">COMPRAR</a>
        `;

      clothingSection.appendChild(div);
    }
  },
};
