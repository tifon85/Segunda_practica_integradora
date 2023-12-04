
const socketClient = io();

const form = document.getElementById("product");
const inputMessage = document.getElementById("addProduct");

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

form.onsubmit = (e) => {
    e.preventDefault();
    const infoProduct = {
      cartid: cart,
      productid: infoProduct.value,
    };
    socketClient.emit("addProduct", infoProduct);
};