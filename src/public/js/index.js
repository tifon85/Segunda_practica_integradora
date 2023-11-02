//console.log("Probando websocket");
const socketClient = io();

const formAlta = document.getElementById("formularioAltaProducto");
const inputTitle = document.getElementById("title");
const inputDescription = document.getElementById("description");
const inputCode = document.getElementById("code");
const inputPrice = document.getElementById("price");
const inputStock = document.getElementById("stock");
const inputCategory = document.getElementById("category");
const inputThumbnails = document.getElementById("thumbnails");

formAlta.onsubmit = (e) => {
  e.preventDefault();
  const product = {
    title: inputTitle.value,
    description: inputDescription.value,
    code: inputCode.value,
    price: inputPrice.value,
    stock: inputStock.value,
    category: inputCategory.value,
    thumbnails: inputThumbnails.value,
  }
  socketClient.emit("CreateProduct", product);
};

const formBaja = document.getElementById("formularioBajaProducto");
const Id = document.getElementById("id");

formBaja.onsubmit = (e) => {
    e.preventDefault();
    const id = Id.value
    socketClient.emit("deleteId", id);
  };

  const productsView = document.getElementById("productsView");

  socketClient.on("products", (prods) => {
    const products = prods.map((p) =>{
      return `<p>title:${p.title} - code:${p.code} - id:${p._id}</p>`;
    })
    .join(" ");
    productsView.innerHTML = products;
  });
