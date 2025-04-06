"use strict";
const express = require("express");
const router = express.Router();
const controller = require("../app/controllers/BookingController");
const{authenticateUser} = require("../app/middleware/authentication");


router.post("/book",authenticateUser, controller.bookTicket);

router.post("/cancel", authenticateUser, controller.cancelBooking);


module.exports = router;