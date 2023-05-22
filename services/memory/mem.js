const { nanoid } = require("nanoid");
const hash = require("../hash");

const DB = {
  users: [
    {
      _id: nanoid(),
      username: "admin",
      password: hash("admin"),
    },
  ],
  sessions: {},
  timers: [],
};

function getTimerIndex(userId, timerId) {
  for (let i = 0; i < DB.timers.length; i++) {
    if (DB.timers[i].timerId === timerId && DB.timers[i].userId === userId) {
      return i;
    }
  }
  return null;
}

const getUsersTimers = async (userId) => {
  let timers = [];
  DB.timers.map((t) => {
    if (t.userId === userId) {
      timers.push(t);
    }
  });
  return timers;
};

const saveTimer = async (timer) => {
  let timerIndex = getTimerIndex(timer.userId, timer.timerId);
  if (timerIndex !== null) {
    //такой таймер уже есть, обновим поля
    Object.keys(timer).map((k) => {
      DB.timers[timerIndex][k] = timer[k];
    });
  } else {
    DB.timers.push(timer);
  }

  return true;
};

const addUser = async (username, pwdHash) => {
  const idUser = nanoid();
  DB.users.push({ _id: idUser, username: username, password: pwdHash });
  return idUser;
};

const getUserByName = async (username) => {
  for (let i = 0; i < DB.users.length; i++) {
    if (username === DB.users[i].username) {
      return { userid: DB.users[i]._id, username: DB.users[i].username, password: DB.users[i].password };
    }
  }
  return null;
};

const getUserIdBySession = async (idSession) => {
  for (let i = 0; i < DB.users.length; i++) {
    if (DB.sessions[idSession] === DB.users[i]._id) {
      return { userid: DB.users[i]._id, username: DB.users[i].username, password: DB.users[i].password };
    }
  }
  return null;
};

const addSession = async (idUser, idSession) => {
  if (!Object.prototype.hasOwnProperty.call(DB.sessions, idSession)) {
    DB.sessions[idSession] = idUser;
  } else console.log(`Session ${idSession} exists`);
};

const removeSession = async (idSession) => {
  delete DB.sessions[idSession];
};

module.exports.getUsersTimers = getUsersTimers;
module.exports.saveTimer = saveTimer;
module.exports.addSession = addSession;
module.exports.removeSession = removeSession;
module.exports.addUser = addUser;
module.exports.getUserByName = getUserByName;
module.exports.getUserIdBySession = getUserIdBySession;
