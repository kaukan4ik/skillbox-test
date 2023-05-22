const { getActiveTimers, getStopingTimers, createTimer, stopTimer, getUserTimer } = require("../services/timers");
const express = require("express");
const timers = express.Router();

timers.post("/:idTimer/stop", async (req, res) => {
  let {idTimer} = req.params;
  try {
    if (await stopTimer(req.user.userid, idTimer)) {
      console.log(`User ${req.user.username} stoped timer id "${idTimer}"`);
      return res.status(200).json({message: `Timer ID "${idTimer}" stoped`});
    } else {
      return res.status(404).json({ error: `Timer ID "${idTimer}" not found` });
    }
  } catch (error) {
    return res.status(500).json({ error: `Internal Server Error: ${error.message}` });
  }

});


timers.get("/:idTimer", async (req, res) => {
  let idTimer = req.params["idTimer"];
  try {
    let timer = await getUserTimer(req.user.userid, idTimer)
    if (timer) {
      console.log("Timer found:", timer)
      return res.status(200).json(timer);
    } else {
      return res.status(404).json({ error: "timer not found" });
    }
    } catch (error) {
      return res.status(500).json({ error: `Internal Server Error: ${error.message}` });
  }


});

timers.post("/", async (req, res) => {
  const {description} = req.body
  if (description) {
      console.log(`User ${req.user.username} create timer "${description}"`);
      let idTimer = await createTimer(req.user.userid, description);
      if (idTimer) {
        return res.status(200).json({ id: idTimer, message: `Timer "${description}" started. ID: ${idTimer}`});
      } else {
         return res.sendStatus(405).json({ error: "Create timer failed" });
      }
    }
  return res.sendStatus(405).json({ error: "Description timer is empty" });
});

timers.get("/", async (req, res) => {
  if (Object.prototype.hasOwnProperty.call(req.query, "isActive")) {
    if (req.query.isActive === "true") {
      //запрос на активные таймеры
      return res.status(200).json(await getActiveTimers(req.user.userid));
    } else if (req.query.isActive === "false") {
      //отключенные
      return res.status(200).json(await getStopingTimers(req.user.userid));
    }
  } else {
    return res.sendStatus(405);
  }
});

module.exports = timers;
