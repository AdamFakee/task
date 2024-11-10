const { redis } = require("../config/ioredis.config")

module.exports.addToString = async (key, value, ttl) => {
    const valueJson = JSON.stringify(value); // format in json
    await redis.set(key, valueJson, "EX", ttl); // add value to string 
}

module.exports.getInString = async (key) => {
    const result = await redis.get(key); // get result in string in ioredis
    return result;
}