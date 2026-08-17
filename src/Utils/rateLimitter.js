//ASSIGNMENT 13

import rateLimit from "express-rate-limit";

// RATE LIMITER
export const limiter = rateLimit({
    windowMs: 2 * 60 * 1000, // 2 minutes  (millsec)
    limit: 3, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    // standardHeaders: "draft-8",
    legacyHeaders: false,
    message:"Too many requests, Try again later",
    statusCode: 429
});