const express = require("express")
const mongoose =require("mongoose")
const Patient = require('./models/patients_Model')
const app = express()

app.use(express.json())

//routes

app.get('/', (req,res) => {
    res.send("Node Blog")
})

app.get('/patients', async(req,res)=>{
    try {
        const patients = await Patient.find({})
        res.status(200).json(patients)

    } catch (error) {
        res.status(500).json({message: error.message})
        
    }
})

app.post('/patients', async(req,res)=>{

    try{
        const patient = await Patient.create(req.body)
        res.status(200).json(patient)

    } catch (error){
        console.log(error.message)
        res.status(500).json({message: error.message})
    }

})

app.put('/patients/:id', async(req, res)=>{
    try {
        const {id} = req.params
        const patient = await Patient.findByIdAndUpdate(id, req.body)
        if(!patient){
            return res.status(404).json({message: "Cannot find the patient with id: ${id}"})
        }
        const updated_patient = await Patient.findById(id)
        res.status(200).json(updated_patient) 
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.delete('/patients/:id', async(req,res)=>{
    try {
        const {id} = req.params
        const patient = await Patient.findByIdAndDelete(id)
        if(!patient){
            return res.status(404).json({message: "Cannot find the patient with id: ${id}"})
        }
        res.status(200).json(patient)

    } catch (error) {
        res.status(500).json({message: error.message})
        
    }
})

mongoose.connect("mongodb+srv://pcrp1996:Knightwalker123@cluster0.jfbdbnk.mongodb.net/Dental_clinic?retryWrites=true&w=majority")
.then(()=>{
    app.listen(3000, ()=>{
        console.log("Node Api running on port 3000")
    })
    console.log("Connection Successful")
}).catch((error)=>{
    console.log(error)
})

