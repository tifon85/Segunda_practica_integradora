const socketClient = io();

const addToCart = document.getElementById("addToCart");
const inputIdProduct = document.getElementById("idProduct");
const productsView = document.getElementById("productsView");

//const cart = '657a56cf872c8c6beb4eea99'

/*socketClient.emit("newCart");

socketClient.on("cartID", (idCart) => {
  cart
});*/

addToCart.onsubmit = (e) => {
  e.preventDefault();
  console.log(inputIdProduct)
  const infoProduct = {
    idCart: '657a56cf872c8c6beb4eea99',
    idProd: '6566a95d9ecbe5bbe9189b6c',
  }
  socketClient.emit("addProduct", infoProduct);
};