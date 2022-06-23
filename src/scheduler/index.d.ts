interface task {
  callback: taskCallback;
  interval: number;
  option: {
    startTime: any;
  };
}
interface taskCallback {
  (params: object): any;
}
