const express = require("express");
const users = require('cors');
const  bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const userController = require('../controllers/userController.js');
process.env.SECRET_KEY = 'secret';
var router = express.Router();
router.get("/register", userController.register);
router.get("/verif/:email", userController.emailVerification);
router.get("/login", userController.login);
router.get("/refresh", userController.refresh);
router.get("/sendForgotPassword", userController.sendMailforgotPassword);
router.get("/forgotpassword/:id/:token", userController.forgotpassword);
router.get("/contact", userController.Contact);
router.get("/loginsocial", userController.authWithSocialMedia)





const jwt = require('jsonwebtoken');

























