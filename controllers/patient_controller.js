const Patient = require('../models/patients_model')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const nodemailer = require('nodemailer')
require("dotenv").config()


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
        const { username, password } = req.body;
        const patient = await Patient.findOne({ id: username });

        if (patient) {
            const isPasswordMatch = await bcrypt.compare(password, patient.password);

            if (isPasswordMatch) {
                const is_admin = patient.administrator || false;
                const _id = patient._id;
                const email = patient.email;
                const token_user = {
                    username: patient.id,
                    id: _id,
                };
                const token = jwt.sign(token_user, process.env.TOKEN_SECRET);
                const login_time = new Date();
                req.session.login_time = login_time;
                req.session.userId = patient.id;

                const logPath = "log.txt";
                const logEntry = `User: ${username} log in at ${login_time}\n`;

                fs.appendFile(logPath, logEntry, (err) => {
                    if (err) {
                        console.error("Error appending to log file:", err);
                        res.status(500).json({ success: false, error: "Error appending to log file" });
                    } else {
                        console.log("Login entry appended successfully");

                        send_login_email(email);

                        res.json({ success: true, token, is_admin, _id });
                    }
                });
            } else {
                res.json({ success: false });
            }
        } else {
            res.json({ success: false });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

const send_login_email = async (userEmail) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure:true,
            auth: {
                user: process.env.MAIL,
                pass: process.env.MAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.MAIL,
            to: userEmail,
            subject: 'Successful login',
            text: 'You have login at Heiditas',
        };

        await transporter.sendMail(mailOptions);
        console.log('Login mail sent successfully');
    } catch (error) {
        console.error('Error while sending mail', error);
    }
};


const logout = asyncHandler(async (req, res) => {
        try {
            if (req.session) {
                const logout_time = new Date();
                const sessionDuration = logout_time - req.session.login_time;
                const logPath = "log.txt";
            console.log(req.session.login_time, );
            const logEntry = `Log out ${req.session.userId} at ${logout_time}. with a duration of ${sessionDuration} milliseconds\n`;      
            fs.appendFile(logPath, logEntry, (err) => {
                if (err) {
                    console.error("Error appending to log file:", err);
                } else {
                    console.log("Logout entry appended successfully");
                    req.session.destroy((err) => {
                        if (err) {
                            console.error("Error destroying session:", err);
                            res.status(500).json({ success: false, error: "Internal Server Error" });
                        } else {
                            res.status(200).json({ success: true, message: "Logout successful" });
                        }
                    });
                }
            });
                
              } else {
                console.error('No session found');
              }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    })

module.exports ={
    get_patients,
    get_patient_by_id,
    add_patient,
    update_patient,
    delete_patient,
    login,
    logout,  
}   