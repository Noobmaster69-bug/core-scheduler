class Task {
  //create uniqe id for task, this id will unchange
  id = require("crypto").randomUUID();
  //id of Timer
  #TimerID;

  #option = {
    startTime: Date.now(),
    retryOnError: Number.POSITIVE_INFINITY,
    key: null,
  };

  #params = {};

  #interval;

  #run = 0;
  #error = 0;

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
      this.#newTask();
      try {
        this.#run++;
        this.#callback(this.#params);
      } catch (err) {
        this.#error++;
        console.log(err);
        if (this.#error === this.#option.retryOnError) {
          this.delete();
          throw new Error(`Task ${this.id} has Error`);
        }
      }
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
  //set task key
  setKey(key) {
    if (this.#option.key === null) {
      console.log("Warning: You are changing task key");
    }
    this.#option.key = key;
  }
  //get task key
  getKey() {
    return this.#option.key;
  }

  getTaskInfo() {
    return {
      id: this.id,
      key: this.#option.key,
      startTime: this.#option.startTime,
      interval: this.#interval,
      params: this.#params,
      run: this.#run,
      retryOnError: this.#option.retryOnError,
      error: this.#error,
    };
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
  /**
   * create New Task
   *
   * @param {task}
   * @return {number}
   */
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
  deleteTaskByKey(key) {
    if (this.#tasks.some((task) => task.getKey() === key)) {
      this.#tasks.find((task) => task.getKey() === key).delete();
      this.#tasks = this.#tasks.filter((task) => task.getKey() !== key);
    }
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
      return true;
    }
    return false;
  }
  updateTaskByKey(key, params) {
    if (!params) {
      throw new Error("Params cannot empty");
    }
    if (!id) {
      throw new Error("id cannot empty");
    }
    if (this.#tasks.some((task) => task.getKey() === key)) {
      this.#tasks.find((task) => task.getKey() === key).putParams(params);
      return true;
    }
    return false;
  }
}
module.exports = new Scheduler();
