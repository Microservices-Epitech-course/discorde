import * as redis from "redis";

export const publisher = redis.createClient(process.env.REDIS_URL);