const axios = require("axios");
const { newDevice } = require("../controller/devices.controller");
module.exports = function () {
  effort();
};
function effort(e) {
  axios
    .get(`${process.env.METADATA || "127.0.0.1:33335"}/schedule/getAll`)
    .then(({ data }) => {
      data.forEach((e) => {
        newDevice({ body: { ...e } });
      });
    })
    .catch((err) => {
      effort(err);
    });
}
