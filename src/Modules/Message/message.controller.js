import {Router} from "express";
import { SuccessResponse } from "../../Utils/Response/success.response.js";
import * as messageServices from "./message.service.js";

const router = Router();

router.get("/", (req, res)=>{
    SuccessResponse({res, message:"message router", statusCode:200});
});

router.post("/send-message", messageServices.sendMessage);

export default router;