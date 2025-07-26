const express = require('express');
const app = express();
const cors = require("cors");

const userRoutes = require("./routes/user.routes.js");
const productRoutes = require("./routes/product.routes.js");
const orderRoutes = require("./routes/order.routes.js"); // ✅ EXTENSIÓN CORRECTA

// Middlewares
app.use(express.json());
app.use(cors());

// Rutas
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/api/orders", orderRoutes);

module.exports = app;
