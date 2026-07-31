import {Router} from "express";
import { SuccessResponse } from "../../Utils/Response/success.response.js";

const router = Router();

router.get("/", (req, res)=>{
    SuccessResponse({res, message:"message router", statusCode:200});
});

export default router;