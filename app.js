"use strict";
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const authRouter = require("./routes/user");
const eventRouter = require("./routes/event");
const bookingRouter = require("./routes/booking");
const app = express();
const rateLimit = require("express-rate-limit");
const{requestLogger} = require("./app/utils/logger");


const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100, 
	standardHeaders: true, 
	legacyHeaders: false,
    validate: false
})



app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(limiter)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);



app.get('/', (req, res) => {
  res.json({
    message: "🦄🌈✨👋🌎🌍🌏✨🌈🦄",
  });
});


//Route Middleware
app.use('/v1/auth', authRouter);
app.use('/v1/event', eventRouter);
app.use('/v1/booking', bookingRouter);




const port = process.env.PORT || 9000;

app.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
});
