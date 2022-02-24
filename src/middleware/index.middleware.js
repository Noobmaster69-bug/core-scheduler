const express = require("express");
function middleware(app) {
  app.use(express.json()); // for parsing application/json
  app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
}
module.exports = middleware;
