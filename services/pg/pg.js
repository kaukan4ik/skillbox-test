
const pg = require("pg");

pg.types.setTypeParser(20, "text", parseInt);

require("dotenv").config();
const knex = require("knex")({
  client: "pg",
  connection: {
    connectionString: "postgres://kaukan4ik:boEchRp08TlN@ep-wild-surf-851935.eu-central-1.aws.neon.tech/neondb",
    ssl: true,
  },
  pool: { min: 0, max: 5 },
});

const addUser = async (username, pwdHash) => {
  const [userId] = await knex("users").insert({ login: username, pass: pwdHash }, "userid");
  console.log(`User "${username}" add. Id = ${userId["userid"]}`);
  return userId["userid"];
};

const getUserByName = async (username) => {
  const [user] = await knex("users").select().where({ login: username });
  if (user) {
    console.log("pg:getUserByName user is find", user);
    return { userid: user.userid, username: user.login, password: user.pass };
  }
  return null;
};

const getUserIdBySession = async (idSession) => {
  const [user] = await knex("session")
    .column({ userid: "users.userid", login: "users.login" })
    .innerJoin("users", "users.userid", "session.userid")
    .where({ sessionid: idSession });

 if (user) {
    return { userid: user.userid, username: user.login };
  }

  return null;
};

const addSession = async (idUser, idSession) => {
  await knex("session").insert({ sessionid: idSession, userid: idUser });
};

const removeSession = async (idSession) => {
  await knex("session").where({ sessionid: idSession }).del();
};

const getUsersTimers = async (userId) => {
  if (!userId) return [];
  const timers = await knex("timers").select().where({ userid: userId });
  return timers;
};
const getUsersTimersActive = async (userId) => {
  if (!userId) return [];
  const timers = await knex("timers").select().where({ userid: userId }).whereNull("end");
  return timers;
};
const getUsersTimersStoped = async (userId) => {
  if (!userId) return [];
  const timers = await knex("timers").select().where({ userid: userId }).whereNotNull("end");
  return timers;
};

/**
 * @param { {BigInt} } timerId
 * @param { {userId: BigInt, description: string, start: BigInt, end: BigInt} } timer
 * @returns { boolean }
 */
const saveTimer = async (timerId, timer) => {
  try {
    await knex("timers").update(timer).where({ timerid: timerId });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

/**
 * @param { {userid: BigInt,  description: string, start: EpochTimeStamp, end:BigInt} } timer
 * @returns { bigint }
 */
const newTimer = async (timer) => {
  console.log("pg:newTimer save bd new ", timer);
  const [t] = await knex("timers").insert(timer, "timerid");
  return t.timerid;
};

module.exports.getUsersTimers = getUsersTimers;
module.exports.getUsersTimersActive = getUsersTimersActive;
module.exports.getUsersTimersStoped = getUsersTimersStoped;
module.exports.newTimer = newTimer;
module.exports.saveTimer = saveTimer;
module.exports.addSession = addSession;
module.exports.removeSession = removeSession;
module.exports.addUser = addUser;
module.exports.getUserByName = getUserByName;
module.exports.getUserIdBySession = getUserIdBySession;
