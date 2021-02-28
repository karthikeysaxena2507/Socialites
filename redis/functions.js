const redis = require("redis");
const bluebird = require("bluebird");
bluebird.promisifyAll(redis);

const redisClient = redis.createClient(process.env.REDIS_URL, {
    no_ready_check: true,
    auth_pass: process.env.REDIS_PASSWORD
});

redisClient.on("connect", (err) => {
    if(err) console.log(err);    
    else console.log("Redis cluster connected Successfully");    
});

/**
 * Print all key value pairs in redis
 */
const printRedisValues = () => {
    redisClient.keys("*", (err, keys) => 
    {
        if(err) 
        {
            console.log(err);
        }
        else 
        {
            keys.map((key) => 
            {
                redisClient.get(key, (err, value) => 
                {
                    if(err) 
                    {
                        console.log(err);
                    }
                    else 
                    {
                        console.log(key, value);
                    }
                });
            })
        }
    });
    
};

/**
 * The function to delete all values from redis
 */
const deleteAllRedisValues = () => {
    redisClient.flushall((err, res) => 
    {
        if(err) 
        {
            console.log(err);
        }
        else 
        {
            console.log(res);
        }
    })
}

/**
 * The function to delete key value pair from redis by sessionId
 * @param {String} sessionId 
 */
const deleteBySessionId = (sessionId) => {
    redisClient.del(sessionId, (err, response) => 
    {
        if(err) 
        {
            return err;
        }
        else 
        {
            return response;
        }
    });
}

/**
 * GETTING USER ID FROM SESSION ID FROM REDIS
 * @param {String} sessionId 
 */
const getUserId = async(sessionId) => {
    const userId = await redisClient.getAsync(sessionId);
    return userId;
}

/**
 * The function to insert new Session in redis
 * @param {String} sessionId
 * @param {String} userId
 * @param {String} duration
 */
const setRedisValue = async(sessionId, userId, duration) => {
    redisClient.setex(sessionId, duration, userId);
}

module.exports = { 
    printRedisValues, 
    deleteAllRedisValues, 
    deleteBySessionId, 
    getUserId,
    setRedisValue
};