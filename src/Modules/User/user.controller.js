import {Router} from "express";
import { SuccessResponse } from "../../Utils/Response/success.response.js";
import * as userServices from "./user.service.js";
import { auth } from "../../Middlewares/Auth/auth.js";
import { validation } from "../../Middlewares/validation.js";
import { ObjectIdSchema, updateSchema } from "../Auth/auth.validation.js";
import { uploading } from "../../Middlewares/multer.js";

const router = Router();

router.get("/", (req, res)=>{
    SuccessResponse({res, message:"user router", statusCode:200});
});



router.get("/get-user-data", auth, userServices.getUserData);

router.put("/update-user",  auth, uploading().single("coverImage"), validation(updateSchema), userServices.updateUser);

router.get("/get-user-data-by-UName/:uniqueAccName", auth, userServices.getUserDataByUniqueAccName);

router.patch("{/:userId}/freeze-account",  auth, validation(ObjectIdSchema), userServices.freezeAccount);

router.patch("{/:userId}/restore-account",  auth, validation(ObjectIdSchema), userServices.restoreAccount);

router.delete("/:userId/delete-account",  auth, validation(ObjectIdSchema), userServices.hardDelete);


export default router;