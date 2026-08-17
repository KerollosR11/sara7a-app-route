import path from "path";
import { databaseConnection } from "./DB/connectionDB.js";
import { hashData, verifyData } from "./Middlewares/Security/encryption.js";
import { authRouter, messageRouter, userRouter } from "./Modules/index.js";
import { globalHandlingError, NotFoundException } from "./Utils/Response/error.response.js";
import { SuccessResponse } from "./Utils/Response/success.response.js";
import {fileURLToPath} from "url";
import { redisConnectionDB } from "./DB/redisDB.js";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { limiter } from "./Utils/rateLimitter.js";
import { logStream } from "./Utils/Loggers/morgan.logger.js";


const bootstrap = async (app, express)=>{
    app.use(express.json());

    await databaseConnection();
    await redisConnectionDB();

    // package for security and prevent attacks and also hide some sensitive headers from response such as developing platform (express) in header: x-powered 
    app.use(helmet());

    // for requests logging logs and store it
    app.use(morgan("combined", {stream: logStream}));
    
    // Apply the rate limiting middleware to all requests.
    app.use(limiter);

    app.use(cors({
        origin: "*",
    }))

    // attachRouterWithLogger(app, "/api/v1/auth", authRouter, "access.log");
    
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

    app.all("{*dummy}", (req, res)=>{
        res.status(404).json({message: "Page not found!"});
    });

    // Global error handler
    app.use(globalHandlingError);
};

export default bootstrap;