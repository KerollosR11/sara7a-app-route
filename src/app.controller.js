import path from "path";
import { databaseConnection } from "./DB/connectionDB.js";
import { hashData, verifyData } from "./Middlewares/Security/encryption.js";
import { authRouter, messageRouter, userRouter } from "./Modules/index.js";
import { globalHandlingError, NotFoundException } from "./Utils/Response/error.response.js";
import { SuccessResponse } from "./Utils/Response/success.response.js";
import {fileURLToPath} from "url";
import { redisConnectionDB } from "./DB/redisDB.js";
import cors from "cors";
import rateLimit from "express-rate-limit";

//ASSIGNMENT 13
// RATE LIMITER
const limiter = rateLimit({
	windowMs: 2 * 60 * 1000, // 2 minutes  (millsec)
	limit: 3, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    // standardHeaders: "draft-8",
    legacyHeaders: false,
    message:"Too many requests, Try again later",
    statusCode: 429
});

const bootstrap = async (app, express)=>{
    app.use(express.json());

    await databaseConnection();
    await redisConnectionDB();
    
    // Apply the rate limiting middleware to all requests.
    app.use(limiter);

    app.use(cors({
        origin: "*",
    }))
    
    app.use("/api/v1/auth", authRouter);
    app.use("/api/v1/user", userRouter);
    app.use("/api/v1/message", messageRouter);

    // File Upload
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    app.use("/uploads", express.static(path.join(__dirname, '../uploads')));
    // End of File upload
    

    app.get("/check-health", (req, res)=>{
        res.json("Server is running now");
    });

    app.get("/test", (req, res)=>{
        SuccessResponse({
            res,
            message: "Done from test",
            statusCode: 200
        });
    });


    app.all("{*dummy}", (req, res)=>{
        res.status(404).json({message: "Page not found!"});
    });

    // Global error handler
    app.use(globalHandlingError);
    

};

export default bootstrap;