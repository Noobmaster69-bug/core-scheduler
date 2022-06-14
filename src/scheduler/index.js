/**
 * class of Task
 *
 * @param {task}
 * @return {Axios} A new instance of Axios
 */

class Task {
  //create uniqe id for task, this id will unchange until
  id = require("crypto").randomUUID();
  //id of
  #TimerID;
  #option = {
    startTime: Date.now(),
  };
  #params = {};
  #interval;
  #callback = () => {};
  constructor(callback, interval, params, option = {}) {
    this.#option = { ...this.#option, ...option };
    this.#interval = interval;
    this.#params = params;
    this.#callback = callback;
    this.#newTask();
  }
  //create new task
  #newTask() {
    this.#TimerID = setTimeout(() => {
      try {
        this.#callback(this.#params);
      } catch (err) {
        console.log(err);
      }
      this.#newTask();
    }, this.#Timer());
  }
  //change params
  putParams(params) {
    if (!params) {
      throw new Error("Params cannot empty");
    }
    this.#params = params;
  }
  //delete task
  delete() {
    clearInterval(this.#TimerID);
  }
  //this method will calculate next Start Time
  #Timer() {
    let interval = this.#interval;
    //calculate startTime
    let startTime = Date.now() - this.#option.startTime;
    // if startTime < 0 this mean task will start in the future
    if (startTime < 0) {
      startTime = Math.abs(startTime);
    }
    // if startTime > 0 this mean task has started in the past, below code will caculate the next period that task will run
    if (startTime > 0) {
      //if new right now is the next period, start the task immediately
      if (startTime % interval === 0) {
        startTime = 0;
      }
      //else calculate the gap to next period
      else {
        startTime =
          Math.floor((Date.now() - this.#option.startTime) / interval) *
            interval +
          this.#option.startTime +
          interval -
          Date.now();
      }
    }
    return startTime;
  }
}

class Scheduler {
  #tasks = [];
  addTask(callback = () => {}, interval = 0, params = {}, option = {}) {
    const task = new Task(callback, interval, params, option);
    this.#tasks.push(task);
    return task.id;
  }
  deleteTask(id) {
    if (this.#tasks.some((task) => task.id === id)) {
      this.#tasks.find((task) => task.id === id).delete();
      this.#tasks = this.#tasks.filter((task) => task.id !== id);
      return true;
    } else return false;
  }
  updateTask(id, params) {
    if (!params) {
      throw new Error("Params cannot empty");
    }
    if (!id) {
      throw new Error("id cannot empty");
    }
    if (this.#tasks.some((task) => task.id === id)) {
      this.#tasks.find((task) => task.id === id).putParams(params);
    }
    return true;
  }
}
module.exports = new Scheduler();
