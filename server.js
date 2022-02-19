const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const hospitals = require("./routes/hospitals");
const auth = require("./routes/auth");
const connectDB = require("./config/db");

dotenv.config({path: './config/config.env'});
//connect to database
connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());

// app.get("/", (req,res) => {
//     res.send('<h1>Hello from express</h1>');
//     res.send({name: "Brad"});
//     res.json({name: "Brad"});
//     res.sendStatus(400);
//     res.status(400).jason({success: false});
//     res.status(200).json({success: true, data: {id:1}});
// });

app.use("/api/v1/hospitals", hospitals); // match incoming url with router
app.use("/api/v1/auth", auth)

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, console.log("Server running in ", process.env.NODE_ENV, "mode on port ", PORT))

//handle unhandled promise rejections
process.on("unhandledRejection", function(err, promise) {
    console.log(`Error: ${err, promise}`);
    server.close(function(){
        process.exit(1)
    });
});