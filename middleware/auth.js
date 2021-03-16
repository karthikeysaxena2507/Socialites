const redis = require("../redis/functions"); 
const User = require("../models/user.model");
module.exports = async(req, res, next) => {
    const sessionId = req.cookies.SESSIONID;
    console.log(sessionId);
    if(sessionId === undefined)  req.user = null;
    else 
    {
        const userId = await redis.getUserId(sessionId);
        if(userId === null || userId === undefined) req.user = null;
        else 
        {
            const user = await User.findById(userId);
            req.user = user;
        }
    }
    next();
}