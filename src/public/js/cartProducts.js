const socketClient = io();

const productsView = document.getElementById("productsView");

socketClient.emit("getCartProducts", (idCart))

socketClient.on("productsCart", (prod) => {
    const productsCart = prod
      .map((p) => {
        return `<p>${p.quantity}: ${p.title}</p>`;
      })
      .join(" ");
      productsView.innerHTML = productsCart;
  });