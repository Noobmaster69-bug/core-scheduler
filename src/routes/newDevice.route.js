const express = require("express");

const router = express.Router();
const controller = require("../controller/devices.controller");
router.use("/", controller.newDevice);

module.exports = router;
