import app, { startLog } from "./src/app";

app.listen(process.env.APP_PORT, startLog);
