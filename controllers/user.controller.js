const User = require("../models/user.model");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRounds = 10;
const secret = process.env.JWT_SECRET;

// Obtener todos los usuarios
async function getUsers(req, res) {
  try {
    const users = await User.find().select({ password: 0, __v: 0 });

    if (users.length === 0) {
      return res.status(404).send({ message: "No se han encontrado usuarios" });
    }

    return res.status(200).send({
      message: "Usuarios obtenidos correctamente",
      users,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Error al obtener usuarios" });
  }
}

// Crear nuevo usuario
async function createUser(req, res) {
  console.log("Req.body", req.body);
  try {
    const user = new User(req.body);

    // Hashear contraseña
    if (user.password) {
      const hashedPassword = bcrypt.hashSync(user.password, saltRounds);
      user.password = hashedPassword;
    }

    const userSaved = await user.save();
    return res.status(201).send({
      message: "Usuario creado correctamente",
      user: userSaved,
    });
  } catch (error) {
    console.error(error);
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send({ message: "Error de validación" });
    }
    return res.status(500).send({ message: "El usuario no se pudo crear" });
  }
}

// Obtener usuario por ID
async function getUserById(req, res) {
  try {
    const id = req.params.id;
    const user = await User.findById(id).select({ password: 0, __v: 0 });

    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado" });
    }

    return res.status(200).send({
      message: "Usuario obtenido correctamente",
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Error al obtener usuario" });
  }
}

// Eliminar usuario por ID
async function deleteUserById(req, res) {
  try {
    const id = req.params.id;
    const userDeleted = await User.findByIdAndDelete(id);

    if (!userDeleted) {
      return res.status(404).send({ message: "Usuario no encontrado" });
    }

    return res.status(200).send({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Error al eliminar el usuario" });
  }
}

// Actualizar usuario por ID
async function updateUserById(req, res) {
  try {
    const id = req.params.id;

    // Validación para permitir que un usuario solo edite su propia cuenta
    if (req.user._id !== id && req.user.role !== "admin") {
      return res.status(403).send({ message: "No tiene permiso para actualizar este usuario" });
    }

    const userData = req.body;

    // Nunca permitir que se actualice la contraseña directamente por aquí
    delete userData.password;

    const userExist = await User.findById(id);
    if (!userExist) {
      return res.status(404).send({ message: "Usuario no encontrado" });
    }

    const userUpdated = await User.findByIdAndUpdate(id, userData, { new: true }).select({
      password: 0,
      __v: 0,
    });

    return res.status(200).send({
      message: "Usuario actualizado correctamente",
      user: userUpdated,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Error al actualizar el usuario" });
  }
}

// Login de usuario
async function loginUser(req, res) {
  console.log("Login user controller called");
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ message: "Email y contraseña son obligatorios" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).send({ message: "Usuario o contraseña incorrectos" });
    }

    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      return res.status(401).send({ message: "Usuario o contraseña incorrectos" });
    }

    const token = jwt.sign(user.toJSON(), secret, { expiresIn: "1h" });
    console.log("Token generado:", token);

    // Eliminar la contraseña antes de enviar
    user.password = undefined;

    return res.status(200).send({
      message: "Inicio de sesión exitoso",
      user,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Error al iniciar sesión" });
  }
}

module.exports = {
  getUsers,
  createUser,
  getUserById,
  deleteUserById,
  updateUserById,
  loginUser,
};
