const redis = require("redis");
const bluebird = require("bluebird");
bluebird.promisifyAll(redis);

const redisClient = redis.createClient(process.env.REDIS_URL, {
    no_ready_check: true,
    auth_pass: process.env.REDIS_PASSWORD
});

// PRINTING ALL KEY-VALUE PAIRS PRESENT IN REDIS
const printRedisValues = () => {
    redisClient.keys("*", (err, keys) => {
        if(err) {
            console.log(err);
        }
        else {
            keys.map((key) => {
                redisClient.get(key, (err, value) => {
                    if(err) {
                        console.log(err);
                    }
                    else {
                        console.log(key, value);
                    }
                });
            })
        }
    });
    
};

// DELETE ALL REDIS VALUES
const deleteAllRedisValues = () => {
    redisClient.flushall((err, res) => {
        if(err) {
            console.log(err);
        }
        else {
            console.log(res);
        }
    })
}

// DELETE PARTICULAR KEY-VALUE PAIR IN REDIS
const deleteBySessionId = (sessionId) => {
    redisClient.del(sessionId, (err, response) => {
        if(err) {
            return err;
        }
        else {
            return response;
        }
    });
}

// GETTING USER ID FROM SESSION ID FROM REDIS
const getUserId = async(sessionId) => {
    const userId = await redisClient.getAsync(sessionId);
    return userId;
}

module.exports = { printRedisValues, deleteAllRedisValues, deleteBySessionId, getUserId };