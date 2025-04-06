"use strict";
const express = require("express");
const router =express.Router();
const controller = require("../app/controllers/UserController")



router.post("/create-user", controller.createUser);


router.post("/login", controller.login)




module.exports =router