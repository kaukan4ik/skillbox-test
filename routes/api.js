const express = require("express");
const api = express.Router();
const timers = require("./timers");
const cli = require("./cli");
const auth = require("../middlewares/auth");


api.use("/cli",cli);
api.use("/timers", auth(), timers);

module.exports = api;
