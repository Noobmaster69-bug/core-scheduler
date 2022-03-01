const Queue = require("bull");
const dsModbus = new Queue("ds-modbus");
const axios = require("axios");

dsModbus.process("ds-modbus", function (job, done) {
  const { name, method } = job.data;
  axios
    .post(process.env.CORE_COMMAND || "127.0.0.1:33333", { name, method })
    .then((res) => done())
    .catch((err) => {
      console.log(err);
      done();
    });
});
module.exports = dsModbus;
