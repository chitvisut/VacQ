const express = require("express");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp")
const cors = require("cors")
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const hospitals = require("./routes/hospitals");
const appointments = require("./routes/appointments")
const auth = require("./routes/auth");
const connectDB = require("./config/db");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

dotenv.config({path: './config/config.env'});
//connect to database
connectDB();

const swaggerOptions={
    swaggerDefinition:{
        openapi: "3.0.0",
        info: {
            title: "Library API",
            version: "1.0.0",
            description: "A simple Epress VacQ API"
        }
    },
    apis: ["./routes/*.js"],
};

const app = express();
const swaggerDocs = swaggerJsDoc(swaggerOptions)

app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(hpp());
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs))

const limiter = rateLimit({
    windowMs: 1000*60*10, //10 mins
    max: 100
})

app.use(limiter);
app.use(cors());

// app.get("/", (req,res) => {
//     res.send('<h1>Hello from express</h1>');
//     res.send({name: "Brad"});
//     res.json({name: "Brad"});
//     res.sendStatus(400);
//     res.status(400).jason({success: false});
//     res.status(200).json({success: true, data: {id:1}});
// });

app.use("/api/v1/hospitals", hospitals); // match incoming url with router
app.use("/api/v1/appointments", appointments)
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