const jwt = require("jsonwebtoken");
const auth = (req, res, next) => {
    const token = req.header("x-auth-token");
    if(!token) {
        res.status(401).json("NO TOKEN, AUTHORIZATION DENIED");
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch(error) {
        res.status(400).json("INVALID TOKEN");
    }
}
module.exports = auth;