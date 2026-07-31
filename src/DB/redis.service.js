import {client} from "./redisDB.js";

// ASSIGNMENT 12

export const redis_set = async ({key , value, ttl} = {})=>{
    return await client.set(key, value, {EX: ttl});
};

export const redis_get = async(key)=>{
    return await client.get(key);
};

export const redis_ttl = async(key)=>{
    return await client.ttl(key);
};

export const redis_exists = async(key)=>{
    return await client.exists(key);
};

export const redis_delete = async(key)=>{
    return await client.del(key);
};

export const redis_mget = async(...keys)=>{ // 3mlna spread op ... 3shan n7otha ka array
    return await client.mGet(keys);
};

export const createRevokeToken = ({userId, token})=>{
    return `revokeToken::${userId}:${token}`;
}