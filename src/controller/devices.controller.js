const axios = require("axios");
require("dotenv").config();
const dsModbus = require("../Bull/Bull.config");
class devices {
  async newDevice(req, res) {
    const {
      name,
      interval,
      method,
      id,
      host,
      port,
      baudRate,
      parity,
      stopBits,
      dataBits,
      channels,
    } = req.body;
    try {
      await dsModbus.add(
        "ds-modbus",
        {
          method,
          id,
          host,
          port,
          baudRate,
          parity,
          stopBits,
          dataBits,
          channels,
        },
        {
          jobId: name,
          delay: 0,
          repeat: {
            every: parseInt(interval),
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
