import express from "express";
import bootstrap from "./src/app.controller.js";
import env from "./src/Config/config.js";



const app = express();
const PORT = env.port || 3000;

bootstrap(app, express);

app.listen(PORT, ()=>{
    console.log(`Server is Running on port ${PORT}`);
});