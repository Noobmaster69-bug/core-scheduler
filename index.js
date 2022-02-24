const debug = require("debug")("app");
const express = require("express");
require("dotenv").config();
const app = express();

app.listen(process.env.PORT, () => {
  debug("Listening on port " + process.env.PORT);
});
require("./src/middleware/index.middleware")(app);
require("./src/routes/index.router")(app);
