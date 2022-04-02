const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req,res,next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
        //console.log(token)
    }

    if (!token || token=="null") {
        return res.status(400).json({success: false, msg: "not authorized to access this route"});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log(decoded);
        //console.log(req.user);
        req.user = await User.findById(decoded.id);
        //console.log(req.user);
        next();
    } catch (err) {
        console.log(err.stack);
        return res.status(401).json({success: false, msg: "not authorize to access this route"})
    }
}

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return res.status(403).json({success: false, msg: `User role ${req.user.role} is not authorized to access this route`});
        }
        next();
    }
}