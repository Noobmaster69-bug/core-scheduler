const axios = require("axios");
const { newDevice } = require("../controller/devices.controller");
module.exports = function () {
  console.log("running");
  effort();
};
function effort(e) {
  axios
    .get(`${process.env.METADATA || "127.0.0.1:33335"}/getAllSchedule`)
    .then(({ data }) => {
      data.forEach((e) => {
        newDevice({ body: { ...e } });
      });
    })
    .catch((err) => {
      console.log(err);
      effort(err);
    });
}
