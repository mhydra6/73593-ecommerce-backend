const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const auth = require("../middlewares/auth.middleware");

// Crear orden (requiere autenticación)
router.post("/", auth, orderController.createOrder);

// Obtener todas las órdenes (público o admin, según necesites)
router.get("/", orderController.getAllOrders);

module.exports = router;