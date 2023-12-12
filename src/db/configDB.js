import mongoose from "mongoose";

export const URI =
  "mongodb+srv://ntenconi:Gyb5kiAGuKHuOEcz@cluster0.7cnqumt.mongodb.net/ecommerce?retryWrites=true&w=majority";

mongoose
  .connect(URI)
  .then(() => console.log("Conectado a la base de datos"))
  .catch((error) => console.log(error));