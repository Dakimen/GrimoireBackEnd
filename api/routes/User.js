const express = require("express");
const router = express.Router();

const UserController = require("../controllers/User");

router.post("/auth/signup", UserController.registerUser);
router.post("/auth/login", UserController.loginUser);

module.exports = router;
