const express = require ("express");
const router = express.Router ();
const productController = require ("../controllers/product.controller");
const auth=require("../middlewares/auth.middleware")
const isAdmin = require("../middlewares/admin.middleware");


//Methods for product management
router.post("/", (req, res, next) => {
  console.log("📥 Petición POST recibida en /products");
  next();
}, productController.createProduct);

router.get("/", productController.getProducts);


// Obtener producto por ID (público)
router.get("/:id", productController.getProductsById);

// Actualizar producto por ID (solo admin)
router.put("/:id", [auth, isAdmin], productController.updateProductsById);

// Eliminar producto por ID (solo admin)
router.delete("/:id", [auth, isAdmin], productController.deleteProductById);

module.exports = router;