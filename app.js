"use strict";

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");

const webhookRoutes = require("./src/routes/webhook-routes");

const app = express();

// Middleware setup
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressSession({
  secret: process.env.EXPRESS_SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
}));

app.use("/webhook", webhookRoutes);

const port = process.env.PORT || 1337;

app.listen(port, () => console.log(`webhook listening on port ${port}`));