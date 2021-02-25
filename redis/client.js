const redis = require("redis");
const redisClient = redis.createClient(process.env.REDIS_URL, {
    no_ready_check: true,
    auth_pass: process.env.REDIS_PASSWORD
});

// CHECKING IF REDIS IS CONNECTED OR NOT
redisClient.on("connect", (err) => {
    if(err) 
    {
        console.log(err);    
    }
    else 
    {
        console.log("Redis cluster connected Successfully");    
    }
});

module.exports = redisClient;