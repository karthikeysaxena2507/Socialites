let redis = require("../redis/functions"); 
let User = require("../models/user.model");
module.exports = async(req, res, next) => {
    let sessionId = req.cookies.SESSIONID;
    if(sessionId === undefined)  req.user = null;
    else 
    {
        let userId = await redis.getUserId(sessionId);
        if(userId === null || userId === undefined) req.user = null;
        else 
        {
            let user = await User.findById(userId);
            req.user = user;
        }
    }
    next();
}