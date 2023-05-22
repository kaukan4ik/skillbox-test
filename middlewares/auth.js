const { userFindBySession } = require("../services/user");
const auth = () => async (req, res, next) => {
  if (req.cookies && req.cookies["session"] || req.headers['session']) {
    const session = req.headers['session'] || req.cookies["session"]
    const user = await userFindBySession(session);
    if (user) {
      req.user = user;
      req.session = session;
    } else {
      return res.status(401).json({ error: "User unauthorized" });
    }
  }
  next();
};

module.exports = function () {
  return auth();
};
