const express = require('express')
const Patient = require('../models/patients_model')
const router = express.Router()

router.get('/', async(req,res)=>{
    try {
        const patients = await Patient.find({})
        res.status(200).json(patients)

    } catch (error) {
        res.status(500).json({message: error.message})
        
    }
})

router.get('/id', async(req,res)=>{
    try {
        const {id} = req.params
        const patient = await Patient.findById(id)
        res.status(200).json(patient)
    } catch (error) {
        res.status(500).json({message: error.message}) 
    }

})

router.post('/', async(req,res)=>{

    try{
        const patient = await Patient.create(req.body)
        res.status(200).json(patient)

    } catch (error){
        console.log(error.message)
        res.status(500).json({message: error.message})
    }

})

router.put('/:id', async(req, res)=>{
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

router.delete('/:id', async(req,res)=>{
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

module.exports = router