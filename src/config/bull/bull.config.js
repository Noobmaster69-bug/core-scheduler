const Queue = require("bull");
const dsModbus = new Queue("ds-modbus");
const axios = require("axios");

dsModbus.process("ds-modbus", function (job, done) {
  const data = JSON.parse(job.data);
  axios
    .post(
      (process.env.CORE_COMMAND || "http://127.0.0.1:33333") +
        "/device-service",
      data
    )
    .then((res) => {
      dsModbus.clean(1);
      dsModbus.clean(1, "failed");
      done();
    })
    .catch((err) => {
      dsModbus.clean(1);
      dsModbus.clean(1, "failed");
      done();
    });
});
module.exports = dsModbus;
