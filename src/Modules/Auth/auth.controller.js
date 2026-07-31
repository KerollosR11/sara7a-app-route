import {Router} from "express";
import { SuccessResponse } from "../../Utils/Response/success.response.js";
import * as authServices from "./auth.service.js";
import { auth } from "../../Middlewares/Auth/auth.js";
import { validation } from "../../Middlewares/validation.js";
import { loginSchema, signupSchema } from "./auth.validation.js";

const router = Router();

router.get("/", (req, res)=>{
    SuccessResponse({res, message:"auth router", statusCode:200});
});

router.post("/signup", validation(signupSchema), authServices.userSignup);

router.post("/login", validation(loginSchema), authServices.userLogin);

router.get("/get-access-token", auth, authServices.getAccessToken);

router.post("/verify-account", authServices.verifyAccount);

router.post("/logout", auth, authServices.logout);

router.post("/signup/gmail", authServices.signupMail);



export default router;