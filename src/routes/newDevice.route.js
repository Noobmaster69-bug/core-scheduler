const express = require("express");

const router = express.Router();
const controller = require("../controller/devices.controller");
router.post("/", controller.newDevice);
router.delete("/", controller.deleteJob);
module.exports = router;
