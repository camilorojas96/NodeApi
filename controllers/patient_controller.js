const Patient = require('../models/patients_model')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')


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

const add_patient = asyncHandler(async (req, res) => {
    try {
        const { password, ...otherData } = req.body

       
        const salt = await bcrypt.genSalt(10)

       
        const hashed_password = await bcrypt.hash(password, salt)

        
        const patientData = {
            ...otherData,
            password: hashed_password,
        }


        const patient = await Patient.create(patientData)
        
        res.status(200).json(patient)

    } catch (error) {
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

const login = asyncHandler(async (req, res) => {
    try {
        const { username, password } = req.body
        
      
        const patient = await Patient.findOne({ id: username })

        if (patient) {
        
            const isPasswordMatch = await bcrypt.compare(password, patient.password);

            if (isPasswordMatch) {
                const is_admin = patient.administrator || false
                const _id = patient._id

                res.json({ success: true, is_admin, _id })
            } else {
                res.json({ success: false })
            }
        } else {
            res.json({ success: false })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, error: 'Internal Server Error' })
    }
})

module.exports ={
    get_patients,
    get_patient_by_id,
    add_patient,
    update_patient,
    delete_patient,
    login,
    
}   