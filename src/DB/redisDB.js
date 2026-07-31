import { createClient } from "redis"
import env from "../Config/config.js";

// ASSIGNMENT 12
export const client = createClient({
  url: env.redisURL
});

export const redisConnectionDB = async()=>{
    try {
        client.on("error", function(err) {
          throw err;
        });
        await client.connect();
        console.log("Redis Database Connected Successfully!");
    } catch (error) {
        console.log("Failed to connect with RedisDB", error);
    }
}