const Patient = require('../models/patients_model')
const asyncHandler = require('express-async-handler')


const  get_patients =  asyncHandler(async(req,res)=>{
    try {
        const patients = await Patient.find({})
        res.status(200).json(patients)

    } catch (error) {
        res.status(500);
        throw new Error(error.message)
        
    }
})

const get_patient_by_id = asyncHandler(async(req,res)=>{
    try {
        const {id} = req.params
        const patient = await Patient.findById(id)
        res.status(200).json(patient)
    } catch (error) {
        res.status(500)
        throw new Error(error.message)
    }

})

const add_patient = asyncHandler(async(req,res)=>{

    try{
        const patient = await Patient.create(req.body)
        res.status(200).json(patient)

    } catch (error){
        console.log(error.message)
        res.status(500)
        throw new Error(error.message)
    }

})

const update_patient = asyncHandler(async(req, res)=>{
    try {
        const {id} = req.params
        const patient = await Patient.findByIdAndUpdate(id, req.body)
        if(!patient){
            return res.status(404).json({message: `Cannot find the patient with id: ${id}`})
        }
        const updated_patient = await Patient.findById(id)
        res.status(200).json(updated_patient) 
    } catch (error) {
        res.status(500)
        throw new Error(error.message)
    }
})

const delete_patient = asyncHandler(async(req,res)=>{
    try {
        const {id} = req.params
        const patient = await Patient.findByIdAndDelete(id)
        if(!patient){
            res.status(404)
            throw new Error(`Cannot find the patient with id: ${id}`)
        }
        res.status(200).json(patient)

    } catch (error) {
        res.status(500)
        throw new Error(error.message)
        
    }
})

module.exports ={
    get_patients,
    get_patient_by_id,
    add_patient,
    update_patient,
    delete_patient
}   