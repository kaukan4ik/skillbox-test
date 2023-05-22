const { userCreateSession, userValidate } = require("../services/user");

const express = require("express");
const login = express.Router();

login.post("/", async (req, res) => {
  console.log(req.body);
  let userId = await userValidate(req.body.username, req.body.password);
  if (userId) {
    const session = await userCreateSession(userId);
    res.cookie("session", session, { httpOnly: true }); //куки для браузера
    return res.redirect("./");
  } else {
    return res.redirect("./?authError=true");
  }
});

module.exports = login;
