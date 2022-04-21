// for (var i = 0; i < data.length; i++) {
//   const div = document.createElement("div");
//   div.setAttribute("id", "product");

//   div.innerHTML = `
//               <img src="${data[i].image}" alt="" />
//               <h3>${data[i].name}</h3>
//               <p class="price">R$ ${data[i].price}</p>
//               <p class="portion">até ${data[i].parcelamento[0]}x de R$${data[i].parcelamento[1]}</p>
//               <a href="#">COMPRAR</a>
//             `;

//   clothingSection.appendChild(div);
// }

// const containerClothingSection = document.querySelector(".container-clothing");
const url = "http://localhost:5000/products";
const clothingSection = document.querySelector("#clothing");
const checkColors = document.querySelectorAll(".filters .shirts-op");
const checkSizes = document.querySelectorAll(".size");

const collection = [];
const eventsColors = [];

checkColors.forEach((button) => {
  button.addEventListener("click", (event) => {
    const eventValue = event.target.value;

    if (button.checked) {
      eventsColors.push(eventValue);

      getUser();
    } else {
      removeProductFilter(eventValue);
      console.log(collection);
    }
  });
});

function removeProductFilter(eventValue) {
  for (let i = 0; i < collection.length; i++) {
    if (collection[i].color === eventValue) {
      console.log(collection[i]);
      collection.splice(i, 1);
      i = -1;
    }
  }
}

function insertFilter(data) {
  for (let i = 0; i < eventsColors.length; ++i) {
    data.filter((element) => {
      if (element.color === eventsColors[i]) {
        collection.push({
          id: element.id,
          name: element.name,
          parcelamento: element.parcelamento,
          color: element.color,
          image: element.image,
          size: element.size,
          date: element.date,
        });
      }
    });
  }
  while (eventsColors.length) {
    eventsColors.pop();
  }
}

function getUser() {
  axios
    .get(url)
    .then((response) => {
      const data = response.data;
      insertFilter(data);

      console.log(collection);
    })
    .catch((error) => console.log(error));
}

getUser();
