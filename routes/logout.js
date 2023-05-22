const { userDeleteSession } = require("../services/user");

const express = require("express");
const logout = express.Router();

logout.get("/", async (req, res) => {
  if (req.user) {
    await userDeleteSession(req.session);
    delete req.cookies["session"];
  }
  return res.redirect("./");
});

module.exports = logout;
