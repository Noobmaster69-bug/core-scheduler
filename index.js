const Scheduler = require("./src/scheduler");
function callback(params) {
  console.log(params);
}
const id = Scheduler.addTask(callback, 5000, "Hello0", {
  startTime: Math.floor(Date.now() / 60000) * 60000,
});
Scheduler.addTask(callback, 5000, "Hello1", {
  startTime: Math.floor(Date.now() / 60000) * 60000,
});
Scheduler.addTask(callback, 5000, "Hello2", {
  startTime: Math.floor(Date.now() / 60000) * 60000,
});
Scheduler.addTask(callback, 5000, "Hello3", {
  startTime: Math.floor(Date.now() / 60000) * 60000,
});
Scheduler.addTask(callback, 5000, "Hello4", {
  startTime: Math.floor(Date.now() / 60000) * 60000,
});
// const ipc = require("node-ipc").default;
// ipc.config.appspace = "core.";
// // ipc.config.id = "socket";
// ipc.config.retry = 1500;
// ipc.connectTo("socket", () => {
//   console.log("connected to client");
// });
