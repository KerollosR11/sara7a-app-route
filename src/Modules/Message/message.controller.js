import {Router} from "express";
import { SuccessResponse } from "../../Utils/Response/success.response.js";
import * as messageServices from "./message.service.js";
import { uploading } from "../../Middlewares/multer.js";
import { auth } from "../../Middlewares/Auth/auth.js";
import { validation } from "../../Middlewares/validation.js";
import { ObjectIdSchema } from "../Auth/auth.validation.js";

const router = Router();

router.get("/", (req, res)=>{
    SuccessResponse({res, message:"message router", statusCode:200});
});

router.post("/send-message", uploading().single("image"), messageServices.sendMessage);

router.get("/get-messages", auth,  messageServices.getMessage);

router.patch("/:messageId/read", auth, validation(ObjectIdSchema), messageServices.toggleRead);

router.patch("/:messageId/favorite", auth, validation(ObjectIdSchema), messageServices.toggleRead);


export default router;