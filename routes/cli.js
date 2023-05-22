const { userCreateSession, userValidate, userDeleteSession, userAddNew, userExists } = require("../services/user");
const auth = require("../middlewares/auth");
const express = require("express");
const cli = express.Router();


//TODO  расширить проверку, сделать более подробную
const logopass = () => async (req, res, next) => {
  let { username, password } = req.body;
  if (!username || !password)
      return res.status(405).json({ error: "fields [username] or [password] are not defined" });
  next();
};




//auth user
cli.post("/login", logopass(), async (req, res) => {
  let { username, password } = req.body;

  let userId = await userValidate(username, password);
  if (userId) {
    const session = await userCreateSession(userId);
    return res.status(200).json({ session: session, message: `User ${username}  logged in successfully!` });
  } else {
    console.log(`Username ${username} login fail`)
    return res.status(401).json({ error: "Wrong username or password!" });
  }

});

//new user
cli.post("/signup", logopass(), async (req, res) => {
  let { username, password } = req.body;
  if (await userExists(username)) {
      return res.status(405).json({ error: `User ${username} already exists` });
    }
  let userId = await userAddNew(username, password);
  const session = await userCreateSession(userId);
  return res.status(200).json({ session: session, message: `User ${username} signed up successfully!` });

});




cli.get("/logout", auth(),async (req, res) => {

  if (req.user) {
    await userDeleteSession(req.session);
    return res.status(200).json({ message: `User ${req.user.username} logout` });
  }
  return res.status(401).json({ error: "User unauthorized" });

});

module.exports = cli;
