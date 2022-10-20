let redis = require("redis");
let bluebird = require("bluebird");
bluebird.promisifyAll(redis);

let redisClient = redis.createClient({
    url: process.env.REDIS_URL,
    no_ready_check: true,
    legacyMode: true,
    auth_pass: process.env.REDIS_PASSWORD
});

redisClient.connect(() => {
    console.log("-- Redis cluster connected Successfully");
})

redisClient.on("connect", (err) => {
    if(err) console.log(err);    
    else console.log("Redis cluster connected Successfully");    
});

/**
 * Print all key value pairs in redis
 */
let printRedisValues = async() => {
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
let deleteAllRedisValues = async() => {
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
let deleteBySessionId = async(sessionId) => {
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
let getUserId = async(sessionId) => {
    let userId = await redisClient.getAsync(sessionId);
    return userId;
}

/**
 * The function to insert new Session in redis
 * @param {String} sessionId
 * @param {String} userId
 * @param {String} duration
 */
let setRedisValue = async(sessionId, userId, duration) => {
    redisClient.setex(sessionId, duration, userId);
}

module.exports = { 
    printRedisValues, 
    deleteAllRedisValues, 
    deleteBySessionId, 
    getUserId,
    setRedisValue
};