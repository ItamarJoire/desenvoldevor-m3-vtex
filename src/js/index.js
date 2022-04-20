const url = "http://localhost:5000/products";
const containerClothingSection = document.querySelector(".container-clothing");
const clothingSection = document.querySelector("#clothing");
const checkColors = document.querySelectorAll(".filters .shirts-op");

const optionsColors = [];

checkColors.forEach((button) => {
  button.addEventListener("click", (event) => {
    if (button.checked) {
      handleClick(event);
    }
    if (!button.checked) {
      console.log("Entrou no REMOVE");
      handleClickRemove(event);
    }
  });
});

function handleClick(event) {
  eventValue = event.target.value;
  optionsColors.push(eventValue);

  console.log(optionsColors);

  getUser();
}

function handleClickRemove(event) {
  eventValue = event.target.value;
  for (var i = 0; i <= optionsColors.length; i++) {
    if (optionsColors[i] == eventValue) {
      console.log("Array com a cor: " + optionsColors[i]);
      optionsColors.splice(i, 1);
      clothingSection.innerHTML = "";
      console.log("Array SEM a cor: " + optionsColors[i]);
      getUser();
    }
  }
}

function getUser() {
  axios
    .get(url)
    .then((response) => {
      const data = response.data;
      console.log(data);
      if (optionsColors.length >= 1) {
        if (optionsColors.length == 1) {
          clothingSection.innerHTML = "";
        }

        call(data);
      } else {
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
      }
    })
    .catch((error) => console.log(error));
}

function call(data) {
  clothingSection.innerHTML = "";
  for (var i = 0; i <= optionsColors.length; i++) {
    for (var j = 0; j < data.length; j++) {
      if (optionsColors[i] === data[j].color) {
        const div = document.createElement("div");
        div.setAttribute("id", "product");

        div.innerHTML = `
            <img src="${data[j].image}" alt="" />
            <h3>${data[j].name}</h3>
            <p class="price">R$ ${data[j].price}</p>
            <p class="portion">até ${data[j].parcelamento[0]}x de R$${data[j].parcelamento[1]}</p>
            <a href="#">COMPRAR</a>
        `;

        clothingSection.appendChild(div);
      }
    }
  }
}

getUser();
