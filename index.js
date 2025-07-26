require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

const PORT = 3000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Conexión exitosa a la base de datos");
    app.listen(PORT, () => {
      console.log(`El servidor está corriendo en el puerto ${PORT}`);
    });
  })
  .catch(error => {
    console.error("Error al conectar a la base de datos:", error);
  });
