require("dotenv").config()
const express = require("express")
const mongoose =require("mongoose")
const patient_route = require('./routes/patient_route')
const error_middleware = require('./middleware/error_middleware')
const Patient = require('./models/patients_model')
var cors = require("cors")
const app = express()
const MONGO_URL = process.env.MONGO_URL
const PORT = process.env.PORT || 3000
const session = require('express-session')





app.use(cors())
app.use(express.json())

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}))


//routes

app.use('/api/patients', patient_route)
app.use(error_middleware)




mongoose.connect(MONGO_URL)
.then(()=>{
    app.listen(PORT, ()=>{
        console.log('Node Api running on port 3000')
    })
    console.log("Connection Successful")
}).catch((error)=>{
    console.log(error)
})
