const app = require("../functions/app")

const PORT = process.env.PORT || 2000


app.listen(PORT, ()=>console.log("server is running on port " + PORT))






// import express, {Request, Response } from "express";
// import dataDir from "./utilities/dataDir";
// import mongoose from "mongoose";
//
// const bodyParser = require("body-parser")
// const cors = require("cors")
// const {readdir} = require("fs/promises")
// const passport = require('passport');
//
// require('dotenv').config()
//
// // import dbConnect from "./database";
//
// // passport config initial...
// require('./passport/google.js')
// require('./passport/facebook.js')
//
// const app = express()
// app.use(express.static(`${dataDir}/public`))
// app.use("/upload/", express.static(`${dataDir}/upload/`))
// app.use("/static/upload/", express.static(`${dataDir}/upload/`))
// app.use("/images/", express.static(`${dataDir}/images/`))
// app.use("/ui-data/", express.static(`${dataDir}/ui-data/`))
//
//
// const isDev = process.env.NODE_ENV === "development"
//
// // app.use(session({
// //   resave: false,
// //   saveUninitialized: true,
// //   secret: 'SECRET'
// // }));
//
// const allowedOrigin = ["http://localhost:4000", "http://localhost:3000"]
//
// app.use(cors())
//
// // app.use(cors({
// //   origin: (origin, cb)=>{
// //     if(allowedOrigin.indexOf(origin) !== -1){
// //       cb(null, true)
// //     } else{
// //       cb(new Error("You are Blocked"))
// //     }
// //   }
// // }))
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({extended: true}))
// // const db = require("./db.json")
//
//
// import routes from "./routes"
//
//
// app.use((req, res, next)=>{
//     console.log(req.url, req.method);
//     next()
// })
//
//
// passport.initialize()
// // app.use(passport.session());
//
//
// routes(app)
//
// app.get("/api/static-file", (req, res)=>{
//   readdir('upload').then(doc=>{
//     // console.log(doc)
//     res.send(doc)
//   })
// })
//
//
// // error handler
// app.use((err, req, res, next)=>{
//   res.status(err.status || 500).json({
//     status: err.status || 500,
//     message: err.message || "Internal server error"
//   })
// })
//
//
// // mongoose.connect(isDev
// //     ? "mongodb://127.0.0.1:27017/digital-store"
// //     : process.env.MONGODB_URL
// //   ).then(()=>{
// //     console.log("mongodb connected...");
// //   })
// //   .catch(err=>{
// //     console.log(err);
// //   })
//
//
//
// app.listen(3001, ()=>console.log("server is running on port 3001"))