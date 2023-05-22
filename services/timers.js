let { getTimer, saveTimer, newTimer, getUsersTimersActive, getUsersTimersStoped } = require("./mongo/mongo");

const getUserTimer = async (userId, timerId) => {
  if (!userId) return [];
  let t = await getTimer(userId, timerId);
  if (!t) return null
  if (t.end)
        return {
            id: t.id,
            description: t.description,
            duration: t.end - t.start,
            start: t.start,
            end: t.end,
          }
  return {
      id: t.id,
      description: t.description,
      progress: Date.now() - t.start,
      start: t.start,
    };

};


const getActiveTimers = async (userId) => {
  if (!userId) return [];
  let timers = await getUsersTimersActive(userId);
  let activeTimers = [];

  timers.map((t) => {
    activeTimers.push({
      id: t.timerid,
      description: t.description,
      progress: Date.now() - t.start,
      start: t.start,
    });
  });
  return activeTimers;
};

const getStopingTimers = async (userId) => {
  if (!userId) return [];
  let timers = await getUsersTimersStoped(userId);
  let stopingTimers = [];
  timers.map((t) => {
    stopingTimers.push({
      id: t.timerid,
      description: t.description,
      duration: t.end - t.start,
      start: t.start,
      end: t.end,
    });
  });
  return stopingTimers;
};

const createTimer = async (userId, description) => {
  const timerId = newTimer({
    userid: userId,
    description: description,
    start: Date.now(),
  });
  return timerId;
};

const stopTimer = async (userId, timerId) => {
  return await saveTimer(timerId, { end: Date.now() });
};

module.exports.getActiveTimers = getActiveTimers;
module.exports.getStopingTimers = getStopingTimers;
module.exports.stopTimer = stopTimer;
module.exports.createTimer = createTimer;
module.exports.getUserTimer = getUserTimer;
