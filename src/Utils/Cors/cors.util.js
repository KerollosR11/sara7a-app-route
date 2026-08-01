import env from "../../Config/config.js";
import { BadRequestException } from "../Response/error.response.js";


export function corsOptions(){
    const whiteList = env.corsWhiteList.split(",");

    const corsOp = {
        origin : function (origin, callback) {
            if(whiteList.includes(origin)){
                callback(null, true); // Access Granted
            }else if(!origin){ // 3shan lw bntsh8l b postman aw ay program zyo ... postman mlhosh origin
                callback(null, true); // Access Granted
            }else{
                callback(BadRequestException({message: "Access Denied!"}));
            }
        },
        methods: ["GET", "POST", "DELETE", "PUT", "PATCH"]
    }

    return corsOp;
}