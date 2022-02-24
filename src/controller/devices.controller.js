const agenda = require("../config/agenda.config");
const axios = require("axios");
require("dotenv").config();

function readModbus(job, done) {
  const {
    method,
    id,
    host,
    port,
    baudRate,
    parity,
    stopBits,
    dataBits,
    channels,
  } = job.attrs.data;
  function makeRequest(i) {
    console.log(`${process.env.DSMODBUS}/${method}`);
    axios
      .post(`${process.env.DSMODBUS}/${method}`, {
        host,
        port,
        baudRate,
        parity,
        stopBits,
        dataBits,
        id,
        fc: channels[i].fc,
        addr: channels[i].addr,
        quantity: channels[i].quantity,
      })
      .then((res) => {
        console.log(res.data);
        i++;
        if (i < channels.length) {
          makeRequest(i + 1);
        } else {
          done();
        }
      })
      .catch((err) => {
        console.log(err);
        i++;
        if (i < channels.length) {
          makeRequest(i + 1);
        } else {
          done();
        }
      });
  }
  makeRequest(0);
}
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
    // console.log(req.body);
    agenda.define(name, { priority: "high" }, readModbus);
    await agenda.purge();
    await agenda.every(
      "1 seconds",
      name,
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
      { startDate: Date.now() }
    );
    return res.sendStatus(200);
  }
}
module.exports = new devices();
