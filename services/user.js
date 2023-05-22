const { addUser, getUserByName, addSession, removeSession, getUserIdBySession } = require("./mongo/mongo");

const { nanoid } = require("nanoid");
const hash = require("../services/hash");

const userCreateSession = async (userId) => {
  let uniq = nanoid();
  addSession(userId, uniq);
  return uniq;
};

const userDeleteSession = async (sessionId) => {
  removeSession(sessionId);
  return true;
};

const userFindBySession = async (sessionId) => {
  let user = await getUserIdBySession(sessionId);
  if (user) return { username: user.username, userid: user.userid };
  return null;
};

const userExists = async (userName) => {
  let user = await getUserByName(userName);

  if (user) return true;
  return false;
};

const userValidate = async (userName, password) => {
  let user = await getUserByName(userName);
  if (user && user.password === hash(password)) {
    console.log(`user:userValidate: user ${userName} is valid`);
    return user.userid;
  }
  return null;
};

const userAddNew = async (userName, password) => {
  const userId = await addUser(userName, hash(password));
  return userId;
};

module.exports.userCreateSession = userCreateSession;
module.exports.userDeleteSession = userDeleteSession;
module.exports.userFindBySession = userFindBySession;
module.exports.userExists = userExists;
module.exports.userAddNew = userAddNew;
module.exports.userValidate = userValidate;
