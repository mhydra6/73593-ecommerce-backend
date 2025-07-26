const Product = require("../models/product.model");
const mongoose = require("mongoose");

async function createProduct(req, res) {
  console.log("BODY RECIBIDO:", req.body); 

  try {
    const product = new Product(req.body);
    const productSaved = await product.save();
    return res.status(201).send({
      message: "Producto creado correctamente",
      product: productSaved,
    });
  } catch (error) {
    console.log(error);
    if (error instanceof mongoose.Error.ValidationError) {
      return res
        .status(400)
        .send({ message: "Los datos enviados no son correctos" });
    }
    return res
      .status(500)
      .send({ message: "El producto no se ha podido crear" });
  }
}

async function getProducts(req, res) {
  const cantProductos = req.query.limit || 10;

  try {
    const products = await Product.find()
      .select({ __v: 0 })
      .sort({ price: 1 })
      .collation({ locale: "es" })
      .limit(cantProductos);

    const productsFormatted = products.map((product) => {
      const productObj = product.toObject();
      productObj.id = productObj._id;
      delete productObj._id;
      return productObj;
    });

    return res.status(200).send({
      message: "Productos obtenidos correctamente",
      products: productsFormatted,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Error al obtener productos" });
  }
}

async function getProductsById(req, res) {
  try {
    const product = await Product.findById(req.params.id).select({ __v: 0 });

    if (!product) {
      return res.status(404).send({ message: "Producto no encontrado" });
    }

    const productObj = product.toObject();
    productObj.id = productObj._id;
    delete productObj._id;

    return res.status(200).send({
      message: "Producto obtenido correctamente",
      product: productObj,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Error al obtener el producto" });
  }
}

async function updateProductsById(req, res) {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select({ __v: 0 });

    if (!updatedProduct) {
      return res.status(404).send({ message: "Producto no encontrado" });
    }

    return res.status(200).send({
      message: "Producto actualizado correctamente",
      product: updatedProduct,
    });
  } catch (error) {
    console.log(error);
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send({
        message: "Datos inválidos para actualizar el producto",
      });
    }
    return res
      .status(500)
      .send({ message: "Error al actualizar el producto" });
  }
}

async function deleteProductById(req, res) {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).send({ message: "Producto no encontrado" });
    }

    return res.status(200).send({
      message: "Producto eliminado correctamente",
      product: deletedProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Error al eliminar el producto" });
  }
}

module.exports = {
  createProduct,
  getProducts,
  getProductsById,
  updateProductsById,
  deleteProductById,
};
