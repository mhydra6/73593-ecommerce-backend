const Order = require("../models/order.model");

exports.createOrder = async (req, res) => {
  try {
    const { userName, products, total } = req.body;
    const userId = req.user._id;

    // ✅ Validación de datos mínimos
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "La orden debe incluir al menos un producto." });
    }

    if (!userName || total === undefined) {
      return res.status(400).json({ message: "Faltan campos obligatorios en la orden." });
    }

    // ✅ Crear y guardar nueva orden
    const newOrder = new Order({ userId, userName, products, total });
    await newOrder.save();

    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ message: "Error al crear orden", error: err.message });
  }
};
{/*iddqd*/}
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email") // Trae nombre y mail del usuario
      .populate("products.productId", "title price"); // Esto solo funcionará si productId es tipo ObjectId con ref

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener órdenes", error: err.message });
  }
};
