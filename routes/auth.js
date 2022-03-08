const express = require("express");
const res = require("express/lib/response");
const{register, login, getMe} = require("../controllers/auth");
const{protect} = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);

router.post("/login", login)

// const jwt = require("jsonwebtoken")
// const User = require("../models/User")

router.get("/me", protect, getMe)
// router.get("/me", async function(req, res) {
//     const x = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_SECRET)
//     const user = await User.findById(x.id);
//     res.status(400).json({success:true, user: user})
// })

module.exports=router;