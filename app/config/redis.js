//Dependencias de redis
const redis = require('redis');

let host = ''
if(process.env.NODE_ENV === 'production'){
    host = '10.50.230.81'
}
else{
    host = 'redis-kalaja'
}
    const redisClient = redis.createClient({ socket: { host: host, port: 6379 } });

async function connectRedis() {
    if (!redisClient.isOpen) {
        await redisClient.connect();
        console.log('Connected to Redis');
    }
    return redisClient;
}

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

module.exports = {  connectRedis, redisClient }