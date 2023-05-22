const { getActiveTimers, getStopingTimers} = require("../services/timers");

const express = require("express");
const socket = express.Router();

async function  allTimers(userid) {
    const actTimers = await getActiveTimers(userid)
    const stpTimers = await getStopingTimers(userid)
    return JSON.stringify({type: 'all_timers', activeTimers: actTimers, stopingTimers: stpTimers})
}

socket.ws('/', async (ws, req) => {

    ws.user = req.user
    console.log(`Open socket for ${ws.user.username}`)
    ws.send(await allTimers(ws.user.userid))

    ws.intervalId = setInterval(async () => { //инициализация отправки таймеров
      const actTimers = await getActiveTimers(ws.user.userid)
      ws.send(JSON.stringify({type: 'active_timers', activeTimers: actTimers}))
    }, 1000)

    ws.on("message", (data) => {
      try {
        const msg = JSON.parse(data)
        if (msg.action && msg.action === 'get_all_timers') {
            ws.send(allTimers(ws.user.userid))
        }
      } catch (error) {
        return
      }
    })

    ws.on("close", () => {
      console.log(`Close socket for ${ws.user.username}`)
      clearInterval(ws.intervalId)
  })
})

module.exports = socket;
