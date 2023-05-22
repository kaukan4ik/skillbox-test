require("dotenv").config();

const { MongoClient, ObjectId } = require("mongodb");

const mgClient = new MongoClient(process.env.URI);
const db = mgClient.db("timers");

const addUser = async (username, pwdHash) => {
  const r = await db.collection("users").insertOne({ login: username, pass: pwdHash });
  return r.insertedId.toString();
};

const getUserByName = async (username) => {
  const user = await db.collection("users").findOne({ login: username });
  if (user) {
    return { userid: user._id.toString(), username: user.login, password: user.pass };
  }
  return null;
};

const getUserIdBySession = async (idSession) => {
  const userSession = await db.collection("session").findOne({ sessionid: idSession });
  if (!userSession) return null;
  const user = await db
    .collection("users")
    .findOne({ _id: new ObjectId(userSession.userid) }, { projection: { pass: 0 } });
  if (!user) return null;
  return { userid: user._id.toString(), username: user.login };
};

const addSession = async (idUser, idSession) => {
  await db.collection("session").insertOne({ sessionid: idSession, userid: idUser });
};

const removeSession = async (idSession) => {
  await db.collection("session").deleteOne({ sessionid: idSession });
};

const getTimer = async (userId, timerId) => {
  const timer = await db.collection("timers").findOne({ userid: userId, _id: new ObjectId(timerId) });
  if (timer) {
    timer.id = timer._id.toString();
    return timer;
  } else {
    return null;
  }
};

const getUsersTimersActive = async (userId) => {
  if (!userId) return [];
  const timers = await db
    .collection("timers")
    .find({ $and: [{ userid: userId }, { $or: [{ end: null }, { end: { $exists: false } }] }] })
    .toArray();
  let timersActiv = [];
  timers.map((t) => {
    timersActiv.push({ timerid: t._id.toString(), description: t.description, start: t.start, end: t.end });
  });
  return timersActiv;
};

const getUsersTimersStoped = async (userId) => {
  if (!userId) return [];
  const timers = await db
    .collection("timers")
    .find({ $and: [{ userid: userId }, { end: { $exists: true } }] })
    .toArray();
  let timersStopped = [];
  timers.map((t) => {
    timersStopped.push({ timerid: t._id.toString(), description: t.description, start: t.start, end: t.end });
  });
  return timersStopped;
};

const saveTimer = async (timerId, timer) => {
  const r = await db.collection("timers").updateOne({ _id: new ObjectId(timerId) }, { $set: timer });
  return r.modifiedCount === 1 && r.matchedCount === 1;
};

const newTimer = async (timer) => {
  const r = await db.collection("timers").insertOne(timer);
  return r.insertedId.toString();
};

module.exports.getTimer = getTimer;
module.exports.getUsersTimersActive = getUsersTimersActive;
module.exports.getUsersTimersStoped = getUsersTimersStoped;
module.exports.newTimer = newTimer;
module.exports.saveTimer = saveTimer;
module.exports.addSession = addSession;
module.exports.removeSession = removeSession;
module.exports.addUser = addUser;
module.exports.getUserByName = getUserByName;
module.exports.getUserIdBySession = getUserIdBySession;
