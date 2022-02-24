const new_devices = require("./newDevice.route");
function router(app) {
  app.use("/new_devices", new_devices);
}
module.exports = router;
