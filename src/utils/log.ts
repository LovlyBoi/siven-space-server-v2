export default class Log {
  static error(msg: string | Error) {
    if (msg instanceof Error) {
      console.error(msg.message);
      console.trace(msg);
    } else {
      console.error(msg);
    }
  }
  static log(msg: string) {
    console.log("log: ", msg);
  }
  static warn(msg: string) {
    console.log("warn: ", msg);
  }
}
