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

socketClient.on("products", (prods) => {
  const products = prods.map((p) =>{
    return `<h3>Producto:${p.title} - stock:${p.stock} - code:${p.code} - id:${p._id}</h3>
    <form id="addToCart">
        <input type="hidden" id="id" value=${p._id}>
        <input type="submit" value="Agregar al carrito">
    </form>`;
  })
  .join(" ");
  productsView.innerHTML = products;
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

