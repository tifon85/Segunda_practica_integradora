const socketClient = io();

const addToCart = document.getElementById("addToCart");
const inputIdProduct = document.getElementById("id");
const productsView = document.getElementById("productsView");

let cart
Swal.fire({
  title: "Welcome!",
  confirmButtonText: "Enter",
}).then(() => {
  socketClient.emit("newCart");
});

socketClient.on("cartID", (idCart) => {
  cart=idCart
});

addToCart.onsubmit = (e) => {
  e.preventDefault();
  const infoProduct = {
    idCart: cart,
    idProd: inputIdProduct,
  }
  inputIdProduct.innerText = "";
  socketClient.emit("addProduct", infoProduct);
};

