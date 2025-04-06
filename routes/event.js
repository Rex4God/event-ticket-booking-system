"use strict";
const express = require("express");
const router = express.Router();
const controller = require("../app/controllers/EventController");
const { authenticateUser } = require("../app/middleware/authentication");


router.post("/initialize", authenticateUser,controller.createEvent);


router.get("/status/:eventId", controller.getEventStatus);



module.exports = router;