const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_CLOUD);

module.exports.redis = redis;