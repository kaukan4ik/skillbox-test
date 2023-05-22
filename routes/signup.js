const { userAddNew, userCreateSession, userExists } = require("../services/user");
const express = require("express");
const signup = express.Router();


signup.post("/", async (req, res) => {
  let { username, password } = req.body;

  if (username && password) {
    if (await userExists(username)) {
      return res.redirect(`./?authError=User ${username} already exists`);
    }

    let userId = await userAddNew(username, password);
    const session = await userCreateSession(userId);
    res.cookie("session", session, { httpOnly: true });
    return res.redirect("./");
  } else {
    return res.redirect(`/?authError=username or password must not be empty`);
  }
});

module.exports = signup;
