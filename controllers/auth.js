const User = require("../models/User");

//@desc     Register user
//@route    POST/api/v1/auth/register
//@access   Public
exports.register = async (req,res,next) => {
    //res.status(200).json({success: true});
    try {
        const {name, email, password, role} = await req.body;
        const user = await User.create({
            name,
            email,
            password,
            role
        })
        // const token = user.getSignedJwtToken();
        // res.status(200).json({success: true, token})
        sentTokenResponse(user, 200, res)
    } catch (err) {
        res.status(400).json({success: false})
        console.lof(err.stack);
    }
};

//@desc     Login user
//@route    POST/api/v1/auth/login
//@access   Public
exports.login = async (req,res,next) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({success: false, msg: "please enter email and password"});
    }

    const user = await User.findOne({email}).select("password");
    //console.log(user)

    if (!user) {
        return res.status(400).json({success: false, msg: "invalid credentials"})
    }

    const isMatch = await user.matchPassword(password); //compare with this.password

    if (!isMatch) {
        return res.status(400).json({success: false, msg: "Invalid password"})
    }

    // const token = user.getSignedJwtToken();
    // res.status(200).json({success: true, token})
    sentTokenResponse(user, 200, res)
};

//@desc     Get current Logged in user
//@route    POST/api/v1/auth/me
//@access   Private
exports.getMe = async (req,res,next) => {
    //console.log(req.user.id);
    const user = await User.findById(req.user.id);
    res.status(200).json({success: true, data: user});
};

const sentTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if(process.env.MODE_ENV === "production") {
        options.secure = true
    }

    res.status(statusCode).cookie("token", token, options).json({success: true, token: token});

}