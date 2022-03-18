const Queue = require("bull");
const dsModbus = new Queue("ds-modbus");
const axios = require("axios");
const getKeys = async (q) => {
  const multi = q.multi();
  multi.keys("*");
  const keys = await multi.exec();
  return keys[0][1];
};

const filterQueueKeys = (q, keys) => {
  const prefix = `${q.keyPrefix}:${q.name}`;
  return keys.filter((k) => k.includes(prefix));
};

const deleteKeys = async (q, keys) => {
  const multi = q.multi();
  keys.forEach((k) => multi.del(k));
  await multi.exec();
};

const emptyQueue = async (q) => {
  const keys = await getKeys(q);
  const queueKeys = filterQueueKeys(q, keys);
  await deleteKeys(q, queueKeys);
};

dsModbus.process("ds-modbus", function (job, done) {
  const data = JSON.parse(job.data);
  axios
    .post(
      (process.env.CORE_COMMAND || "http://127.0.0.1:33333") +
        "/device-service",
      data
    )
    .then((res) => {
      dsModbus.clean(10);
      dsModbus.clean(10, "failed");
      done();
    })
    .catch((err) => {
      dsModbus.clean(10);
      dsModbus.clean(10, "failed");
      done();
    });
});
emptyQueue(dsModbus);
module.exports = dsModbus;
