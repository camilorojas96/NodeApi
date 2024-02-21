const Patient = require('../models/patients_model')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const fs = require('fs')


const  get_patients =  asyncHandler(async(req,res)=>{
    try {
        const patients = await Patient.find({})
        res.status(200).json(patients)

    } catch (error) {
        res.status(500);
        throw new Error(error.message)
        
    }
})

const get_patient_by_id = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const patient = await Patient.findById(id)
        
        if (!patient) {
            return res.status(404).json({ message: `Cannot find the patient with id: ${id}` })
        }

        res.status(200).json(patient)
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
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
                token_user = {
                    username: patient.id,
                    id: _id,
                };
                const token = jwt.sign(token_user, process.env.TOKEN_SECRET)
                const login_time = new Date()
                fs.unlink("log.txt", (err)=>{
                    if(err && err.code !== "ENOENT"){
                    console.log(err)
                }else{
                    console.log("Previous log deleted")

                    fs.writeFile("log.txt",`User log in ${username} at ${login_time}\n`, (err)=>{
                        if (err){
                            console.log(err)
                        } else {
                            console.log("Log has been created successfully")
                        }
                    })
                }
                })
                res.json({ success: true, token,is_admin, _id })
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

const logout = asyncHandler(async (req, res) => {
    const logoutTime = new Date();
    const sessionDuration = logoutTime - req.session.loginTime;

    fs.appendFileSync('log.txt', `Log out ${req.session.userId} at ${logoutTime}. with a duration of ${sessionDuration} milliseconds\n`);

  
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
            res.status(500).json({ success: false, error: "Internal Server Error" });
        } else {
            res.status(200).json({ success: true, message: "Logout successful" });
        }
    });
});


module.exports ={
    get_patients,
    get_patient_by_id,
    add_patient,
    update_patient,
    delete_patient,
    login,
    logout,
    
}   