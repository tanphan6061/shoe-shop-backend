const Redis = require('ioredis');

const redis = new Redis(); // uses defaults unless given configuration object

// ioredis supports all Redis commands:
redis.set('foo', 'bar');

module.exports = redis;
