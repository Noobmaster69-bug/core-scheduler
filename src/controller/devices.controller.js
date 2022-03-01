const axios = require("axios");
require("dotenv").config();
const dsModbus = require("../config/bull/bull.config");
class devices {
  async newDevice(req, res) {
    const { name, interval, startTime } = req.body;
    try {
      await dsModbus.add(
        "ds-modbus",
        {
          name,
          method,
        },
        {
          jobId: name,
          delay: 0,
          repeat: {
            every: parseInt(interval),
            // startDate: startTime,
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
