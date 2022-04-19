const url = "http://localhost:5000/products";
const clothingSection = document.querySelector("#clothing");

function getUser() {
  axios
    .get(url)
    .then((response) => {
      const data = response.data;

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
    })
    .catch((error) => console.log(error));
}

getUser();
