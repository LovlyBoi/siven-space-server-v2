import app from "./src/app";
import "./src/app/config";
import { network as ip } from "./src/utils/getIp";
import { log } from "./src/utils/log";

app.listen(process.env.APP_PORT, () => {
  log('yellow', `\n  ${process.env.APP_NAME}`)
  log('white', ' is running in\n')
  log('green', '    ➜  ')
  log('white', 'local: ')
  log('blue', `http://${ip.local}:${process.env.APP_PORT}\n`)
  log('green', '    ➜  ')
  log('white', 'network: ')
  log('blue', `http://${ip.network}:${process.env.APP_PORT}\n\n`)
});
