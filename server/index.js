require('dotenv').config()
const express = require("express")
//const cors= require('cors');
const mongoose = require("mongoose")
const fileUpload = require('express-fileupload')
const authRouter = require("./routes/auth.routes")
const fileRouter = require("./routes/file.routes")
const usersRouter = require("./routes/users.routes")

const app = express()
const PORT = process.env.PORT || 5000
//const PORT = config.get("serverPort")

const corsMiddleware = require('./middleware/cors.middleware')
const filePathMiddleware = require('./middleware/filepath.middleware')
const path = require ('path')

app.use(express.json())
//app.use(express.static(process.env.staticPath))

if (!process.env.PWD) {
    process.env.PWD = process.cwd();
  }

console.log("PWD = " + process.env.PWD);
app.use(express.static(path.join(process.env.PWD, 'static')))


// const corsOptions ={
//     origin: process.env.CLIENT_URL, 
//     credentials:true,            //access-control-allow-credentials:true
//     optionSuccessStatus:200
// }

// app.use(cors(corsOptions));

app.use(fileUpload({}))
app.use(corsMiddleware)

app.use(filePathMiddleware(path.resolve(__dirname, 'files')))


app.use("/api/auth", authRouter)
app.use("/api/files", fileRouter)
app.use("/api/users", usersRouter)

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        //console.log(process.env.staticPath);
        //console.log(path.join(process.env.PWD, 'static'));


        app.listen(PORT, () => {
            console.log('Server started on port', PORT)
        })
    } catch (error) {
            console.log(error)
    }

}

start()