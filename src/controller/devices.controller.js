const axios = require("axios");
require("dotenv").config();
const dsModbus = require("../config/bull/bull.config");
class devices {
  async newDevice(req, res) {
    const { name, interval, startTime, SouthProtocol } = req.body;
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

    try {
      await dsModbus.add(
        "ds-modbus",
        {
          name,
          SouthProtocol,
        },
        {
          jobId: name,
          delay: 0,
          repeat: {
            every: parseInt(interval),
            startDate: parseTime(startTime),
          },
        }
      );
      dsModbus.getRepeatableJobs().then((result) => console.log(result));
      return res.sendStatus(200);
    } catch (err) {
      console.log(err);
    }
  }
}
module.exports = new devices();
