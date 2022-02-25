const Queue = require("bull");
const dsModbus = new Queue("ds-modbus");
const axios = require("axios");
dsModbus.process("ds-modbus", function (job, done) {
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
    console.log("makingReqest");
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
});
module.exports = dsModbus;
