const axios = require("axios");
require("dotenv").config();
const dsModbus = require("../config/bull/bull.config");
class devices {
  async newDevice(req, res) {
    const { id, interval, startTime } = req.body;
    function parseTime(startTime) {
      if (startTime) {
        const pass = new Date(startTime).getTime();
        const now = Date.now();
        const count = (now - pass - ((now - pass) % interval)) / interval + 2;
        return new Date(pass + count * interval);
      } else {
        return new Date();
      }
    }
    delete req.body.interval;
    delete req.body.startTime;
    const data = JSON.stringify(req.body);
    try {
      const job = await dsModbus.add("ds-modbus", data, {
        jobId: id,
        delay: 0,
        repeat: {
          every: parseInt(interval),
          startDate: parseTime(startTime),
        },
      });
      job.opts.repeat.key;
      if (res) {
        return res.sendStatus(200);
      }
    } catch (err) {
      console.log(err);
    }
  }
  async deleteJob(req, res) {
    const { id = null } = req.query;
    const job = (await dsModbus.getRepeatableJobs()).find((e) => e.id === id);
    await dsModbus.removeRepeatableByKey(job.key);
    res.send(200);
  }
}
module.exports = new devices();
