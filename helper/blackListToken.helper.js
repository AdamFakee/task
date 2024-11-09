const jwt = require("jsonwebtoken");
const Redis = require('ioredis');


// ioredis
const redis = new Redis(process.env.REDIS_CLOUD);


module.exports.addToBlackListToken = async (jwtToken) => {
    const keyName = 'accessToken';
    const payload = jwt.verify(jwtToken, process.env.ACCESS_TOKEN_SECRET);
    const score = payload.exp * 1000; // format Date.now() , score is ttl of token
    const nameValue = `${jwtToken}:${payload.id}`; // name = token:idUser
    await redis.zadd(keyName, 'NX', score, nameValue);
    return;
}

// use like middleware
module.exports.checkExistInBlackListToken = async (req, res, next) => {
    const keyName = 'accessToken';
    const payload = req.payload;
    const score = payload.exp * 1000;
    const blackListToken = await redis.zrangebyscore(keyName, score, score); // find token with specific score
    if(blackListToken.length <= 0) {
        next();
        return;
    } else {
        return res.status(498).json({
            code : 498,
            message : 'token in black list'
        })
    }
}

// user like function
module.exports.checkExistInBlackListTokenFunction = async (payload) => {
    const keyName = 'accessToken';
    const score = payload.exp * 1000;
    const blackListToken = await redis.zrangebyscore(keyName, score, score);
    if(blackListToken.length > 0) {
        return false;
    } 
    return true;
}

// allway run after time
module.exports.deleteValueInBlackList = () => {
    const keyName = 'accessToken';
    const now = Date.now();
    const time = 31*60*1000; //31m, over ttl = 30m => check
    setInterval( async () => {
        await redis.zremrangebyscore(keyName, 0, now);
    }, time);
}