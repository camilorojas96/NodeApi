require("dotenv").config()
const express = require("express")
const mongoose =require("mongoose")
const patient_route = require('./routes/patient_route')

const app = express()

const MONGO_URL = process.env.MONGO_URL
const PORT = process.env.PORT || 3000

app.use(express.json())

//routes

app.use('/api/patients', patient_route)

app.get('/', (req,res) => {
    res.send("Node Blog")
})



mongoose.connect(MONGO_URL)
.then(()=>{
    app.listen(PORT, ()=>{
        console.log('Node Api running on port 3000')
    })
    console.log("Connection Successful")
}).catch((error)=>{
    console.log(error)
})
