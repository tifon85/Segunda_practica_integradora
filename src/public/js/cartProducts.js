const socketClient = io();

const productsView = document.getElementById("productsView");

const idCart='6567ddc40367dfc87c55ad4b'

socketClient.emit("getCartProducts", (idCart))

socketClient.on("productsCart", (prod) => {
    const productsCart = prod
      .map((p) => {
        return `<p>cantidad:${p.quantity} - Nombre:${p.product.title} - Precio:${p.product.price}</p>`;
      })
      .join(" ");
      productsView.innerHTML = productsCart;
});