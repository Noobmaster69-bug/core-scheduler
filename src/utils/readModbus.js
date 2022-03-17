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
  } = job.data;
  function makeRequest(i) {
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
        i++;
        if (i < channels.length) {
          makeRequest(i + 1);
        } else {
          done();
        }
      })
      .catch((err) => {
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
module.exports = readModbus;
