import express from "express";
import bootstrap from "./src/app.controller.js";
import env from "./src/Config/config.js";
import chalk from "chalk";



const app = express();
const PORT = env.port || 3000;

bootstrap(app, express);

app.listen(PORT, ()=>{
    console.log(chalk.bgBlue(`Server is Running on port ${PORT} `));
});