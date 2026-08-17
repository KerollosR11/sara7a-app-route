import morgan from "morgan";
import fs from "node:fs";
import path from "node:path";

const __dirname = path.resolve();   //absolute path

export function attachRouterWithLogger(app, routerPath, router, logFileName){

    const logStream = fs.createWriteStream(
        path.resolve(__dirname, "./src/Loggers", logFileName),
        {flags:"a"}, // append
    );

    app.use(routerPath, morgan("combined", {stream: logStream}), router)

}